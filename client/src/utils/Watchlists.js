const axios = require('axios');

const Watchlists = {

  addFullWatchlist: function (watchlistData) {
    if (watchlistData) {
      return axios.post('data/watchlist/addfull', watchlistData)
    }
  }, 

  deleteFullWatchList: function (watchlistId) {
    return axios.delete(`data/watchlist/${watchlistId}`)
  }, 

  deleteStockFromWatchlist: function (stockInfo) {
    return axios.delete(`data/watchlist/${stockInfo.id}/${stockInfo.stock}`)
  }, 

  addStockToWatchList: function (stockWatchlistInfo) {
    console.log(stockWatchlistInfo)
    return axios.post(`data/watchlist/addStock`, stockWatchlistInfo)
  }

}

export default Watchlists;