//docs
//https://nodejs.org/docs/latest-v16.x/api/readline.html
//https://www.npmjs.com
//https://expressjs.com
//ejs template engine


const express = require('express');
const expressLayout = require('express-ejs-layouts');
const app = express()
const port = 3000

// use ejs
app.set('view engine', 'ejs');
app.use(expressLayout);

app.get('/', (req, res) => {
    const anak = [
        {
            'nama': 'Daffa',
            'hp': '081'
        }, 
        {
            'nama': 'Diva',
            'hp': '082'
        },
        {
            'nama': 'Davi',
            'hp': '083'
        }
    ];

    res.render('index', {
        'nama': 'Choirul Ihwan',
        'title': 'Home',
        anak,
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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })