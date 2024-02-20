var userDb = require("../../model/userSchema");
var otpdb = require("../../model/otpSchema");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

var Category = require('../../model/categorySchema');
var Product = require('../../model/productSchema');
var cartDb = require('../../model/cartSchema');
var Coupon = require("../../model/couponSchema");
var Referral = require("../../model/referralSchema");
const Wallet = require('../../model/walletSchema');

const otpGenrator = () => {
  return `${Math.floor(1000 + Math.random() * 9000)}`;
};

const deleteOtpFromdb = async (_id) => {
  await otpdb.deleteOne({ _id });
};

const sendOtpMail = async (req, res) => {
  req.session.name = req.body.name
  const otp = otpGenrator();
  console.log(otp);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });
  const MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "NovaNex",
      link: "https://mailgen.js/",
      logo: "NovaNex",
    },
  });
  const response = {
    body: {
      // name: req.session.email,
      name: req.session.name,
      intro: "Your OTP for NovaNex verification is:",
      table: {
        data: [
          {
            OTP: otp,
          },
        ],
      },
      outro: "Looking forward to doing more business",
    },
  };

  const mail = MailGenerator.generate(response);

  const message = {
    from: process.env.AUTH_EMAIL,
    to: req.session.user,
    subject: "NovaNex OTP Verification",
    html: mail,
  };

  try {
    const newOtp = new otpdb({
      email: req.session.email,
      otp: otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 60000,
    });
    const data = await newOtp.save();
    req.session.otpId = data._id;
    res.status(200).redirect("/signupOtp");
    await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
  }
};

// create and save new user //---------------------------------------------------deleted
// exports.create = async (req, res) => {
//   const hashedpassword = await bcrypt.hash(req.session.password, 10);

//   // new user
//   const user = new userDb({
//     name: req.session.name,
//     email: req.session.user,
//     phone: req.session.phone,
//     // password: req.body.password
//     password: hashedpassword
//   });

//   // save user in the database
//   user
//     .save(user)
//     .then((data) => {
//       // res.send(data)
//       res.redirect("/login");
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message:
//           err.message ||
//           "Some error accurred while creating a create operation",
//       });
//     });
// };
//-------------------------------------------------------------------------------------

// sendOtpMail

exports.otp = async (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "hi you entered any thing" });
    return;
  }

  const foundUser = await userDb.findOne({ email: req.body.email });
  if (foundUser) {
    console.log(foundUser);
    req.session.foundEmail = "Email is already registered";
    return res.redirect("/register");
  }

  req.session.name = req.body.name,
  req.session.user = req.body.email;
  req.session.phone = req.body.phone,
  req.session.password = req.body.password

  sendOtpMail(req, res);
};

// function

const userOtpVerify = async (req, res) => {
  try {
    const data = await otpdb.findOne({ _id: req.session.otpId });

    if (!data) {
      req.session.err = "OTP Expired";
      req.session.rTime = "0";
      return res.status(401).redirect("/signupOtp");
    }

    if (data.expiresAt < Date.now()) {
      req.session.err = "OTP Expired";
      req.session.rTime = "0";
      deleteOtpFromdb(req.session.otpId);
      return res.status(401).redirect("/signupOtp");
    }

    if (data.otp != req.body.otp) {
      req.session.err = "Wrong OTP";
      req.session.rTime = req.body.rTime;
      return res.status(401).redirect("/signupOtp");
    }

    return true;
  } catch (err) {
    console.log("Function error", err);
    res.status(500).send("Error while quering data err:");
  }
};


//otp verification and save userdata

