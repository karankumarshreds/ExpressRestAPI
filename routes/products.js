const express = require('express');
const router = express.Router();

const Product = require('../models/product');
const mongoose = require('mongoose');

router.get('/', (req, res) => {

    Product.find()
    .select('name price _id')
    .exec()
    .then((result) => {
        if (result.length >0) {
            res.status(200).json({
                response: "Success",
                count: result.length,
                products: result.map((each) => {
                    return {
                        name: each.name,
                        id: each._id,
                        price: each.price,
                        request: {
                        type: "GET",
                        url: `http://localhost:3000/products/${each._id}`
                    }
                    }
                })
            })
        }
    })

});

router.post('/', (req, res) => {

    //saving to the instance of product model
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save().then((result) => {
        res.status(200).json({
            response: "Success",
            createdProduct: result
        })
    }).catch((err) => {
        res.status(500).json({
            response: "Failed",
            error: err
        })
    });

});

router.get('/:id', (req, res) => {

    const id = req.params.id;
    Product.findById(id)
    .exec()
    .then((result) => {
        res.status(200).json(result);
    })
    .catch((err) => {
        res.status(500).json({
            error: err
        });
    });

});

router.patch('/:id', (req, res) => {
    const id = req.params.id;
    const updatedObj = {
        name: req.body.name,
        price: req.body.price
    }
    Product.update({_id:id}, { $set: updatedObj})
    .exec()
    .then((result) => {
        res.status(200).json({
            response: "Success",
            createdProduct: result
        })
    }).catch((err) => {
        res.status(500).json({
            response: "Failed",
            error: err
        })
    });
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    Product.remove({_id: id})
    .exec()
    .then((result) => {
        res.status(201).json({
            response: "Success",
            data: result
        });
    })
    .catch((err) => {
        res.status(500).json({
            response: "Failed",
            data: err
        })
    })
});

module.exports = router;