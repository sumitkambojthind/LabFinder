const AllShops = require('./../model/AllShopsModel')
const {promisify} = require('util')
const jwt = require('jsonwebtoken')
const signup = require('./../model/signupModel')
const userFromCookie = async (tokenUser)=>{
    const token = tokenUser;
    if(!token){
      return
    }
    const verifyUser = await promisify(jwt.verify)(token, process.env.STRING);
    const user = await signup.findById(verifyUser.id)
    return user;
  }


exports.openStore = async (req, res, next)=>{
    const {shop_name, catagory, location, image, special} = req.body;
    const open = await AllShops.create({shop_name, catagory, location, image, special})
    console.log(open)
    const user = await userFromCookie(req.cookies.jwt)
    open.owner = user._id
    await open.save()
    console.log(user)
    res.status(200).json({
        status : 'success',
        data : {
            data : open
        }
    })
}