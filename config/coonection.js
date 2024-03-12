const mongoose = require('mongoose');
mongoose.connect(process.env.mongoDb).then(()=>{
    console.log("db connection successful")
}).catch((err)=>{
    console.log(`db not connected: ${err}`);
})