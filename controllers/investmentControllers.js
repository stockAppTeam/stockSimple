const mongoose = require('mongoose');
const db = require('../models');
const Investment = require('../models/Investments');
const axios = require('axios');

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
      })

      newInvestment.save()
        .then((newInvestmentId) => {
          db.User.findOneAndUpdate({ _id: userID }, { $push: { investments: newInvestmentId._id } }, { new: true }, function (err, res) {
            if (err) {
              throw err
            }
          });
        })
        .then (() => {
          db.User.find({ _id: userID })  
          .populate("investments")
          .then((data) => {
            res.json({ success: true, msg: 'Stock added', investments: data[0].investments });
          })
          .catch((err) => {
            res.status(404).send({ success: false, msg: 'Internal Error' });
          })
        })
        .catch((err) => {
          if (err.code === 11000) {
            res.status(409).send({ success: false, msg: 'You already have that saved' });
          } else {
            res.status(404).send({ success: false, msg: 'Internal Error' });
          }
        });

    } else {
      res.status(404).send({ success: false, msg: 'Incomplete Request' });
    }

  }
}