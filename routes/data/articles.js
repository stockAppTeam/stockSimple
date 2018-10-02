const router = require("express").Router();
const articleControllers = require("../../controllers/articleControllers");


// Matches with "/scrape/articles"
router
    .route("/")
    .post(articleControllers.saveArticle)
    // .delete(articleControllers.deleteArticle);

module.exports = router;