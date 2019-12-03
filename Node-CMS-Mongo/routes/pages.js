var express = require('express');
var router = express.Router();
var PageModel = require('../models/page_model');

/*
 * get /
 */
router.get('/', function(req, res) {
    PageModel.findOne({slug:'home'}, function(err, page){
        if (err)
            console.log(err);

        res.render('index', {
            title: page.title,
            content: page.content
        });
        
    });   
});

/*
 * get page
 */
router.get('/:slug', function(req, res) {
    var slug = req.params.slug;
    
    PageModel.findOne({slug:slug}, function(err, page){
        if (err)
            console.log(err);
      
        if (!page) {
            res.redirect('/');
        } else {
            res.render('index', {
                title: page.title,
                content: page.content
            });
        }
    });   
    
});

//export module
module.exports = router;
