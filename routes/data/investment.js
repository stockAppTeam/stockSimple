const router = require("express").Router();
const investmentControllers = require("../../controllers/investmentControllers");


// Matches with "/data/investment"
router
    .route("/")
    .post(investmentControllers.addStock);

router.route("/:deleteId")
    .delete(investmentControllers.deleteStock)


module.exports = router;