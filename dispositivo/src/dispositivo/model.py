from abc import ABC, abstractmethod
from ultralytics import *
class ObjectDetectionModel(ABC):
    @abstractmethod
    def detect(self, image):
        pass

class YoloModel(ObjectDetectionModel):
    def __init__(self) -> None:
        super().__init__()
        self._model = YOLO("yolo26n.pt") # modelo pre_entrenado
        
    def detect(self, image):
        print(f"YOLO detecction {image}")
        results = self._model.predict(image, show=True) 


