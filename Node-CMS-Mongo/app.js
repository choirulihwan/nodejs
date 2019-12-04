/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var express = require('express');
var path = require('path');
var mongoose = require('mongoose'); //koneksi ke mongodb
var config = require('./config/database'); //database config
var bodyParser = require('body-parser'); //get data from post form
var session = require('express-session'); //menghandle session
var fileUpload = require('express-fileupload');


//setting global 
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);

//connect to mongodb
mongoose.connect(config.database);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
   //connection success
   console.log('connected to mongodb');
});

//init app
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

//set global errors
app.locals.errors = null;

//Get all pages
var PageModel = require('./models/page_model');
PageModel.find({}).sort({sorting:1}).exec(function(err, pages){
   if (err) { 
       console.log(err);
   } else {
       app.locals.pages = pages;
   } 
});

//Get categories
var CategoryModel = require('./models/category_model');
CategoryModel.find({}).sort({sorting:1}).exec(function(err, categories){
   if (err) { 
       console.log(err);
   } else {
       app.locals.categories = categories;
   } 
});

//Express file upload
app.use(fileUpload());

//body-parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//express-session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  //cookie: { secure: true }
}));


//express-messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('*', function(req, res, next){
    res.locals.cart = req.session.cart;
    next();
});

// router
var pages = require('./routes/pages');
var products = require('./routes/products');
var cart = require('./routes/cart');
var adminPages = require('./routes/admin_pages');
var adminCategories = require('./routes/admin_categories');
var adminProducts = require('./routes/admin_products');

app.use('/admin/products', adminProducts);
app.use('/admin/categories', adminCategories);
app.use('/admin/pages', adminPages);
app.use('/products', products);
app.use('/cart', cart);
app.use('/', pages);


//start server
var port = 3000;
app.listen(port, function(){
    console.log('Server started on port' + port);
});
