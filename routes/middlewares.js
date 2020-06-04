exports.isLoggedIn = (req, res, next) => {
    console.log(`isLoggedIn`);
    //passport 인증이 되어 있을때
    if(req.isAuthenticated()) {
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
}
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