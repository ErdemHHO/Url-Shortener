
// const auth = function (req, res, next) {
//     if(global.token == ""){
//         console.log("token boş");
//         return res.redirect("/user/logout");
//     }else{
//         console.log("token dolu");
//         console.log(global.token);
//     }

//     try {
//         next();
//     }
//     catch(erroor) {
//         console.log(error);
//     }
// }

module.exports = (req, res, next) => {
    if(typeof token == "undefined") {
        return res.redirect("/auth/signin");
    }
    next();
}

