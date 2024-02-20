var userDb = require("../../model/userSchema");
var Category = require("../../model/categorySchema");
var Product = require("../../model/productSchema");
var Order = require("../../model/orderSchema");
var Coupon = require("../../model/couponSchema");
var Offer = require("../../model/offerSchema");
var Referral = require("../../model/referralSchema");
const CsvParser = require("json2csv").Parser;

exports.adminLoginCheck = async (req, res) => {
  const admin = {
    // email:"samanwaysm@gmail.com",
    // password:"123"
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASS,
  };
  if (req.body.email === admin.email && req.body.password === admin.password) {
    // console.log("working");
    req.session.isAdminAuthenticated = true;
    res.redirect("/adminDash");
  } else {
    // res.redirect('/adminLogin');
    if (req.body.email !== admin.email) {
      req.session.adminEmailErr = "Invalid Email";
      return res.redirect("/adminLogin");
    }
    if (req.body.password !== admin.password) {
      req.session.adminPassErr = "Invalid Password";
      return res.redirect("/adminLogin");
    }
  }
};

exports.adminLogout = async (req, res) => {
  req.session.isAdminAuthenticated = false;
  res.redirect("/adminLogin");
};

exports.dashDetails = async (req, res) => {
  try {
    const [totalSales] = await Order.aggregate([
      {
        $unwind: {
          path: "$orderItems",
        },
      },
      {
        $match: {
          $or: [{ "orderItems.orderStatus": "Delivered" }],
        },
      },
      {
        $group: {
          _id: null,
          profit: {
            $sum: {
              $multiply: ["$orderItems.price", "$orderItems.quantity"],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);
    // console.log('totl prft', totalSales?.profit);
    const profit = totalSales?.profit;
    // console.log(profit);
    res.send(totalSales);
    // return { profit: totalSales?.profit }
  } catch (err) {
    console.log(err);
  }
};

//Dashboard
exports.Dashboard = async (req, res, next) => {
  try {
    let labelObj = {};
    let salesCount;
    let findQuerry;
    let currentYear;
    let currentMonth;
    let index;

    switch (req.body.filter) {
      case "Weekly":
        currentYear = new Date().getFullYear();
        currentMonth = new Date().getMonth() + 1;

        labelObj = {
          Sun: 0,
          Mon: 1,
          Tue: 2,
          Wed: 3,
          Thu: 4,
          Fri: 5,
          Sat: 6,
        };

        salesCount = new Array(7).fill(0);

        findQuerry = {
          orderDate: {
            $gte: new Date(currentYear, currentMonth - 1, 1),
            $lte: new Date(currentYear, currentMonth, 0, 23, 59, 59),
          },
        };
        index = 0;
        break;
      case "Monthly":
        currentYear = new Date().getFullYear();
        labelObj = {
          Jan: 0,
          Feb: 1,
          Mar: 2,
          Apr: 3,
          May: 4,
          Jun: 5,
          Jul: 6,
          Aug: 7,
          Sep: 8,
          Oct: 9,
          Nov: 10,
          Dec: 11,
        };

        salesCount = new Array(12).fill(0);

        findQuerry = {
          orderDate: {
            $gte: new Date(currentYear, 0, 1),
            $lte: new Date(currentYear, 11, 31, 23, 59, 59),
          },
        };
        index = 1;
        break;
      case "Daily":
        currentYear = new Date().getFullYear();
        currentMonth = new Date().getMonth() + 1;
        let end = new Date(currentYear, currentMonth, 0, 23, 59, 59);
        end = String(end).split(" ")[2];
        end = Number(end);

        for (let i = 0; i < end; i++) {
          labelObj[`${i + 1}`] = i;
        }

        salesCount = new Array(end).fill(0);

        findQuerry = {
          orderDate: {
            $gt: new Date(currentYear, currentMonth - 1, 1),
            $lte: new Date(currentYear, currentMonth, 0, 23, 59, 59),
          },
        };

        index = 2;
        break;
      case "Yearly":
        findQuerry = {};

        const ord = await Order.find().sort({ orderDate: 1 });
        const stDate = ord[0].orderDate.getFullYear();
        const endDate = ord[ord.length - 1].orderDate.getFullYear();

        for (let i = 0; i <= Number(endDate) - Number(stDate); i++) {
          labelObj[`${stDate + i}`] = i;
        }

        salesCount = new Array(Object.keys(labelObj).length).fill(0);

        index = 3;
        break;
      default:
        return res.json({
          label: [],
          salesCount: [],
        });
    }

    const orders = await Order.aggregate([
      {
        $match: findQuerry,
      },
      {
        $unwind: {
          path: "$orderItems",
        },
      },
    ]);
    // console.log(orders.length);

    orders.forEach((order) => {
      if (index === 2) {
        salesCount[
          labelObj[Number(String(order.orderDate).split(" ")[index])]
        ] += 1;
      } else {
        salesCount[labelObj[String(order.orderDate).split(" ")[index]]] += 1;
      }
    });

    res.json({
      label: Object.keys(labelObj),
      salesCount,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server err");
  }

  // try {
  //   const { sort = '' } = req.query;

  //   console.log('sort',sort);
  //   const sorted = sort.trim() ? sort.trim().toLowerCase() : 'monthly';
  //   let orderQuery = []

  //   let orderData = {}

  //   switch (sorted) {
  //     case 'weekly':
  //       const week = [{
  //         $addFields: {
  //           week: {
  //             $switch: {
  //               branches: [
  //                 { case: { $eq: [{ $dayOfWeek: '$orderDate' }, 1] }, then: "Sunday" },
  //                 { case: { $eq: [{ $dayOfWeek: '$orderDate' }, 2] }, then: 'Monday' },
  //                 { case: { $eq: [{ $dayOfWeek: '$orderDate' }, 3] }, then: 'Tuesday' },
  //                 { case: { $eq: [{ $dayOfWeek: '$orderDate' }, 4] }, then: 'Wednesday' },
  //                 { case: { $eq: [{ $dayOfWeek: '$orderDate' }, 5] }, then: 'Thursday' },
  //                 { case: { $eq: [{ $dayOfWeek: '$orderDate' }, 6] }, then: 'Friday' },
  //                 { case: { $eq: [{ $dayOfWeek: '$orderDate' }, 7] }, then: 'Saturday' },
  //               ]
  //             }
  //           }
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: '$week',
  //           total: { $sum: 1 }
  //         }
  //       }];
  //       let weekData = {
  //         'Sunday': 0,
  //         'Monday': 0,
  //         'Tuesday': 0,
  //         'Wednesday': 0,
  //         'Thursday': 0,
  //         'Friday': 0,
  //         'Saturday': 0,
  //       }
  //       orderData = { ...weekData }
  //       orderQuery = [...week]

  //       break;
  //     case 'monthly':
  //       const month = [
  //         {
  //           $addFields: {
  //             month: {
  //               $switch: {
  //                 branches: [
  //                   { case: { $eq: [{ $month: '$orderDate' }, 1] }, then: "January" },
  //                   { case: { $eq: [{ $month: '$orderDate' }, 2] }, then: 'February' },
  //                   { case: { $eq: [{ $month: '$orderDate' }, 3] }, then: 'March' },
  //                   { case: { $eq: [{ $month: '$orderDate' }, 4] }, then: 'April' },
  //                   { case: { $eq: [{ $month: '$orderDate' }, 5] }, then: 'May' },
  //                   { case: { $eq: [{ $month: '$orderDate' }, 6] }, then: 'June' },
  //                   { case: { $eq: [{ $month: '$orderDate' }, 7] }, then: 'July' },
  //                   { case: { $eq: [{ $month: '$orderDate' }, 8] }, then: 'August' },
  //                   { case: { $eq: [{ $month: '$orderDate' }, 9] }, then: 'September' },
  //                   { case: { $eq: [{ $month: '$orderDate' }, 10] }, then: 'October' },
  //                   { case: { $eq: [{ $month: '$orderDate' }, 11] }, then: 'November' },
  //                   { case: { $eq: [{ $month: '$orderDate' }, 12] }, then: 'December' },
  //                 ]
  //               }
  //             }
  //           },
  //         },
  //         {
  //           $group: {
  //             _id: '$month',
  //             total: { $sum: 1 }
  //           }
  //         },

  //       ];
  //       let monthData = {
  //         'January': 0,
  //         'February': 0,
  //         'March': 0,
  //         'April': 0,
  //         'May': 0,
  //         'June': 0,
  //         'July': 0,
  //         'August': 0,
  //         'September': 0,
  //         'October': 0,
  //         'November': 0,
  //         'December': 0,
  //       }
  //       orderData = { ...monthData }
  //       orderQuery = [...month]
  //       break;
  //     case 'yearly':
  //       const year = [
  //         {
  //           $addFields: {
  //             year: { $year: '$orderDate' }
  //           }

  //         },
  //         {
  //           $group: {
  //             _id: '$year',
  //             count: { $sum: 1 }
  //           }
  //         }
  //       ];
  //       orderQuery = [...year]
  //       break;
  //   }
  //   console.log(orderQuery);
  //   console.log(...orderQuery)
  //   const orderDetails = await Order.aggregate(orderQuery);

  //   if (sort === 'yearly') {
  //     orderDetails.forEach(items => {
  //       orderData[items._id] = items.count
  //     })
  //   } else {
  //     orderDetails.forEach(items => {
  //       if (orderData.hasOwnProperty(items._id)) {
  //         orderData[items._id] = items.total
  //       }
  //     })
  //   }

  //   res.status(200).json({ status: 'success', orderData: orderData })
  // } catch (error) {
  //   next(error);
  // }
};

exports.userManagement = async (req, res) => {
  const userData = await userDb.find({});
  res.send(userData);
};

exports.userBlock = async (req, res) => {
  const id = req.query.id;
  const userData = await userDb.find({ _id: id });
  if (userData && userData.length > 0 && userData[0].isBlocked === false) {
    await userDb.updateOne({ _id: id }, { $set: { isBlocked: true } });
    req.session.isUserAuthenticated = false;
    res.status(200).redirect("/adminUserMange");
  }
};
exports.userunBlock = async (req, res) => {
  const id = req.query.id;
  const userData = await userDb.find({ _id: id });
  if (userData && userData.length > 0 && userData[0].isBlocked === true) {
    await userDb.updateOne({ _id: id }, { $set: { isBlocked: false } });
    res.status(200).redirect("/adminUserMange");
  }
};

// cateogary managment

exports.addCategory = async (req, res) => {
  // const categoryExists = await Category.findOne({ category: req.body.categoryName });

  const categoryName = req.body.categoryName;
  const categoryExists = await Category.findOne({
    category: { $regex: new RegExp(categoryName, "i") },
  });
  console.log(categoryExists);
  if (categoryExists) {
    req.session.categoryerr = "Category already in use";
    return res.redirect("/adminAddCategory");
  }

  const file = req.files;
  const images = file.map((values) => `/uploads/${values.filename}`);
  // console.log(file)

  // save in db
  const category = new Category({
    category: req.body.categoryName,
    image: images,
  });
  category
    .save(category)
    .then((data) => {
      // console.log("done")
      res.redirect("/adminCategoryMange");
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message || "some error occured while creating option ",
      });
    });
};

exports.CategoryManagementShow = async (req, res) => {
  const categoryList = await Category.find({ status: true });
  res.send(categoryList);
};

exports.UnlistCategoryShow = async (req, res) => {
  const UnlistCategory = await Category.find({ status: false });
  res.send(UnlistCategory);
};

exports.unlistCategory = async (req, res) => {
  const id = req.query.id;
  const categorydata = await Category.find({ _id: id });
  console.log(categorydata[0].category);
  if (
    categorydata &&
    categorydata.length > 0 &&
    categorydata[0].status === true
  ) {
    await Category.updateOne({ _id: id }, { $set: { status: false } });

    await Product.updateMany(
      { category: categorydata[0].category },
      { $set: { isCategory: false } }
    );
    res.status(200).redirect("/adminCategoryMange");
  }
};

exports.listCategory = async (req, res) => {
  const id = req.query.id;
  const categorydata = await Category.find({ _id: id });
  if (
    categorydata &&
    categorydata.length > 0 &&
    categorydata[0].status === false
  ) {
    await Category.updateOne({ _id: id }, { $set: { status: true } });
    await Product.updateMany(
      { category: categorydata[0].category },
      { $set: { isCategory: true } }
    );
    res.status(200).redirect("/adminUnlistCategory");
  }
};
exports.editCategory = async (req, res) => {
  const editId = req.query.id;
  const file = req.files;
  // console.log(file);
  const images = file.map((value) => `/uploads/${value.filename}`);
  try {
    await Category.updateOne(
      { _id: editId },
      { $set: { category: req.body.categoryName } }
    );
    if (file.length == 0) {
      return res.redirect("/adminCategoryMange");
    }
    await Category.updateOne({ _id: editId }, { $set: { image: images } });
    res.redirect("/adminCategoryMange");
  } catch (err) {
    // res.send("internal error")
    req.session.categoryerr = "Category already in use";
    const referrer = req.get("Referer");
    res.redirect(referrer);
  }
};

// exports.editCategory = async (req, res) => {

// };

exports.editCategoryShow = async (req, res) => {
  const categoryEditId = req.query.id;
  // console.log(categoryEditId)
  const data = await Category.findOne({ _id: categoryEditId })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `cannot  category with ${id}.may be not category found`,
        });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

// Product managment

exports.addProduct = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "hi you entered any thing" });
    return;
  }
  const file = req.files;
  const images = file.map((values) => `/uploads/${values.filename}`);
  // const images=file.map((files)=>files.filename);
  console.log(file);

  // save in db
  const product = new Product({
    productName: req.body.productName,
    brandName: req.body.brandName,
    category: req.body.category,
    subTitle: req.body.subTitle,
    descriptionHeading: req.body.descriptionHeading,
    description: req.body.description,
    firstPrice: req.body.firstPrice,
    lastPrice: req.body.lastPrice,
    discount: req.body.discount,
    color: req.body.color,
    inStock: req.body.inStock,
    image: images,
  });
  product
    .save(product)
    .then((data) => {
      // console.log("done")
      res.redirect("/adminProductMange");
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message || "some error occured while creating option ",
      });
    });
};

