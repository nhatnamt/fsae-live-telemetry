from threading import Thread
from random import random,randint,uniform
import time
import queue

if __name__ == "__main__":
    from event import Event
else:
    from src.event import Event

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

class SampleEventSource:
    def __init__(self, listeners: list[queue.Queue] = None):
        if listeners is None:
            self._listeners = []
        else:
            self._listeners = listeners
        self._daemon = None

    def queue_random_events(self):
        for event in random_event_generator():
            for q in self._listeners:
                try:
                    q.put_nowait(event)
                except queue.Full:
                    #print(f"Queue full! Unable to add: {event.event} {event.id}")
                    pass

    def start(self):
        if self._daemon is None:
            self._daemon = Thread(target=self.queue_random_events, daemon=True)
            self._daemon.start()

if __name__ == "__main__":
    q = queue.SimpleQueue()
    SampleEventSource([q]).start()
    count = 5
    while count:
        print(q.get())
        count -= 1