const axios = require('axios');

const articleData = {

    saveArticle: function(savedArticle) {
        return axios.post("/data/articledata/", savedArticle)
    }
    
}
export default articleData;