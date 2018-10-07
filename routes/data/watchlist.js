const router = require("express").Router();
const axios = require("axios");
const watchlistControllers = require("../../controllers/watchlistControllers");


// Matches with "/data/stock"
router
    .route("/")
    .post(watchlistControllers.addStockToWatchlist)


module.exports = router;