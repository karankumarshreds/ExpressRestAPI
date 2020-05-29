const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({
        orders : "You got all the orders"
    });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    res.status(200).json({
        orders : "You got all the orders",
        id: `Your order id ${id}`
    });
});

router.post('/', (req, res) => {
    const order = {
        productID: req.body.id,
        quantity: req.body.quantity,
    }
    res.status(201).json({
        orders: "Thanks for posting order",
        order: order,
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