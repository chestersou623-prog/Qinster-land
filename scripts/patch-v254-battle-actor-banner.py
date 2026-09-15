from pathlib import Path

repo=Path('.')
p=repo/'v201-battle-theater.js'
s=p.read_text(encoding='utf-8')
old="banner.textContent=(ev.attackType||ev.skillName||'普通攻击')+' · ACTION '+(ev.action||i+1);"
new="""const actorLabel=ev.type==='ally'?(()=>{const m=allies.find(x=>x.id===ev.actorId);return m?(name(m)+' #'+m.id):'我方怪物'})():(enemies.find(e=>e.id===ev.enemyId)?.name||'敌人');banner.textContent=actorLabel+'【'+(ev.attackType||ev.skillName||'普通攻击')+'】 · ACTION '+(ev.action||i+1);"""
if old not in s:
    raise SystemExit('banner assignment not found')
s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')

for name in ['game.js','index.html','v199-roguelike-expedition.js','v201-battle-theater.js']:
    f=repo/name
    x=f.read_text(encoding='utf-8')
    x=x.replace('v253','v254').replace('?v=253','?v=254')
    f.write_text(x,encoding='utf-8')
