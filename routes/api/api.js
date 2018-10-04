const router = require("express").Router();


// Matches with "/api/search"
router
    .route("/")
    .post((req, res) => {
        console.log(req.body)
    })


module.exports = router;