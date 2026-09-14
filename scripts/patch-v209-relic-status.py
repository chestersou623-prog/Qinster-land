from pathlib import Path
p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')
old="function relicHTML(run){return `${runHeader(run)}${runInventoryHTML(run)}<section class=\"rg-panel\"><div class=\"rg-title\"><div><b>遗物三选一</b><small>遗物只在本次远征生效，结束后清空</small></div></div><div class=\"rg-relics\">${run.relicChoices.map(id=>{const r=RELICS.find(x=>x.id===id);return `<button class=\"secondary rg-relic\" data-rg-relic=\"${id}\"><b>${r.name}</b><span>${r.text}</span></button>`}).join('')}</div></section>`}"
new="function relicHTML(run){const owned=(run.relics||[]).map(id=>RELICS.find(x=>x.id===id)?.name).filter(Boolean);return `${runHeader(run)}${runInventoryHTML(run)}${teamHTML(run)}<section class=\"rg-panel\"><div class=\"rg-title\"><div><b>遗物三选一</b><small>先看上方队伍当前HP、站位、数值和Debuff，再决定补哪一块短板</small></div><span>${owned.length?'已有：'+owned.join(' · '):'当前无遗物'}</span></div><div class=\"rg-relics\">${run.relicChoices.map(id=>{const r=RELICS.find(x=>x.id===id);return `<button class=\"secondary rg-relic\" data-rg-relic=\"${id}\"><b>${r.name}</b><span>${r.text}</span></button>`}).join('')}</div></section>`}"
if old not in s:
    raise SystemExit('relicHTML target not found')
s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')
