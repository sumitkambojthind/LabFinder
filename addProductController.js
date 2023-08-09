const detailShopModel = require('./../model/detailShopModel')
const {promisify} = require('util')
const jwt = require('jsonwebtoken')
const signup = require('./../model/signupModel')
const allShops = require('./../model/AllShopsModel')
const userFromCookie = async (tokenUser)=>{
    const token = tokenUser;
    if(!token){
      return
    }
    const verifyUser = await promisify(jwt.verify)(token, process.env.STRING);
    const user = await signup.findById(verifyUser.id)
    return user;
  }

/**********************finding user shop products */
const userShopProducts = async (token)=>{
    const user = await userFromCookie(token);
    const userShop = await allShops.find({owner : user._id})
    const shopProducts = await detailShopModel.find({shop_id : userShop[0]._id})
    if(!shopProducts){
      return
    }
    return shopProducts;
  }

exports.addProduct = async (req, res, next)=>{
    const {product,catagory} = req.body;

    const user = await userFromCookie(req.cookies.jwt)
    const shop = await allShops.find({owner : user._id}) // it is array


    let addProduct;
    if(catagory=='general'){
        // console.log((await detailShopModel.find({shop_id : shop._id})).length)
        if((await detailShopModel.find({shop_id : shop[0]._id})).length!==0){
            const addingProduct = await detailShopModel.find({shop_id : shop[0]._id})
            product.shopName = shop[0].shop_name
            addingProduct[0].products.push(product)
            await addingProduct[0].save()
        }
        else if((await detailShopModel.find({shop_id : shop[0]._id})).length==0){
            addProduct = await detailShopModel.create({});
            addProduct.shop_id = shop[0]._id
            product.shopName = shop[0].shop_name

            addProduct.products.push(product)
            await addProduct.save()

        }
    }
    if(catagory=='famous'){
        if((await detailShopModel.find({shop_id : shop[0]._id})).length!==0){
            const addingProduct = await detailShopModel.find({shop_id : shop[0]._id})
            product.shopName = shop[0].shop_name

            addingProduct[0].famousProducts.push(product)

            await addingProduct[0].save()
        }
        else if((await detailShopModel.find({shop_id : shop[0]._id})).length==0){
            addProduct = await detailShopModel.create({});
            addProduct.shop_id = shop[0]._id
            product.shopName = shop[0].shop_name

            addProduct.famousProducts.push(product)
            await addProduct.save()

        }
    }

    res.status(200).json({
        status : 'success',
        data : {
            data : 'jeliya'
        }
    })
}


exports.removeProduct = async (req, res, next)=>{
    let shopProducts = await userShopProducts(req.cookies.jwt);
    const {product_name, product_price, product_des, catagory} = req.body;
    console.log(product_name, product_price, product_des, catagory)
    let filterProduct;
    let restproducts = [...shopProducts[0].products]
    let restFamousProducts = [...shopProducts[0].famousProducts]
    if(catagory==='common'){
        filterProduct = shopProducts[0].products.filter(e=> e.shop_name === product_name && e.price === product_price && e.product_des === product_des)
        filterProduct.forEach(el=>{
            restproducts.shift(el)
        })
        shopProducts[0].products = [...restproducts]
        await shopProducts[0].save()
    }

    if(catagory==='famous'){
        filterProduct = shopProducts[0].famousProducts.filter(e=> e.shop_name === product_name && e.price === product_price && e.product_des === product_des)
        filterProduct.forEach(el=>{
            restFamousProducts.shift(el)
        })
        console.log(restFamousProducts)
        shopProducts[0].famousProducts = [...restFamousProducts]
        await shopProducts[0].save()

    }

    // console.log(filterProduct)
    res.status(200).json({
        status : 'success',
        data : {
            data : filterProduct
        }
    })
}