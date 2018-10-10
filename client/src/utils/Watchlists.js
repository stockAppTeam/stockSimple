const axios = require('axios');

// routes for all changes to watchlist data
const Watchlists = {

  // add an entire watchlist
  addFullWatchlist: function (watchlistData) {
    return axios.post('data/watchlist/addfull', watchlistData)
  },

  // delete an entire watchlist
  deleteFullWatchList: function (watchlistId) {
    return axios.delete(`data/watchlist/${watchlistId}`)
  },
  // delete one of the stocks from a single watchlist
  deleteStockFromWatchlist: function (stockInfo) {
    return axios.delete(`data/watchlist/${stockInfo.id}/${stockInfo.stock}`)
  },

  // add a stock to one watchlist
  addStockToWatchList: function (stockWatchlistInfo) {
    return axios.post(`data/watchlist/addStock`, stockWatchlistInfo)
  }

}

export default Watchlists;