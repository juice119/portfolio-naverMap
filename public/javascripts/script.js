let drivingSave;
let searchTarget;
document.getElementById('driving').addEventListener('submit', function (e) {});
drivingInputReset();

// 길찾기 버튼 클릭시
document.getElementById('driving').addEventListener('submit', function (e) {
    console.log("================경로 버튼 클릭 이벤트");
    e.preventDefault();
    var wayPoints = document.querySelector(".waypoints");
    let wayNum = wayPoints.childNodes.length + 1;

    let form = e.target;
    let wayData = "";

    for(let i = 1; i < wayNum; i++) {
        let way = "way" + i;
        let data = "";
        console.log("way" + i);
        data = form[way + "_x"].value + "," + form[way + "_y"].value;
        console.log(data);
        if(i != 1 && i != wayNum) {
            wayData += ":";
        }
        wayData += data;
    }
    console.log(wayData);

    testData = form;
    if(form.start.value !== "" && form.goal.value !== "") {
        let formData = {
            start_name: form.start.value,
            start: form.start_x.value + "," + form.start_y.value,
            goal_name: form.goal.value,
            goal: form.goal_x.value + "," + form.goal_y.value,  
            option: form.option.value,
            waypoints: wayData,
        };
        console.log(formData);
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if(xhr.status === 200) {
                console.log("==========getDrivingData");
                let data = JSON.parse(xhr.responseText);
                let myData = data[Object.keys(data)[0]];
                console.log(myData);
                drivingSave = myData;
                drivingAddBlock(myData);
                drawRoad(myData[0].path, myData[0].guide);
            } else {
                console.log(xhr.responseText);
            }
        };
        xhr.open('POST', '/post/driving');
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify(formData));
        console.log(formData);
    }
    else if(form.start.value === ""){
        alert("출발 지점을 정해주세요");
    } else {
        alert("도착 지점을 정해주세요");
    }
 });
 //driving 초기화
function drivingInputReset() {
    //검색 엔터 클릭시
    document.querySelectorAll('#driving input[type=text]').forEach((e) => {
        console.log("add", e);
        e.addEventListener("keypress" ,(e) => { 
            if(e.keyCode == 13) {
                e.preventDefault();
                console.log(e.target.value);
                getSearch(e.target);
                
            }
        });
    });
 }

 //서버에 post로 데이터 요청후 받기
 function getSearch(target) {
    var searchData = target.value;
    if(searchData !== "") {
        document.querySelector(".search_info_hash").innerHTML = searchData;
        let formData = {search: searchData};
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.status === 200) {
                let resData = JSON.parse(xhr.responseText);
                console.log("===================getSearch");
                console.log(resData);
                searchAndMarker(resData)
                searchAddBlock(resData, target);
            } 
        };
        xhr.open('POST', '/post/search');
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify(formData));
    }else {
        alert("주소를 입력하세요");
    }
 }
//검색 데이터로 UI 추가 시키기
function searchAddBlock(data, target) {
    document.querySelector(".search_result").classList.add('on');
    document.querySelector(".driving_result").classList.remove('on');

    document.querySelector(".search_info_cot").innerHTML = data.length;
    var body = document.getElementById("search_result");
    // 안에 있는 요소 전부 제거 하기
    while(body.hasChildNodes()) {
        body.removeChild(body.firstChild);
    }

    data.forEach((e, index) => {
        var block = document.createElement('div');
        block.className= "block";
        var h1 = document.createElement('h1');
        h1.textContent = index + 1;
        block.appendChild(h1);
        var h2 = document.createElement('h2');
        h2.className = "roadAdd";
        h2.textContent = e.roadAddress;
        block.appendChild(h2);
        var h2 = document.createElement('h2');
        h2.className = "jibunAdd";
        h2.textContent =  e.jibunAddress;
        block.appendChild(h2);
        var p = document.createElement('h2');
        p.className = "x";
        p.textContent = e.x;
        p.style = "display:none;";
        block.appendChild(p);
        var p = document.createElement('h2');
        p.className = "y";
        p.textContent = e.y;
        p.style = "display:none;";
        block.appendChild(p);
        block.addEventListener("click", function(e)  {console.log("block 클릭"); blockClickEvent(this, target)})
        body.appendChild(block);
    });
}
function blockClickEvent(my, target) {
    let targetPar = target.parentNode;
    console.log(targetPar, target);
    console.log(my);
    let roadAdd = my.querySelector(".roadAdd").textContent;
    let x = my.querySelector(".x").textContent;
    let y = my.querySelector(".y").textContent;
    console.log(x, y);
    mapCenter(x, y);

    targetPar.querySelector("input[type=text]").value = roadAdd;
    targetPar.querySelector(".x").value = x;
    targetPar.querySelector(".y").value = y;
}


