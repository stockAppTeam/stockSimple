const router = require("express").Router();
const articleData = require("./articles");
const stockData = require("./stock");

// routes for deleting and saving articles
router.use("/articledata", articleData);
router.use("/stock", stockData);

module.exports = router;