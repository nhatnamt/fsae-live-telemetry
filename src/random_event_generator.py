from random import randint, uniform
import time

if __package__ == "src":
    from src.event import Event
else:
    from event import Event

SENSORS = {
    "FL_temp" : {
        "refresh_rate": 1,
        "max" : 120,
        "min": 10,
        "last_sent": 0
    },
    "FL_torque": {
        "refresh_rate": 0.1,
        "max" : 21,
        "min": -10,
        "last_sent": 0
    },
    "FL_rpm": {
        "refresh_rate": 0.1,
        "max" : 20000,
        "min": 0,
        "last_sent": 0
    },
    "FR_temp" : {
        "refresh_rate": 1,
        "max" : 120,
        "min": 10,
        "last_sent": 0
    },
    "FR_torque": {
        "refresh_rate": 0.1,
        "max" : 21,
        "min": -10,
        "last_sent": 0
    },
    "FR_rpm": {
        "refresh_rate": 0.1,
        "max" : 20000,
        "min": 0,
        "last_sent": 0
    },
    "RL_temp" : {
        "refresh_rate": 1,
        "max" : 120,
        "min": 10,
        "last_sent": 0
    },
    "RL_torque": {
        "refresh_rate": 0.1,
        "max" : 21,
        "min": -10,
        "last_sent": 0
    },
    "RL_rpm": {
        "refresh_rate": 0.1,
        "max" : 20000,
        "min": 0,
        "last_sent": 0
    },
    "RR_temp" : {
        "refresh_rate": 1,
        "max" : 120,
        "min": 10,
        "last_sent": 0
    },
    "RR_torque": {
        "refresh_rate": 0.1,
        "max" : 21,
        "min": -10,
        "last_sent": 0
    },
    "RR_rpm": {
        "refresh_rate": 0.1,
        "max" : 20000,
        "min": 0,
        "last_sent": 0
    },
    "left_coolant_temp" : {
        "refresh_rate": 1,
        "max" : 50,
        "min": 5,
        "last_sent": 0
    },
    "right_coolant_temp" : {
        "refresh_rate": 1,
        "max" : 50,
        "min": 5,
        "last_sent": 0
    },
    "rear_coolant_temp" : {
        "refresh_rate": 1,
        "max" : 50,
        "min": 5,
        "last_sent": 0
    },
    "cell_max_voltage" : {
        "refresh_rate": 1,
        "max" : 4.2,
        "min": 3.0,
        "last_sent": 0
    },
    "cell_min_voltage" : {
        "refresh_rate": 1,
        "max" : 4.2,
        "min": 3.0,
        "last_sent": 0
    },
    "pack_voltage" : {
        "refresh_rate": 1,
        "max" : 600,
        "min": 435,
        "last_sent": 0
    },
    "pack_power" : {
        "refresh_rate": 0.1,
        "max" : 80,
        "min": 0,
        "last_sent": 0
    },
    "current_temp" : {
        "refresh_rate": 1,
        "max" : 120,
        "min": 10,
        "last_sent": 0
    },
    "lv_battery" : {
        "refresh_rate": 1,
        "max" : 28.0,
        "min": 22.5,
        "last_sent": 0
    },

}

def random_event_generator():
    while True:
        for sensor in SENSORS:
            if time.time() - SENSORS[sensor]["last_sent"] > SENSORS[sensor]["refresh_rate"]:
                SENSORS[sensor]["last_sent"] = time.time()
                # switch between random and uniform
                min = SENSORS[sensor]["min"]
                max = SENSORS[sensor]["max"]
                if isinstance(min, int) and isinstance(max, int):
                    yield Event("textData",sensor, randint(min, max))
                else:
                    yield Event("textData",sensor, round(uniform(min, max),1))
        time.sleep(0.1)

if __name__ == "__main__":
    count = 5
    for event in random_event_generator():
        print(event)
        if count == 0:
            break
        count -= 1