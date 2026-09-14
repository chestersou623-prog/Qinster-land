"""Offline import of the user-approved sheet. Output editable per-pixel role maps.
Run only to reimport source; normal art builds consume the committed role maps.
User authorized deterministic extraction and palette segmentation on 2026-09-12.
"""
from PIL import Image
import numpy as np
from scipy.ndimage import binary_propagation, label
import pathlib,json,colorsys
ROOT=pathlib.Path(__file__).resolve().parents[1]
im=Image.open(ROOT/'art/source/approved-bean-eyes.png').convert('RGB')
old=json.loads((ROOT/'art/sprites.json').read_text())
XS=[5,163,320,479,638,797,957,1117,1272]
YS=[6,154,310,466,617,772,927,1083,1226]
# Explicit species palette families, not a whole-image hue filter.
families=['green','orange','blue','dark','orange','green','gold','red','brown','green','red','blue','purple','gold','cyan','brown','blue','dark','green','brown','brown','pink','green','green','brown','brown','green','brown','blue','cyan','green','blue','blue','stone','brown','dark','gold','brown','purple','purple','purple','purple','stone','blue','blue','purple','purple','dark','blue','cyan','blue','brown','blue','purple','purple','dark','purple','blue']
bands={'green':(65,175),'orange':(0,48),'blue':(185,255),'gold':(28,65),'red':(345,30),'brown':(12,55),'purple':(245,325),'cyan':(155,220),'pink':(335,30),'dark':(205,300),'stone':(20,65)}
regions=['叶片、芽与茎（脚掌固定）','红橙主体（角、火焰、脸腹固定）','蓝色主体（脸腹及白色尾尖固定）','全部深色毛区（浅脸、尾端亮纹固定）','橙色鬃毛','绿色背甲植被','金色翼羽','红色菇帽','棕色甲壳','绿色花刺毛区','珊瑚红鳍','冰蓝耳纹与尾部','紫色胶体','黄色雷鳞','青蓝蝶翼','棕色羊角','蓝紫伞盖','全部深色毛区','绿色叶片与毛区','棕色羽毛','棕色主体','粉色蜗壳','绿色叶毛','绿色叶冠与背叶','棕色毛区','棕色羽毛','绿色甲壳叶片','棕色毛区','蓝色毛区','青蓝主体','绿色虾甲','蓝色羽毛','蓝色毛区','石色主体','棕色毛区','深色羽毛','金色甲壳','棕色羊角','紫色晶簇','紫色荧岩鳞片','紫色蝶翼','紫色晶角','灰棕岩甲','蓝色毛区','蓝色主体','紫色毛区','紫色毛区','深蓝蝶翼','蓝色毛区','青蓝羊角','蓝色羽毛','棕色毛区','蓝色耳角与尾部','紫色翅膜与晶体','紫色毛区','深色羽毛','紫色晶簇','蓝色尾纹']
base=Image.new('RGBA',(1024,1024));roles=Image.new('L',(1024,1024));species=[]
for i in range(58):
 c,r=i%8,i//8
 # The caption band is excluded before background extraction.
 a=np.array(im.crop((XS[c]+3,YS[r]+3,XS[c+1]-3,YS[r+1]-24)))
 low=a.min(2);spread=a.max(2).astype(int)-low
 eligible=(low>=175)&(spread<42)
 seeds=np.zeros(eligible.shape,bool);seeds[0,:]=seeds[-1,:]=True;seeds[:,0]=seeds[:,-1]=True
 bg=binary_propagation(seeds&eligible,mask=eligible)
 opaque=~bg
 labs,n=label(opaque);counts=np.bincount(labs.ravel());opaque&=counts[labs]>=8
 rgba=np.dstack([a,opaque.astype('uint8')*255]);tile=Image.fromarray(rgba)
 # Identical placement for source and roles; retain original geometry without redraw.
 tile.thumbnail((120,112),Image.Resampling.NEAREST)
 tx=c*128+(128-tile.width)//2;ty=r*128+(128-tile.height)//2
 base.paste(tile,(tx,ty))
 p=np.array(tile);mask=np.zeros(p.shape[:2],np.uint8)
 lo,hi=bands[families[i]]
 for y in range(p.shape[0]):
  for x in range(p.shape[1]):
   rr,gg,bb,aa=map(int,p[y,x]);h,s,v=colorsys.rgb_to_hsv(rr/255,gg/255,bb/255);h*=360
   band=(lo<=h<=hi) if lo<=hi else (h>=lo or h<=hi)
   selected=aa and band and s>.18 and 55<max(rr,gg,bb)<=255 and not(min(rr,gg,bb)>175)
   if families[i]=='dark': selected=aa and 50<max(rr,gg,bb)<165 and bb>=rr and bb>=gg*.96 and max(rr,gg,bb)-min(rr,gg,bb)>6
   if families[i]=='stone':selected=aa and 65<max(rr,gg,bb)<195 and 0.04<s<.4 and band
   # Sprout feet are fixed. Ember horns and flame are fixed independently of color.
   nx=x/p.shape[1];ny=y/p.shape[0]
   if i==0 and ny>.78:selected=False
   if i==1 and (nx>.76 or s<.45):selected=False
   # Keep pale eye rims, eye highlights and black bean pupils out of every palette.
   if max(rr,gg,bb)<50 or min(rr,gg,bb)>185:selected=False
   if selected:mask[y,x]=255
 roles.paste(Image.fromarray(mask),(tx,ty))
 species.append({'id':i,'name':old['species'][i]['name'],'variableRegion':regions[i],'fixedRegion':'眼睛、描边、高光、浅色面部与各物种固定饰件','paletteFamily':families[i],'variablePixels':int((mask>0).sum())})
 assert (mask>0).any(),i
base.save(ROOT/'art/source/monsters-original.png',optimize=True)
roles.save(ROOT/'art/source/variable-regions.png',optimize=True)
(ROOT/'art/sprites.json').write_text(json.dumps({'version':190,'width':128,'height':128,'species':species},ensure_ascii=False,indent=2)+'\n')
print('Extracted 58 original sprites and explicit editable role map.')
