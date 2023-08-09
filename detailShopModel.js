const mongoose = require('mongoose')

const detailShop = new mongoose.Schema({
    shop_id : {
        type : mongoose.Schema.ObjectId,
        ref : 'allShops'
    }
    ,
    products : [Object]
    ,
    famousProducts : {
        type : [Object]
    }
})

const fs = require('fs')



const detailShopModel = mongoose.model('detailShopModel', detailShop)

// const fun = async (req, res, data)=>{
//     const dev = await detailShopModel.create({data})
// }

// fun(data)

module.exports = detailShopModel;