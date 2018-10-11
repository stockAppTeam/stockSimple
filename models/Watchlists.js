// require mongoose library and instatiate schema class
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let WatchlistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    stocks: [String]
});

// Create the Article model with the ArticleSchema
let Watchlists = mongoose.model("Watchlists", WatchlistSchema);

// Export the model
module.exports = Watchlists; 