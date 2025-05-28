const btn = document.querySelector('button');
const form = document.querySelector('form');
const errContainer = document.querySelector('.errors');

btn.addEventListener('click',async()=>{
    const formData=new FormData(form);
    const res = await fetch("/authors/login",{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({username:formData.get('username'),password:formData.get('password')})
    })
    const json = await res.json();
    if(!res.ok){
        json.errors.forEach(err => {
            errContainer.innerHTML="";
            const div = document.createElement('div');
            div.classList.add('error');
            div.innerHTML= "<p>"+err.message+"</p>"
            errContainer.append(div);
        });
    }
    else{
        localStorage.setItem('token',json.token);
        localStorage.setItem('user',json.user);
        window.location.href=json.redirect;
    }
})