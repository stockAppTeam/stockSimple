const router = require("express").Router();
const siriRoutes = require("./siri");

// routes for stock API axios calls
router.use("/siri", siriRoutes);

module.exports = router;