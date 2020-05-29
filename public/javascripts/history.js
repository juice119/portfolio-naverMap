document.querySelectorAll("#search-list>div").forEach((element, index) => {
    console.log(element);
    element.addEventListener("click", (e) => { btnAction(element); });
});;
function btnAction(me) {
    let formData = {id: me.querySelector("input[name=id]").value};

    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if(xhr.status === 200) {
            console.log("==========getDrivingData");
            let data = JSON.parse(xhr.responseText);
            console.log(data);
            resultGen(data);
        } else {
            console.log(xhr.responseText);
        }
    };

    xhr.open('POST', '/post/history');
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(formData));
}

function resultGen(data) {
    let result = document.querySelector("#search-result");
    console.log(data[Object.keys(data)[0]]);
    result.innerHTML = "";
    data["detailpath"].guide.split(',').forEach(e => {
        
        result.innerHTML += e + "<br>";
    });
}