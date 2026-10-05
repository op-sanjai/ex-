"""Re-source using ONLY licenses that permit commercial use AND modification
(cropping/resizing). Openverse license_type=commercial,modification restricts to
CC0 / PDM / BY / BY-SA — no NC, no ND."""
import json, urllib.request, urllib.parse, os, time
from concurrent.futures import ThreadPoolExecutor

QUERIES = {
    'munnar_tea':   'munnar tea plantation hills kerala',
    'tea_rows':     'tea garden estate rows india',
    'kerala_green': 'kerala green hills landscape',
    'vagamon':      'vagamon idukki meadows',
    'wayanad':      'wayanad kerala forest hills',
    'forest_mist':  'misty forest trail sunlight tropical',
    'coorg':        'coorg kodagu karnataka hills',
    'waterfall':    'waterfall india forest green',
    'ooty':         'ooty nilgiri hills tamil nadu',
    'hill_road':    'winding hill road ghats india',
    'goa':          'goa beach palm india',
    'beach_sun':    'tropical beach sunset palm',
    'alleppey':     'alleppey backwaters houseboat kerala',
    'backwater':    'kerala backwaters canal palm boat',
    'campfire':     'campfire tent night camping',
    'group_trek':   'group hikers trekking mountain',
    'jeep':         'jeep offroad forest track',
    'viewpoint':    'mountain viewpoint layers haze',
    'resort':       'resort pool palm holiday',
    'bus':          'bus travel road india',
    'people_trip':  'friends travelling together outdoor',
    'wildlife':     'deer wildlife sanctuary india',
}
UA = {'User-Agent': 'ExploreKeyDev/1.0'}
SAFE_PREFIX = ('cc0', 'pdm', 'by-2', 'by-3', 'by-4', 'by-sa')

def is_safe(lic):
    l = (lic or '').lower()
    if 'nc' in l.split('-') or 'nd' in l.split('-'):
        return False
    return l.startswith(SAFE_PREFIX) or l in ('cc0-1.0', 'pdm-1.0')

def search(q, n=14):
    url = 'https://api.openverse.org/v1/images/?' + urllib.parse.urlencode({
        'q': q, 'page_size': n,
        'license_type': 'commercial,modification',   # excludes NC and ND
        'mature': 'false',
    })
    for _ in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=50) as r:
                return json.loads(r.read().decode())
        except Exception:
            time.sleep(1)
    return {'results': []}

cands = {}
for key, q in QUERIES.items():
    d = search(q)
    rows = []
    for r in d.get('results', []):
        lic = f"{r.get('license')}-{r.get('license_version')}"
        if not r.get('url') or not is_safe(lic):
            continue
        rows.append({'id': r['id'], 'title': (r.get('title') or '')[:70], 'url': r['url'],
                     'creator': r.get('creator'), 'license': lic,
                     'license_url': r.get('license_url'), 'landing': r.get('foreign_landing_url')})
    cands[key] = rows
    print(f'{key:14s} {len(rows):3d} safe')
    time.sleep(0.3)

json.dump(cands, open('safe_candidates.json', 'w'), indent=1)
os.makedirs('safepool', exist_ok=True)

jobs = [(f'{k}__{i}', r) for k, rows in cands.items() for i, r in enumerate(rows[:8])]

def dl(job):
    name, r = job
    p = f'safepool/{name}.jpg'
    if os.path.exists(p) and os.path.getsize(p) > 25000:
        return True
    try:
        with urllib.request.urlopen(urllib.request.Request(r['url'], headers=UA), timeout=45) as resp:
            data = resp.read()
        if len(data) < 25000:
            return False
        open(p, 'wb').write(data)
        return True
    except Exception:
        return False

with ThreadPoolExecutor(max_workers=10) as ex:
    ok = sum(1 for g in ex.map(dl, jobs) if g)
print(f'downloaded {ok}/{len(jobs)}')
