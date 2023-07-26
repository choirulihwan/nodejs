//docs
//https://nodejs.org/docs/latest-v16.x/api/readline.html
//https://www.npmjs.com
//https://expressjs.com

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    //   res.json({ user: 'tobi' });
    res.sendFile('./templates/index.html', { root: __dirname });
});

app.get('/about', (req, res) => {
    // res.send('Halaman About');
    res.sendFile('./templates/about.html', { root: __dirname });
});

app.get('/product/:id/:catId', (req, res) => {
    res.send(`Product Id: ${req.params.id} Under category id: ${req.params.catId}`);
    
});

//middleware
app.use('/', (req, res) => {
    res.status(404);
    res.send('<h1>404</h1>');
});
//end middleware

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})