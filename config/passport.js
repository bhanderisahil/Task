
const JwtStrategy = require('passport-jwt').Strategy;
var Extractjwt = require('passport-jwt').ExtractJwt

var { userModel } = require('../app/model/usermodel');
var passport = require('passport');

var params = {}
params.jwtFromRequest = Extractjwt.fromAuthHeaderAsBearerToken()
params.secretOrKey = process.env.SECRET_KEY

passport.use(new JwtStrategy(params, async (jwt_payload, done) => {
    console.log("============================== passport ==========================")
    if (jwt_payload._id) {
        const data = await userModel.findOne({ _id: jwt_payload._id })
        if (data) {
            const userdata = { data }
            return done(null, userdata)
        }
        else {
            return done(null, false);
        }
    }
}))

