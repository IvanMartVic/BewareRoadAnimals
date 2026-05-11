import requests
from dispositivo import model 
from dataclasses import dataclass
import numpy as np

@dataclass(frozen=True)
class SensorData:
    bateria:int 
    image_frame:np.ndarray
class Device:
    def __init__(self, id, server_url, model:model.ObjectDetectionModel):
        self.id = id
        self.server_url = server_url
        self.model = model

    def deploy(self):
        print(f"going for url: {self.server_url}/api/deployement")
        requests.post(url=f"{self.server_url}/deployement",json={"id":self.id , "type":"SISTEMA"})

    def _low_battery_message(self):
        requests.post(url=f"{self.server_url}/logs",json={"id":self.id, "message":"batería baja", "type":"BATERIA"}, timeout=0)

    def _process_image(self, image):
        res = self.model.detect(image)

    def _generic_sys_log(self,message):
        requests.post(url=f"{self.server_url}/logs",json={"id":self.id, "message":message, "type":"SISTEMA"}, timeout=0)

    def process_data(self,data:SensorData):
        print(data)



