const cart = JSON.parse(localStorage.getItem('leZanneCart') || '[]');
const itemsEl = document.getElementById('checkout-items');
const subtotalEl = document.getElementById('checkout-subtotal');
const totalEl = document.getElementById('checkout-total');
const deliveryEl = document.getElementById('checkout-delivery');
const freeShippingNoteEl = document.getElementById('free-shipping-note');
const form = document.getElementById('checkout-form');
const success = document.getElementById('order-success');

const subtotal = cart.reduce((sum,item)=>sum + Number(item.price || 0) * Number(item.quantity || 1),0);
const delivery = subtotal >= 50 ? 0 : 3.5;
const total = subtotal + delivery;
if(!cart.length){
  itemsEl.innerHTML='<p class="summary-empty">Your bag is empty. Return to the collection to choose a fragrance.</p>';
}else{
  itemsEl.innerHTML=cart.map(item=>`<article class="summary-item"><h3>${item.product}</h3><p>${item.size} · ${item.type} · Qty ${item.quantity}</p><strong>${Number(item.price)*Number(item.quantity)}€</strong></article>`).join('');
}
deliveryEl.textContent=delivery === 0 ? 'Δωρεάν' : '3,50€';
freeShippingNoteEl.textContent = subtotal >= 50 ? 'Έχεις δωρεάν μεταφορικά!' : 'Δωρεάν μεταφορικά για παραγγελίες άνω των 50€';
subtotalEl.textContent=`${subtotal.toFixed(2).replace('.',',')}€`;
totalEl.textContent=`${total.toFixed(2).replace('.',',')}€`;

form.addEventListener('submit',async(event)=>{
  event.preventDefault();
  if(!cart.length){ alert('Your bag is empty.'); return; }

  const data=Object.fromEntries(new FormData(form).entries());
  const order={
    id:`LZ-${Date.now().toString().slice(-8)}`,
    customer:data,
    items:cart,
    subtotal,
    total,
    paymentMethod:'Demo / not connected',
    status:'Pending',
    createdAt:new Date().toISOString()
  };

  const submitButton=form.querySelector('button[type="submit"], input[type="submit"]');
  if(submitButton) submitButton.disabled=true;

  try{
    const response=await fetch('/api/orders',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(order)
    });

    const result=await response.json().catch(()=>({}));
    if(!response.ok){
      throw new Error(result.error || 'Could not save the order.');
    }

    localStorage.setItem('leZanneLastOrder',JSON.stringify(order));
    localStorage.removeItem('leZanneCart');
    success.hidden=false;
  }catch(error){
    console.error(error);
    alert('Η παραγγελία δεν αποθηκεύτηκε. Παρακαλώ δοκιμάστε ξανά.');
    if(submitButton) submitButton.disabled=false;
  }
});
