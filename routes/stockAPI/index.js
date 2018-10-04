const router = require("express").Router();
const stockAPIRoutes = require("./stockAPI");

// routes for stock API axios calls
router.use("/", stockAPIRoutes);

module.exports = router;