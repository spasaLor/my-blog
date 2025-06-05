import { useState } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import '../src/loginRes.css';

export default function UserLogin(){
    const formRef = useRef(null);
    const [err,setErr] = useState();
    const navigate = useNavigate();

    const loginForm = async(e)=>{
        e.preventDefault();
        console.log(import.meta.env);
        const formData = new FormData(formRef.current);
        const res = await fetch(import.meta.env.VITE_BACKEND_URL+"/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify({username:formData.get('username'),password:formData.get('password')})
        });
        const json = await res.json();

        if(!res.ok)
            setErr(json.error)
        else{
            localStorage.setItem('token',json.accessToken);
            navigate(json.redirect);
        }
    }

    return(
        <>
            <div className="login-form-container">
                <div className="top-row">
                    <img src="logo.png" alt=""/>
                    <h2>Login</h2>
                </div>
                {err && <div className="errors"> <p>{err}</p></div> }
                <form id="loginForm" onSubmit={loginForm} ref={formRef} className="login-res-form">
                    <div className="form-item"><label htmlFor="username">Username</label><input type="text" name="username" id="username" required/></div>
                    <div className="form-item"><label htmlFor="password">Password</label><input type="password" name="password" id="password" required/></div>
                    <button type="submit">enter</button>
                </form>
            </div>
        </>
    );
}