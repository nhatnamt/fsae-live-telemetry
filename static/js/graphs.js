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
    mode: 'markers',
    line: {
        color: '#ff0000',
        width: 2
    }
};

var FL_suspensionTrace = {
    x: [],
    y: [],
    name: "Front Left",
    mode: "lines",
    type: "line",
    line: {
        color: '#fff',
        width: 1
    }
};

var FR_suspensionTrace = {
    x: [],
    y: [],
    name: "Front Right",
    mode: "lines",
    type: "line",
    line: {
        color: '#f00',
        width: 1
    }
}

var RL_suspensionTrace = {
    x: [],
    y: [],
    name: "Rear Left",
    mode: "lines",
    type: "line",
    line: {
        color: '#0f0',
        width: 1
    }
}

var RR_suspensionTrace = {
    x: [],
    y: [],
    name: "Rear Right",
    mode: "lines",
    type: "line",
    line: {
        color: '#00f',
        width: 1
    }
}

var steeringTrace = {
    x: [],
    y: [],
    name: "Steering angle",
    mode: "lines",
    type: "scatter",
    line: {
        color: '#f0f0f0',
        width: 2
    }
};

var throttleTrace = {
    x: [],
    y: [],
    name: "Throttle position",
    mode: "lines",
    type: "line",
    line: {
        color: '#00ff00',
        width: 1
    }

};
var brakeTrace = {
    x: [],
    y: [],
    name: "Brake position",
    mode: "lines",
    type: "line",
    line: {
        color: '#ff0000',
        width: 1
    }
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
        range: [-100, 150],
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
    [FL_suspensionTrace, FR_suspensionTrace, RL_suspensionTrace, RR_suspensionTrace],
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
    [throttleTrace, brakeTrace],
    pedalLayout,
    graphConfig
);

/* -------------------------------------------------------------------------- */
/*                                  Get data                                  */
/* -------------------------------------------------------------------------- */
let steeringXArray = [];
let steeringYArray = [];

let throttleXArray = [];
let throttleYArray = [];

let brakeXArray = [];
let brakeYArray = [];

let FL_suspensionXArray = [];
let FL_suspensionYArray = [];
let FR_suspensionXArray = [];
let FR_suspensionYArray = [];
let RL_suspensionXArray = [];
let RL_suspensionYArray = [];
let RR_suspensionXArray = [];
let RR_suspensionYArray = [];

// The maximum number of data points displayed on scatter/line graph
let MAX_GRAPH_POINTS = 50;
let ctr = 0;
function updateCharts(xArray, yArray, sensorRead) {
    var today = new Date();
    var time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    if (xArray.length >= MAX_GRAPH_POINTS) {
      xArray.shift();
    }
    if (yArray.length >= MAX_GRAPH_POINTS) {
      yArray.shift();
    }
    xArray.push((ctr++)*0.05);
    yArray.push(sensorRead);
  
    var data_update = {
      x: [xArray],
      y: [yArray],
    };

    return data_update;
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
            dataUpdate = updateCharts(steeringXArray, steeringYArray, data.payload);
            Plotly.update(steeringGraph, dataUpdate);
        }
        if (data.id == 'throttle_pos') {
            dataUpdate = updateCharts(throttleXArray, throttleYArray, data.payload);
            Plotly.update(pedalGraph, dataUpdate, {}, [0]);
        }
        if (data.id == 'brake_pos') {
            dataUpdate = updateCharts(brakeXArray, brakeYArray, data.payload);
            Plotly.update(pedalGraph, dataUpdate, {}, [1]);
        }
        if (data.id == 'FL_suspension') {
            dataUpdate = updateCharts(FL_suspensionXArray, FL_suspensionYArray, data.payload);
            Plotly.update(suspensionGraph, dataUpdate, {}, [0]);
        }
        if (data.id == 'FR_suspension') {
            dataUpdate = updateCharts(FR_suspensionXArray, FR_suspensionYArray, data.payload);
            Plotly.update(suspensionGraph, dataUpdate, {}, [1]);
        }
        if (data.id == 'RL_suspension') {
            dataUpdate = updateCharts(RL_suspensionXArray, RL_suspensionYArray, data.payload);
            Plotly.update(suspensionGraph, dataUpdate, {}, [2]);
        }
        if (data.id == 'RR_suspension') {
            dataUpdate = updateCharts(RR_suspensionXArray, RR_suspensionYArray, data.payload);
            Plotly.update(suspensionGraph, dataUpdate, {}, [3]);
        }

        // if (data.id == 'brake_pos') {
        //     dataUpdate = updateCharts(brakeXArray, brakeYArray, data.payload);
        //     Plotly.update(pedalGraph, dataUpdate, [1]);
        // }
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