from pathlib import Path

# --- game.js: skill filter should find a selected skill even when it lives in family slot ---
p=Path('game.js')
s=p.read_text(encoding='utf-8')
old="""function hasRosterSkill(m,filter){
  if(!filter)return true;
  return monsterSkillEntries(m).some(x=>x.id===filter);
}"""
new="""function hasRosterSkill(m,filter){
  if(!filter)return true;
  if(filter.startsWith('extra:')){
    const sid=filter.slice('extra:'.length);
    return monsterSkillEntries(m).some(x=>x.id===filter||x.id==='family:'+sid);
  }
  return monsterSkillEntries(m).some(x=>x.id===filter);
}"""
if old not in s: raise SystemExit('game.js hasRosterSkill anchor missing')
s=s.replace(old,new,1)
old="for(const sk of EXTRA_SKILLS)entries.push({value:'extra:'+sk.id,label:(sk.tone==='buff'?'Buff':'Debuff')+' · '+sk.name+' · '+sk.group});"
new="for(const sk of EXTRA_SKILLS)entries.push({value:'extra:'+sk.id,label:sk.tone==='buff'?('Buff · '+sk.name+' · '+sk.group):('Debuff · '+sk.name+' · 家族技能')});"
if old not in s: raise SystemExit('game.js populateSkillFilter anchor missing')
s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')

# --- v199: visual formation + persistent special-event result screen ---
p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

old="""function resolveChallenge(run,memberIndex){const t=activeTeam(run),m=t[memberIndex],c=run.challenge;if(!m||!c)return;const zone=z(run.zone),mods=relicMods(run),v=st(m)[c.stat],bonus=c.stat===4?(mods.luck||0)*v:c.stat===3?(mods.spd||0)*v:c.stat===2?(mods.def||0)*v:c.stat===1?(mods.atk||0)*v:0,target=70+zone.tier*58+run.stage*12,p=Math.max(.18,Math.min(.92,.52+(v+bonus-target)/Math.max(100,target)*.62));if(Math.random()<p){const gain=Math.round((700+run.stage*210)*nodeRewardScale(zone,run.stage));run.energy+=gain;run.log.push(`事件成功：${monsterName(m)} 用${STAT[c.stat]}通过判定，+${gain} 灵能。`);if(Math.random()<.30){const it=grantRunItem(run,rand(RUN_ITEMS).id);run.log.push(`额外发现：${it.name} ×1。`)}if(Math.random()<.35)offerRelic(run);else advance(run)}else{run.supply=Math.max(0,run.supply-1);run.hp[m.id]=Math.max(1,hpPct(run,m.id)-18);run.log.push(`事件失败：${monsterName(m)} 受伤 18%，补给 -1。`);if(Math.random()<.55){const pool=CURSES.filter(c=>!run.curses?.includes(c.id));if(pool.length)inflictCurse(run,rand(pool).id,run.log)}advance(run)}}"""
new="""function resolveChallenge(run,memberIndex){const t=activeTeam(run),m=t[memberIndex],c=run.challenge;if(!m||!c)return;const zone=z(run.zone),mods=relicMods(run),v=st(m)[c.stat],bonus=c.stat===4?(mods.luck||0)*v:c.stat===3?(mods.spd||0)*v:c.stat===2?(mods.def||0)*v:c.stat===1?(mods.atk||0)*v:0,target=70+zone.tier*58+run.stage*12,p=Math.max(.18,Math.min(.92,.52+(v+bonus-target)/Math.max(100,target)*.62));const success=Math.random()<p;let lines=[],after='advance';if(success){const gain=Math.round((700+run.stage*210)*nodeRewardScale(zone,run.stage));run.energy+=gain;lines.push(`事件成功：${monsterName(m)} 用${STAT[c.stat]}通过判定，+${gain} 灵能。`);if(Math.random()<.30){const it=grantRunItem(run,rand(RUN_ITEMS).id);lines.push(`额外发现：${it.name} ×1。`)}if(Math.random()<.35)after='relic'}else{run.supply=Math.max(0,run.supply-1);run.hp[m.id]=Math.max(1,hpPct(run,m.id)-18);lines.push(`事件失败：${monsterName(m)} 受伤 18%，补给 -1。`);if(Math.random()<.55){const pool=CURSES.filter(x=>!run.curses?.includes(x.id));if(pool.length){const before=run.log.length;inflictCurse(run,rand(pool).id,lines)}}}run.log.push(...lines);run.challengeResult={success,memberId:m.id,memberName:monsterName(m),stat:STAT[c.stat],value:Math.round(v+bonus),baseValue:v,target,chance:Math.round(p*100),title:c.title,lines,after};run.phase='challengeResult';save(success?'特殊事件成功！':'特殊事件失败。')}"""
if old not in s: raise SystemExit('v199 resolveChallenge anchor missing')
s=s.replace(old,new,1)

