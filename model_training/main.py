from ultralytics import *

def model():
    model = YOLO("yolo26n.pt") # modelo pre_entrenado
    # results = model.train(data="./sintetic_data/data.yaml", epochs=10, imgsz=640)
    results = model.train(
        data="./sintetic_data/data.yaml", 
        epochs=50, 
        imgsz=640,
        batch=16,          # Explicitly set a batch size
        mixup=0.2,         # Helps blend synthetic images together
        mosaic=1.0         # Creates composite scenes to prevent background overfitting
    )
    results = model.predict("./videoplayback.mp4", show=True, save=True) 
    print(results)
    model.export()

if __name__ == "__main__":
    model();
