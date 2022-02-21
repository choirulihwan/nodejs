// declare the request package we added to the package.json
let request = require("request");

// assign your api key and api url to a variable

//sewon
const apiKey = "your api key here";
const apiUrl = "http://api.openweathermap.org/geo/1.0/reverse?";

let weather = {
    find: (req, res, next) => {
        let lat = req.params.lat;
		let long = req.params.long;
        request(apiUrl + "lat=" + lat + "&lon=" + long + "&limit=1" + "&appid=" + apiKey, 
            function(error, response, body) {
                if(!error && response.statusCode == 200) {
                    response = JSON.parse(body);
                    res.send(response);
                } else {
                    console.log(response.statusCode + response.body);
                    res.send("Error occured");
                }
        });
    }
};

module.exports = weather;