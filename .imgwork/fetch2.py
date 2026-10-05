"""Round 2: fill missing categories, then download all candidates concurrently."""
import json, urllib.request, urllib.parse, os, time
from concurrent.futures import ThreadPoolExecutor

EXTRA = {
    'kerala_mist':   'kerala hills landscape green',
    'friends_group': 'friends group travel mountain fun',
    'resort':        'resort swimming pool mountain view',
    'adventure':     'trekking hiking group mountain adventure',
    'corporate':     'group people outdoor team travel',
    'celebration':   'people celebrating travel happy group',
    'scenic_road':   'scenic road countryside curve',
    'viewpoint':     'mountain viewpoint person standing',
    'houseboat2':    'kerala backwaters boat palm',
    'tea_worker':    'tea estate hills india green',
    'bus_travel':    'bus road travel mountain',
    'waterfall_in':  'waterfall india forest rocks',
}
UA = {'User-Agent': 'ExploreKeyDev/1.0'}

def search(q, n=10):
    url = 'https://api.openverse.org/v1/images/?' + urllib.parse.urlencode(
        {'q': q, 'page_size': n, 'license_type': 'all-cc', 'mature': 'false'})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=50) as r:
                return json.loads(r.read().decode())
        except Exception as e:
            if attempt == 2:
                print('  ERR', q, type(e).__name__)
    return {'results': []}

cands = json.load(open('candidates.json')) if os.path.exists('candidates.json') else {}
for key, q in EXTRA.items():
    if cands.get(key):
        continue
    d = search(q)
    cands[key] = [{
        'id': r['id'], 'title': (r.get('title') or '')[:70], 'url': r['url'],
        'creator': r.get('creator'), 'license': f"{r.get('license')}-{r.get('license_version')}",
        'license_url': r.get('license_url'), 'source': r.get('source'),
        'landing': r.get('foreign_landing_url'),
    } for r in d.get('results', []) if r.get('url')]
    print(f'{key:16s} {len(cands[key]):3d}')
    time.sleep(0.3)

json.dump(cands, open('candidates.json', 'w'), indent=1)
os.makedirs('pool', exist_ok=True)

jobs = []
for key, rows in cands.items():
    for i, r in enumerate(rows[:6]):
        jobs.append((f'{key}__{i}', r))

def dl(job):
    name, r = job
    path = f'pool/{name}.jpg'
    if os.path.exists(path) and os.path.getsize(path) > 20000:
        return name, True
    try:
        req = urllib.request.Request(r['url'], headers=UA)
        with urllib.request.urlopen(req, timeout=45) as resp:
            data = resp.read()
        if len(data) < 20000:
            return name, False
        open(path, 'wb').write(data)
        return name, True
    except Exception:
        return name, False

ok = 0
with ThreadPoolExecutor(max_workers=10) as ex:
    for name, good in ex.map(dl, jobs):
        ok += 1 if good else 0
print(f'downloaded {ok}/{len(jobs)}')
