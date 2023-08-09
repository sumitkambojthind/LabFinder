const mongoose = require('mongoose')

const signupSchema = new mongoose.Schema({
    username : {
        type : String,
        trim : true
    }
    ,
    email : {
        type : String,
        trim : true
    }
    ,
    password : {
        type : String,
        trim : true,
    }
    ,
    catagory : {
        type : String,
        trim : true,
    }
})


const signup = mongoose.model('signup', signupSchema)

module.exports = signup;
