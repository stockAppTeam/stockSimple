const axios = require('axios');

const Watchlists = {

  saveStockToWatchlist: function (stockInfo) {
    return axios.post('data/watchlist/', stockInfo); 
  }

}

export default Watchlists;