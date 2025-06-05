import { useEffect,useState } from "react";
import "../src/home.css";
import { Link } from "react-router-dom";

function LatestPostsView({posts}){
    return(
        <div className="home-posts-container">
            <div className="home-main-post">
            {posts.map((post,index)=>(
                index === 0 ? (
                    <Link to={"post/"+post.id} key={post.id}>
                    <div className="home-post" >
                        <div className="cover"><img src={post.img} alt=""/></div>
                        <div className="text">
                            <h2>{post.title}</h2>
                            <div>
                                <p>{post.authors.pen_name}</p>
                                <p>{post.published_at}</p>
                            </div>
                        </div>
                    </div>
                    </Link>
                ) 
            :
            null
            ))}
            </div>
            <div className="home-side-post">
                <p>Top Stories</p>
                <ul>
                    {posts.map((post,index)=>(
                        index !== 0 ? 
                        (
                        <li key={post.id}>
                            <Link to={"post/"+post.id}>
                                <div className="home-post">
                                    <div className="left">
                                        <h2>{post.title}</h2>
                                        <div>
                                            <p>{post.authors.pen_name}</p>
                                            <p>{post.published_at}</p>
                                        </div>
                                    </div>
                                    <div className="img"> <img src={post.img} alt=""/></div>
                                </div>
                            </Link>
                        </li> 
                        ): null
                    ))}
                </ul>
            </div>
        </div>
    );
}
function AllPostsView({posts}){
    return(
        <div className="home-allPosts">
                {posts.map(post=>(
                    <Link to={"post/"+post.id} key={post.id}>
                        <div className="home-allPosts-post" >
                            <div className="home-allPosts-img"><img src={post.img}/></div>
                            <div className="home-allPosts-text">
                                <h2>{post.title}</h2>
                                <div>
                                    <p>{post.authors.pen_name}</p>
                                    <p>{post.published_at}</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}                
        </div>
    );
}
export default function Blog(){
    const [active,setActive]=useState('latest');
    const [posts,setPosts]=useState([]);

    useEffect(()=>{
        const fetchPosts = async()=>{
            const res = await fetch(import.meta.env.VITE_BACKEND_URL+"/posts/all");
            const json = await res.json();
            json.posts.forEach(item=>{
                let date = new Date(item.published_at);
                date=date.toDateString();
                date=date.split(" ");
                item.published_at=date[1]+" "+date[2];
            })
            setPosts(json.posts);
        }
        fetchPosts();
    },[]);
    const latestPosts = posts.slice(0,5);
    return(
        <main>
            <div className="selection">
                <button id="latest" onClick={()=>setActive('latest')} className={active === 'latest'?"active":""}>Latest Posts</button>
                <button id="all" onClick={()=>setActive('all')} className={active === 'all'? 'active': ""}>All Posts</button>
            </div>
                {active ==='latest' ? <LatestPostsView posts={latestPosts}/> : <AllPostsView posts={posts}/>} 
        </main>
    );
}