var express = require('express');
var router = express.Router();
var naverAPI = require('../my_modules/naverAPI');
var { Path, DetailPath } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');


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
  naverAPI.getAPI(mode, qs).then(async (data) =>  {
    console.log("naverAPI sucess");
    let guide = data[Object.keys(data)[0]][0].guide;
    let guide_db = "";
    guide.forEach((e, index) => {
      guide_db += e.instructions;
      guide_db += index < guide.length -1 ? "," : ""; 
    });
    let db_dt = {      
      start: req.body.start_name,
      start_ps: req.body.start,
      goal: req.body.goal_name,
      goal_ps: req.body.goal,
      way: req.body.way_name,
      way_ps: req.body.waypoints,
    };
    if(req.user) {
      // db_dt.push({userId: req.user.id});
      db_dt["userId"] =  req.user.id;
    }
    console.log(db_dt);
    const Paths = await Path.create(db_dt);

    console.log(Paths.id);
    const sql_detailPath = await DetailPath.create({
      guide: guide_db,
      pathId: Paths.id,
    });
    // console.log(sql_detailPath);
    res.status(200).json(data);
  }).catch (err => {console.log(err);});
});


/* history */
// post로 id라는 key값에 value로 paths(id), detailpaths(pathId)를 INNER JOIN하여 검색 결과를 JSON형식으로 반환해준다. 
router.post('/history', isLoggedIn, async function(req, res, next) {
  let myId = req.body.id;
  //SELECT ...
  // FROM `paths` AS `path` 
  // INNER JOIN detailpaths` AS `detailpath` ON `path`.`id` = `detailpath`.`pathId` AND `detailpath`.`id` = '포스트로 받은 데이터'
  //async를 적용시켜 sequelize에 find기능 사용시 비동기함수를 동기화 시켜준다.
  let sql_result = await Path.findOne({ 
    attributes: ["id", "start", "goal", "way", "userId"],
    include: [
      {
        model: DetailPath,
        attributes: ["id", "guide"],
        where: {id: myId }, 
      }],
  });

  if(sql_result.userId === req.user.id || req.user.userId === "admin") {
    res.status(200).json(sql_result.toJSON());
  } else {
    res.status(404).send("잘못된 접근입니다.");
  }
});

module.exports = router;