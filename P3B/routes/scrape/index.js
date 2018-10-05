const router = require("express").Router();
const scrapeRoutes = require("./scrape");

// routes for article scraping
router.use("/articles", scrapeRoutes);

module.exports = router;