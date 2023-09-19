from threading import Thread
from random import random
from time import sleep
import queue

if __name__ == "__main__":
    from event import Event
else:
    from src.event import Event

def random_event_generator():
    while True:
        sleep(random())
        name = "one" if random() > 0.8 else "two"
        yield Event(name, random())

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