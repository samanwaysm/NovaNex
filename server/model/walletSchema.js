const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    walletAmount:{
        type: Number,
        default:0
    },
    transactionHistory:[{ 
        amount: {
            type:Number,
            default:0
        },
        paymentType:{
            type: String,
            default:null
        },
        date:{
            type: Date,
            default: Date.now
        },
        reason:{
            type:String,
            default:null
        }
    }]
})

const walletDb = mongoose.model('wallet', schema);

module.exports = walletDb;
