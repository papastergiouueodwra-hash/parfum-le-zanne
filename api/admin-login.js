const crypto = require('crypto');

function createToken(password) {
  const expires = Date.now() + 1000 * 60 * 60 * 12;
  const payload = String(expires);
  const signature = crypto.createHmac('sha256', password).update(payload).digest('hex');
  return `${payload}.${signature}`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return res.status(500).json({ error: 'Admin password is not configured.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!body?.password || body.password !== password) {
      return res.status(401).json({ error: 'Invalid password.' });
    }

    const token = createToken(password);
    res.setHeader('Set-Cookie', `lz_admin=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=43200`);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(400).json({ error: 'Invalid request.' });
  }
};
