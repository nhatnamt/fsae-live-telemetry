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
        events = generate_from_csv(rows)
        event = next(events)
        offset = time.perf_counter() - event.timestamp
        #print(event.timestamp, 0)
        event.timestamp = time.perf_counter()
        yield event
        for event in events:
            sleep_time = event.timestamp + offset - time.perf_counter()
            if sleep_time > 0:
                time.sleep(sleep_time)
            #print(event.timestamp, sleep_time * -1000, "ms")
            event.timestamp = time.perf_counter()
            yield event

def generate_from_csv(rows):
    for row in rows:
        event = Event(**row)
        event.timestamp = float(event.timestamp)
        yield event

if __name__ == "__main__":
    count = 5
    for event in playback_event_generator():
        print(event)
        if count == 0:
            break
        count -= 1
