const axios = require('axios');
const { render } = require('ejs');

// # Home Page #
exports.homeRoutes = (req,res,next)=>{
   const {isUserAuthenticated,isUserAuth}= req.session
   axios.get(`http://localhost:${process.env.PORT}/api/categoryShow`)
    .then(function (response){
        res.render("userside/home",{category: response.data.categoryList,coupons:response.data.Coupons ,isUserAuthenticated,isUserAuth},(err,html)=>{
         if(err){
            console.log(err);
         }
         delete req.session.isUserAuth
         res.send(html)
      })
    })
    .catch(err => {
      //   res.render('error', { error: err });
      //   res.send(err);
      next(err)
    });
    delete req.session.isUserAuth
}

// # Login Page #
exports.loginRoute=(req,res)=>{
   const {validEmail,wrongPassword,isUserAuthenticated} = req.session
   res.render("userside/login",{validEmail,wrongPassword,isUserAuthenticated},(err,html)=>{
      if(err){
         console.log(err);
      }
      delete req.session.validEmail
      delete req.session.wrongPassword
      res.send(html)
   })
} 

// // # SignUp Page #
// exports.signup=(req,res)=>{   
//    const {foundEmail,isUserAuthenticated}= req.session
//    res.render("signup",{foundEmail,isUserAuthenticated},(err,html)=>{
//       if(err){
//          console.log(err);
//       }
//       delete req.session.foundEmail
//       res.send(html)
//    })
//  } 
     
// # Register Page #
exports.registertwo=(req,res)=>{
   const {foundEmail,isUserAuthenticated} = req.session;
   req.session.referralLink = req.query.ref
   console.log(req.query.ref);
   res.render("userside/registertwo",{isUserAuthenticated,foundEmail},(err,html)=>{
      if(err){
         console.log(err);
      }
      delete req.session.isUserAuthenticated
      delete req.session.foundEmail
      res.send(html)
   })
}

// # SignUp OTP Page #
exports.signupOtp=(req,res)=>{
   const {isUserAuthenticated}= req.session
   res.render("userside/signupOtp",{otpFailed:req.session.err,otpRequired:req.session.otpRequired, rTime: req.session.rTime,isUserAuthenticated},(err,html)=>{
      if(err){
         console.log(err);
      }
      delete req.session.err
      delete req.session.otpRequired
      delete req.session.rTime
      res.send(html)
   })     
} 
 
// // # Register Page #
// exports.register=(req,res)=>{
//    const {isUserAuthenticated} = req.session
//    res.render("register",{isUserAuthenticated},(err,html)=>{
//       if(err){
//          console.log(err);
//       }
//       delete isUserAuthenticated
//       res.send(html)
//    })
// } 

// # Forgot First Page #
exports.forgot1Routes=(req,res)=>{ 
   const {isUserAuthenticated,notfoundEmail,message} = req.session
   res.render("userside/resetPassFirst",{isUserAuthenticated,message},(err,html)=>{
      if(err){
         console.log(err);
      }
      delete req.session.message
      res.send(html)
   })
}
   
// # Forgot Second Page #
exports.forgot2Routes=(req,res)=>{
   const {isUserAuthenticated,rTime,err} = req.session
   res.render("userside/resetPassSecond",{isUserAuthenticated,rTime,err},(err,html)=>{
      if(err){
         console.log(err);
      }
      delete isUserAuthenticated
      delete req.session.err
      res.send(html)
   })
}

// # Forgot Third Page #
exports.forgot3Routes=(req,res)=>{
   const {isUserAuthenticated} = req.session
   res.render("userside/resetPassThird",{isUserAuthenticated},(err,html)=>{
      if(err){
         console.log(err);
      }
      delete isUserAuthenticated
      res.send(html)
   })
}

// # Category Page #
// exports.productsByCategory=(req,res)=>{
//    const {isUserAuthenticated}= req.session
//    const name=req.query.name
//    axios.get(`http://localhost:${process.env.PORT}/api/categoryProductPage?name=${name}`) 
//    .then((response)=>{   
//       if(response){   
//       res.render("productsByCategory",{product:response.data,isUserAuthenticated}) 
//       }
//       else{
//          res.render("/",{isUserAuthenticated})
//       }
//   }).catch(err=>{  
//       res.send(err)   
//   })  
// }

// exports.productsList=(req,res,next)=>{
//    const {isUserAuthenticated}= req.session
//    if(req.query.name){
//       const name=req.query.name
//       axios.get(`http://localhost:${process.env.PORT}/api/categoryProductPage?name=${name}`) 
//       .then((response)=>{   
//          if(response){   
//          res.render("userside/productsList",{product:response.data,isUserAuthenticated}) 
//          }
//          else{
//             res.render("/",{isUserAuthenticated})
//          }
//       }).catch(err=>{  
//          // res.send(err)  
//          next(err) 
//    })  
//    }else if(req.query.search){
//       const search=req.query.search
//       axios.get(`http://localhost:${process.env.PORT}/api/search?search=${search}`) 
//       .then((response)=>{   
//          if(response){   
//          res.render("userside/productsList",{product:response.data,isUserAuthenticated}) 
//          }
//          else{
//             res.render("/",{isUserAuthenticated})
//          }
//       }).catch(err=>{  
//          // res.send(err) 
//          next(err)  
//    })  
//    }

