
const express=require("express");
const ShortUrl = require('../models/shortUrl');

const shortId = require('shortid');

const router = express.Router();

const home=async function(req, res) {
    let token=global.token;
    let user=global.user;
    let date = new Date();
    console.log(date);
    const timezoneOffsetMinutes = date.getTimezoneOffset();
    console.log(timezoneOffsetMinutes);
    let newDate=date.setMinutes(date.getMinutes() - timezoneOffsetMinutes);
    console.log(newDate);

    let date2 = new Date();
    console.log(date2);
    const timezoneOffsetMinutes2 = date.getTimezoneOffset();
    console.log(timezoneOffsetMinutes);
    let newDate2=date.setMinutes(date.getMinutes() - timezoneOffsetMinutes);
    console.log(newDate);

    const differenceInMilliseconds = date2.getTime() - date.getTime();
    const differenceInMinutes = differenceInMilliseconds / (1000 * 60);
    console.log("aradaki farkkkkkk "+differenceInMinutes);

    const shortUrls = await ShortUrl.find( {userId : user._id})
    try {
        return res.render("user/home.ejs", {
            token:token,
            user:user,
            shortUrls: shortUrls
        });
    }
    catch(err) {
        console.log(err);
    }
}
const homeP=async function(req, res) {
    console.log("****************************************");
    console.log(req.body);
    console.log("****************************************");
    let date = new Date();
    console.log(date);
    const timezoneOffsetMinutes = date.getTimezoneOffset();
    console.log(timezoneOffsetMinutes);
    let newDate=date.setMinutes(date.getMinutes() - timezoneOffsetMinutes);
    console.log(newDate);

    let date2 = new Date();
    console.log(date);
    const timezoneOffsetMinutes2 = date.getTimezoneOffset();
    console.log(timezoneOffsetMinutes);
    let newDate2=date.setMinutes(date.getMinutes() - timezoneOffsetMinutes);
    console.log(newDate);

    const differenceInMilliseconds = date2.getTime() - date.getTime();
    console.log(differenceInMilliseconds);

    let token=global.token;
    let user=global.user;
    const bosluk = req.body.verilenIsim.lastIndexOf(" ");
    const shortUrls = await ShortUrl.find( {userId : user._id});
    const kullanilmisUrl = await ShortUrl.findOne( {kısaltılmısUrl : req.body.verilenIsim});
    console.log(bosluk);
    if(bosluk!=-1){
        return res.render("user/home.ejs", {
            token:token,
            user:user,
            shortUrls: shortUrls,
            message:"Url İçerisinde Boşluk Olamaz",
            renk:"danger"
        });
    }
    if(req.body.verilenIsim.length>10){
        return res.render("user/home.ejs", {
            token:token,
            user:user,
            shortUrls: shortUrls,
            message:"Verdiğiniz İsim En Fazla 10 Karakter Olabilir",
            renk:"danger"
        });
    }
    if(kullanilmisUrl){
        return res.render("user/home.ejs", {
            token:token,
            user:user,
            shortUrls: shortUrls,
            message:"Bu Kısa Url Daha Önce Alınmış",
            renk:"danger"
        });
    }
    if(req.body.verilenIsim!=""){
        await ShortUrl.create({ 
            fullUrl: req.body.fullUrl,
            userId:user._id,
            userAdSoyad:user.adSoyad,
            kısaltılmısUrl: req.body.verilenIsim,
            tarih: newDate
         })
    }
    else{
        await ShortUrl.create({ 
            fullUrl: req.body.fullUrl,
            userId:user._id,
            userAdSoyad:user.adSoyad,
            tarih: newDate
         })
    }



    try {
        return res.render("user/home.ejs", {
            token:token,
            user:user,
            shortUrls: shortUrls,
            message:"Kısa Url Oluşturuldu",
            renk:"success"
        });
    }
    catch(err) {
        console.log(err);
    }
}

const tıklanma=async function(req, res) {
    const kısaltılmısUrl = await ShortUrl.findOne({ kısaltılmısUrl: req.params.shortUrl })
    console.log(req.params);
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