exports.otpverification = async (req, res) => {
  try {
    if (!req.body.otp) {
      req.session.err = "This Field is required";
    }
    if (req.session.err) {
      req.session.rTime = req.body.rTime;
      return res.status(200).redirect("/signupOtp");
    }
    const response = await userOtpVerify(req, res);

    if (response) {
      deleteOtpFromdb(req.session.otpId);
      req.session.verifyRegisterPage = true;
      const hashedpassword = await bcrypt.hash(req.session.password, 10);

      // new user
      const user = new userDb({
        name: req.session.name,
        email: req.session.user,
        phone: req.session.phone,
        password: hashedpassword,
        referralLink: shortid.generate()
      });
    
      // save user in the database
      const userData =await user.save(user)
        // .then((data) => {
        //   res.status(200).redirect("/login");
        // })        
        // .catch((err) => {
        //   res.status(500).send({
        //     message:
        //       err.message ||
        //       "Some error accurred while creating a create operation",
        //   });
        // });
        console.log("hiii",req.session.referralLink);
        if(req.session.referralLink){
          console.log("referal",req.session.referralLink);
          const referredUser = await userDb.findOne({referralLink:req.session.referralLink})
          const referalOffer = await Referral.find({})
          if(referredUser){
            console.log(referredUser,referalOffer[0].referralBonus,referalOffer[0].signupBonus)
            await Wallet.updateOne({userId: referredUser._id},{$inc: {walletAmount: referalOffer[0].referralBonus}},{ upsert: true })
            await Wallet.findOneAndUpdate({ userId: referredUser._id },
                {
                    $push: {
                        'transactionHistory': {
                            amount: referalOffer[0].referralBonus,
                            paymentType: 'Credit'
                        }
                    }
                })
          }
          await Wallet.updateOne({userId: userData._id},{$inc: {walletAmount: referalOffer[0].signupBonus}},{ upsert: true })
            await Wallet.findOneAndUpdate({ userId: userData._id },
                {
                    $push: {
                        'transactionHistory': {
                            amount: referalOffer[0].signupBonus,
                            paymentType: 'Credit'
                        }
                    }
              })
        }
      res.status(200).redirect("/login");
    }
  } catch (err) {
    console.log("Internal delete error", err);
    res.status(500).send("Error while quering data err:");
  }
};

exports.SignupOtpResend = async (req, res) => {
  try {
    deleteOtpFromdb(req.session.otpId);
    sendOtpMail(req, res, "/userSignupOtpVerify");

    delete req.session.err;
    delete req.session.rTime;
  } catch (err) {
    console.log("Resend Mail err:", err);
  }
};

// User Login

exports.loginCheck = async (req, res) => {
  const log = new userDb({
    email: req.body.email,
    password: req.body.password,
  });
  try {
    const foundUser = await userDb.findOne({ email: log.email });
    if (!foundUser) {
      req.session.validEmail = "user not exist";
      return res.redirect("/login");
    }
    const isPasswordMatch = await bcrypt.compare(
      log.password,
      foundUser.password
    );
    if (isPasswordMatch && !foundUser.isBlocked) {
      req.session.email = log.email;
      req.session.userId = foundUser._id;
      req.session.isUserAuth = true;
      req.session.isUserAuthenticated = true
      res.redirect("/");
    } else {
      if (!isPasswordMatch) {
        req.session.wrongPassword = "Wrong Password";
        res.redirect("/login");
      }
      if (foundUser.isBlocked) {
        req.session.validEmail = "User is blocked by admin";
        res.redirect("/login");
      }
    }
  } catch (err) {
    console.error(err);
    res.redirect("/login");
  }

  // if(foundUser.email===log.email && foundUser.password===log.password ){
  //   //  res.send("Hiii")
  //   res.redirect('/')
  // }else{
  //   req.session.emtPassword = "Wrong Password"
  //   // res.status(401).send({ message: 'password error' });
  //   return res.redirect('/login');
  // }
};

// User Logout
exports.userLogout = async (req,res) =>{
  req.session.isUserAuthenticated=false;
  delete req.session.email
  delete req.session.userId
  res.redirect('/login'); 
}





// Forgot Password

const forgototpsendOtpMail = async (req, res) => {
  const otp = otpGenrator();
  console.log(otp);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });

  const MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "NovaNex",
      link: "https://mailgen.js/",
    },
  });
  const response = {
    body: {
      name: req.session.forgotuser,
      intro: "Your OTP for NovaNex verification is:",
      table: {
        data: [
          {
            OTP: otp,
          },
        ],
      },
      outro: "Looking forward to doing more business",
    },
  };
  const mail = MailGenerator.generate(response);

  const message = {
    from: process.env.AUTH_EMAIL,
    to: req.session.forgotuser,
    subject: "NovaNex OTP Verification",
    html: mail,
  };

  try {
    const newOtp = new otpdb({
      email: req.session.forgotuser,
      otp: otp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 60000,
    });
    const data = await newOtp.save();
    req.session.forgototpId = data._id;
    res.status(200).redirect("/forgotpassword2");
    await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
  }
};


