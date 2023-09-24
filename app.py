from random import random
from time import sleep
from flask import Flask, send_from_directory, jsonify, request, redirect, url_for
from queue import Queue
from src.sample_event_generator import SampleEventSource

HOME_PAGE = 'home.html'
CONFIGURATION_PAGE = 'configuration.html'
SENSOR_PAGE = 'sensors.html'
ABOUT_PAGE = 'about.html'

app = Flask(__name__, static_url_path="/")
listeners = []

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
    # TODO: save to file

    #return jsonify({"_configuration": name} | form_data)
    return redirect(url_for('static', filename=CONFIGURATION_PAGE, configuration=name))

@app.get("/sensordata")
def sensor_data():
    return events_generator(), {"Content-Type": "text/event-stream"}

def events_generator():
    q = Queue(100)
    listeners.append(q)
    while True:
        yield str(q.get())

if __name__ == "__main__":
    SampleEventSource(listeners).start()
    app.run(debug=True)