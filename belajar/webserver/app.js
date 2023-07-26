//docs
//https://nodejs.org/docs/latest-v16.x/api/readline.html
//https://www.npmjs.com

const fs = require('fs');
const http = require('http');

const port = 3000;

const renderHtml = (path, res) => {
    fs.readFile(path, (err, data) => {
        if(err) {
            res.writeHead(404);
            res.write('Error: file not found');
        } else {
            res.write(data);
        }

        res.end();
    });
};


const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });

    // routing
    const url = req.url;
    if (url === '/about') {
        renderHtml('./templates/about.html', res);
    } else {
        renderHtml('./templates/index.html', res);        
    }
    // end routing
   
});

server.listen(port, () => {
    console.log(`Server listening on ${port}...`);
});