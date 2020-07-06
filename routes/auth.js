var express = require('express');
var router = express.Router();

const {checkLogin, logOut} = require('../controllers/auth')

router.post('/login', checkLogin);
router.post('/logout', logOut)

module.exports = router;