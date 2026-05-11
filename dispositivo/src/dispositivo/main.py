from dispositivo import model
from dispositivo import device
from time import sleep
from dispositivo.device import SensorData
from random import randint
import cv2

def simulateBatterySensor():
    return randint(0,100)

if __name__ == "__main__":
    m = model.YoloModel()
    d = device.Device(13, "http://localhost:3000/api/device", m)
    # d.deploy();
    cap = cv2.VideoCapture("/home/iVase/software/proyectos/tfg_road_animals/road_animals/model_training/videoplayback.mp4");
    if not cap.isOpened():
        print("could not open video stream")
        exit()
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        sensor_data = SensorData(bateria=simulateBatterySensor(),image_frame=frame)
        d.process_data(sensor_data)
        cv2.imshow("hola", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
        sleep(0.1)
    cap.release()
    cv2.destroyAllWindows()

