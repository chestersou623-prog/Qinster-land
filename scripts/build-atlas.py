"""Build pre-generated color atlases from original RGBA + explicit pixel role map.
Normal builds NEVER infer masks: edit art/source/variable-regions.png to edit roles.
"""
from PIL import Image
import numpy as np
import json,pathlib,hashlib,colorsys,io
ROOT=pathlib.Path(__file__).resolve().parents[1]
source=json.loads((ROOT/'art/sprites.json').read_text())
COLORS=['原色','薄荷','绯红','月蓝','紫晶','金辉','极光','琉璃','夜曜']
TARGETS=[None,(.43,.55),(.97,.65),(.59,.62),(.76,.55),(.11,.72),(.49,.65),(.64,.56),(.75,.40)]
original=np.array(Image.open(ROOT/'art/source/monsters-original.png').convert('RGBA'))
original[original[:,:,3]==0]=0
mask=np.array(Image.open(ROOT/'art/source/variable-regions.png').convert('L'))>127
assert original.shape==(1024,1024,4)
assert not np.any(mask & (original[:,:,3]==0))
variants=[]
for ci in range(9):
 data=original.copy()
 if ci:
  h,s=TARGETS[ci]
  for y,x in zip(*np.where(mask)):
   rgb=original[y,x,:3]/255
   _,_,value=colorsys.rgb_to_hsv(*rgb)
   # A species-selected palette ramp preserves shading; fixed pixels are untouched.
   value=.24+.72*value
   data[y,x,:3]=[round(v*255) for v in colorsys.hsv_to_rgb(h,s,value)]
 assert np.array_equal(data[~mask],original[~mask])
 assert np.array_equal(data[:,:,3],original[:,:,3])
 variants.append(data.tobytes())
 buffer=io.BytesIO();Image.fromarray(data).save(buffer,format='PNG',optimize=True)
 path=ROOT/('monster-atlas.png' if ci==0 else f'assets/monster-atlas-{ci}.png')
 path.write_bytes(buffer.getvalue())
 with Image.open(path) as check: check.load(); assert np.array_equal(np.array(check),data)
count=int((~mask).sum())
# Standalone exact review board: all species, all colours, fixed pixels adjacent for comparison.
rows=[]
for s in source['species']:
 cells=''.join(f'<td><span class="art" style="background-image:url(../'+('monster-atlas.png' if ci==0 else f'assets/monster-atlas-{ci}.png')+f');background-position:{(s["id"]%8)/7*100}% {(s["id"]//8)/7*100}%"></span></td>' for ci in range(9))
 rows.append(f'<tr><th>{s["id"]+1:02} {s["name"]}<small>{s["variableRegion"]}</small></th>{cells}</tr>')
html='''<!doctype html><meta charset="utf-8"><title>Qinster 配色审查</title><style>body{background:#cbc8bc;color:#282631;font:15px system-ui;margin:24px}table{border-collapse:collapse}th,td{border:1px solid #a09c91;padding:5px;text-align:center}thead{position:sticky;top:0;background:#e9e1ce;z-index:1}small{display:block;font-weight:400;max-width:180px}td{background:#ded8c8}.art{display:block;width:80px;height:80px;background-size:800% 800%;image-rendering:pixelated}th{min-width:130px}</style><h1>Qinster · 配色审查</h1><p>58 个原创像素模型 × 9 色。眼睛、描边、高光与浅色固定部位不参与调色。</p><table><thead><tr><th>模型 / 可变区域</th>'''+''.join(f'<th>{c}</th>' for c in COLORS)+'</tr></thead><tbody>'+''.join(rows)+'</tbody></table>'
(ROOT/'art/review.html').write_text(html)
(ROOT/'assets/atlas-manifest.json').write_text(json.dumps({'version':190,'columns':8,'rows':8,'cellSize':128,'speciesCount':58,'colors':COLORS,'source':'art/source/monsters-original.png','roleMap':'art/source/variable-regions.png','files':['monster-atlas.png']+[f'assets/monster-atlas-{i}.png' for i in range(1,9)],'sha256':{('monster-atlas.png' if i==0 else f'assets/monster-atlas-{i}.png'):hashlib.sha256(d).hexdigest() for i,d in enumerate(variants)}},ensure_ascii=False,indent=2)+'\n')
print(f'Built 9 atlases, 58 species; {count} fixed pixels unchanged in all variants.')
