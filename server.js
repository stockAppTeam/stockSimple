const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
Promise = require('bluebird');
const routes = require("./routes");
const app = express();
const PORT = process.env.PORT || 3001;
require('dotenv').config()


// Require all models

// Configure body parser for AJAX requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve up static assets
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}

app.use(routes);    

// Define API routes and send requests to the react app
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
});

// Connect to the Mongo DB
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/stockSimple";
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/stockSimple");

// Connect to the Mongo DB
mongoose.Promise = Promise;

// Start the API server
app.listen(PORT, function () {
    console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});