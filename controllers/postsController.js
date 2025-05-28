const prisma= require("../config/prisma");

const getPosts = async(req,res)=>{
    const {limit} = req.params;
    const posts = await prisma.posts.findMany({
        take:Number(limit),
        where:{
            is_published:true
        },
        orderBy:{published_at:'desc'},
        include:{authors:true},
    });
    return res.status(200).json({posts});
}

const allPosts = async(req,res)=>{
    const posts=await prisma.posts.findMany({
        where:{
            is_published:true
        },
        orderBy:{published_at:'desc'},
        include:{authors:true}
    });
    res.status(200).json({posts});
}

const getPost = async(req,res)=>{
    const {postId}=req.params;
    const comms=[]

    const post = await prisma.posts.findUnique({
        where:{
            id:Number(postId),
        },
        include:{authors:true}
    });
    const comments = await prisma.comments.findMany({
        where:{post_id:Number(postId)},
        select:{
            content:true,
            users:{select:{username:true}}
        },
    });
    
    comments.forEach(item=>{
        let comm={
            content:item.content,
            username:item.users.username
        };
        comms.unshift(comm);
    });
    post.comments=comms;
    res.status(200).json(post);
}

const addComment = async(req,res)=>{
    const{postId}=req.params;
    const {comment}=req.body;
    try {
        await prisma.comments.create({
            data:{
                post_id:Number(postId),
                user_id:Number(req.user.id),
                content:comment
            }
        });
    } catch (error) {
        console.log(error);
    }   
    res.status(200).json({message:"Success"});

}

const allPostsFromAuthor = async(req,res)=>{
    const posts = await prisma.posts.findMany({
        where:{
            author_id:req.user.id
        },
        orderBy:{created_at:'desc'}
    });
    res.status(200).json(posts);
}

const unpublishedFromAuthor=async(req,res)=>{
    const posts = await prisma.posts.findMany({
        where:{
            author_id:req.user.id,
            is_published:Boolean(false)
        },
        orderBy:{created_at:'asc'}
    });
    res.status(200).json(posts);
}

const publishPost = async(req,res)=>{
    const {postId}=req.body;
    try {
        await prisma.posts.update({
            where:{
                id:postId,
            },
            data:{
                is_published:Boolean(true),
                published_at:new Date()
            }
        })
    } catch (error) {
        console.log(error);
    }
    return res.status(200).json({message:"Post published"});
}

const deletePost= async(req,res)=>{
    const {postId}=req.body;
    await prisma.posts.delete({
        where:{
            id:postId
        }
    });
    res.status(200).json({message:"Post deleted"});
}

const editPost = async(req,res)=>{
    const {postId,title,content,img} = req.body;
    try {
        await prisma.posts.update({
            where:{
                id:postId
            },
            data:{
                title:title,
                content:content,
                img:img,
                created_at: new Date()
            }
        });
    } catch (error) {
        console.log(error);
    }
    res.status(200).json({message:"Post updated"});

}
module.exports={getPosts,getPost,addComment,allPosts,allPostsFromAuthor,unpublishedFromAuthor,publishPost,deletePost,editPost}