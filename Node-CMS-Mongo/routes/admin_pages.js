var express = require('express');
var router = express.Router();

//Get page model
var PageModel = require('../models/page_model');

/*
 * Get pages index
 */
router.get('/', function(req, res) {
    //res.send('Admin area');
    PageModel.find({}).sort({sorting:1}).exec(function (err, pages){
        res.render('admin/pages', {
           pages: pages 
        });
    });
});

/*
 * Get pages
 */
router.get('/add-page', function(req, res) {
    var title = "";
    var slug = "";
    var content = "";
    
    res.render('admin/add_page', {
       title: title,
       slug: slug,
       content: content,
    });
    
});


/*
 * Get post 
 */
const { check, validationResult } = require('express-validator');

router.post('/add-page', [
    check('title').isLength({ min:1 }),
    check('content').isLength({ min:1 })
], (req, res) => {
    
    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug === "") slug = title.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;
    
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
        //console.log('errors');
        res.render('admin/add_page', {
            errors: errors.array(),
            title: title,
            slug: slug,
            content: content
         });
        //return res.status(422).json({ errors: errors.array() });
        
    } else {
        //console.log('success');
        PageModel.findOne({slug: slug}, function(err, page){
            if(page) {
                req.flash('danger', 'Page slug exists ');
                res.render('admin/add_page', {
                    title: title,
                    slug: slug,
                    content: content
                });
            } else {
                var page = new PageModel({
                   title: title,
                   slug: slug,
                   content: content,
                   sorting: 100
                });
                
                page.save(function(err){
                    if(err)
                        return console.log(err);
                    
                    req.flash('success', 'Page added');
                    res.redirect('/admin/pages');
                });
            }
        });
    }
});

/* deprecated
router.post('/add-page', function(req, res) {
    req.checkBody('title', 'title must have a value').notEmpty();
    req.checkBody('content', 'content must have a value').notEmpty();
    
    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
    if (slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();
    var content = req.body.content;
    
    var errors = req.validationErrors();
    if (errors) {
        console.log('errors');
        res.render('admin/add_page', {
            title: title,
            slug: slug,
            content: content
         });
    } else {
        console.log('success');
    }
});
 */

//export module
module.exports = router;
