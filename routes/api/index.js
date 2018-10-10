const router = require("express").Router();
const apiSearchRoutes = require("./api");

// api search routes
router.use("/search", apiSearchRoutes);

module.exports = router;
