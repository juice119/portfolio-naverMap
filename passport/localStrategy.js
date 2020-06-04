const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models');
const bcrypt = require('bcrypt');

module.exports = (passport) => {
    //req.body에 불러울 값에 key값과 완전히 같은 이름으로 적어야한다.
    passport.use(new LocalStrategy({
        usernameField: 'userId',
        passwordField: 'userPassword',
    }, async (id, password, done) => {
        console.log(`locallStrategy__async (${id}, ${password}, done)`);
        try{
            const sql_result = await User.findOne({ where: {userId: id}});
            if(sql_result) {
                const result = await bcrypt.compare(password, sql_result.userPassword);
                if(result) { //로그인 성공
                    done(null, sql_result);
                } else {
                    console.log(`locallStrategy__asyncd~~~not pass`);
                    done(null, false, { message: "비밀번호가 일치 하지 않습니다." });
                }
            } else {         //id가 존재하지 않는 경우
                console.log(`locallStrategy__asyncd~~~not id`);
                done(null, false, {message: '가입되지 않은 아이디 입니다.'});
            }
        } catch(error) {    //서버 에러 시
            console.error(error);
            done(error);
        }
    }));
}