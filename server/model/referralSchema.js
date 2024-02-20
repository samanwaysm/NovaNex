const mongoose = require("mongoose");

// Define the product schema
const schema = new mongoose.Schema({
     referralBonus: {
          type: Number,
     },
     signupBonus: {
          type: Number,
      },
});

const referralDb = mongoose.model("referral", schema);
module.exports = referralDb;
