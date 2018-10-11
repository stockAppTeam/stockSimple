const router = require("express").Router();
const articleControllers = require("../../controllers/articleControllers");


// Matches with "/data/dataArticle"

// save an article to the database
router
    .route("/")
    .post(articleControllers.saveArticle);

// delete saveda article from database
router.route("/:articleId/:userId")
    .delete(articleControllers.deleteArticle);

module.exports = router;