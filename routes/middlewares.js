//passport를 통해서 req.isAuthenticated()함수로 passport를 통해 인증이 되이 있는 사용자 인경우 true 아닌경우 false를 반환한다

//로그인 되어 있으면 다음 미들웨어 수행, 아닌 경우 res.status(403).send('로그인 필요'); 수행
exports.isLoggedIn = (req, res, next) => {
    console.log(`isLoggedIn`);
    //passport 인증이 되어 있을때
    if(req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
}
//위와 반대로 동작하며 로그인이 되어 있는 경우 res.redirect('/');
exports.isNotLoggedIn = (req, res, next) => {
    console.log(`isNotLoggedIn`);
    console.log(req.isAuthenticated());
    if(!req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
}

//isAuthenticated객체는 passport로 인증이 되있는 경우 true 아닌 경우 false를 반환한다.