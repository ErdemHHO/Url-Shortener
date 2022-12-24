
const express=require("express");
const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const User=require("../models/user.js");

const router = express.Router();


//signup
const signup_get=async function(req, res) {
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
        const ad= req.body.ad;
        const soyad= req.body.soyad;
        const sifre= req.body.sifre;
        const sifreKontrol= req.body.sifreKontrol;
        const telefon= req.body.telefon;
        const email= req.body.email;
        console.log(ad, soyad,sifre,sifreKontrol, telefon, email);

        const kullaniciKontrol = await User.findOne({ email });

        if(kullaniciKontrol){
            return res.status(400).json({ message: 'Bu E-postaya sahip bir kullanıcı mevcut'});
        }
        if(sifre!==sifreKontrol){
            return res.status(400).json({ message: 'Şifreler eşleşmiyor'});
        }
        if(sifre.lenght<6){
            return res.status(400).json({ message: 'Şifre en az 6 karakter olmalıdır.'});
        }

        const hashlenmisSifre = await bcrypt.hash(sifre, 10);

        const createdUser = await User.create({
            ad,
            soyad,
            email,
            sifre:hashlenmisSifre,
            telefon
        })
        console.log(createdUser);

        return res.status(400).json({ message: 'Hesabınız oluşturuldu'});

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

        const user = await User.findOne({email});

        if(!user){
            return res.render("auth/signin.ejs",{
                message: "Kullanıcı Kaydı Yok"
            })     
        }    

        
        const isPasswordCorrect = await bcrypt.compare(sifre, user.sifre);
        if(isPasswordCorrect){
            //login oldu
            return res.redirect("/loading");
          }
    } catch (error) {
       console.log(error)
    }
}
const signin_get=async function(req, res) {
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