anchor="function relicHTML(run){"
insert="""function challengeResultHTML(run){const r=run.challengeResult||{},m=persistentMonster(r.memberId),tone=r.success?'#2f6d3d':'#9a2b25';return `${runHeader(run)}${runInventoryHTML(run)}${teamHTML(run)}<section class=\"rg-panel\"><div class=\"rg-title\"><div><b>${r.success?'事件成功':'事件失败'} · ${r.title||'特殊事件'}</b><small>结果会保留在本局 Log；看完后再继续路线</small></div><span style=\"color:${tone};font-weight:900\">${r.success?'SUCCESS':'FAILED'}</span></div><div class=\"rg-card\" style=\"margin-top:9px;border-left:6px solid ${tone}\"><b>${r.memberName||'怪物'} · ${r.stat||'能力'} ${r.baseValue??'-'}</b><small>本次判定值 ${r.value??'-'} · 目标约 ${r.target??'-'} · 成功率约 ${r.chance??'-'}%</small><div class=\"rg-log\" style=\"margin-top:8px;max-height:none\">${(r.lines||[]).map(x=>`<div>${x}</div>`).join('')}</div></div><button class=\"primary rg-mainbtn\" data-rg-event-continue>继续远征</button></section>`}
function continueChallenge(run){const r=run.challengeResult;if(!r)return;const after=r.after;run.challengeResult=null;run.challenge=null;if(after==='relic')offerRelic(run);else advance(run)}
"""+anchor
if anchor not in s: raise SystemExit('v199 relicHTML anchor missing')
s=s.replace(anchor,insert,1)

old="function activeHTML(run){if(run.phase==='battlePreview')return battlePreviewHTML(run);if(run.phase==='battleResult')return battleHTML(run);if(run.phase==='challenge')return challengeHTML(run);if(run.phase==='relic')return relicHTML(run);"
new="function activeHTML(run){if(run.phase==='battlePreview')return battlePreviewHTML(run);if(run.phase==='battleResult')return battleHTML(run);if(run.phase==='challenge')return challengeHTML(run);if(run.phase==='challengeResult')return challengeResultHTML(run);if(run.phase==='relic')return relicHTML(run);"
if old not in s: raise SystemExit('v199 activeHTML anchor missing')
s=s.replace(old,new,1)

# Visual order only: back -> middle -> front, so front is nearest enemy on the right.
s=s.replace("<div class=\"rg-team\">${t.map((m,i)=>monCard(m,run,i)).join('')}</div>","<div class=\"rg-team\">${[...t].reverse().map((m,vi)=>monCard(m,run,t.length-1-vi)).join('')}</div>")
s=s.replace("<div class=\"rg-battle\"><div class=\"rg-team\">${t.map((m,i)=>monCard(m,run,i)).join('')}</div>","<div class=\"rg-battle\"><div class=\"rg-team\">${[...t].reverse().map((m,vi)=>monCard(m,run,t.length-1-vi)).join('')}</div>")
s=s.replace("${team().map((m,i)=>`<div class=\"rg-mon\">${R()?.sprite?.(m.species,m.tint,m.shiny,m.specialColor)||''}<b>${monsterName(m)} ${stars(m)}</b><small>${['前卫','中卫','后卫'][i]} · 总能力 ${st(m).reduce((a,b)=>a+b,0)}</small></div>`).join('')}","${[...team()].reverse().map((m,vi)=>{const i=team().length-1-vi;return `<div class=\"rg-mon\">${R()?.sprite?.(m.species,m.tint,m.shiny,m.specialColor)||''}<b>${monsterName(m)} ${stars(m)}</b><small>${['前卫','中卫','后卫'][i]} · 总能力 ${st(m).reduce((a,b)=>a+b,0)}</small></div>`}).join('')}")

old="const em=ev.target.closest?.('[data-rg-event-member]');if(em){const run=ensure()?.rogueActive;if(run)resolveChallenge(run,Number(em.dataset.rgEventMember));return}const rel="
new="const em=ev.target.closest?.('[data-rg-event-member]');if(em){const run=ensure()?.rogueActive;if(run)resolveChallenge(run,Number(em.dataset.rgEventMember));return}if(ev.target.closest?.('[data-rg-event-continue]')){const run=ensure()?.rogueActive;if(run)continueChallenge(run);return}const rel="
if old not in s: raise SystemExit('v199 click event anchor missing')
s=s.replace(old,new,1)
s=s.replace("version:'v217-fragment-stat-guarantee'","version:'v218-filter-formation-events'")
p.write_text(s,encoding='utf-8')

# --- v201 battle theater: reverse only the visual layout, not the actor IDs/order ---
p=Path('v201-battle-theater.js')
s=p.read_text(encoding='utf-8')
old=".rg-bt-gauges{display:grid;grid-template-columns:minmax(0,1fr) 150px;gap:10px;margin:7px 0;padding:6px;background:#1d1a22;border:2px solid #57525e}.rg-bt-gauge-allies{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}"
new=".rg-bt-gauges{display:grid;grid-template-columns:minmax(0,1fr) 150px;gap:10px;margin:7px 0;padding:6px;background:#1d1a22;border:2px solid #57525e}.rg-bt-gauge-allies{display:flex;flex-direction:row-reverse;gap:5px}.rg-bt-gauge-allies>.rg-bt-gauge{flex:1}"
if old not in s: raise SystemExit('v201 gauge css anchor missing')
s=s.replace(old,new,1)
old=".rg-bt-side{position:absolute;inset:0;display:flex;align-items:flex-end;pointer-events:none}.rg-bt-allies{left:4%;right:51%;justify-content:space-around;padding-bottom:28px}"
new=".rg-bt-side{position:absolute;inset:0;display:flex;align-items:flex-end;pointer-events:none}.rg-bt-allies{left:4%;right:51%;justify-content:space-around;flex-direction:row-reverse;padding-bottom:28px}"
if old not in s: raise SystemExit('v201 allies css anchor missing')
s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')
