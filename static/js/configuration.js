// Initialize a variable to store configuration data
var configuration;

// Get the current configuration from the URL or the dropdown
var current_config = new URLSearchParams(window.location.search).get("configuration");
if (current_config === null) {
    current_config = document.getElementById("configuration").value;
}

// Function to update the form based on the selected configuration
function update_form() {
    // Retrieve the configuration data for the current configuration
    var config = configuration[current_config];
    
    // Get the form element by its ID
    var form = document.getElementById("config-form");
    
    // Loop through input fields in table cells and set their values from the configuration
    form.querySelectorAll("td input").forEach(function (el) {
        el.value = config[el.name];
    });
    
    // Update the selected configuration in the dropdown
    document.getElementById("configuration").value = current_config;
}

// Attach an event listener to the "configuration" dropdown to update the form when it changes
document.getElementById("configuration").onchange = function (ev) {
    current_config = ev.target.value;
    update_form();
};

// Attach an event listener to the form's reset action to update the form
// (Note: Returning false prevents the default reset behavior)
document.getElementById("config-form").onreset = function (ev) {
    update_form();
    return false; // Prevent the default reset behavior
};

// Retrieve the mode toggle element
var modeToggle = document.getElementById("mode-toggle");

// Retrieve the body element
var body = document.body;

// Function to toggle dark mode
function toggleDarkMode() {
    if (modeToggle.checked) {
        body.classList.add("dark-mode");
    } else {
        body.classList.remove("dark-mode");
    }
}

// Attach an event listener to the mode toggle input to handle dark mode toggling
modeToggle.addEventListener("change", toggleDarkMode);

// Check the user's local storage preference and set the mode accordingly
if (localStorage.getItem("dark-mode") === "enabled") {
    modeToggle.checked = true;
    toggleDarkMode();
}

// Function to save the user's mode preference to local storage
function saveModePreference() {
    if (modeToggle.checked) {
        localStorage.setItem("dark-mode", "enabled");
    } else {
        localStorage.setItem("dark-mode", "disabled");
    }
}

// Attach an event listener to the form submission to save mode preference
var configForm = document.getElementById("config-form");
configForm.addEventListener("submit", saveModePreference);

// Fetch configuration data from an endpoint and update the form when the data is available
fetch("configuration").then(function (response) {
    if (response.ok) {
        response.json().then(function (value) {
            configuration = value;
            update_form();
        });
    }
});