exports.productsList=(req,res,next)=>{
   const {isUserAuthenticated}= req.session
   const userid = req.session.userId;
   if(req.query.category && !req.query.Min && !req.query.Max && !req.query.sort){
      const category=req.query.category
      axios.get(`http://localhost:${process.env.PORT}/api/categoryProductPage/${userid}?category=${category}`) 
      .then((response)=>{   
         if(response){   
            console.log('render',response.data.cartDetails);
         res.render("userside/productsList",{product:response.data.product,category:response.data.category,categoryName:response.data.categoryName,cartDetails:response.data.cartDetails ,isUserAuthenticated}) 
         }
         else{
            res.render("/",{isUserAuthenticated})
         }
      }).catch(err=>{  
         console.log(err);
         res.send(err)  
         // next(err) 
   })  
   // }else if(req.query.search){
   //    const search=req.query.search
   //    const category=req.query.category
   //    axios.get(`http://localhost:${process.env.PORT}/api/search?search=${search}`) 
   //    .then((response)=>{   
   //       if(response){   
   //       res.render("userside/productsList",{product:response.data.product,category:response.data.category,categoryName:response.data.categoryName,isUserAuthenticated}) 
   //       }
   //       else{
   //          res.render("/",{isUserAuthenticated})
   //       }
   //    }).catch(err=>{  
   //       res.send(err) 
   //       // next(err)  
   // })  
   }else{
      const category = req.query.category
      const Min = req.query.Min
      const Max = req.query.Max
      const sort = req.query.sort
      const search = req.query.search
     
      axios.get(`http://localhost:${process.env.PORT}/api/categoryProductPage/${userid}?category=${category}&Min=${Min}&Max=${Max}&sort=${sort}&search=${search}`)
          .then((response) => {
             res.render("userside/productsList", { product: response.data.product, category: response.data.category, categoryName:response.data.categoryName,cartDetails:response.data.cartDetails,isUserAuthenticated})
          }).catch(err => {
             res.send(err)   
             console.log(err)
            //  next(err)
          })
   }

}


// # Product Page #
exports.productPage=(req,res,next)=>{
   console.log('here in the first in product page');
   const {isUserAuthenticated}= req.session
   const id=req.query.id
   const userId= req.session.userId
   axios.get(`http://localhost:${process.env.PORT}/api/productPage?id=${id}&userId=${userId}`) 
   .then((response)=>{  
      console.log(response.data)         
      res.render("userside/productPage",{product:response.data.product[0],isCart:response.data.isAddedCart,isUserAuthenticated}) 
  }).catch(err=>{  
      console.log('here catch');
      // res.send(err)   
      next(err)
  })  
}

// # User Profile Page #
exports.userProfile=(req,res,next)=>{
   const {isUserAuthenticated,email} = req.session
   axios.get(`http://localhost:${process.env.PORT}/api/userProfile?userEmail=${email}`) 
   .then((response)=>{           
      res.render("userside/userProfile",{user:response.data,isUserAuthenticated}) 
  }).catch(err=>{  
      next(err)  
  })  
}

// # Update Account Page #
exports.updateAccount=(req,res,next)=>{
   const {isUserAuthenticated,email,message} = req.session
   axios.get(`http://localhost:${process.env.PORT}/api/userProfile?userEmail=${email}`) 
   .then((response)=>{           
      res.render("userside/updateAccount",{user:response.data,isUserAuthenticated,message}) 
  }).catch(err=>{  
      next(err)   
  })
  delete req.session.message
}

// # Update  Page #
exports.userAddressPage=(req,res,next)=>{
   const {isUserAuthenticated,userId} = req.session
   axios.get(`http://localhost:${process.env.PORT}/api/showAddress?userId=${userId}`) 
   .then((response)=>{           
      res.render("userside/userAddressPage",{addresses:response.data,isUserAuthenticated}) 
  }).catch(err=>{  
      next(err)   
  })
  delete req.session.message
}

exports.addAddress=(req,res)=>{
   const { returnTo } = req.query
   console.log(returnTo);
   if (returnTo){
       req.session.returnTo = returnTo
   }
   const {isUserAuthenticated} = req.session
   res.render("userside/addAddress",{isUserAuthenticated},(err,html)=>{
      if(err){
         console.log(err);
      }
      delete isUserAuthenticated
      res.send(html)
   })
}

