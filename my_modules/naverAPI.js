require('dotenv').config({ path: "/home/ubuntu/backEnd/nodejs/naver_map/map/.env"});
const request = require('request-promise-native');
//환경변수
const API_ID = process.env.API_ID;  
const API_KEY = process.env.API_KEY;
//naverModule 변수
let naverModule = [
    //[0] gecode
    {
        uri: "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode",
        qs: {query: "주소",}
    }, 
    // [1] driving
    {
        uri: "https://naveropenapi.apigw.ntruss.com/map-direction/v1/driving",
        qs: {start: "시작 위도 경도", goal: "끝나는 위도  경도"}
    },
];

module.exports =  {
    getAPI: (mode = 0, qs) => new Promise((res, rej) => {
        const options = {
            uri: naverModule[mode].uri,
            qs : qs,
            headers:{
                'X-NCP-APIGW-API-KEY-ID': API_ID,
                'X-NCP-APIGW-API-KEY': API_KEY,
            }
        };
        request.get(options).then((body) => {
            let data = JSON.parse(body);
            console.log("query :", qs);
            console.log(data);
            if(mode == 0) { res(data.addresses); }
            else if(mode == 1) {res(data.route); }
        }).catch(err => {
            console.log(err.options)
        });
    }),
    //query 형태 반환 데이터 타입 반환
    getQuery: function(dataMode){
        return naverModule[dataMode].qs;
    }
}

