//map 설정
var map = new naver.maps.Map('map', {
    center: new naver.maps.LatLng(37.5666805, 126.9784147),
    zoom: 14
});
var polyline = new naver.maps.Polyline();
var marker = new Array();
function drawRoad(path, guide) {
    polyline.setOptions({
        map: map,
        path: path,
        strokeColor: '#5347AA',
        strokeWeight: 2
    });

    let markerPs = new Array();
    guide.forEach((e) => { markerPs.push(path[e.pointIndex]);});
    addMarker(markerPs);
    
    let latLng = new naver.maps.LatLngBounds(path[0], path[path.length-1]);
    map.panToBounds(latLng);
}

function addMarker(markerArr) {
    if(marker.length > 0) {
        marker.forEach((e) => {e.onRemove();})
        maker = new Array();
    }
    //마크 그리기
    markerArr.forEach((e) => {
        marker.push( new naver.maps.Marker({
            map: map,
            position: e
        }) );
    });
}

function mapCenter(x, y, zoom = 15) {
    
    var point = new naver.maps.Point(x, y);
    console.log(point);
    map.setCenter(point); // 중심 좌표 이동
    map.setZoom(zoom); 
}