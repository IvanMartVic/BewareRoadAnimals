import os
from os.path import exists
import cv2
from PIL import Image

TEST_SET_PATH = "/home/iVase/software/proyectos/tfg_road_animals/road_animals/model_training/sintetic_data/test/images"
OUTPUT_PATH = "/home/ivan/software/BewareRoadAnimals/dispositivo/tests/assets/"

num_of_images = len([file for file in os.listdir('.') if file.endswith((".jpg", ".jpeg", ".png"))])
print("Number of Images:", num_of_images)

def generate_video_from_test_set(test_folder_path):
    image_folder = test_folder_path
    if not exists(image_folder):
        raise FileNotFoundError("image_folder does not exist")
    video_name = 'test_video.avi'
    images = [img for img in os.listdir(image_folder) if img.endswith((".jpg", ".jpeg", ".png"))]
    print("Images:", images)
    frame = cv2.imread(os.path.join(image_folder, images[0]))
    if(frame is None):
        raise FileNotFoundError("no images in test folder")
    height, width, layers = frame.shape
    video = cv2.VideoWriter(f"{OUTPUT_PATH}/{video_name}", cv2.VideoWriter_fourcc(*'DIVX'), 1, (width, height))
    for image in images:
        video.write(cv2.imread(os.path.join(image_folder, image)))
    video.release()
    cv2.destroyAllWindows()
    print("Video generated successfully!")

def generate_video_from_image(image_path, nframes, video_name):
    img = cv2.imread(image_path)
    if(img is None):
        raise FileNotFoundError("image_path not existent")
    height, width, _ = img.shape
    video = cv2.VideoWriter(f"{OUTPUT_PATH}/{video_name}", cv2.VideoWriter_fourcc(*'DIVX'), 1, (width, height))
    for _ in range(nframes):
        video.write(img)
    video.release()
    print(f"video {video_name} generated successfully!")

def generate_alternated_detection_video(detection_image_path, non_detection_image_path, nframes, row_detections, video_name):
    detect = cv2.imread(detection_image_path)
    if(detect is None):
        raise FileNotFoundError("detection_image_path not existent")
    non_detect = cv2.imread(non_detection_image_path)
    if(non_detect is None):
        raise FileNotFoundError("non_detection_image_path not existent")

    height, width, _ = detect.shape
    video = cv2.VideoWriter(f"{OUTPUT_PATH}/{video_name}", cv2.VideoWriter_fourcc(*'DIVX'), 1, (width, height))
    for i in range(nframes):
        if i % (row_detections + 1) == 0:
            video.write(non_detect)
        else:
            video.write(detect)
    video.release()
    print(f"video {video_name} generated successfully!")


try:
    generate_video_from_test_set(TEST_SET_PATH)
except Exception as e:
    print("could not create test set video ", e)
try:
    generate_video_from_image("/home/ivan/software/BewareRoadAnimals/dispositivo/tests/assets/image_detection.jpeg", 
                              10, "10_detect_video.avi")
except Exception as e:
    print("could not create test videos for device ", e)
try:
    detection = "/home/ivan/software/BewareRoadAnimals/dispositivo/tests/assets/image_detection.jpeg"
    non_detect = "/home/ivan/software/BewareRoadAnimals/dispositivo/tests/assets/image_empty.jpg"
    generate_alternated_detection_video(detection_image_path=detection, 
                                        non_detection_image_path=non_detect,
                                        row_detections=2,
                                        nframes=30,
                                        video_name="30_alternated_2-1_video.avi")
except Exception as e:
    print("could not create test videos for device ", e)

