import { useNavigate, Link } from "react-router-dom";

export default function Navbar({role}){
    const navigate = useNavigate();

    const handleLogout = async(e)=>{
        e.preventDefault();
        const res=await fetch(import.meta.env.VITE_BACKEND_URL+"/logout");
        if(res.ok){
            const json = await res.json();
            localStorage.clear();
            navigate("/login");
        }
        else{
            console.log("Error");
        }
    }

    return(
        (role === 'visitor' ? <nav> <div className="nav-container"> <Link to='/'><img src='/logo.png' alt=''/></Link><div className='right'><Link to='/login'>Log In</Link><Link to='/register'>Sign Up</Link> </div> </div> </nav> : 
         role === 'user' ? <nav> <div className="nav-container"> <Link to='/'><img src='/logo.png' alt=''/></Link><div className='right'><Link to='author_signup' id='become'>author signup</Link><button type="button" onClick={handleLogout} id='logout'>Logout</button></div> </div></nav> :
         <nav> <div className="nav-container"> <Link to='/'><img src='/logo.png' alt=''/></Link><div className='right'><a href='/login_author' id='login'>author login</a><button type="button" onClick={handleLogout} id='logout'>Logout</button></div> </div></nav>
        )
        
    );
}