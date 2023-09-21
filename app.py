from random import random
from time import sleep
from flask import Flask, send_from_directory, jsonify, request
from queue import Queue

CONFIGURATION_PAGE = 'configuration.html'
SENSOR_PAGE = 'sensors.html'

app = Flask(__name__, static_url_path="/")
listeners = []

# TODO: load from file?
configuration = {
    "test configuration": {
        "key": "value"
    }
}

@app.route('/')
def home():
    return send_from_directory('static', SENSOR_PAGE)

@app.get("/configuration")
def get_configuration():
    #return jsonify(configuration)
    return send_from_directory('static', CONFIGURATION_PAGE)

@app.post("/configuration")
def post_configuration():
    # TODO: change post request to JSON format?
    keys = []
    values = []
    for k, v in request.form.items(multi=True):
        if k == "key":
            keys.append(v)
        elif k == "value":
            values.append(v)
    form_data = {k: v for k, v in zip(keys, values)}

    name = form_data["name"]
    del form_data["name"]
    configuration[name] = form_data
    # TODO: save to file

    return jsonify({"name": name} | form_data)
    #return send_from_directory('static', CONFIGURATION_PAGE)

@app.get("/sensordata")
def sensor_data():
    return events_generator(), {"Content-Type": "text/event-stream"}

def events_generator():
    q = Queue(10)
    listeners.append(q)
    while True:
        yield str(q.get())

if __name__ == "__main__":
    from src.sample_event_generator import SampleEventSource
    SampleEventSource(listeners).start()
    app.run(debug=True)