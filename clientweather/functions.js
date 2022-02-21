//set functions
let functions = {
    convertToTime: (iTime) => {
        let unix_timestamp = iTime;
        let date = new Date(unix_timestamp * 1000);
        // Hours part from the timestamp
        let hours = date.getHours();
        // Minutes part from the timestamp
        let minutes = "0" + date.getMinutes();
        // Seconds part from the timestamp
        let seconds = "0" + date.getSeconds();
        // Will display time in 10:30:23 format
        return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        // console.log(formattedTime);
    }
}

module.exports = functions;
