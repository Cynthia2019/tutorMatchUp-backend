var express = require('express');
var router = express.Router();

var db = require('../db')

/* GET users listing. */
router.get('/all', function(req, res, next) {
  var collection = db.get().db().collection('users')
  collection.find().toArray((res,err) => {
    if(err){console.log(err); return;}
    console.log(res)
  }
  )
});

/**GET one user */
router.get('/getOneUser', (req, res)=>{
  var collection = db.get().db().collection('users')
  const {email, password} = req.body
  collection.find({email: email, password: password})
            .toArray((err)=>{
              if(err){return(res.json({success:false, error:err}))}
              return(res.json({success:true}))
            })
})

/**POST user */
router.post('/postUser', (req, res)=>{
  var collection = db.get().db().collection('users')
  const { firstName, lastName, email, password} = req.body
  if(firstName && lastName && email && password){
    collection.insertOne({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    },(err)=>{
      if(err){return(res.json({success:false, error: err}))}
      return(res.json({success:true}))
    })
  } else {
    return(res.json({
      success: false, 
      error: 'Missing required fields'
    }))
  }
})



module.exports = router;
