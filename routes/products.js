const express = require('express');
const router = express.Router();

const Product = require('../models/product');
const mongoose = require('mongoose');

/**********************************************
 * Used to upload files. Works like body parser
 * but by using multer you can also parse files 
 */
const multer = require('multer');

/***********************************************
 * IMPORTANT: BUT preffered approach. Allows you
 * to configure how the multer middleware will
 * store the files. Multer will execute the ()s
 * whenever the new files are recieved
 */
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString + file.originalname);
    }
})
//filter file type before uploading
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        //to save it
        cb(null, true);
    } else {
        //to reject it and the rest of the data along with 
        //the file will not be saved
        cb(new Error('Cannot save the file type'), false);
    }
}
//starage is the upload configuration mentioned above
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 //max 5mb 
    },
    fileFilter: fileFilter
})

router.get('/', (req, res) => {

    Product.find()
    .select('name price _id productImgURL')
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
                        productImgURL: each.productImgURL,
                        request: {
                            type: "GET",
                            url: `http://localhost:3000/products/${each._id}`,
                        }
                    }
                })
            });
        }
    });
});

/*******************************************************************
 * upload.single() (middleware) will take in single file and upload 
 * productImg : is the name of the field that would hold the file
 * so basically you will be sending data through multer this time 
 * which means, req.body.name etc will be fetched using the multer
 * middleware. So it can do both the things. Uses formData to send
 */
router.post('/', upload.single('productImg'), (req, res) => {

    //saving to the instance of product model
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImgURL: req.file.path
    });
    product.save()
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

router.get('/:id', (req, res) => {

    const id = req.params.id;
    Product.findById(id)
    .select('_id name price productImgURL')
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
    Product.findById(id)
    .then( product => {
        if (!product) {
            res.status(404).json({
                error: "No Product Found"
            })
        } else {
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
        }
    }) 
});

module.exports = router;