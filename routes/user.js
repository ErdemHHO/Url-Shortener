const express=require("express");

const router = express.Router();

const userController=require("../controllers/user.js");
const auth = require("../middlewares/auth");



// // localhost:3000/auth/signup  GET-POST 
router.get("/home",auth,userController.home);
router.post("/home",auth,userController.homeP);


router.get("/:shortUrl",userController.tıklanma);

router.get("/logout",userController.logout);

module.exports = router;