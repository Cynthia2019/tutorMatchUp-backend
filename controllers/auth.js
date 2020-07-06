//file for authentication ==> act of logging in a user
//controller is the folder that has a collection of const functions 


/**
 * SET UP
 */
require('dotenv').config();
const SECRET = process.env.SECRET_KEY;

//import jwt and bcrypt modules
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//get DB
const db = require('../db')

/**
 * FUNCTIONS
 */

const checkLogin = async(req, res) => {
    const collection = db.get().db().collection('users');
    //first, check if the user is already logged in using req.user
    //if logged in, return error 403
    //check if there exists a user with the same password and email
    //if exist, create a jwt token 
    const { email, password } = req.body
    await collection.findOne({email: email}, (err, user)=>{
        if(err){return(res.status(500).json({error:err}))} //if error, then it is a server side error, return 500
        if(!user){return(res.status(404).send('User not found'))} //if error, then there is no user with same email, return 404
        
        var validPassword = bcrypt.compare(password, user.password)
        if(!validPassword){return(res.status(401).send('Incorrect Password'))}//if error, then password is incorrect, return 401
        //if password correct, then generate a jwt token 
        var token = jwt.sign({id: user._id}, SECRET, {expiresIn: 86400}) // expires in 24 hours
        res.status(200).send({success:true, token:token})
    })
}

const logOut = (req, res) => {
    // clear the token 
    res.status(200).send({token: null})
}

module.exports = {
    checkLogin, 
    logOut
}