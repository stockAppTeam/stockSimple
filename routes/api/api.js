const router = require("express").Router();
const axios = require("axios");


// Matches with "/api/search"
router
    .route("/:searchType/:searchVal")
    .get((req, res) => {
        let key = '';
        let query = { searchType, searchVal} = req.params;

        // search type is based on the parameter sent in. For name, query by name, else query by ticker
        if (searchType === 'name') {
            axios.get(`https://www.worldtradingdata.com/api/v1/stock_search?search_term=${searchVal}&sortlimit=20&api_token=${key}`)
                .then((data) => {
                    res.send(data.data)
                })
                .catch((err) => {
                    res.status(404).send({ success: false, msg: 'Internal Error.' });
                });
        } else {
            axios.get(`https://www.worldtradingdata.com/api/v1/stock?symbol=${searchVal}&api_token=${key}`)
                .then((data) => {
                    res.send(data.data)     
                })
                .catch((err) => {
                    res.status(404).send({ success: false, msg: 'Internal Error.' });
                });;
        }

    })


module.exports = router;