const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

//importing user model
const User = require("../models/user");

router.post('/signup', (req, res) => {
        // salt : means we add random strings to the 
        // password before we hash it so that it cant
        // be decrypted. Here we are using 10 rounds 
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err) {
            return res.status(500).json({
                error: err
            });
        } else {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash
            })
            user.save()
            .then((result) => {
                return res.status(201).json({
                    response: "Success"
                })
            }).catch((err) => {
                return res.status(500).json({
                    error: err
                })
            })
        }
    });
});


module.exports = router;
