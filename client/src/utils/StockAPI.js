const axios = require('axios');

const StockAPI = {

  /* getLatestStockInfoAllTickers:
      We could add a check for the present time of day, and only get live data during trading hours, but probably not necessary.
      We have a 1-month subscription to World Trading Data, which gives us 50,000 reads per day
      of up to 50 stock tickers at a time. If we were to go over that, we'd have to modify this function for multiple reads.
  */
  getLatestStockInfoAllTickers: function () {
    return axios.get("/stockapi/stockapi/getalllatest");
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
  getHistoricalInfoAllTickers: function () {
    console.log("getHistoricalInfoAllTickers");
    return axios.get("/stockapi/stockapi/getallhistoric/2018-09-01/2018-10-01");
  },

  // This will return the historical information for one ticker only
  getHistoricalInfoOneTicker: function () {
    return axios.get("/stockapi/stockapi/getonehistoric/AAPL");
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
  // getSectorPerformance: function () {

  //   return new Promise(function (resolve, reject) {

  //     console.log('axios: getSectorPerformance');
  //     let API_KEY = "demo";

  //     axios.get(`https://www.alphavantage.co/query?function=SECTOR&apikey=${API_KEY}`)
  //       .then((res) => {

  //         console.log("axios: AlphaVantage SectorPerformance data received:", res.data);

  //         resolve(res.data); // Pass the data back
  //       });
  //   });
  // },

  // Another alternate free stock API
  // https://www.barchart.com/ondemand/free-market-data-api
  // getWatchListStockInfoFromBarchart: function () {

  //   return new Promise(function (resolve, reject) {

  //     let tickersToFind = ['AAPL', 'AMZN', 'MSFT']; // This would be the array of tickers from db User data
  //     let tickerString = tickersToFind.toString();  // Convert the array to a comma-separated string

  //     console.log('axios: getWatchListStockInfoFromBarchart');
  //     let API_KEY = "demo";

  //     axios.get(`https://marketdata.websol.barchart.com/getQuote.json?apikey=${API_KEY}&symbols=${tickerString}&fields=fiftyTwoWkHigh%2CfiftyTwoWkHighDate%2CfiftyTwoWkLow%2CfiftyTwoWkLowDate`)
  //       .then((res) => {

  //         console.log('axios: Barchart data received:');
  //         console.log('res.data:', res.data);
  //         console.log('res.data.results:', res.data.results); // The stock data from the returned object

  //         resolve(res.data); // Pass the data back

  //       });
  //   });
  // },

  userStockSearch: function (queryInfo) {
    if (queryInfo.stockSearchName || queryInfo.stockSearchTicker) {
      //make a variable that is going to be set to either a ticker or name based on the query type
      let searchName;

      // ternary to set the search name to either name or ticker based on the parameter sent from front end
      queryInfo.stockSearchName ? searchName = queryInfo.stockSearchName : searchName = queryInfo.stockSearchTicker;

      // hit the route that corresponds to the query type. either api/search/name or api/search/ticker
      return axios.get(`api/search/${queryInfo.queryType}/${searchName}`); 
    }
  }

}

export default StockAPI;