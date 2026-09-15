from pathlib import Path
import json,re
p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')
old="function expeditionBoxRosterHTML(e){const pool=[...(e.box||[])];if(!pool.length)return '<p class=\"rg-note\">远征Box还是空的。请从下方牧场Box转入怪物。</p>';const cfg=R().monsterPickerConfig('远征Box',pool,"
new="function expeditionBoxRosterHTML(e){const esc=window.QinsterPicker.esc,pool=[...(e.box||[])];if(!pool.length)return '<p class=\"rg-note\">远征Box还是空的。请从下方牧场Box转入怪物。</p>';const cfg=R().monsterPickerConfig('远征Box',pool,"
assert old in s
s=s.replace(old,new,1)
old="function expeditionTransferPickerHTML(e){const s=S(),r=R(),pool=[...(s?.monsters||[])].filter(m=>m&&m.life>0);if(!pool.length)return '<p class=\"rg-note\">牧场Box没有可转入的怪物。</p>';const cfg=r.monsterPickerConfig('从牧场转入远征Box',pool,"
new="function expeditionTransferPickerHTML(e){const esc=window.QinsterPicker.esc,s=S(),r=R(),pool=[...(s?.monsters||[])].filter(m=>m&&m.life>0);if(!pool.length)return '<p class=\"rg-note\">牧场Box没有可转入的怪物。</p>';const cfg=r.monsterPickerConfig('从牧场转入远征Box',pool,"
assert old in s
s=s.replace(old,new,1)
s=s.replace("window.QinsterExpedition={render,zones:ZONES,version:'v267'};","window.QinsterExpedition={render,zones:ZONES,version:'v268'};",1)
p.write_text(s,encoding='utf-8')

g=Path('game.js'); x=g.read_text(encoding='utf-8').replace("window.__qinsterVersion='v267';","window.__qinsterVersion='v268';").replace("v267 · engine","v268 · engine")
g.write_text(x,encoding='utf-8')

i=Path('index.html'); x=i.read_text(encoding='utf-8').replace('?v=267','?v=268').replace('v267 · 等待','v268 · 等待').replace('v267 · engine','v268 · engine')
i.write_text(x,encoding='utf-8')

pkg=Path('package.json'); data=json.loads(pkg.read_text(encoding='utf-8')); data['version']='268.0.0'; pkg.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

# upgrade picker regression test to explicitly open the expedition box tab and require rendered content
cp=Path('scripts/check-picker.mjs'); t=cp.read_text(encoding='utf-8')
needle="R.setPage('expedition');w.QinsterExpedition.render();assert.ok(root('expedition'));"
repl="R.setPage('expedition');w.QinsterExpedition.render();assert.ok(root('expedition'));click(w.document.querySelector('[data-rg-idle-tab=\\\"box\\\"]'));assert.match(w.document.querySelector('#expedition-content').textContent,/远征Box/);click(w.document.querySelector('[data-rg-idle-tab=\\\"run\\\"]'));"
assert needle in t
t=t.replace(needle,repl,1).replace("assert.equal(w.__qinsterVersion,'v267');","assert.equal(w.__qinsterVersion,'v268');")
cp.write_text(t,encoding='utf-8')
print('v268 expedition box open fix applied')