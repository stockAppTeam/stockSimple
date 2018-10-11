const router = require("express").Router();
const axios = require("axios");
const watchlistControllers = require("../../controllers/watchlistControllers");


// Matches with "/data/watchlist"

//route to add an entire watchlist
router
    .route("/addfull")
    .post(watchlistControllers.addFullWatchlist);

// add one stock to watchlist
router
    .route("/addStock")
    .post(watchlistControllers.addStockToWatchlist);

// delete an entire watchlist
router
    .route("/:watchlistId/:userId")
    .delete(watchlistControllers.deleteFullWatchlist);

//delete oe stock from a watchlist
router
    .route("/:deleteStockId/:deleteStockName")
    .put(watchlistControllers.deleteStockFromWatchlist);

module.exports = router;