const signup = require('./../model/signupModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Token = async (id)=>{
    return await jwt.sign({id : id}, process.env.STRING);
}


exports.signupAuth = async (req, res, next)=>{
    let {username, email, password, catagory} = req.body;
    /**********cheking is username already exits or not////****** */
    const exixting_user = await signup.findOne({username : username})
    if(exixting_user){
        res.status(200).send({
            status : 'success',
            data : {
                user : exixting_user
            }
        })
        return
    }
    /************************bcrypting the password */
    password = await bcrypt.hash(password, 12)
    /*************************signing the new user */
    const savingUser = await signup.create({username, email, password, catagory})

    /****************sending the cookies */
    const findUser = await signup.find({username : username})
    const token = await Token(findUser[0]._id);
    const cookieOptions = {
        httpOnly : true
    }
    res.cookie('jwt', token, cookieOptions);
    res.status(200).json({
        status : 'success',
        data : {
            user : savingUser
        }
    })
}


const invalidUserIdORPassword = (res)=>{
    res.status(200).send({
        status : 'success',
        data : {
            msg : "Invalid user id or password"
        }
    })
}


exports.login = async (req, res, next)=>{
    const {email, password} = req.body;
    const user_finding = await signup.findOne({email : email})
    if(!user_finding){
        invalidUserIdORPassword(res)
        return
    }
    const passwordCheck = await bcrypt.compare(password,user_finding.password)
    if(!passwordCheck){
        invalidUserIdORPassword(res)
        return
    }

    /******************adding the cookies*/
    const token = await Token(user_finding._id)
    const cookieOptions = {
        httpOnly : true
    }
    res.cookie('jwt', token, cookieOptions);

    res.status(200).json({
        status : 'success',
        data : {
            user : user_finding
        }
    })
}