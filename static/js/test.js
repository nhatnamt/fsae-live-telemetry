function Sensor(event, id, name, unit, min, max) {
    var obj = {
        event: event,
        id: id,
        name: name,
        unit: unit,
        min: min,
        max: max
    };
    return obj;
}

/** @type {Object.<string, {event: string, id: string, name: string, unit: string, min: number, max: number}}>} */
const SENSORS = {
    "": Sensor("", "", "Sensor Name", "Units", 0, 100),
    "FL_temp": Sensor("textData", "FL_temp", "Front Left Motor Temperature", "°C", 10, 120),
    "FR_temp": Sensor("textData", "FR_temp", "Front Right Motor Temperature", "°C", 10, 120),
    "RL_temp": Sensor("textData", "RL_temp", "Rear Left Motor Temperature", "°C", 10, 120),
    "RR_temp": Sensor("textData", "RR_temp", "Rear Right Motor Temperature", "°C", 10, 120),
    "FL_torque": Sensor("textData", "FL_torque", "Front Left Motor Torque", "Nm", -10, 21),
    "FR_torque": Sensor("textData", "FR_torque", "Front Right Motor Torque", "Nm", -10, 21),
    "RL_torque": Sensor("textData", "RL_torque", "Rear Left Motor Torque", "Nm", -10, 21),
    "RR_torque": Sensor("textData", "RR_torque", "Rear Right Motor Torque", "Nm", -10, 21),
    "FL_rpm": Sensor("textData", "FL_rpm", "Front Left Motor RPM", "RPM", 0, 20000),
    "FR_rpm": Sensor("textData", "FR_rpm", "Front Right Motor RPM", "RPM", 0, 20000),
    "RL_rpm": Sensor("textData", "RL_rpm", "Rear Left Motor RPM", "RPM", 0, 20000),
    "RR_rpm": Sensor("textData", "RR_rpm", "Rear Right Motor RPM", "RPM", 0, 20000),
    "left_coolant_temp": Sensor("textData", "left_coolant_temp", "Left Loop Temperature", "°C", 5, 50),
    "right_coolant_temp": Sensor("textData", "right_coolant_temp", "Right Loop Temperature", "°C", 5, 50),
    "rear_coolant_temp": Sensor("textData", "rear_coolant_temp", "Rear Loop Temperature", "°C", 5, 50),
    "cell_max_voltage": Sensor("textData", "cell_max_voltage", "Cell max voltage", "V", 3.0, 4.2),
    "cell_min_voltage": Sensor("textData", "cell_min_voltage", "Cell min voltage", "V", 3.0, 4.2),
    "pack_voltage": Sensor("textData", "pack_voltage", "Pack voltage", "V", 435, 600),
    "pack_power": Sensor("textData", "pack_power", "Pack power", "W", 0, 80),
    "current_temp": Sensor("textData", "current_temp", "Current Temperature", "°C", 10, 120),
    "lv_battery": Sensor("textData", "lv_battery", "LV Battery", "V", 22.5, 28.0),
};

var test_sensor = "";

function updateValue(id, value) {
    let el = document.querySelector("#test-container .text-data");
    if (test_sensor === "") {
        let sensor = SENSORS[id];
        if (sensor === undefined) {
            el.querySelector("h4").innerHTML = id;
            el.querySelector(".unit").innerHTML = "Units";
            el.querySelector(".value").innerHTML = value;
            value = 100 * (value - sensor.min) / (sensor.max - sensor.min);
        } else {
            el.querySelector("h4").innerHTML = sensor.name;
            el.querySelector(".unit").innerHTML = sensor.unit;
            el.querySelector(".value").innerHTML = value;
        }
    } else {
        el.querySelector(".value").innerHTML = value;
    }
    el.querySelector("svg rect").dataset.value = value;
}

// Use sensor data from web server
const eventSource = new EventSource("sensordata");
var test_next = true;

eventSource.onopen = function () {
    let el = document.getElementById("test-container");
    el.querySelectorAll(".hidden").forEach(function (e) {
        e.classList.remove("hidden");
    });
    el.querySelector("p").classList.add("hidden");
};

var sensors = new Set([""]);
var barAnimationTimeout;

eventSource.addEventListener("textData", function (event) {
    let data = JSON.parse(event.data);
    if (test_sensor === data.id || (test_next && test_sensor === "")) {
        updateValue(data.id, data.payload);
        if (test_next) {
            test_next = false;

            // TODO: get time from server to check latency
            
            // Wait at least 1 second before checking with server again
            setTimeout(function () {
                test_next = true;
            }, 1000);
            //console.log(event);
        }
    }

    if (!sensors.has(data.id)) {
        sensors.add(data.id);
        let sensor = SENSORS[data.id];
        if (sensor === undefined) {
            document.getElementById("test-select").add(new Option(data.id, data.id));
        } else {
            document.getElementById("test-select").add(new Option(sensor.name, data.id));
        }
    }
});

// Reset Latency Test when sensor is changed
document.getElementById("test-select").onchange = function (event) {
    test_sensor = event.target.value;
    let el = document.querySelector("#test-container .text-data");
    let sensor = SENSORS[test_sensor];
    if (sensor === undefined) {
        sensor = SENSORS[""];
    }
    el.querySelector("h4").innerHTML = sensor.name;
    el.querySelector(".unit").innerHTML = sensor.unit;
    el.querySelector(".value").innerHTML = 0;
    el.querySelector("svg").setAttribute("viewBox", `${sensor.min} 0 ${sensor.max - sensor.min} 1`);
    el.querySelector("svg rect").dataset.value = 0;

}

/*
 * Bar animation
 */
function barAnimationStep() {
    let el = document.querySelector(".text-data svg rect");
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
}

setInterval(window.requestAnimationFrame, 15, barAnimationStep);