const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res) => {
    
    Order.find()
    // what fields to show 
    .select('productId quantity _id')
    //pass the name of reference property you wanna populate
    //in our case it's Product as mentioned in the schema Ref
    /*******************************************************
     * this will show a detailed json of product as well
     * and not just the productId as it was showing b4
     */
    .populate('productId')
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
    const orderId = req.params.id;
    Order.findById(orderId)
    .populate('productId', '_id name price')
    .select('_id quantity')
    .then(result => {
        if (!result) {
            return res.status(404).json({
                response: "Error",
                message: "Order not found"
            })
        } else {
            return res.status(200).json(result)
        }
    })
    .catch(err => {
        return res.status(400).json(err)
    })
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
            //returning a promise
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

// router.delete('/:id', (req, res) => {
//     const id = req.params.id;
    
// });

module.exports = router;

// router.delete('/:id', (req, res) => {
//     const id = req.params.id;
//     Product.remove({_id: id})
//     .exec()
//     .then((result) => {
//         res.status(201).json({
//             response: "Success",
//             data: result
//         });
//     })
//     .catch((err) => {
//         res.status(500).json({
//             response: "Failed",
//             data: err
//         })
//     })
// });
