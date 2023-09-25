var configuration;

var current_config = new URLSearchParams(window.location.search).get("configuration");
if (current_config === null) {
    current_config = document.getElementById("configuration").value;
}

function update_form() {
    config = configuration[current_config];
    let form = document.getElementById("config-form");
    form.querySelectorAll("td input").forEach((el) => {
        el.value = config[el.name];
    });
    //form.reset();
    document.getElementById("configuration").value = current_config;
}

document.getElementById("configuration").onchange = (ev) => {
    current_config = ev.target.value;
    update_form();
};

document.getElementById("config-form").onreset = (ev) => {
    update_form();
    return false; // done with reset
}

fetch("configuration").then((response) => {
    if (response.ok) {
        response.json().then((value) => {
            configuration = value;
            update_form();
        });
    }
});