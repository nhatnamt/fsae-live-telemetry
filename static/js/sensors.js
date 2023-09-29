function updateValue(id, value) {
    let el = document.getElementById(id);
    el.innerHTML = value;
    el = el.parentElement.querySelector("svg rect");
    el.dataset.value = value;
}
const eventSource = new EventSource("sensordata");

eventSource.addEventListener("textData", function (event) {
    let data = JSON.parse(event.data);
    //console.log(data);
    updateValue(data.id, data.payload);
});

function barAnimationStep() {
    document.querySelectorAll(".text-data svg rect").forEach(function (el) {
        let value = el.getAttribute("x");
        if (value === null || value === "0") {
            value = el.getAttribute("width");
        }

        value = (parseFloat(value) + parseFloat(el.dataset.value)) / 2;

        if (isNaN(value)) {
            return;
        } else if (value < 0) {
            el.setAttribute("width", -value);
            el.setAttribute("x", value);
        } else {
            el.setAttribute("width", value);
            el.setAttribute("x", 0);
        }
    });

    setTimeout(window.requestAnimationFrame, 15, barAnimationStep);
}

window.requestAnimationFrame(barAnimationStep);
