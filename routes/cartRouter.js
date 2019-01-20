
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Carts = require('../models/carts');
const authenticate = require('../authenticate');
const Products = require('../models/products');

const cartRouter = express.Router();

cartRouter.use(bodyParser.json());

cartRouter.route('/')
    .get(authenticate.verifyUser,(req, res, next) => {
        Carts.find({owner:req.user._id})
        .populate('products')
        .then((carts) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(carts);
        }, (err) => next(err)).catch((err) => next(err));
    })

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

    .delete(authenticate.verifyUser,(req, res, next) => {
        Carts.remove({owner:req.user._id}).then((result) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(result);
        }, (err) => next(err)).catch((err) => next(err));
    })

cartRouter.route('/placeorder?')
    .get(authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /carts/placeorder?');
    })

    .post(authenticate.verifyUser,(req, res, next) => {
        var errMess="There is no inventory of "
        Carts.find({owner:req.user._id})
        .populate('products')
        .then((carts) => {
            for(let cart of carts){
                Products.findById(cart.products._id).then((product) => {
                    if(product.inventory>0){
                        Products.findByIdAndUpdate(product._id, {
                                $set: { inventory: product.inventory-1 }
                            }, {
                                new: true
                            })
                        Carts.remove({_id:cart._id})
                    }
                    else{
                        errMess+= cart.products.title+" ";
                    }
                })
            }
            Carts.find({owner:req.user._id})
            .then((carts) => {
                if(carts.length>0){
                    errMess+="\n We kept these items in your shopping cart."
                    err = new Error(errMess);
                    err.status = 403;
                    return next(err);
                }
                else{
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(cart);
                }
            })


        }, (err) => next(err)).catch((err) => next(err));
    })

    

    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /carts/placeorder?');
    })

    .delete(authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /carts/placeorder?');
    })



module.exports = cartRouter;
