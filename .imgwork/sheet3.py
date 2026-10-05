from PIL import Image, ImageDraw
import glob, os, collections, sys
files = sorted(glob.glob('safepool/*.jpg'))
g = collections.OrderedDict()
for f in files: g.setdefault(os.path.basename(f).split('__')[0], []).append(f)
cats=list(g.keys()); part=int(sys.argv[1]); chunk=cats[part*6:(part+1)*6]
TW,TH=290,200
if not chunk: sys.exit()
s=Image.new('RGB',(6*TW,len(chunk)*(TH+28)),(18,18,18)); d=ImageDraw.Draw(s)
for r,cat in enumerate(chunk):
    y=r*(TH+28); d.text((6,y+8),cat.upper(),fill=(120,255,160))
    for c,f in enumerate(g[cat][:6]):
        try: im=Image.open(f).convert('RGB')
        except Exception: continue
        w0,h0=im.size; im.thumbnail((TW-8,TH-8)); x=c*TW
        s.paste(im,(x+4,y+24))
        d.text((x+8,y+9),f"[{os.path.basename(f).split('__')[1][:-4]}] {w0}x{h0}",fill=(255,230,120))
s.save(f'safe_part{part}.png'); print('saved',f'safe_part{part}.png',chunk)
