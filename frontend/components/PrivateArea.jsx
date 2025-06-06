import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export default function PrivateArea(){
    const [active,setActive]=useState('new');
    const nav = useNavigate();
    const [posts,setPosts]=useState([]);

    useEffect(()=>{
        const fetchPosts = async()=>{
            try {
                const res = await fetch(import.meta.env.VITE_BACKEND_URL+"/authors/all_from_author",{
                    headers:{authorization: 'bearer '+localStorage.getItem('token')}
                });
                const json = await res.json();
                json.posts.forEach(item=>{
                    if(item.published_at){
                        let date = new Date(item.published_at);
                        date=date.toLocaleString();
                        item.published_at=date;
                    }else{
                        let date = new Date(item.created_at);
                        date=date.toLocaleString();
                        item.created_at=date;
                    }
                })
                if(res.ok)
                    setPosts(json.posts);
            } catch (error) {
                nav("/");
            }
            
        }
        fetchPosts();
    },[]);

    const newClick = ()=>{
        setActive('new');
        nav("new_post");
    }
    const allClick = ()=>{
        setActive('all');
        nav("all_posts");
    }
    const unpClick = ()=>{
        setActive('unpublished');
        nav("unpublished_posts");
    }

    const handleLogout = async(e)=>{
        e.preventDefault();
        const res=await fetch(import.meta.env.VITE_BACKEND_URL+"/logout");
        if(res.ok){
            const json = await res.json();
            localStorage.clear();
            nav("/login");
        }
        else{
            console.log("Error");
        }
    }

    return(
        <>
            <nav className="personal">
                <div className="nav-container">
                    <div className="logo"><img src='/logo.png' alt=''/></div>
                    <div className="right">
                        <button id="logout" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </nav>
            <div className="greeting">
                <h2>Welcome to your personal area, {localStorage.getItem('user')}</h2>
                <i>From here you can manage your posts</i>
            </div>
            <div className="selection">
                <button type="button" className={active === 'new' ? "active":""} onClick={newClick}>New Post</button>
                <button type="button" className={active === 'all' ? "active":""} onClick={allClick}>All Posts</button>
                <button type="button" className={active === 'unpublished' ? "active":""} onClick={unpClick}>Unpublished</button>
            </div>
            <div className="personal-posts-container">
                <Outlet context={posts}/>
            </div>
        </>
        
    );
}