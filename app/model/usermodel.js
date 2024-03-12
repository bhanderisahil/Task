const { default: mongoose } = require("mongoose");

const userScema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    }
})

const userModel = new mongoose.model("User",userScema);



module.exports = {
    userModel,
}