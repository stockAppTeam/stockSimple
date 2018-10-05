const router = require("express").Router();
const usersRoutes = require("./authorization");

// authorization routes
router.use("/users", usersRoutes);

module.exports = router;