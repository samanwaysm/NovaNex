const mongoose = require("mongoose");
var easyinvoice = require("easyinvoice");

var Order = require("../../model/orderSchema");
var Category = require("../../model/categorySchema");
var Product = require("../../model/productSchema");
var cartDb = require("../../model/cartSchema");
var addressDb = require("../../model/addressSchema");
const Wallet = require("../../model/walletSchema");
var Coupon = require("../../model/couponSchema");

const Razorpay = require("razorpay");
const { log } = require("console");
const instance = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret,
});

exports.userCheckout = async (req, res) => {
  try {
    const userId = req.session.userId;
    // console.log(userId);
    const { paymentMethod, defaultAddress,couponCode } = req.body;
    // console.log(defaultAddress)

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
    // console.log("dfg",cartDetails[0].offer[0].discount);
    // if(!couponCode){
    //   // console.log("without Coupon");
    //   totalAmount = cartDetails.reduce((total, value) => {
    //     const t = value.offer.length !== 0 ? (value.offer[0].discount * value.productDetails[0].lastPrice / 100) : 0;
    //     return total += Math.round((value.productDetails[0].lastPrice-t * value.cartItems.quantity));
    //   }, 0);
    // }else{
    //   // console.log("with Coupon");
    //   const coupon = await Coupon.findOne({ code: couponCode });
    //   total = cartDetails.reduce((total, value) => {
    //     const t = value.offer.length !== 0 ? (value.offer[0].discount * value.productDetails[0].lastPrice / 100) : 0;
    //     return total += Math.round((value.productDetails[0].lastPrice-t * value.cartItems.quantity));
    //   }, 0);
    //   // totalAmount = total - total*Number(coupon.discount)/100
    //   totalAmount = total - coupon.maxRedeemableAmount
    // }
    // console.log("tot",totalAmount);


if (!couponCode) {
    // Calculate total amount without coupon
    totalAmount = cartDetails.reduce((total, value) => {
        const discount = value.offer.length !== 0 ? (value.offer[0].discount * value.productDetails[0].lastPrice / 100) : 0;
        return total + Math.round((value.productDetails[0].lastPrice - discount) * value.cartItems.quantity);
    }, 0);
} else {
    // Calculate total amount with coupon
    const coupon = await Coupon.findOne({ code: couponCode });

    if (coupon) {
        totalAmount = cartDetails.reduce((total, value) => {
            const discount = value.offer.length !== 0 ? (value.offer[0].discount * value.productDetails[0].lastPrice / 100) : 0;
            return total + Math.round((value.productDetails[0].lastPrice - discount) * value.cartItems.quantity);
        }, 0);

        // Deduct coupon discount from total amount
        totalAmount -= req.session.randomDiscount;
    } else {
        // Handle case where coupon is not found
        console.log("Coupon not found");
    }
}

console.log("Total Amount:", totalAmount);


    req.session.totalAmount = totalAmount;

    // Function to generate a random 6-digit number
    function generateOrderID() {
      return Math.floor(100000 + Math.random() * 900000);
    }

    const orderID = generateOrderID();
    // console.log(orderID); 

    const userWallet = await Wallet.findOne({ userId: userId });
    // console.log(userWallet); 


    let userCart = await cartDb.aggregate([
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
        $project: {
          userID: 1,
          cartItems: 1,
          productDetails: 1,
        },
      },
    ]);
    
    const address = await addressDb.aggregate([
      { $unwind: "$address" },
      {
        $match: { "address._id": new mongoose.Types.ObjectId(defaultAddress) },
      },
    ]);
    // console.log(address)

    // if (address.length > 0) {
    const valueAddress = {
      fullName: address[0].address.fullName,
      pincode: address[0].address.pincode,
      locality: address[0].address.locality,
      address: address[0].address.address,
      district: address[0].address.district,
      state: address[0].address.state,
      structuredAddress: address[0].address.structuredAddress,
    };
    // console.log(valueAddress);
    // }

    const orderItems = userCart.map((data) => {
      return {
        productId: data.cartItems.productId,
        quantity: data.cartItems.quantity,
        productName: data.productDetails[0].productName,
        brandName: data.productDetails[0].brandName,
        category: data.productDetails[0].category,
        subTitle: data.productDetails[0].subTitle,
        descriptionHeading: data.productDetails[0].descriptionHeading,
        description: data.productDetails[0].description,
        price: data.productDetails[0].lastPrice,
        mrp: data.productDetails[0].firstPrice,
        discount: data.productDetails[0].discount,
        color: data.productDetails[0].color,
        image: data.productDetails[0].image,
        orderID:orderID
      };
    });

    // orderItems.forEach(async (data) => {
    //   // console.log('stock qty',data.quantity,typeof(data.quantity));
    //   const d = await Product.updateOne(
    //     { _id: data.productId },
    //     { $inc: { inStock: -data.quantity } }
    //   );
    //   // console.log(d);
    // });

    // req.session.totalAmount = req.body.totalAmount;
    const newOrder = new Order({
      userId: req.session.userId,
      orderItems: orderItems,
      address: valueAddress,
      couponDiscount: req.session.randomDiscount,
      totalAmount: totalAmount,
      paymentMethod:
        req.body.paymentMethod === "cod"
          ? "cod"
          : req.body.paymentMethod === "online"
          ? "online"
          : "wallet" ?? "wallet",
    });

    if (req.body.paymentMethod === "cod") {
      await newOrder.save();
      await cartDb.updateOne(
        { userId: req.session.userId },
        { $set: { cartItems: [] } }
      );
      newOrder.orderItems.forEach(async (data) => {
          const d = await Product.updateOne(
            { _id: data.productId },
            { $inc: { inStock: -data.quantity } }
        );
      });
      req.session.orderSuccess = true;
      return res.json({
        status: "success",
        paymentMethod: "cod",
        url: "/orderSuccess",
      });
    }
    if (req.body.paymentMethod === "wallet") {
      if (totalAmount <= userWallet.walletAmount) {
      await newOrder.save();
      await cartDb.updateOne(
        { userId: req.session.userId },
        { $set: { cartItems: [] } }
      ); // empty cart items
      await Wallet.updateOne(
        { userId: req.session.userId },
        { $inc: { walletAmount : -(totalAmount)} },
        { upsert: true }
      );
      await Wallet.findOneAndUpdate(
        { userId: req.session.userId },
        {
          $push: {
            'transactionHistory': {
              amount: totalAmount,
              paymentType: 'Debit',
              reason:'Ordered'
            }
          }
        }
      )
      newOrder.orderItems.forEach(async (data) => {
        const d = await Product.updateOne(
          { _id: data.productId },
          { $inc: { inStock: -data.quantity } }
        );
      });
      return res.json({
        status: "success",
        paymentMethod: "wallet",
        url: "/orderSuccess",
      });
    }else{
      return res.json({
        status: "failed",
        message:"Insufficient wallet balance"
      });
      // return res.status(400).json({
      //   status:"Failed",
       
      // });
    }
    }
    if (req.body.paymentMethod === "online") {
      const options = {
        // amount:TPrice ,
        amount: totalAmount* 100,
        currency: "INR",
        receipt: "" + newOrder._id,
      };

      const order = await instance.orders.create(options);
      req.session.newOrder = newOrder;
      return res.status(200).json({
        success: true,
        msg: "order created",
        key_id: instance.key_id,
        order: order,
      });
    }
    // return res.status(302).redirect('/orderSuccess');
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal server error usercheckout");
  }
};

