const axios = require('axios');

// routes for all changes to watchlist data
const Watchlists = {

  // add an entire watchlist
  addFullWatchlist: function (watchlistData) {
    return axios.post('data/watchlist/addfull', watchlistData)
  },

  // delete an entire watchlist
  deleteFullWatchList: function (watchlistId, userId) {
    return axios.delete(`data/watchlist/${watchlistId}/${userId}`)
  },
  // delete one of the stocks from a single watchlist
  deleteStockFromWatchlist: function (stockInfo) {
    let stockName = stockInfo.stockName
    return axios.put(`data/watchlist/${stockInfo.id}/${stockName}`)
  },

  // add a stock to one watchlist
  addStockToWatchList: function (stockWatchlistInfo) {
    return axios.post(`data/watchlist/addStock`, stockWatchlistInfo)
  }

}

export default Watchlists;