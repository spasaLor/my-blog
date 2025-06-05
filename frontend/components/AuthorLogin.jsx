import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthorLogin(){
    const formRef=useRef(null);
    const nav = useNavigate();
    const [errors,setErrors]=useState([]);

    const handleSubmit = async(e)=>{
        e.preventDefault();
        const formData = new FormData(formRef.current);
        const res = await fetch(import.meta.env.VITE_BACKEND_URL+"/authors/login",{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({username:formData.get('username'),password:formData.get('password')})
        });
        const json = await res.json();
        if(res.ok){
            localStorage.setItem('token',json.token);
            localStorage.setItem('user',json.user);
            nav(json.redirect);
        }
        else
            setErrors(json.errors);
    }
    return(
        <div className="login-form-container">
            <div className="top-row">
                <img src="/logo.png" alt=""/>
                <h2 style={{textTransform: "none"}}>Login as <h2 style={{color:"var(--color-warn)",display:"inline"}}>author</h2></h2>
            </div>
            {errors && <div className="errors"> {errors.map(item=>( <p className="error">{item.message}</p> ))} </div> }
            <form ref={formRef} onSubmit={handleSubmit} className="login-res-form">
                <div className="form-item">
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" id="username" required/>
                </div>
                <div className="form-item">
                    <label htmlFor="pwd">Password</label>
                    <input type="password" name="password" id="pwd" required/>
                </div>
                <button type="submit">Enter</button>
            </form>
        </div>
    );
}