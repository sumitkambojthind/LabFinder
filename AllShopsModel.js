const mongoose = require('mongoose')
const fs = require('fs')
const allShopsSchema = new mongoose.Schema({
    shop_name : {
        type : String,
        trim : true
    }
    ,
    catagory : {
        type : String,
        trim : true
    }
    ,
    location : {
        type : String,
        trim : true
    }
    ,
    reviews : {
        type : String,
        trim : true
    }
    ,
    ratings : {
        type : String,
        trim : true
    }
    ,
    image : {
        type : String,
        trim : true
    }
    ,
    special : {
        type : String,
        trim : true 
    }
    ,
    delivery_time : {
        type : String,
        trim : true
    }
    ,
    distance : {
        type : String,
        trim : true
    }
    ,
    offer: {
        type : String,
        trim : true
    }
    ,
    owner : {
        type : mongoose.Schema.ObjectId,
        ref : 'signup'
    }
})


const allShops = mongoose.model('allShops', allShopsSchema)

// const file = fs.readFileSync(`${__dirname}/public/dev-data/shops.json`, 'utf-8')
// const uploadShop = async ()=>{
//     const shopUpload = await allShops.create({file})
// }
// uploadShop()
module.exports = allShops