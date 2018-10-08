const router = require("express").Router();
const articleData = require("./articles");
const watchlistData = require("./watchlist");
const investmentData = require("./investment");

// routes for changing user data
router.use("/articledata", articleData);
router.use("/watchlist", watchlistData);
router.use("/investment", investmentData);

module.exports = router;