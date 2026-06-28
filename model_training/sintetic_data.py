import os
from PIL import Image, ImageDraw
from random import randrange 
from rembg import remove
from typing import NamedTuple

class RealAnimal:
    def __init__(self, height, width) -> None:
        self.height = height 
        self.width = width
class PhotoAnimal:
    def __init__(self, height, width) -> None:
        self.height = height 
        self.width = width



BOAR_HEIGHT_METERS = 1 
BOAR_WIDTH_METERS = 1.5
DEER_HEIGHT_METERS = 1.5 
DEER_WIDTH_METERS = 2
Y_HORIZON_PRUEBA = 243
ANIMALS = {"boar": RealAnimal(BOAR_HEIGHT_METERS, BOAR_WIDTH_METERS),
           "deer": RealAnimal(DEER_HEIGHT_METERS, DEER_WIDTH_METERS)}
LABELS = ["boar", "deer"]
ROAD_LANE_WIDTH_METERS = 3.5 #width of a road lane in Spain

class img2D_dimensions (NamedTuple):
    h:int
    w:int

class position (NamedTuple):
    x:int
    y:int

def get_animal_size_px(animal_name, pos:position, y_horizon, background_dim:img2D_dimensions):
    animal = ANIMALS[animal_name]
    # we know that up close in the image the road covers aproximately all the image width
    close_px_w = background_dim.w * animal.width/(2*ROAD_LANE_WIDTH_METERS) 
    close_px_h = animal.height/animal.width * close_px_w
    # we aproximate the animal position up close so we can see the full animal
    y_close = background_dim.h - close_px_h 
    # we compute the dimensions in pixels of the animal in the position given using the horizon line and the up close estimation
    px_height = close_px_h * abs(pos.y - y_horizon) / abs(y_close - y_horizon)
    px_width = animal.width/animal.height * px_height
    return PhotoAnimal(height=round(px_height), width=round(px_width))


def get_externalObject(png_route, animal_name, background_dim:img2D_dimensions ):
    photo = Image.open(png_route).convert("RGBA")
    while True:
        animal_position = position(x=randrange(background_dim.w), y=randrange(Y_HORIZON_PRUEBA, background_dim.h))
        # animal_position = position(x=440, y=225)
        animal_size = get_animal_size_px(animal_name, animal_position, Y_HORIZON_PRUEBA, background_dim)
        if animal_size.height <  5 or animal_size.width < 5:
            continue
        if animal_size.width + animal_position.x >= background_dim.w:
            continue
        if animal_size.height + animal_position.y >= background_dim.h:
            continue
        break
    photo = photo.resize((animal_size.width, animal_size.height))
    return photo, animal_position, animal_size

def create_sintetic_image(background_route, png_animal, output_path, animal_name):
    background = Image.open(background_route).convert("RGBA")
    animal, pos, animal_size = get_externalObject(png_animal, animal_name, img2D_dimensions(h=background.height, w=background.width))
    if animal and pos and animal_size:
        print(f"pasting {animal.height, animal.width}")
        background.paste(animal.convert("RGBA"), (pos.x, pos.y), animal)
        # draw = ImageDraw.Draw(background)
        # draw.rectangle((pos.x, pos.y, pos.x + animal_size.width, pos.y + animal_size.height))
        background.convert("RGB").save(output_path, "JPEG")
    return pos, animal_size, img2D_dimensions(h=background.height, w=background.width)

def make_data_label(label, pos:position, img_dim:img2D_dimensions, animal_size:PhotoAnimal, path):
    x_min = pos.x
    x_max = pos.x + animal_size.width
    y_min = pos.y
    y_max = pos.y + animal_size.height
    assert x_min >= 0, f"corrupt coordinates {pos.x, pos.y} and dimensions phot:{img_dim.w, img_dim.h} animal:{animal_size.height, animal_size.width}"
    assert y_min >= 0, f"corrupt coordinates {pos.x, pos.y} and dimensions phot:{img_dim.w, img_dim.h} animal:{animal_size.height, animal_size.width}"
    assert y_max < img_dim.h, f"corrupt coordinates {pos.x, pos.y} and dimensions phot:{img_dim.w, img_dim.h} animal:{animal_size.height, animal_size.width}"
    assert x_max < img_dim.w, f"corrupt coordinates {pos.x, pos.y} and dimensions phot:{img_dim.w, img_dim.h} animal:{animal_size.height, animal_size.width}"

    x_center = x_min + (animal_size.width/2)
    y_center = y_min + (animal_size.height/2)

    x_center_norm = x_center / img_dim.w
    y_center_norm = y_center / img_dim.h
    box_width_norm = animal_size.width/img_dim.w
    box_height_norm = animal_size.height/img_dim.h 
    assert 0.0 <= x_center_norm < 1.0 and 0.0 <= y_center_norm < 1.0, f"corrupt coordinates {pos.x, pos.y} and dimensions phot:{img_dim.w, img_dim.h} animal:{animal_size.height, animal_size.width}"
    with open(path, "w") as f:
        f.write(f"{label} {x_center_norm} {y_center_norm} {box_width_norm} {box_height_norm}")



