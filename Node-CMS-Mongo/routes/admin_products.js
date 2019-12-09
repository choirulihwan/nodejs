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

var auth = require('../config/auth');
var isAdmin = auth.isAdmin;
/*
 * Get products index
 */
router.get('/', isAdmin, function(req, res) {
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
router.get('/add-product', isAdmin, function(req, res) {
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
        var extension = (path.extname(req.files.img.name)).toLowerCase(); 
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
router.get('/edit-product/:id', isAdmin, function(req, res) {
    
    var errors;
    
    if (req.session.errors)
        errors = req.session.errors;
    req.session.errors = null;
    
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
 * post update product 
 */
/*
 * post add product 
 */
router.post('/edit-product/:id', [
    check('title').isLength({ min:1 }),
    check('desc').isLength({ min:1 }),
    check('price').isDecimal()    
], (req, res) => {
    
    //var imageFile = typeof req.files.img !== "undefined" ? req.files.img.name : "";    
    //console.log(req.filesp);
    if(req.files != null) 
        var imageFile = req.files.img.name;    
    else 
        var imageFile = "";
    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug === "") slug = title.replace(/\s+/g, '-').toLowerCase();
    var desc = req.body.desc;
    var price = req.body.price;
    var category = req.body.category;
    var pimage = req.body.pimage;
    var id = req.params.id;
    
    
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        //return res.status(422).json({ errors: errors.array() });    
        req.session.errors = errors.array();
        res.redirect('/admin/products/edit-product/' + id);
    } else {
        
        ProductModel.findOne({slug: slug, _id:{'$ne':id}}, function(err, product){
            if (err){ console.log(err); }
            
            if(product){
                req.flash('danger', 'Product title exists, choose another');
                res.redirect('/admin/products/edit-product' + id);
                        
            } else {
                
                ProductModel.findById(id, function(err, p){
                    if (err)
                        console.log(err);
                    
                    p.title = title;
                    p.slug = slug;
                    p.desc = desc;
                    p.price = parseFloat(price).toFixed(2);
                    p.category = category;
                    if (imageFile != ""){
                        p.image = imageFile;
                    }
                    
                    p.save(function(err){
                       if (err) console.log(err);
                       if (imageFile != ""){
                           if (pimage != ""){
                               fs.remove('public/product_images/' + id + '/' + pimage, function(err){
                                  if(err) console.log(err); 
                               });
                           }
                           
                           var productImage = req.files.img;
                           var path = 'public/product_images/' + p._id + '/' + imageFile;
                           productImage.mv(path, function(err){
                               //return console.log(err);
                           });
                       }
                       
                        req.flash('success', 'Product updated');
                        res.redirect('/admin/products');
                    });
                    
                });
                
            }
        });
    }
});

/*
 * post product gallery
 */
router.post('/product-gallery/:id', function(req, res) {
    
    var productImage = req.files.file;
    var id = req.params.id;
    var path = 'public/product_images/' + id + '/gallery/' + req.files.file.name;
    var thumbsPath = 'public/product_images/' + id + '/gallery/thumbs/' + req.files.file.name;
    
    productImage.mv(path, function(err){
        if (err) 
           console.log(err); 
       
            resizeImg(fs.readFileSync(path), {width:100, height:100}).then(function (buf) {           
               fs.writeFileSync(thumbsPath, buf, 'utf8');
            });
       
    });
    
    res.sendStatus(200);
    
});

/*
 * Get image delete
 */
router.get('/delete-image/:image', isAdmin, function(req, res) {
    
    var originalImage = 'public/product_images/' + req.query.id + '/gallery/' + req.params.image;
    var thumbImage = 'public/product_images/' + req.query.id + '/gallery/thumbs/' + req.params.image;
    
    fs.remove(originalImage, function(err) {
       if(err){ 
           console.log(err);
       } else {
           fs.remove(thumbImage, function(err) {
             if (err) {
                 console.log(err);
             } else {
                 req.flash('success', 'Image deleted');
                 res.redirect('/admin/products/edit-product/' + req.query.id);
             }
           });
       }
       
    });
    
});

/*
 * Get products deleted
 */
router.get('/delete-product/:id', isAdmin, function(req, res) {
    
    var id = req.params.id;
    var path = 'public/product_images/' + id;
    
    fs.remove(path, function(err){
       if(err) {
            console.log(err);
        } else {
            ProductModel.findByIdAndRemove(id, function(err) {
                if(err) return console.log(err);

                req.flash('success', 'Product deleted');
                res.redirect('/admin/products');

            });
        }
    });
});
//export module
module.exports = router;
