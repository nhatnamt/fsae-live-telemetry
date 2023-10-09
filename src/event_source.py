from threading import Thread
import queue
from weakref import WeakSet
import os
import csv

if __package__ == "src":
    from src.random_event_generator import random_event_generator
    from src.event import Event
else:
    from random_event_generator import random_event_generator
    from event import Event

class EventSource:
    CURRENT_FILE = "static/data/current.csv"
    RENAME_FILE = "static/data/previous.csv"

    def __init__(self, generator = random_event_generator):
        self.listeners = WeakSet()
        self.generator = generator
        self._daemon = None
        self._file = None
        self._csv = None
        self.events = 0

    def start(self):
        if self._daemon is None:
            print("replacing")
            if os.path.exists(self.CURRENT_FILE):
                os.replace(self.CURRENT_FILE, self.RENAME_FILE)
            self._file = open(self.CURRENT_FILE, "w", newline="")
            self._csv = csv.writer(self._file)
            self._csv.writerow(Event.CSV_HEADINGS)

            def queue_random_events():
                for event in self.generator():
                    self.events += 1
                    for q in self.listeners:
                        try:
                            q.put_nowait(event)
                        except queue.Full:
                            #print(f"Queue full! Unable to add: {event.event} {event.id}")
                            pass
                    self._csv.writerow(event.args())

            self._daemon = Thread(target=queue_random_events, daemon=True)
            self._daemon.start()

if __name__ == "__main__":
    from time import perf_counter, sleep

    q: queue.Queue[Event] = queue.SimpleQueue()
    count = 1000
    source = EventSource()
    source.listeners.add(q)
    start = perf_counter()
    source.start()
    while count:
        print(q.get().args())
        count -= 1
    print(source.events, perf_counter() - start, "seconds")