//주소 검색후 마크 표시
function searchAndMarker(data) {
    let markerPs = new Array();
    data.forEach((e) => { markerPs.push(new naver.maps.Point(e.x, e.y));});
    console.log(markerPs);
    addMarker(markerPs);
}
//길찾기 후 받은 데이터로 UI 추가 시키기
function drivingAddBlock(drivingData) {
    console.log("==========drivingAddBlock start");
    document.querySelector(".search_result").classList.remove('on');
    document.querySelector(".driving_result").classList.add('on');
    console.log(drivingData);

    let summary = drivingData[0].summary;
    let guideData = drivingData[0].guide;
    
    console.log(summary);
    let distance = summary.distance;
    let duration = summary.duration;

    let km = distance / 1000  + "km";
    let time = "";
    let m = parseInt( (duration / 1000) /60 );

    if( m > 60) {
        let h = parseInt(m / 60);
        m = m % 60;
        time = h + "시 " + m + "분";     
    }
    else { time = m + "분"}
    console.log(km, time);

    document.querySelector(".driving_info .time").innerHTML = time;
    document.querySelector(".driving_info .distance").innerHTML = km;

    drivingBlockGen(guideData);
}
//block 만들기
function drivingBlockGen(data) {
    var target = document.querySelector("#driving_result");
    while(target.hasChildNodes()) {
        target.removeChild(target.firstChild);
    }

    data.forEach(function(e, index) {
        var block = document.createElement("div");
        block.className = "block";

        var h1 = document.createElement("h1");
        h1.textContent = index + 1;
        block.appendChild(h1);
        var p = document.createElement("p");
        p.className = "guide_ins";
        p.textContent = e.instructions;
        block.appendChild(p);
        var em = document.createElement("em");
        em.className = "guide_dis";
        //km표시
        if(e.distance > 1000) {
            em.textContent = (e.distance / 1000) + "Km";
        }else {
            em.textContent = e.distance + "m";
        }
        block.appendChild(em);
        var p = document.createElement("p");
        p.className = "guide_index";
        p.textContent = e.pointIndex;
        p.style = "display: none;"
        block.appendChild(p);
        block.addEventListener("click", function(e) {
            console.log(this);
            let index = this.querySelector(".guide_index").textContent;
            let xyData = drivingSave[0].path[parseInt(index)];
            console.log(drivingSave[0].path[parseInt(index)]);
            let x = xyData[0];
            let y = xyData[1];
            console.log(x, y);
            mapCenter(x, y);
        });
        target.appendChild(block);
    });

}

//경유지 추가 버튼
document.querySelector(".btn_waypoints").addEventListener("click", (e) => {
    let maxWayPoints = 10;
    var driving = document.querySelector(".driving");
    
    if(driving.offsetHeight < 300) {
        
    }
    var wayPoints = document.querySelector(".waypoints");
    let wayNum = wayPoints.childNodes.length + 1;
    if(wayNum >= maxWayPoints) {
        alert("최대 경유지는 " + maxWayPoints +"개입니다.");
    } else {
        waypointsAddBlock(wayNum, wayPoints);
        drivingInputReset();
        if(wayNum < 3 ) {
            var wayHeight = document.querySelector(".waypoints > div:last-child").offsetHeight;   
            driving.style.minHeight  = (driving.offsetHeight + wayHeight) + "px";
            console.log(driving.offsetHeight);
        }
    } 
    
});
//waypoints에 div 블럭 생성기
function waypointsAddBlock(num, target) {
    let wayNum = "way" + num
    var block = document.createElement('div');
    block.className= wayNum;

    var label = document.createElement('label');
    label.setAttribute = ("for", wayNum);
    label.textContent = "경유지" + num;
    block.appendChild(label);
    
    var input = new Array(4);
    for(let x = 0; x < input.length; x++) {
        input[x] = document.createElement('input');
    }
    console.log("data", input);
    
    input[0].id  = wayNum;
    input[0].setAttribute("type", "text");
    input[0].setAttribute("name", wayNum);
    input[0].setAttribute("placeholder", "경유지를 검색후 선택해주세요");

    input[1].id = "btn_remove";
    input[1].setAttribute("name", "삭제버튼");
    input[1].setAttribute("type", "button");
    input[1].setAttribute("value", "X");
    input[1].addEventListener("click", (e) => {e.target.parentNode.remove();});

    input[2].id = wayNum + "-x";
    input[2].className = "x";
    input[2].setAttribute("name", wayNum + "_x");
    input[2].setAttribute("type", "hidden");

    input[3].id = wayNum + "-y";
    input[3].className = "y";
    input[3].setAttribute("name", wayNum + "_y");
    input[3].setAttribute("type", "hidden");

    input.forEach((e) => {block.appendChild(e);});
    
    target.appendChild(block);
}
//x버튼 클릭시 경유지 삭제
document.querySelectorAll('#btn_remove').forEach((e) => {
    e.addEventListener('click', (e) => {console.log(e.target.parentNode); });
});

document.getElementById('driving').addEventListener('submit', function (e) {
    console.log("submit");
});





document.querySelector(".btn_menubar").addEventListener("click", (e) => {btnMenubar()});
function btnMenubar() {
    console.log("=============btnMenubar");
    
    let btn = document.querySelector(".btn_menubar");
    let menu = document.querySelector(".menu");
    let map = document.querySelector("#map");

    console.log("btn:", btn.innerHTML);
    console.log(btn.innerHTML);

    //메뉴바 열기
    if(btn.innerHTML !== "&lt;") {
        console.log("메뉴바 열기");
        btn.innerHTML = "<";
        menu.style ="display: block";
        btn.style="";
        map.style= "";
    //메뉴바 닫기
    } else {
        console.log("메뉴바 닫기");
        btn.innerHTML = ">";
        menu.style ="display: none;";
        btn.style="left: 0px;";
        map.style= "width: 100vw;";
    }
}