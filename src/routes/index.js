import {readFileSync} from 'fs'
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    try {
      res.render('readme',{})

    } catch (error) {
      console.log('bloody hell')
      console.error(error)
    }

});

module.exports = router;
