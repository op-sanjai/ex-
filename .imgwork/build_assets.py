"""Curate -> crop 3:4 -> WebP (2 sizes) -> emit heroGallery data + attribution."""
from PIL import Image
import json, os, shutil

# (poolFile, id, destination, category, alt, focal)
# focal: vertical crop bias 0=top 0.5=center 1=bottom
SELECTION = [
    ('munnar_tea__4',  'munnar-tea-hills',    'Munnar',   'Tea Plantations',   'Rolling tea plantation hills in Munnar, Kerala', 0.45),
    ('munnar_tea__0',  'munnar-hill-road',    'Munnar',   'Scenic Roads',      'A winding hill road curving through Munnar tea country', 0.55),
    ('tea_rows__1',    'munnar-tea-garden',   'Munnar',   'Tea Plantations',   'Manicured tea garden rows shaded by tall trees', 0.5),
    ('kerala_mist__0', 'kerala-green-valley', 'Kerala',   'Kerala Landscapes', 'Green Kerala valley under a wide open sky', 0.5),
    ('vagamon__0',     'vagamon-meadows',     'Vagamon',  'Hills & Meadows',   'Soft rolling meadows above the clouds at Vagamon', 0.5),
    ('vagamon__2',     'vagamon-mist',        'Vagamon',  'Hills & Meadows',   'Morning mist drifting across the Vagamon grasslands', 0.5),
    ('wayanad__4',     'wayanad-forest-lake', 'Wayanad',  'Forests',           'Still forest lake framed by dense Wayanad greenery', 0.5),
    ('wayanad__0',     'wayanad-wildlife',    'Wayanad',  'Jeep Safaris',      'Spotted deer in the forest undergrowth at Wayanad', 0.5),
    ('jeep_safari__0', 'wayanad-misty-trail', 'Wayanad',  'Forests',           'Sunlight breaking through mist on a forest trail', 0.5),
    ('coorg__0',       'coorg-waterfall',     'Coorg',    'Waterfalls',        'A waterfall tumbling through lush Coorg forest', 0.5),
    ('waterfall_in__5','coorg-cascades',      'Coorg',    'Waterfalls',        'Wide cascading falls over mossy rocks', 0.5),
    ('scenic_road__0', 'ooty-mountain-road',  'Ooty',     'Scenic Roads',      'Empty mountain road curving through green hills', 0.55),
    ('ooty__4',        'ooty-tea-picker',     'Ooty',     'Kerala Landscapes', 'A tea estate worker among the Nilgiri tea bushes', 0.4),
    ('tea_worker__2',  'group-tea-trail',     'Munnar',   'College Tours',     'A group walking a trail through the tea estates', 0.5),
    ('goa_beach__2',   'goa-palms',           'Goa',      'Beaches',           'Coconut palms against a warm evening sky in Goa', 0.45),
    ('goa_beach__3',   'goa-beach-evening',   'Goa',      'Beaches',           'Golden light over a palm-lined Goa beach', 0.5),
    ('alleppey__5',    'alleppey-houseboat',  'Alleppey', 'Houseboats',        'A traditional houseboat on the Alleppey backwaters at dusk', 0.5),
    ('houseboat2__2',  'alleppey-backwaters', 'Alleppey', 'Houseboats',        'Palm-fringed backwater channel with moored houseboats', 0.5),
    ('campfire__5',    'campfire-night',      'Munnar',   'Campfire Evenings', 'Tents glowing around a campfire under night trees', 0.5),
    ('adventure__3',   'friends-summit',      'Wayanad',  'Friends Trips',     'A travel group gathered together at a mountain summit', 0.45),
    ('jeep_safari__2', 'jeep-trail',          'Wayanad',  'Jeep Safaris',      'View over the bonnet of a jeep on a rough forest track', 0.55),
    ('mountain_fog__3','mountain-viewpoint',  'Vagamon',  'Mountain Viewpoints','Layered blue mountain ridges fading into haze', 0.5),
    ('resort__3',      'resort-pool',         'Coorg',    'Resorts',           'A calm resort pool looking out over the hills', 0.5),
    ('bus_group__0',   'group-bus',           'Kerala',   'Bus Travel',        'A tour bus waiting on a tree-lined road', 0.5),
]

OUT = '../src/assets/hero-gallery'
SIZES = {'': (360, 480), '-sm': (200, 267)}
os.makedirs(OUT, exist_ok=True)
cands = json.load(open('candidates.json'))

def meta_for(poolname):
    cat, idx = poolname.split('__')
    return cands[cat][int(idx)]

entries, attribution, missing = [], [], []

for pool, slug, dest, category, alt, focal in SELECTION:
    src = f'pool/{pool}.jpg'
    if not os.path.exists(src):
        missing.append(pool); continue
    im = Image.open(src).convert('RGB')
    w, h = im.size
    # crop to 3:4 portrait around focal band
    target_ratio = 3 / 4
    if w / h > target_ratio:            # too wide -> crop width
        nw = int(h * target_ratio); nh = h
        left = (w - nw) // 2; top = 0
    else:                                # too tall -> crop height
        nw = w; nh = int(w / target_ratio)
        left = 0; top = int((h - nh) * focal)
    im = im.crop((left, top, left + nw, top + nh))
    for suffix, size in SIZES.items():
        im.resize(size, Image.LANCZOS).save(f'{OUT}/{slug}{suffix}.webp', 'WEBP', quality=76, method=6)
    m = meta_for(pool)
    entries.append({
        'id': slug, 'destination': dest, 'category': category, 'alt': alt,
        'objectPosition': 'center',
    })
    attribution.append({
        'file': f'{slug}.webp', 'title': m['title'], 'creator': m['creator'],
        'license': m['license'], 'license_url': m['license_url'], 'source': m['landing'],
    })

json.dump(entries, open('entries.json', 'w'), indent=1)
json.dump(attribution, open('attribution.json', 'w'), indent=1)
total = sum(os.path.getsize(f'{OUT}/{f}') for f in os.listdir(OUT))
print(f'built {len(entries)} images, {len(os.listdir(OUT))} files, {total/1024:.0f} KB total')
if missing: print('MISSING:', missing)
