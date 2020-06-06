var express = require('express');
var router = express.Router();
const { Path, User } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  res.render('main', {user: req.user, loginError: req.flash('loginError')});
});

router.get('/join', isNotLoggedIn, (req, res, next) =>{
  res.render('join');
});

router.get('/history', isLoggedIn, async function(req, res, next) {
  console.log("===== GET history =====");
  let searchList = new Array();

  let sql_option = {
    include: {
      model: User,
      where: {id: req.user.id}
    },
    attributes: ['id', 'start', 'goal', 'way'], 
  };

  if(req.user.userId === 'admin') {
    sql_option = {attributes: ['id', 'start', 'goal', 'way']};
  }
  
  let sql_path = await Path.findAll(sql_option);

  sql_path.forEach( e => {
      searchList.push(e.toJSON());
  });
  res.render('history', {"searchList": searchList});
});

module.exports = router;
