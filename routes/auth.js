const express=require("express");

const router = express.Router();

const authController=require("../controllers/auth.js");



// // localhost:3000/auth/signup  GET-POST 
router.get("/signup",authController.signup_get);
router.post("/signup",authController.signup_post);


// localhost:3000/users/signin GET-POST 
router.get("/signin",authController.signin_get);
router.post("/signin",authController.signin_post);

// router.get("/home",authController.home);


module.exports = router;