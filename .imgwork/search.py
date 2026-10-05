"""Search Openverse for CC-licensed South India travel photography.
Records full attribution metadata (required for CC-BY)."""
import json, urllib.request, urllib.parse, time, os

QUERIES = {
    'munnar_tea':      'munnar tea plantation hills',
    'kerala_mist':     'western ghats misty mountains kerala',
    'vagamon':         'vagamon meadows kerala',
    'wayanad':         'wayanad kerala forest',
    'coorg':           'coorg coffee plantation karnataka',
    'ooty':            'ooty nilgiris tamil nadu hills',
    'goa_beach':       'goa beach palm sunset india',
    'alleppey':        'alleppey houseboat kerala backwaters',
    'hill_road':       'winding mountain road ghats india',
    'tea_rows':        'tea garden rows plantation india',
    'bus_group':       'tour bus travel group india',
    'students':        'college students group trip india',
    'couple_resort':   'couple resort mountain view honeymoon',
    'campfire':        'campfire night mountains tent',
    'jeep_safari':     'jeep safari forest india',
    'mountain_fog':    'fog mountain layers valley morning',
}

def search(q, n=12):
    url = 'https://api.openverse.org/v1/images/?' + urllib.parse.urlencode({
        'q': q, 'page_size': n, 'license_type': 'all-cc', 'mature': 'false',
    })
    req = urllib.request.Request(url, headers={'User-Agent': 'ExploreKeyDev/1.0'})
    try:
        with urllib.request.urlopen(req, timeout=45) as r:
            return json.loads(r.read().decode())
    except Exception as e:
        print('  ERR', q, e)
        return {'results': []}

out = {}
for key, q in QUERIES.items():
    data = search(q)
    rows = []
    for r in data.get('results', []):
        if not r.get('url'):
            continue
        rows.append({
            'id': r['id'], 'title': (r.get('title') or '')[:70],
            'url': r['url'], 'creator': r.get('creator'),
            'license': f"{r.get('license')}-{r.get('license_version')}",
            'license_url': r.get('license_url'),
            'source': r.get('source'), 'landing': r.get('foreign_landing_url'),
        })
    out[key] = rows
    print(f'{key:16s} {len(rows):3d} results')
    time.sleep(0.4)

json.dump(out, open('candidates.json', 'w'), indent=1)
print('total groups', len(out))
