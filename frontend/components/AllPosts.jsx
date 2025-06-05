import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';


export default function AllPosts(){
    const [selection,setSelection]=useState('all');
    const posts = useOutletContext();
    const publishedPosts= posts.filter((item)=>item.is_published === true);
    const unpublishedPosts= posts.filter((item)=>item.is_published === false);
    const nav = useNavigate();

    return(
        <>
            <div className="select-box">
                <select id="postView" value={selection} onChange={(e)=>setSelection(e.target.value)}>
                    <option value="all">All</option>
                    <option value="published">Only Published</option>
                    <option value="unpublished">Only Unpublished</option>
                </select>
            </div>
            <div className="personal-allPosts">
                {posts && selection === 'published' && publishedPosts.map(item=>(
                    <div className="personal-post-item" key={item.id} onClick={()=>nav("/post/"+item.id)} style={{cursor:'pointer'}}>
                        <div className="top">
                            <h2 className="title">{item.title}</h2>
                            <FontAwesomeIcon icon={faArrowRight} />
                        </div>
                        <div className="post-info">
                            <p>{item.published_at}</p>
                            <p className="status">✅ Published</p>
                        </div>
                    </div>
                ))}
                {posts && selection === 'unpublished' && unpublishedPosts.map(item=>(
                    <div className="personal-post-item" key={item.id}>
                        <h2 className="title">{item.title}</h2>
                        <div className="post-info">
                            <p>{item.created_at}</p>
                            <p className="status">❌ Draft</p>
                        </div>
                    </div>
                ))}
                {posts && selection === 'all' && posts.map(item=>(
                    <div className="personal-post-item" key={item.id}>
                        <h2 className="title">{item.title}</h2>
                        <div className="post-info">
                            <p>{item.is_published ? item.published_at : item.created_at}</p>
                            <p className="status">{item.is_published ? "✅ Published" : "❌ Draft"}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}