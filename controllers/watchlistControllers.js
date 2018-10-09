const mongoose = require('mongoose');
const Watchlist = require("../models/Watchlists");
const db = require("../models")


// Method for controlling watchlist data
module.exports = {

  // adds a stock to the watchlist
  addStockToWatchlist: function (req, res) {
      Watchlist.findOneAndUpdate({ _id: req.body.watchListId  }, { $push: { stocks: req.body.symbol} },  { new: true })      
      .then(success => res.send({success: true, message: `Successfully added ${req.body.symbol} to ${req.body.name}`}))
      .catch(err => res.status(422).json(err))
  }, 

  addFullWatchlist: function (req, res) {
    let {addWatchlistName, userId}  = req.body; 
    if (addWatchlistName && userId) {
      let newWatchlist = new Watchlist({
        name: addWatchlistName
      });

      newWatchlist.save()
        .then(result => {
          db.User.findOneAndUpdate({ _id: userId }, { $push: { watchlists: result._id } }, { new: true })      
          .then(success => res.send({success: true, message: 'Sucessfully added watchlist'}))
          .catch(err => res.status(422).json(err))
        })
        .catch(err => res.send({ success: false, msg: 'You already have that saved' })); 
    }
  }


}