const router = require("express").Router();
const authControllers = require("../../controllers/authControllers");
const passport = require('passport');
require('../../config/passport')(passport);
// Matches with "/auth/users"
router
    .route("/register")
    .post(authControllers.create);

router
    .route("/login")
    .post(authControllers.login);

router
    .route("/authenticate/:username")
    .get(passport.authenticate('jwt', { session: false }), function (req, res) {
        let token = getToken(req.headers);
        console.log(token)
        if (token) {
            authControllers.authenticate(req.params.username)
        } else {
            return res.status(403).send({ success: false, msg: 'Unauthorized.' });
        }

    });

getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
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