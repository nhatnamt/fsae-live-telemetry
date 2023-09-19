function updateOne(value) {
    document.getElementById("one").innerHTML = value;
}

function updateTwo(value) {
    document.getElementById("two").innerHTML = value;
}

const eventSource = new EventSource("sensordata");

eventSource.addEventListener("one", event => {
    data = JSON.parse(event.data);
    console.log(data);
    updateOne(data.payload);
});

eventSource.addEventListener("two", event => {
    data = JSON.parse(event.data);
    console.log(data);
    updateTwo(data.payload);
});