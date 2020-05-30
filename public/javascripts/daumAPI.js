var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };  
let marker = new Array();
let polyline;

let testDatas = {
    guide : [
        [127.076739, 37.1501705]
        ,[127.073737, 37.1499416]
        ,[127.0474919, 37.1862333]
        ,[127.0426949, 37.1949747]
        ,[127.0367246, 37.2057738]
        ,[127.022652, 37.2577196]
        ,[127.0257625, 37.2643412]
        ,[127.0278872, 37.2638079]
        ,[127.027804, 37.263584]
        ,[127.0282309, 37.2634893]
        ,[127.0280651, 37.2634922]
        ,[127.027804, 37.263584]
        ,[127.0275119, 37.2628581]
        ,[127.0250365, 37.2633828]
        ,[127.0315305, 37.2119793]
        ,[127.0390108, 37.2021239]
        ,[127.0447045, 37.1926181]
        ,[127.0734708, 37.146408]
        ,[127.0762042, 37.1463177]
        ,[127.0764776, 37.145356]
        ,[127.0756094, 37.1453646]
        ,[127.0756078, 37.1452474]
    ],
    way:[]
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
function drawRoad(path, guide, way) {
    let markerPs = new Array();
    console.log(path, guide);
    guide.forEach((e) => { markerPs.push(path[e.pointIndex]);});
    addMarker(markerPs, way, path[0], path[path.length-1]);
    addPoly(path);

    let centerLang = path[ parseInt(path.length/2) ];
    console.log("centerLang:", centerLang);
    console.log("path.length/2:", path.length/2, ", path[path.length/2]", path[path.length/2]);
    map.setCenter(new kakao.maps.LatLng(centerLang[1], centerLang[0]));
    map.setLevel(8);
}

//ceter로 이동
function setCenter(x1, y0) {            
    let level =  2;
    // 이동할 위도 경도 위치를 생성합니다 
    var moveLatLon = new kakao.maps.LatLng(x1, y0);
    
    // 지도 중심을 이동 시킵니다
    map.setCenter(moveLatLon);
    map.setLevel(level);
}

function addMarker(guide, way, start, end) {
    console.log("=====================addMarker데이터");
    console.log(guide, way, start, end);
    if(marker.length > 0) {
        console.log("maker reset");
        markerReset();
    }
    //markerArr 넣기
    guide.forEach((e, index) => {
        var imageSrc = './images/img_search.png'; // 마커 이미지 url, 스프라이트 이미지를 씁니다
        let imageSize = new kakao.maps.Size(16, 16);  // 마커 이미지의 크기
        let imgOptions =  {
            spriteSize : new kakao.maps.Size(490, 492), // 스프라이트 이미지의 크기
            spriteOrigin : new kakao.maps.Point(250, 100), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
            offset: new kakao.maps.Point(0, 0) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        };
        let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);
        let img_marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(e[1], e[0]),
            image: markerImage 
        });
        marker.push(img_marker);
    });
    console.log(marker);

    let way_xy = new Array();
    if(way) { way.forEach(e => {way_xy.push([e.location[0], e.location[1]]);}); }
    
    addImgMarker(way_xy, [], start, end, false);
}
function addImgMarker(gc_markerArr, sp_markerArr, start, end, reset=true) {
    if(reset) {
        markerReset();
    }
    
    console.log("=========addImgMarker데이터");
    console.log("gc_markerArr",gc_markerArr);
    console.log("sp_markerArr",sp_markerArr);
    console.log(start);
    console.log(end);

    if(start && end) {
        console.log("start, end drawMarker");
        var imageSrc = './images/img_search.png'; // 마커 이미지 url, 스프라이트 이미지를 씁니다
        let imageSize = new kakao.maps.Size(30, 45);  // 마커 이미지의 크기
        let imgOptions1 =  {
            spriteSize : new kakao.maps.Size(490, 492), // 스프라이트 이미지의 크기
            spriteOrigin : new kakao.maps.Point(90, 0), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
            offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        };
        let imgOptions2 =  {
            spriteSize : new kakao.maps.Size(490, 492), // 스프라이트 이미지의 크기
            spriteOrigin : new kakao.maps.Point(170, 0), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
            offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        };

        let markerImage1 = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions1);
        let markerImage2 = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions2);

        let start_marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(start[1], start[0]),
            image: markerImage1 
        });
        let end_marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(end[1], end[0]),
            image: markerImage2 
        });
        marker.push(start_marker);
        marker.push(end_marker);
    }

    //markerArr 넣기
    sp_markerArr.forEach((e, index) => {
        var imageSrc = './images/marker_number_blue.png'; // 마커 이미지 url, 스프라이트 이미지를 씁니다
        let imageSize = new kakao.maps.Size(36, 37);  // 마커 이미지의 크기
        let imgOptions =  {
            spriteSize : new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
            spriteOrigin : new kakao.maps.Point(0, (index*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
            offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        };
        let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);
        let img_marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(e[1], e[0]),
            image: markerImage 
        });
        marker.push(img_marker);
    });
    //markerArr 넣기
    gc_markerArr.forEach((e, index) => {
        var imageSrc = './images/marker_number_orange.png'; // 마커 이미지 url, 스프라이트 이미지를 씁니다
        let imageSize = new kakao.maps.Size(36, 37);  // 마커 이미지의 크기
        let imgOptions =  {
            spriteSize : new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
            spriteOrigin : new kakao.maps.Point(0, (index*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
            offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        };
        let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);
        let img_marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(e[1], e[0]),
            image: markerImage 
        });
        marker.push(img_marker);
    });

    //마커 지도 위에 설정
    marker.forEach(e => {e.setMap(map);});
}
function markerReset() {
    if(marker.length > 0) {
        marker.forEach((e) => {
            e.setMap(null);
        });
        marker = new Array();
    }
}

function addPoly(path) {
    var linePath = new Array;
    path.forEach(e => {linePath.push(new kakao.maps.LatLng(e[1], e[0]));});
    console.log(linePath);

    if(polyline) {
        polyline.setMap(null);  
    }

    // 지도에 표시할 선을 생성합니다
    polyline = new kakao.maps.Polyline({
        path: linePath, // 선을 구성하는 좌표배열 입니다
        strokeWeight: 4, // 선의 두께 입니다
        strokeColor: '#283593', // 선의 색깔입니다
        strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle: 'solid' // 선의 스타일입니다
    });
    
    // 지도에 선을 표시합니다 
    polyline.setMap(map);  
}
function polyReset() {
    
}



