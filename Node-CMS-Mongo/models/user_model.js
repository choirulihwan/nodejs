var mongoose = require('mongoose');

//Page Schema
var UserSchema = mongoose.Schema({
   name: {
     type: String,
     required: true
   }, 
   email: {
     type: String, 
     required: true
   }, 
   username: {
     type: String,
     required: true
   }, 
   password: {
     type: String,
     required: true
   }, 
   admin: {
     type: Number    
   } 
});

var UserModel = module.exports = mongoose.model('User', UserSchema);