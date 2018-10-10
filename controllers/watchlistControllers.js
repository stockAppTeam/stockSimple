const mongoose = require('mongoose');
const Watchlist = require("../models/Watchlists");
const db = require("../models")


// Method for controlling watchlist data
module.exports = {


  addFullWatchlist: function (req, res) {
    let { addWatchlistName, userId } = req.body;
    if (addWatchlistName && userId) {
      let newWatchlist = new Watchlist({
        name: addWatchlistName
      });

      newWatchlist.save()
        .then(result => {
          db.User.findOneAndUpdate({ _id: userId }, { $push: { watchlists: result._id } }, { new: true })
            .then(success => res.send({ success: true, message: 'Sucessfully added watchlist' }))
            .catch(err => res.status(422).json(err))
        })
        .catch(err => res.send({ success: false, msg: 'You already have that saved' }));
    }
  },

  deleteFullWatchlist: function (req, res) {
    Watchlist
      .findById({ _id: req.params.deleteId })
      .then(dbWatchlist => dbWatchlist.remove())
      .then(success => res.send({ success: true, message: 'Sucessfully deleted' }))
      .catch(err => res.status(422).json(err))
  },

  deleteStockFromWatchlist: function (req, res) {
    console.log(req.params)
    Watchlist.findOneAndUpdate({ _id: req.params.deleteStockId }, { $pull: { stocks: req.params.deleteStockName } }, { new: true })
      .then(success => res.send({ success: true, message: 'Sucessfully deleted' }))
      .catch(err => res.status(422).json(err))
  },

  addStockToWatchlist: function (req, res) {
    console.log(req.body)
    let {addStockToWatchListVal, id} = req.body; 
    Watchlist.findOneAndUpdate({ _id: id}, { $push: { stocks: addStockToWatchListVal } }, { new: true })
      .then(success => res.send({ success: true, message: 'Sucessfully added Stock' }))
      .catch(err => res.status(422).json(err))
  }


}