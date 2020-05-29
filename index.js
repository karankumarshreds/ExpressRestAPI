const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const productRoutes = require('./routes/products')
const orderRoutes = require('./routes/orders');


/********************************************************
 *  Middleware to route requests to individual endpoints
 */
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);


/********************************************************
 *  Requests unhandled by the middleware will give error
 */
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        response: error.message //'Not Found'
    });
})

app.listen(port);
