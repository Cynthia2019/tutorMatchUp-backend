var express = require('express');
var router = express.Router();

var { registerUser, registerTutor } = require('../controllers/register')

router.post('/tutees', registerUser);
router.post('/tutors', registerTutor)

module.exports = router