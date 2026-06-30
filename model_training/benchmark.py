from pathlib import Path

from ultralytics.utils.benchmarks import benchmark
import pandas as pd

FINAL_MODELS_DIR = "./models/final"
MODEL_NAMES = ["yolo26n_final.onnx", "yolov10n_final.onnx", "yolo12n_final.onnx"]

data = []
for name in MODEL_NAMES:
    location = Path(FINAL_MODELS_DIR) / name
    results = benchmark(model=location, data="./sintetic_data/data.yaml")
    df = pd.DataFrame(results)
    df.insert(0, "model", name)
    data.append(df)
combined = pd.concat(data, ignore_index=True)
print(combined)
combined.to_csv("./models/benchmark.csv")
