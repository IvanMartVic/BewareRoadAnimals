from pathlib import Path
import responses
import pytest
import cv2 
from dispositivo import device
from dispositivo import model
from dispositivo.utils import frame_to_base64

TEST_CASES = [
        ("image_detection.jpeg",True),
        ]

BASE_DIR = Path(__file__).resolve().parent
PROJECT_LIB = BASE_DIR.parent / "lib" 
TEST_VIDEO_PATH = PROJECT_LIB / "sintetic_data_video.avi"
MODEL_PATH = PROJECT_LIB / "yolo26n.pt"
@pytest.mark.parametrize("input_data, expected_output", TEST_CASES)
def test_processImage(input_data, expected_output):
    image_path = str(BASE_DIR / "assets" / input_data)
    frame = cv2.imread(image_path)
    if frame is None:
         raise FileNotFoundError(f"can't load image in {image_path}")
    scaled_frame = cv2.resize(frame, (640, 384), interpolation=cv2.INTER_NEAREST)
    m = model.YoloModel(MODEL_PATH)
    d = device.Device(0, "", m)
    is_detect, _ = d._process_image(scaled_frame)
    assert is_detect == expected_output

@responses.activate
def test_sendDetection():
    api_url = "http://localhost:3000/api/device/log"
    responses.add(
            responses.POST,
            api_url,
            json=("status", "success"),
            status=200,
            )
    m = model.YoloModel(MODEL_PATH)
    d = device.Device(0, "http://localhost:3000/api/device", m)
    d._send_detection_log("msg", "img")
    assert len(responses.calls) == 1
    res = responses.calls[0].request
    assert "img" in res.body.decode('utf-8')


@responses.activate
def test_sendSysLog():
    api_url = "http://localhost:3000/api/device/log"
    responses.add(
            responses.POST,
            api_url,
            json=("status", "success"),
            status=200,
            )
    m = model.YoloModel(MODEL_PATH)
    d = device.Device(0, "http://localhost:3000/api/device", m)
    d._generic_sys_log("msg")
    assert len(responses.calls) == 1
    res = responses.calls[0].request
    assert "msg" in res.body.decode('utf-8')

TEST_CASES = [
        ({"image":"image_detection.jpeg", "baterry":50},{"nLogs":1, "log_img":True}),
        ({"image":"image_empty.jpg", "baterry":2},{"nLogs":1, "log_img":False}),
        ({"image":"image_empty.jpg", "baterry":80},{"nLogs":0, "log_img":False}),
        ]
@responses.activate
@pytest.mark.parametrize("input_data, expected_output", TEST_CASES)
def test_process_data(input_data, expected_output):
    api_url = "http://localhost:3000/api/device/log"
    responses.add(
            responses.POST,
            api_url,
            json=("status", "success"),
            status=200,
            )
    image_path = str(BASE_DIR / "assets" / input_data["image"])
    frame = cv2.imread(image_path)
    if frame is None:
         raise FileNotFoundError(f"can't load image in {image_path}")
    scaled_frame = cv2.resize(frame, (640, 384), interpolation=cv2.INTER_NEAREST)
    m = model.YoloModel(MODEL_PATH)
    d = device.Device(0, "http://localhost:3000/api/device", m)
    sensor_data = device.SensorData(bateria=input_data["baterry"],image_frame=scaled_frame)
    d.process_data(sensor_data)
    assert len(responses.calls) == expected_output["nLogs"]
    if len(responses.calls) == 0:
        return
    res = responses.calls[0].request
    base64_img = frame_to_base64(sensor_data.image_frame)
    if expected_output["log_img"] == True:
        assert base64_img in res.body.decode('utf-8')
    else:
        assert base64_img not in res.body.decode('utf-8')




