const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    phone:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    isBlocked:{
        type: Boolean,
        default:false
    },
    referralLink:{
        type: String,
        required:true
    }
})

const userDb = mongoose.model('user', schema);

module.exports = userDb;