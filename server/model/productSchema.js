const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    brandName:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    subTitle:{
        type:String,
        required:true
    },
    descriptionHeading:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    firstPrice:{
        type:Number,
        required:true
    },
    lastPrice:{
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
    inStock:{
        type:Number,
        required:true
    },
    image:[{
        type:String,
        required:true
    }],
    listed:{
        type:Boolean,
        default:true
    },
    isCategory:{
        type:Boolean,
        default:true
    },
    offer: {
        type: mongoose.SchemaTypes.ObjectId,
        default: null,
        ref: 'offer'
    },
    popularProducts:{
        type:Number,
        default:0,
    }
});

const Product = mongoose.model('Product',schema)

module.exports = Product