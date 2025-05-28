const body = document.querySelector('main');
const become = document.getElementById('become');
const cont = document.querySelector('.nav-container');

const updateNav = async()=>{
    try {
        const res = await fetch("/me",{headers:{Authorization:'bearer '+localStorage.getItem('token')}})
        const data = await res.json();
        if(data.role === "user")
            userNav();
    } catch (error) {
        visitorNav();
    }
}

const visitorNav = ()=>{
    cont.innerHTML=""+"<a href='/blog'><img src='/imgs/logo.png' alt=''></a><div class='right'><a href='/login'>Log In</a><a href='/register'>Sign Up</a> </div>";
}

const userNav = ()=>{
    cont.innerHTML= ""+" <a href='/blog'><img src='/imgs/logo.png' alt=''></a><div class='right'><a href='/login_writer' id='login'>author login</a><a href='/register_writer' id='become'>author signup</a><a href='/logout' id='logout'>Logout</a></div>";
    const logout = document.getElementById('logout');
    logout.addEventListener('click',async(e)=>{
        e.preventDefault();
        const res=await fetch("/logout");
        if(res.ok){
            const json = await res.json();
            localStorage.removeItem('token');
            window.location.href=json.redirect;
        }
        else{
            console.log("Error");
        }
    });
}
visitorNav();
document.addEventListener('DOMContentLoaded',updateNav);