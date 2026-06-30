from ultralytics import YOLO
from pathlib import Path

FINAL_MODELS_DIR = Path("./models/final")
MODEL_NAMES = ["yolo26n_final.pt", "yolov10n_final.pt", "yolo12n_final.pt"]

SCRIPT_DIR = Path(__file__).resolve().parent

for name in MODEL_NAMES:
    location = SCRIPT_DIR /  FINAL_MODELS_DIR / name
    model = YOLO(location)
    model.export(format="onnx", quatize=8, data="./sintetic_data/data.yaml")
