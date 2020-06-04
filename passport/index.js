const local = require('./localStrategy.js');
const { User } = require('../models');


module.exports = (passport) => {
    //serializeUser는 사용자 정보 객체를 세션에 아이디로 저장하는 것
    passport.serializeUser((data, done) => {
        console.log(`!!!passport/index__passport.serializeUser((${data}, done)`);
        console.log(data.dataValues);
        done(null, data.userId);
    });

    //deserializeUser는 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러오는 것
    passport.deserializeUser((id, done) => {
        console.log(`!!!passport/index__passport.deserializeUser((${id}, done)`);
        User.findOne({
            where: { userId: id },
        })
            .then(user => { done(null, { id: user.id, userId: user.userId, nick: user.nick })})
            .catch(error => { done(error)});
    });
    local(passport);
};