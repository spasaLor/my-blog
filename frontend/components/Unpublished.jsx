import { useNavigate } from "react-router-dom";
import NewPost from "./NewPost";
import { useEffect, useState } from "react";

export default function Unpublished(){
    const [posts,setPosts]=useState([]);
    const nav=useNavigate();
    const [toEdit,setToEdit]=useState(null);

    useEffect(()=>{
        const fetchPosts =async()=>{
            const res = await fetch(import.meta.env.VITE_BACKEND_URL+"/authors/all_unpublished_from_author",
                {headers:{authorization:"bearer "+localStorage.getItem('token')}}
            );
            const json = await res.json();
            if(res.ok){
                json.posts.forEach(item=>{
                    const d = new Date(item.created_at);
                    const date = d.toLocaleString();
                    item.created_at = date;
                })
                setPosts(json.posts);
            }
                
        }
        fetchPosts();
    })


    const publishPost = async(id)=>{
        const res = await fetch(import.meta.env.VITE_BACKEND_URL+"/authors/publish",
            {method:'PUT',headers:{authorization:"bearer "+localStorage.getItem('token'), "content-type":"application/json"},
            body: JSON.stringify({postId:id})
        });
        const json = await res.json();
        if(!res.ok)
            console.log(json.message);
        nav(0);
    }

    const editPost = async(id,title,img,content)=>{
        setToEdit({id,title,img,content});
    }

    const deletePost = async(id)=>{
        const res = await fetch(import.meta.env.VITE_BACKEND_URL+"/authors/delete_post",{
            method:"DELETE",
            headers:{authorization:"bearer "+localStorage.getItem('token'), "content-type":"application/json"},
            body:JSON.stringify({postId:id})
        });
        if(!res.ok)
            console.log(json.message);
        nav(0);
    }

    return(
            toEdit ? <NewPost postId={toEdit.id} title={toEdit.title} img={toEdit.img} content={toEdit.content}/> :
            <div className="personal-allPosts">
                {posts && posts.map(item=>(
                    <div className="personal-post-item" key={item.id}>
                        <h2 className="title">{item.title}</h2> 
                        <div className="post-info">
                            <p>Saved: {item.created_at}</p>
                            <div className="btns">
                                <button style={{color: "var(--color-primary)"}}onClick={()=>publishPost(item.id)}>Publish</button>
                                <button style={{color: "var(--color-warn)"}} onClick={()=>editPost(item.id,item.title,item.img,item.content)}>Edit</button>
                                <button style={{color: "var(--color-error)"}} onClick={()=>deletePost(item.id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
    );

}