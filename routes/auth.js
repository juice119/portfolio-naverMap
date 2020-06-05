const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { User } = require('../models');
var router = express.Router();

//로그인시 
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

//로그아웃시에는 session을 비우고 passport로 인증을 해제 시킨다.
router.get('/logout', (req, res, next) => {
    console.log(`router.get('/logout'`);
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

//회원가입시에 수행되며 passport는 사용하지 않고 데이터베이스를 사용하기 위한 sequelize와 암호화를 위한 bcrypt모듈만이 사용된다.
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
        //password를 받아서 bcrypt를 사용해 단방향 암호화를 하여 저장한다.
        const pass_hash = await bcrypt.hash(post_dt.userPassword, 12);  //암호를

        //db에 저장할 데이터이며 key는 db column명이며, value는 저장할 값이다. 
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

module.exports = router;