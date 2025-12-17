const mongoose = require('mongoose')


const RequestSchema = new mongoose.Schema({


    // request ek dhmme kud = customer 
    customerId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },

    // job ek accept krnne kud 
    providerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },

    // Request type
    requestType:{
        type:String, 
        enum:["mechanic", "garage"],
    },

    // issue and vehicle details 
    issueDescription: {type:String, required:true },
    vehicleDetails: {type:String},

    // request location
    location:{
        type: {type:String, enum:["Point"], default:"Point"},
        coordinates: {type:[Number] ,required:true}// longitude, latitude
    },

    // job eke accep or reject
    status:{
        type:String,
        enum:["pending", "accepted", "in_progress" , "completed", "cancelled"],
        default:"pending"
    },

    // time
    acceptedAt:{type:Date,default:null},
    completedAt:{type:Date, default:null}

},{timestamps:true});

//  Geo-Spatial Queries For Index 
RequestSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Request" , RequestSchema)