const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

router.get('/login', (req, res) => {
    //returns an array
    User.find({email: req.body.email}) 
    .exec()
    .then((userQuery) => {
        //for no entries in the returned array
        if(userQuery.length < 1) {
            // 401 because we dont want to tell the 
            // spammer that an ID doesn't exist so
            // responding with 401 and not 404
            return res.status(401).json({
                error: "Auth failed"
            })
        }
        //now we validate the password
        bcrypt.compare(req.body.password, userQuery[0].password, (err, noErr) =>{
            // err = true only if it's not same
            if(err){
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            /************************************************
             * Here, we alsi need to return a token for 
             * session so JWT //npm install jsonwebtoken
             */
            if(noErr){
                // arg1: what we want to send client
                // arg2: a secret we came up with 
                // arg3: obj for options for signin process
                const token = jwt.sign(
                    {
                        email: userQuery[0].email,
                    }, 
                    process.env.JWT_KEY, 
                    {
                        expiresIn: "1h"
                    },  
                    )
                return res.status(200).json({
                    response: "Auth successful",
                    token: token
                })
            }
            // else, it was able to compare
            return res.status(401).json({
                message: "Auth failed"
            });
        })
    })

});


module.exports = router;
