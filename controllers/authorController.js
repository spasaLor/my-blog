const {body,validationResult}=require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require("../config/prisma");

registerValidator = [
    body("name").trim().isLength({min:2}).withMessage("Name must be at least 2 characters long")
    .isAlpha().withMessage("Name can only contain letters"),
    body("surname").trim().isLength({min:2}).withMessage("Surname must be at least 2 characters long")
    .isAlpha().withMessage("Surname can only contain letters"),
    body("img").isURL().withMessage("Invalid URL").optional({checkFalsy:true}),
    body("bio").isLength({min:10}).withMessage("Bio must be at least 10 character, don't be shy!")
];

const registerWriter = [registerValidator, async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).json({errors:errors.array()});
    let proPic;
    req.body.img === "" ? proPic="https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg":proPic=req.body.img
    try {
        await prisma.authors.create({
            data:{
                id:Number(req.user.id),
                pen_name:req.body.name+" "+req.body.surname,
                img:proPic ,
                bio:req.body.bio
            }
        });
    } catch (error) {
        return res.status(500).json([{msg:"You've already signed up as a writer"}]);
    }
    res.status(200).json({msg:"Success"});
}]

const loginWriter = async(req,res)=>{
    const data = req.body;
    const user = await prisma.users.findFirst({
        where:{
            username:data.username
        }
    });
    if(!user)
        return res.status(404).json({errors:[{message:"Username doesn't exist"}]});
    const match = await bcrypt.compare(data.password,user.password);
    if(!match)
        return res.status(404).json({errors:[{message:"Wrong password"}]});
    const auth = await prisma.authors.findUnique({
        where:{
            id:user.id
        }
    });
    jwt.sign({id:auth.id},process.env.JWT_SECRET,(err,token)=>{
        if(err)
            return res.status(500).json({errors:[{message:err.message}]});
        
        return res.json({redirect: "/authors/personal",token,user:auth.pen_name});
    });
}

const newPost = async(req,res)=>{
    const data=req.body;
    console.log(data);
    try {
        await prisma.posts.create({
            data:{
                title:data.title,
                content:data.content,
                created_at:new Date(),
                author_id:Number(req.user.id),
                is_published:false,
                img:data.img
            }
        });
        
    } catch (error) {
        return res.status(500).json(error);
    }
    res.status(200).json({message:"Post saved"});
}

const authorProfile = async(req,res)=>{
    const {authorId}=req.params;
    const info = await prisma.authors.findUnique({
        where:{
            id:Number(authorId)
        },
        include:{posts:true}
    });
    info.posts.forEach(post=>{
        let date = new Date(post.published_at);
        date=date.toDateString();
        date=date.split(" ");
        post.published_at=date[1]+" "+date[2];
    })
    
    res.status(200).render("user_frontend/author",{info});
}

module.exports={registerWriter,loginWriter,newPost,authorProfile}