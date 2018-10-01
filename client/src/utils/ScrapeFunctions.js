const axios = require('axios');

const scrape = {

    investopedia: function () {
        return axios.get("/scrape/articles/investopedia")
    }, 

    marketWatch: function() {
        return axios.get("/scrape/articles/marketWatch")
    }
    
}
export default scrape;
