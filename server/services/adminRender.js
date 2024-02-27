const session = require('express-session');
const axios = require('axios')


exports.adminLogin=(req,res)=>{
    const {isUserAuthenticated} = req.session
    res.render("adminside/adminLogin",{errEmail:req.session.adminEmailErr,errPass:req.session.adminPassErr,isUserAuthenticated},(err,html)=>{
        if(err){
            console.log(err);
         }
        delete req.session.adminEmailErr
        delete req.session.adminPassErr
        delete req.session.isUserAuthenticated
        res.send(html)
    });
}

exports.adminDash=(req,res)=>{
    // res.render("adminside/adminDashboard")
    // res.render("adminEditProduct")
    const id=req.query.id
    axios.all([
        axios.get(`http://localhost:${process.env.PORT}/admin/orderdata`) ,
        axios.get(`http://localhost:${process.env.PORT}/admin/userdata`),
        axios.get(`http://localhost:${process.env.PORT}/admin/dashDetails`)
  ])
  .then(axios.spread((data1,data2,data3)=>{
     res.render("adminside/adminDashboard",{orders:data1.data,users:data2.data,dashDetails:data3.data}) 
  })).catch(err=>{
     res.send(err)
  })
}


// exports.adminUserManagement=(req,res)=>{
//     res.render("adminUserManagement",(req,res)=>{

//         // Make a get request to api/users
//         axios.get('http://localhost:3000/api/users')
//             .then(function(response){
//                 // console.log(response.data);
//                 res.render('admindash.ejs',{users:response.data})
//             })
//             .catch(err=>{
//                 res.send(err);
//             })
//     })
// }

exports.adminUserManagement = (req, res) => {
    axios.get(`http://localhost:${process.env.PORT}/admin/userdata`)
        .then(function (response) {
            console.log(response.data);
            res.render('adminside/adminUserManagement.ejs', { users: response.data });
        })
        .catch(err => {
            res.render('error', { error: err });
            res.send(err);
        });
};


exports.adminCategoryMangement=(req,res)=>{
    axios.get(`http://localhost:${process.env.PORT}/admin/categoryShow`)
    .then(function (response){
        res.render("adminside/adminCategoryManagement",{category: response.data });
    })
    .catch(err => {
        res.render('error', { error: err });
        res.send(err);
    });
}

exports.adminAddCategory=(req,res)=>{
    res.render("adminside/adminAddCategory",{message: req.session.categoryerr},(err,html)=>{
        if(err){
            console.log('render err',err);
            return res.send('Internal server  err');
        }
        delete req.session.categoryerr;
        res.send(html);
    });
}
 
exports.adminUnlistCategory=(req,res)=>{
    axios.get(`http://localhost:${process.env.PORT}/admin/unlistcategoryShow`)
    .then(function (response){
        res.render("adminside/adminUnlistCategory",{category: response.data });
    })
    .catch(err => {
        res.render('error', { error: err });
        res.send(err);
    });
}

exports.adminEditCategory=(req,res)=>{
    
    const id=req.query.id;
    axios.get(`http://localhost:${process.env.PORT}/admin/editCategoryShow?id=${id}`) 
    .then(function (response){
        res.render("adminside/adminEditCategory",{category: response.data,message: req.session.categoryerr });
    })
    .catch(err => {
        res.render('error', { error: err });
        res.send(err); 
        delete req.session.categoryerr
    });
    
}

exports.adminProductMangement=(req,res)=>{
    // res.render("adminProductManagement")
    axios.get(`http://localhost:${process.env.PORT}/admin/productShow`)
    .then(function (response){
        res.render("adminside/adminProductManagement",{product: response.data });
    })
    .catch(err => {
        res.render('error', { error: err });
        res.send(err);
    });
}

exports.adminAddProduct=(req,res)=>{
    axios.get(`http://localhost:${process.env.PORT}/admin/categoryShow`)
    .then(function (response){
        res.render("adminside/adminAddProduct",{category: response.data });
    })
    .catch(err => {
        res.render('error', { error: err });
        res.send(err);
    });
}

exports.adminEditProduct=(req,res)=>{
    // res.render("adminEditProduct")
    const id=req.query.id
    axios.all([
     axios.get(`http://localhost:${process.env.PORT}/admin/editProductShow?id=${id}`) ,
     axios.get(`http://localhost:${process.env.PORT}/admin/categoryShow`) 
  ])
  .then(axios.spread((data1,data2)=>{
     res.render("adminside/adminEditProduct",{product:data1.data,category:data2.data}) 
  })).catch(err=>{
     res.send(err)
  })
}

