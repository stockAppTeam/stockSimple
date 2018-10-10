const router = require("express").Router();
const investmentControllers = require("../../controllers/investmentControllers");


// Matches with "/data/investment"

// add a stock to your investments portfolio
router
    .route("/")
    .post(investmentControllers.addStock);

//delete a stock from investment portfolio
router.route("/:deleteId/:userId")
    .delete(investmentControllers.deleteStock); 


module.exports = router;