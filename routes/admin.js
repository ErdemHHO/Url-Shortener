
const express=require("express");

const router = express.Router();

const adminController=require("../controllers/admin.js");

router.get("/dashboard",adminController.dashboard);

router.get("/sil/:id",adminController.silme);

router.get("/:shortUrl",adminController.tıklanma);


module.exports = router;