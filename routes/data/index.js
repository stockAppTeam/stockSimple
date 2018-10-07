const router = require("express").Router();
const articleData = require("./articles");
const watchlistData = require("./watchlist");

// routes for deleting and saving articles
router.use("/articledata", articleData);
router.use("/watchlist", watchlistData);

module.exports = router;