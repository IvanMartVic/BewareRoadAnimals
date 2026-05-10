from dispositivo import model
from dispositivo import device
if __name__ == "__main__":
    m = model.YoloModel()
    d = device.Device(13, "http://localhost:3000/api/device", m)
    d.deploy();
