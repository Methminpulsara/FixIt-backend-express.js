const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({

    requestId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Request",
        required : true
    },
    senderId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    receiverId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    message:{
        type : String,
        required : true
    },
    isReadL:{
        type:Boolean,
        default:false
    }
},{timestamps: true});

module.exports = mongoose.model("Message", MessageSchema)
