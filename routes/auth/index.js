const router = require("express").Router();
const usersRoutes = require("./authorization");

// Book routes
router.use("/users", usersRoutes);

module.exports = router;