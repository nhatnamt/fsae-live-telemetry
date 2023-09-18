from flask import Flask, send_from_directory, jsonify, request

CONFIGURATION_PAGE = 'configuration.html'
SENSOR_PAGE = 'sensors.html'

app = Flask(__name__, static_url_path="/")

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
    return jsonify(configuration)

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

    # return jsonify({"name": name} | form_data)
    return send_from_directory('static', CONFIGURATION_PAGE)

if __name__ == "__main__":
    app.run(debug=True)