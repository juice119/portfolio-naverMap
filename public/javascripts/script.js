let drivingSave;

drivingInputReset();
historyButtonPositionReset();
//#driving안에 있는 input영역에 Enter 입력시 수행할 이벤트 연결
function historyButtonPositionReset() {
    var historyButton = document.querySelector("#history");
    var menuBar = document.querySelector(".menu");
    console.log(menuBar);
    console.log(historyButton.style);
    historyButton.style.left = menuBar.offsetWidth + "px" ;
}

function drivingInputReset() {
   document.querySelectorAll('#driving input[type=text]').forEach((e) => {
       //검색 엔터 클릭시
       console.log("add", e);
       e.addEventListener("keypress" ,(e) => { 
           if(e.keyCode == 13) {
               e.preventDefault();
               console.log(e.target.value);
               searchFun(e.target);
           }
       });
   });
}

//주소 검색후 마크 표시
function searchAndMarker(sp_dt, gc_dt) {
    let gc_xy = new Array();
    gc_dt.result.forEach(e => {
        gc_xy.push([e.x, e.y]);
    });
    let sp_xy = new Array();
    sp_dt.result.forEach(e => {
        sp_xy.push([e.x, e.y]);
    });
    addImgMarker(gc_xy, sp_xy);

    if(gc_xy.length > 0) {
        setCenter(gc_xy[0][1], gc_xy[0][0]);
    } else {
        setCenter(sp_xy[0][1], sp_xy[0][0]);
    }
    
}

// 경로탐색 버튼 클릭시===============================================================
document.getElementById('driving').addEventListener('submit', function (e) {
    console.log("================경로 버튼 클릭 이벤트");
    e.preventDefault();
    var wayPoints = document.querySelector(".waypoints");
    let wayNum = wayPoints.childNodes.length + 1;

    let form = e.target;
    let wayData = "";
    let wayName = "";

    for(let i = 1; i < wayNum; i++) {
        let way = "way" + i;
        let data = "";
        console.log("way" + i);
        console.log(form[way].value);

        data = form[way + "_x"].value + "," + form[way + "_y"].value;
        console.log(data);
        if(i != 1 && i != wayNum) {
            wayData += "|";
            wayName += ",";
        }
        wayData += data;
        wayName += form[way].value;
    }
    
    testData = form;
    if(form.start.value !== "" && form.goal.value !== "") {
        let formData = {
            start_name: form.start.value,
            start: form.start_x.value + "," + form.start_y.value,
            goal_name: form.goal.value,
            goal: form.goal_x.value + "," + form.goal_y.value,  
            option: form.option.value,
            way_name: wayName,
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
                drawRoad(myData[0].path, myData[0].guide, myData[0].summary.waypoints);
            } else {
                console.log(xhr.responseText);
                window.location.replace("https://www.yeolju.com/");
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
            setCenter(y, x);
        });
        target.appendChild(block);
    });

}

//출발지, 도착지, 경유지에서 Enter 클릭후 검색할때======================================
//drivingInputReset으로 경유지를 추가할때와 처음시작시에 실행되는 함수에서 이벤트가 적용된다.
function searchFun(inputTarget) {
    document.querySelectorAll(".search_info_hash").forEach(qs => {qs.innerHTML = inputTarget.value;});
    daumAPI_searchPlaces(inputTarget, (sp_dt, gc_dt) => {
        console.log("=========daumAPI_searchPlaces데이터");
        console.log(sp_dt, gc_dt);
        
        searchAddBlock(sp_dt, gc_dt, inputTarget);
        searchAndMarker(sp_dt, gc_dt);
    });
}
function searchAddBlock(sp_dt, gc_dt, inputTarget) {
    //주소 검색 결과 레이아웃 ON 시키고 / 길찾기 검색 결과 레이아웃 OFF 시키기 
    document.querySelector(".search_result").classList.add('on');
    document.querySelector(".driving_result").classList.remove('on');

    //검색 갯수 넣기
    document.querySelector(".search_gc .search_info_cot").innerHTML = gc_dt.result.length;
    document.querySelector(".search_sp .search_info_cot").innerHTML = sp_dt.result.length;

    let gc_target = document.querySelector("#result_gc");
    let sp_target = document.querySelector("#result_sp");
    clearChild(gc_target);
    clearChild(sp_target);
    

    console.log(gc_target, sp_target);
    
    if(sp_dt.status === "OK") {
        console.log("SearchPlace 데이터 block에 넣기");
        sp_dt.result.forEach((e, index) => {
            let block = document.createElement("block");
            block.className = "block";
            block.addEventListener("click", function(blockE)  {console.log("block 클릭"); blockClickEvent(this, inputTarget)});
            block.innerHTML = ` 
                    <h1>${index + 1}</h1>
                    <h2 class="place_name name">${e.place_name}<h2>
                    <h2 class="roadAdd">${e.road_address_name}</h2>
                    <h2 class="jibunAdd">${e.address_name}</h2>
                    <h2 class="x" style="display: none;">${e.x}</h2>
                    <h2 class="y" style="display: none;">${e.y}</h2>
                `;
            sp_target.append(block);
        });
    }
    if(gc_dt.status === "OK") {
        console.log("Gecoder 데이터 block에 넣기");
        gc_dt.result.forEach((e, index) => {
            let block = document.createElement("block");
            let building_name = e.road_address !== null ? e.road_address.building_name : "";
            let road_address_name = e.road_address !== null ? e.road_address.address_name : "";
            block.className = "block";
            block.addEventListener("click", function(blockE)  {console.log("block 클릭"); blockClickEvent(this, inputTarget)});
            block.innerHTML = ` 
                    <h1>${index + 1}</h1>
                    <h2 class="building_name name">${building_name}</h2>
                    <h2 class="roadAdd">${road_address_name}</h2>
                    <h2 class="jibunAdd">${e.address_name}</h2>
                    <h2 class="x" style="display: none;">${e.x}</h2>
                    <h2 class="y" style="display: none;">${e.y}</h2>
                `;
            gc_target.appendChild(block);
        });
    }
}
//.block 클릭 이벤트
// my 는 버튼 클릭시 이벤트{무슨 버튼을 클릭했는지 식별 및 해당 블럭에 데이터를 가져올때 사용}
// inputTarget 검색한 input 영역 값이며 searchFun -> SearchAddBlock으로 가져온다
function blockClickEvent(my, inputTarget) {
    let targetPar = inputTarget.parentNode;

    let name = my.querySelector(".name").textContent;
    let x = my.querySelector(".x").textContent;
    let y = my.querySelector(".y").textContent;
    console.log(x, y);
    setCenter(y, x);

    targetPar.querySelector("input[type=text]").value = name;
    targetPar.querySelector(".x").value = x;
    targetPar.querySelector(".y").value = y;
}

//경유지 추가 버튼 클릭시=================================================================================================
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

//login창 보여주기
function showLogin() {
    let login = document.querySelector("#layer_login");
    console.log(login.style.display);
    if(login.style.display) {
        login.style='';
    }else {
        login.style='display:block;';
    }
}
//메뉴바 열고 닫기
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
//자식 노드 전부 제거 하기
function clearChild(target) {
    //자식 요소 전부 제거
    while(target.hasChildNodes()) {
        target.removeChild(target.firstChild);
    }
}