import csv
import time

if __package__ == "src":
    from src.event import Event
    from src.base_event_generator import BaseEventGenerator
else:
    from event import Event
    from base_event_generator import BaseEventGenerator

FILENAME = "static/data/playback.csv"

class PlaybackEventGenerator(BaseEventGenerator):
    def __init__(self, filename = FILENAME):
        super().__init__()
        self.filename = filename

    def generate_events(self):
        super().generate_events()
        events = self.read_csv()
        event = next(events)
        offset = time.perf_counter() - event.timestamp
        #print(event.timestamp, 0)
        event.timestamp = time.perf_counter()
        yield event
        for event in events:
            sleep_time = event.timestamp + offset - time.perf_counter()
            if sleep_time > 0:
                if not self._continue:
                    break
                time.sleep(sleep_time)
            #print(event.timestamp, sleep_time * -1000, "ms")
            event.timestamp = time.perf_counter()
            yield event

    def read_csv(self):
        with open(self.filename, newline="") as f:
            rows = csv.DictReader(f) # default delimiters
            for row in rows:
                event = Event(**row)
                event.timestamp = float(event.timestamp)
                yield event

if __name__ == "__main__":
    count = 5
    generator = PlaybackEventGenerator("static/data/previous.csv")
    for event in generator.generate_events():
        print(event)
        if count == 0:
            generator.stop()
        else:
            count -= 1
