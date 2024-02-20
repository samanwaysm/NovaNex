var userDb = require("../../model/userSchema");
var otpdb = require("../../model/otpSchema");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const mongoose = require("mongoose");
var Category = require('../../model/categorySchema');
var Product = require('../../model/productSchema');
var cartDb = require('../../model/cartSchema');
var Coupon = require("../../model/couponSchema");

exports.searchProducts = async (req,res,next) =>{
    // try {
    //   // const search = req.body.search;
    //   const search = req.query.search;
    //   console.log(search);
    //   const regexPattern = new RegExp(search, 'i');
    //   const searchResults = await Product.find({
    //     $or: [
    //       { productName: regexPattern },
    //       { brandName: regexPattern },
    //       { category: regexPattern },
    //       // { subTitle: regexPattern },
    //       // { descriptionHeading: regexPattern },
    //       // { description: regexPattern },
    //       { color: regexPattern },
    //     ],
    //   }).populate('offer');
  
    //   res.send(searchResults)
    // } catch (error) {
    //   console.error(error);
    //   res.status(500).send({ success: false, message: 'Internal Server Error' });
    // }

    try {
      const search = req.body.search;
      // const product = await Product.find({
      //   $or: [
      //     { productName: { $regex: search }, $and: [{ listed: true }, { isCategory: true }] },
      //     { brandName: { $regex: search }, $and: [{ listed: true }, { isCategory: true }] },
      //   ],
      // }).populate('offer');
      const regexPattern = new RegExp(search, 'i');
      const product = await Product.find({
        $or: [
          { productName: regexPattern },
          { brandName: regexPattern },
          { category: regexPattern },
          // { subTitle: regexPattern },
          // { descriptionHeading: regexPattern },
          // { description: regexPattern },
          { color: regexPattern },
        ],
      }).populate('offer');
  
      const CategoryName = "All";
      // const CategoryName = product.category;
      const category = await Category.find({ status: true });
      const data = { product,category,CategoryName };
  
      res.send(data);
    } catch (err) {
      next(err);
    }
  }



  exports.CategoryShow = async (req,res, next) =>{
    try{
      const categoryList =await Category.find({status:true});
      const Coupons = await Coupon.find({status:true})
      const data = {categoryList,Coupons}
      res.send(data)
    }catch(err){
      next(err)
    }
    
  }
  
  // exports.categoryProductPage = async (req, res, next) => {
  //   const CategoryName = req.query.name
  //   try {
  //     // const product = await Product.find({ category: CategoryName, listed: true })
  //     const product = await Product.find({ category: CategoryName, $and: [{ listed: true }, { isCategory: true }]}).populate('offer');
  //     res.send(product)
  //   } catch (err) {
  //     next(err)
  //   }
  // }
  exports.productPage = async (req, res, next) => {
    const productId = req.query.id
    const userId = req.query.userId
    try {
      if (userId === "undefined") {
        const product = await Product.find({ _id: productId }).populate('offer');
        const result = { product }
        return res.send(result)
      }
      const isAddedCart = await cartDb.findOne({ userId: userId, "cartItems.productId": productId });
      const product = await Product.find({ _id: productId }).populate('offer');
      const result = { product, isAddedCart}
      res.send(result)
    } catch (err) {
      // res.status(500).send(err)
      next(err)
    }
  }

  

  exports.categoryProductPage = async (req, res) => {
    try {
        const userId= req.params.id;
        console.log(userId);
        let categoryName = (req.query.category === "All" || req.query.category === "undefined") ? "" : req.query.category;
        const Max = Number(req.query.Max);
        const Min = Number(req.query.Min);
        const sort = req.query.sort;
        const search = req.query.search;

        let product;

        if (search && search !== "undefined") {
            const regexPattern = new RegExp(search, 'i');
            product = await Product.find({
                $or: [
                    { productName: regexPattern },
                    { brandName: regexPattern },
                    { category: regexPattern },
                    { color: regexPattern },
                ],
                $and: [{ listed: true }, { isCategory: true }]
            }).populate('offer');
        } else {
            if (!categoryName && !Min && !Max && !sort) {
                // Get all products without any filters
                product = await Product.find({
                    $and: [{ listed: true }, { isCategory: true }]
                }).populate('offer');
            } else {
                // Construct query based on filters
                const query = {
                    $and: [{ listed: true }, { isCategory: true }]
                };

                if (categoryName) {
                    query.category = { $regex: categoryName, $options: "i" };
                }

                if (Min && Max) {
                    query.lastPrice = { $gte: Min, $lte: Max };
                }

                if (sort === "low-to-high") {
                    product = await Product.find(query).populate('offer').sort({ lastPrice: 1 });
                } else if (sort === "high-to-low") {
                    product = await Product.find(query).populate('offer').sort({ lastPrice: -1 });
                } else {
                    product = await Product.find(query).populate('offer');
                }
            }
        }
        console.log(userId);
        let cartDetails = [];
        if(userId!="undefined"){
           cartDetails= await cartDb.aggregate([
            {
              $match: {
                userId: new mongoose.Types.ObjectId(userId)
              }
            },
            {
              $unwind: "$cartItems"
            },
            {
              $group: {
                _id: null,
                items: {
                  $push: {
                    $toString: "$cartItems.productId"
                  }
                }
              }
            }
          ]);
        }
        // const cartDetails = await cartDb.findOne({ userId: userId })
        
        
      console.log("cart",cartDetails);
        const category = await Category.find({ status: true });
        let cartt = (cartDetails.length==0)?[]:cartDetails[0]?.items;
        const data = { product, category, categoryName, cartDetails:cartt};
        // console.log(data);
        res.send(data);

    } catch (err) {
        console.error("Error:", err);
        res.status(500).send("Internal Server Error");
    }
};


