const mongoose = require('mongoose');
const passport = require('passport');
const settings = require('../config/settings');
require('../config/passport')(passport);
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require("../models/Users");
// const db = require('../models')
require('../models/Investments')

// Defining methods for the articlesController
module.exports = {
  // controller for creating a new user
  create: function (req, res) {
    if (!req.body.name || !req.body.password) {
      res.json({ success: false, msg: 'Please pass username and password.' });
    } else {
      let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
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
  login: function (req, res) {
    User.findOne({
      email: req.body.email
    }, function(err, user) {
      if (err) throw err;
  
      if (!user) {
        res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
      } else {
        // check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            // if user is found and password is right create a token
            var token = jwt.sign(user.toJSON(), settings.secret);
            // return the information including token as JSON
            res.json({success: true, token: 'JWT ' + token});
          } else {
            res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
          }
        });
      }
    });
  }, 
  //controller for grabbing all user related data once the user has logged in
  loadData: function (req, res) {
    User.find({ email : req.params.username }).populate("investments").exec(function (err, doc) {
      if (err) {
          throw err; 
      }
      else {
        res.send(doc[0].investments); 
      }
  });

  }
}
