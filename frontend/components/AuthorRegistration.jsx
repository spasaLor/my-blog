import { useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function AuthorRegistration(){
    const [err,setErr]=useState([]);
    const formRef=useRef(null);
    const nav=useNavigate();
    const role=useOutletContext();

    const handleFormSubmit = async(e)=>{
        e.preventDefault();
        const formData = new FormData(formRef.current);
        const res = await fetch(import.meta.env.VITE_BACKEND_URL+"/authors/register",{
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
        const json=await res.json();
        if(!res.ok){
            setErr(json.errors);
        console.log(json);}
        else
            nav(json.redirect);        
    }

    return(
        role !=='visitor' ? 
        <main>
            <div className="author-form-container" >
                <div className="top-row" style={{marginBottom: "-20px"}}>
                    <h2 style={{textAlign: "center", textTransform: "none"}}>Become an <b style={{"color": "var(--color-primary)"}}>author</b> of</h2>
                    <img src="/logo.png" alt=""/>
                </div>
                <form ref={formRef} onSubmit={handleFormSubmit}>
                    {err && <div className="errors"> {err.map((item,id)=>(<p key={id}>{item.message || item.msg}</p>))} </div> }
                    <div className="form-item">
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" id="name" required/>
                    </div>
                    <div className="form-item">
                        <label htmlFor="surname">Surname</label>
                        <input type="text" name="surname" id="surname" required/>
                    </div>
                    <div className="form-item">
                        <label htmlFor="img">Profile Picture</label>
                        <input type="text" name="img" id="img" placeholder="image link"/>
                    </div>
                    <div className="form-item">
                        <label htmlFor="bio">Tell us a bit about yourself</label>
                        <textarea name="bio" id="bio" rows="5" required></textarea>
                    </div>
                    <button type="submit">Register</button>
                </form>
            </div>
        </main>
        :
        nav("/login")
    );
}