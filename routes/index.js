var express = require('express');
var router = express.Router();
var ContentDispatcher = require("../controllers/ContentDispatcher_Controller");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/main' , function(req , res , next){
  var result = ContentDispatcher.main(req , res)
  if(!result){
    next()
  }
});

module.exports = router;
