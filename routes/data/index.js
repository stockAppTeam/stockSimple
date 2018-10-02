const router = require("express").Router();
const articleData = require("./articles");

// routes for deleting and saving articles
router.use("/articledata", articleData);

module.exports = router;