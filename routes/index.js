var express = require('express');
var config = require('../config');
//var jQuery = require('../jquery-1.11.3.js');
var router = express.Router();


var canvasWidth  = config.canvasWidth;
var canvasHeight = config.canvasHeight;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', width: canvasWidth, height: canvasHeight });
});

module.exports = router;


