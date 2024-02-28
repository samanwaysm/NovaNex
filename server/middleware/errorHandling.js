// const errorMiddleware =(err,req,res,next)=>{

//       const status=err.status
//       console.log(err.status);
//       if(status==404){
//           res.render('userSide/404Error')
//       }else{
//           res.render('userSide/500Error')
//       }
//   } 
// module.exports = errorMiddleware

const errorMiddleware = (err, req, res, next) => {
    const status = 500; // Default to 500 if status is not provided
    console.log(status);

    if (status === 404) {
        res.status(status).render('userside/404Error');
    } else {
        res.status(status).render('userside/500Error');
    }
};

module.exports = errorMiddleware;