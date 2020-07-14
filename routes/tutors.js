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
router.get('/getOneTutor/:id', (req, res)=>{
    const collection = db.get().db().collection('tutors')
    var id = new ObjectID(req.params.id)
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
    console.log(id)
    collection.findOneAndUpdate({_id: id}, 
        {$set: {
            currentClass: req.body.currentClass, 
            subject: req.body.subject,
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
                    updatedSubject: req.body.subject, 
                    updatedGPA: req.body.gpa,
                    updatedPhone: req.body.phone
            })
            }
        })
})

router.patch('/updateAvatar', uploadFile)

router.patch('/updateSchedule', (req, res)=>{
    const collection = db.get().db().collection('tutors')
    var id = new ObjectID(req.body.id)
    console.log(id)
    collection.findOneAndUpdate({_id: id}, {
        $set: {availableTime: req.body.schedule}
    }, (err, result)=>{
        if(err){return res.send("Server Error")}
        else if(!result.lastErrorObject.updatedExisting){return res.status(404).send("No tutor with that id found")}
        else {console.log(res, result.value.availableTime)
            res.status(200).send({schedule: req.body.schedule})}
    })
    
})


module.exports = router; 