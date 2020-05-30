const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res) => {
    
    Order.find()
    .select('productId quantity _id')
    .exec()
    .then((result) => {
        res.status(200).json({
            response: "Success",
            orders: result
        })
    })
    .catch((err) => {
        res.status(404).json({
            response: "Failed",
            error: err
        })
    })

});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    res.status(200).json({
        orders : "You got all the orders",
        id: `Your order id ${id}`
    });
});

router.post('/', (req, res) => {

    Product.findById(req.body.productId)
    .exec()
    .then((product) => {
        if (product){
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                productId: req.body.productId
            });
            return order.save();
        } else {
            throw Error();
        }
    })
    .then((result) => {
        res.status(200).json({
            response: "Success",
            order: result
        })
    })
    .catch((err) => {
        res.status(500).json({
            response: "Product not found",
            error: err
        })
    });
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    res.status(200).json({
        orders : "You got all the orders",
        id: `Your order id ${id} is deleted`
    });
});

module.exports = router;