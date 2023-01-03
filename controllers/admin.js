const express=require("express");
const ShortUrl = require('../models/shortUrl');
const AuthSchema=require("../models/user.js");
const emailService=require("../helpers/send-mail");


const router = express.Router();

const dashboard=async function(req, res) {
    let token=global.token;
    let user=global.user;
    if(user.rol!="ADMIN"){
        return res.redirect("/home");
    }
    console.log(user);
    const shortUrls = await ShortUrl.find();
    const kullanıcılar = await AuthSchema.find()
    try {
        res.render("admin/dashboard.ejs", {
            token:token,
            user:user,
            shortUrls: shortUrls,
            kullanıcılar:kullanıcılar
        });
    }
    catch(err) {
        console.log(err);
    }
}

const silme=async function(req, res) {
    console.log(req.params);
    let token=global.token;
    let user=global.user;
    if(req.params.id!=""){
        const url = await AuthSchema.findOne({ _id: req.params.id });
        await AuthSchema.deleteOne({ _id: req.params.id });
    }
    if(req.params.shortUrl!=""){
        const url = await ShortUrl.findOne({ _id: req.params.id });
        await ShortUrl.deleteOne({ _id: req.params.id });
        const shortUrls = await ShortUrl.find();    
        if(!url){
        return res.render("user/home.ejs", {
            token:token,
            user:user,
            shortUrls: shortUrls,
            message2:"Silmek İstediğiniz Url Bulunamadı",
            renk2:"danger"
        });
    }
    }
    try {
    return res.redirect("/admin/dashboard");
    }
    catch(err) {
        console.log(err);
    }
}

const tıklanma=async function(req, res) {
    try {
        if(req.params!=""){
        const kisaltilmisUrl = await ShortUrl.findOne({ kısaltılmısUrl: req.params.shortUrl });
        const date = new Date();
        console.log(date);
        const currentDateString = date.toISOString().split('.')[0];
    
        const bitisTarihi=kisaltilmisUrl.bitisTarihi;
        console.log(bitisTarihi);
        const futureDate = new Date(bitisTarihi);
        console.log(futureDate);
    
        const differenceInMilliseconds = futureDate.getTime() - date.getTime();
        const differenceInMinutes = differenceInMilliseconds / (1000 * 60);
    
        console.log(differenceInMinutes);
    
        if(differenceInMinutes<0){
            return res.redirect("/erisim");
        }
    
        if (kisaltilmisUrl == null) return res.sendStatus(404)
        kisaltilmisUrl.tıklanma++;
        kisaltilmisUrl.save();
    
        return res.redirect(kisaltilmisUrl.fullUrl);
        }

    } catch (error) {
        console.log(error);
    }

}
module.exports={
    silme,tıklanma,dashboard
}