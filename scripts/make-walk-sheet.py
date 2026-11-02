import math, os
from PIL import Image

# Chạy từ thư mục gốc project: python scripts/make-walk-sheet.py
SRC = 'src/assets/pixel/engineer-walk.png'
OUT_DIR = 'src/assets/pixel'
CROP = (40, 10, 1146, 1372)          # gives room for swinging limbs
SCALE = 0.42

src = Image.open(SRC).convert('RGBA').crop(CROP)
ox, oy = CROP[0], CROP[1]
W, H = src.size

def local(x, y): return (x - ox, y - oy)

# Moving parts: (name, region rect in source coords, pivot in source coords, draw layer)
PARTS = {
    'legBack':  ((0, 745, 598, 1372), (540, 745)),
    'legFront': ((598, 745, 1146, 1372), (640, 745)),
    'armBack':  ((0, 575, 440, 842), (385, 585)),
    'armFront': ((715, 575, 1146, 800), (745, 600)),
}

def region_layer(rect):
    x0, y0, x1, y1 = rect
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    part = src.crop((x0 - ox, y0 - oy, x1 - ox, y1 - oy))
    layer.paste(part, (x0 - ox, y0 - oy))
    alpha = layer.getchannel('A')
    return layer

# Static body = source minus every moving region.
static = src.copy()
for rect, _ in PARTS.values():
    x0, y0, x1, y1 = rect
    static.paste((0, 0, 0, 0), (x0 - ox, y0 - oy, x1 - ox, y1 - oy))

parts = {k: (region_layer(r), local(*p)) for k, (r, p) in PARTS.items()}

def rotated(layer, angle, pivot):
    # PIL rotates counter-clockwise for positive angles around the pivot.
    return layer.rotate(angle, resample=Image.NEAREST, center=pivot, fillcolor=(0, 0, 0, 0))

from PIL import ImageDraw
PANTS = src.getpixel((int(600 - ox), int(820 - oy)))
pelvis = Image.new('RGBA', (W, H), (0, 0, 0, 0))
ImageDraw.Draw(pelvis).polygon([(local(500, 730)), (local(690, 730)), (local(705, 800)), (local(480, 800))], fill=PANTS)

def pose(leg_front, arm_front, arm_back=None, leg_back=None):
    leg_back = -leg_front if leg_back is None else leg_back
    arm_back = -arm_front if arm_back is None else arm_back
    frame = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    layers = [
        rotated(parts['legBack'][0], leg_back, parts['legBack'][1]),
        rotated(parts['armBack'][0], arm_back, parts['armBack'][1]),
        static,
        pelvis,
        rotated(parts['legFront'][0], leg_front, parts['legFront'][1]),
        rotated(parts['armFront'][0], arm_front, parts['armFront'][1]),
    ]
    for layer in layers:
        frame.alpha_composite(layer)
    return frame

frames = []
AMP_LEG, AMP_ARM = 18, 0.6
for k in range(6):                       # one full stride, 60 degrees per frame
    p = math.radians(k * 60)
    f = math.sin(p)
    frames.append(pose(AMP_LEG * f, -AMP_ARM * AMP_LEG * f))
# Presenting pose: front arm raised toward the screen while the body stays still.
frames.append(pose(0, 55))

def crop_box(im):
    return im.getbbox()

# Common crop box so every frame aligns with the others.
boxes = [f.getchannel('A').getbbox() for f in frames]
L = min(b[0] for b in boxes); T = min(b[1] for b in boxes)
R = max(b[2] for b in boxes); B = max(b[3] for b in boxes)
frames = [f.crop((L, T, R, B)) for f in frames]
fw, fh = frames[0].size
fw2, fh2 = round(fw * SCALE), round(fh * SCALE)
sheet = Image.new('RGBA', (fw2 * len(frames), fh2), (0, 0, 0, 0))
for i, f in enumerate(frames):
    sheet.paste(f.resize((fw2, fh2), Image.LANCZOS), (i * fw2, 0))
sheet.save(os.path.join(OUT_DIR, 'engineer-sheet.webp'), lossless=True, quality=100, method=6)
print('frame', fw2, fh2, 'frames', len(frames), 'sheet', sheet.size)

