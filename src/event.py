from time import perf_counter
from json import dumps

class Event:
    CSV_HEADINGS = ("event", "id", "payload", "timestamp")

    def __init__(self, event, id, payload, timestamp = None):
        if timestamp is None:
            timestamp = perf_counter()

        self.event = event
        self.id = id
        self.payload = payload
        self.timestamp = timestamp
    
    def args(self):
        return (self.event, self.id, self.payload, self.timestamp)

    def __str__(self):
        # result is in server-sent event format
        result = f"event: {self.event}\n"
        data = {
            "id": self.id,
            "payload": self.payload,
            "timestamp": self.timestamp
        }
        result += "data: " + dumps(data)
        return result + "\n\n"

if __name__ == "__main__":
    event = Event("test", 1, 123)
    print(repr(str(event)))
    csv = event.to_csv()
    print(event.to_csv())
    print(repr(str(Event.from_csv(csv))))