var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({"a":"aaa","b":"bbbb"})
});

module.exports = router;
