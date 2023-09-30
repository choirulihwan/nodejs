const express = require('express');
var bodyParser = require('body-parser');
const app = express();
// const querystring = require('querystring');
// var http = require('http');
require('dotenv').config();
let request = require("request");
let functions = require("./functions");
const { Template } = require('ejs');

var urlEncodeParser = bodyParser.urlencoded({ extended: false });
var location = "";

//set templating
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    //tanpa templating
    // res.sendFile(__dirname + '/index.html');

    //dengan template engine ejs
    res.render('index', {
        subject: 'Node JS Client Weather',        
        lat: '',
        long: '',
    });
});

app.post('/', urlEncodeParser, (req, res) => {    
    // res.sendStatus(200);
    let url_loc = process.env.URLSERVICE + 'location/'  + req.body.latitude + "/" + req.body.longitude;    
    request(url_loc,function(error, response, body) {
        if(!error && response.statusCode == 200) {
            response = JSON.parse(body);            
            // simpan ke variabel global
            location = response[0].name + ", " + response[0].state;
            // console.log(response[0].name);         
        }
    });

    let url = process.env.URLSERVICE + 'weather/' + req.body.latitude + "/" + req.body.longitude;
    request(url,function(error, response, body) {
        if(!error && response.statusCode == 200) {
            response = JSON.parse(body);
            
            // kirim ke stdoutput
            // res.send(response);

            // render ke Template 
            //set jam terbit
            terbit = functions.convertToTime(response.current.sunrise);
            terbenam = functions.convertToTime(response.current.sunset);
            jam = functions.convertToTime(response.current.dt);

            res.render('index', {
                subject: 'Node JS Client Weather',
                response: response,
                lat: req.body.latitude,
                long: req.body.longitude,
                location: location,
                terbit: terbit,
                terbenam: terbenam,
                jam:jam,
            });
        } else {
            console.log(response.statusCode + response.body);
            res.send("Error occured");
        }
    });
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("server listening on: " + port)
});
