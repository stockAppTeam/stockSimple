// require mongoose library and instatiate schema class
let mongoose = require('mongoose'); 
let Schema = mongoose.Schema; 

// make new article schema
let ArticleSchema = new Schema ({
    
    title: {
      type: String,
      required: true
    },
    link: {
      type: String,
    },
    desc: {
      type: String,
    },
    imgLink: {
      type: String,
    },
    date: {
     type: String
    }
  });
  
  // Create the Article model with the ArticleSchema
  let Articles = mongoose.model("Articles", ArticleSchema);
  
  // Export the model
  module.exports = Articles; 