const router = require("express").Router();
const authControllers = require("../../controllers/authControllers");

// Matches with "/auth/users"
router
    .route("/")
    .post(authControllers.create);

module.exports = router;