const router = require("express").Router();
const axios = require("axios");
const watchlistControllers = require("../../controllers/watchlistControllers");


// Matches with "/data/watchlist"
router
    .route("/")
    .post(watchlistControllers.addStockToWatchlist)


module.exports = router;