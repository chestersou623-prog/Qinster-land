from pathlib import Path
p=Path('scripts/check-picker.mjs')
s=p.read_text(encoding='utf-8')
old="R.setPage('expedition');w.QinsterExpedition.render();assert.ok(root('expedition'));"
new="s.expedition=s.expedition||{};s.expedition.box=s.monsters.slice(0,6).map(m=>({...m}));s.expedition.boxCapacity=10;R.setPage('expedition');w.QinsterExpedition.render();assert.ok(root('expedition'));"
assert old in s
s=s.replace(old,new,1)
s=s.replace("assert.equal(w.__qinsterVersion,'v259');","assert.equal(w.__qinsterVersion,'v267');",1)
p.write_text(s,encoding='utf-8')
print('v267 picker regression test adapted')
