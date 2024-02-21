const mongoose = require("mongoose");

// Define the product schema
const schema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  // discount: {
  //   type: Number,
  //   required: true,
  // },
  expiry: {
    type: Date,
    required: true,
  },
  createdDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  minPurchaseAmont: {
    type: Number,
    required: true,
  },
  maxRedeemableAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  }
});

// Create a mongoose model using the product schema
const CouponDb = mongoose.model("coupon", schema);
// Export the Product model
module.exports = CouponDb;
