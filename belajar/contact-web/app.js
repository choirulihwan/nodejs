//docs
//https://nodejs.org/docs/latest-v16.x/api/readline.html
//https://www.npmjs.com
//https://expressjs.com
//ejs template engine


const express = require('express');
const expressLayout = require('express-ejs-layouts');
const { loadContact, findContact, addContact, deleteContact, updateContact } = require('./utils/contact');
const { body, validationResult, check } = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const app = express()
const port = 3000

// use ejs
app.set('view engine', 'ejs');
app.use(expressLayout);

//built in middleware
app.use(express.static('public'));
app.use(express.urlencoded());

//third party middleware
app.use(cookieParser('secret'));
app.use(session({
    cookie: {maxAge: 6000},
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(flash()); 

//middleware
app.use((req, res, next) => {
    console.log('Time: ', Date.now());
    next();
});

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

app.get('/contact', (req, res) => {
    const contacts = loadContact();
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
        body('nama').custom(nama => {
            const duplikat = findContact(nama);                  
            if(duplikat) {
                throw new Error('Nama sudah digunakan');
            }
            return true;
        })
    ],
    (req, res) => {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // return res.status(400).json({ errors: errors.array() });
            res.render(
                'contact-form',        
                { 
                    title: 'Tambah Kontak',
                    layout: 'layouts/main-layout',    
                    errors: errors.array()                    
                } 
            );
        } else {
            addContact(req.body);
            req.flash('msg', 'Kontak berhasil ditambahkan');
            res.redirect('/contact');
        }        
    }
);

app.get('/contact/delete/:nama', (req, res) => {
    const contact = findContact(req.params.nama);

    if (!contact) {
        res.status(404);
        res.send('<h1>404</h1>')
    } else {
        deleteContact(req.params.nama);
        req.flash('msg', 'Kontak berhasil dihapus');
        res.redirect('/contact');
    }
});

app.get('/contact/update/:nama', (req, res) => {
    const contact = findContact(req.params.nama);
    res.render(
        'contact-form',        
        { 
            'title': 'Update Kontak',
            layout: 'layouts/main-layout',     
            action: '/contact/update',
            contact                 
        } 
    );
});

app.post(
    '/contact/update', 
    [ 
        check('email', 'Email tidak valid').isEmail(), 
        body('hp').isMobilePhone('id-ID'),
        body('nama').custom((nama, { req }) => {
            const duplikat = findContact(nama);                  
            if(nama !== req.body.old_nama && duplikat) {
                throw new Error('Nama sudah digunakan');
            }
            return true;
        })
    ],
    (req, res) => {        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // return res.status(400).json({ errors: errors.array() });
            res.render(
                'contact-form',        
                { 
                    title: 'Update Kontak',
                    action: '/contact/update',
                    layout: 'layouts/main-layout',                        
                    errors: errors.array(),
                    contact: req.body                
                } 
            );
        } else {
            // res.send(req.body)
            updateContact(req.body);
            req.flash('msg', 'Kontak berhasil diubah');
            res.redirect('/contact');
        }        
    }
);


app.get('/contact/:nama', (req, res) => {
    const contact = findContact(req.params.nama);
    res.render(
        'detail',        
        { 
            'title': 'Detail Contact',
            layout: 'layouts/main-layout', 
            contact           
        } 
    );
});


app.use((req, res, next) => {
    res.status(404);
    next();
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});