exports.editAddress=(req,res)=>{
   const {isUserAuthenticated} = req.session
   const addressId=req.query.id
   const userId=req.query.userId
   const { returnTo } = req.query
   console.log(returnTo);
   if (returnTo){
       req.session.returnTo = returnTo
   }
   axios.get(`http://localhost:${process.env.PORT}/api/showEditAddress?addressId=${addressId}&userId=${userId}`) 
   .then((response)=>{           
      res.render("userside/editAddress",{address:response.data,isUserAuthenticated}) 
  }).catch(err=>{  
      res.send(err)   
  })
  delete req.session.message
}

exports.userCart=(req,res)=>{
   const {isUserAuthenticated,message} = req.session
   const userId=req.session.userId
   axios.get(`http://localhost:${process.env.PORT}/api/showCart?id=${userId}`) 
   .then((response)=>{           
      res.render("userside/userCart",{cartDetails:response.data,isUserAuthenticated,message}) 
  }).catch(err=>{  
      res.send(err)   
  })
//   delete req.session.message
}

exports.checkout=(req,res)=>{
   const {isUserAuthenticated,userId,err,invalid,discount,maxUse,expiry} = req.session
//    const errMesg: {
//       invalid: req.session.invalid,
//       expiry: req.session.expiry,
//       maxUse: req.session.maxUse,
//       discount: req.session.discount
//   }
   // const { returnTo } = req.query
   // console.log(returnTo);
   // if (returnTo){
   //     req.session.returnTo = returnTo
   // }
   axios.all([
      axios.get(`http://localhost:${process.env.PORT}/api/showCart?id=${userId}`) ,
      axios.get(`http://localhost:${process.env.PORT}/api/showAddress?userId=${userId}`),
      axios.get(`http://localhost:${process.env.PORT}/api/walletAxios?id=${userId}`)
   ])
   .then(axios.spread((data1,data2,data3)=>{
      res.render("userside/checkout",{cartDetails:data1.data,addresses:data2.data,wallet:data3.data,isUserAuthenticated,err,invalid,discount,maxUse,expiry},(err,html)=>{
         if(err){
            console.log(err);
         }
         delete req.session.err
         delete req.session.invalid
         delete req.session.discount
         delete req.session.maxUse
         delete req.session.expiry
         res.send(html)
      }) 
   // .then((response)=>{           
   //    res.render("checkout",{cartDetails:response.data,isUserAuthenticated}) 
  })).catch(err=>{  
      res.send(err)   
  })

   // const {isUserAuthenticated} = req.session
   // res.render("checkout",{isUserAuthenticated},(err,html)=>{
   //    if(err){
   //       console.log(err);
   //    }
   //    res.send(html)
   // })
}
exports.listProduct=(req,res)=>{
   const {isUserAuthenticated} = req.session
   res.render("userside/listProduct",{isUserAuthenticated},(err,html)=>{
      if(err){
         console.log(err);
      }
      res.send(html)
   })
}

exports.orderSuccess=(req,res)=>{
   const {isUserAuthenticated} = req.session
   res.render("userside/orderSuccess",{isUserAuthenticated},(err,html)=>{
      if(err){
         console.log(err);
      }
      // delete req.session.orderSuccess
      res.send(html)
   })
}

exports.userOrders=(req,res)=>{
   const page = req.query.page || 1;
   const {isUserAuthenticated,userId} = req.session
   axios.get(`http://localhost:${process.env.PORT}/api/userOrders?id=${userId}&page${page}`) 
   .then((response)=>{
      res.render("userside/userOrders",{isUserAuthenticated,orders:response.data.Orders,totalPages:response.data.totalPages})
   }).catch(err=>{
      res.send(err) 
   }) 
}

exports.orderDetails=(req,res,next)=>{
   const orderId = req.query.id
   const productId = req.query.productId
   const {isUserAuthenticated,userId} = req.session
  
   axios.get(`http://localhost:${process.env.PORT}/api/orderDetail?userId=${userId}&id=${orderId}&productId=${productId}`) 
   .then((response)=>{
      // res.render("userside/orderDetail",{isUserAuthenticated,orders:response.data})
      res.render("userside/orderDetail",{isUserAuthenticated,orderDetail:response.data})
   }).catch(err=>{
      res.send(err) 
      // next(err)
   }) 
}

exports.userWallet=(req,res)=>{
   // const {isUserAuthenticated} = req.session
   // res.render("userside/userWallet",{isUserAuthenticated},(err,html)=>{
   //    if(err){
   //       console.log(err);
   //    }
   //    res.send(html)
   // })
   const {isUserAuthenticated,userId} = req.session
   axios.get(`http://localhost:${process.env.PORT}/api/walletAxios?id=${userId}`) 
   .then((response)=>{
      res.render("userside/userWallet",{isUserAuthenticated,wallet:response.data})
   }).catch(err=>{
      res.send(err) 
   }) 
}