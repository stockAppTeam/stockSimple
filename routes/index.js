const path = require("path");
const router = require("express").Router();
const authRoutes = require("./auth");
const scrapeRoutes = require("./scrape");
const dataRoutes = require("./data");
const apiRoutes = require("./api");
const stockAPIRoutes = require("./stockAPI");

// use for authorizing the user
router.use("/auth", authRoutes);

//used for scraping articles from investopedia and market watch 
router.use("/scrape", scrapeRoutes);

//used for all changes to users data, including articles, investments and watchlists
router.use("/data", dataRoutes);

// used for all hits to the world trading stock API
router.use("/api", apiRoutes);


router.use("/stockapi", stockAPIRoutes);

// Use the react app if no api routes are hit
router.use(function (req, res) {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

module.exports = router;