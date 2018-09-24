// require mongoose library and instatiate schema class
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// make new article schema
let InvestmentSchema = new Schema({
    name: {
        type: String,
        unique: true,
        dropDups: true,
        required: true
    },
    dateInvested: {
        type: String,
        required: true
    },
    sector: {
        type: String,
        required: true
    },
    sharesPurchased: {
        type: Number,
        required: true
    },
    pricePurchased: {
        type: Number,
        required: true
    }

});

// Create the Article model with the ArticleSchema
let Investments = mongoose.model("Investments", InvestmentSchema);

// Export the model
module.exports = Investments; 