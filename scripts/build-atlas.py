"""Compile native indexed pixel source into deterministic PNG atlases.
Requires Python 3 only. No image editor, fuzzy mask or colour detection.
"""
import json, struct, zlib, pathlib, hashlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
source=json.loads((ROOT/'art/sprites.json').read_text())
COLORS=['原色','薄荷','绯红','月蓝','紫晶','金辉','极光','琉璃','夜曜']
RAMPS=[None,['#286853','#419779','#7fcdb1','#b2e1cc'],['#7b283f','#bb4058','#e77580','#f6b3b1'],['#284c80','#447db8','#7cadde','#bedbf1'],['#543b7b','#8659b0','#ba8cdb','#dfbeed'],['#855220','#c18a32','#e8b959','#f5dda0'],['#225c60','#359b9b','#76d5c4','#b0e6d6'],['#344a8c','#596fca','#99b6ef','#d0def6'],['#352e50','#5f4b7c','#9479b2','#ccb9da']]
FIXED={'0':(0,0,0,0),'o':'#252635','f':'#d5c7a3','g':'#a99e86','h':'#f0e7cc','w':'#fff8e5','e':'#20202c','k':'#454251','y':'#f3d17a','p':'#d899ad'}
def rgba(c):
 if isinstance(c,tuple):return c
 return tuple(bytes.fromhex(c[1:]))+(255,)
def ramp(base):
 rgb=bytes.fromhex(base[1:]);return ['#'+''.join(f'{max(0,min(255,round(c*m+b))):02x}' for c in rgb) for m,b in [(.67,0),(1,0),(.85,48),(.7,90)]]
def png(path,w,h,data):
 def chunk(t,d):return struct.pack('>I',len(d))+t+d+struct.pack('>I',zlib.crc32(t+d))
 scan=b''.join(b'\0'+bytes(data[y*w*4:(y+1)*w*4]) for y in range(h))
 path.write_bytes(b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',w,h,8,6,0,0,0))+chunk(b'IDAT',zlib.compress(scan,9))+chunk(b'IEND',b''))
W=H=640;variants=[]
for ci in range(9):
 data=bytearray(W*H*4)
 for s in source['species']:
  palette={k:rgba(v) for k,v in FIXED.items()};palette.update(zip('abcd',map(rgba,RAMPS[ci] or ramp(s['base']))))
  for y,row in enumerate(s['pixels']):
   for x,c in enumerate(row):
    for dy in range(2):
     for dx in range(2):
      pos=(((s['id']//8)*80+y*2+dy)*W+(s['id']%8)*80+x*2+dx)*4
      data[pos:pos+4]=palette[c]
 variants.append(data)
 path=ROOT/('monster-atlas.png' if ci==0 else f'assets/monster-atlas-{ci}.png');png(path,W,H,data)
# Exhaustive invariant: a fixed pixel and transparency must be byte-identical across every colour.
count=0
for s in source['species']:
 assert len(s['pixels'])==40 and all(len(row)==40 for row in s['pixels'])
 assert any(c in 'abcd' for row in s['pixels'] for c in row),s['name']
 for y,row in enumerate(s['pixels']):
  for x,c in enumerate(row):
   pos=(((s['id']//8)*80+y*2)*W+(s['id']%8)*80+x*2)*4
   if c not in 'abcd':
    assert all(d[pos:pos+4]==variants[0][pos:pos+4] for d in variants[1:]),(s['name'],x,y)
    count+=1
# Standalone exact review board: all species, all colours, fixed pixels adjacent for comparison.
rows=[]
for s in source['species']:
 cells=''.join(f'<td><span class="art" style="background-image:url(../'+('monster-atlas.png' if ci==0 else f'assets/monster-atlas-{ci}.png')+f');background-position:{(s["id"]%8)/7*100}% {(s["id"]//8)/7*100}%"></span></td>' for ci in range(9))
 rows.append(f'<tr><th>{s["id"]+1:02} {s["name"]}<small>{s["variableRegion"]}</small></th>{cells}</tr>')
html='''<!doctype html><meta charset="utf-8"><title>Qinster 配色审查</title><style>body{background:#cbc8bc;color:#282631;font:15px system-ui;margin:24px}table{border-collapse:collapse}th,td{border:1px solid #a09c91;padding:5px;text-align:center}thead{position:sticky;top:0;background:#e9e1ce;z-index:1}small{display:block;font-weight:400;max-width:180px}td{background:#ded8c8}.art{display:block;width:80px;height:80px;background-size:800% 800%;image-rendering:pixelated}th{min-width:130px}</style><h1>Qinster · 配色审查</h1><p>58 个原创像素模型 × 9 色。眼睛、描边、高光与浅色固定部位不参与调色。</p><table><thead><tr><th>模型 / 可变区域</th>'''+''.join(f'<th>{c}</th>' for c in COLORS)+'</tr></thead><tbody>'+''.join(rows)+'</tbody></table>'
(ROOT/'art/review.html').write_text(html)
(ROOT/'assets/atlas-manifest.json').write_text(json.dumps({'version':189,'columns':8,'rows':8,'cellSize':80,'sourceSize':40,'speciesCount':58,'colors':COLORS,'files':['monster-atlas.png']+[f'assets/monster-atlas-{i}.png' for i in range(1,9)],'sha256':{('monster-atlas.png' if i==0 else f'assets/monster-atlas-{i}.png'):hashlib.sha256(d).hexdigest() for i,d in enumerate(variants)}},ensure_ascii=False,indent=2)+'\n')
print(f'Built 9 atlases, 58 species; {count} fixed pixels unchanged in all variants.')
