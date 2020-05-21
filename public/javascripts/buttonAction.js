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
                let data = JSON.parse(xhr.responseText);
                console.log(data);
                drawRoad(data[0].path, data[0].guide);
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
            search_reload(resData);
        } 
    };
    xhr.open('POST', '/post/search');
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(formData));
 });
 //검색 후 주소 표시
 function search_reload(data) {
    var tbody = document.querySelector('.search-result');
    tbody.innerHTML = '';
    data.map(function(e) {
        var row = document.createElement('tr');
        row.addEventListener('click', function() {
            //- getComment(user.id);
        });
        var td = document.createElement('td');
        td.textContent = e.roadAddress;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = e.jibunAddress;
        row.appendChild(td);
        td = document.createElement('td');
        td.setAttribute('class', 'pos x');
        td.textContent = e.x;
        row.appendChild(td);
        td = document.createElement('td');
        td.setAttribute('class', 'pos y');
        td.textContent = e.y
        row.appendChild(td);
        var btn = document.createElement("input");
        btn.addEventListener('click', function() {
            setStartEnd("start", e.roadAddress, e.jibunAddress, e.x, e.y);
        });
        btn.type = "button";
        btn.className = "btn-start";
        btn.value = "출발지점"
        row.appendChild(btn);
        var btn = document.createElement("input");
        btn.addEventListener('click', function() {
            setStartEnd("goal", e.roadAddress, e.jibunAddress, e.x, e.y);
        });
        btn.type = "button";
        btn.className = "btn-goal";
        btn.value = "도착지점"
        row.appendChild(btn);
        tbody.appendChild(row); 
    });
 };
 //출발 지점, 끝나는 지점 설정
 function setStartEnd(sel, address1, address2, x, y){
    let input_txt = document.querySelector(`#${sel}`);
    let input_x = document.querySelector(`#${sel}-x`);
    let input_y = document.querySelector(`#${sel}-y`);
    
    input_x.value = x;
    input_y.value = y;
    input_txt.value = address1;
 }