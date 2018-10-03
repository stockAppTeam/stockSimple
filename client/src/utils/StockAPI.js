const axios = require('axios');

const StockAPI = {

    /* getLiveWatchListStockInfo:
        We could add a check for the present time of day, and only get live data during trading hours, but probably not necessary.
        We have a 1-month subscription to World Trading Data, which gives us 50,000 reads per day
        of up to 50 stock tickers at a time.
    */
    getLiveWatchListStockInfo: function () {

        return new Promise(function (resolve, reject) {

            // The assumption is that the array of the user's tickers gets passed to this function

            let tickersToFind = ['AAPL', 'AMZN']; // This would be the array of tickers from db User data
            let tickerString = tickersToFind.toString(); // Convert the array to a comma-separated string

            console.log('axios: About to GET from worldtradingdata');
            let API_KEY = "3whtIE7gSVsKL2UEDgl0dBbE3b1jbMcvJOYjSu2fxcHSZwWTw15yGeEMwo27";

            axios.get(`https://www.worldtradingdata.com/api/v1/stock?symbol=${tickerString}&api_token=${API_KEY}`)
                .then((res) => {

                    console.log('axios: worldtradingdata received:');
                    console.log('res.data:', res.data);
                    console.log('res.data.data:', res.data.data); // The stock data from the returned object

                    resolve(res.data); // Pass the data back

                });
        });
    },

    // Historical information for each ticker
    getTickerHistoricalInfo: function () {

        return new Promise(function (resolve, reject) {

            /* The assumption is that a single ticker gets passed to this function
            "The history endpoint allows a maximum of 1 ticker per request"
            We also need to pass in a date range - https://www.worldtradingdata.com/documentation#full-history
            Format:
            date_from=2018-09-01
            date_to=2018-10-01
            If the date_to parameter is not included, then it uses today's date
            */

            let tickerToFind = 'AAPL';

            console.log('axios: About to GET historical info from worldtradingdata');
            let API_KEY = "demo";

            axios.get(`https://www.worldtradingdata.com/api/v1/history?symbol=${tickerToFind}&date_from=2018-09-01&sort=newest&api_token=${API_KEY}`)
                .then((res) => {

                    console.log('axios: historical worldtradingdata received:');
                    console.log('res.data:', res.data);
                    console.log('res.data.history:', res.data.history); // The stock data from the returned object

                    resolve(res.data); // Pass the data back

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
            let API_KEY = "demo";

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
            let API_KEY = "demo";

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

export default StockAPI;