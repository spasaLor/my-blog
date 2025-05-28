const send = document.querySelector('button');

send.addEventListener('click',async()=>{
    const form = document.getElementById('loginForm');
    const formData = new FormData(form);
    const errorDiv=document.querySelector('.errors');

    const res = await fetch("/login",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify({username:formData.get('username'),password:formData.get('password')})
    });
    
    const json = await res.json();
    if(!res.ok){
        errorDiv.innerHTML="";
        const err = document.createElement('p');
        err.classList.add('error');
        err.textContent=json.error;
        errorDiv.append(err);
    }else{
        localStorage.setItem('token',json.accessToken);
        window.location.href=json.redirect;
    }
})