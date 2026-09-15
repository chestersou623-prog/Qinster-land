from pathlib import Path
import json

# Expedition targeting
p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')
old="const roll=Math.random(),target=roll<.64?current[0]:roll<.88?(current[1]||current[0]):(current[2]||current[1]||current[0]),dedicated=mode==='skill'&&es"
new="const target=current[0],dedicated=mode==='skill'&&es"
assert old in s, 'old random target logic not found'
s=s.replace(old,new,1)
old="function speedRuleText(){return '速度决定行动条充能速度；所有参战单位会同时充能，行动条达到 100% 就立刻行动。我方每次行动独立判定：80% 普通攻击，20% 使用战斗技能。'}"
new="function speedRuleText(){return '速度决定行动条充能速度；所有参战单位会同时充能，行动条达到 100% 就立刻行动。我方每次行动独立判定：80% 普通攻击，20% 使用战斗技能。敌方单体攻击严格优先前卫，前卫倒下后攻击中卫，最后才攻击后卫；全体攻击等特殊技能除外。'}"
assert old in s
s=s.replace(old,new,1)
s=s.replace("version:'v271'","version:'v272'",1)
p.write_text(s,encoding='utf-8')

# Battle theater pacing
p=Path('v201-battle-theater.js')
t=p.read_text(encoding='utf-8')
t=t.replace("const STYLE_ID='qinster-v267-battle-theater-style'","const STYLE_ID='qinster-v272-battle-theater-style'",1)
old="duration=Math.max(180,Math.min(950,(Number(ev.wait)||.35)*1350))"
new="duration=Math.max(260,Math.min(1350,(Number(ev.wait)||.35)*1850))"
assert old in t
t=t.replace(old,new,1)
for a,b in [('await sleep(60);','await sleep(90);'),('await sleep(110);','await sleep(170);'),('await sleep(160);','await sleep(260);'),('await sleep(190);','await sleep(280);'),('await sleep(90);if(progress','await sleep(140);if(progress')]:
    assert a in t, a
    t=t.replace(a,b,1)
p.write_text(t,encoding='utf-8')

# Visible/cache versions
g=Path('game.js');u=g.read_text(encoding='utf-8');assert "__qinsterVersion='v271'" in u;g.write_text(u.replace("__qinsterVersion='v271'","__qinsterVersion='v272'",1),encoding='utf-8')
i=Path('index.html');u=i.read_text(encoding='utf-8');i.write_text(u.replace('?v=271','?v=272'),encoding='utf-8')
q=Path('package.json');data=json.loads(q.read_text(encoding='utf-8'));data['version']='272.0.0';q.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
cp=Path('scripts/check-picker.mjs');u=cp.read_text(encoding='utf-8');assert "assert.equal(w.__qinsterVersion,'v271')" in u;cp.write_text(u.replace("assert.equal(w.__qinsterVersion,'v271')","assert.equal(w.__qinsterVersion,'v272')",1),encoding='utf-8')
print('v272 patch applied')
