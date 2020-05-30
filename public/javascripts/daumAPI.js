var markers = [];

var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };  

// 지도를 생성합니다    
var map = new kakao.maps.Map(mapContainer, mapOption); 

// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places(); 
var geocoder = new kakao.maps.services.Geocoder();

//주소 검색 post로 데이터 요청후 받기
async function daumAPI_searchPlaces(target, psFun) {
    var keyword = target.value;
    if (!keyword.replace(/^\s+|\s+$/g, '')) {
        alert('키워드를 입력해주세요!');
        return false;
    }
    ps.keywordSearch( keyword, function(result1, status1, pagination1) {
        let sp_dt = {result: result1, status: status1, pagination: pagination1};
        geocoder.addressSearch(keyword, function(result2, status2, pagination2) {
            let gc_dt  =  {result: result2, status: status2, pagination: pagination2};
            psFun(sp_dt, gc_dt);
        });
    });
    
}