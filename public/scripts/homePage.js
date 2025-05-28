const allBtn=document.getElementById('all');
const latestBtn=document.getElementById('latest');
const container = document.querySelector('.posts-container');
const personal = document.getElementById('become');
const main = document.querySelector('main');

const fillHomePage = async()=>{
    let url="/posts/limit/5";
    container.classList.remove('allPosts');
    container.classList.add('posts-container');
    latestBtn.classList.add('active');
    allBtn.classList.remove('active');
    const res = await fetch(url);
    if(res.ok){
        const json = await res.json();
        container.innerHTML="";
        const mainPost=document.createElement('div');
        mainPost.classList.add('main-post');
        const sidePost=document.createElement('div');
        sidePost.classList.add('side-post');
        const top=document.createElement('p');
        top.innerText="Top Stories";
        sidePost.append(top);
        const list = document.createElement('ul');
        json.posts.forEach((post,i)=>{
            let d=document.createElement('div');
            d.classList.add('post');
            let date = new Date(post.published_at);
            date=date.toDateString();
            date=date.split(" ");
            d.addEventListener('click',()=>{
                window.location.href="/blog/posts/"+post.id;
            })
            if(i===0){
                d.innerHTML= "<div class='cover'><img src='"+post.img+"' alt=''></div><div class='text'><h2>"+post.title+"</h2> <div><p>"+post.authors.pen_name+"</p> <p>"+date[1]+" "+date[2]+"</p></div> </div>";
                mainPost.append(d);
            }
            else{
                const listItem = document.createElement('li');
                d.innerHTML= "<div class='left'><h2>"+post.title+"</h2> <div><p>"+post.authors.pen_name+"</p> <p>"+date[1]+" "+date[2]+"</p></div></div><div class='img'> <img src='"+post.img+"' alt=''></div>";
                listItem.append(d);
                list.append(listItem);
            }
                
        })
        sidePost.append(list);
        container.append(mainPost);
        container.append(sidePost);
    }
}

personal ? personal.addEventListener('click',async(e)=>{
    e.preventDefault();
    const res = await fetch("/authors/personal",{headers:{Authorization:'Bearer '+localStorage.getItem('token')}});
    const html = await res.text();
    main.innerHTML=""+html;

}):null;

const displayAllPosts = async()=>{
    url="/posts/all";
    allBtn.classList.add('active');
    latestBtn.classList.remove('active');

    const res = await fetch(url);
    if(res.ok){
        const json = await res.json();
        container.innerHTML="";
        container.classList.remove('posts-container');
        container.classList.add('allPosts');
        json.posts.forEach(post =>{
            const div = document.createElement('div');
            div.classList.add('allPosts-post');
            div.addEventListener('click',()=>{
                window.location.href="/blog/posts/"+post.id;
            })
            const div2 = document.createElement('div');
            div2.classList.add('allPosts-img');
            const img = document.createElement('img');
            img.src=post.img;
            const div3 = document.createElement('div');
            div3.classList.add('allPosts-text');
            let date = new Date(post.published_at);
            date=date.toDateString();
            date=date.split(" ");
            div3.innerHTML="<h2>"+post.title+"</h2> <div><p>"+post.authors.pen_name+"</p> <p>"+date[1]+" "+date[2]+"</p></div>";
            div2.append(img);
            div.append(div2,div3);
            container.append(div);
        })
    }
    else{
        console.log(json.message);
    }
}

document.addEventListener('DOMContentLoaded',()=>{
    allBtn.addEventListener('click',displayAllPosts);
    latestBtn.addEventListener('click',fillHomePage);
    fillHomePage();
})