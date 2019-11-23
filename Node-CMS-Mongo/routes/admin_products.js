var express = require('express');
var router = express.Router();
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var resizeImg = require('resize-img');
var path = require('path');

const { check, validationResult } = require('express-validator');

//Get producr model
var ProductModel = require('../models/product_model');

//Get category model
var CategoryModel = require('../models/category_model');

/*
 * Get products index
 */
router.get('/', function(req, res) {
    var count;
    
    ProductModel.count(function(err, c) {
       count = c; 
    });
    
    ProductModel.find(function (err, products){
        res.render('admin/products', {
           products: products
           //count: count
        });
    });
});

/*
 * Get add product
 */
router.get('/add-product', function(req, res) {
    var title = "";
    var desc = "";
    var slug = "";
    var price = 0;
    
    CategoryModel.find(function (err, categories){ 
        res.render('admin/add_product', {
           title: title,
           slug: slug,
           desc: desc,
           price: price,
           categories:categories
        });
    });
    
});

/*
 * post add product 
 */
router.post('/add-product', [
    check('title').isLength({ min:1 }),
    check('desc').isLength({ min:1 }),
    check('price').isDecimal(),
    check('img').custom((value, { req }) => {
        //console.log(req.files.img.name + ' ext:');
        var extension = (path.extname(req.files.img.name)).toLowerCase(); 
        //console.log(extension);
        switch (extension) {
            case '.jpg':
                return '.jpg';
            case '.jpeg':
                return '.jpeg';
            case '.png':
                return '.png';
            case '':
                return '.jpg';
            default:                
                return false;
        }
    })
], (req, res) => {
    
    var imageFile = typeof req.files.img !== "undefined" ? req.files.img.name : "";
    
    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug === "") slug = title.replace(/\s+/g, '-').toLowerCase();
    var desc = req.body.desc;
    var price = req.body.price;
    var category = req.body.category;
    
    
    var errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        //console.log('errors');
        CategoryModel.find(function(err, categories){
            res.render('admin/add_product', {
                errors: errors.array(),
                title: title,
                slug:slug,
                desc: desc,
                categories: categories,
                price: price
             });
         });
        //return res.status(422).json({ errors: errors.array() });
        
    } else {
        //console.log('success');
        ProductModel.findOne({slug: slug}, function(err, product){
            if(product) {
                req.flash('danger', 'Product slug exists, choose another');
                CategoryModel.find(function(err, categories){
                    res.render('admin/add_product', {
                        title: title,
                        desc: desc,
                        slug: slug,
                        categories: categories,
                        price:price
                    });
                });
            } else {
                
                //process.exit();
                var price2 = parseFloat(price).toFixed(2);
                var product = new ProductModel({
                   title: title,
                   slug: slug,
                   desc: desc,
                   price: price2,
                   category: category,
                   image: imageFile
                });
                //console.log(imageFile);
                product.save(function(err){
                    if(err) return console.log(err);
                    
                    mkdirp('public/product_images/' + product._id, function(err){
                        return console.log(err);
                    });
                    
                    mkdirp('public/product_images/' + product._id + '/gallery', function(err){
                        return console.log(err);
                    });
                    
                    mkdirp('public/product_images/' + product._id + '/gallery/thumbs', function(err){
                        return console.log(err);
                    });
                    
                    if(imageFile !== ""){
                        var productImage = req.files.img;
                        var path = 'public/product_images/' + product._id + '/' + imageFile;
                        
                        productImage.mv(path, function(err){
                           return console.log(err); 
                        });
                        
                    }
                    
                    req.flash('success', 'Product added');
                    res.redirect('/admin/products');
                });
            }
        });
    }
});

/*
 * Get edit product
 */
router.get('/edit-product/:id', function(req, res) {
    
    var errors;
    
    if (req.session.errors)
        errors = req.session.errors;
    
    CategoryModel.find(function (err, categories){
        ProductModel.findById(req.params.id, function(err, p){
            if (err) {
               console.log(err);
               res.redirect('/admin/products');
            } else { 
                var galleryDir = 'public/product_images/' + p._id + '/gallery';
                var galleryImages = null;
                
                fs.readdir(galleryDir, function(err, files){
                    if(err) {
                        console.log(err);
                    } else {
                        galleryImages = files;
                        res.render('admin/edit_product', {
                            errors:errors,
                            title: p.title,
                            slug: p.slug,
                            desc: p.desc,
                            categories:categories,
                            category: p.category.replace(/\s+/g, '-').toLowerCase(),
                            price: parseFloat(p.price).toFixed(2),
                            image: p.image,
                            galleryImages: galleryImages,
                            id: p._id
                        });
                    }
                });
            }
            
        });
    });
    
    
    
});

/*
 * Get post 
 */
router.post('/edit-page/:id', [
    check('title').isLength({ min:1 }),
    check('content').isLength({ min:1 })
], (req, res) => {
    
    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug === "") slug = title.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;
    var id = req.body.id;
    
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
        //console.log('errors');
        res.render('admin/edit_page', {
            errors: errors.array(),
            title: title,
            slug: slug,
            content: content,
            id: id
         });
        //return res.status(422).json({ errors: errors.array() });
        
    } else {
        //console.log('success');
        PageModel.findOne({slug: slug, _id:{'$ne':id}}, function(err, page){
            if(page) {
                req.flash('danger', 'Page slug exists ');
                res.render('admin/edit_page', {
                    title: title,
                    slug: slug,
                    content: content,
                    id: id
                });
            } else {
                PageModel.findById(id, function(err, page){
                    if(err) return console.log(err);
                    
                    page.title = title;
                    page.slug = slug;
                    page.content = content;
                    
                    page.save(function(err){
                        if(err)
                            return console.log(err);

                        req.flash('success', 'Page updated');
                        res.redirect('/admin/pages/edit-page/' + page._id);
                    });
                    
                    
                });
                
                
            }
        });
    }
});

/*
 * Get pages delete
 */
router.get('/delete-page/:id', function(req, res) {
    
    PageModel.findByIdAndRemove(req.params.id, function(err) {
        if(err) return console.log(err);
        
        req.flash('success', 'Page deleted');
        res.redirect('/admin/pages');
        
    });
    
});
//export module
module.exports = router;
