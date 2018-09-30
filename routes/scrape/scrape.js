const router = require("express").Router();
let request = require("request");
let cheerio = require("cheerio");

// Matches with "/auth/users"
router
    .route("/investopedia")
    .get((req, res) => {
        let link = 'https://www.investopedia.com/news/';
        request(link, function (error, response, html) {
            // pass the HTML to cheerio
            let $ = cheerio.load(html);
            let entries = []; 
            $("li.item").each(function (i, element) {
                let content= {}; 
                content.title = $(element).children('h3').text(); 
                content.link = $(element).children('a').attr('href'); 
                content.imgLink = $(element).children('a').children('img').attr('src'); 
                content.desc = $(element).children('div.item-description').text(); 
               entries.push(content)
            });
            console.log(entries)

        });

    }); 

    module.exports = router;

