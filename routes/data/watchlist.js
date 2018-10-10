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
    .route("/:deleteId")
    .delete(watchlistControllers.deleteFullWatchlist);


router
    .route("/:deleteStockId/:deleteStockName")
    .delete(watchlistControllers.deleteStockFromWatchlist);

module.exports = router;