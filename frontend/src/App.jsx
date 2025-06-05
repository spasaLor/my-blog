import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";

export default function App(){
    const [role,setRole] = useState('');

    useEffect(()=>{
        const getMe = async()=>{
            try {
                const res = await fetch(import.meta.env.VITE_BACKEND_URL+"/me",{headers:{Authorization:'bearer '+localStorage.getItem('token')}})
                const data = await res.json();
                setRole(data.role);
            } catch (error) {
                setRole('visitor');
            }
        }
        getMe();
    },[])

    return(
        <>
            <Navbar role={role}/>
            <Outlet context={role}/>
        </>
    );
}
