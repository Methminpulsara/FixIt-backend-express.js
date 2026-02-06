const mongoose = require('mongoose')


const PaymentSchema = new mongoose.Schema({

    requestId  :{
        type : mongoose.Schema.Types.ObjectId, 
        ref: "Request",
        required : true
    },
    customerId  :{
        type : mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required : true
    },
    providerId  :{
        type : mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required : true
    },
    amount:{type:Number, required:true},
    method:{
        type:String, 
        enum: ["cash", "online"], default:"cash"
    },
    status:{
        type:String,
        enum: ['pending',"completed" , "failed"], default:"pending"
    },
    paidAt: {
        type:Date
    }
}, {timestamps:true});

module.exports = mongoose.model("Payment" , PaymentSchema)