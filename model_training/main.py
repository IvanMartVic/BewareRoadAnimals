from ultralytics import YOLO
from pathlib import Path
import os

PRETRAIN_DIR = "./models/pretrain"
FINAL_DIR = "./models/final"
MODEL_NAMES = ["yolo26n.pt", "yolov10n.pt", "yolo12n.pt", "yolov8n.pt"]
def download_models():
    os.makedirs(name=PRETRAIN_DIR, exist_ok=True)
    original_wd = os.getcwd()
    os.chdir(PRETRAIN_DIR)

    try:
        for name in MODEL_NAMES:
            location = Path(PRETRAIN_DIR) / name
            if not location.exists():
                YOLO(name)
    finally:
        os.chdir(original_wd)

def final_model_exists(name):
    final_name, _  = name.split('.')
    final_name = f"{final_name}_final.pt"
    final_location = Path(FINAL_DIR) / final_name
    if os.path.exists(final_location):
        print(f"model {final_location} exists ... skiping train")
        return True
    else:
        return False



def train():
    download_models()

    for name in MODEL_NAMES:
        #download model
        location = Path(PRETRAIN_DIR) / name
        if final_model_exists(name):
            continue
        model = YOLO(location) # modelo pre_entrenado
        results = model.train(
            data="./sintetic_data/data.yaml", 
            epochs=50, 
            imgsz=640,
            device=0,
            # batch=16,          
            # mixup=0.2,        
            # mosaic=1.0         
        )
        model.export(format="onnx")

if __name__ == "__main__":
    train();
