from ultralytics import *

def model():
    model = YOLO("yolo26n.pt") # modelo pre_entrenado
    results = model.train(data="/home/iVase/software/proyectos/tfg_road_animals/datasets/boar.v5-ver_1.4.yolo26/data.yaml", epochs=10, imgsz=640)
    results = model.predict("./videoplayback.mp4", show=True, save=True) 
    print(results)

if __name__ == "__main__":
    model();
