var gForceGraph = document.getElementById('gforce-graph');
var suspensionGraph = document.getElementById('suspension-graph');
var steeringGraph = document.getElementById('steering-graph');
var pedalGraph = document.getElementById('pedal-graph');

var graphConfig = {
    displayModeBar: false,
    responsive: true,
    staticPlot: true
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
        color: '#444',
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
    graphConfig,
    
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

let gForceXxArray = [];
let gForceXyArray = [];
let gForceYxArray = [];
let gForceYyArray = [];

// The maximum number of data points displayed on scatter/line graph
let MAX_GRAPH_POINTS = 50;
let ctr = 0;
function updateCharts(xArray, yArray, sensorRead) {
    var today = new Date();
    // var time =
    //   today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    if (xArray.length >= MAX_GRAPH_POINTS) {
      xArray.shift();
    }
    if (yArray.length >= MAX_GRAPH_POINTS) {
      yArray.shift();
    }
    xArray.push((ctr++)*0.1);
    yArray.push(sensorRead);
  
    var data_update = {
      x: [xArray],
      y: [yArray],
    };

    return data_update;
  }
var steeringData;
var throttleData;
var brakeData;
var FL_suspensionData;
var FR_suspensionData;
var RL_suspensionData;
var RR_suspensionData;
var gForceXData;
var gForceYData;

// Check if URL points to a CSV file
var csv_data;
var csv_url = new URLSearchParams(window.location.search).get("data");
if (csv_url === null) {
    // Use sensor data from web server
    const eventSource = new EventSource("sensordata");

    eventSource.addEventListener("textData", function (event) {
        let data = JSON.parse(event.data);
        if (data.id == 'steering_angle') {
            steeringData = updateCharts(steeringXArray, steeringYArray, data.payload);
        }
        if (data.id == 'throttle_pos') {
            throttleData = updateCharts(throttleXArray, throttleYArray, data.payload);
        }
        if (data.id == 'brake_pos') {
            brakeData = updateCharts(brakeXArray, brakeYArray, data.payload);
        }
        if (data.id == 'FL_suspension') {
            FL_suspensionData = updateCharts(FL_suspensionXArray, FL_suspensionYArray, data.payload);
        }
        if (data.id == 'FR_suspension') {
            FR_suspensionData = updateCharts(FR_suspensionXArray, FR_suspensionYArray, data.payload);
        }
        if (data.id == 'RL_suspension') {
            RL_suspensionData = updateCharts(RL_suspensionXArray, RL_suspensionYArray, data.payload);
        }
        if (data.id == 'RR_suspension') {
            RR_suspensionData = updateCharts(RR_suspensionXArray, RR_suspensionYArray, data.payload);
        }
        if (data.id == 'gforce_x') {
            gForceXData = updateCharts(gForceXxArray, gForceXyArray, data.payload);
        }
        if (data.id == 'gforce_y') {
            gForceYData = updateCharts(gForceYxArray, gForceYyArray, data.payload);
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
var scatterColors = new Array(MAX_GRAPH_POINTS).fill('#aaa');
scatterColors[49] = '#f00';

function updateAllGraphs() {
    Plotly.update(steeringGraph, steeringData);
    Plotly.update(pedalGraph, throttleData, {}, [0]);
    Plotly.update(pedalGraph, brakeData, {}, [1]);
    Plotly.update(suspensionGraph, FL_suspensionData, {}, [0]);
    Plotly.update(suspensionGraph, FR_suspensionData, {}, [1]);
    Plotly.update(suspensionGraph, RL_suspensionData, {}, [2]);
    Plotly.update(suspensionGraph, RR_suspensionData, {}, [3]);

    console.log(gForceXxArray);
    var gForceData = {
        x: gForceXData.y,
        y: gForceYData.y,
      };
    
    //console.log(gForceData);
    Plotly.update(gForceGraph, gForceData);
    var update = {'marker':{color: scatterColors, size: 10}};
    Plotly.restyle(gForceGraph, update, [0]);
  
}

setInterval(updateAllGraphs, 100);