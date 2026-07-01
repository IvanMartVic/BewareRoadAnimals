from pathlib import Path

from ultralytics.utils.benchmarks import benchmark
from ultralytics import YOLO
import pandas as pd

FINAL_MODELS_DIR = "./models/final"
MODEL_NAMES = ["yolo26n_final.pt", "yolov10n_final.pt", "yolo12n_final.pt"]

INT8_MODELS = ["yolo26n_final_int8.tflite", "yolov10n_final_int8.tflite", "yolo12n_final_int8.tflite"]

data = []
SCRIPT_DIR = Path(__file__).resolve().parent
for name in MODEL_NAMES:
    location = SCRIPT_DIR / Path(FINAL_MODELS_DIR) / name
    results = benchmark(model=location, data="./sintetic_data/data.yaml", 
                        imgsz=640, device="cpu", format="onnx")

    df = pd.DataFrame(results)
    df.insert(0, "model", name)
    data.append(df)
combined = pd.concat(data, ignore_index=True)
print(combined)
combined.to_csv("./models/benchmark_normal.csv")
# quantization
data = []
for name in INT8_MODELS:
    location = SCRIPT_DIR / Path(FINAL_MODELS_DIR) / name
    model = YOLO(location, task="detect")
    metrics = model.val(data="./sintetic_data/data.yaml", device="cpu", imgsz=640, plots=False)
    inference_speed = metrics.speed.get('inference', 0.0)
    preprocess_speed = metrics.speed.get('preprocess', 0.0)
    postprocess_speed = metrics.speed.get('postprocess', 0.0)
    total_speed = inference_speed + preprocess_speed + postprocess_speed
    map50_95 = metrics.box.map      # mAP50-95
    map50 = metrics.box.map50      # mAP50
    fps = 1000 / total_speed
    row_data = {
        "model": name,
        "Format": "tflite",
        "mAP50-95": round(map50_95, 4),
        "mAP50": round(map50, 4),
        "Inference (ms)": round(inference_speed, 2),
        "Total Time (ms)": round(total_speed, 2),
        "fps": round(fps,2)
    }
    df = pd.DataFrame([row_data])
    data.append(df)

combined = pd.concat(data, ignore_index=True)
print(combined)
combined.to_csv("./models/benchmark_int8.csv")


