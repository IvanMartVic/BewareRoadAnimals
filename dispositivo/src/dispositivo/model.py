from abc import ABC, abstractmethod
from ultralytics import *
from typing import Tuple
class ObjectDetectionModel(ABC):
    @abstractmethod
    def detect(self, image) -> Tuple[bool, str]:
        pass

class YoloModel(ObjectDetectionModel):
    def __init__(self) -> None:
        super().__init__()
        # self._model = YOLO("yolo26n.pt") # modelo pre_entrenado
        self._model = YOLO("/home/ivan//Downloads/train12/weights/best.pt") # modelo pre_entrenado
        
    def detect(self, image):
        # print(f"YOLO detecction {image}")
        results = self._model.predict(image) 
        for result in results:
            summary = result.summary()
            if len(summary) > 0:
                print(f"summary len: {len(summary)}")
                return True, result.to_json()
            print(summary)

        # print(f"YOLO detecction {results}")
        return False, ""


