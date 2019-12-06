/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user_model');
var bcrypt = require('bcryptjs');

module.exports = function (passport) {

    passport.use(new LocalStrategy(function (username, password, done) {

        User.findOne({username: username}, function (err, user) {
            if (err)
                console.log(err);
            if(!user) {
                return done(null, false, {message: 'No user found'});
            }
            
            bcrypt.compare(password, user.password, function(err, isMatch){
                if (err) 
                    console.log(err);
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message:'Wrong password'});
                }
            });

        });

    }));
    
    passport.serializeUser(function (user, done){
        done(null, user.id);
    });
    
    passport.deserializeUser(function (id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });
};


