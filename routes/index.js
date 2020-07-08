var express = require('express');
var router = express.Router();
const db = require('../db');

/* GET home page. */
router.get('/', function(req, res) {
  res.status(200).send(req.user || null)
});

module.exports = router;
