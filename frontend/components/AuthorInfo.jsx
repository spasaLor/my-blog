import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../src/authorPage.css";

export default function AuthorInfo(){
    const {authorId} = useParams();
    const [author,setAuthor]=useState();
    const nav = useNavigate();

    useEffect(()=>{
        if(!authorId) return;
        const fetchAuthor = async(id)=>{
            const res = await fetch(import.meta.env.VITE_BACKEND_URL+"/authors/"+id);
            const json= await res.json();
            if(res.ok)
                setAuthor(json.info);
            else
                nav(json.redirect);
        }
        fetchAuthor(authorId);
    },[authorId]);

    return(
       author && (
       <main>
            <div className="author-top-part">
                <h1 id="backgroundName">{author.pen_name}</h1>
                <h1>{author.pen_name}</h1>
            </div>
            <div className="author-bott">
                <div className="first">
                    <img src={author.img} alt=""/>
                </div>
                <div className="author-text">
                    <p>{author.bio}</p>
                </div>
            </div>
            <p id="more">more from {author.pen_name}</p>
            <div className="author-posts-container">
                {author.posts.map(item=>(
                    <div className="author-post-item" key={item.id} onClick={()=>nav("/post/"+item.id)}>
                        <div className="author-text">
                            <h2>{item.title}</h2>
                            <div> <p>{author.pen_name}</p>  <p> {item.published_at}</p></div>
                        </div>
                        <div className="img">
                            <img src={item.img} alt=""/>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
    );
}