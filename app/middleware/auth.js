const passport = require('passport')
const HTTP = require('../../constants/responseCode.constant');

const authUser = async (req, res, next) => {
    console.log("=========================================AUTHUSER================================")
    passport.authenticate('jwt', { session: false }, async (err, userData) => {
        if (err) {
            return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.BAD_REQUEST, msg: "Invalid Token" })
        }
        if (userData) {

            req.user = userData.data;
            return next();
        } else {
            return res.status(HTTP.SUCCESS).send({ status: false, code: HTTP.BAD_REQUEST, msg: "Invalid Token" })
        }
    })(req, res, next);
}
module.exports = { authUser }