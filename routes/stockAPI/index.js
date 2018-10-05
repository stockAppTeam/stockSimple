const router = require("express").Router();
const stockAPIRoutes = require("./stockAPI");

// routes for stock API axios calls
router.use("/stockapi", stockAPIRoutes);

module.exports = router;