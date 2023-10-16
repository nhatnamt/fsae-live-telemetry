/** @type {HTMLSelectElement} */
var select = document.getElementById("csv");
var csv_url = new URLSearchParams(window.location.search).get("data");

// Update select box to show available CSV files
fetch("data").then(function (response) {
    if (response.ok) {
        response.json().then(function (files) {
            files.forEach(function (f) {
                select.add(new Option(f, f));
            });

            select.value = csv_url;
        });
    }
});

select.onchange = function (ev) {
    //console.log(window.location.href);
    let option = ev.target.value;
    if (option) {
        option = "?data=" + option;
    }
    window.location.href = "sensors.html" + option;
}

function updateValue(id, value) {
    let el = document.getElementById(id);
    el.innerHTML = value;
    el = el.parentElement.querySelector("svg rect");
    el.dataset.value = value;
}

// Check if URL points to a CSV file
var csv_data;
if (csv_url === null) {
    // Use sensor data from web server
    const eventSource = new EventSource("sensordata");

    eventSource.addEventListener("textData", function (event) {
        let data = JSON.parse(event.data);
        //console.log(data);
        updateValue(data.id, data.payload);
    });
} else {
    // Use CSV file
    d3.csv("/data/" + csv_url).then(function (data) {
        if (data.length == 0) {
            csv_data = data;
            return;
        }

        let offset = parseFloat(data[0].timestamp);
        data.forEach(function (d) {
            // convert seconds to milliseconds
            d.timestamp = (parseFloat(d.timestamp) - offset) * 1000;
        })
        csv_data = data;
        
        // set timeouts to update page values
        csv_data.forEach(function (d) {
            setTimeout(updateValue, d.timestamp, d.id, d.payload);
        });
    });
}

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
