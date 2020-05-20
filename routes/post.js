var express = require('express');
var router = express.Router();
var naverAPI = require('../my_modules/naverAPI');

/* search */
router.post('/search', function(req, res, next) {
  console.log(req.body.search);
  var qs = naverAPI.getQuery(0);
  qs.query = req.body.search;
  naverAPI.getAPI(0, qs).then(data => {
    console.log("======data==========");
    data.forEach(e => {
      console.log(e.roadAddress);
      console.log(e.jibunAddress);
      console.log(e.x, e.y);
    });
    res.status(200).json(data);
  });
});

module.exports = router;
