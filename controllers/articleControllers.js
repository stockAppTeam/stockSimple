const mongoose = require('mongoose');
const User = require("../models/Users");
const Article = require("../models/Articles");
const db = require('../models');



// Defining methods for the articlesController
module.exports = {

  saveArticle: function (req, res) {
    if (req.body.user) {
      let newArticle = new Article({
        title: req.body.title,
        link: req.body.link,
        desc: req.body.desc,
        imgLink: req.body.imgLink,
        date: req.body.date
      });

      newArticle.save()
        .then(result => {
          db.User.findOneAndUpdate({ _id: req.body.user }, { $push: { articles: result._id } }, { new: true }, function (err, res) {
            if (err) {
              console.log(err)
            }
          })

        })
    }
  },

  deleteArticle: function (req, res) {

  }
}
