const mongoose = require("mongoose");

var Category = require('../../model/categorySchema');
var Product = require('../../model/productSchema');
var cartDb = require('../../model/cartSchema');

exports.addToCart = async (req, res) => {
      const productId = req.query.id
      const userId = req.session.userId
      if (typeof userId === "undefined") {
            return res.redirect('/login')
      }
      let cart = await cartDb.findOne({ userId: userId, })
      if (!cart) {
            cart = new cartDb({
                  userId: userId,
                  cartItems: [{
                        productId: productId
                  }]
            })
      } else {
            cart.cartItems.push({
                  productId: productId
            })
      }
      cart
            .save()
            .then(data => {
                  res.redirect("/userCart")
            })
            .catch(err => {
                  res.status(400).send({
                        message: err.message || "some error occured while creating option "
                  });
            });
}

// show cart 

exports.showCartPage = async (req, res) => {
      try {
            const userId = req.query.id
            const cartDetails = await cartDb.findOne({ userId: userId }).populate({
                  path: 'cartItems.productId',
                  populate: {
                      path: 'offer'
                  }
              });
              console.log(cartDetails);
            //   console.log(cartDetails.cartItems[0].productId.offer.discount)
            // const cartDetails = await cartDb.findOne({ userId: userId }).populate('cartItems.productId');
          return  res.send(cartDetails)
      }
      catch (error) {
            console.log("err", error.message)
            res.status(500).send('Internal Server Error');
      }
}
// exports.showCartPage = async (req, res) => {
//       const userId = req.query.id;
//       console.log(userId);
//       try {
//             console.log("lol");
//             let cartDetails = await cartDb.aggregate([
//                   {
//                         $match: { userId: new mongoose.Types.ObjectId(userId) },
//                   },
//                   {
//                         $unwind: "$cartItems",
//                   },
//                   {
//                         $lookup: {
//                               from: "Product",
//                               localField: "cartItems.productId",
//                               foreignField: "_id",
//                               as: "productDetails",
//                         },
//                   },
//                   {
//                         $lookup: {
//                               from: "offer",
//                               localField: "productDetails.offer",
//                               foreignField: "_id",
//                               as: "offers",
//                         },
//                   },
//                   // {
//                   //   $project:{
//                   //     userID:1,
//                   //     cartItems:1,
//                   //     productDetails:1
//                   //   }
//                   // }
//             ]);
//             console.log(cartDetails);
//             console.log("lolkl");
//             res.send(cartDetails);
//       } catch (err) {
//             res.send(err);
//       }
// };

exports.removeCart = async (req, res) => {
      const userId = req.session.userId
      const productId = req.query.pid
      console.log(productId)
      try {
            const cart = await cartDb.findOne({ userId: userId })
            const index = cart.cartItems.findIndex((value) => {
                  return value.productId.toString() === productId;
            });
            cart.cartItems.splice(index, 1)
            await cart.save()
            res.redirect('/userCart')
      } catch (err) {
            res.status(500).send(err)
      }
}

// exports.updateProductQuantity = async (req, res) => {
//       const userId = req.session.userId
//       const productId = req.query.pid
//       const quantity = req.query.quantity
//       try {
//             const product = await Product.findOne({ _id: productId })
//             console.log(product.inStock);
//             if (product.inStock < quantity) {
//                   const data = await cartDb.updateOne({ userId: userId, 'cartItems.productId': productId }, { $set: { 'cartItems.$.quantity': quantity } })
//                   req.session.message = 'out of stock'
//                   return res.send({ url: '/userCart', message: 'out of stock' })
//             }
//             const data = await cartDb.updateOne({ userId: userId, 'cartItems.productId': productId }, { $set: { 'cartItems.$.quantity': quantity } })
//             res.send(true);
//       } catch (err) {
//             res.send(err)
//       }
// }

// exports.updateProductQuantity = async (req, res) => {
//       const userId = req.session.userId;
//       const productId = req.query.pid;
//       const quantity = req.query.quantity;
//       try {
//           const product = await Product.findOne({ _id: productId });
//           if (!product) {
//               return res.status(404).send({ error: 'Product not found' });
//           }
  
//           if (product.inStock < quantity) {
//             //   req.session.message = 'out of stock';
//               return res.send({ url: '/userCart', message: 'outOfStock' });
//           }
  
//           const data = await cartDb.updateOne(
//               { userId: userId, 'cartItems.productId': productId },
//               { $set: { 'cartItems.$.quantity': quantity } }
//           );
//           res.send({ product: product });
//       } catch (err) {
//           console.error('Error:', err);
//           res.status(500).send({ error: 'Internal server error' });
//       }
//   };


exports.updateProductQuantity = async (req, res) => {
      try {
            const userId = req.session.userId
            const totalQuantity = req.query.qid
            const productId = req.query.productId
            await cartDb.updateOne({ userId: userId, "cartItems.productId": productId }, { $set: { "cartItems.$.quantity": totalQuantity } })
            // res.redirect('/userCart')
            res.status(200).json({
              status: true
            })
          } catch (err) {
            res.status(500).send("Internal server error update")
          }
}

