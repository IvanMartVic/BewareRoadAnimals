import numpy as np
import base64
import cv2
def frame_to_base64(frame:np.ndarray):
    success, buffer = cv2.imencode(ext=".jpg", img=frame)
    if not success:
        raise ValueError("Could not encode frame in jpg")
    b64 = base64.b64encode(buffer).decode('utf-8')
    return b64

