var testStats = {
    results: [],
    min: NaN,
    max: NaN,
    format: d3.format(".3s"),

    get count() {
        return this.results.length;
    },

    get mean() {
        return d3.mean(this.results);
    },

    get sd() {
        return d3.deviation(this.results);
    },

    get median() {
        return d3.median(this.results);
    },

    clear() {
        this.results = [];
        this.min = NaN;
        this.max = NaN;
        this.updateStats();
        testChart.setup();
    },

    push(result) {
        if (this.results.length === 0) {
            this.min = result;
            this.max = result;
        } else {
            if (result < this.min) {
                this.min = result;
            } else if (result > this.max) {
                this.max = result;
            }
        }
        this.results.push(result);
        this.updateStats();
        testChart.update();
    },

    updateStats() {
        document.getElementById("count").innerHTML = this.count;
        ["min", "max", "mean", "sd", "median"].forEach(function (prop) {
            let value = testStats[prop];
            let units = "s";
            if (isNaN(value)) {
                value = "-";
            } else {
                value = testStats.format(value);
                let lastChar = value[value.length - 1];
                while (lastChar < '0' || lastChar > '9') {
                    units = lastChar + units;
                    value = value.substring(0, value.length - 1);
                    lastChar = value[value.length - 1];
                }
            }
            let el = document.getElementById(prop);
            el.innerHTML = value;
            el.parentElement.querySelector(".units").innerHTML = units;
        });
    },
};

var testChart = {
    margin: {top: 10, right: 30, bottom: 30, left: 40},
    width: 640,
    height: 360,
    svg: document.getElementById("test-histogram"),
    xAxis: d3.select("#test-histogram"),
    yAxis: d3.select("#test-histogram"),

    get bins() {
        return d3.bin()(testStats.results);
    },

    get bars() {
        return d3.select(this.svg).selectAll("rect");
    },

    get x() { // horizontal scale
        return d3.scaleLinear()
            .domain([0, this.bins[this.bins.length - 1].x1])
            .range([this.margin.left, this.width - this.margin.right]);
    },

    get y() { // vertical scale
        return d3.scaleLinear()
            .domain([0, d3.max(this.bins, (d) => d.length)])
            .range([this.height - this.margin.bottom, this.margin.top]);
    },

    setup() {
        this.svg.innerHTML = "";
        let svg = d3.select(this.svg);

        // Create x-axis
        let scale = d3.scaleLinear().range([this.margin.left, this.width - this.margin.right]);
        this.xAxis = svg.append("g")
            .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
            .call(d3.axisBottom(scale));

        // Create y-axis
        scale = d3.scaleLinear().range([this.height - this.margin.bottom, this.margin.top]);
        this.yAxis = svg.append("g")
            .attr("transform", `translate(${this.margin.left},0)`)
            .call(d3.axisLeft(scale));

        // Create x-axis label
        svg.append("text")
            .attr("x", this.margin.left + (this.width - this.margin.left) / 2)
            .attr("y", this.height)
            .attr("text-anchor", "middle")
            .attr("fill", "currentColor")
            .attr("font-size", 12)
            .text("Delay (seconds)");

        // Create y-axis label
        svg.append("text")
            .attr("x", -this.margin.top - (this.height - this.margin.top) / 2)
            .attr("transform", "rotate(-90)")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "hanging")
            .attr("fill", "currentColor")
            .attr("font-size", 12)
            .text("Frequency");
    },

    update() {
        // Update x-axis
        this.xAxis.call(d3.axisBottom(this.x));

        // Update y-axis
        this.yAxis.call(d3.axisLeft(this.y));

        // Update bars
        let bars = this.bars.data(this.bins);
        bars.enter()
            .append("rect")
            .merge(bars)
                .attr("x", 1)
                .attr("transform", d => `translate(${this.x(d.x0)},${this.y(d.length)})`)
                .attr("width", d => this.x(d.x1) - this.x(d.x0) - 1)
                .attr("height", d => this.height - this.margin.bottom - this.y(d.length))
                .attr("fill", (_, i) => (i % 2) ? "maroon" : "red");
        bars.exit()
            .remove();
    },
};

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

var testSensor = "";

function updateValue(id, value) {
    let el = document.querySelector("#test-container .text-data");
    if (testSensor === "") {
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
var testNext = true;

eventSource.onopen = function () {
    let el = document.getElementById("test-container");
    el.querySelectorAll(".hidden").forEach(function (e) {
        e.classList.remove("hidden");
    });
    el.querySelector("p").classList.add("hidden");
    testChart.setup();
};

var sensors = new Set([""]);
var barAnimationTimeout;

eventSource.addEventListener("textData", function (event) {
    let data = JSON.parse(event.data);
    if (testSensor === data.id || (testNext && testSensor === "")) {
        updateValue(data.id, data.payload);
        if (testNext) {
            testNext = false;

            fetch("timestamp").then(function (response) {
                if (response.ok) {
                    response.text().then(function (value) {
                        testStats.push(value - data.timestamp);
                    });
                }
            });

            // TODO: check latency

            // Wait at least 1 second before checking with server again
            setTimeout(function () {
                testNext = true;
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
    testSensor = event.target.value;
    let el = document.querySelector("#test-container .text-data");
    let sensor = SENSORS[testSensor];
    if (sensor === undefined) {
        sensor = SENSORS[""];
    }
    el.querySelector("h4").innerHTML = sensor.name;
    el.querySelector(".unit").innerHTML = sensor.unit;
    el.querySelector(".value").innerHTML = 0;
    el.querySelector("svg").setAttribute("viewBox", `${sensor.min} 0 ${sensor.max - sensor.min} 1`);
    el.querySelector("svg rect").dataset.value = 0;
    testStats.clear();
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