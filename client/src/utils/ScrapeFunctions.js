const axios = require('axios');

const scrape = {

    // scrape investopedia for articles
    investopedia: function () {
        return axios.get("/scrape/articles/investopedia")
    }, 

    //scrape market watch for daily gainers/losers
    marketWatch: function() {
        return axios.get("/scrape/articles/marketWatch")
    }
    
}
export default scrape;
