
const express=require("express");
const ShortUrl = require('../models/shortUrl');
const AuthSchema=require("../models/user.js");
const config = require("../config/config.js");
const emailService=require("../helpers/send-mail");
const shortId = require('shortid');

const router = express.Router();



const start=async function(req,res){
    try {
        return res.redirect("/home");
    } catch (error) {
        console.log(error);
    }
}

const home=async function(req, res) {
    let token=global.token;
    let user=global.user;
    if(user.rol!="USER"){
        return res.redirect("/admin/dashboard");
    }
    console.log(user);
    const shortUrls = await ShortUrl.find( {userId : user._id})

    try {
        return res.render("user/home.ejs", {
            token:token,
            user:user,
            shortUrls: shortUrls,
        });
    }
    catch(err) {
        console.log(err);
    }
}

const homeP=async function(req, res) {

    let token=global.token;
    let user=global.user;

    console.log("****************************************");
    console.log(req.body);
    console.log("****************************************");

    let date = new Date();
    const currentDateString = date.toISOString().split('.')[0];
    

    const istenenTarih =req.body.bitisSaati;
    const bosluk = req.body.verilenIsim.lastIndexOf(" ");
    const shortUrls = await ShortUrl.find( {userId : user._id});
    const kullanilmisUrl = await ShortUrl.findOne( {kısaltılmısUrl : req.body.verilenIsim});
    let takmaUrl=shortId.generate();
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
        takmaUrl=req.body.verilenIsim;
        await ShortUrl.create({ 
            fullUrl: req.body.fullUrl,
            userId:user._id,
            userAdSoyad:user.adSoyad,
            kısaltılmısUrl:takmaUrl,
            tarih: date,
            bitisTarihi:istenenTarih
         })
    }
    else{
        await ShortUrl.create({ 
            fullUrl: req.body.fullUrl,
            userId:user._id,
            userAdSoyad:user.adSoyad,
            tarih: date,
            bitisTarihi:istenenTarih,
            kısaltılmısUrl:takmaUrl
         })
    }

    emailService.sendMail({
        from:config.email.from,
        to:user.email,
        subject:"Url Oluşturuldu",
        html:'<p> Urliniz oluşturuldu.</p> <br> <p> Gerçek Url: ' + req.body.fullUrl + '</p>  <br>  <p> Dönüştürüdüğüz Url : http://localhost:3000/'+takmaUrl+' </p> <br><p> Oluşturulma Tarihi:'+currentDateString+ '</p> <br> <p>Geçerlilik Tarihi:'+istenenTarih+'</p>'
        });

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

const silme=async function(req, res) {
    console.log(req.params)
    let token=global.token;
    let user=global.user;
    const url = await ShortUrl.findOne({ _id: req.params.id });
    await ShortUrl.deleteOne({ _id: req.params.id });
    const shortUrls = await ShortUrl.find( {userId : user._id})


    try {
    if(!url){
        return res.render("user/home.ejs", {
            token:token,
            user:user,
            shortUrls: shortUrls,
            message2:"Silmek İstediğiniz Url Bulunamadı",
            renk2:"danger"
        });
    }
    return res.redirect("/home");
    }
    catch(err) {
        console.log(err);
    }
}

// const tıklanma=async function(req, res) {
//     try {
//         const kisaltilmisUrl = await ShortUrl.findOne({ kısaltılmısUrl: req.params.shortUrl });
//         const date = new Date();
//         console.log(date);
//         const currentDateString = date.toISOString().split('.')[0];
    
//         const bitisTarihi=kisaltilmisUrl.bitisTarihi;
//         console.log(bitisTarihi);
//         const futureDate = new Date(bitisTarihi);
//         console.log(futureDate);
    
//         const differenceInMilliseconds = futureDate.getTime() - date.getTime();
//         const differenceInMinutes = differenceInMilliseconds / (1000 * 60);
    
//         console.log(differenceInMinutes);
    
//         if(differenceInMinutes<0){
//             return res.redirect("/erisim");
//         }
    
//         if (kisaltilmisUrl == null) return res.sendStatus(404)
//         kisaltilmisUrl.tıklanma++;
//         kisaltilmisUrl.save();
    
//         return res.redirect(kisaltilmisUrl.fullUrl);
//     } catch (error) {
//         console.log(error);
//     }

// }
const erisim=async function(req, res) {
    try {
        return res.render("user/erisim.ejs")
    }
    catch(err) {
        console.log(err);
    }
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
    home,logout,homeP,erisim,silme,start
}