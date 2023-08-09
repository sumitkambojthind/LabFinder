const cart = require('../model/cartModel')
const {promisify} = require('util')
const jwt = require('jsonwebtoken')
const signup = require('../model/signupModel')
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
/************************************************ */
exports.cartEntry = async (req, res, next)=>{
    /****collecting the upcoming data */
    const {product} = req.body
    const userdata = await userFromCookie(req.cookies.jwt)
    const user = userdata._id

    /********checking if the prev cart is there or not */
    let existingcart = await cart.find({user : user})
    if(existingcart.length==0){
        const cartItem = await cart.create({user, product})
    }
    else if(existingcart.length!=0){
        existingcart[0].product.push(product)
        await existingcart[0].save()
    }
    res.status(200).json({
        status : "sucess",
        data : {
            data : product
        }
    })
}

exports.cartRemovingItem = async(req, res, next)=>{
    const user = await userFromCookie(req.cookies.jwt);
    const cartItem = await cart.find({user : user._id});
    const {removeItem} = req.body;
    const cartProducts = cartItem[0].product;
    cartProducts.pop(removeItem)
    await cartItem[0].save()
    res.status(200).json({
        status : 'sucess',
        data : {
            data : removeItem
        }
    })

}

exports.cartquantity = async(req, res, next)=>{
    const {newPricedObject} = req.body;
    const userdata = await userFromCookie(req.cookies.jwt)
    const user = userdata._id
    let existingcart = await cart.find({user : user})
    const selectedProductForInhencequantity = existingcart[0].product.find(el=> el.product_name==newPricedObject.product_name)
    // selectedProductForInhencequantity.product_price = newPricedObject.newPrice;
    selectedProductForInhencequantity.quantity = newPricedObject.quantityOfItem;
    const updatedProduct = {
        product_name : newPricedObject.product_name,
        product_price : Number(newPricedObject.quantityOfItem) * Number(selectedProductForInhencequantity.product_price),
        product_shopname : selectedProductForInhencequantity.product_shopname,
        product_quantity : newPricedObject.quantityOfItem
    }
    existingcart[0].product.pop(selectedProductForInhencequantity)
    existingcart[0].product.push(updatedProduct)

    console.log(existingcart[0].product)
    await existingcart[0].save()

    // res.status(200).send({
    //     status : 'sucess',
    //     data : {
    //         originalPrice : selectedProductForInhencequantity.product_price,
    //     }
    // })
    res.status(200).json({
        status : 'sucess',
        data : {
            data : existingcart
        }
    })
}