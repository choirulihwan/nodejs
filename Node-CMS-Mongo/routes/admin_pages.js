var express = require('express');
var router = express.Router();

const { check, validationResult } = require('express-validator');

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
       content: content
    });
    
});

/*
 * post reoder pages
 */
router.post('/reorder-pages', function (req, res) {
    //console.log(req.body);    
   var ids = req.body['id[]'];
   var count = 0;
   for (var i=0;i < ids.length;i ++){
       var id = ids[i];
       count++; 
       
       (function(count) {
            PageModel.findById(id, function(err, page){
                page.sorting = count;
                page.save(function (err){
                  if(err) return console.log(err);  
                });
            });
        })(count);
   }
           
});


/*
 * Get post 
 */
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

/*
 * Get edit pages
 */
router.get('/edit-page/:id', function(req, res) {
    
    PageModel.findById(req.params.id, function(err, page){
       if (err) return console.log(err);
       
       res.render('admin/edit_page', {
          title: page.title,
          slug: page.slug,
          content: page.content,
          id: page._id
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
