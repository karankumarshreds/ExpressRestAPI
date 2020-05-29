const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        message: "PRODUCTS"
    });
});

router.post('/', (req, res) => {
    //name, price are expected by this endpoint
    const product = {
        name: req.body.name,
        price: req.body.price,
    }
    res.status(201).json({
        message: "PRODUCTS_POST",
        createdProduct: product
    });
});

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    res.status(200).json({
        message: `you sent ${id} id!!!!!` 
    })
});

router.patch('/:id', (req, res) => {
    const id = req.params.id;
    res.status(200).json({
        message : `The one with id ${id} is updated`
    });
});

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    res.status(200).json({
        message : `The one with id ${id} is deleted`
    });
})

module.exports = router;