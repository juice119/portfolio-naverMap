var express = require('express');
var router = express.Router();
var { Path } =require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

/* GET home page. */
router.get('/', isNotLoggedIn, async function(req, res, next) {
    console.log("===== GET history =====");
    let searchList = new Array();
    let sql_path = await Path.findAll({attributes: ['id', 'start', 'goal', 'way']});
    sql_path.forEach( e => {
        searchList.push(e.toJSON());
    });
  res.render('history', {"searchList": searchList});
});

module.exports = router;
