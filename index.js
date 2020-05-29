const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');

const productRoutes = require('./routes/products')
const orderRoutes = require('./routes/orders');

/********************************************************
 *  To parse encoded url encoded and jason related data 
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/********************************************************
 *  Middleware to send CORS header response first before
 * routes send their individual responses(all requests)
 */
app.use((req, res, next) => {
    //you can also specify a specific host with IP
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*')
    //this is for the browser
    if (req.method === "OPTIONS") {
        res.header('Access-Control-Allow-Methods', 'POST, DELETE, PATCH, GET');
        return res.status(200).json({});
    }
});


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
