//create a variable referencing to the package.json file
let properties = require("../package.json");

//create a variable and require the weather file inside the service folder
let weather = require("../service/weather");
let location = require("../service/location");

// create an object
let controllers = {
    home: (req, res) => {
        res.json('Welcome to weather API');
    }, 

    about: (req, res) => {
        let aboutinfo = {
            name: properties.name,
            description: properties.description,
            author: properties.author
        }

        res.json(aboutinfo);
    }, 

    getWeather: (req, res) => {
        weather.find(req, res, function(err, weath) {
            if (err) res.send(err);
            res.json(weath);
        });
    },

    getLocation: (req, res) => {
        location.find(req, res, function(err, weath) {
            if (err) res.send(err);
            res.json(weath);
        });
    }
};

module.exports = controllers;
