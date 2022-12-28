
const express=require("express");
const ShortUrl = require('../models/shortUrl');

const router = express.Router();

const home=async function(req, res) {
    let token=global.token;
    let user=global.user;

    try {
        return res.render("user/home.ejs", {
            token:token,
            user:user
        });
    }
    catch(err) {
        console.log(err);
    }
}
const homeP=async function(req, res) {
    console.log(req.body);
    let token=global.token;
    let user=global.user;
    await ShortUrl.create({ 
        fullUrl: req.body.fullUrl,
        userId:user._id,
     })

    try {
        return res.render("user/home.ejs", {
            token:token,
            user:user
        });
    }
    catch(err) {
        console.log(err);
    }
}

const tıklanma=async function(req, res) {
    const kısaltılmısUrl = await ShortUrl.findOne({ kısaltılmısUrl: req.params.kısaltılmısUrl })
    if (kısaltılmısUrl == null) return res.sendStatus(404)
    kısaltılmısUrl.tıklanma++;
    kısaltılmısUrl.save();

    return res.redirect(kısaltılmısUrl.fullUrl);
}


const logout=async function(req, res) {
    try {
        return res.redirect("/auth/signin")
    }
    catch(err) {
        console.log(err);
    }
}

module.exports={
    home,logout,homeP,tıklanma
}