const express = require('express');
const path=require('node:path');
require('dotenv').config();
const controller = require("./controllers/blogController");
const userPassport = require('./config/passportJwt');
const postsRouter = require("./routes/postsRouter");
const authorRouter = require("./routes/authorRouter");
const cors = require("cors");
const app = express();

app.use(express.static(path.join(__dirname,'public/dist')));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors({
    origin:"https://my-blog-rt9u.onrender.com",
    credentials:false
}));

app.use('/posts',postsRouter);
app.use('/authors',authorRouter);

app.post("/register",controller.registerUser);
app.post("/login",controller.handleLogin);
app.get("/me",userPassport.authenticate('user-jwt',{session:false}), (req, res) => {
    if(req.user.is_author === true)
        res.json({role:"author"});
    else
        res.json({role:"user"});
});
app.get("/logout",controller.handleLogout);
app.get("/*splat", (req, res) => {
  res.sendFile(path.join(__dirname, "public/dist", "index.html"));
});
app.listen(8080,()=>console.log("Running on http://localhost:8080"));