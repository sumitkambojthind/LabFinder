const app = require('./app')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config({path : './config.env'})

const connect = mongoose.connect(process.env.CONNECTION).then(el=>{
    console.log("DB connection established")
})

app.listen(6300, ()=>{
    console.log("6300 is live")
})

