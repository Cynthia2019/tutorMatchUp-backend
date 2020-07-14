var express = require('express');
var router = express.Router();

var db = require('../db') 
var ObjectID = require('mongodb').ObjectID

/* GET users listing. */
router.get('/all', function(req, res, next) {
 // var collection = db.get().db().collection('users')
 var collection = db.get().db().collection('users')
  collection.find().toArray((err, result) => {
    if(err){return(res.status(404).json({success:false, error: err}))}
    return(res.status(200).send(result))
  }
  )
});

/**GET one user */
router.get('/getOneUser/:id', (req, res)=>{
  var collection = db.get().db().collection('users')
  var id = new ObjectID(req.params.id)
  collection.findOne({_id: id}, (err, result)=>{
    if(err){return(res.status(404).json({success:false, error:err}))}
    res.status(200).send(result)
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

//UPDATE tutor info 
// update class, subject, gpa, phone
router.patch('/updateInfo', (req, res)=>{
  const collection = db.get().db().collection('users')
  var id = new ObjectID(req.body.id)
  console.log(id)
  collection.findOneAndUpdate({_id: id}, 
      {$set: {
          currentClass: req.body.currentClass, 
          gpa: req.body.gpa,
          phone: req.body.phone
      }}, {returnNewDocument: true}, (err, result)=>{
          if(err){return(res.status(500).send('Server Error'))}
          else if(!result.lastErrorObject.updatedExisting){
              return res.status(404).send('No manufacturer with that ID found');
          }
          else { 
              res.status(200).send({
                  updatedClass: req.body.currentClass, 
                  updatedGPA: req.body.gpa,
                  updatedPhone: req.body.phone
          })
          }
      })
})


module.exports = router;
