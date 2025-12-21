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
  messageType: { 
    type: String, 
    enum: ['text', 'image'], 
    default: 'text' 
},
    isReadL:{
        type:Boolean,
        default:false
    }
},{timestamps: true});

MessageSchema.index({ requestId: 1, createdAt: 1 }); // මේකෙන් Query එක ගොඩක් වේගවත් වෙනවා

module.exports = mongoose.model("Message", MessageSchema)