exports.onlinePaymentSuccessfull = async (req, res) => {
  try {
    const crypto = require("crypto");
    const hmac = crypto.createHmac("sha256", instance.key_secret);
    hmac.update(
      req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id
    );
    if (hmac.digest("hex") === req.body.razorpay_signature) {
      const newOrder = new Order(req.session.newOrder);
      await newOrder.save();
      await cartDb.updateOne(
        { userId: req.session.userId },
        { $set: { cartItems: [] } }
      ); 
      req.session.newOrder.orderItems.forEach(async (data) => {
        const d = await Product.updateOne(
          { _id: data.productId },
          { $inc: { inStock: -data.quantity } }
        );
      });

      req.session.orderSucessPage = true;
      return res.status(200).redirect("/orderSuccess");
    } else {
      return res.send("Order Failed");
    }
  } catch (err) {
    console.error("order razorpay err", err);
    res.status(500).send("Internal server error");
  }
};

exports.userOrders = async (req, res) => {
  const userId = req.query.id;
  // console.log(userId);
  const page = req.query.page || 1;
  const limit = 30;
  try {
    const Orders = await Order.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $unwind: {
          path: "$orderItems",
        },
      },
      {
        $sort: {
          orderDate: 1,
        },
      },
      // {
      //   $skip:limit*(page-1)
      // },
      // {
      //   $limit:limit
      // }
    ]);

    const totalPages = await Order.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $unwind: {
          path: "$orderItems",
        },
      },
      {
        $group:{
          _id:null,
          count:{$sum:1}
        }
      }
    ])
    // const data= await Order.find({userId:userId})
    // console.log(data);
    const data = {Orders,totalPages}
    // console.log(data);
    res.send(data);
  } catch (err) {
    res.send(err);
  }
};



