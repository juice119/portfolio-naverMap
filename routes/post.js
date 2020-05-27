var express = require('express');
var router = express.Router();
var naverAPI = require('../my_modules/naverAPI');

/* search */
router.post('/search', function(req, res, next) {
  console.log(req.body.search);
  var qs = naverAPI.getQuery(0);
  qs.query = req.body.search;
  console.log(qs);
  naverAPI.getAPI(0, qs).then(data => {
    console.log("======data==========");
    console.log(data);
    data.forEach(e => {
      console.log(e.roadAddress);
      console.log(e.jibunAddress);
      console.log(e.x, e.y);
    });
    res.status(200).json(data);
  });
});

/* driving */
router.post('/driving', function(req, res, next) {
  //1 driving
  console.log("driving");
  console.log("req.body");
  console.log(req.body);

  let mode = req.body.waypoints === "" ? 1 : 2;

  var qs = naverAPI.getQuery(mode);

  qs.start = req.body.start;
  qs.goal = req.body.goal;
  qs.option = req.body.option;
  qs.waypoints = req.body.waypoints;

  console.log(qs);

  // naverAPI에서 drving 가져오기
  naverAPI.getAPI(mode, qs).then(data => {
    console.log("naverAPI sucess");
    res.status(200).json(data);
  }).catch (err => {console.log(err);});
});

module.exports = router;