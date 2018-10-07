const router = require("express").Router();
const axios = require("axios");
const stockControllers = require("../../controllers/stockAPIControllers");


// Matches with "/data/stock"
router
    .route("/")
    .post(stockControllers.addStockToWatchlist)


module.exports = router;