const mongoose = require("mongoose");
const Watchlist = require("../models/Watchlists");
const db = require("../models");

// Method for controlling watchlist data
module.exports = {
  // add entire watchlist, use the name and user id passed in from route
  addFullWatchlist: function (req, res) {
    let { addWatchlistName, userId } = req.body;

    if (addWatchlistName && userId) {
      let newWatchlist = new Watchlist({
        name: addWatchlistName
      });

      newWatchlist
        .save()
        .then(result => {
          db.User.findOneAndUpdate({ _id: userId }, { $push: { watchlists: result._id } }, { new: true })
            .then(success => res.send({ success: true, message: "Successfully added watchlist" }))
            .catch(err => res.status(422).json(err));
        })
        .catch(err => res.send({ success: false, msg: "You already have that saved" }));
    } else {
      res.send({ success: false, message: "Unable to add watchlist" });
    }
  },

  //delete an entire watchlist using the id
  deleteFullWatchlist: function (req, res) {
    let { watchlistId, userId } = req.params;
    if (watchlistId) {
      Watchlist.findById({ _id: watchlistId })
        .then((dbWatchlist) => {
          dbWatchlist.remove()
          .then(() => {
            // once an investment is delete need to delete the id reference in the database
            db.User.findOneAndUpdate({ _id: userId }, { $pull: { watchlists: watchlistId } }, { new: true },
              function (err, res) {
                if (err) throw err;
              }
            );
          })
          .catch(err => res.status(422).json(err)); 
        })
        .then(success => res.send({ success: true, message: "Successfully deleted" }))
        .catch(err => res.status(422).json(err));
    } else {
      res.send({ success: false, message: "Unable to delete watchlist" });
    }
  },

  // deletea stock from a single watchlist using the name of the ticker and watchlist id
  deleteStockFromWatchlist: function (req, res) {
    let { deleteStockId, deleteStockName} = req.params;
    console.log(req.params)
      if (deleteStockId && deleteStockName) {
        Watchlist.findOneAndUpdate({ _id: deleteStockId }, { $pull: { stocks: deleteStockName } }, { new: true })
          .then((success) => res.send({ success: true, message: "Successfully deleted" }))
          .catch(err => res.status(422).json(err));
      } else {
        res.send({ success: false, message: "Unable to delete stock from watchlist" });
      }
  },

  // add a stock to a watchlist and then push that value into the users stocks array
  addStockToWatchlist: function (req, res) {
    let { addStockToWatchListVal, id } = req.body;

    if (addStockToWatchListVal && id) {
      Watchlist.findOneAndUpdate({ _id: id }, { $push: { stocks: addStockToWatchListVal } }, { new: true })
        .then(success => res.send({ success: true, message: "Successfully added Stock" }))
        .catch(err => res.status(422).json(err));
    } else {
      res.send({ success: false, message: "Could not add stock to watchlist" });
    }
  }
};
