from threading import Thread
import queue

if __package__ == "src":
    from src.random_event_generator import random_event_generator
else:
    from random_event_generator import random_event_generator

class EventSource:
    def __init__(self, listeners: list[queue.Queue] = None, generator = random_event_generator):
        if listeners is None:
            self.listeners = []
        else:
            self.listeners = listeners
        self.generator = generator
        self._daemon = None

    def start(self):
        if self._daemon is None:
            def queue_random_events():
                for event in self.generator():
                    for q in self.listeners:
                        try:
                            q.put_nowait(event)
                        except queue.Full:
                            #print(f"Queue full! Unable to add: {event.event} {event.id}")
                            pass

            self._daemon = Thread(target=queue_random_events, daemon=True)
            self._daemon.start()

if __name__ == "__main__":
    q = queue.SimpleQueue()
    EventSource([q]).start()
    count = 5
    while count:
        print(q.get())
        count -= 1