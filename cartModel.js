const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'signup'
    }
    ,
    product : {
        type : [Object]
    }
    ,
    
})

const cart = mongoose.model('cart', cartSchema)
module.exports = cart