const forgotuserOtpVerify = async (req, res) => {
  try {
    const data = await otpdb.findOne({ _id: req.session.forgototpId });

    if (!data) {
      req.session.err = "OTP Expired";
      req.session.rTime = "0";
      return res.status(401).redirect("/forgotpassword2");
    }

    if (data.expiresAt < Date.now()) {
      req.session.err = "OTP Expired";
      req.session.rTime = "0";
      deleteOtpFromdb(req.session.forgototpId);
      return res.status(401).redirect("/forgotpassword2");
    }

    if (data.otp != req.body.otp) {
      req.session.err = "Wrong OTP";
      req.session.rTime = req.body.rTime;
      return res.status(401).redirect("/forgotpassword2");
    }

    return true;
  } catch (err) {
    console.log("Function error", err);
    res.status(500).send("Error while quering data err:");
  }
};

exports.forgototp = async (req, res) => {
  if (req.body.email.trim()=="") {
    req.session.message= "email is required"
    return  res.redirect("/forgotpassword1");
  }
  const foundUser = await userDb.findOne({ email: req.body.email });
  if (!foundUser) {
    console.log(foundUser);
    req.session.message = "user not exist";
    return res.redirect("/forgotpassword1");
  }

  req.session.forgotuser = req.body.email;

  forgototpsendOtpMail(req, res);
};


exports.forgototpverification = async (req, res) => {
  try {
    if (!req.body.otp) {
      req.session.err = "This Field is required";
    }
    if (req.session.err) {
      req.session.rTime = req.body.rTime;
      return res.status(200).redirect("/forgotpassword2");
    }
    const response = await forgotuserOtpVerify(req, res);

    if (response) {
      deleteOtpFromdb(req.session.forgotOtpResend);
      req.session.verifyChangePassPage = true;
      res.status(200).redirect("/forgotpassword3");
    }
  } catch (err) {
    console.log("Internal delete error", err);
    res.status(500).send("Error while quering data err");
  }
};

exports.forgotOtpResend = async (req, res) => {
  try {
    deleteOtpFromdb(req.session.forgotOtpResend);
    forgototpsendOtpMail(req, res, "/forgotpassword3");

    delete req.session.err;
    delete req.session.rTime;
  } catch (err) {
    console.log("Resend Mail err:", err);
  }
};



exports.updatepassword = async (req, res) => {
  console.log(req.session.forgotuser);

  const hashedpassword = await bcrypt.hash(req.body.password, 10);

  const updateuser = await userDb.updateOne(
    { email: req.session.forgotuser },
    { $set: { password: hashedpassword } }
  );
  console.log(updateuser);
  res.redirect("/login");
};


exports.userProfile = async (req, res) => {
  userEmail = req.query.userEmail;
  try {
    const user = await userDb.findOne({ email: userEmail });
    console.log(req.query.user)
    res.send(user)

  } catch (err) {
    res.status(500).send(err)
  }

}


exports.updateUser = async (req, res) => {
  const userid = req.query.id;
  console.log(userid);
  const {name,phone,oldPassword,newPassword} = req.body
  console.log(oldPassword,newPassword) 
  // res.redirect("/userProfile")
  try{
    const foundUser = await userDb.findOne({ _id: userid });
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      foundUser.password
    );
    const hashedpassword = await bcrypt.hash(newPassword, 10);
    if(!isPasswordMatch){
      req.session.message = "Wrong Password"
      res.redirect("/updateAccount")
    }else{
      await userDb.updateOne({_id:userid},{$set:{
        name:name,
        phone:phone,
        password:hashedpassword
      }})
      res.redirect("/userProfile")
    }
  }catch(err){
    res.status(500).send(err)
  }
}


// exports.searchProducts = async (req,res) =>{
//   try {
//     // const search = req.body.search;
//     const search = req.query.search;
//     console.log(search);
//     const regexPattern = new RegExp(search, 'i');
//     const searchResults = await Product.find({
//       $or: [
//         { productName: regexPattern },
//         { brandName: regexPattern },
//         { category: regexPattern },
//         // { subTitle: regexPattern },
//         // { descriptionHeading: regexPattern },
//         // { description: regexPattern },
//         { color: regexPattern },
//       ],
//     });

//     res.send(searchResults)
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ success: false, message: 'Internal Server Error' });
//   }
// }


