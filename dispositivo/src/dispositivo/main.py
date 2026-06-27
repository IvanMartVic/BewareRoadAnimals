from dispositivo import model
from dispositivo import device
from time import sleep
from dispositivo.device import SensorData
from random import randint
import cv2

def simulateBatterySensor():
    # return randint(0,100)
    return 50

def main(mac, videoInput, serverApi, verbose = True): 
    m = model.YoloModel()
    # d = device.Device(13, "http://localhost:3000/api/device", m)
    d = device.Device(mac, serverApi, m)
    # d = device.Device(13, "https://beware-road-animals-2iyu.vercel.app/api/device", m)
    d.deploy();
    cap = cv2.VideoCapture("/home/ivan/Downloads/sintetic_data/");
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
    main(13, "/home/ivan/Downloads/sintetic_data/", "http://localhost:3000/api/device" );

