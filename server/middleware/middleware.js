const express = require("express");
const session = require("express-session");
var userDb = require("../model/userSchema");
var cartDb = require("../model/cartSchema");
const app = express();

// exports.isBlocked = async (req,res,next) =>{
//     try{
//       const email = req.session.email;
//       console.log(userEmail);
//       if(!userEmail){
//          return next()
//       }
//       if(email){
//         const userBlocked = await userDb.findOne({email:email});
//         console.log(userBlocked);
//         if(userBlocked.isBlocked){
//           req.session.destroy();
//           res.redirect('/login');
//         }else{
//           next()
//         }
//       }

//     }
//     catch(error){
//       res.status(500).send('internal server error')
//     }
//   }

function isUserAuthenticated(req, res, next) {
  if (req.session.isUserAuthenticated === true) {
    return next();
  }
  res.redirect("/login");
}

function isUserNotAuthenticated(req, res, next) {
  if (req.session.isUserAuthenticated === true) {
    return res.redirect("/");
  }
  next();
}

function isAdminAuthenticated(req, res, next) {
  if (req.session.isAdminAuthenticated === true) {
    return next();
  }
  res.redirect("/adminLogin");
}

function isAdminNotAuthenticated(req, res, next) {
  if (req.session.isAdminAuthenticated === true) {
    return res.redirect("/adminDash");
  }
  next();
}

// isUserBlocked: async (req, res, next) => {
async function isUserBlocked(req, res, next) {
  const email = req.session.email;

  if (email) {
    console.log(email);
    const user = await userDb.findOne({ email });
    console.log(user);
    if (user.isBlocked) {
      console.log("block");
      req.session.isUserAuthenticated = false;
      res.redirect("/Login");
    } else {
      next();
    }
  }
}

async function isCart(req, res, next) {
  const userId = req.session.userId;

  if (userId) {
    console.log(userId);
    const cart = await cartDb.findOne({ userId: userId });
    console.log(cart);
    if (cart.cartItems.length < 1) {
      console.log("block");
      res.redirect("/userCart");
    }
    else {
      next();
    }
  }
}

// function isOrdered(req, res, next) {
//   if (req.session.orderSuccess === true) {
//     next();
//   }
//   return res.redirect("/");
// }


module.exports = {
  isUserAuthenticated,
  isUserNotAuthenticated,
  isAdminAuthenticated,
  isAdminNotAuthenticated,
  isUserBlocked,
  isCart
};

// module.exports = {isAdminAuthenticated,isAdminNotAuthenticated};
