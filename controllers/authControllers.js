const mongoose = require('mongoose');
const passport = require('passport');
const settings = require('../config/settings');
require('../config/passport')(passport);
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require("../models/Users");
const Watchlist = require("../models/Watchlists");
const db = require('../models');

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
      res.json({ success: false, msg: 'You must be 16 or older to use this app!' });
    } else if (!req.body.name || !req.body.password) {
      res.json({ success: false, msg: 'Your email, password, or username is incomplete.' });
    } else if (req.body.password.length < 12) {
      res.json({ success: false, msg: 'Your password must be at least 12 characters long.' });
    } else if (!validateEmail(req.body.email)) {
      res.json({ success: false, msg: 'That is not a valid email address' });
    } else {
      let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        ofAge: req.body.age
      });

      let defaultWatchlists = [
        {
          name: 'Technology',
          stocks: ['AAPL', 'AMZN', 'MSFT', 'MU', 'AMD']
        },
        {
          name: 'Banking & Credit',
          stocks: ['V', 'MA', 'AXP', 'BAC', 'RY']
        },
        {
          name: 'Favourites',
          stocks: ['AAPL', 'AMZN', 'CGC', 'CSIQ', 'SHOP-CA']
        },
      ]
      // save the user
      newUser.save()
        .then(result => {

        //loop over default watchlists, create one for each value and push the id of default watchlist into the new users 'watchlist' property as a reference
          defaultWatchlists.forEach((watchlists) => {
            
          let newWatchlist = new Watchlist({
              name: watchlists.name,
              stocks: watchlists.stocks
            });

            newWatchlist.save()
            .then(newWatchId => {
              db.User.findOneAndUpdate({ _id: result._id  }, { $push: { watchlists: newWatchId._id } }, { new: true }, function(err, res) {
                if(err) {
                  console.log(err)
                }
              });
            })
          })

        })
        .then(result => {
          res.json({ success: true, msg: 'Sign up complete' });
        })
        .catch((err) => {
          res.send({ success: false, msg: 'Server Error' });
        })
    }
  },

  //controller for login. checks for existing email and compares password
  // user info is passed to front end through 'token' after password is compared
  // token passed to front end contains user info that is used to save id to local storage
  login: function (req, res) {
    User.findOne({
      email: req.body.email
    }, function (err, user) {
      if (err) throw err;

      if (!user) {
        res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
      } else {
        // check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            var token = jwt.sign(user.toJSON(), settings.secret);
            // return the information including token as JSON
            res.json({ success: true, token: 'JWT ' + token, id: user._id });
          } else {
            res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' });
          }
        });
      }
    });
  },
  //controller for grabbing all user related data once the user has logged in
  loadData: function (req, res) {
    db.User.find({ _id: req.params.userID })
      .populate("articles")
      .populate("investments")
      .populate("watchlists")
      .exec(function (err, doc) {
        if (err) {
          throw err;
        }
        else {
          // create an object of user info and pass it into the front end with 'send' function
          let userInfo = {};
          userInfo.name = doc[0].name; 
          userInfo.investments = doc[0].investments;
          userInfo.articles = doc[0].articles;
          userInfo.watchlists = doc[0].watchlists;
          res.send(userInfo);
        }
      });

  }
}
