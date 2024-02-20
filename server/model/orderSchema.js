const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        required: true
    },
    orderItems: [
        {
            productId: {
                type:mongoose.Schema.ObjectId,
                required: true,
            },
            productName: {
                type: String,
                required: true
            },
            brandName: {
                type: String,
                required: true
            },
            category: {
                type: String,
                required: true
            },
            subTitle:{
                type:String,
                required:true
            },
            descriptionHeading:{
                type:String,
                required:true
            },
            description: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            mrp:{
                type:Number,
                required:true
            },
            discount:{
                type:Number,
                required:true
            },
            color:{
                type:String,
                required:true
            },
            image:[
                {
                    type:String,
                    required:true
                }
            ],
            orderStatus:{
                type:String,
                default:"Ordered",
                required:true
            },
            orderID:{
                type:Number
            }
        }
    ],
    paymentMethod:{
        type:String,
        required:true
    },
    orderDate:{
        type:Date,
        default:Date.now()
    },
    address: [
        {
            fullName: {
                type: String,
                required: true
            },
            pincode: {
                type: Number,
                required: true
            },
            locality: {
                type: String,
                required: true
            },
            address: {
                type: String,
                required: true
            },
            district: {
                type: String,
                required: true
            },
            state: {
                type: String,
                    required: true
            },
            structuredAddress: {
                type: String,
                required: true
            }
        }
    ],
    totalAmount:{
        type:Number
    },
})

const Order = mongoose.model('order',schema);

module.exports = Order;


