const express=require("express");

const router = express.Router();

const userController=require("../controllers/user.js");
const auth = require("../middlewares/auth");

router.get("/",userController.start);

router.get("/home",auth,userController.home);
router.post("/home",auth,userController.homeP);

router.get("/erisim",userController.erisim);

router.get("/sil/:id",auth,userController.silme);

router.get("/:shortUrl",userController.tıklanma);

router.get("/logout",userController.logout);

module.exports = router;