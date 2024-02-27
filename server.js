if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const dotenv = require('dotenv')
const session = require('express-session');
const morgan = require('morgan')
const bodyparser = require('body-parser');
const path = require('path');
const errorMiddleware = require('./server/middleware/errorHandling')
const connectDB = require('./server/database/connection')

const router = require('./server/routes/router');
const adminRouter = require('./server/routes/adminRouter');


const PORT = process.env.PORT || 8080;

const cacheTime = 60;
app.use((req, res, next) => {
    // res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); 
    res.setHeader("Cache-Control", `public,no-store, must-revalidate, max-age=${cacheTime}`);
    res.setHeader("Pragma", "no-cache");  
    next()
})





// log requests
// app.use(morgan('tiny'));

// mongodb connection
connectDB();

// parse request to body-parser
app.use(bodyparser.urlencoded({extended:true}))

// set view engine
app.set('view engine', 'ejs');
// app.set('views')

app.use(express.static('assets'));
// app.use(express.static(path.join(__dirname, 'public')));


// Use the express-session middleware
app.use(session({
    secret: 'your-secret-key', // Change this to a random and secure string
    resave: false,
    saveUninitialized: true,
  }));
  
app.use('/',router );
app.use('/',adminRouter );
app.get("*",function(req,res){
    res.status(404).render("userSide/404Error")
})
app.use(errorMiddleware)


// app.get('/Cat',(req,res)=>{
//     res.render('productsByCategory')
// })


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});