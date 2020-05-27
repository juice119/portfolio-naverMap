let drivingSave;
let testData;
//길찾기 버튼 클릭시
document.getElementById('driving').addEventListener('submit', function (e) {
    console.log("================경로 버튼 클릭 이벤트");
    e.preventDefault();
    let form = e.target;
    console.log(form);
    testData = form;
    if(form.start.value !== "" && form.goal.value !== "") {
        let formData = {
            start_name: form.start.value,
            start: form.start_x.value + "," + form.start_y.value,
            goal_name: form.goal.value,
            goal: form.goal_x.value + "," + form.goal_y.value,  
            option: form.option.value,
        };
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
 //검색 버튼 클릭시
 document.querySelector('.btn-search').addEventListener('click', () => { getSearch(); });
 document.querySelector('.text-search').addEventListener("keypress" ,(e) => { if(e.keyCode == 13) {getSearch()} });

 function getSearch() {
    var searchData = document.querySelector('.text-search').value;
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
                searchAddBlock(resData);
            } 
        };
        xhr.open('POST', '/post/search');
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.send(JSON.stringify(formData));
    }else {
        alert("주소를 입력하세요");
    }
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

//검색 데이터로 UI 추가 시키기
function searchAddBlock(data) {
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
        block.appendChild(btnGroupGen());
        block.addEventListener("click", function(e)  {console.log("block 클릭"); blockClickEvent(this)})
        body.appendChild(block);
    });
}
function blockClickEvent(my) {
    console.log(my);
    let x = my.querySelector(".x").textContent;
    let y = my.querySelector(".y").textContent;
    console.log(x, y);
    mapCenter(x, y);
}

//버튼 그룹 생성
function btnGroupGen() {
    //버튼 그룹
    var btnGroup = document.createElement('div');
    var input = document.createElement('input');
    input.type = "button";
    input.value ="출발지";
    input.className = "start_btn";
    btnGroup.appendChild(input);
    input.addEventListener("click", function(e) {btnGroupFunc("start", this);});
    var input = document.createElement('input');
    input.type = "button";
    input.value ="도착지";
    input.className = "goal_btn";
    input.addEventListener("click", function(e) {btnGroupFunc("goal", this);});
    btnGroup.appendChild(input);

    return btnGroup;
}
function btnGroupFunc(select, me) {
    console.log(select, me);
    me = me.parentNode.parentNode;
    var destination;

    if(select === "start") {
        destination = document.querySelector(".start");
    }else {
        destination = document.querySelector(".end");
    }

    let x = me.querySelector(".x").textContent;
    let y = me.querySelector(".y").textContent;
    let text = me.querySelector(".roadAdd").textContent;
    
    destination.querySelector("input").value = text;
    destination.querySelector(".x").value = x;
    destination.querySelector(".y").value = y;
}



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