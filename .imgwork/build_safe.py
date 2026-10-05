"""Build final hero gallery from license-safe pool (commercial + modification allowed)."""
from PIL import Image, ImageChops
import json, os, shutil

def trim_borders(im, tol=14):
    """Strip uniform letterbox / matte borders some sources ship with."""
    g = im.convert('L')
    w, h = g.size
    px = g.load()
    def row_uniform(y):
        base = px[0, y]
        return all(abs(px[x, y] - base) <= tol for x in range(0, w, max(1, w // 60)))
    def col_uniform(x):
        base = px[x, 0]
        return all(abs(px[x, y] - base) <= tol for y in range(0, h, max(1, h // 60)))
    top, bot, left, right = 0, h - 1, 0, w - 1
    while top < bot and row_uniform(top): top += 1
    while bot > top and row_uniform(bot): bot -= 1
    while left < right and col_uniform(left): left += 1
    while right > left and col_uniform(right): right -= 1
    # only trim if it removes a plausible border, never more than 25% per side
    if (right - left) < w * 0.5 or (bot - top) < h * 0.5:
        return im
    return im.crop((left, top, right + 1, bot + 1))

# (pool, slug, destination, category, alt, focal)
SEL = [
 ('munnar_tea__1',  'munnar-tea-estate',   'Munnar',  'Tea Plantations',    'Terraced tea estates rolling across the Munnar hills', .5),
 ('alleppey__5',    'alleppey-houseboat',  'Alleppey','Houseboats',         'A traditional Kerala houseboat moored on the Alleppey backwaters', .5),
 ('wayanad__0',     'wayanad-green-hills', 'Wayanad', 'Forests',            'Green forested hills rising above the Wayanad canopy', .5),
 ('goa__4',         'goa-sunset-palms',    'Goa',     'Beaches',            'Coconut palms silhouetted against a Goa sunset', .5),
 ('vagamon__0',     'vagamon-meadows',     'Vagamon', 'Hills & Meadows',    'Mist drifting over the open grassland meadows of Vagamon', .5),
 ('waterfall__0',   'coorg-waterfall',     'Coorg',   'Waterfalls',         'A tall waterfall falling through dense forest', .45),
 ('kerala_green__2','munnar-tea-path',     'Munnar',  'Scenic Roads',       'A narrow path winding down through terraced tea slopes', .5),
 ('group_trek__2',  'trek-group-hills',    'Wayanad', 'Adventure Activities','A trekking group climbing a green hillside together', .5),
 ('munnar_tea__0',  'munnar-tea-valley',   'Munnar',  'Tea Plantations',    'Wide view over the tea valleys around Munnar', .5),
 ('backwater__1',   'kerala-backwaters',   'Alleppey','Houseboats',         'A houseboat drifting along a palm-lined backwater channel', .5),
 ('wildlife__0',    'wayanad-deer',        'Wayanad', 'Jeep Safaris',       'Spotted deer standing in dappled forest light', .5),
 ('beach_sun__2',   'goa-beach-sunset',    'Goa',     'Beaches',            'Warm sunset light behind palms on a quiet beach', .5),
 ('kerala_green__3','group-tea-trail',     'Munnar',  'College Tours',      'A travel group walking a trail between tea plantations', .5),
 ('waterfall__4',   'wayanad-falls',       'Wayanad', 'Waterfalls',         'Wide cascading falls spilling over mossy rock', .5),
 ('munnar_tea__2',  'munnar-viewpoint',    'Munnar',  'Mountain Viewpoints','A viewpoint railing looking out to a distant peak', .5),
 ('resort__1',      'hill-resort-pool',    'Coorg',   'Resorts',            'A resort pool framed by palms and garden greenery', .5),
 ('kerala_green__4','kerala-lake-hills',   'Kerala',  'Kerala Landscapes',  'A quiet lake backed by green hills in the Kerala highlands', .5),
 ('wildlife__1',    'wayanad-elephant',    'Wayanad', 'Jeep Safaris',       'An elephant among the trees in a forest reserve', .5),
 ('goa__3',         'goa-beach-friends',   'Goa',     'Friends Trips',      'Friends playing together on an open beach', .5),
 ('coorg__1',       'coorg-hills',         'Coorg',   'Hills & Meadows',    'Layered green hills fading into cloud over Coorg', .5),
 ('ooty__5',        'ooty-tea-picker',     'Ooty',    'Kerala Landscapes',  'A tea estate worker among the Nilgiri tea bushes', .4),
 ('group_trek__5',  'summit-trek',         'Vagamon', 'Adventure Activities','Trekkers following a ridge path toward the summit', .5),
 ('resort__2',      'sunset-pool-stay',    'Coorg',   'Couple Trips',       'A still poolside evening under a wide sunset sky', .5),
 ('bus__3',         'group-bus-travel',    'Kerala',  'Bus Travel',         'A road-side bus on a local Indian highway', .5),
]

OUT = '../src/assets/hero-gallery'
SIZES = {'': (360, 480), '-sm': (200, 267)}
if os.path.isdir(OUT):
    shutil.rmtree(OUT)
os.makedirs(OUT, exist_ok=True)
cands = json.load(open('safe_candidates.json'))

entries, attrib, missing = [], [], []
for pool, slug, dest, cat, alt, focal in SEL:
    src = f'safepool/{pool}.jpg'
    if not os.path.exists(src):
        missing.append(pool); continue
    im = trim_borders(Image.open(src).convert('RGB'))
    w, h = im.size
    tr = 3 / 4
    if w / h > tr:
        nw, nh = int(h * tr), h
        box = ((w - nw) // 2, 0, (w - nw) // 2 + nw, nh)
    else:
        nw, nh = w, int(w / tr)
        top = int((h - nh) * focal)
        box = (0, top, nw, top + nh)
    im = im.crop(box)
    for sfx, size in SIZES.items():
        im.resize(size, Image.LANCZOS).save(f'{OUT}/{slug}{sfx}.webp', 'WEBP', quality=76, method=6)
    ckey, cidx = pool.split('__')
    m = cands[ckey][int(cidx)]
    entries.append({'id': slug, 'destination': dest, 'category': cat, 'alt': alt})
    attrib.append({'file': slug, 'title': m['title'], 'creator': m['creator'] or 'Unknown',
                   'license': m['license'], 'license_url': m['license_url'], 'source': m['landing']})

json.dump(entries, open('final_entries.json', 'w'), indent=1)
json.dump(attrib, open('final_attrib.json', 'w'), indent=1)
tot = sum(os.path.getsize(f'{OUT}/{f}') for f in os.listdir(OUT))
print(f'{len(entries)} images | {len(os.listdir(OUT))} files | {tot/1024:.0f} KB')
print('licenses used:', sorted({a['license'] for a in attrib}))
if missing: print('MISSING:', missing)
