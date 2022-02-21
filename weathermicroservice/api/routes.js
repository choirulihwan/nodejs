// create a controller object
const controller = require("./controllers");

// declare a function and export it to be used in another file
module.exports = function(weatherApp) {
    weatherApp.route("/").get(controller.home);
    weatherApp.route("/about").get(controller.about);
    weatherApp.route("/weather/:lat/:long").get(controller.getWeather);
    weatherApp.route("/location/:lat/:long").get(controller.getLocation);
};