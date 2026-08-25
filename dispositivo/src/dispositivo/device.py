import requests
from dispositivo import model 
from dispositivo.utils import frame_to_base64
from dataclasses import dataclass
import os
import numpy as np

BATTERY_THRESHOLD = 10
class AuthenticationException(Exception):
    pass

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
        try:
            deploy_token = os.environ.get("DEPLOY_TOKEN")
            print(f"trying key {deploy_token}")
            headers = {
                    "deployToken": deploy_token,
                    "Content-Type":"application/json"
                    }
            response = requests.post(url=f"{self.server_url}/deployement",json={"id":self.id , "type":"SISTEMA"}, headers = headers)
            response.raise_for_status()
            data = response.json()
            jwt = data.get("jwt")
            os.environ["JWT"] = jwt
            return response
        except requests.exceptions.RequestException as e:
            raise AuthenticationException("unable to reauthenticate in the server")

    def _low_battery_message(self, battery):
        payload = {"id":self.id, "message":f"batería del dispositivo al {battery}%", "type":"BATERIA"}
        return self._send_message(payload)

    def _send_message(self, payload):
        jwt = os.environ.get("JWT")
        if not jwt:
            print("Error no JWT in environment")
            return None
        headers = {
                "Authorization":f"Bearer {jwt}",
                "Content-Type":"application/json"
                }
        response = requests.post(url=f"{self.server_url}/log",
                                 json=payload, headers= headers)
        try:
            response.raise_for_status()
            return response
        except requests.exceptions.RequestException as e:
            if response.status_code == 401:
                print("JWT invalid or expired attempting refreshing")
                deploy_response = self.deploy()
                print(f"redeployement response status: {deploy_response.status_code}")
                jwt = os.environ.get("JWT")
                headers = {
                        "Authorization":f"Bearer {jwt}",
                        "Content-Type":"application/json"
                        }
                response = requests.post(url=f"{self.server_url}/log",
                                         json=payload, headers= headers)
                if response.status_code != 200:
                    print(f"this jwt is unvalid:\n ${jwt}\n")
                    raise AuthenticationException("Not able to reach the server after refreshing token");
                return response


    def _process_image(self, image):
        is_detect, res = self.model.detect(image)
        # print(res)
        return is_detect,res;
    def _send_detection_log(self, detection, image_base64):
        payload:dict[str, str] = {}
        if image_base64 == "":
            payload = {"id":self.id,"message":f"Animal detectado, ver detecciones anteriores para detalles", "type":"DETECCION"}
        else:
            payload = {"id":self.id, "message":detection, "type":"DETECCION", "image":image_base64}
        return self._send_message(payload)



    def _generic_sys_log(self,message):
        payload = {"id":self.id, "message":message, "type":"SISTEMA"}
        return self._send_message(payload)

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