// exports.CategoryShow = async (req,res) =>{
//   const categoryList =await Category.find({status:true});
//   res.send(categoryList)
// }

// exports.categoryProductPage = async (req, res) => {
//   const CategoryName = req.query.name
//   // console.log(CategoryName)
//   try {
//     // const product = await Product.find({ category: CategoryName, listed: true })
//     const product = await Product.find({ category: CategoryName, $and: [{ listed: true }, { isCategory: true }]})
//     res.send(product)
//     // console.log("Product:", product);
//   } catch (err) {
//     res.status(500).send(err)
//   }
// }
// exports.productPage = async (req, res) => {
//   const productId = req.query.id
//   const userId = req.query.userId
//   try {
//     if (userId === "undefined") {
//       const product = await Product.find({ _id: productId })
//       const result = { product }
//       return res.send(result)
//     }
//     const isAddedCart = await cartDb.findOne({ userId: userId, "cartItems.productId": productId });
//     const product = await Product.find({ _id: productId })
//     const result = { product, isAddedCart}
//     res.send(result)
//   } catch (err) {
//     res.status(500).send(err)
//   }
// }
//------------------------

// exports.addToCart = async (req, res) => {
//   const productId = req.query.id
//   const userId = req.session.userId
//   if (typeof userId === "undefined") {
//     return res.redirect('/login')
//   }
//   let cart = await cartDb.findOne({ userId: userId, })
//   if (!cart) {
//     cart = new cartDb({
//       userId: userId,
//       cartItems: [{
//         productId: productId
//       }]
//     })
//   } else {
//     cart.cartItems.push({
//       productId: productId
//     })
//   }
//   cart
//     .save()
//     .then(data => {
//       res.redirect("/userCart")
//     })
//     .catch(err => {
//       res.status(400).send({
//         message: err.message || "some error occured while creating option "
//       });
//     });
// }

// show cart 

// exports.showCartPage = async (req, res) => {
//   try {
//     const userId = req.query.id
//     const cartDetails = await cartDb.findOne({ userId: userId }).populate('cartItems.productId');
//     res.send(cartDetails)
//   }
//   catch(error){
//     console.log("err",error.message)
//     res.status(500).send('Internal Server Error');
//   }
// }

// exports.removeCart = async (req, res) => {
//   const userId = req.session.userId
//   const productId = req.query.id
//   try {
//     const cart = await cartDb.findOne({ userId: userId })
//     const index = cart.cartItems.findIndex((value) => {
//       return value.productId.toString() === productId;
//     });
//     cart.cartItems.splice(index, 1)
//     await cart.save()
//     res.redirect('/userCart')
//   } catch (err) {
//     res.status(500).send(err)
//   }
// }

// exports.updateProductQuantity = async (req, res) => {
//   const userId = req.session.userId
//   const productId = req.query.pid
//   const quantity = req.query.quantity
//   try {
//     const product= await Product.findOne({_id: productId})
//     console.log(product.inStock);
//     if(product.inStock < quantity){
//       const data = await cartDb.updateOne({ userId: userId, 'cartItems.productId': productId }, { $set: { 'cartItems.$.quantity': quantity } })
//       req.session.message='out of stock'
//       return res.send({url:'/userCart',message:'out of stock'})
//     }
//     const data = await cartDb.updateOne({ userId: userId, 'cartItems.productId': productId }, { $set: { 'cartItems.$.quantity': quantity } })
//     res.send(true);
//   } catch (err) {
//     res.send(err)
//   }
// }

// exports.userApplyCoupon = async (req, res) => {
//   try {
//       const { couponCode } = req.body
//       const coupon = await Coupon.findOne({ code: couponCode })
//       if (coupon) {
//           const currentDate = new Date();
//           if (coupon.expiry < currentDate) {
//               req.session.invalid = 'Coupon expired';
//           } else if (coupon.maxUse <= 0) {
//               req.session.invalid = 'Coupon usage limit exceeded!';
//           } else {
//               req.session.discount = coupon.discount;
//           }
//       } else {
//           // Coupon code not found
//           req.session.invalid = 'Invalid coupon';
//       }
//       res.redirect('/checkout');
//   } catch (err) {
//       console.error(err);
//       res.status(500).send('Internal server error');
//   }
// }

