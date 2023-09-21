from threading import Thread
from random import random,randint
from time import sleep
import queue

if __name__ == "__main__":
    from event import Event
else:
    from src.event import Event

def random_event_generator():
    idList = ["FL_temp","FL_torque","FL_rpm",
                "FR_temp","FR_torque","FR_rpm",
                "RL_temp","RL_torque","RL_rpm",
                "RR_temp","RR_torque","RR_rpm",
                "left_coolant_temp","right_coolant_temp","rear_coolant_temp",
                "cell_max_voltage","cell_min_voltage","pack_voltage","pack_power","current_temp","lv_battery"]
    while True:
        for id in idList:
            event = Event("textData", id, randint(0,100))
            yield event
            sleep(0.01)

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