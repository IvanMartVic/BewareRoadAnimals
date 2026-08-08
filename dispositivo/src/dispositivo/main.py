from dispositivo import model
from dispositivo import device
from time import sleep
from dispositivo.device import SensorData
from random import randint
import cv2
import pathlib

def simulateBatterySensor():
    # return randint(0,100)
    return 50

PROJECT_ROOT = pathlib.Path(__file__).parent.parent.parent  
PROJECT_LIB = PROJECT_ROOT / "lib" 
TEST_VIDEO_PATH = PROJECT_LIB / "test_video.avi"
MODEL_PATH = PROJECT_LIB / "yolo26n.pt"
def main(id, videoInput, serverApi, model_path, verbose = True): 
    m = model.YoloModel(model_path)
    # d = device.Device(13, "http://localhost:3000/api/device", m)
    d = device.Device(id, serverApi, m)
    # d = device.Device(13, "https://beware-road-animals-2iyu.vercel.app/api/device", m)
    d.deploy();
    # cap = cv2.VideoCapture(str(TEST_VIDEO_PATH));
    cap = cv2.VideoCapture(videoInput);
    if not cap.isOpened():
        print("could not open video stream")
        exit()
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        scaled_frame = cv2.resize(frame, (640, 384), interpolation=cv2.INTER_NEAREST)
        sensor_data = SensorData(bateria=simulateBatterySensor(),image_frame=scaled_frame)
        d.process_data(sensor_data)
        if(verbose):
            cv2.imshow("img", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main(17, str(TEST_VIDEO_PATH), model_path=str(MODEL_PATH), serverApi="http://localhost:3000/api/device" );

