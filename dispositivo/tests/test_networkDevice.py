import responses
import pytest
from pathlib import Path
import cv2 
from dispositivo import device
from dispositivo import model
from dispositivo.utils import frame_to_base64
from dispositivo import main

BASE_DIR = Path(__file__).resolve().parent
MAX_DETECT_SIZE_BYTES = 200000 #200 KB as an upperbound for a detection log
PROJECT_LIB = BASE_DIR.parent / "lib" 
TEST_VIDEO_PATH = PROJECT_LIB / "sintetic_data_video.avi"
MODEL_PATH = PROJECT_LIB / "yolo26n.pt"
@responses.activate
def test_networkDetectionSize():
    api_url = "http://localhost:3000/api/device/log"
    responses.add(
            responses.POST,
            api_url,
            json=("status", "success"),
            status=200,
            )
    image_path = str(BASE_DIR / "assets" / "image_detection.jpeg")
    frame = cv2.imread(image_path)
    if frame is None:
         raise FileNotFoundError(f"can't load image in {image_path}")
    scaled_frame = cv2.resize(frame, (640, 384), interpolation=cv2.INTER_NEAREST)
    m = model.YoloModel(MODEL_PATH)
    d = device.Device(0, "http://localhost:3000/api/device", m)
    sensor_data = device.SensorData(bateria=100,image_frame=scaled_frame)
    d.process_data(sensor_data)
    if len(responses.calls) == 0:
        return
    res = responses.calls[0].request
    payload_size = int(res.headers.get('Content-Length', 0))
    print(payload_size)
    assert payload_size < MAX_DETECT_SIZE_BYTES, f"The message size is too big {payload_size} bytes"

TEST_CASES = [
        ({"video":"10_detect_video.avi"},{"nLogs":1}),
        ({"video":"30_alternated_2-1_video.avi"},{"nLogs":10}),
        ]

@responses.activate
@pytest.mark.parametrize("input_data, expected_output", TEST_CASES)
def test_device_does_not_send_repeated_detections(input_data, expected_output):
    api_url = "http://localhost:3000/api/device/log"
    responses.add(
            responses.POST,
            api_url,
            json=("status", "success"),
            status=200,
            )
    api_url = "http://localhost:3000/api/device/deployement"
    responses.add(
            responses.POST,
            api_url,
            json={"status": "success", "jwt":"heyyy soy valido"},
            status=200,
            )
    video_path = str(BASE_DIR / "assets" / input_data["video"])
    main.main(1, videoInput=video_path, serverApi="http://localhost:3000/api/device", verbose=False, model_path=MODEL_PATH)
    images_sent = 0
    for call in responses.calls:
        res = call.request
        if "image" in res.body.decode('utf-8'):
            images_sent += 1

    assert images_sent == expected_output["nLogs"]