exports.adminUnlistProduct=(req,res)=>{
    axios.get(`http://localhost:${process.env.PORT}/admin/unlistProductShow`)
    .then(function (response){
        res.render("adminside/adminUnlistProduct",{product: response.data });
    })
    .catch(err => {
        res.render('error', { error: err });
        res.send(err);
    });
}

exports.adminOrderMange=(req,res)=>{
    const page = req.query.page || 1;
    console.log(page);
    axios.get(`http://localhost:${process.env.PORT}/admin/orderShow?page=${page}`) 
    .then((response)=>{      
        res.render('adminside/adminOrderManagement',{orders:response.data})
    }).catch(err=>{  
        res.send(err)   
    }) 
}

// exports.adminLogin1=(req,res)=>{
//     // res.render("registertwo")
//     const {isUserAuthenticated} = req.session
//     res.render("adminLogin1",{isUserAuthenticated},(err,html)=>{
//        if(err){
//           console.log(err);
//        }
//        delete req.session.isUserAuthenticated
//        res.send(html)
//     })
//  }


exports.adminCouponManage=(req,res)=>{
    // res.render("adminside/adminCouponManage")
    axios.get(`http://localhost:${process.env.PORT}/admin/couponAxios`)
    .then(function (response){
        res.render("adminside/adminCouponManage",{coupon: response.data });
    })
    .catch(err => {
        res.render('error', { error: err });
        res.send(err);
    });
}

exports.adminCouponAdd=(req,res)=>{
    res.render("adminside/adminCouponAdd")
}

exports.adminCouponEdit=(req,res)=>{
    // res.render("adminside/adminCouponManage")
    const couponId = req.query.id; 
    console.log(couponId);
    axios.get(`http://localhost:${process.env.PORT}/admin/editCouponAxios?id=${couponId}`)
    .then(function (response){
        res.render("adminside/adminCouponEdit",{coupon: response.data });
    })
    .catch(err => {
        res.render('error', { error: err });
        res.send(err);
    });
}

exports.adminCouponDelOrExp=(req,res)=>{
    // res.render("adminside/adminCouponDelOrExp")
    axios.get(`http://localhost:${process.env.PORT}/admin/delOrExpCouponAxios`)
    .then(function (response){
        res.render("adminside/adminCouponDelOrExp",{coupon: response.data });
    })
    .catch(err => {
        res.render('error', { error: err });
        res.send(err);
    });
}
exports.adminOfferManage=(req,res)=>{
    // res.render("adminside/adminOfferManage")
    axios.get(`http://localhost:${process.env.PORT}/admin/findOffers`)
    .then(function (response){
        res.render("adminside/adminOfferManage",{offer: response.data });
    })
    .catch(err => {
        res.render('error', { error: err });
        res.send(err);
    });
}
exports.adminOfferAddCategory=(req,res)=>{
    // res.render("adminside/adminOfferAddCaregory")
    axios.get(`http://localhost:${process.env.PORT}/admin/categoryShow`)
    .then(function (response){
        res.render("adminside/adminOfferAddCaregory",{category: response.data });
    })
    .catch(err => {
        res.render('error', { error: err });
        res.send(err);
    });
}
exports.adminOfferAddProduct=(req,res)=>{
    res.render("adminside/adminOfferAddProduct")
}
exports.adminRefManage=(req,res)=>{
    // res.render("adminside/adminRefManage")
    axios.get(`http://localhost:${process.env.PORT}/admin/findReferral`)
    .then(function (response){
        res.render("adminside/adminRefManage",{ref: response.data });
    })
    .catch(err => {
        res.render('error', { error: err });
        res.send(err);
    });
}
exports.adminAddRef=(req,res)=>{
    // res.render("adminside/adminAddRef")
    axios.get(`http://localhost:${process.env.PORT}/admin/findReferral`)
    .then(function (response){
        res.render("adminside/adminAddRef",{ref: response.data });
    })
    .catch(err => {
        res.render('error', { error: err });
        res.send(err);
    });
}




//test ejs
//----------
exports.adminupdAddProduct=(req,res)=>{
    res.render("adminside/updAddproduct")
}
//----------
