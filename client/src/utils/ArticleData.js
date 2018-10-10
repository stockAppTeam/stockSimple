const axios = require('axios');

// routes for saving and deleting scraped articles
const articleData = {

    saveArticle: function(savedArticle) {
        return axios.post("/data/articledata/", savedArticle)
    }, 

    deleteArticle: function(deleteArticle) {
        return axios.delete(`/data/articledata/${deleteArticle}`)
    }
    
}
export default articleData;