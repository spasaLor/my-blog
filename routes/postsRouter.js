const router=require('express').Router();
const controller = require('../controllers/postsController');
const userPassport = require("../config/passportJwt");
const authorPassport = require("../config/authorPassport");

router.get("/limit/:limit",controller.getPosts);
router.get("/all",controller.allPosts);
router.get("/:postId",controller.getPost);
router.post("/:postId/new_comment",userPassport.authenticate('user-jwt',{session:false}),controller.addComment);
router.get("/all_from_author",authorPassport.authenticate('auth-jwt',{session:false}),controller.allPostsFromAuthor);
module.exports=router;