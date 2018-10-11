const mongoose = require('mongoose');
const User = require("../models/Users");
const Article = require("../models/Articles");
const db = require('../models');



// Defining methods for the articlesController
module.exports = {

  //make a new article object and save it, then push the id of the new article into the users 'articles' array
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
          db.User.findOneAndUpdate({ _id: req.body.user }, { $push: { articles: result._id } }, { new: true })
            .then(success => res.send({ success: true, message: 'Article sucessfully saved' }))
            .catch(err => res.status(422).json(err))
        })
        .catch(err => res.send({ success: false, msg: 'You already have that saved' }));
    }
  },

  deleteArticle: function (req, res) {
    //delete and article and respond with success if it worked, otherwise throw an error
    let { userId, articleId } = req.params;
    Article
      .findById({ _id: articleId })
      .then((dbArticle) => {
        dbArticle.remove()
          .then(() => {
            // once an article is delete need to delete the id reference in the database
            db.User.findOneAndUpdate({ _id: userId }, { $pull: { articles: articleId } }, { new: true },
              function (err, res) {
                if (err) throw err;
              }
            );
          })
          .catch(err => res.status(422).json(err)); 
      })
      .then(success => res.send({ success: true, message: 'Sucessfully deleted' }))
      .catch(err => res.status(422).json(err)); 
  }
}
