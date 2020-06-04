const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { User } = require('../models');
var router = express.Router();

router.post('/login', (req, res, next) =>{
    passport.authenticate('local', (authError, user, info) => {
        if(authError) {
            console.error(authError);
            return next(authError);        
        }
        if (!user) {
            console.log('login Error');
            req.flash('loginError', info.message);
            return res.redirect('/');
        }
        return req.login(user, (loginError) => {
            if (loginError) {
              console.error(loginError);
              return next(loginError);
            }
            console.log('!!!loginSuccess');
            return res.redirect('/');
          });

    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.;
});

router.post('/join', async (req, res, next) => {
    let post_dt = { 
        userId: req.body.userId,
        userPassword: req.body.userPassword,
        nickname: req.body.nick,
    };
    try {
        const id_result = await User.findOne({where: { userId: post_dt.userId}});
        console.log(id_result);
        if(id_result) {
            req.flash('joinError', '이미 가입된 아이디입니다.');
            return res.redirect('/join');
        }
        const pass_hash = await bcrypt.hash(post_dt.userPassword, 12);
        let db_dt = {
            userId: post_dt.userId,
            userPassword: pass_hash,
            nickname: post_dt.nickname,
        };
        console.log(db_dt);
        const sql_result = await User.create(db_dt);
        res.redirect('/');
    } catch(error){
        return next(error);
    }
});

router.get('/logout', (req, res, next) => {
    console.log(`router.get('/logout'`);
    req.logout();
    req.session.destroy();
    res.redirect('/');
  });

module.exports = router;