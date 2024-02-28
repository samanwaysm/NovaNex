
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