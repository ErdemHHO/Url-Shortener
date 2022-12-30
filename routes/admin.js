
const express=require("express");

const router = express.Router();

const auth = require("../middlewares/auth");
const adminController=require("../controllers/admin.js");

router.get("/dashboard",auth,adminController.dashboard);

router.get("/sil/:id",adminController.silme);

router.get("/:shortUrl",adminController.tıklanma);


module.exports = router;