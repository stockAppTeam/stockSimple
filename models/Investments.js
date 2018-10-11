// require mongoose library and instatiate schema class
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// make new investment schema
let InvestmentSchema = new Schema({
    ticker: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    dateInvested: {
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
    }, 
    currentPrice : {
        type: Number,
    }

});

// Create the investment model with the investment Schema
let Investments = mongoose.model("Investments", InvestmentSchema);

module.exports = Investments; 