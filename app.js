require('dotenv').config({ path: './config/.env' });

const express = require('express');
app = express();

const PORT = process.env.PORT || 5000;
const passport = require('passport');

require("./config/coonection");
require("./config/passport");

const userRouter = require("./app/router/userrouter");

app.use(passport.initialize());
app.use(express.json());


app.use(userRouter)


app.listen(PORT, () => {
    console.log("server running on port " + PORT);
})