from abc import ABC, abstractmethod

class BaseEventGenerator(ABC):
    def __init__(self):
        self._continue = False
    
    def stop(self):
        self._continue = False
    
    @abstractmethod
    def generate_events(self):
        self._continue = True
