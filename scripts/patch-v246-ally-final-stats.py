from pathlib import Path


def rep(text, old, new, label):
    if old not in text:
        raise SystemExit(f'missing anchor: {label}')
    return text.replace(old, new, 1)

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

old="""  const cv=(m,pos)=>{const p=combatValue(m,pos,run);return{...p,atk:p.atk*(1+allyBuff.atk),def:p.def*(1+allyBuff.def),spd:p.spd*(1+allyBuff.spd),luck:p.luck*(1+allyBuff.luck)}};\n"""
new=old+"""  const allyStatsSnapshot=()=>Object.fromEntries(t.map((m,i)=>{const q=cv(m,i);return[m.id,{con:Math.round(q.con||0),atk:Math.round(q.atk||0),def:Math.round(q.def||0),spd:Math.round(q.spd||0),luck:Math.round(q.luck||0)}]}));\n  const allyInitialStats=allyStatsSnapshot();\n"""
s=rep(s,old,new,'ally stats helper')

s=rep(s,
"events.push({type:'ally',action:actions,actorId:m.id,enemyId:target.id,enemyIndex:enemies.indexOf(target),enemyHp:target.hp,enemyMax:target.maxHp,damage:Math.round(hit),crit,miss,skillName,attackType,spd:p.spd,wait:dt,gauges:snap});",
"events.push({type:'ally',action:actions,actorId:m.id,enemyId:target.id,enemyIndex:enemies.indexOf(target),enemyHp:target.hp,enemyMax:target.maxHp,damage:Math.round(hit),crit,miss,skillName,attackType,spd:p.spd,wait:dt,gauges:snap,allyStats:allyStatsSnapshot()});",
'ally event stats')

s=rep(s,
"events.push({type:'enemy',action:actions,enemyId:e.id,enemyIndex:enemies.indexOf(e),aoe:true,skillName:'全体攻击',attackType:'全体攻击',targets,spd:ready.spd,wait:dt,gauges:snap});",
"events.push({type:'enemy',action:actions,enemyId:e.id,enemyIndex:enemies.indexOf(e),aoe:true,skillName:'全体攻击',attackType:'全体攻击',targets,spd:ready.spd,wait:dt,gauges:snap,allyStats:allyStatsSnapshot()});",
'enemy aoe stats')

s=rep(s,
"events.push({type:'enemy',action:actions,enemyId:e.id,enemyIndex:enemies.indexOf(e),targetId:res.targetId,hpLoss:res.hpLoss,hpAfter:res.hpAfter,miss:res.miss,skillName:mode==='skill'?'强袭技能':'',attackType:mode==='skill'?'强袭技能':'普通攻击',spd:ready.spd,wait:dt,gauges:snap});",
"events.push({type:'enemy',action:actions,enemyId:e.id,enemyIndex:enemies.indexOf(e),targetId:res.targetId,hpLoss:res.hpLoss,hpAfter:res.hpAfter,miss:res.miss,skillName:mode==='skill'?'强袭技能':'',attackType:mode==='skill'?'强袭技能':'普通攻击',spd:ready.spd,wait:dt,gauges:snap,allyStats:allyStatsSnapshot()});",
'enemy single stats')

old="run.battle={kind,atb:true,actions,rounds:actions,elapsed,enemyMax,enemyHp,enemyAtk:primary.atk"
new="run.battle={kind,atb:true,actions,rounds:actions,elapsed,allyInitialStats,allyFinalStats:allyStatsSnapshot(),enemyMax,enemyHp,enemyAtk:primary.atk"
s=rep(s,old,new,'battle payload ally stats')
p.write_text(s,encoding='utf-8')

p=Path('v201-battle-theater.js')
s=p.read_text(encoding='utf-8')
s=s.replace("qinster-v244-battle-theater-style","qinster-v246-battle-theater-style")

old="""${allies.map((m,i)=>{const hp=Math.max(0,Math.min(100,Number(b.startHp?.[m.id]??run.hp?.[m.id])||0));return`<div class=\"rg-bt-unit\" data-bt-ally=\"${i}\">${sprite(m.species,m.shiny)}<small>${esc(name(m))}</small><div class=\"rg-bt-hp\"><i style=\"width:${hp}%\"></i></div><div class=\"rg-bt-atb\"><i></i></div></div>`}).join('')}"""
new="""${allies.map((m,i)=>{const hp=Math.max(0,Math.min(100,Number(b.startHp?.[m.id]??run.hp?.[m.id])||0)),q=b.allyInitialStats?.[m.id]||b.allyFinalStats?.[m.id]||{};return`<div class=\"rg-bt-unit\" data-bt-ally=\"${i}\">${sprite(m.species,m.shiny)}<small>${esc(name(m))}</small><small class=\"rg-bt-finalstats\" data-bt-ally-stats=\"${i}\">最终：体 ${Math.round(q.con||0)} · 攻 ${Math.round(q.atk||0)} · 防 ${Math.round(q.def||0)} · 速 ${Math.round(q.spd||0)} · 运 ${Math.round(q.luck||0)}</small><div class=\"rg-bt-hp\"><i style=\"width:${hp}%\"></i></div><div class=\"rg-bt-atb\"><i></i></div></div>`}).join('')}"""
s=rep(s,old,new,'ally theater stats row')

old="""  const drawGauges=state=>{allies.forEach((m,i)=>setAtb(box.querySelector(`[data-bt-ally=\"${i}\"]`),state.allies?.[m.id]||0));enemies.forEach(e=>setAtb(box.querySelector(`[data-bt-enemy=\"${e.id}\"]`),state.enemies?.[e.id]||0))};\n"""
new=old+"""  const drawAllyStats=state=>{if(!state)return;allies.forEach((m,i)=>{const q=state[m.id],el=box.querySelector(`[data-bt-ally-stats=\"${i}\"]`);if(q&&el)el.textContent=`最终：体 ${Math.round(q.con||0)} · 攻 ${Math.round(q.atk||0)} · 防 ${Math.round(q.def||0)} · 速 ${Math.round(q.spd||0)} · 运 ${Math.round(q.luck||0)}`})};\n"""
s=rep(s,old,new,'draw ally stats helper')

old="for(let i=0;i<events.length;i++){const ev=events[i];if(skip||battleKey(currentRun())!==key)break;banner.textContent="
new="for(let i=0;i<events.length;i++){const ev=events[i];if(skip||battleKey(currentRun())!==key)break;drawAllyStats(ev.allyStats);banner.textContent="
s=rep(s,old,new,'live ally stats update')
p.write_text(s,encoding='utf-8')

for fn in ['game.js','index.html']:
    p=Path(fn);s=p.read_text(encoding='utf-8')
    s=s.replace('v245','v246').replace('v244','v246')
    s=s.replace('?v=245','?v=246').replace('?v=244','?v=246')
    p.write_text(s,encoding='utf-8')

print('v246 ally final stats patched')
