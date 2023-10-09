from threading import Thread
import queue
from weakref import WeakSet

if __package__ == "src":
    from src.random_event_generator import random_event_generator
else:
    from random_event_generator import random_event_generator

class EventSource:
    def __init__(self, generator = random_event_generator):
        self.listeners = WeakSet()
        self.generator = generator
        self._daemon = None
        self.events = 0

    def start(self):
        if self._daemon is None:
            def queue_random_events():
                for event in self.generator():
                    self.events += 1
                    for q in self.listeners:
                        try:
                            q.put_nowait(event)
                        except queue.Full:
                            #print(f"Queue full! Unable to add: {event.event} {event.id}")
                            pass

            self._daemon = Thread(target=queue_random_events, daemon=True)
            self._daemon.start()

if __name__ == "__main__":
    from time import perf_counter, sleep

    q = queue.SimpleQueue()
    count = 1000
    source = EventSource()
    source.listeners.add(q)
    start = perf_counter()
    source.start()
    while count:
        print(q.get().to_csv())
        count -= 1
    print(source.events, perf_counter() - start, "seconds")
