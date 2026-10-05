from PIL import Image, ImageDraw
import os, glob

files = sorted(glob.glob('raw/*.jpg'))
cols, tw, th = 4, 460, 300
rows = (len(files) + cols - 1) // cols
sheet = Image.new('RGB', (cols*tw, rows*(th+26)), (20,20,20))
d = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    try:
        im = Image.open(f).convert('RGB')
    except Exception as e:
        print('FAIL', f, e); continue
    w0,h0 = im.size
    im.thumbnail((tw, th))
    x = (i%cols)*tw; y = (i//cols)*(th+26)
    sheet.paste(im, (x + (tw-im.size[0])//2, y+26))
    d.text((x+6, y+8), f"{i}: {os.path.basename(f)[:34]} {w0}x{h0}", fill=(255,255,120))
sheet.save('contact.png')
print('saved', sheet.size, 'count', len(files))
