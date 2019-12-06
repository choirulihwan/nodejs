var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcryptjs');
var UserModel = require('../models/user_model');

const { check, validationResult } = require('express-validator');

/*
 * get register
 */
router.get('/register', function(req, res) {
    res.render('register', {
        title: 'Register'
    });
});

/*
 * post register
 */

router.post('/register', [
    check('name', 'cannot be empty').isLength({ min:1 }),
    check('email', 'Not valid').isEmail(),
    check('username', 'cannot be empty').isLength({ min:1 }),
    check('password', 'Invalid').isLength({ min:4 }),
    check('password2', 'Invalid')
            .isLength({ min:4 })
            .custom((value, {req, loc, path}) => {
                if ( value !== req.body.password ){
                   throw new Error("doesnt match"); 
                } else {
                    return value;
                }
            })    
], (req, res) => {
    
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    
    var errors = validationResult(req);
    
    if (!errors.isEmpty()) {        
        res.render('register', {
            errors: errors.array(),
            title: 'Register'            
         });
        //return res.status(422).json({ errors: errors.array() });        
    } else {
        UserModel.findOne({username: username}, function(err, user){
            if(user) {
                req.flash('danger', 'Username exists ');
                res.redirect('/users/register');
            } else {
                var user = new UserModel({
                   name: name,
                   email: email,
                   username: username,
                   password: password,
                   admin: 0
                });
                
                bcrypt.genSalt(10, function(err, salt){
                    bcrypt.hash(user.password, salt, function(err, hash){
                        if(err) console.log(err);
                        user.password = hash;
                        
                        user.save(function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                req.flash('success', 'You are now registered');
                                res.redirect('/users/login');
                            }
                        });
                    });
                });                
                
            }
        });
    }    
});

/*
 * get login
 */
router.get('/login', function(req, res) {
    
    if(res.locals.user) res.redirect('/');
    
    res.render('login', {
        title: 'Log in'
    });
});

/*
 * post login
 */
router.post('/login', function(req, res, next) {
    
    passport.authenticate('local', {
       successRedirect: '/',
       failureRedirect: '/users/login',
       failureFlash: true     
    })(req, res, next);
});

//export module
module.exports = router;
