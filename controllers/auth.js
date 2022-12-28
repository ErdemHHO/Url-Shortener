
const express=require("express");
const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const AuthSchema=require("../models/user.js");
const jwt=require("jsonwebtoken");
const emailService=require("../helpers/send-mail");
const config = require("../config/config.js");
const router = express.Router();
const ShortUrl = require('../models/shortUrl');

//signup
const signup_get=async function(req, res) {
    const shortUrls = await ShortUrl.find( {_id :"63ac8ae1c436bb2bce71fb1d"});
    console.log(shortUrls);
    delete global.token;
    delete global.user;
    try {
        res.render("auth/signup.ejs", {
        });
    }
    catch(err) {
        console.log(err);
    }
}
const signup_post=async function(req, res) {
    try {
        const { adSoyad,sifre,sifreKontrol, email } = req.body;
        console.log(adSoyad,sifre,sifreKontrol, email);

        const user = await AuthSchema.findOne({ email: req.body.email });

        if(user){
            return res.render("auth/signup.ejs",{
                message: "Bu E-Postaya Sahip Bir Kullanıcı Var",
                renk:"danger"
            })     
        }
        if(sifre!==sifreKontrol){
            return res.render("auth/signup.ejs",{
                message: "Şifreler Eşleşmiyor",
                renk:"danger"
            })     
        }
        if(sifre.length<6){
            return res.render("auth/signup.ejs",{
                message: "Şifreniz En Az 6 Karakter Olmalıdır",
                renk:"danger"
            })     
        }

        const hashlenmisSifre = await bcrypt.hash(sifre, 12);

        const newUser = await AuthSchema.create({
            adSoyad,
            email,
            sifre:hashlenmisSifre,
        })

        console.log(newUser);
        emailService.sendMail({
            from:config.email.from,
            to:newUser.email,
            subject:"Hosgeldiniz",
            html:'<p> Hesabınız başarılı bir şekilde oluşturuldu.</p> <br> <p> Hoşgeldin ' + newUser.adSoyad + '!  </p>  <br>  <p> Şifreniz : '+ sifre +' </p> '
            });
        return res.render("auth/signup.ejs",{
            message: "Kullanıcı Kaydı Oluşturuldu Giriş Yap",
            renk:"success"
        })   
    } catch (error) {
        console.log(error);
    }
}


//signin
const signin_post=async function(req, res) {
    try {
        const email=req.body.email;
        console.log(email);
        const sifre=req.body.sifre;
        console.log(sifre);

        const user = await AuthSchema.findOne({email});

        if(!user){
            return res.render("auth/signin.ejs",{
                message: "Kullanıcı Kaydı Yok",
                renk:"danger"
            })     
        }    
        const isPasswordCorrect = await bcrypt.compare(sifre, user.sifre);
        if(!isPasswordCorrect){
            return res.render("auth/signin.ejs",{
                message: "Şifre Yanlış",
                renk:"danger"
            })   
          }
        const token=jwt.sign({id:user._id},"SECRET_KEY",{expiresIn:'1h'});

        global.user=user;
        global.token=token;
        console.log(global);

        return res.redirect("/home");
        
    } catch (error) {
       console.log(error)
    }
}
const signin_get=async function(req, res) {
    delete global.token;
    delete global.user;
    try {
        return res.render("auth/signin.ejs", {
        });
    }
    catch(err) {
        console.log(err);
    }
}


module.exports={
    signup_post,signup_get,
    signin_post,signin_get,
}