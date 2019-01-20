
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Products = require('../models/products');
const authenticate = require('../authenticate');
const productRouter = express.Router();
productRouter.use(bodyParser.json());

//-------------------------------------------------------------------------------
//RESTful api '/products/'
productRouter.route('/')
    //Get all the products in the database.
    //The result would be an array in json format.
    .get((req, res, next) => {
        Products.find()
        .then((products) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(products);
        }, (err) => next(err)).catch((err) => next(err));
    })

    //Add a new product to the database .
    //The result would return the new product information in json format.
    //In the request body, the format should be {"title":"product title","price":product price,"inventory":product inventory number}
    .post(authenticate.verifyUser,(req, res, next) => {
        if (req.body != null) {
            req.body.owner = req.user._id;
            Products.create(req.body)
            .then((product) => {
                Products.findById(product._id)
                .then((product) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(product);
                })
            }, (err) => next(err)).catch((err) => next(err));
        }
        else {
            err = new Error('Product not found in request body');
            err.status = 404;
            return next(err);
        }
       
    })

    .put(authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /products');
    })

     //Delete all the products in the database based on their related owners.
    .delete(authenticate.verifyUser,(req, res, next) => {
        Products.remove({owner: req.user._id}).then((result) => {
            res.statusCode = 200;
           res.setHeader("Content-Type", "application/json");
           res.json(result);
        }, (err) => next(err)).catch((err) => next(err));
    })

//-------------------------------------------------------------------------------
//RESTful api '/products//available?'
productRouter.route('/available?')

    //Get all the products with available inventory in the database
    .get((req, res, next) => {
        Products.find({inventory : {$gte : 1}})
        .then((products) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(products);
        }, (err) => next(err)).catch((err) => next(err));
    })

    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /products/available?');
    })

    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /products/available?');
    })

    .delete((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /products/available?');
    })

//-------------------------------------------------------------------------------
//RESTful api '/products/:productId'
productRouter.route('/:productId')

    //Get one product in the database based on its id.
    .get((req, res, next) => {
        Products.findById(req.params.productId).then((product) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(product);
        }, (err) => next(err)).catch((err) => next(err));
    })

    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation is not supported on /products/:productId');
    })

    //Update one product in the database based on its id.
    //The result would return the new product information in json format.
    //In the request body, the format should be {"title":"product new title","price":product new price,"inventory":product new inventory number}
    .put(authenticate.verifyUser,(req, res, next) => {
        Products.findById(req.params.productId).then((product) => {
            if((""+product.owner)==req.user._id){
                Products.findByIdAndUpdate(req.params.productId, {
                        $set: req.body
                    }, {
                        new: true
                    }).then((product) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(product);
                    })
            }
            else{
                err = new Error('You are not the owner.');
                err.status = 401;
                return next(err);
            }
        }, (err) => next(err)).catch((err) => next(err));
    })

    //Delete one product in the database based on its id.
    .delete(authenticate.verifyUser,(req, res, next) => {
        Products.findById(req.params.productId).then((product) => {
                if((""+product.owner)==req.user._id){
                    Products.findByIdAndRemove(req.params.productId).then((result) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(result);
                    })
                }
                else{
                    err = new Error('You are not the owner.');
                    err.status = 401;
                    return next(err);
                }
            }, (err) => next(err)).catch((err) => next(err));
        })


module.exports = productRouter;
