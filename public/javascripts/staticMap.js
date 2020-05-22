//map 설정
var map = new naver.maps.Map('map', {
    center: new naver.maps.LatLng(37.5666805, 126.9784147),
    zoom: 14
});
function drawRoad(path, guide) {
    // 경로 그리기
    var polyline = new naver.maps.Polyline({
        map: map,
        path: path,
        strokeColor: '#5347AA',
        strokeWeight: 2
    });
    //마크 그리기
    guide.forEach((e) => {
        new naver.maps.Marker({
            map: map,
            position: path[e.pointIndex]
        });
    });
    let latLng = new naver.maps.LatLngBounds(path[0], path[path.length-1]);
    map.panToBounds(latLng);
}

let ttData = new naver.maps.LatLng("127.0774613, 37.1498864");
function test(myLatLng, zoom) {
    // let ps = new naver.maps.LatLng(myLatLng);
    let ps = new naver.maps.LatLngBounds(
        ttData,
        ttData );

    // map.setZoom(zoom, true);
    map.panToBounds(ps);
    // map.panTo(ps);
    // map.setCenter(ps);
}