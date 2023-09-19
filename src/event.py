from datetime import datetime
from json import dumps

class Event:
    def __init__(self, sensor, payload, timestamp = None):
        if timestamp is None:
            timestamp = datetime.now().timestamp()
        
        self.sensor = sensor
        self.payload = payload
        self.timestamp = timestamp
    
    def __str__(self):
        # result is in server-sent event format
        result = f"event: {self.sensor}\n"
        data = {
            "payload": self.payload,
            "timestamp": self.timestamp
        }
        result += "data: " + dumps(data)
        return result + "\n\n"

if __name__ == "__main__":
    event = Event("test", 123)
    print(repr(str(event)))