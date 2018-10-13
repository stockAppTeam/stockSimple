const db = require("../models");
const User = require("../models/Users");
const Watchlist = require("../models/Watchlists");
const mongoose = require('mongoose'); 

// connect to the database
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/stockSimple");

// helper method to disconnect from the database after a user has been created
function exit() {
    mongoose.disconnect(); 
}


// create a test user
    let user = new User ({
        name: 'Test',
        email: 'test@email.com', 
        password: 'testpassword', 
        ofAge: true
    }); 

// define some defautl watchlists so their not empty when  new user is created
    let defaultWatchlists = [
        {
            name: "Technology",
            stocks: ["AAPL", "AMZN", "MSFT", "MU", "AMD"]
        },
        {
            name: "Favourites",
            stocks: ["AAPL", "AMZN", "CGC", "CSIQ", "SHOP-CA"]
        }
    ];

// use built in mongoose save method to create a user
  user
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
        console.log('Sucessfully saved user')
        exit(); 
    })
    .catch(err => {
      // 11000 is the error code for no duplicates in MongoDB
     if (err) {
         console.log('Error happening', err)
        exit(); 
     }
    });


