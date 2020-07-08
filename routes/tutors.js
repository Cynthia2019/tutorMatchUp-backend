var express = require('express');
var router = express.Router();

const db = require('../db')
const ObjectID = require('mongodb').ObjectID
const uploadFile = require('../controllers/upload')

//GET all tutors
router.get('/all', (req, res) => {
    const collection = db.get().db().collection('tutors')
    collection.find().toArray((err, result)=>{
        if(err){return(res.status(500).send('Server Error'))}
        res.status(200).send(result)
    })
})

//GET one tutor by id
router.get('/getOneTutor', (req, res)=>{
    const collection = db.get().db().collection('tutors')
    var id = new ObjectID(req.body.id)
    collection.findOne({_id: id}, (err, result)=>{
        if(err){return(res.status(404).json({success:false, error:err}))}
        res.status(200).send(result)
    })
})

//DELETE one tutor by id
router.delete('/deleteOneTutor', (req, res)=>{
    const collection = db.get().db().collection('tutors')
    var id = new ObjectID(req.body.id)
    collection.deleteOne({_id:id}, (result)=>{
        if(result.deletedCount === 0){return(res.send('Delete Failed'))}
        res.send('Delete Succeed')
    })
})

//UPDATE tutor info 
// update class, subject, gpa, phone
router.patch('/updateInfo', (req, res)=>{
    const collection = db.get().db().collection('tutors')
    var id = new ObjectID(req.body.id)
    collection.findOneAndUpdate({_id: id}, 
        {$set: {
            currentClass: req.body.currentClass, 
            subject: req.body.subject,
            gpa: req.body.gpa,
            phone: req.body.phone
        }}, {returnNewDocument: true}, (err, result)=>{
            if(err){return(res.status(404).send('No tutor with this ID found'))}
            else {res.status(200).send(result)}
        })
})

router.patch('/updateAvatar', uploadFile)


module.exports = router; 