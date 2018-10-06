const router = require("express").Router();
let request = require("request");
let rp = require('request-promise');
const axios = require("axios");
const stockAPIControllers = require("../../controllers/stockAPIControllers");

// Matches with "/stockapi/"

// This route will return the "latest" daily info for all of the user's stocks
router
    .route("/getalllatest")
    .get((req, res) => {
        console.log("/getalllatest");

        // Oct 5: The tickers will eventually need to come from the user information in the database
        // We will need to add the database access to a stockAPI controller
        let tickerString = "AAPL,MSFT,AMZN,GE"; // Convert the array to a comma-separated string
        let API_KEY = "demo";

        axios.get(`https://www.worldtradingdata.com/api/v1/stock?symbol=${tickerString}&api_token=${API_KEY}`)
            .then((data) => {
                res.send(data.data)
            })
            .catch((err) => {
                res.status(404).send({ success: false, msg: 'getalllatest/: Internal Error.' });
            });
    });

// This route will return the historic info for all of the user's stocks
// You can specific a date range as well, using the parameters
router
    .route("/getallhistoric/:startdate/:enddate")
    .get((req, res) => {
        console.log(`/getallhistoric/:startdate(${startdate})/:enddate(${enddate})`);

        // Oct 5: The tickers will eventually need to come from the user information in the database
        // We will need to add the database access to a stockAPI controller        
        let startdate = "";
        let enddate = "";
        let tickersToFind = ['AAPL','MSFT','AMZN','GE']; 
        let tickerString = "AAPL,MSFT,AMZN,GE";          // Convert the array to a comma-separated string
        let API_KEY = "demo";

        if (startDate.length > 0) {
            startDate = `&date_from=${startDate}`;
        } else {
            startDate = "&date_from=2018-09-01"; // No start date, so include the entire history of the stock. Keep it the start of Sept for now. Correct later to be empty string
        }

        if (endDate.length > 0) {
            endDate = `&date_to=${endDate}`;
        } else {
            endDate = ""; // No start date, so include the entire history of the stock
        }

        let arrayToReturn = [];
        let axiosCalls = tickersToFind.map(function (ticker) {

            // To do: add the date range parameters. For now, I've just hard-coded the 
            axios.get(`https://www.worldtradingdata.com/api/v1/history?symbol=${ticker}${startDate}${endDate}&sort=oldest&api_token=${API_KEY}`)
                .then(function (response) {
                    // Each response of historical data for the stock gets added to the return array in a cleaner object, to make it easier on the front end
                    arrayToReturn.push({ ticker: response.data.name, history: response.data.history });
                });
        });

        // Once the history information for all tickers has been obtained, return the array of objects
        return Promise.all(axiosCalls)
            .then(() => {
                res.send(arrayToReturn)
            })
            .catch((err) => {
                res.status(404).send({ success: false, msg: 'getallhistoric/: Internal Error.' });
            });            

    });


// This route will return the historic info for one single stock
// You must specify the ticker, using the parameters
router
    .route("/getonehistoric/:tickerToFind")
    .get((req, res) => {
        console.log(`/getonehistoric/:ticker(${ticker})`);
  
        let startdate = "";
        let enddate = "";
        let tickerToFind = "AAPL";
        let API_KEY = "demo";
  
        if (startDate.length > 0) {
          startDate = `&date_from=${startDate}`;
        } else {
          startDate = "&date_from=2018-09-01"; // No start date, so include the entire history of the stock. Keep it the start of Sept for now. Correct later to be empty string
        }
  
        if (endDate.length > 0) {
          endDate = `&date_to=${endDate}`;
        } else {
          endDate = ""; // No start date, so include the entire history of the stock
        }
  
        let arrayToReturn = [];
  
        // To do: add the date range parameters. For now, I've just hard-coded the 
        axios.get(`https://www.worldtradingdata.com/api/v1/history?symbol=${tickerToFind}${startDate}${endDate}&sort=oldest&api_token=${API_KEY}`)
          .then((data) => {
            // Each response of historical data for the stock gets added to the return array in a cleaner object, to make it easier on the front end
            // In this case, there's only one stock, so only one response - but we'll keep consistent with the other function that gets history for all tickers
            // Actually, both functions should be merged into one, to reduce code duplication.              
            arrayToReturn.push({ ticker: data.data.name, history: data.data.history });
            res.send(arrayToReturn)
        })
        .catch((err) => {
            res.status(404).send({ success: false, msg: 'getonehistoric/: Internal Error.' });
        });

    });


module.exports = router;





