const router = require("express").Router();
const stockAPIRoutes = require("./stockAPI");

// routes for stock API axios calls
router.use("/stockAPI", stockAPIRoutes);

module.exports = router;