const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

function isAuthorized(req) {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const cookies = req.headers.cookie || '';
  const match = cookies.match(/(?:^|;\\s*)lz_admin=([^;]+)/);
  if (!match) return false;
  const parts = decodeURIComponent(match[1]).split('.');
  if (parts.length !== 2) return false;
  const expires = Number(parts[0]);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;
  const expected = require('crypto').createHmac('sha256', password).update(String(expires)).digest('hex');
  return parts[1] === expected;
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized.' });
      const orders = await sql`
        SELECT
          o.id,
          o.order_number,
          o.subtotal,
          o.total,
          o.payment_method,
          o.status,
          o.created_at,
          c.name,
          c.email,
          c.phone,
          c.address,
          c.city,
          c.postal_code
        FROM orders o
        LEFT JOIN customers c ON c.id = o.customer_id
        ORDER BY o.created_at DESC
      `;

      const items = await sql`
        SELECT
          oi.order_id,
          oi.product_name,
          oi.size,
          oi.type,
          oi.quantity,
          oi.unit_price,
          oi.total
        FROM order_items oi
        ORDER BY oi.order_id DESC, oi.id ASC
      `;

      return res.status(200).json({ orders, items });
    }

    if (req.method === 'PATCH') {
      if (!isAuthorized(req)) return res.status(401).json({ error: 'Unauthorized.' });
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const orderId = Number(body?.orderId);
      const status = body?.status;
      const allowedStatuses = ['Pending', 'Processing', 'Delivered', 'Cancelled'];

      if (!Number.isInteger(orderId) || !allowedStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid order status update.' });
      }

      const rows = await sql`
        UPDATE orders
        SET status = ${status}
        WHERE id = ${orderId}
        RETURNING id, order_number, status
      `;

      if (!rows.length) return res.status(404).json({ error: 'Order not found.' });
      return res.status(200).json({ success: true, order: rows[0] });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const customer = body?.customer || {};
      const items = Array.isArray(body?.items) ? body.items : [];

      if (!items.length) {
        return res.status(400).json({ error: 'Order must contain at least one item.' });
      }

      const orderId = body.id || `LZ-${Date.now().toString().slice(-8)}`;
      const subtotal = Number(body.subtotal || 0);
      const total = Number(body.total || subtotal);

      const customerRows = await sql`
        INSERT INTO customers (name, email, phone, address, city, postal_code)
        VALUES (
          ${[customer.firstName, customer.lastName].filter(Boolean).join(' ') || 'Guest'},
          ${customer.email || null},
          ${customer.phone || null},
          ${customer.address || null},
          ${customer.city || null},
          ${customer.postalCode || null}
        )
        RETURNING id
      `;

      const customerId = customerRows[0].id;

      const orderRows = await sql`
        INSERT INTO orders (
          order_number, customer_id, subtotal, total, payment_method, status, created_at
        )
        VALUES (
          ${orderId},
          ${customerId},
          ${subtotal},
          ${total},
          ${body.paymentMethod || 'Demo / not connected'},
          ${body.status || 'Pending'},
          ${body.createdAt ? new Date(body.createdAt) : new Date()}
        )
        RETURNING id, order_number
      `;

      for (const item of items) {
        const quantity = Number(item.quantity || 1);
        const unitPrice = Number(item.price || 0);
        await sql`
          INSERT INTO order_items (
            order_id, product_name, size, type, quantity, unit_price, total
          )
          VALUES (
            ${orderRows[0].id},
            ${item.product || 'Product'},
            ${item.size || null},
            ${item.type || null},
            ${quantity},
            ${unitPrice},
            ${unitPrice * quantity}
          )
        `;
      }

      return res.status(201).json({ success: true, orderId: orderRows[0].order_number });
    }

    res.setHeader('Allow', 'GET, POST, PATCH');
    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Database operation failed.' });
  }
};
