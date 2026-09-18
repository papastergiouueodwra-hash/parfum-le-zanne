const cart = JSON.parse(localStorage.getItem('leZanneCart') || '[]');
const itemsEl = document.getElementById('checkout-items');
const subtotalEl = document.getElementById('checkout-subtotal');
const totalEl = document.getElementById('checkout-total');
const form = document.getElementById('checkout-form');
const success = document.getElementById('order-success');

const subtotal = cart.reduce((sum,item)=>sum + Number(item.price || 0) * Number(item.quantity || 1),0);
if(!cart.length){
  itemsEl.innerHTML='<p class="summary-empty">Your bag is empty. Return to the collection to choose a fragrance.</p>';
}else{
  itemsEl.innerHTML=cart.map(item=>`<article class="summary-item"><h3>${item.product}</h3><p>${item.size} · ${item.type} · Qty ${item.quantity}</p><strong>${Number(item.price)*Number(item.quantity)}€</strong></article>`).join('');
}
subtotalEl.textContent=`${subtotal}€`;
totalEl.textContent=`${subtotal}€`;

form.addEventListener('submit',(event)=>{
  event.preventDefault();
  if(!cart.length){ alert('Your bag is empty.'); return; }
  const data=Object.fromEntries(new FormData(form).entries());
  const order={id:`LZ-${Date.now().toString().slice(-8)}`,customer:data,items:cart,subtotal,total:subtotal,paymentMethod:'Demo / not connected',status:'Pending',createdAt:new Date().toISOString()};
  const orders=JSON.parse(localStorage.getItem('leZanneOrders')||'[]');
  orders.unshift(order);
  localStorage.setItem('leZanneOrders',JSON.stringify(orders));
  localStorage.setItem('leZanneLastOrder',JSON.stringify(order));
  success.hidden=false;
  localStorage.removeItem('leZanneCart');
});
