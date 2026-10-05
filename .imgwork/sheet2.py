"""Contact sheets grouped by category, with index labels for curation."""
from PIL import Image, ImageDraw
import glob, os, collections, sys

files = sorted(glob.glob('pool/*.jpg'))
groups = collections.OrderedDict()
for f in files:
    cat = os.path.basename(f).split('__')[0]
    groups.setdefault(cat, []).append(f)

cats = list(groups.keys())
part = int(sys.argv[1]) if len(sys.argv) > 1 else 0
chunk = cats[part*7:(part+1)*7]

TW, TH = 300, 210
rows = []
for cat in chunk:
    rows.append((cat, groups[cat][:6]))

if not rows:
    print('no rows'); sys.exit()

W = 6*TW
H = len(rows)*(TH+30)
sheet = Image.new('RGB', (W, H), (18, 18, 18))
d = ImageDraw.Draw(sheet)

for r, (cat, fs) in enumerate(rows):
    y = r*(TH+30)
    d.text((6, y+8), cat.upper(), fill=(120, 255, 160))
    for c, f in enumerate(fs):
        try:
            im = Image.open(f).convert('RGB')
        except Exception:
            continue
        w0, h0 = im.size
        im.thumbnail((TW-8, TH-8))
        x = c*TW
        sheet.paste(im, (x+4, y+26))
        idx = os.path.basename(f).split('__')[1].split('.')[0]
        d.text((x+8, y+10), f"[{idx}] {w0}x{h0}", fill=(255, 230, 120))

sheet.save(f'sheet_part{part}.png')
print('saved', f'sheet_part{part}.png', sheet.size, 'cats:', chunk)
