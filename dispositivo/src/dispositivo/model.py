from abc import ABC, abstractmethod
class ObjectDetectionModel(ABC):
    @abstractmethod
    def detect(self, image):
        pass

class YoloModel(ObjectDetectionModel):
    def detect(self, image):
        print(f"YOLO detecction {image}")


