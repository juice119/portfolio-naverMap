let drivingSave;
//길찾기 버튼 클릭시
document.getElementById('driving').addEventListener('submit', function (e) {
    e.preventDefault();
    let form = e.target;
    if(form.start.value !== "" && form.goal.value !== "") {
        let formData = {
            start_name: form.start.value,
            start: form.start_x.value + "," + form.start_y.value,
            goal_name: form.goal.value,
            goal: form.goal_x.value + "," + form.goal_y.value,  
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
 document.querySelector('.btn-search').addEventListener('click', () => {
    var searchData = document.querySelector('.text-search').value;
    let formData = {search: searchData};
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.status === 200) {
            let resData = JSON.parse(xhr.responseText);
            console.log("검색성공");
            console.log(resData);
            searchAddBlock(resData);
        } 
    };
    xhr.open('POST', '/post/search');
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(formData));
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
        body.appendChild(block);
    });
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
