const form = document.querySelector('form');
const btn = document.querySelector('button');
const errors = document.querySelector('.errors');

btn.addEventListener('click',async()=>{
    const formData = new FormData(form);
    const res = await fetch("/authors/register",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"bearer "+localStorage.getItem('token')
        },
        body: JSON.stringify({
            name:formData.get('name'),
            surname:formData.get('surname'),
            img:formData.get('img'),
            bio:formData.get('bio')
        })
    });

    if(res.ok)
        window.location.href("/login_writer");
    else{
        const json = await res.json();
        json.errors.forEach(err => {
            errors.innerHTML="";
            const div = document.createElement('div');
            div.classList.add('error');
            div.innerHTML= "<p>"+err.msg+"</p>"
            errors.append(div);
        });
    }
})