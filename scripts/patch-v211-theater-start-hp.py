from pathlib import Path

p=Path('v201-battle-theater.js')
s=p.read_text(encoding='utf-8')

old='''${t.map((m,i)=>`<div class="rg-bt-unit" data-bt-ally="${i}">${sprite(m.species,m.shiny)}<small>${esc(name(m))}</small><div class="rg-bt-hp"><i style="width:100%"></i></div></div>`).join('')}'''
new='''${t.map((m,i)=>{const startHp=Math.max(0,Math.min(100,Number(run.hp?.[m.id])||0));return `<div class="rg-bt-unit" data-bt-ally="${i}">${sprite(m.species,m.shiny)}<small>${esc(name(m))}</small><div class="rg-bt-hp"><i style="width:${startHp}%"></i></div></div>`}).join('')}'''
if old not in s:
    raise SystemExit('mount ally hp target not found')
s=s.replace(old,new,1)

old2='''let speed=1,skip=false,enemyHp=100,allyHp=team(run).map(()=>100),round=1;'''
new2='''let speed=1,skip=false,enemyHp=100,allyHp=team(run).map(m=>Math.max(0,Math.min(100,Number(run.hp?.[m.id])||0))),round=1;'''
if old2 not in s:
    raise SystemExit('play ally hp target not found')
s=s.replace(old2,new2,1)

p.write_text(s,encoding='utf-8')
