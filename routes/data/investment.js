const router = require("express").Router();
const investmentControllers = require("../../controllers/investmentControllers");


// Matches with "/data/watchlist"
router
    .route("/")
    .post(investmentControllers.addStock); 


module.exports = router;