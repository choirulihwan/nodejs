var express = require('express');
var router = express.Router();

const { check, validationResult } = require('express-validator');

//Get page model
var CategoryModel = require('../models/category_model');

var auth = require('../config/auth');
var isAdmin = auth.isAdmin;
/*
 * Get categories index
 */
router.get('/', isAdmin, function(req, res) {
    
    CategoryModel.find( function (err, categories){
        if(err) return console.log(err);
        
        res.render('admin/categories', {
           categories: categories 
        });
    });
    
});

/*
 * add categories
 */
router.get('/add-category', isAdmin, function(req, res) {
    var title = "";
    var slug = "";
    
    res.render('admin/add_category', {
       title: title,
       slug: slug       
    });
    
});

/*
 * post category 
 */
router.post('/add-category', [
    check('title').isLength({ min:1 })    
], (req, res) => {
    
    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug === "") slug = title.replace(/\s+/g, '-').toLowerCase();
        
    var errors = validationResult(req);
    if (!errors.isEmpty()) {        
        res.render('admin/add_category', {
            errors: errors.array(),
            title: title,
            slug: slug
         });
        //return res.status(422).json({ errors: errors.array() });        
    } else {
        //console.log('success');
        CategoryModel.findOne({slug: slug}, function(err, category){
            if(category) {
                req.flash('danger', 'Category slug exists ');
                res.render('admin/add_category', {
                    title: title,
                    slug: slug
                });
            } else {
                var category = new CategoryModel({
                   title: title,
                   slug: slug                   
                });
                
                category.save(function(err){
                    if(err)
                        return console.log(err);
                    
                    req.flash('success', 'Category added');
                    res.redirect('/admin/categories');
                });
            }
        });
    }
});

/*
 * Get edit categories
 */
router.get('/edit-category/:id', isAdmin, function(req, res) {
    
    CategoryModel.findById(req.params.id, function(err, category){
       if (err) return console.log(err);
       
       res.render('admin/edit_category', {
          title: category.title,
          slug: category.slug,          
          id: category._id
       });
    });
    
});

/*
 * post edit 
 */
router.post('/edit-category/:id', [
    check('title').isLength({ min:1 })
], (req, res) => {
    
    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug === "") slug = title.replace(/\s+/g, '-').toLowerCase();
    var id = req.body.id;
    
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('admin/edit_category', {
            errors: errors.array(),
            title: title,
            slug: slug,
            id: id
         });
        //return res.status(422).json({ errors: errors.array() });
        
    } else {
        //console.log('success');
        CategoryModel.findOne({slug: slug, _id:{'$ne':id}}, function(err, category){
            if(category) {
                req.flash('danger', 'Category slug exists ');
                res.render('admin/edit_category', {
                    title: title,
                    slug: slug,
                    id: id
                });
            } else {
                CategoryModel.findById(id, function(err, category){
                    if(err) return console.log(err);
                    
                    category.title = title;
                    category.slug = slug;                    
                    
                    category.save(function(err){
                        if(err)
                            return console.log(err);

                        req.flash('success', 'Category updated');
                        res.redirect('/admin/categories/edit-category/' + category._id);
                    });
                });
            }
        });
    }
});

/*
 * Get delete
 */
router.get('/delete-category/:id', isAdmin, function(req, res) {
    
    CategoryModel.findByIdAndRemove(req.params.id, function(err) {
        if(err) return console.log(err);
        
        req.flash('success', 'Category deleted');
        res.redirect('/admin/categories');
        
    });
    
});
//export module
module.exports = router;
