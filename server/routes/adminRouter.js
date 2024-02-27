const express = require('express');
const route = express.Router();
const session = require('express-session');
const axios = require('axios')
const store = require('../middleware/multer')

const {isAdminAuthenticated,isAdminNotAuthenticated} = require('../middleware/middleware');

// const services = require('../services/adminRender');
// const controller = require('../controller/adminController')

const services = require('../services/adminRender');
const controller = require('../controller/adminSide/adminController')

// Admin
route.get("/adminLogin",isAdminNotAuthenticated,services.adminLogin);
// route.get("/adminLogin1",isAdminNotAuthenticated,services.adminLogin1);
route.get("/adminDash",isAdminAuthenticated,services.adminDash);
route.get("/adminUserMange",isAdminAuthenticated,services.adminUserManagement)

route.get("/adminCategoryMange",isAdminAuthenticated,services.adminCategoryMangement)
route.get("/adminAddCategory",isAdminAuthenticated,services.adminAddCategory)
route.get("/adminUnlistCategory",isAdminAuthenticated,services.adminUnlistCategory)
route.get("/adminEditCategory",isAdminAuthenticated,services.adminEditCategory)

route.get("/adminProductMange",isAdminAuthenticated,services.adminProductMangement)
route.get("/adminUnlistProduct",isAdminAuthenticated,services.adminUnlistProduct)
route.get("/adminAddProduct",isAdminAuthenticated,services.adminAddProduct)
route.get("/adminEditProduct",isAdminAuthenticated,services.adminEditProduct)
route.get("/adminOrderMange",isAdminAuthenticated,services.adminOrderMange)

route.get("/adminCouponManage",isAdminAuthenticated,services.adminCouponManage)
route.get("/adminCouponAdd",services.adminCouponAdd)
route.get("/adminCouponEdit",isAdminAuthenticated,services.adminCouponEdit)
route.get("/adminCouponDelOrExp",isAdminAuthenticated,services.adminCouponDelOrExp)

route.get("/adminOfferManage",isAdminAuthenticated,services.adminOfferManage)
route.get("/adminOfferAddCategory",isAdminAuthenticated,services.adminOfferAddCategory)
route.get("/adminOfferAddProduct",isAdminAuthenticated,services.adminOfferAddProduct)

route.get("/adminRefManage",isAdminAuthenticated,services.adminRefManage)
route.get("/adminAddRef",isAdminAuthenticated,services.adminAddRef)


// API
route.post("/admin/login",controller.adminLoginCheck)
route.get("/admin/logout",controller.adminLogout)

route.get("/admin/userdata",controller.userManagement)
route.post("/admin/Block",controller.userBlock)
route.post("/admin/Unblock",controller.userunBlock)

route.get("/admin/categoryShow",controller.CategoryManagementShow)
route.get("/admin/unlistcategoryShow",controller.UnlistCategoryShow)
route.post("/admin/unlistcategory",controller.unlistCategory)
route.post("/admin/listcategory",controller.listCategory)
route.get("/admin/editCategoryShow",controller.editCategoryShow)

// route.post("/admin/addCategory", store.single('image'),controller.addCategory)

route.post("/admin/addCategory", store.array('image',1),controller.addCategory);
route.post('/admin/editCateogary',store.array('image',1),controller.editCategory)
// route.put("/admin/editCateogary/:id", controller.editCategory);


route.get("/admin/productShow",controller.productManagementShow)
route.get("/admin/unlistProductShow",controller.unlistProductShow)
route.post("/admin/unlistProduct",controller.unlistProduct)
route.post("/admin/listProduct",controller.listProduct)
route.get("/admin/editProductShow",controller.editProductShow)

route.post("/admin/addProduct", store.array('image',4) ,controller.addProduct)
route.post('/admin/editProduct',store.array('image',4),controller.editProduct)


//order
route.get('/admin/orderShow',controller.orderShow)
route.get('/admin/orderData',controller.orderData)

route.post('/admin/updateOrderStatus',controller.updateOrderStatus)


//dash
route.post('/admin/chartData',controller.Dashboard)
route.get('/admin/dashDetails',controller.dashDetails)
route.get('/admin/salesReport',controller.salesReport)

//coupen
route.post('/admin/AddCoupon',controller.addCoupon)
route.get('/admin/couponAxios',controller.couponAxios)
route.get('/admin/editCouponAxios',controller.editCouponAxios)
route.post('/admin/editCoupon',controller.editCoupon)
route.get('/admin/deleteCoupon',controller.deleteCoupon)
route.get('/admin/delOrExpCouponAxios',controller.delOrExpCouponAxios)

//offer
route.post('/admin/addCategoryOffer',controller.addCategoryOffer)
route.post('/admin/addProductOffer',controller.addProductOffer)
route.get('/admin/findOffers',controller.findOffers)

route.post('/admin/addOrChangeReferral',controller.addOrChangeReferral)
route.get('/admin/findReferral',controller.findReferral)

module.exports = route;