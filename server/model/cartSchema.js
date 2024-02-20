const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    userId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'user'
    },
    cartItems:[{
        productId:{
            type:mongoose.SchemaTypes.ObjectId,
            ref:'Product'
        },
        quantity:{
            type:Number,
            default:1
        }
    }]
})

const cartDb = mongoose.model('cartDb',schema);
module.exports = cartDb