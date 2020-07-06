var express = require('express');
var router = express.Router();

var db = require('../db') 
var ObjectID = require('mongodb').ObjectID

/* GET users listing. */
router.get('/all', function(req, res, next) {
  var collection = db.get().db().collection('users')
  collection.find().toArray((err, result) => {
    if(err){return(res.status(404).json({success:false, error: err}))}
    return(res.status(200).send(result))
  }
  )
});

/**GET one user */
router.get('/getOneUser', (req, res)=>{
  var collection = db.get().db().collection('users')
  const {email, password} = req.body
  collection.find({email: email, password: password})
            .toArray((err,result)=>{
              if(err){return(res.status(404).json({success:false, error: err}))}
              return(res.status(200).send(result))
            })
})

/**DELETE user */
router.delete('/deleteOneUser', (req, res)=>{
  var collection = db.get().db().collection('users')
  console.log(req.body.id.length)
  if(req.body.id.length != 12 && req.body.id.length != 24) {return(res.send('Invalid ID'))}
  var id = new ObjectID(req.body.id)
  collection.deleteOne({_id: id}, (err, result)=>{
    if(result.deletedCount === 0){return(res.send('Delete Failed'))}
    res.status(200).send('Delete Success')
  })
})



module.exports = router;
