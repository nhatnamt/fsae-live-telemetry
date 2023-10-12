import csv
import time

if __package__ == "src":
    from src.event import Event
else:
    from event import Event

PLAYBACK_FILE = "static/data/playback.csv"

def playback_event_generator():
    with open(PLAYBACK_FILE, newline="") as f:
        rows = csv.DictReader(f) # default delimiters
        row = next(rows)
        event = Event(**row)
        offset = time.perf_counter() - float(event.timestamp)
        print(event.timestamp, 0)
        yield event
        for row in rows:
            event = Event(**row)
            sleep_time = float(event.timestamp) + offset - time.perf_counter()
            print(event.timestamp, sleep_time)
            if sleep_time > 0:
                time.sleep(sleep_time)
            yield event

if __name__ == "__main__":
    count = 1000
    for event in playback_event_generator():
        print(event)
        if count == 0:
            break
        count -= 1
