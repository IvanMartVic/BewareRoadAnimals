import requests
from dispositivo import model 
from dispositivo.utils import frame_to_base64
from dataclasses import dataclass

import numpy as np

BATTERY_THRESHOLD = 10

@dataclass(frozen=True)
class SensorData:
    bateria:int 
    image_frame:np.ndarray
class Device:
    def __init__(self, id, server_url, model:model.ObjectDetectionModel):
        self.id = id
        self.server_url = server_url
        self.model = model
        self._lastInference = None

    def deploy(self):
        print(f"going for url: {self.server_url}/deployement")
        # requests.post(url=f"{self.server_url}/deployement",json={"id":self.id , "type":"SISTEMA"})
        self._generic_sys_log("dispositivo desplegado")

    def _low_battery_message(self, battery):
        requests.post(url=f"{self.server_url}/log",json={"id":self.id, "message":f"batería del dispositivo al {battery}%", "type":"BATERIA"})

    def _process_image(self, image):
        is_detect, res = self.model.detect(image)
        # print(res)
        return is_detect,res;
    def _send_detection_log(self, detection, image_base64):
        if image_base64 == "":
            requests.post(url=f"{self.server_url}/log",
                          json={"id":self.id, 
                                "message":f"Animal detectado, ver detecciones anteriores para detalles", "type":"DETECCION"})
        else:
            requests.post(url=f"{self.server_url}/log",json={"id":self.id, "message":detection, "type":"DETECCION", "image":image_base64})

    def _generic_sys_log(self,message):
        requests.post(url=f"{self.server_url}/log",json={"id":self.id, "message":message, "type":"SISTEMA"})

    def _repeated_detection(self, detection):
        if self._lastInference is None:
            return False
        else:
            return self._lastInference["is_detection"]

    def process_data(self,data:SensorData):
        if data.bateria < BATTERY_THRESHOLD:
            self._low_battery_message(data.bateria);
        is_detection, detection = self._process_image(data.image_frame)
        if is_detection:
            if self._repeated_detection(detection):
                img_compress = "";
            else:
                img_compress = frame_to_base64(data.image_frame)
            # print(f"sending detect message to {self.server_url}/log")
            self._send_detection_log(detection, img_compress)

        self._lastInference = { "is_detection" : is_detection, "detection" : detection}





