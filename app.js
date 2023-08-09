const express = require("express");
const app = express();
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs')
app.use(express.json())
const pug = require("pug");
const cookieParser = require('cookie-parser')
const {promisify} = require('util')
const jwt = require('jsonwebtoken')
const signup = require('./model/signupModel')
const allShops = require('./model/AllShopsModel')
const cart = require('./model/cartModel')
app.use(cookieParser())
const path = require("path");

app.set("views", path.join(__dirname, "view"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "./public")));
/************************user finding from cookies */
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
  const shopProducts = await detailShopModel.find({shop_id : userShop[0]?._id})
  if(!shopProducts){
    return
  }
  return shopProducts;
}
/**************finding user shop********** */
const userShopFinding = async (token)=>{
  const user = await userFromCookie(token);
  const userShop = await allShops.find({owner : user._id})
  if(!userShop){
    return
  }
  return userShop
}
/***************finding user cart items */
const userCartItem = async (token)=>{
  const user = await userFromCookie(token)
  const cartItem = await cart.find({user : user._id})
  // check if the code from line 54 - 56 is needed or not
  if(!cartItem){
    return
  }
  const cartProducts = cartItem[0]?.product || []
  if(!cartProducts){
    return
  }
  return cartProducts
}
/********************route setting */
const AuthRouter = require("./routes/AuthRouter");
const openStoreRoute = require('./routes/openStoreRoute')
const addProductRoute = require('./routes/addProductRoute')
const cartRouter = require('./routes/cartRouter')
const exp = require("constants");
app.use("/api/v1", AuthRouter);
app.use("/api/v1/open-store", openStoreRoute)
app.use("/api/v1/open-store/add-products", addProductRoute)
app.use("/api/v1/detail", cartRouter)

// const filterAllShopRoute = require('./routes/filterAllShopRoute')
// app.use('/api/v1/all-shops', filterAllShopRoute)

app.use('/about', async(req, res)=>{
  res.status(200).render('about')
})

app.use('/my-account', async (req, res)=>{
  const user = await userFromCookie(req.cookies.jwt)
  const userShop = await userShopFinding(req.cookies.jwt)
  const userShopProduct = await userShopProducts(req.cookies.jwt)
  console.log("jere")
  console.log([...userShopProduct[0].products, ...userShopProduct[0].famousProducts])
  res.status(200).render('myAccount', {
    user : user,
    userShop : userShop,
    userShopProduct : userShopProduct
  })
})

app.use('/open-store/add-products', async (req, res)=>{

  const productsAdded = await userShopProducts(req.cookies.jwt)
  res.status(200).render('addProduct', {
    commonProducts : productsAdded[0]?.products || [],
    famousProducts : productsAdded[0]?.famousProducts || []
  })

})

app.use('/open-store', async (req, res)=>{
  res.status(200).render('openStoreForm')
})


const detailShopModel = require('./model/detailShopModel');



app.use('/detail/:shopID/:shop_name', async (req, res)=>{
  const data = JSON.parse(fs.readFileSync(`${__dirname}/public/dev-data/shopDetail.json`, 'utf-8'))
  const shop_id = req.params;
  let shopdetail = await detailShopModel.find({shop_id : shop_id.shopID}).populate("shop_id")
  if(!shopdetail){
    shopdetail = []
    return
  }
  let famousProducts = shopdetail[0].famousProducts
  if(!famousProducts){
    famousProducts = []
  }
  const products = shopdetail[0].products
  if(!products){
    products = []
  }


  /************finding cart items to display */
  const cartHaveOrNot = await userCartItem(req.cookies.jwt)
  // const cartProducts = cartHaveOrNot[0].product
  res.status(200).render('detailShop', {
    shopProducts : shopdetail,
    famous : famousProducts,
    products : products,
    cartItems : cartHaveOrNot
  })
})


app.use('/all-shops/:AllShops', async (req, res)=>{
  let allShopsContent
  // console.log(req.params.AllShops)
  if(req.params.AllShops==='allShops'){
    allShopsContent = await allShops.find()
  }
  else{
    allShopsContent = await allShops.find({shop_name : req.params.AllShops.replace('%20', ' ')})

  }
  const TOKEN = req.cookies.jwt
  const userComing = await userFromCookie(TOKEN)
  res.status(200).render('allShops', {
    Shops : allShopsContent,
    userComing : userComing

  })
})

app.use("/", async (req, res) => {
  const TOKEN = req.cookies.jwt
  const userComing = await userFromCookie(TOKEN)
  res.status(200).render("index", {
    userComing : userComing
  });
});
module.exports = app;
