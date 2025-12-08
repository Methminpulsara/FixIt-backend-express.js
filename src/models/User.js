const { default: mongoose } = require("mongoose")


const UserSchema = new mongoose.Schema({

    username : {type:String , required : true, unique : true},
    firstname: {type:String , required: true},
    lastname: {type:String , required: true},
    displayname: {type:String },
    email: {type:String , required: true, unique : true},
    phone: {type:String , required: true},
    password: {type:String , required: true},

    type: {
        type:String,
        enum: ["customer", "mechanic", "garage"],
        requierd: true
    },
   location: {
        lat: { type: Number },
        lng: { type: Number }
    },
    visibilitySettings: {
        showProfile: { type: Boolean, default: true },
        showPhone: { type: Boolean, default: false },
        showLocation: { type: Boolean, default: false }
    },
        createdAt: { type: Date, default: Date.now }


});

module.exports = mongoose.model('User', UserSchema);
