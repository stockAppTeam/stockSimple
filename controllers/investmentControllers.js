const mongoose = require('mongoose');
const db = require('../models');

// Defining methods for the articlesController
module.exports = {

    // create an investment and then add to user with id coming in from request
  addStock: function (req, res) {
    console.log(req.body)
  }
}