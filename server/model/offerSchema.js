const mongoose = require("mongoose");

// Define the product schema
const schema = new mongoose.Schema({
      productName: {
            type: String,
      },
      category: {
            type: String,
      },
      discount: {
            type: Number,
            required: true
      },
      expiry: {
            type: Date,
            required: true
      }
});

const offerDb = mongoose.model("offer", schema);
module.exports = offerDb;
