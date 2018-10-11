const router = require("express").Router();
let request = require("request");
let rp = require('request-promise');
let cheerio = require("cheerio");

// Matches with "/scrape/articles"

//this route is for getting articles on the 'search page'
router
    .route("/investopedia")
    .get((req, res) => {
        let link = 'https://www.investopedia.com/news/';
        let entries = [];
        rp(link, function (error, response, html) {
            // pass the HTML to cheerio
            let $ = cheerio.load(html);
            $("li.item").each(function (i, element) {
                let content = {};
                content.title = $(element).children('h3').text();
                content.link = $(element).children('a').attr('href');
                content.imgLink = $(element).children('a').children('img').attr('src');
                content.desc = $(element).children('div.item-description').text();
                 entries.push(content)
                
            })
        })
            .then(() => {
                res.send(entries);
            });
    });

    // this is where the gainers/losers data comes from
router
    .route("/marketWatch")
    .get((req, res) => {
        let link = 'http://thestockmarketwatch.com/markets/pre-market/today.aspx';
        let movers = {};
        let topGainers = [];
        let topLosers = [];
        rp(link, function (error, response, html) {
            // pass the HTML to cheerio
            let $ = cheerio.load(html);
            $("table#tblMoversDesktop").children('tbody').children('tr').each(function (i, element) {
                // if the table row is of the type 'table data'create an object and push values into it
                if ($(element).children('td').length > 0) {
                    let tableRow = {};
                    tableRow.company = $(element).children('td.tdCompany').children('a').text(); 
                    tableRow.symbol = $(element).children('td.tdSymbol').children('a').text(); 
                    tableRow.changepct = parseFloat($(element).children('td.tdChangePct').children('div').text()).toFixed(2); 
                    tableRow.change = $(element).children('td.tdChange').children('div').text().split("").slice(0, 6).join(""); 
                    // if the change percentage is bigger than 0 it is a gainer so push into gainers array
                    // only pass  to the front end so the table is not too big
                    if (topGainers.length < 5 && tableRow.changepct > 0 ) {
                        topGainers.push(tableRow) 
                    } else if (topLosers.length < 5 && tableRow.changepct < 0 ) {
                        topLosers.push(tableRow)
                    }       
                }
            })
        })
        .then(() => {
            // send the objcto of two arrays to the front end
            movers.gainers = topGainers; 
            movers.losers = topLosers; 
            res.send(movers)
        }); 
    }); 

module.exports = router;

