import { useRef, useState } from 'react';
import '../src/loginRes.css';
import { useNavigate } from 'react-router-dom';

export default function UserRegistration(){
    const formRef= useRef(null);
    const [err,setErr]=useState([]);
    const navigate = useNavigate();

    const handleReg = async(e)=>{
        e.preventDefault();
        const formData = new FormData(formRef.current);
        const res = await fetch(import.meta.env.VITE_BACKEND_URL+"/register",{
            method:"POST",
            headers:{"content-type":"application/json"},
            body: JSON.stringify({username:formData.get("username"),password:formData.get("password")})
        });
        const json=await res.json();
        console.log(json);
        if(!res.ok)
            setErr(json.errors);

        else{
            navigate(json.redirect);
        }
    }

    return(
        <div className="login-form-container">
                <div className="top-row">
                    <img src="logo.png" alt=""/>
                    <h2>Register</h2>
                </div>
            {err.length>0 && <div className="errors"> {
                err.map((item,id)=>(<p key={id}>{item.message || item.msg}</p>))
                } </div> }
            <form onSubmit={handleReg} ref={formRef} className='login-res-form'>
                <div className="form-item"><label htmlFor="username">Username</label><input type="text" name="username" id="username" required/></div>
                <div className="form-item"><label htmlFor="password">Password</label><input type="password" name="password" id="password" required/></div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}