import os
import cv2
from PIL import Image

# path to the Google Drive folder with images
path = "/home/iVase/software/proyectos/tfg_road_animals/road_animals/model_training/sintetic_data/test/images"
os.chdir(path)

mean_height = 0
mean_width = 0

# Counting the number of images in the directory
num_of_images = len([file for file in os.listdir('.') if file.endswith((".jpg", ".jpeg", ".png"))])
print("Number of Images:", num_of_images)

def generate_video():
    image_folder = path
    video_name = 'test_video.avi'

    images = [img for img in os.listdir(image_folder) if img.endswith((".jpg", ".jpeg", ".png"))]
    print("Images:", images)

    # Set frame from the first image
    frame = cv2.imread(os.path.join(image_folder, images[0]))
    height, width, layers = frame.shape

    # Video writer to create .avi file
    video = cv2.VideoWriter(video_name, cv2.VideoWriter_fourcc(*'DIVX'), 1, (width, height))

    # Appending images to video
    for image in images:
        video.write(cv2.imread(os.path.join(image_folder, image)))

    # Release the video file
    video.release()
    cv2.destroyAllWindows()
    print("Video generated successfully!")

# Calling the function to generate the video
generate_video()

