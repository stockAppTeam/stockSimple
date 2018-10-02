const router = require("express").Router();
const articleControllers = require("../../controllers/articleControllers");


// Matches with "/data/dataArticle"
router
    .route("/")
    .post(articleControllers.saveArticle)

router.route("/:deleteId")
    .delete(articleControllers.deleteArticle)

module.exports = router;