exports.editProduct = async (req, res) => {
  const editId = req.query.id;

  const file = req.files;
  // console.log(file);
  const images = file.map((values) => `/uploads/${values.filename}`);
  // if (file && file.length > 0) {
  //     images = file.map((value) => `/uploads/${value.filename}`);
  // }

  try {
    await Product.updateOne(
      { _id: editId },
      {
        $set: {
          productName: req.body.productName,
          brandName: req.body.brandName,
          category: req.body.category,
          subTitle: req.body.subTitle,
          descriptionHeading: req.body.descriptionHeading,
          description: req.body.description,
          firstPrice: req.body.firstPrice,
          lastPrice: req.body.lastPrice,
          discount: req.body.discount,
          color: req.body.color,
          inStock: req.body.inStock,
        },
      }
    );
    if (file.length == 0) {
      return res.redirect("/adminProductMange");
    } else {
      await Product.updateOne({ _id: editId }, { $set: { image: images } });
      res.redirect("/adminProductMange");
    }
  } catch {
    res.send("internal error");
  }
};

exports.editProductShow = async (req, res) => {
  const productEditId = req.query.id;
  // console.log(productEditId)
  const data = await Product.findOne({ _id: productEditId })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `dcannot  product with ${id}.may be not product found`,
        });
      } else {
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.productManagementShow = async (req, res) => {
  const productList = await Product.find({
    $and: [{ listed: true }, { isCategory: true }],
  });
  res.send(productList);
};
exports.unlistProductShow = async (req, res) => {
  const unlistProductList = await Product.find({
    $and: [{ listed: false }, { isCategory: true }],
  });
  res.send(unlistProductList);
};

exports.unlistProduct = async (req, res) => {
  const id = req.query.id;
  const productdata = await Product.find({ _id: id });
  // console.log(productdata);
  if (productdata && productdata.length > 0 && productdata[0].listed === true) {
    await Product.updateOne({ _id: id }, { $set: { listed: false } });
    res.status(200).redirect("/adminProductMange");
  }
};

exports.listProduct = async (req, res) => {
  const id = req.query.id;
  const productdata = await Product.find({ _id: id });
  if (
    productdata &&
    productdata.length > 0 &&
    productdata[0].listed === false
  ) {
    await Product.updateOne({ _id: id }, { $set: { listed: true } });
    res.status(200).redirect("/adminUnlistProduct");
  }
};

// exports.orderShow = async (req, res) => {
//   try {
//     const data = await Order.aggregate([
//       { $match: {} },
//       {
//         $unwind: {
//           path: "$orderItems",
//         },
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "userId",
//           foreignField: "_id",
//           as: "userDetails",
//         },
//       },
//     ]);
//     // console.log(data);
//     res.send(data);
//   } catch (err) {
//     res.send(err);
//   }
// };

exports.orderData = async (req, res) => {
  try {
      const orders = await Order.aggregate([
      { $match: {} },
      {
        $unwind: {
          path: "$orderItems",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      }
    ]);
    const data = {orders }
    res.status(200).send(data);
  } catch (err) {
    res.send(err);
  }
}

exports.orderShow = async (req, res) => {
  try {

    // const page = req.query.page || 1;
    // const limit = 5;
    // const orders = await Order.aggregate([
    //   { $match: {} },
    //   {
    //     $unwind: {
    //       path: "$orderItems",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "userId",
    //       foreignField: "_id",
    //       as: "userDetails",
    //     },
    //   }
    // ]);

    const page = req.query.page || 1;
    const limit = 8;
    const orders = await Order.aggregate([
      { $match: {} },
      {
        $unwind: {
          path: "$orderItems",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $sort: {
          orderDate: -1,
        },
    },
      {
        $skip:limit*(page-1)
      },
      {
        $limit:limit
      }
    ]);

    // await PageNation('Order');
    const totalOrders = await Order.aggregate([
      {
        $unwind: {
            path: "$orderItems",
        },
    },
    {
        $lookup: {
            from: "userdbs",
            localField: "userId",
            foreignField: "_id",
            as: "userInfo",
        },

    },

    {
      $group:{
        _id:null,
        count:{$sum:1}
      }
    }
    ]);
    
    //await data(page, limit);
    const totalPages= Math.ceil(totalOrders[0].count / limit)
    // const data =  { orders, totalOrders, currentPage: page, totalPages: Math.ceil(totalOrders / limit) }
    const data =  { orders,totalPages}
    res.status(200).send(data);
  } catch (err) {
    res.send(err);
  }
};

exports.updateOrderStatus = async (req, res) => {
  const id = req.query.id;
  console.log(id);
  try {
    const status = req.body.status;
    console.log(status);
    await Order.updateOne(
      { "orderItems._id": id },
      { $set: { "orderItems.$.orderStatus": status } }
    );
    res.redirect("/adminOrderMange");
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.salesReport = async (req, res, next) => {
  try {
    console.log("salesreport");
    const fromDate = req.query.fromDate
    const toDate = req.query.toDate
    const toDateObject = new Date(toDate);

    toDateObject.setDate(toDateObject.getDate() + 1);

    const newToDate = toDateObject.toISOString().split('T')[0];
    console.log(new Date(fromDate), new Date(newToDate));
    const agg = [
      {
        $unwind: "$orderItems"
      },
      {
        $match: {
          "orderDate": { $gte: new Date(fromDate), $lte: new Date(newToDate) },
          "orderItems.orderStatus": "Delivered"
        },
      },
      {
        $sort: {
          orderDate: -1,
        },
      },

    ]
    const results = await Order.aggregate(agg);

    const users = [];
    let count = 1;

    results.forEach((orders) => {
      orders.sI = count;
      users.push({
        SI: orders.sI,
        "Orders ID": orders.orderItems.orderID,
        "Order Date": orders.orderDate.toISOString().split("T")[0],
        "Product Name": orders.orderItems.productName,
        "Price of a unit": orders.orderItems.price,
        "Qty": orders.orderItems.quantity,
        "Payment Method": orders.paymentMethod,
        "Total amount": orders.orderItems.quantity * orders.orderItems.price,
      });
      count++;
    });
    // console.log(users);
    const csvFields = [
      "SI",
      "Orders ID",
      "Order Date",
      "Product Name",
      "Price of a unit",
      "Qty",
      "Payment Method",
      "Total amount",
    ];
    const csvParser = new CsvParser({ csvFields });
    let csvData = csvParser.parse(users);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attatchment: filename=salesReport.csv"
    );
    res.send(csvData);
  } catch (error) {
    console.log(error);
    next(error)
  }
  // try {
  //   let order = [];
  //   const data = await Order.aggregate([
  //     {
  //       $match: {},
  //     },
  //     {
  //       $unwind: "$orderItems",
  //     },
  //   ]);
  //   data.forEach((orders) => {
  //     const { _id, paymentMethod, orderDate } = orders;
  //     const { productId, quantity, productName, price } = orders.orderItems;
  //     order.push({
  //       _id,
  //       productId,
  //       orderDate,
  //       productName,
  //       price,
  //       quantity,
  //       paymentMethod,
  //     });
  //   });
  //   const TotalPrice = data.reduce(
  //     (total, values) =>
  //       (total += values.orderItems.price * values.orderItems.quantity),
  //     0
  //   );
  //   console.log("total", TotalPrice);
  //   order.push({ TotalPrice });

  //   const csvFields = [
  //     "Orders ID",
  //     "Orders Date",
  //     "Product Name",
  //     "Price of a unit ",
  //     "Qty",
  //     "Payment method",
  //     "Total Amount",
  //   ];
  //   // const csvParser = new CsvParser({ csvFields })
  //   // const csvData = csvParser.parse(order)

  //   const csvParser = new CsvParser({ csvFields });
  //   const csvData = csvParser.parse(order);

  //   res.setHeader("Content-Type", "text/csv");
  //   res.setHeader(
  //     "Content-Disposition",
  //     "attatchment: filename=salesReport.csv"
  //   );

  //   res.status(200).end(csvData);
  //   // console.log(data);
  //   // res.send(data)
  // } catch (error) {
  //   // res.send(error)
  //   console.log(error);
  //   next(error);
  // }

};

exports.addCoupon = async (req, res) => {
  console.log("hiii");
  const { couponCode, discount, expiredDate, minPurchaseAmount, maxRedeemableAmount, maxUse } = req.body;
  const now = new Date();
  if (couponCode) {
    try {
      const foundCoupenCode = await Coupon.findOne({
        code: couponCode,
      });
      if (foundCoupenCode) {
        req.session.Couponerrmsg =
          "Coupon code already exists. Please choose a different one.";
        return res.redirect("/adminCouponAdd");
      }
    } catch (err) {
      res.send(err);
    }
  }
  const data = new Coupon({
    code: couponCode,
    // discount: discount,
    expiry: expiredDate,
    maxUse: maxUse,
    minPurchaseAmont: minPurchaseAmount,
    maxRedeemableAmount: maxRedeemableAmount,
  });
  data
    .save(data)
    .then((data) => {
      res.redirect("/adminCouponManage");
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message || "some error occured while creating option ",
      });
    });
};

exports.couponAxios = async (req, res) => {
  try {
    await Coupon.updateMany({ expiredDate: { $lt: Date.now() } }, { $set: { status: false } });
    const couponData = await Coupon.find({ status: true })
    console.log(couponData);
    res.send(couponData)
  } catch (err) {
    res.send(err)
  }
}
exports.editCouponAxios = async (req, res) => {
  try {
    const couponId = req.query.id
    const couponData = await Coupon.find({ _id: couponId })
    console.log(couponData);
    res.send(couponData)
  } catch (err) {
    res.send(err)
  }
}

exports.editCoupon = async (req, res) => {
  console.log('---', req.body);
  // const { couponCode, discount, expiredDate, minPurchaseAmont, maxRedeemableAmount } = req.body;
  const couponId = req.query.id
  const couponCode = req.body.couponCode
  // const discount = Number(req.body.discount)
  const expiry = req.body.expiredDate
  const maxUse = Number(req.body.maxUse)
  const minPurchaseAmont = Number(req.body.minPurchaseAmount)
  const maxRedeemableAmount = Number(req.body.maxRedeemableAmount)
  console.log(typeof (minPurchaseAmont));
  try {
    const d = await Coupon.updateOne({ _id: couponId }, {
      $set: {
        code: couponCode,
        // discount: discount,
        expiry: expiry,
        maxUse: maxUse,
        minPurchaseAmont: minPurchaseAmont,
        maxRedeemableAmount: maxRedeemableAmount
      }
    })
    res.redirect('/adminCouponManage')
  } catch (error) {
    console.error(error)
    res.send(error)
  }
}

exports.deleteCoupon = async (req, res) => {
  const id = req.query.id
  try {
    const d = await Coupon.updateOne({ _id: id }, { $set: { status: false } })
    console.log(d);
    res.redirect('/adminCouponManage')
  } catch (err) {
    res.send(err)
  }
}

exports.delOrExpCouponAxios = async (req, res) => {
  try {
    // await Coupon.updateMany({ expiredDate: { $lt: Date.now() } }, { $set: { status: false } });
    const couponData = await Coupon.find({ status: false })
    console.log(couponData);
    res.send(couponData)
  } catch (err) {
    res.send(err)
  }
}

exports.addCategoryOffer = async (req, res) => {
  try {
    console.log(req.body);
    const { category, discount, expiredDate } = req.body
    let data = new Offer({
      category: category,
      discount: discount,
      expiry: expiredDate
    })
    await data.save()
    const offerId = data._id
    console.log('fbcngbn', offerId);
    if (data.category == 'all') {
      console.log('hiii');
      await Product.updateMany({}, { $set: { offer: data._id } })
    } else {
      await Product.updateMany({ category: data.category }, { $set: { offer: data._id } })
    }
    res.redirect('/adminOfferManage')
  } catch (err) {
    res.send(err)
  }
}

exports.findOffers = async (req, res) => {
  console.log("hii");
  try {
    const currentDate = new Date();
    await Offer.deleteMany({ expiry: { $lt: currentDate } });
    const offer = await Offer.find({})
    console.log(offer);
    res.send(offer)
  } catch (err) {
    console.log(err);
    res.send(err)
  }
}


exports.addProductOffer = async (req, res) => {
  try {
    console.log(req.body);
    const { productName, discount, expiredDate } = req.body
    let data = new Offer({
      productName: productName,
      discount: discount,
      expiry: expiredDate
    })
    await data.save()
    const offerId = data._id
    console.log(offerId);
    const d = await Product.updateMany({ productName: data.productName }, { $set: { offer: data._id } })
    console.log(d);
    res.redirect('/adminOfferManage')
  } catch (err) {
    res.send(err)
  }
}

exports.deleteoffer = async (req, res) => {
  try {
    const id = req.query.id
    await Offer.deleteOne({ _id: id })
    res.redirect('/adminOfferManage')
  } catch (err) {
    res.send(err)
  }
}

exports.addOrChangeReferral = async (req, res) =>{
  try {
    const {referralBonus,signupBonus} = req.body
    console.log(referralBonus,signupBonus);
    const d = await Referral.updateOne({},
      { referralBonus: referralBonus, signupBonus: signupBonus },
      { upsert: true },{new: true}
    );
    console.log(d);
    // const result = await Referral.updateOne(
    //   { referralBonus: referralBonus, signupBonus: signupBonus },
    //   { upsert: true }
    // );
    // console.log(result);
    console.log('Referral updated successfully.');
    res.redirect('/adminRefManage')
  } catch (err) {
    res.send(err)
  }
}