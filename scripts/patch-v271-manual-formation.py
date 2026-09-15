from pathlib import Path
p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

old="function monCard(m,run,i){const hp=hpPct(run,m.id),pos=['前卫','中卫','后卫'][i],bs=battleSkillFor(m);return `<div class=\"rg-mon\">${R()?.sprite?.(m.species,m.tint,m.shiny,m.specialColor)||''}<b>${monsterName(m)} ${stars(m)}${m.shiny?' ✦':''}</b><small>${pos} · ${STAT.map((x,j)=>x+st(m)[j]).join(' · ')}</small><small style=\"color:#6d2a73\">战斗技能：${bs.name} · ${bs.text}</small><div class=\"rg-hp\"><i style=\"width:${hp}%\"></i></div><small>远征生命 ${Math.round(hp)}% · 牧场生命 ${Math.max(0,Number(m.life)||0)}${run.knockouts?.[m.id]?' · 本局倒下 '+run.knockouts[m.id]+'次':''}${run.permaDead?.[m.id]?' · 已死亡':''}</small></div>`}"
new="function monCard(m,run,i){const hp=hpPct(run,m.id),pos=['前卫','中卫','后卫'][i],bs=battleSkillFor(m),v=st(m);return `<div class=\"rg-mon\">${R()?.sprite?.(m.species,m.tint,m.shiny,m.specialColor)||''}<b>${monsterName(m)} ${stars(m)}${m.shiny?' ✦':''}</b><small>${pos} · ${STAT.map((x,j)=>x+fmt2(v[j])).join(' · ')}</small><small style=\"color:#6d2a73\">战斗技能：${bs.name} · ${bs.text}</small><div class=\"rg-position-picks\" style=\"display:grid;grid-template-columns:repeat(3,1fr);gap:3px;margin:5px 0\">${['前卫','中卫','后卫'].map((name,j)=>`<button type=\"button\" class=\"secondary ${i===j?'on':''}\" data-rg-set-position=\"${j}\" data-rg-monster-id=\"${m.id}\" ${i===j?'disabled':''} style=\"padding:4px 2px;font-size:10px\">${name}</button>`).join('')}</div><div class=\"rg-hp\"><i style=\"width:${hp}%\"></i></div><small>远征生命 ${Math.round(hp)}% · 牧场生命 ${Math.max(0,Number(m.life)||0)}${run.knockouts?.[m.id]?' · 本局倒下 '+run.knockouts[m.id]+'次':''}${run.permaDead?.[m.id]?' · 已死亡':''}</small></div>`}"
assert old in s,'monCard marker missing'
s=s.replace(old,new,1)

old="function rotateFormation(run){run.teamIds.push(run.teamIds.shift());save('已调整阵型。')}"
new="function rotateFormation(run){run.teamIds.push(run.teamIds.shift());save('已调整阵型。')}\nfunction setFormationPosition(run,id,target){if(!run||!Array.isArray(run.teamIds))return;id=Number(id);target=Math.max(0,Math.min(2,Number(target)||0));const from=run.teamIds.findIndex(x=>Number(x)===id);if(from<0||from===target)return;[run.teamIds[from],run.teamIds[target]]=[run.teamIds[target],run.teamIds[from]];save(`${monsterName(persistentMonster(id))} 已调整为${['前卫','中卫','后卫'][target]}。`)}"
assert old in s,'rotate marker missing'
s=s.replace(old,new,1)

old="function teamHTML(run){const t=activeTeam(run);return `<section class=\"rg-panel\"><div class=\"rg-title\"><div><b>自走棋阵型</b><small>前卫承担主要火力；倒下后中卫自动补位，再由后卫补上。部分遗物会强化站位</small></div><button class=\"secondary\" data-rg-rotate>轮换阵型</button></div><div class=\"rg-team\">${[...t].reverse().map((m,vi)=>monCard(m,run,t.length-1-vi)).join('')}</div></section>`}"
new="function teamHTML(run){const t=activeTeam(run);return `<section class=\"rg-panel\"><div class=\"rg-title\"><div><b>自走棋阵型</b><small>每只怪物可直接选择前卫 / 中卫 / 后卫；目标位置已有怪物时会自动对调。前卫倒下后仍由中卫补位，再由后卫补上。</small></div><span>点击卡片内位置按钮调整</span></div><div class=\"rg-team\">${[...t].reverse().map((m,vi)=>monCard(m,run,t.length-1-vi)).join('')}</div></section>`}"
assert old in s,'teamHTML marker missing'
s=s.replace(old,new,1)

old="document.addEventListener('click',ev=>{const ps=ev.target.closest?.('[data-rg-picker-slot]');"
new="document.addEventListener('click',ev=>{const fp=ev.target.closest?.('[data-rg-set-position]');if(fp){const run=ensure()?.rogueActive;if(run)setFormationPosition(run,fp.dataset.rgMonsterId,fp.dataset.rgSetPosition);return}const ps=ev.target.closest?.('[data-rg-picker-slot]');"
assert old in s,'click handler marker missing'
s=s.replace(old,new,1)

p.write_text(s,encoding='utf-8')
print('v271 manual formation patch applied')
