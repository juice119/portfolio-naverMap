var express = require('express');
var router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  res.render('main', {user: req.user});
});
router.get('/join', isNotLoggedIn, (req, res, next) =>{
  res.render('join');
});

module.exports = router;
