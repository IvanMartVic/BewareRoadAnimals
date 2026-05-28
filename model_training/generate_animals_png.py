import os

from rembg import remove
from PIL import Image
def convert_JPG_PNG(route, animal):
    image = Image.open(route)
    out = remove(image)
    bbox = out.getbbox()
    if bbox:
        out = out.crop(bbox)
    out.save(f"./animals_png/{animal}.png")

for (root, dir, files) in os.walk("./animals_in_background"):
    for f in files:
        convert_JPG_PNG(f"{root}/{f}",f)




