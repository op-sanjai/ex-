from PIL import Image, ImageDraw
import glob, os, json
files = sorted([f for f in glob.glob('../src/assets/hero-gallery/*.webp') if '-sm' not in f])
cols=8; TW,TH=150,200
rows=(len(files)+cols-1)//cols
s=Image.new('RGB',(cols*TW, rows*(TH+22)),(16,16,16)); d=ImageDraw.Draw(s)
for i,f in enumerate(files):
    im=Image.open(f).convert('RGB'); im.thumbnail((TW-6,TH-6))
    x=(i%cols)*TW; y=(i//cols)*(TH+22)
    s.paste(im,(x+3,y+20)); d.text((x+4,y+5), os.path.basename(f)[:-5][:22], fill=(255,225,120))
s.save('final_cards.png'); print('saved',len(files),'cards', s.size)
