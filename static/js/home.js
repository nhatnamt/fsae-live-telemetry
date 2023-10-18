// /** @type {HTMLSelectElement} */
// var select = document.getElementById("csv");
// var csv_url = new URLSearchParams(window.location.search).get("data");

// // Update select box to show available CSV files
// fetch("data").then(function (response) {
//     if (response.ok) {
//         response.json().then(function (files) {
//             files.forEach(function (f) {
//                 select.add(new Option(f, f));
//             });

//             if (csv_url) {
//                 select.value = csv_url;
//             }
//         });
//     }
// });

// select.onchange = function (ev) {
//     //console.log(window.location.href);
//     let option = ev.target.value;
//     if (option) {
//         option = "?data=" + option;
//     }
//     window.location.href = "sensors.html" + option;
// }

// function updateValue(id, value) {
//     let el = document.getElementById(id);
//     el.innerHTML = value;
//     el = el.parentElement.querySelector("svg rect");
//     el.dataset.value = value;
// }

// // Check if URL points to a CSV file
// var csv_data;
// if (csv_url === null) {
//     // Use sensor data from web server
//     const eventSource = new EventSource("sensordata");

//     eventSource.addEventListener("textData", function (event) {
//         let data = JSON.parse(event.data);
//         //console.log(data);
//         updateValue(data.id, data.payload);
//     });
// } else {
//     // Use CSV file
//     d3.csv("/data/" + csv_url).then(function (data) {
//         if (data.length == 0) {
//             csv_data = data;
//             return;
//         }

//         let offset = parseFloat(data[0].timestamp);
//         data.forEach(function (d) {
//             // convert seconds to milliseconds
//             d.timestamp = (parseFloat(d.timestamp) - offset) * 1000;
//         })
//         csv_data = data;
        
//         // set timeouts to update page values
//         csv_data.forEach(function (d) {
//             setTimeout(updateValue, d.timestamp, d.id, d.payload);
//         });
//     });
// }

// function barAnimationStep() {
//     document.querySelectorAll(".text-data svg rect").forEach(function (el) {
//         let value = el.getAttribute("x");
//         if (value === null || value === "0") {
//             value = el.getAttribute("width");
//         }

//         value = (parseFloat(value) + parseFloat(el.dataset.value)) / 2;

//         if (isNaN(value)) {
//             return;
//         } else if (value < 0) {
//             el.setAttribute("width", -value);
//             el.setAttribute("x", value);
//         } else {
//             el.setAttribute("width", value);
//             el.setAttribute("x", 0);
//         }
//     });
// }

// //function fetchData() {
//     // Add your code to fetch data here
//     // For example, you can use the jQuery Ajax function
//     //$.ajax({
//       //url: '/data', // Update this URL according to your Flask server
//       //type: 'GET',
//       //dataType: 'json',
//       //success: function(data) {
//         // Update the graph with the new data
//         //updateGraph(data);
//       //},
//       //error: function(error) {
//       //  console.error('Error fetching data:', error);
//       //}
//     //});
//   //}
// ///  function updateGraph(data) {
//     //const margin = { top: 20, right: 20, bottom: 30, left: 50 };
//     //const width = 800 - margin.left - margin.right;
//     //const height = 400 - margin.top - margin.bottom;
  
//     // Parse the date / time
//     //const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
  
//     //data.forEach(function(d) {
//       //d.timestamp = parseDate(d.timestamp);
//       //d.gforce1 = +d.gforce1;
//      // d.gforce2 = +d.gforce2;
//     //});
  
//     // Set the ranges
//     //const x = d3.scaleTime().range([0, width]);
//     //const y = d3.scaleLinear().range([height, 0]);
  
//     // Define the lines
//     //const valueline1 = d3.line()
//       //.x(function(d) { return x(d.timestamp); })
//       //.y(function(d) { return y(d.gforce1); });
  
//     //const valueline2 = d3.line()
//       //.x(function(d) { return x(d.timestamp); })
//      // .y(function(d) { return y(d.gforce2); });
  
//     // Clear previous SVG
//     //d3.select("#chart").html("");
  
//     // Adds the svg canvas
//    // const svg = d3.select("#chart")
//       //.append("svg")
//       //.attr("width", width + margin.left + margin.right)
//       //.attr("height", height + margin.top + margin.bottom)
//       //.append("g")
//       //.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
//     // Scale the range of the data
//     //x.domain(d3.extent(data, function(d) { return d.timestamp; }));
//    // y.domain([d3.min(data, function(d) { return Math.min(d.gforce1, d.gforce2); }),
//       //d3.max(data, function(d) { return Math.max(d.gforce1, d.gforce2); })]);
  
//     // Add the valueline path1.
//     //svg.append("path")
//       //.data([data])
//       //.attr("class", "line")
//       //.style("stroke", "steelblue")
//       //.attr("d", valueline1);
  
//     // Add the valueline path2.
//     //svg.append("path")
//       //.data([data])
//       //.attr("class", "line")
//       //.style("stroke", "red")
//       //.attr("d", valueline2);
  
//     // Add the X Axis
//     //svg.append("g")
//       //.attr("transform", "translate(0," + height + ")")
//      // .call(d3.axisBottom(x));
  
//     // Add the Y Axis
//     //svg.append("g")
//   //    .call(d3.axisLeft(y));
  
  
//   //etchData();
//  // setInterval(fetchData, 5000);
  
//  setInterval(window.requestAnimationFrame, 15, barAnimationStep);
