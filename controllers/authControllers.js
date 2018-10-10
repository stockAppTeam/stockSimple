const mongoose = require("mongoose");
const passport = require("passport");
const settings = require("../config/settings");
require("../config/passport")(passport);
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/Users");
const Watchlist = require("../models/Watchlists");
const Investment = require("../models/Investments");
const Article = require("../models/Articles");
const db = require("../models");
const axios = require("axios");

//helper function to check for valid email
function validateEmail(email) {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Defining methods for the authorizeController
module.exports = {
  // controller for creating a new user
  create: function (req, res) {
    if (!req.body.age) {
      res.json({ success: false, msg: "You must be 16 or older to use this app!" });
    } else if (!req.body.name || !req.body.password) {
      res.json({ success: false, msg: "Your email, password, or username is incomplete." });
    } else if (req.body.password.length < 12) {
      res.json({ success: false, msg: "Your password must be at least 12 characters long." });
    } else if (!validateEmail(req.body.email)) {
      res.json({ success: false, msg: "That is not a valid email address" });
    } else {
      let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        ofAge: req.body.age
      });

      let defaultWatchlists = [
        {
          name: "Technology",
          stocks: ["AAPL", "AMZN", "MSFT", "MU", "AMD"]
        },
        {
          name: "Banking & Credit",
          stocks: ["V", "MA", "AXP", "BAC", "RY"]
        },
        {
          name: "Favourites",
          stocks: ["AAPL", "AMZN", "CGC", "CSIQ", "SHOP-CA"]
        }
      ];
      // save the user
      newUser
        .save()
        .then(result => {
          //loop over default watchlists, create one for each value and push the id of default watchlist into the new users 'watchlist' property as a reference
          defaultWatchlists.forEach(watchlists => {
            let newWatchlist = new Watchlist({
              name: watchlists.name,
              stocks: watchlists.stocks
            });

            newWatchlist.save().then(newWatchId => {
              db.User.findOneAndUpdate({ _id: result._id }, { $push: { watchlists: newWatchId._id } }, { new: true },
                function (err, res) {
                  if (err) throw err;
                }
              );
            });
          });
        })
        .then(result => {
          res.json({ success: true, msg: "Sign up complete" });
        })
        .catch(err => {
          // 11000 is the error code for no duplicates in MongoDB
          if (err.code === 11000) {
            res.send({ success: false, msg: "That email is already in use" });
          } else {
            res.send({ success: false, msg: "Internal error when trying to create new user" });
          }
        });
    }
  },

  //controller for login. checks for existing email and compares password
  // user info is passed to front end through 'token' after password is compared
  // token passed to front end contains user info that is used to save id to local storage
  login: function (req, res) {
    User.findOne({ email: req.body.email },
      function (err, user) {
        if (err) throw err;
        if (!user) {
          res.status(401).send({ success: false, msg: "Authentication failed. User not found." });
        } else {
          // check if password matches
          user.comparePassword(req.body.password, function (err, isMatch) {
            if (isMatch && !err) {
              // if user is found and password is right create a token
              let token = jwt.sign(user.toJSON(), settings.secret);
              // return the information including token as JSON
              res.json({ success: true, token: "JWT " + token, id: user._id });
            } else {
              res.status(401).send({ success: false, msg: "Authentication failed. Wrong password." });
            }
          });
        }
      }
    );
  },
  //controller for grabbing all user related data once the user has logged in
  loadData: function (req, res) {
    let API_KEY = process.env.WORLDTRADINGDATA_API_KEY;

    // read from database and get all user info
    db.User.find({ _id: req.params.userID })
      .populate("articles")
      .populate("investments")
      .populate("watchlists")
      .then(data => {
        // watchlist info
        let tickerString = [];
        // if the user has any investments, populate and array with their ticker value
        // return the array joined to a string and the user id
        if (data[0].investments.length) {
          data[0].investments.forEach(investment => {
            tickerString.push(investment.ticker);
          });
          return { tickerString: tickerString.join(), userInfo: data };
        } else {
          return { userInfo: data };
        }
      })
      .then(tickerString => {
        // if the user has investments, use the returned string to generate a query
        if (tickerString.tickerString) {
          axios.get(`https://www.worldtradingdata.com/api/v1/stock?symbol=${tickerString.tickerString}&api_token=${API_KEY}`)
            .then(stock => {
              let currentPriceArray = [];
              // make an array of objects with the ticker value and price  of ech returned stock
              stock.data.data.forEach(stock => {
                currentPriceArray.push({
                  currentPrice: stock.price,
                  ticker: stock.symbol
                });
              });

              // add the current price to the investment object passed back to the user
              for (let i = 0; i < currentPriceArray.length; i++) {
                for (let j = 0; j < tickerString.userInfo[0].investments.length; j++) {
                  if (currentPriceArray[i].ticker === tickerString.userInfo[0].investments[j].ticker) {
                    tickerString.userInfo[0].investments[j].currentPrice =
                      currentPriceArray[i].currentPrice;
                  }
                }
              }

              let userInfo = {};
              userInfo.name = tickerString.userInfo[0].name;
              userInfo.investments = tickerString.userInfo[0].investments;
              userInfo.articles = tickerString.userInfo[0].articles;
              userInfo.watchlists = tickerString.userInfo[0].watchlists;
              res.send(userInfo);
            })
            .catch(err => {
              res.send({ success: false, msg: " Authentication Internal Error." });
            });

          // if no investments, than return the user info as is from the db
        } else {
          let userInfo = {};
          userInfo.name = tickerString.userInfo[0].name;
          userInfo.investments = tickerString.userInfo[0].investments;
          userInfo.articles = tickerString.userInfo[0].articles;
          userInfo.watchlists = tickerString.userInfo[0].watchlists;
          res.send(userInfo);
        }
      })
      .catch(err => {
        res.send({ success: false, msg: "Server Error" });
      });
  },

  deleteProfile: function (req, res) {
    let { userId } = req.params;
    db.User.find({ _id: userId })
      .populate("articles")
      .populate("investments")
      .populate("watchlists")
      .then(data => {
        // when this returns, delete all the users data
        if (data[0].watchlists.length) {
          data[0].watchlists.forEach((watchlist) => {
            Watchlist.findByIdAndRemove(watchlist._id, (err, watchlist) => {
              if (err) throw (err)
            });
          })
        }

        if (data[0].investments.length) {
          data[0].investments.forEach((investments) => {
            Investment.findByIdAndRemove(investments._id, (err, investment) => {
              if (err) throw (err)
            });
          })
        }

        if (data[0].articles.length) {
          data[0].articles.forEach((articles) => {
            Article.findByIdAndRemove(articles._id, (err, article) => {
              if (err) throw (err)
            });
          })
        }
      })
      .then(() => {
        db.User.findByIdAndRemove(userId, (err, user) => {
          if (err) throw (err)
        });
      })
      .then((data) => {
        res.send({ success: true, msg: "User successully deleted" });
      })
      .catch(err => {
        res.send({ success: false, msg: "Could not delete" });
      });
  }
};
