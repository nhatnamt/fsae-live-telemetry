function updateValue(id, value) {
    let el = document.getElementById(id);
    el.innerHTML = value;
    el = el.parentElement.getElementsByTagName("svg")[0].firstElementChild;
    if (value < 0) {
        el.setAttribute("width", -value);
        el.setAttribute("x", value);
    } else {
        el.setAttribute("width", value);
        el.setAttribute("x", 0);
    }
}
const eventSource = new EventSource("sensordata");

eventSource.addEventListener("textData", function (event) {
    data = JSON.parse(event.data);
    //console.log(data);
    updateValue(data.id, data.payload);
});
