from pathlib import Path

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')
old="{id:'heart',name:'生命核心',text:'战后全队恢复 12% 远征生命',mods:{heal:.12}},"
new="{id:'heart',name:'生命核心',text:'战后全队恢复 2% 远征生命',mods:{heal:.02}},"
if old not in s:
    raise SystemExit('life core target not found')
s=s.replace(old,new,1)
for oldv in ["version:'v236-endless-floors'","version:'v235-training-result-stat'","version:'v236'"]:
    s=s.replace(oldv,"version:'v237-heart-core-2pct'")
p.write_text(s,encoding='utf-8')

for fp in ['game.js','index.html']:
    q=Path(fp)
    t=q.read_text(encoding='utf-8')
    t=t.replace('v236','v237')
    q.write_text(t,encoding='utf-8')

print('v237 life core reduced to 2 percent')
