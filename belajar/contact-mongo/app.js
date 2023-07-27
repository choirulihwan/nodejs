//require
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const { body, validationResult, check } = require('express-validator');
const methodOverride = require('method-override');

require('./utils/db');
const Contact = require('./models/Contact');
// end require

//initiate
const app = express();
const port = 3000;
// end initiate

// use ejs
app.set('view engine', 'ejs');
app.use(expressLayout);
app.use(express.static('public'));
app.use(express.urlencoded({ extended:true }));
app.use(cookieParser('secret'));
app.use(session({
    cookie: {maxAge: 6000},
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(flash()); 
app.use(methodOverride('_method'));
//end use


// routing
app.get('/', (req, res) => {
    res.render('index', {        
         'title': 'Home',        
         layout: 'layouts/main-layout',
     })
});

app.get('/about', (req, res) => {
    res.render(
        'about',        
        { 
            'title': 'About',
            layout: 'layouts/main-layout',            
        } 
    );
});

app.get('/contact', async (req, res) => {
    const contacts = await Contact.find();
    res.render(
        'contact',        
        { 
            'title': 'Contact',
            layout: 'layouts/main-layout', 
            contacts,
            msg: req.flash('msg')          
        } 
    );
});

app.get('/contact/add', (req, res) => {
    res.render(
        'contact-form',        
        { 
            'title': 'Tambah Kontak',
            layout: 'layouts/main-layout', 
            action: '/contact',                       
        } 
    );
});

app.post(
    '/contact', 
    [ 
        check('email', 'Email tidak valid').isEmail(), 
        body('hp').isMobilePhone('id-ID'),
        body('nama').custom(async value => {
            const duplikat = await Contact.findOne( { nama:value } );                  
            if(duplikat) {
                throw new Error('Nama sudah digunakan');
            }
            return true;
        })
    ],
    (req, res) => {        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {            
            res.render(
                'contact-form',        
                { 
                    title: 'Tambah Kontak',
                    layout: 'layouts/main-layout',    
                    errors: errors.array(),
                    action: '/contact'
                } 
            );
        } else {
            Contact.insertMany(req.body, (error => {
                req.flash('msg', 'Kontak berhasil ditambahkan');
                res.redirect('/contact');
            }));            
        }        
    }
);

// app.get('/contact/delete/:nama', async (req, res) => {
//     const contact = await Contact.find({ nama: req.params.nama });

//     if (!contact) {
//         res.status(404);
//         res.send('<h1>404</h1>')
//     } else {
        
//         Contact.deleteOne({ _id: contact._id }, () => {
//             req.flash('msg', 'Kontak berhasil dihapus');
//             res.redirect('/contact');
//         });        
//     }
// });

app.delete('/contact', (req, res) => {
    Contact.deleteOne({ nama: req.body.nama }, () => {
        req.flash('msg', 'Kontak berhasil dihapus');
        res.redirect('/contact');
    });        
});

app.get('/contact/update/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama:req.params.nama });
    res.render(
        'contact-form',        
        { 
            'title': 'Update Kontak',
            layout: 'layouts/main-layout',     
            action: '/contact?_method=PUT',
            contact                 
        } 
    );
});

app.put(
    '/contact', 
    [ 
        check('email', 'Email tidak valid').isEmail(), 
        body('hp').isMobilePhone('id-ID'),
        body('nama').custom(async (value, { req }) => {
            const duplikat = await Contact.findOne( { nama:value } );                  
            if(value !== req.body.old_nama && duplikat) {
                throw new Error('Nama sudah digunakan');
            }
            return true;
        })
    ],
    (req, res) => {        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render(
                'contact-form',        
                { 
                    title: 'Update Kontak',
                    action: '/contact?_method=PUT',
                    layout: 'layouts/main-layout',                        
                    errors: errors.array(),
                    contact: req.body               
                } 
            );
        } else {
            // res.send(req.body)
            Contact.updateOne(
                { 
                    _id: req.body._id
                },
                {
                    $set: {
                        nama: req.body.nama,
                        email: req.body.email,
                        hp: req.body.hp
                    }
                }).then(result => {
                    req.flash('msg', 'Kontak berhasil diubah');
                    res.redirect('/contact');
                });           
        }        
    }
);

app.get('/contact/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama });
    res.render(
        'detail',        
        { 
            'title': 'Detail Contact',
            layout: 'layouts/main-layout', 
            contact           
        } 
    );
});

//end routing

//start server
app.listen(port, () => {
    console.log(`Mongo contact app | listening at http://localhost:${port}`);
});