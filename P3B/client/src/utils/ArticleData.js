const axios = require('axios');

const articleData = {

    saveArticle: function(savedArticle) {
        return axios.post("/data/articledata/", savedArticle)
    }, 

    deleteArticle: function(deleteArticle) {
        return axios.delete(`/data/articledata/${deleteArticle}`)
    }
    
}
export default articleData;