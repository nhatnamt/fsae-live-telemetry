from flask import Flask, send_from_directory, jsonify, request, redirect, url_for
from queue import Queue
import json
from src.event_source import EventSource
from src.playback_event_generator import PlaybackEventGenerator
import os
import urllib.request

HOME_PAGE = 'home.html'
CONFIGURATION_PAGE = 'configuration.html'
SENSOR_PAGE = 'sensors.html'
ABOUT_PAGE = 'about.html'

CONFIGURATION_STORAGE = 'vehicle_configurations.json'

# download JS dependencies
JS_LIB_FOLDER = "static/js/lib"
JS_DEPENDENCIES = {
    "d3.min.js": "https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js"
}

if not os.path.exists(JS_LIB_FOLDER):
    os.mkdir(JS_LIB_FOLDER)
for filename, url in JS_DEPENDENCIES.items():
    filename = f"{JS_LIB_FOLDER}/{filename}"
    if not os.path.exists(filename):
        with urllib.request.urlopen(url) as content:
            with open(filename, "wb") as f:
                f.write(content.read())        

app = Flask(__name__, static_url_path="/")
event_source = EventSource()

# TODO: load from file?
configuration = {
    "accel_config": {
        "front-shock-pressure-psi": "3",
        "front-tyre-pressure-psi": "1",
        "rear-shock-pressure-psi": "4",
        "rear-tyre-pressure-psi": "2",
        "torque-vectoring-front-to-rear-ratio": "5",
        "torque-vectoring-understeering-coeff": "6"
    },
    "skidpad_config": {
        "front-shock-pressure-psi": "13",
        "front-tyre-pressure-psi": "11",
        "rear-shock-pressure-psi": "14",
        "rear-tyre-pressure-psi": "12",
        "torque-vectoring-front-to-rear-ratio": "15",
        "torque-vectoring-understeering-coeff": "16"
    },
    "autocross_config": {
        "front-shock-pressure-psi": "1.3",
        "front-tyre-pressure-psi": "1.1",
        "rear-shock-pressure-psi": "1.4",
        "rear-tyre-pressure-psi": "1.2",
        "torque-vectoring-front-to-rear-ratio": "1.5",
        "torque-vectoring-understeering-coeff": "1.6"
    },
    "endurance_config": {
        "front-shock-pressure-psi": "-3",
        "front-tyre-pressure-psi": "-1",
        "rear-shock-pressure-psi": "-4",
        "rear-tyre-pressure-psi": "-2",
        "torque-vectoring-front-to-rear-ratio": "-5",
        "torque-vectoring-understeering-coeff": "-6"
    }
}

def save_configuration():
    with open(CONFIGURATION_STORAGE, 'w') as f:
        json.dump(configuration, f)

try:
    with open(CONFIGURATION_STORAGE) as f:
        configuration = json.load(f)
except FileNotFoundError as e:
    save_configuration()

@app.route('/')
def home():
    return send_from_directory('static', HOME_PAGE)

@app.get("/configuration")
def get_configuration():
    return jsonify(configuration)

@app.post("/configuration")
def post_configuration():
    form_data = request.form.to_dict()

    name = form_data["configuration"]
    del form_data["configuration"]
    configuration[name] = form_data
    save_configuration()

    #return jsonify({"_configuration": name} | form_data)
    return redirect(url_for('static', filename=CONFIGURATION_PAGE, configuration=name))

@app.get("/sensordata")
def sensor_data():
    return events_generator(), {"Content-Type": "text/event-stream"}

def events_generator():
    q = Queue(100)
    event_source.listeners.add(q)
    print(f"Listeners: {len(event_source.listeners)}")
    while True:
        yield str(q.get())

@app.post("/sensordata")
def playback_sensor_data():
    file = request.files["file"]
    generator = PlaybackEventGenerator()
    file.save(generator.filename)

    event_source.stop()
    event_source.generator = generator
    event_source.start()
    return redirect(url_for('static', filename=SENSOR_PAGE))

@app.get("/data")
def list_csv_files():
    files = []
    for f in os.listdir(EventSource.DATA_FOLDER):
        if f.lower().endswith(".csv"):
            files.append(f)
    files.reverse()
    return jsonify(files)

event_source.start()

if __name__ == "__main__":
    app.run(debug=True, use_debugger=False, use_reloader=False)
