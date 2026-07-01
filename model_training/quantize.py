import os
from ultralytics import YOLO
from pathlib import Path
from onnxruntime.quantization import shape_inference

FINAL_MODELS_DIR = Path("./models/final")
LITERT_MODEL_NAMES = ["yolo26n_final.pt", "yolov10n_final.pt", "yolo12n_final.pt"]
ONNX_MODEL_NAMES = ["yolov8n_final.pt"]


SCRIPT_DIR = Path(__file__).resolve().parent

# for name in LITERT_MODEL_NAMES:
#     location = SCRIPT_DIR /  FINAL_MODELS_DIR / name
#     model = YOLO(location)
#     model.export(format="litert", quantize=8, data="./sintetic_data/data.yaml")

for name in ONNX_MODEL_NAMES:
    location = SCRIPT_DIR /  FINAL_MODELS_DIR / name
    model = YOLO(location)
    model.export(format="onnx", quantize=8, data="./sintetic_data/data.yaml")
