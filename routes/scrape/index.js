const router = require("express").Router();
const scrapeRoutes = require("./scrape");

// Book routes
router.use("/articles", scrapeRoutes);

module.exports = router;