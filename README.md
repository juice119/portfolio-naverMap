# naverAPI, KAKAO지도API를 사용한 드라이빙 네비 서비스
[https://www.yeolju.com](https://www.yeolju.com)


 이 프로그램은 출발지, 경유지, 도착지를 장소 및 주소로 검색하여 선택을 한 후에 빠른길, 편한길, 최적, 무료우선의 옵션을 선택한 후에 경로탐색을
 클릭시 자동타로 이동할수 있는 네비를 제작하여 보여준다. 추가적으로 검색 기록을 알고 싶은 경우 admin계정은 모든 검색 기록을 볼 수 있으며 admin이
 아닌 사용자는 자신이 로그인하여 검색한 기록만을 볼수가 있다.
 
## 사용법
 1.출발지, 경유지, 도착지에 텍스트창을 클릭하여 주소 및 장소에 이름으로 검색을 한 후에 아래 검색결과를 클릭하여 선택을 한다. 
 이 과정을 출발지, 경유지, 도착지에 맞추어 반복한다.             
 
1-2.경유지를 넣고 싶은 경우에는 경유지 추가를 클릭하여 경유지칸을 추가 한후에 다시 검색후 장소를 선택한다.
 
 2.빠른길, 편한길, 최적, 무료우선 옵션을 클릭하여 선택하여 준다. (선택을 안한 경우에는 빠른길로 경로를 탐색한다.)
 
 3.경로 탐색을 클릭하여 잠시 기다리면 네비게이션에서 네비에 결과를 볼수 있다.

 4.검색기록을 보고 싶은 경우에는 회원가입 및 로그인 후에 검색기록을 클릭시 볼 수 있으며 자신이 검색한 기록만을 볼수 있다.
 (admin 계정은 모든 검색기록을 볼 수 있으며 ID,PASSWORD는 아래와 같다.)    
 
  admin계정
  ------
      ID      :admin              
      password:admin            

## 개발환경 및 주요 라이브러리
### 개발환경
```
nodeJS: 12.18.0             
npm: 6.14.4             
mysql: Ver 14.14 Distrib 5.7.30, for Linux (x86_64)             
Ubuntu:18.04.4

https - letsencrypt
cloudServer - AWS EC2
```
### 주요 라이브러리
```
passport, passport-local
sequelize
bcrypt
```

## 사용된 API
>naverAPI
> >1.Directions5  https://apidocs.ncloud.com/ko/ai-naver/maps_directions            
> >2.Directions15 https://apidocs.ncloud.com/ko/ai-naver/maps_directions_15       

>kakaoMAP
> >1.map https://apis.map.kakao.com/web/documentation/



## 사용된 module 및 version
    "request": "^2.88.2",
    "request-promise-native": "^1.0.8",
    "sequelize": "^5.21.11",
    "mysql2": "^2.1.0",
    "bcrypt": "^4.0.1",
    "connect-flash": "^0.1.1",
    "dotenv": "^8.2.0",
    "cookie-parser": "^1.4.5",    
    "passport": "^0.4.1",
    "passport-local": "^1.0.0",
    "debug": "~2.6.9",
    "express": "~4.16.1",
    "express-session": "^1.17.1",
    "http-errors": "~1.6.3",
    "morgan": "~1.9.1",
    "pug": "2.0.0-beta11",
    "serve-favicon": "^2.5.0"
    
    
  ./my_modules/naverAPI.js 설명
  --------------
  naverAPI파일은 naverAPI와 서버간의 편리하게 상호작용을 하기 위해 자체 제작된 모듈이다.  
  ### mode
  mode는 naverAPI에서 무슨 기능을 사용하지 선택하는 변수입니다.              
        [0]:gecode기능으로 주소로 검색을 하게 해주는 기능입니다.                
        [1]:drving-direction5기능으로 출발지와 도착지를 검색하여 네비게이션 데이터를 반환해줍니다.             
        [2]:driving-direction15기능으로 위에 기능과 유사하지만 경유지를 추가하여 검색합니다.               
            
  ### getQuery(mode)
  mode에 맞는 기능을 naverAPI에 보내기 위한 쿼리에 형식을 반환해주는 변수 입니다.            
  getAPI에 첫번째 매개변수로 사용됩니다.
  ### getAPI(mode, qs).then((data) => {})
  mode로 기능을 선택후 getQuery(mode)로 가져온 query를 qs에 넣어준후에 promise를 통해 then으로 naverAPI에서 데이터를 받은후에 작동할
  함수를 넣어서 사용하면 된다.
   
    
  
  # sequelize를 통한 table관계 및 table 사용 용도 설명
  --------------------------
  table은 user, path, detailpath 총 3개가 있으며 
        1.user은 사용자의 id, password, nick을 저장하기 위해 사용된다.
        2.path는 검색기록을 저장하기 위한 테이블이며 출발지, 경유지, 도착지, 출발지'도착지'경유지에 위도경도에 데이터를 저장한다.
        3.detailPath는 path를 통해 검색한 기록에 안내메시지를 저장하는 테이블이며 추가적인 컬럼 추가시 이 테이블을 사용한다.
        
## table간의 관계
 ### user(1) : path(N)
    ./models/index.js
    <pre><code>db.User.hasMany(db.Path);
    db.Path.belongsTo(db.User);</code></pre> 
    
    user테이블과 path테이블은 서로 1:N관계에 테이블로 사용자에 검색기록을 가져오기 위해 forignkey를 path에 userId로 추가시켜 생성한다.
    
 ### Path(1) : DetailPath(1)
    ./models/index.js
    <pre><code>db.Path.hasOne(db.DetailPath);
    db.DetailPath.belongsTo(db.Path);</code></pre> 
    
    path와 detailpath는 서로 1:1관계에 테이블로 검색기록을 통해 안내메시지를 가져오기 위해 forignkey를 detailpath에 pathId로 추가시켜 생성한다.
  
  
  
