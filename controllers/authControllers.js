const mongoose = require('mongoose');
const passport = require('passport');
const settings = require('../config/settings');
require('../config/passport')(passport);
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require("../models/Users");
const db = require('../models');

//helper function to check for valid email
function validateEmail(email) {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Defining methods for the articlesController
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
      // save the user
      newUser.save(function (err) {
        if (err) {
          console.log(err)
          return res.json({ success: false, msg: 'Username already exists.' });
        }
        res.json({ success: true, msg: 'Successful created new user.' });
      });
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
          userInfo.investments = doc[0].investments;
          userInfo.articles = doc[0].articles;
          userInfo.watchlists = doc[0].watchlists;
          res.send(userInfo);
        }
      });

  }
}
