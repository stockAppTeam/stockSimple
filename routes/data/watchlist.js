const router = require("express").Router();
const axios = require("axios");
const watchlistControllers = require("../../controllers/watchlistControllers");


// Matches with "/data/watchlist"

router
    .route("/addfull")
    .post(watchlistControllers.addFullWatchlist)

router
    .route("/addStock")
    .post(watchlistControllers.addStockToWatchlist)

router
    .route("/:deleteId")
    .delete(watchlistControllers.deleteFullWatchlist)
;
router
    .route("/:deleteStockId/:deleteStockName")
    .delete(watchlistControllers.deleteStockFromWatchlist)

module.exports = router;