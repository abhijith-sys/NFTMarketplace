const mongoose = require('mongoose')
const {Schema} =require('mongoose')

const emailSchema = mongoose.Schema({

    to:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    },
    time:{
        type:Date,
        required:true
    },
    status:{
        type:Number,
        required:true
    }

})

module.exports = mongoose.model("email",emailSchema);
