const mongoose = require('mongoose');
const db = require('../models');
const axios = require("axios");


// Defining methods for the stockAPIController
module.exports = {

  /* getLatestStockInfoAllTickers:
      We could add a check for the present time of day, and only get live data during trading hours, but probably not necessary.
      We have a 1-month subscription to World Trading Data, which gives us 50,000 reads per day
      of up to 50 stock tickers at a time. If we were to go over that, we'd have to modify this function for multiple reads.
  */
  getLatestStockInfoAllTickers: function (tickersToFind) {

    // returning a promise so that we can use .then
    return new Promise(function (resolve, reject) {

      let tickerString = tickersToFind.toString(); // Convert the array to a comma-separated string

      console.log('axios: About to GET from worldtradingdata');
      let API_KEY = process.env.WORLDTRADINGDATA_API_KEY || "demo";

      axios.get(`https://www.worldtradingdata.com/api/v1/stock?symbol=${tickerString}&api_token=${API_KEY}`)
        .then((res) => { 
          resolve(res.data); // Pass the data back
        });
    });
  },

  /* Historical information for each ticker
      The World Trading Data history endpoint allows a maximum of 1 ticker per request, so we need to use Promise.all
      to wait until the requests are completed for each ticker in the array.
      
      We also need to pass in a date range - https://www.worldtradingdata.com/documentation#full-history
      Format:
      date_from=2018-09-01
      date_to=2018-10-01
      If the date_to parameter is not included, then it uses today's date
  */
  getHistoricalInfoAllTickers: function (tickersToFind, startDate, endDate) {

    try {

      console.log(`About to find historical info in getHistoricalInfoAllTickers for ${tickersToFind.length} tickers: ${tickersToFind}`);

      let API_KEY = process.env.WORLDTRADINGDATA_API_KEY || "demo";

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

      // Now we will create an axios call for each ticker, then use Promise.all to wait until they are all complete before returning the data
      let arrayToReturn = [];
      let axiosCalls = tickersToFind.map(function (ticker) {

        return axios.get(`https://www.worldtradingdata.com/api/v1/history?symbol=${ticker}${startDate}${endDate}&sort=oldest&api_token=${API_KEY}`)
          .then(function (response) {
            // Each response of historical data for the stock gets added to the return array in a cleaner object, to make it easier on the front end
            arrayToReturn.push({ ticker: response.data.name, history: response.data.history });
          });
      });

      // Once the history information for all tickers has been obtained, return the array of objects
      return Promise.all(axiosCalls)
        .then(function () {
          return arrayToReturn;
        });

    }
    catch (error) {
      console.error("Error in getHistoricalInfoAllTickers: ", error);
    }

  },

  // This will return the historical information for one ticker only
  getHistoricalInfoOneTicker: function (tickerToFind, startDate, endDate) {

    console.log("getHistoricalInfoOneTicker");

    // returning a promise so that we can use .then
    return new Promise(function (resolve, reject) {
      console.log(`About to find historical info in getHistoricalInfoOneTicker for ticker: ${tickerToFind}`);

      let API_KEY = process.env.WORLDTRADINGDATA_API_KEY || "demo";

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
        .then(function (response) {
          // Each response of historical data for the stock gets added to the return array in a cleaner object, to make it easier on the front end
          // In this case, there's only one stock, so only one response - but we'll keep consistent with the other function that gets history for all tickers
          // Actually, both functions should be merged into one, to reduce code duplication.
          arrayToReturn.push({ ticker: response.data.name, history: response.data.history });
        })
        .then(function () {
          resolve(arrayToReturn);
        });
    });
  },

  /* getSectorPerformance:
  A different API is used for this, as it is free and has nice sector-related information
      Rank A: Real-Time Performance 
      Rank B: 1 Day Performance
      Rank C: 5 Day Performance
      Rank D: 1 Month Performance
      Rank E: 3 Month Performanc
      Rank F: Year-to-Date (YTD) Performance
      Rank G: 1 Year Performance
      Rank H: 3 Year Performance
      Rank I: 5 Year Performance
      Rank J: 10 Year Performance
  
   If we have gone over the alloted # of API calls, it will return an object with:
   Information: "Thank you for using Alpha Vantage! Please visit https://www.alphavantage.co/premium/ if you would like to have a higher API call volume."
  */
  getSectorPerformance: function () {

    return new Promise(function (resolve, reject) {

      console.log('axios: About to GET from AlphaVantage');
      let API_KEY = process.env.ALPHAVANTAGE_API_KEY || "demo";

      axios.get(`https://www.alphavantage.co/query?function=SECTOR&apikey=${API_KEY}`)
        .then((res) => {

          console.log("axios: AlphaVantage SectorPerformance data received:", res.data);

          resolve(res.data); // Pass the data back
        });
    });
  },

  // Another alternate free stock API
  // https://www.barchart.com/ondemand/free-market-data-api
  getWatchListStockInfoFromBarchart: function () {

    return new Promise(function (resolve, reject) {

      let tickersToFind = ['AAPL', 'AMZN', 'MSFT']; // This would be the array of tickers from db User data
      let tickerString = tickersToFind.toString();  // Convert the array to a comma-separated string

      console.log('axios: About to GET from Barchart');
      let API_KEY = process.env.BARCHART_API_KEY || "demo";

      axios.get(`https://marketdata.websol.barchart.com/getQuote.json?apikey=${API_KEY}&symbols=${tickerString}&fields=fiftyTwoWkHigh%2CfiftyTwoWkHighDate%2CfiftyTwoWkLow%2CfiftyTwoWkLowDate`)
        .then((res) => {

          console.log('axios: Barchart data received:');
          console.log('res.data:', res.data);
          console.log('res.data.results:', res.data.results); // The stock data from the returned object

          resolve(res.data); // Pass the data back

        });
    });
  }
}