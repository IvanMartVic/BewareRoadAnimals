from pathlib import Path
import responses
import pytest
import cv2 
from dispositivo import device
from dispositivo import model
from dispositivo.utils import frame_to_base64
import os
from dotenv import load_dotenv

TEST_CASES = [
        ("image_detection.jpeg",True),
        ]

BASE_DIR = Path(__file__).resolve().parent
PROJECT_LIB = BASE_DIR.parent / "lib" 
TEST_VIDEO_PATH = PROJECT_LIB / "sintetic_data_video.avi"
MODEL_PATH = PROJECT_LIB / "yolo26n.pt"
load_dotenv()
def test_sendSysLog():
    os.environ["JWT"] = "jwt expired"
    api_url = "http://localhost:3000/api/device"
    m = model.YoloModel(MODEL_PATH)
    d = device.Device(17, "http://localhost:3000/api/device", m)
    response = d._generic_sys_log("msg")
    print(response)
    assert response is not None
    assert response.status_code == 200





