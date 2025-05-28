const commBtn=document.getElementById('commentBtn');
const form = document.getElementById('commentForm');
const p = document.getElementById('commentWarning');
let id = window.location.pathname.split("/").pop();

const loadPostInfo = async()=>{
    const container= document.querySelector('.post');
    const comments= document.querySelector('.comments');
     tinymce.init({
                selector: '#comment',
                skin:'oxide-dark',
                statusbar:false,
                menubar:false,
                height:'300px',
            });
    try {
        const res = await fetch('/posts/'+id,{
        });
        const json = await res.json();
        const date = new Date(json.published_at);
        container.innerHTML="<div class='top'><div class='pic'><img src='"+json.img+"' alt=''></div> <div class='right'><a href='/blog'>blog /</a> <h2>"+json.title+"</h2><div class='writer-info'><p>by <a href='/authors/"+json.authors.id+"'><b>"+json.authors.pen_name+"</b></a></p><p>"+date.toLocaleString()+"</p><div class='icons'> <i class='fa-solid fa-link'></i><i class='fa fa-facebook-f'></i><i class='fa-brands fa-threads'></i></div></div></div></div><div class='content'>"+json.content+"</div>";
        const comms = json.comments;
        const tag= document.createElement('h2');
        tag.innerText="Comments"
        comments.append(tag);
        comms.forEach(comment => {
            const div=document.createElement('div');
            div.classList.add('comment');
            div.innerHTML="<b>"+comment.username+"</b>"+comment.content;
            comments.appendChild(div);
        });
    } catch (error) {
        throw new Error(error);
    }
}

commBtn.addEventListener('click',async()=>{
    const comment = tinymce.get('comment').getContent();
    const res=await fetch("/posts/"+id+"/new_comment",
        {
            method:"POST",
            headers:{
                "Content-type":"application/json",
                Authorization:"bearer "+localStorage.getItem('token'),
            },
            body:JSON.stringify({comment})
        }
    );
    if(res.ok){
        window.location.reload();
    }
})

if(!localStorage.getItem('token')){
    p.style.display='block';
    form.style.display='none';
}

loadPostInfo();