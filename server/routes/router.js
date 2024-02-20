const express = require('express');
const route = express.Router();

const services = require('../services/render');
const controller = require('../controller/userSide/controller')
const addressController = require('../controller/userSide/address')
const orderController = require('../controller/userSide/orderController')
const walletController = require('../controller/userSide/wallet')
const productController = require('../controller/product/productController')
const cartController = require('../controller/userSide/cart')

const middleware = require('../middleware/middleware')

const {isUserAuthenticated,isUserNotAuthenticated,isUserBlocked,isCart} = require('../middleware/middleware');

// User
route.get('/',services.homeRoutes)
// route.get('/signup',services.signup)
route.get('/login',isUserNotAuthenticated,services.loginRoute)  
route.get("/signupOtp",services.signupOtp)
// route.get("/register",services.register) 
route.get("/register",services.registertwo) 
route.get("/forgotpassword1",services.forgot1Routes) 
route.get("/forgotpassword2",services.forgot2Routes)
route.get("/forgotpassword3",services.forgot3Routes) 
route.get("/productsList",services.productsList) 
route.get("/productsPage",services.productPage) 
route.get("/userProfile",isUserAuthenticated,services.userProfile);
route.get("/updateAccount",isUserAuthenticated,services.updateAccount);
route.get("/userAddressPage",isUserAuthenticated,services.userAddressPage);
route.get("/addAddress",isUserAuthenticated,services.addAddress);
route.get("/editAddress",isUserAuthenticated,services.editAddress);
route.get("/userCart",isUserAuthenticated,services.userCart);
route.get("/checkout",isUserAuthenticated,isCart,services.checkout);
route.get("/orderSuccess",isUserAuthenticated,services.orderSuccess);
route.get("/userOrders",isUserAuthenticated,services.userOrders);
route.get("/orderDetail",isUserAuthenticated,services.orderDetails);
route.get('/userWallet',isUserAuthenticated,services.userWallet)
// route.get("/listProduct",services.listProduct); 

// # API #

route.post('/api/login',controller.loginCheck)   // Login 
route.post('/api/logout',controller.userLogout)   // Logout

// registration otp
route.post('/api/otp',controller.otp)   // send otp  -> register page
route.post('/api/otpverification',controller.otpverification)  // aslo save user data -> otp verify page 
route.get('/api/SignupOtpResend',controller.SignupOtpResend)

//forgot otp  
route.post('/api/forgototp',controller.forgototp)
route.post('/api/forgototpverification',controller.forgototpverification)
route.get('/api/forgotOtpResend',controller.forgotOtpResend)
route.post('/api/updateforgototp',controller.updatepassword)

// user pages
route.get('/api/categoryShow',productController.CategoryShow)
route.get('/api/categoryProductPage/:id',productController.categoryProductPage)
route.get('/api/productPage',productController.productPage)

// user profile
route.get('/api/userProfile',controller.userProfile)
route.post('/api/updateUser',controller.updateUser)

// wallet
// route.post('/api/userWallet',controller.userWallet)

// cart 
// route.get('/api/addToCart',controller.addToCart)
// route.get('/api/showCart',controller.showCartPage)
// route.post('/api/removeCart',controller.removeCart)
// route.post('/api/updateProductQuantity',controller.updateProductQuantity)
route.get('/api/addToCart',cartController.addToCart)
route.get('/api/showCart',cartController.showCartPage)
route.post('/api/removeCart',cartController.removeCart)
route.get('/api/updateProductQuantity',cartController.updateProductQuantity)

// Address
route.get('/api/showAddress',addressController.showAddress)
route.post('/api/addAddress',addressController.addAddress)
route.get('/api/changeToDefault',addressController.changeToDefault)
route.get('/api/showEditAddress',addressController.showEditAddress)
route.post('/api/editAddress',addressController.editAddress)
route.get('/api/deleteAddress',addressController.deleteAddress)

// checkout
route.post('/api/userCheckout',orderController.userCheckout)
route.post('/api/userApplyCoupon',controller.userApplyCoupon)
route.post('/api/removeCoupon',controller.removeCoupon)
//order
route.get('/api/userOrders',orderController.userOrders)
route.get('/api/orderDetail',orderController.orderDetail)
route.get('/api/updateCanceled',orderController.updateCanceled)
route.get('/api/updateReturned',orderController.updateReturned)
route.get('/api/downloadInvoice',orderController.invoice)

//search
route.get('/api/search',productController.searchProducts)
// route.get('/api/filter',productController.searchProducts)


//payment
route.post('/api/onlinePaymentSuccessfull',orderController.onlinePaymentSuccessfull)

// wallet
route.post('/api/addWallet',walletController.addWallet)
route.post('/api/addWalletPaymentSuccessfull',walletController.addWalletPaymentSuccessfull)
route.get('/api/walletAxios',walletController.walletAxios)

module.exports = route