const router = require("express").Router();
const stockAPIControllers = require("../../controllers/stockAPIControllers");

const router = require("express").Router();
let request = require("request");
let rp = require('request-promise');


// Matches with "/stockapi/"

// This route will return the "latest" daily info for all of the user's stocks
router
    .route("/getalllatest")
    .get((req, res) => {
        console.log("/getalllatest");
    });

// This route will return the historic info for all of the user's stocks
// You can specific a date range as well, using the parameters
router
    .route("/getallhistoric/:startdate/:enddate")
    .get((req, res) => {
        console.log(`/getallhistoric/:startdate(${startdate})/:enddate(${enddate})`);
    });

// This route will return the historic info for one single stock
// You must specify the ticker, using the parameters
router
    .route("/getonehistoric/:ticker")
    .get((req, res) => {
        console.log(`/getonehistoric/:ticker(${ticker})`);
    });



module.exports = router;





