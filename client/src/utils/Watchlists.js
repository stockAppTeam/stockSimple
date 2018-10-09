const axios = require('axios');

const Watchlists = {

  saveStockToWatchlist: function (stockInfo) {
    return axios.post('data/watchlist/', stockInfo); 
  }, 

  addFullWatchlist: function (watchlistData) {
    if (watchlistData) {
      return axios.post('data/watchlist/addfull', watchlistData)
    }
  }

}

export default Watchlists;