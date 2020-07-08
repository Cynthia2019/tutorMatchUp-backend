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

const authTokens = {};

const checkLogin = async(req, res) => {
    const collectionUser = db.get().db().collection('users');
    const collectionTutor = db.get().db().collection('tutors')
    //first, check if the user is already logged in using req.user
    //if logged in, return error 403
    //check if there exists a user with the same password and email
    //if exist, create a jwt token 
    const { email, password } = req.body
    await collectionUser.findOne({email: email}, async(err, user)=>{
        var candidate = {};
        if(err){return(res.status(500).json({error:err}))} //if error, then it is a server side error, return 500
        candidate.tutee = user
        candidate.tutee?candidate.type='tutee':candidate.type=null
        await collectionTutor.findOne({email: email}, (err, user)=>{
            if(err){return(res.status(500).json({error:err}))}
            if(!user && !candidate){return(res.status(404).send('No matching user/tutor'))}
            candidate.tutor = user
            candidate.type?candidate.type='both':candidate.type='tutor'
        })
         //if error, then there is no user with same email, return 404
        var validPassword = bcrypt.compare(password, candidate.tutee.password || candidate.tutor.password)
        if(!validPassword){return(res.status(401).send('Incorrect Password'))}//if error, then password is incorrect, return 401
        //if password correct, then generate a jwt token 
        var token = jwt.sign({id: candidate.tutee._id || candidate.tutor._id}, SECRET, {expiresIn: 86400}) // expires in 24 hours
        authTokens[token] = candidate;
        res.cookie('AuthToken', token)
        res.status(200).send({success:true, token:token})
    })
}

const logOut = (req, res) => {
    // clear the token 
    res.status(200).send({token: null})
}

//Middleware to check if a user is logged in, if a token is detected, then 
//attach the user object to the req body
const authenticate = (req, res, next) => {
    const token = req.cookies['AuthToken']
    req.user = authTokens[token]; 
    next()
}

module.exports = {
    checkLogin, 
    logOut,
    authenticate
}