import { useEffect, useRef, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { Editor } from '@tinymce/tinymce-react';
import "../src/post.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faThreads } from '@fortawesome/free-brands-svg-icons';

export default function ReadPost(){
    const {postId} = useParams();
    const [post,setPost] =useState({});
    const role=useOutletContext();
    const editorRef=useRef(null);

    useEffect(()=>{
        if(!postId) return;
        const fetchPost = async(id)=>{
            const res = await fetch(import.meta.env.VITE_BACKEND_URL+"/posts/"+id);
            const json = await res.json();
            let d= new Date(json.post.published_at);
            d=d.toDateString();
            json.post.published_at = d;
            if(res.ok)
                setPost(json.post);
        }
        fetchPost(postId);
    },[]);

    const handleSumbit = async(e)=>{
        e.preventDefault();
        const comment = editorRef.current.getContent();
        const res=await fetch(import.meta.env.VITE_BACKEND_URL+"/posts/"+postId+"/new_comment",
            {
                method:"POST",
                headers:{
                    "Content-type":"application/json",
                    Authorization:"bearer "+localStorage.getItem('token'),
                },
                body:JSON.stringify({comment})
            }
        );
        if(res.ok)
            window.location.reload();
    }

    return(
        post ?
        (<main>
            <div className="post-container">
                <div className="post">
                    <div className="top">
                        <div className="pic"><img src={post.img} alt=""/></div>
                        <div className="right">
                            <Link to="/">blog /</Link> 
                            <h2>{post.title}</h2>
                            <div className="writer-info">
                                {post.authors ? (
                                    <>
                                    <p>by <Link to={"/author/"+post.authors.id}><b>{post.authors.pen_name}</b></Link></p>
                                    <p>{post.published_at}</p>
                                    <div className="icons">
                                        <FontAwesomeIcon icon={faLink}></FontAwesomeIcon>
                                        <FontAwesomeIcon icon={faFacebook}></FontAwesomeIcon>
                                        <FontAwesomeIcon icon={faThreads}></FontAwesomeIcon>
                                    </div>
                                    </>
                                ) : (
                                    <p>Loading author info...</p>
                                )}
                                </div>
                        </div>
                    </div>
                    <div className="content" dangerouslySetInnerHTML={{__html:post.content}}>
                    </div>
                </div>
            </div>
            <div className="comments">
                <h2>Comments</h2>
                {post.comments && (post.comments.map((item,id)=>(
                    <div className="comment" key={id}>
                        <b>{item.username}</b>
                        <p dangerouslySetInnerHTML={{__html:item.content}}></p>
                    </div>
                )))}
            </div>
            <div className="comment-box">
               { 
               role === 'visitor' ? (<p id="commentWarning"><Link to="/login">Log In</Link> to leave a comment</p>) :
                (<form id="commentForm" onSubmit={handleSumbit}>
                    <Editor
                        apiKey='puf70dx3rttzxi7kdg0imgeoppwcifpgjfkp38uv1ssmx8x4'
                        onInit={ (_evt, editor) => editorRef.current = editor }
                        init={{
                            plugins: [
                            'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                            ],
                            toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                            tinycomments_mode: 'embedded',
                            tinycomments_author: 'Author name',
                        }}
                        initialValue="<p>Leave a comment...</p>"
                        />
                    <button type="submit" id="commentBtn">Send</button>
                </form>)
                }
            </div>
        </main>)
        :
        (<div> Loading...</div>)
    );
}