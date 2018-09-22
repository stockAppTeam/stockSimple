const path = require("path");
const router = require("express").Router();
const authRoutes = require("./auth");

// API Routes
router.use("/auth", authRoutes);

// Use the react app if no api routes are hit
router.use(function (req, res) {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

module.exports = router;