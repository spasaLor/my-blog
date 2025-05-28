const gre=document.querySelector('.greeting');
const log = document.getElementById('logout');
const main = document.querySelector('main');
const container = document.querySelector('.posts-container');
const sel = document.querySelector('.selection');
const selBox = document.querySelector('.select-box');
const pers = document.getElementById('personal');

log.addEventListener('click',async(e)=>{
    e.preventDefault();
    const res = await fetch('/logout');
    const json = await res.json();
    localStorage.clear();
    window.location.href=json.redirect;
});

document.addEventListener('DOMContentLoaded',()=>{
    loadPersonal();
});

const loadPersonal = (e=null)=>{
    if(e)
        e.preventDefault()
    gre.innerHTML="<h2>Welcome back to your personal area, "+localStorage.getItem('user')+"</h2><i>From here you can manage your posts</i>";
    sel.innerHTML=""+"<button id='newPost'>New Post</button><button id='allMyPosts'>All Posts</button><button id='unpublished'>Unpublished Posts</button>";
    const newP=document.getElementById('newPost');
    const allP=document.getElementById('allMyPosts');
    const unP=document.getElementById('unpublished');
    newP.addEventListener('click',()=>{
        loadNewPost();
        newP.classList.add('active');
        allP.classList.remove('active');
        unP.classList.remove('active');
    });
    allP.addEventListener('click',()=>{
        loadAllPosts();
        newP.classList.remove('active');
        allP.classList.add('active');
        unP.classList.remove('active');
    });
    unP.addEventListener('click',()=>{
        loadUnpublished();
        newP.classList.remove('active');
        allP.classList.remove('active');
        unP.classList.add('active');
    });
    newP.classList.add('active');
    loadNewPost();
}
const loadNewPost = (title=null,content=null,id=null,img=null)=>{
    selBox.style.display="none";
    container.classList.remove("allPosts");
    container.classList.add("posts-container");
    if(title===null && content===null){
        container.innerHTML=""+"<div class='newPost'><form><div class='form-item'><label for='title'>Post title:</label><input type='text' name='title' id='title' required></div><div class='form-item'><label for='img'>Header image:</label><input type='text' name='img' id='img' placeholder='http://...' required></div></form></div>";    
        const ta=document.createElement('textarea');
        ta.id='post';
        const btn=document.createElement('button');
        btn.id="sendPost";
        btn.type="button";
        btn.innerText="Save";
        container.append(ta,btn);
        
        const existingEditor = tinymce.get('post');

        if (existingEditor) existingEditor.remove();
        setTimeout(() => {
            tinymce.init({
                selector: '#post',
                statusbar:false,
            });
        });
        setTimeout(() => {
            const btn = document.getElementById('sendPost');
            btn.addEventListener('click', sendPost);
        },0);
    } else{
        container.innerHTML=""+"<div class='newPost'><form><div class='form-item'><label for='title'>Post title:</label><input type='text' name='title' id='title' value='"+title+"' required></div><div class='form-item'><label for='img'>Link to an image</label><input type='text' name='img' id='img' value='"+img+"'></div></form></div>";    
        const ta=document.createElement('textarea');
        ta.id='post';
        ta.innerText=content
        const btn=document.createElement('button');
        btn.id="editPost";
        btn.type="button";
        btn.innerText="Save";
        container.append(ta,btn);
        
        const existingEditor = tinymce.get('post');
        if (existingEditor) existingEditor.remove();
        setTimeout(() => {
            tinymce.init({
                selector: '#post',
                statusbar:false
            });
        });

        setTimeout(() => {
            const btn = document.getElementById('editPost');
            btn.addEventListener('click', ()=>editPost(id));
        },0);
    }
    
}
const editPost = async(postId)=>{
    const form = document.querySelector('form');
    const content = tinymce.get('post').getContent();
    const formData=new FormData(form);
    const res = await fetch("./edit_post",{
        method:"PUT",
        headers:{authorization:"bearer "+localStorage.getItem('token'), "content-type":"application/json"},
        body:JSON.stringify({postId,title:formData.get('title'),content,img:formData.get('img')})
    });
    const json = await res.json();
    if(!res.ok)
        console.log(json.message);
    loadAllPosts();
}
const sendPost= async()=>{
    const form = document.querySelector('form');
    const content = tinymce.get('post').getContent();
    const formData=new FormData(form);
    const res = await fetch("/authors/new_post",{method:"POST",headers:{
        authorization:'bearer '+localStorage.getItem('token'),
        "content-type":"application/json",
    },
        body: JSON.stringify({title:formData.get('title'),content,img:formData.get('img')})
    });
    if(res.ok)
        loadAllPosts();
    else{
        const json=await res.json();
        console.log(json); 
    }
}
const loadAllPosts = async()=>{
    const res = await fetch("./all_from_author",{headers:
        {authorization: 'bearer '+localStorage.getItem('token')}
    });
    const posts = await res.json();
    container.innerHTML="";
    container.classList.add("allPosts");
    container.classList.remove("posts-container");
    const select = document.createElement('select');
    select.id="postView";
    const opt1 = document.createElement('option');
    opt1.value="published";
    opt1.textContent="Only Published";
    
    const opt2 = document.createElement('option');
    opt2.value="unpublished";
    opt2.textContent="Only Unpublished";
    
    const opt3 = document.createElement('option');
    opt3.value="all";
    opt3.textContent="All";
    opt3.selected=true;
    select.append(opt3,opt1,opt2);
    selBox.style.display='block';
    selBox.innerHTML='';
    selBox.append(select);

    posts.forEach(post=>{
        let date;
        const div=document.createElement("div");
        div.classList.add('post-item');
        const h2=document.createElement("h2");
        h2.classList.add('title');
        h2.innerText=post.title;
        const info=document.createElement("div");
        info.classList.add('post-info');
        const p = document.createElement("p");
        if(post.published_at){
            date = new Date(post.published_at);
            date=date.toDateString();
            date=date.split(" ");
        } else{
            date = new Date(post.created_at);
            date=date.toDateString();
            date=date.split(" ");
        }
        post.is_published ? p.innerText="Published: "+date[2]+" "+date[1] : p.innerText="Saved: "+date[2]+" "+date[1];        
        const p2 = document.createElement("p");
        p2.classList.add("status");
        post.is_published ? p2.innerHTML="&#9989; Published" : p2.innerHTML="&#10060; Draft";
        
        info.append(p,p2);
        div.append(h2,info);
        container.append(div);
    });

    select.addEventListener('change',()=>{
        const posts = document.querySelectorAll('.post-item');
        const stat = document.querySelectorAll('.status');

        if(select.value === 'all')
            posts.forEach(item=>item.style.display="block");
        if(select.value === 'published')
            stat.forEach(item=>{
                if(item.innerText.toLowerCase().includes("draft"))
                    item.parentElement.parentElement.style.display='none';
                else
                    item.parentElement.parentElement.style.display='block'
            });
        if(select.value === 'unpublished')
            stat.forEach(item=>{
                if(item.innerText.toLowerCase().includes("published"))
                    item.parentElement.parentElement.style.display='none';
                else
                    item.parentElement.parentElement.style.display='block';
            })
        
    })
}
const loadUnpublished =async()=>{
    selBox.style.display="none";
    container.classList.add("allPosts");
    container.classList.remove("posts-container");
    const res = await fetch("./all_unpublished_from_author",{headers:
        {authorization: 'bearer '+localStorage.getItem('token')}
    });
    const posts = await res.json();
    container.innerHTML="";
    posts.forEach(post=>{
        const div=document.createElement("div");
        div.classList.add('post-item');
        const h2=document.createElement("h2");
        h2.classList.add('title');
        h2.innerText=post.title;
        const info=document.createElement("div");
        info.classList.add('post-info');
        const p = document.createElement("p");
        let date = new Date(post.created_at);
        date=date.toLocaleDateString();
        p.innerText="Saved: "+date;
        const controls = document.createElement("div");
        controls.classList.add('btns');
        const btn1 = document.createElement("button");
        const btn2 = document.createElement("button");
        const btn3 = document.createElement("button");
        btn1.innerText="Publish";
        btn2.innerText="Edit";
        btn3.innerText="Delete";
        btn1.style.color="var(--color-primary)";
        btn2.style.color="var(--color-warn)";
        btn3.style.color="var(--color-error)";
        btn1.addEventListener('click',()=>publishDraft(post.id));
        btn2.addEventListener('click',()=>loadNewPost(post.title,post.content,post.id,post.img));
        btn3.addEventListener('click',()=>deleteDraft(post.id));
        controls.append(btn1,btn2,btn3);
        
        info.append(p,controls);
        div.append(h2,info);
        container.append(div);
    })

}
const publishDraft = async(postId)=>{
    const res = await fetch("./publish",{
        method:"PUT",
        headers:{authorization:"bearer "+localStorage.getItem('token'), "content-type":"application/json"},
        body: JSON.stringify({postId})
    });
    const json = await res.json();
    if(!res.ok)
        console.log(json.message);
    loadAllPosts();
}
const deleteDraft =async(postId)=>{
    const res = await fetch("./delete_post",{
        method:"DELETE",
        headers:{authorization:"bearer "+localStorage.getItem('token'), "content-type":"application/json"},
        body:JSON.stringify({postId})
    });
    if(!res.ok)
        console.log(json.message);
    loadUnpublished();
}
