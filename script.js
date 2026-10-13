(() => {
  const storage={set(k,v){try{sessionStorage.setItem(k,v)}catch(_){}},get(k){try{return sessionStorage.getItem(k)||''}catch(_){return''}}};
  const preview=location.hostname.endsWith('chatgpt.site')||location.protocol==='file:';
  const destination=form=>preview&&form.dataset.localAction?form.dataset.localAction:form.action;
  const releaseFocus=()=>{const active=document.activeElement;if(active&&typeof active.blur==='function')active.blur()};

  const addressForm=document.querySelector('.address-form');
  if(addressForm)addressForm.addEventListener('submit',event=>{event.preventDefault();const address=document.getElementById('tour-address').value.trim();if(!address)return;releaseFocus();storage.set('otTourAddress',address);location.href=destination(addressForm)});

  const emailForm=document.querySelector('.email-form');
  if(emailForm)emailForm.addEventListener('submit',event=>{event.preventDefault();const email=document.getElementById('auth-email').value.trim();if(!email)return;releaseFocus();storage.set('otAccountEmail',email);location.href=destination(emailForm)});

  const accountEmail=document.getElementById('create-email'),savedEmail=storage.get('otAccountEmail');
  if(accountEmail&&savedEmail)accountEmail.value=savedEmail;

  const toggle=document.querySelector('.password-toggle'),password=document.getElementById('create-password');
  if(toggle&&password)toggle.addEventListener('click',()=>{const showing=password.type==='text';password.type=showing?'password':'text';toggle.setAttribute('aria-pressed',String(!showing));toggle.setAttribute('aria-label',showing?'Show password':'Hide password')});

  const createForm=document.querySelector('.create-form');
  if(createForm)createForm.addEventListener('submit',async event=>{
    event.preventDefault();releaseFocus();
    const next=destination(createForm);
    if(preview){location.href=next;return}
    const button=createForm.querySelector('button[type="submit"]'),status=createForm.querySelector('.form-status');
    const original=button.innerHTML;button.disabled=true;button.textContent='Finishing registration…';status.textContent='';
    const payload={
      address:storage.get('otTourAddress'),
      email:document.getElementById('create-email').value.trim(),
      full_name:document.getElementById('create-name').value.trim(),
      password:document.getElementById('create-password').value,
      phone:document.getElementById('create-phone').value.trim(),
      marketing:createForm.elements.marketing.checked,
      website:createForm.elements.website.value
    };
    try{
      const response=await fetch('/api/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      const result=await response.json().catch(()=>({}));
      if(!response.ok)throw new Error(result.message||'We could not complete your registration. Please try again.');
      location.href=next;
    }catch(error){status.textContent=error.message;button.disabled=false;button.innerHTML=original}
  });

  const successAddress=document.getElementById('success-address'),address=storage.get('otTourAddress');
  if(successAddress&&address)successAddress.textContent=address;
})();
