// require mongoose library and instatiate schema class
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// make new investment schema
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

// Create the investment model with the investment Schema
let Investments = mongoose.model("Investments", InvestmentSchema);

module.exports = Investments; 