# def make_data_label(label, x1, y1, x2, y2, img_W, img_H, path):
#     box_width = x2 - x1
#     box_height = y2 - y1
#     x_center = x1 + box_width/2 
#     y_center = y1 + box_height/2 
#     box_width_norm = box_width / img_W
#     box_height_norm = box_height / img_H
#     x_center_norm = x_center / img_W
#     y_center_norm = y_center / img_H
#     with open(path, "w") as f:
#         f.write(f"{label} {x_center_norm} {y_center_norm} {box_width_norm} {box_height_norm}")

# def create_sintetic_image(background_route, paste_obj, output_name):
#     bk = Image.open(background_route).convert("RGBA")
#     pt = Image.open(paste_obj).convert("RGBA")
#     y_img = randrange(round(bk.height/3), bk.height - 100) 
#     x_img = randrange(200, bk.width - 200)
#     s_y, s_x = object_pxsize(y_img, y1=300, h1_px=150, y2=200, h2_px=10, real_height_meters=BOAR_HEIGHT_METERS, real_width_meters=BOAR_WIDTH_METERS)
#     pt = pt.resize((s_x,s_y))
#     pt_coords = (x_img, y_img)
#     bk.paste(pt.convert("P"), pt_coords, pt)
#     rect_coords = [x_img, y_img, x_img + s_x, y_img + s_y]
#     print(f"{x_img, y_img, s_y}")
#     bk.convert("RGB").save(f"./sintetic_data/images/{output_name}.jpg", "JPEG")
#     make_data_label(label=0,x1 = x_img, y1 = y_img, x2= x_img + s_x, y2= y_img + s_y, img_W=bk.width, img_H=bk.height, path=f"./sintetic_data/labels/{output_name}.txt")





# # using a linear estimation of the size in pixels of an object in the y_img position in the image knowing its real proportions and the height in pixels
# # of the object for two other points in the same photo
# def object_pxsize(y_img, y1, h1_px, y2, h2_px, real_height_meters, real_width_meters):
#     m = (h1_px - h2_px)/(y1 - y2)
#     h_px = h2_px + m* (y_img - y2)
#     w_px = real_width_meters/real_height_meters * h_px 
#     return round(h_px), round(w_px)

TRAIN_SPLIT = 80
VALIDATE_SPLIT = 10
TEST_SPLIT = 10
def sintetic_dataset(replication):
    # for i in range(size):
    #     pos, size, dim = create_sintetic_image(background_route="/home/iVase/Pictures/carretera-nacional.jpg", png_animal="./jabali.png", output_name=f"img_{i}", animal_name=LABELS[0])
    #     print(f"{i}: generating an animal in position {pos} with dimension {size.height, size.width}")
    #     make_data_label(0,pos, animal_size=size, img_dim=dim, path=f"./sintetic_data/labels/img_{i}")

    contador = 0
    animal_idx = 0
    current_folder = "train"
    pasted_idx = 0
    for entry in os.scandir("./animals_png"):
        if(entry.is_dir()):
            for sub_entry in os.scandir(entry.path):
                print(f"animal_inx: {pasted_idx} folder {current_folder}")
                if current_folder == "train":
                    if pasted_idx * 10 >= TRAIN_SPLIT:
                        current_folder = "validate"
                elif current_folder == "validate":
                    if pasted_idx *10 >= (TRAIN_SPLIT + VALIDATE_SPLIT):
                        current_folder = "test"
                elif current_folder == "test":
                    if pasted_idx * 10 >= (TRAIN_SPLIT + VALIDATE_SPLIT + TEST_SPLIT):
                        current_folder = "train"
                        pasted_idx = 0
                if sub_entry.is_file():
                    for i in range(replication):
                        pos, size, dim = create_sintetic_image(background_route="/home/ivan/Pictures/carretera-nacional.jpg", png_animal=sub_entry.path, output_path=f"./sintetic_data/{current_folder}/images/img_{contador}.jpg", animal_name=LABELS[animal_idx])
                        if not pos or not size or not dim:
                            continue
                        print(f"{contador}: generating a {LABELS[animal_idx]} in position {pos} with dimension {size.height, size.width}\t {sub_entry.path}")
                        make_data_label(animal_idx,pos, animal_size=size, img_dim=dim, path=f"./sintetic_data/{current_folder}/labels/img_{contador}.txt")
                        contador += 1
                    pasted_idx += 1

            animal_idx += 1
        
        


sintetic_dataset(10)



