
const express=require("express");

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

const logout=async function(req, res) {
    try {
        return res.redirect("/auth/signin")
    }
    catch(err) {
        console.log(err);
    }
}

module.exports={
    home,logout
}