var express = require('express');
var router = express.Router();
var naverAPI = require('../my_modules/naverAPI');


router.get('/', (req, res) => {
  console.log( req.cookies.data);
});

module.exports = router;
