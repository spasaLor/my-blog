const {Router} = require('express');
const controller = require('../controllers/authorController');
const postsController = require('../controllers/postsController');
const userPassport = require('../config/passportJwt');
const authorPassport = require('../config/authorPassport');
const router = Router();

router.post("/register",userPassport.authenticate('user-jwt',{session:false}),controller.registerWriter);
router.post("/login",controller.loginWriter);
router.get("/personal",(req,res)=>{
    res.render("writer_frontend/writerBlog");
})
router.post("/new_post",authorPassport.authenticate('auth-jwt',{session:false}),controller.newPost);
router.get("/all_from_author",authorPassport.authenticate('auth-jwt',{session:false}),postsController.allPostsFromAuthor);
router.get("/all_unpublished_from_author",authorPassport.authenticate('auth-jwt',{session:false}),postsController.unpublishedFromAuthor);
router.put("/publish",authorPassport.authenticate('auth-jwt',{session:false}),postsController.publishPost);
router.put("/edit_post",authorPassport.authenticate('auth-jwt',{session:false}),postsController.editPost);
router.delete("/delete_post",authorPassport.authenticate('auth-jwt',{session:false}),postsController.deletePost);
router.get("/:authorId",controller.authorProfile);

module.exports=router;