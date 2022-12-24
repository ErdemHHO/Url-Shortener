const mongoose=require("mongoose");

const userSchema = mongoose.model('User',{
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

module.exports=userSchema;