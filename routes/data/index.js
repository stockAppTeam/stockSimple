const router = require("express").Router();
const articleData = require("./articles");

// routes for article scraping
router.use("/articledata", articleData);

module.exports = router;