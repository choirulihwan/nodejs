var express = require('express');
var router = express.Router();
var ProductModel = require('../models/product_model');

/*
 * get add product to cart
 */
router.get('/add/:product', function(req, res) {
    
    var slug = req.params.product;    
    
    ProductModel.findOne({slug:slug}, function(err, p){
        if (err)
            console.log(err);

        if (typeof req.session.cart == "undefined") {
            req.session.cart = [];
            req.session.cart.push({
                title:slug,
                qty:1,
                price:parseFloat(p.price).toFixed(2),
                image:'/product_images/' + p._id + '/' + p.image
            });
        } else {
            var cart = req.session.cart;
            var newItem = true;
            
            for(var i=0; i<cart.length; i++){
                if (cart[i].title == slug){
                    cart[i].qty++;
                    newItem = false;
                    break;
                }
            }
            
            if(newItem){
                cart.push({
                    title: slug,
                    qty: 1,
                    price: parseFloat(p.price).toFixed(2),
                    image: '/product_images/' + p._id + '/' + p.image
                });
            }
        }
        
        //console.log(req.session.cart);
        req.flash('success', 'product added to cart');
        res.redirect('back');
        
    });   
});

/*
 * checkout
 */
router.get('/checkout', function(req, res) {
    
    res.render('checkout', {
        title: 'Checkout',
        cart: req.session.cart
    });
    
});

//export module
module.exports = router;
