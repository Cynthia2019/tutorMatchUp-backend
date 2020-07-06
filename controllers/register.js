//functions that register a user

const db = require('../db')

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

require('dotenv').config();

const SECRET = process.env.SECRET_KEY

const registerUser = async(req, res) => {
    const collection = db.get().db().collection('users')
    const {firstName, lastName, email, password} = req.body
    if(!firstName || !lastName || !email || !password){
        return(res.status(401).send("Missing Required Fields"))
    }
    //check if the email is already registered
    await collection.findOne({email: email}, (err, user)=>{
        if(user){return(res.status(403).send('Email already registered'))}
    })
    await collection.insertOne({
        firstName: firstName, 
        lastName: lastName,
        email: email,
        password: bcrypt.hash(password, 8, err=>{if(err){return res.status(400).send('Bad hashing')}})
    }, (err, user)=>{
        if(err){return(res.status(500).send('Server Error'))}//handle error
        var token = jwt.sign({id: user._id}, SECRET, {expiresIn: 86400}) //expire in 24h
        res.status(200).send({success: true, token:token})
    })
}

const registerTutor = async(req, res) => {
    const collection = db.get().db().collection('tutors')
    const {firstName, lastName, email, password, currentClass, gpa, avatar, phone} = req.body
    if(!firstName || !lastName || !email || !password){
        return(res.status(401).send("Missing Required Fields"))
    }
    //check if the email is already registered
    await collection.findOne({email: email}, (err, user)=>{
        if(user){return(res.status(403).send('Email already registered'))}
    })
    await collection.insertOne({
        firstName: firstName, 
        lastName: lastName,
        email: email,
        password: bcrypt.hash(password, 8, err=>{if(err){return res.status(400).send('Bad hashing')}}),
        currentclass: currentClass || null, 
        gpa: gpa || null, 
        avatar: avatar || null, 
        phone: phone || null
    }, (err, user)=>{
        if(err){return(res.status(500).send('Server Error'))}//handle error
        var token = jwt.sign({id: user._id}, SECRET, {expiresIn: 86400}) //expire in 24h
        res.status(200).send({success: true, token:token})
    })
}

module.exports = {
    registerUser,
    registerTutor
}