exports.userApplyCoupon = async (req, res) => {
  try {
    const userId = req.session.userId;
    const cartDetails = await cartDb.aggregate([
      {
        $match: { userId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $unwind: "$cartItems",
      },
      {
        $lookup: {
          from: "products",
          localField: "cartItems.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $lookup: {
          from: "offers",
          localField: "productDetails.offer",
          foreignField: "_id",
          as: "offer"
        }
      },
    ]);
    let totalAmount = 0;
    totalAmount = cartDetails.reduce((total, value) => {
      const discount = value.offer.length !== 0 ? (value.offer[0].discount * value.productDetails[0].lastPrice / 100) : 0;
      return total + Math.round((value.productDetails[0].lastPrice - discount) * value.cartItems.quantity);
    }, 0);
    req.session.checkoutAmount = totalAmount;
    const { couponCode } = req.body;
    const coupon = await Coupon.findOne({ code: couponCode });    
    if (coupon) {
      const currentDate = new Date();
      if (coupon.expiry < currentDate) {
        res.status(400).json({ message: 'coupon expired' });
      // } else if (coupon.maxUse <= 0) {
      //   res.status(400).json({ message: 'Coupon usage limit exceeded!' });
      } else if(coupon.minPurchaseAmont>= totalAmount){
        res.status(400).json({ message: `mininum puchase amount is ${coupon.minPurchaseAmont}!` });
    }else {
        // let randomDiscount = Math.floor(Math.random() * coupon.maxRedeemableAmount) + 1;
        let randomDiscount =  coupon.maxRedeemableAmount;
        // res.status(200).json({ discount: coupon.discount });
        req.session.randomDiscount = randomDiscount
        res.status(200).json({ discount: randomDiscount });
      }
    } else {
      res.status(400).json({ message: 'Invalid coupon' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.removeCoupon = async (req, res) => {
  try {
      // Clear the session variable storing the discount
      const checkoutAmount = req.session.checkoutAmount;
      res.status(200).json({checkoutAmount, message: 'Coupon removed' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
  }
};










// exports.cateogaryproductpage = async (req, res) => {
//   let CategoryName = req.query.category != 'All' ? req.query.category : '';
//   const Max = Number(req.query.Max)
//   const Min = Number(req.query.Min)
//   const sort = req.query.sort
//   if (CategoryName == '' || CategoryName && !Min && !Max && !sort) {
//     console.log("first");
//     try {
//       console.log(CategoryName);
//       const product = await Product.find({ cateogary: { $regex: CategoryName, $options: 'i' }, status: true }).populate('offer')
//       const category = await Category.find({ $and: [{ listed: true }, { isCategory: true }] })
//       const data = { product, category, CategoryName }
//       return res.send(data)
//       console.log("Product:", product);
//     } catch (err) {
//       res.status(500).send(err)
//     }
//   }
//   let product;

//   if (CategoryName && Min && Max && sort) {

//     if (sort == 'low-to-high') {
//       product = await Product.find(
//         {
//           category:CategoryName,status:true,
//           $and: [{ lastprice: { $gte: Min } }, { lastprice: { $lte: Max } }]
//         }
//       ).sort({ lastprice: 1 })
//       console.log(';lll', product);
//     } else {

//       product = await Product.find(
//         {
//           category: CategoryName, $and: [{ listed: true }, { isCategory: true }],
//           $and: [{ lastprice: { $gte: Min } }, { lastprice: { $lte: Max } }]
//         }

//       ).sort({ lastprice: -1 }) 
//     }
//   } else if (CategoryName && sort) {
//       if (sort == 'low-to-high') {  
//       product = await Product.find(
//         { category: CategoryName , $and: [{ listed: true }, { isCategory: true }] }).sort({ lastprice: 1 })  
//     }else {  
//       product = await Product.find(
//         { category: CategoryName , $and: [{ listed: true }, { isCategory: true }]  }).sort({ lastprice: -1 })
//     }
//   } else if (CategoryName && Min && Max) {


//     product = await Product.find(
//       {
//         category: CategoryName, $and: [{ listed: true }, { isCategory: true }],
//         $and: [{ lastprice: { $gte: Min } }, { lastprice: { $lte: Max } }]
//       }
//     )
//   }
//   const category = await Category.find({ $and: [{ listed: true }, { isCategory: true }] })
//   const data = { product, category, CategoryName }
//   res.send(data) 
// }