exports.updateCanceled = async (req, res) => {
  const id = req.query.id;
  const productId = req.query.productId;
  const quantity = req.query.quantity;
  const userId = req.session.userId;
  console.log(id);
  try {
    const order = await Order.findOne({"orderItems._id": id})
    const orderItem = await Order.aggregate([
      {
        $unwind: '$orderItems'
      },
      {
        $match: {
          'orderItems._id': new mongoose.Types.ObjectId(id)
        }
      }
    ]);
    // console.log("order",orderItem);
    await Order.updateOne(
      { "orderItems._id": id },
      { $set: { "orderItems.$.orderStatus": "Canceled" } }
    );
    const d = await Product.updateOne(
      { _id: productId },
      { $inc: { inStock: quantity } }
    );

    console.log("len",order.orderItems.length);
    if(order.orderItems.length == 1){
      const amount = order.totalAmount
      await Wallet.updateOne(
        {userId: userId },
        { $inc: { walletAmount: amount } }
      );
      await Wallet.findOneAndUpdate(
        { userId: userId },
        {
          $push: {
            'transactionHistory': {
              amount: amount,
              paymentType: 'Credit',
              reason: 'Canceled Order'
            }
          }
        }
      )
    }else{
      console.log("skkss");
      const productNum = order.orderItems.length
      let discAmount = 0;
      if (order.couponDiscount >0) {
        console.log("cou");
        discAmount = (order.couponDiscount/productNum)
      }
      console.log(productNum,discAmount);
      console.log("cdf",orderItem[0].orderItems.price,orderItem[0].orderItems.quantity);
      const amount = (orderItem[0].orderItems.price*orderItem[0].orderItems.quantity)-discAmount
      console.log("amt",amount)
      await Wallet.updateOne(
        {userId: userId },
        { $inc: { walletAmount: amount } }
      );
      await Wallet.findOneAndUpdate(
        { userId: userId },
        {
          $push: {
            'transactionHistory': {
              amount: amount,
              paymentType: 'Credit',
              reason: 'Canceled Order'
            }
          }
        }
      )
    }
    
    // console.log('kjk',d);
    res.redirect("/userOrders");
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateReturned = async (req, res) => {
  const id = req.query.id;
  const productId = req.query.productId;
  const quantity = req.query.quantity;
  const userId = req.session.userId;
  // try {
  //   const order = await Order.findOne({"orderItems._id": id})
  //   await Order.updateOne(
  //     { "orderItems._id": id },
  //     { $set: { "orderItems.$.orderStatus": "Returned" } }
  //   );
  //   const d = await Product.updateOne(
  //     { _id: productId },
  //     { $inc: { inStock: quantity } }
  //   );
  //   const amount = order.totalAmount
  //   await Wallet.updateOne(
  //     {userId: userId },
  //     { $inc: { walletAmount: amount } }
  //   );
  //   await Wallet.findOneAndUpdate(
  //     { userId: userId },
  //     {
  //       $push: {
  //         'transactionHistory': {
  //           amount: amount,
  //           paymentType: 'Credit',
  //           reason:'Returned Order'
  //         }
  //       }
  //     }
  //   )
  //   // console.log('kjk',d);
  //   res.redirect("/userOrders");
  try {
    const order = await Order.findOne({"orderItems._id": id})
    const orderItem = await Order.aggregate([
      {
        $unwind: '$orderItems'
      },
      {
        $match: {
          'orderItems._id': new mongoose.Types.ObjectId(id)
        }
      }
    ]);
    // console.log("order",orderItem);
    await Order.updateOne(
      { "orderItems._id": id },
      { $set: { "orderItems.$.orderStatus": "Returned" } }
    );
    const d = await Product.updateOne(
      { _id: productId },
      { $inc: { inStock: quantity } }
    );

    console.log("len",order.orderItems.length);
    if(order.orderItems.length == 1){
      const amount = order.totalAmount
      await Wallet.updateOne(
        {userId: userId },
        { $inc: { walletAmount: amount } }
      );
      await Wallet.findOneAndUpdate(
        { userId: userId },
        {
          $push: {
            'transactionHistory': {
              amount: amount,
              paymentType: 'Credit',
              reason: 'Returned Order'
            }
          }
        }
      )
    }else{
      console.log("skkss");
      const productNum = order.orderItems.length
      let discAmount = 0;
      if (order.couponDiscount >0) {
        console.log("cou");
        discAmount = (order.couponDiscount/productNum)
      }
      console.log(productNum,discAmount);
      console.log("cdf",orderItem[0].orderItems.price,orderItem[0].orderItems.quantity);
      const amount = (orderItem[0].orderItems.price*orderItem[0].orderItems.quantity)-discAmount
      console.log("amt",amount)
      await Wallet.updateOne(
        {userId: userId },
        { $inc: { walletAmount: amount } }
      );
      await Wallet.findOneAndUpdate(
        { userId: userId },
        {
          $push: {
            'transactionHistory': {
              amount: amount,
              paymentType: 'Credit',
              reason: 'Returned Order'
            }
          }
        }
      )
    }
    
    // console.log('kjk',d);
    res.redirect("/userOrders");
  } catch (err) {
    res.status(500).send(err);
  }
};


exports.orderDetail = async (req, res) => {
  try {
    const userId = req.session.userId;
    const orderId = req.query.id;
    const productId = req.query.productId;
    // const orderDetails = await Order.findOne({"orderItems._id":orderId})
    // res.send(orderDetails)


    const orderDetails = await Order.findOne({ 
      "orderItems._id": orderId,
      "orderItems.productId": productId
    });
    if (orderDetails) {
      const orderItem = orderDetails.orderItems.find(item => item.productId.equals(productId));
      const data ={order: orderDetails, product: orderItem}
      res.send(data);
    } else {
      res.send(null); 
    }
    // res.status(200).send(orderDetail)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.invoice = async (req, res) => {
  const id = req.query.id;
  try {
    const order = await Order.findOne({ _id: id });
    // console.log(order);
    const d = order.orderItems;
    const products = d.map((values) => {
      return {
        quantity: values.quantity,
        description: values.productName,
        "tax-rate": 0,
        price: values.price,
      };
    });
    // console.log('loll', products);
    // console.log(d);
    res.json({
      order,
      products,
    });
  } catch (error) {
    res.send(error);
  }
};
