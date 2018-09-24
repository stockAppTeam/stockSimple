// require mongoose library and instatiate schema class
let mongoose = require('mongoose'); 
let Schema = mongoose.Schema; 

// make new article schema
let ArticleSchema = new Schema ({
    
    // title  links must be a string
    title: {
      type: String,
      unique: true, 
      dropDups: true, 
      required: true
    },
    link: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      required: true
    },
    imgLink: {
      type: String,
      required: true
    },
    date: {
     type: String
    }
  });
  
  // Create the Article model with the ArticleSchema
  let Articles = mongoose.model("Articles", ArticleSchema);
  
  // Export the model
  module.exports = Articles; 