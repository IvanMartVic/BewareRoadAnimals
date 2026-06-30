from pathlib import Path

from ultralytics.utils.benchmarks import benchmark
import pandas as pd

FINAL_MODELS_DIR = "./models/final"
MODEL_NAMES = ["yolo26n_final.pt", "yolov10n_final.pt", "yolo12n_final.pt"]

data = []
SCRIPT_DIR = Path(__file__).resolve().parent
for name in MODEL_NAMES:
    location = SCRIPT_DIR / Path(FINAL_MODELS_DIR) / name
    results = benchmark(model=location, data="./sintetic_data/data.yaml", 
                        imgsz=640, device="cpu", format="onnx")

    df = pd.DataFrame(results)
    df.insert(0, "model", name)
    data.append(df)
# quantization
for name in MODEL_NAMES:
    location = SCRIPT_DIR / Path(FINAL_MODELS_DIR) / name
    results = benchmark(model=location, data="./sintetic_data/data.yaml", 
                        imgsz=640, device="cpu", format="onnx", quantize=8)

    df = pd.DataFrame(results)
    df.insert(0, "model", f"{name} q_8")
    data.append(df)
combined = pd.concat(data, ignore_index=True)
print(combined)
combined.to_csv("./models/benchmark.csv")


