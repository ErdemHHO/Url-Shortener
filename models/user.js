const mongoose=require("mongoose");
const jwt = require("jsonwebtoken");

const AuthSchema = new mongoose.Schema({
    adSoyad: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    sifre: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },
    date: {
        type: Date,
        default: new Date()
    },
})


module.exports= mongoose.model('user',AuthSchema);
