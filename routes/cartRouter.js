
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Carts = require('../models/carts');
const authenticate = require('../authenticate');
const Products = require('../models/products');
const cartRouter = express.Router();

cartRouter.use(bodyParser.json());


//-------------------------------------------------------------------------------
//RESTful api '/carts/'
cartRouter.route('/')
    //Get all the products in the shopping cart based on their related cart owners.
    //The result would be an array in json format.
    .get(authenticate.verifyUser,(req, res, next) => {
        Carts.find({owner:req.user._id})
        .populate('products')
        .then((carts) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(carts);
        }, (err) => next(err)).catch((err) => next(err));
    })

    //Add a new product to the shopping cart based on their related cart owners.
    //The result would return the new product information in json format.
     //In the request body, the format should be {"products":"product id"}
    .post(authenticate.verifyUser,(req, res, next) => {
        if (req.body != null) {
            req.body.owner = req.user._id;
            Carts.create(req.body)
            .then((cart) => {
                Carts.findById(cart._id)
                .then((cart) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(cart);
                })
            }, (err) => next(err)).catch((err) => next(err));
        }
        else {
            err = new Error('Item not found in request body');
            err.status = 404;
            return next(err);
        }
       
    })

    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /carts');
    })

    //Clear all the products in the shopping cart based on their related cart owners.
    .delete(authenticate.verifyUser,(req, res, next) => {
        Carts.remove({owner:req.user._id}).then((result) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(result);
        }, (err) => next(err)).catch((err) => next(err));
    })


//-------------------------------------------------------------------------------
//RESTful api '/carts/placeorder?'
cartRouter.route('/placeorder?')

    .get((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /carts/placeorder?');
    })

    // Transact all the products in the shopping cart.
    // It will first check whther the shopping cart is empty. If empty, it will return an error message
    // Then it will transact products one by one. Only those items' inventory is more than 0, the transaction will be done. Or it will return an error meassage.
    .post(authenticate.verifyUser,(req, res, next) => {
        Carts.find({owner:req.user._id})
        .populate('products')
        .then((carts) => {
            if(carts.length>0){
                var count = 0;
                for(let cart of carts){
                    Products.findById(cart.products._id).then((product) => {
                        if(product.inventory>0){
                            Products.findByIdAndUpdate(product._id, {
                                    $set: { inventory: product.inventory-1 }
                                }, {
                                    new: true
                                }).then((result) => { });
                            Carts.remove({_id:cart._id}).then((result) => { });
                        }
                        else{count++}
                    })
                }
                Carts.find({owner:req.user._id})
                .then((carts) => {
                    if(count>0){
                        var errMess="Some products have no inventory and we kept these products in your shopping cart. Other products have been transacted."
                        err = new Error(errMess);
                        err.status = 404;
                        return next(err);
                    }
                    else{
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({
                            success: true,
                            status: 'Transaction Successful!'
                          });
                    }
                })
            }
            else{
                err = new Error("Your shopping cart is empty.");
                res.statusCode = 404;
                return next(err);
            }
        }, (err) => next(err)).catch((err) => next(err));
    })

    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /carts/placeorder?');
    })

    .delete((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /carts/placeorder?');
    })

//-------------------------------------------------------------------------------
//RESTful api '/carts/:cartId'
cartRouter.route('/:cartId')
    .get(authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation is not supported on /carts/:cartId');
    })

    .post(authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation is not supported on /carts/:cartId');       
    })

    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation is not supported on /carts/:cartId');
    })

    //Delete one product in the shopping cart based on its id.
    .delete(authenticate.verifyUser,(req, res, next) => {
        Carts.findById(req.params.cartId).then((cart) => {
            if((""+cart.owner)==req.user._id){
                Carts.findByIdAndRemove(req.params.cartId).then((result) => {
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





module.exports = cartRouter;
