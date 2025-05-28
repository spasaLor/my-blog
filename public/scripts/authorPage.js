const posts = document.querySelectorAll('.post-item');

posts.forEach(post=>{
    post.addEventListener('click',()=>{
        window.location.href="/blog/posts/"+post.dataset.post;
    })
})