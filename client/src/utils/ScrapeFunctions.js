const axios = require('axios');

const scrape = {

    investopedia: function () {
        return axios.get("/scrape/articles/investopedia")
    }
}
export default scrape;
