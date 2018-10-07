const mongoose = require('mongoose');
const Watchlist = require("../models/Watchlists");


// Method for controlling watchlist data
module.exports = {

  // adds a stock to the watchlist
  addStockToWatchlist: function (req, res) {
      Watchlist.findOneAndUpdate({ _id: req.body.watchListId  }, { $push: { stocks: req.body.symbol} },  { new: true })      
      .then(success => res.send({success: true, message: `Successfully added ${req.body.symbol} to ${req.body.name}`}))
      .catch(err => res.status(422).json(err))
  }


}