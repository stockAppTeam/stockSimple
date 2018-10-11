const router = require("express").Router();
const authControllers = require("../../controllers/authControllers");
const passport = require('passport');
require('../../config/passport')(passport);

// Matches with "/auth/users"

    // route for first time user registers
router
    .route("/register")
    .post(authControllers.create);

    // route for current users logging in
router
    .route("/login")
    .post(authControllers.login);

    // this is the route hit after logging in that authenticates the user and gets all of their data
router
    .route("/authenticate/:userID")
    .get(passport.authenticate('jwt', { session: false }), function (req, res) {
        let token = getToken(req.headers);
        // if the token is found in the headers then load all data from the authentication controllers
        if (token) {
             authControllers.loadData(req, res)
        } else {
            return res.status(403).send({ success: false, msg: 'Unauthorized.' });
        }

    });

// route to delete entire profile 
router
    .route("/delete/:userId/:userToken")
    .delete(passport.authenticate('jwt', { session: false }), function (req, res) {
        let token = getToken(req.headers);
        // if the token is found in the headers then load all data from the authentication controllers
        if (token) {
             authControllers.deleteProfile(req, res)
        } else {
            return res.status(403).send({ success: false, msg: 'Unauthorized.' });
        }

    });

// helper function to extract the web token from the headers
getToken = function (headers) {
    if (headers && headers.authorization) {
        let parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};
module.exports = router;