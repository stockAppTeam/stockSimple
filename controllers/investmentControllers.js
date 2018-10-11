const mongoose = require("mongoose");
const db = require("../models");
const Investment = require("../models/Investments");
const axios = require("axios");

// Defining methods for the articlesController
module.exports = {
  // create an investment and then add to user with id coming in from request
  addStock: function (req, res) {
    let { addStockName, addStockPrice, addStockShares, addStockTicker, userID, date } = req.body;

    if (addStockName && addStockPrice && addStockShares && addStockTicker && userID && date) {
      let newInvestment = new Investment({
        ticker: addStockTicker.toUpperCase(),
        name: addStockName,
        dateInvested: date,
        sharesPurchased: addStockShares,
        pricePurchased: addStockPrice
      });

      newInvestment
        .save()
        .then(newInvestmentId => {
          db.User.findOneAndUpdate({ _id: userID }, { $push: { investments: newInvestmentId._id } }, { new: true },
            function (err, res) {
              if (err) throw err;
            }
          );
        })
        .then(() => {
          res.json({ success: true, msg: "Stock added" });
        })
        .catch(err => {
          if (err.code === 11000) {
            res
              .status(409)
              .send({ success: false, msg: "You already have that saved" });
          } else {
            res.status(404).send({ success: false, msg: "Internal Error" });
          }
        });
    } else {
      res.status(404).send({ success: false, msg: "Incomplete Request" });
    }
  },

  // find the id of a stock and then delete it
  deleteStock: function (req, res) {
    let { deleteId, userId } = req.params;
    console.log(req.params)
    if (deleteId) {
      Investment.findById({ _id: deleteId })
        .then((dbStock) => {
          dbStock.remove()
            .then(() => {
              // once an article is delete need to delete the id reference in the database
              db.User.findOneAndUpdate({ _id: userId }, { $pull: { investments: deleteId } }, { new: true },
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
      res.send({ success: false, msg: "Could not delete stock" });
    }
  }
};
