const router = require("express").Router();
let request = require("request");
let rp = require('request-promise');
const axios = require("axios");
const siriControllers = require("../../controllers/siriControllers");


// Matches with "/siri"
/*
routes to add:
create watchlist [x]
remove [x] from the [y] watchlist
what are my top stocks today
what are my bottom stocks today
how much have I made so far? (should return total + on investments, and maybe today's change over yesterday)
*/

router
    .route("/")
    .post((req, res) => {

        // body: { watchlistName: 'technology', companyName: 'Apple' },
        console.log("/siri", req.body);
        let { watchlistName, companyName } = req.body;
        console.log(`/siri: Added ${companyName} to the ${watchlistName} watchlist`);

        res.status(200).send(`Success! StockSimple Has Added ${companyName} to the ${watchlistName} watchlist!`);

    });

    router
    .route("/a")
    .post((req, res) => {

        // body: { watchlistName: 'technology', companyName: 'Apple' },
        console.log("/siri/a", req.body);
        let { watchlistName, companyName } = req.body;
        console.log(`/siri/a: Added ${companyName} to the ${watchlistName} watchlist`);

        res.status(200).send(`Success! StockSimple Has Added ${companyName} to the ${watchlistName} watchlist!`);

    });

module.exports = router;





