function updateValue(id,value) {
    document.getElementById(id).innerHTML = value;
}
const eventSource = new EventSource("sensordata");

eventSource.addEventListener("textData", event => {
    data = JSON.parse(event.data);
    console.log(data);
    updateValue(data.id,data.payload);
});
