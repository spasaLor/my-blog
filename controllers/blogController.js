const prisma= require("../config/prisma");
const bcrypt = require("bcrypt");
const {body,validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");

const registerValidator = [
    body("username").matches("^[a-zA-Z0-9\-_]+$").withMessage("Username can only contain '-' and '_' as special tokens")
    .isLength({min:5}).withMessage("Username must be at least 5 characters long"),
    body("password").matches("^[a-zA-Z0-9\-_]+$").withMessage("Password can only contain '-' and '_' as special tokens")
    .isLength({min:6}).withMessage("Password must be at least 6 characters long")
];


const registerUser=[registerValidator,async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).json({errors:errors.array()});
    const data = req.body;
    const hashed = await bcrypt.hash(data.password,10);
    try {
        await prisma.users.create({
            data:{
                username:data.username,
                password:hashed
            }
        })
    } catch (error) {
        return res.status(400).json({errors:[{message:"Username is already taken, please select a different one"}]});
    }
    res.status(200).json({redirect:"/login"});
}]

const handleLogin = async(req,res)=>{
    const data = req.body;
    const exists = await prisma.users.findFirst({
        where:{
                username:data.username,
        }
    });
    if(!exists)
        return res.status(404).json({error: "Username doesn't exist"});

    const match = await bcrypt.compare(data.password,exists.password);
    if(!match)
        return res.status(404).json({error: "Wrong password"});

    jwt.sign({id:exists.id},process.env.JWT_SECRET,(err,token)=>{
        if(err)
            return res.json({errors: [err]});
        res.status(200).json({redirect:"/",accessToken:token})
    });
}

const handleLogout = (req,res)=>{
    res.status(200).json({redirect:"/login"});
}

module.exports={registerUser,handleLogin,handleLogout}