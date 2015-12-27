var express = require('express');
var router = express.Router();

var jstest = require('../public/javascripts/chat.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    //res.render('index', { title: 'Express' });
    console.log(__dirname);
    //res.sendFile(__dirname + '/chat.js');
    res.sendFile(jstest);
});

module.exports = router;


