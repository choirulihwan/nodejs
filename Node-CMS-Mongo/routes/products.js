var express = require('express');
var router = express.Router();
var ProductModel = require('../models/product_model');
var CategoryModel = require('../models/category_model');
var fs = require('fs-extra');

/*
 * get /
 */
router.get('/', function(req, res) {
    ProductModel.find(function(err, products){
        if (err)
            console.log(err);

        res.render('all_products', {
            title: 'All products',
            products: products
        });
        
    });   
});

/*
 * get product by category
 */
router.get('/:category', function(req, res) {
    
    var category_slug = req.params.category;
    
    CategoryModel.findOne({slug: category_slug}, function(err, c){
        ProductModel.find({category: category_slug}, function (err, products) {
            if (err)
                console.log(err);

            res.render('cat_products', {
                title: c.title,
                products: products
            });

        });   
    });
    
});

/*
 * get product detail
 */
router.get('/:category/:product', function(req, res) {
    
    var galleryImages = null;
    var loggedIn = (req.isAuthenticated()) ? true : false;

    ProductModel.findOne({slug: req.params.product}, function (err, product) {
        if (err) {
            console.log(err);
        } else {
            var galleryDir = 'public/product_images/' + product._id + '/gallery';
            fs.readdir(galleryDir, function(err, files){
                if (err){
                    console.log(err);
                } else {
                    galleryImages = files;
                    res.render('product', {
                        title: product.title,
                        p: product,
                        galleryImages: galleryImages,
                        loggedIn: loggedIn
                    });
                }
            });
        }
        

    });   
    
    
});

//export module
module.exports = router;
