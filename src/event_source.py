from threading import Thread
import queue
from weakref import WeakSet
import os
import csv

if __package__ == "src":
    from src.random_event_generator import RandomEventGenerator
    from src.event import Event
else:
    from random_event_generator import RandomEventGenerator
    from event import Event

CURRENT_FILE = "static/data/current.csv"
RENAME_FILE = "static/data/previous.csv"

class EventSource:
    def __init__(self, generator = None):
        self.listeners: WeakSet[queue.Queue] = WeakSet()
        self.generator = generator if generator else RandomEventGenerator()
        self._daemon = None
        self._file = None
        self._csv = None
        self.events = 0

    def start(self):
        if self._daemon is None:
            #print("replacing")
            if os.path.exists(CURRENT_FILE):
                os.replace(CURRENT_FILE, RENAME_FILE)
            self._file = open(CURRENT_FILE, "w", newline="")
            self._csv = csv.writer(self._file) # default delimiters
            self._csv.writerow(Event.CSV_HEADINGS)
            self.events = 0

            def queue_random_events():
                for event in self.generator.generate_events():
                    self.events += 1
                    for q in self.listeners:
                        try:
                            q.put_nowait(event)
                        except queue.Full:
                            #print(f"Queue full! Unable to add: {event.event} {event.id}")
                            pass
                    self._csv.writerow(event.args())
                self._file.close()

            self._daemon = Thread(target=queue_random_events, daemon=True)
            self._daemon.start()

    def stop(self):
        self.generator.stop()
        self._daemon.join() # wait for daemon to stop
        self._daemon = None

if __name__ == "__main__":
    from time import perf_counter, sleep

    q: queue.Queue[Event] = queue.Queue(100)
    count = 1000
    source = EventSource()
    source.listeners.add(q)
    start = perf_counter()
    source.start()
    while count:
        print(q.get().args())
        count -= 1
    print(source.events, perf_counter() - start, "seconds")
    source.stop()
    print(source.events, perf_counter() - start, "seconds")

    from playback_event_generator import PlaybackEventGenerator
    from shutil import copyfile
    generator = PlaybackEventGenerator()
    copyfile(CURRENT_FILE, generator.filename)
    source.generator = generator
    count = source.events
    start = perf_counter()
    source.start()
    try:
        for n in range(count + 5):
            #print(q.get(timeout=5).args())
            q.get(timeout=5)
    except queue.Empty as e:
        pass
    finally:
        print(n, perf_counter() - start, "seconds")
