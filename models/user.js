const mongoose=require("mongoose");

const userSchema = mongoose.model('User',{
    ad: {
        type: String,
        required: true
    },
    soyad: {
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
    telefon: {
        type: String,
        required: true
    },
})

module.exports=userSchema;