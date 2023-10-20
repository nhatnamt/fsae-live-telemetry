var gForceGraph = document.getElementById('gforce-graph');
var suspensionGraph = document.getElementById('suspension-graph');
var steeringGraph = document.getElementById('steering-graph');
var pedalGraph = document.getElementById('pedal-graph');

var graphConfig = {
    displayModeBar: false,
    responsive: true,
  };

/* -------------------------------------------------------------------------- */
/*                                 Graph data                                 */
/* -------------------------------------------------------------------------- */
var gForceTrace = {
    x: [],
    y: [],
    type: 'scatter',
    mode: 'lines',
    line: {
        color: '#ff0000',
        width: 2
    }
};
var suspensionTrace = {
    x: [],
    y: [],
    name: "Suspension travel",
    mode: "lines+markers",
    type: "line",
};

var steeringTrace = {
    x: [],
    y: [],
    name: "Steering angle",
    mode: "lines+markers",
    type: "line",
};

var pedalTrace = {
    x: [],
    y: [],
    name: "Pedal position",
    mode: "lines+markers",
    type: "line",
};

/* -------------------------------------------------------------------------- */
/*                                   Layout                                   */
/* -------------------------------------------------------------------------- */
var backgroudColor = '#333';
var margin = {
    l: 70,
    r: 50,
    b: 80,
    t: 50,
    pad: 4
};
var gridColor = '#3e3e3e';
var zerolineColor = '#666';

var gForceLayout = {
    title: 'G-force',
    xaxis: {
        title: 'Latitudinal acceleration (G)',
        range: [-2, 2],
        automargin: true,
        gridcolor: gridColor,
        zerolinecolor: zerolineColor,
    },
    yaxis: {
        title: 'Longitudinal acceleration (G)',
        range: [-2, 2],
        automargin: true,
        gridcolor: gridColor,
        zerolinecolor: zerolineColor,
    },
    margin: margin,
    paper_bgcolor: backgroudColor,
    plot_bgcolor: backgroudColor,
    font: {
        size: 14,
        color: '#fff'
    }
};

var suspensionLayout = {
    autosize: true,
    title: {
      text: "Suspenson Travel",
    },
    xaxis: {
        title: 'Time (s)',
        automargin: true,
        zeroline: false,
        gridcolor: gridColor,
        zerolinecolor: zerolineColor,
    },
    yaxis: {
        title: 'Travel (mm)',
        range: [-100, 200],
        automargin: true,
        gridcolor: gridColor,
        zerolinecolor: zerolineColor,
    },
    paper_bgcolor: backgroudColor,
    plot_bgcolor: backgroudColor,
    font: {
      size: 14,
      color: "#fff",
    },
    colorway: ["#00008B"],
    margin: margin,
};

var steeringLayout = {
    autosize: true,
    title: {
      text: "Steering Angle",
    },
    xaxis: {
        title: 'Time (s)',
        automargin: true,
        zeroline: false,
        gridcolor: gridColor,
        zerolinecolor: zerolineColor,
    },
    yaxis: {
        title: 'Angle (deg)',
        range: [-100, 100],
        automargin: true,
        gridcolor: gridColor,
        zerolinecolor: zerolineColor,
    },
    paper_bgcolor: backgroudColor,
    plot_bgcolor: backgroudColor,
    font: {
      size: 14,
      color: "#fff",
    },
    colorway: ["#00008B"],
    margin: margin,
};

var pedalLayout = {
    autosize: true,
    title: {
      text: "Pedal Position",
    },
    xaxis: {
        title: 'Time (s)',
        automargin: true,   
        zeroline: false,
        gridcolor: gridColor,
        zerolinecolor: zerolineColor,
    },
    yaxis: {
        title: 'Position (%)',
        range: [0, 100],
        automargin: true,
        gridcolor: gridColor,
        zerolinecolor: zerolineColor,
    },
    paper_bgcolor: backgroudColor,
    plot_bgcolor: backgroudColor,
    font: {
      size: 14,
      color: "#fff",
    },
    colorway: ["#00008B"],
    margin: margin,
};

Plotly.newPlot(
gForceGraph,
[gForceTrace],
gForceLayout,
graphConfig
);

Plotly.newPlot(
    suspensionGraph,
    [suspensionTrace],
    suspensionLayout,
    graphConfig
);

Plotly.newPlot(
    steeringGraph,
    [steeringTrace],
    steeringLayout,
    graphConfig
);

Plotly.newPlot(
    pedalGraph,
    [pedalTrace],
    pedalLayout,
    graphConfig
);

/* -------------------------------------------------------------------------- */
/*                                  Get data                                  */
/* -------------------------------------------------------------------------- */
let steeringXArray = [];
let steeringYArray = [];

// The maximum number of data points displayed on scatter/line graph
let MAX_GRAPH_POINTS = 50;
let ctr = 0;
function updateCharts(lineChartDiv, xArray, yArray, sensorRead) {
    var today = new Date();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    if (xArray.length >= MAX_GRAPH_POINTS) {
      xArray.shift();
    }
    if (yArray.length >= MAX_GRAPH_POINTS) {
      yArray.shift();
    }
    xArray.push(ctr++);
    yArray.push(sensorRead);
  
    var data_update = {
      x: [xArray],
      y: [yArray],
    };
  
    Plotly.update(lineChartDiv, data_update);
  }

// Check if URL points to a CSV file
var csv_data;
var csv_url = new URLSearchParams(window.location.search).get("data");
if (csv_url === null) {
    // Use sensor data from web server
    const eventSource = new EventSource("sensordata");

    eventSource.addEventListener("textData", function (event) {
        let data = JSON.parse(event.data);
        if (data.id == 'steering_angle') {
            updateCharts(steeringGraph, steeringXArray, steeringYArray, data.payload);
        }
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