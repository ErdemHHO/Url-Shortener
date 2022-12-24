
const express=require("express");
const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const User=require("../models/user.js");
const jwt=require("jsonwebtoken");

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
        const { adSoyad,sifre,sifreKontrol, email } = req.body;
        console.log(adSoyad,sifre,sifreKontrol, email);

        const kullaniciKontrol = await User.findOne({ email });

        if(kullaniciKontrol){
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
        if(sifre.lenght<6){
            return res.render("auth/signup.ejs",{
                message: "Şifreniz En Az 6 Karakter Olmalıdır",
                renk:"danger"
            })     
        }

        const hashlenmisSifre = await bcrypt.hash(sifre, 12);

        const createdUser = await User.create({
            adSoyad,
            email,
            sifre:hashlenmisSifre,
        })

        console.log(createdUser);

        const token= jwt.sign({id:createdUser._id}, "SECRET_KEY" , {expiresIn:'1h'});

        return res.render("auth/signup.ejs",{
            message: "Kullanıcı Kaydı Oluşturuldu",
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

        const user = await User.findOne({email});

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
        const token=jwt.sign({_id:user._id,adSoyad:user.adSoyad,email:user.email},'jwtPrivateKey');
        console.log(token);
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