from pathlib import Path
import re


def require_replace(text, old, new, label, count=1):
    if old not in text:
        raise SystemExit(f'Missing expected pattern: {label}')
    return text.replace(old, new, count)

# 1) Visible terminology and version.
for fname in ['game.js', 'v199-roguelike-expedition.js', 'v201-battle-theater.js']:
    p = Path(fname)
    s = p.read_text(encoding='utf-8')
    s = s.replace('体质', 'HP').replace('v247', 'v248')
    p.write_text(s, encoding='utf-8')

# 2) Expedition combat: stat 0 becomes the real max-HP pool.
p = Path('v199-roguelike-expedition.js')
s = p.read_text(encoding='utf-8')

s = require_replace(
    s,
    "const allyStatsSnapshot=()=>Object.fromEntries(t.map((m,i)=>{const q=cv(m,i);return[m.id,{con:Math.round(q.con||0),atk:Math.round(q.atk||0),def:Math.round(q.def||0),spd:Math.round(q.spd||0),luck:Math.round(q.luck||0)}]}));",
    "const allyStatsSnapshot=()=>Object.fromEntries(t.map((m,i)=>{const q=cv(m,i),hp=Math.max(1,Math.round(q.con||1));return[m.id,{hp,con:hp,atk:Math.round(q.atk||0),def:Math.round(q.def||0),spd:Math.round(q.spd||0),luck:Math.round(q.luck||0)}]}));",
    'ally stat snapshot'
)

old_hurt = "const hurtAlly=(enemyUnit,target,mult=1)=>{const current=t.filter(m=>hpPct(run,m.id)>0&&canReviveInRun(run,m.id)),dynPos=current.indexOf(target),p=cv(target,Math.max(0,dynPos)),en2=enemyNow(enemyUnit);if(Math.random()<dodgeChance(p.luck,en2.luck))return{targetId:target.id,hpLoss:0,hpAfter:hpPct(run,target.id),miss:true};let incoming=Math.max(5,en2.atk*mult-p.def*.08);if(vanguardGuard>0)incoming*=1-vanguardGuard;if(firstGuard&&(combatMods(run).firstGuard||0)){incoming*=1-combatMods(run).firstGuard;firstGuard=false}const hpLoss=Math.min(42,incoming/(65+p.con*.22)*100),before=hpPct(run,target.id);run.hp[target.id]=Math.max(0,before-hpLoss);if(before>0&&run.hp[target.id]<=0){gauge[target.id]=0;expeditionKnockout(run,target,logs);if(target.life>0)logs.push(`${monsterName(target)} 已倒下，只能在营地选择复活。`)}return{targetId:target.id,hpLoss,hpAfter:run.hp[target.id],miss:false}};"
new_hurt = "const hurtAlly=(enemyUnit,target,mult=1)=>{const current=t.filter(m=>hpPct(run,m.id)>0&&canReviveInRun(run,m.id)),dynPos=current.indexOf(target),p=cv(target,Math.max(0,dynPos)),en2=enemyNow(enemyUnit),maxHp=Math.max(1,Math.round(p.con||1)),beforePct=hpPct(run,target.id),beforeHp=maxHp*beforePct/100;if(Math.random()<dodgeChance(p.luck,en2.luck))return{targetId:target.id,hpLoss:0,hpDamage:0,maxHp,currentHp:Math.round(beforeHp),hpAfter:beforePct,hpAfterAbs:Math.round(beforeHp),miss:true};let incoming=Math.max(5,en2.atk*mult-p.def*.08);if(vanguardGuard>0)incoming*=1-vanguardGuard;if(firstGuard&&(combatMods(run).firstGuard||0)){incoming*=1-combatMods(run).firstGuard;firstGuard=false}const hpDamage=Math.min(maxHp*.42,incoming),afterHp=Math.max(0,beforeHp-hpDamage),hpLoss=hpDamage/maxHp*100;run.hp[target.id]=Math.max(0,afterHp/maxHp*100);if(beforePct>0&&run.hp[target.id]<=0){gauge[target.id]=0;expeditionKnockout(run,target,logs);if(target.life>0)logs.push(`${monsterName(target)} 已倒下，只能在营地选择复活。`)}return{targetId:target.id,hpLoss,hpDamage,maxHp,currentHp:Math.round(beforeHp),hpAfter:run.hp[target.id],hpAfterAbs:Math.round(afterHp),miss:false}};"
s = require_replace(s, old_hurt, new_hurt, 'hurtAlly')

s = require_replace(
    s,
    "targetId:res.targetId,hpLoss:res.hpLoss,hpAfter:res.hpAfter,miss:res.miss,skillName:",
    "targetId:res.targetId,hpLoss:res.hpLoss,hpDamage:res.hpDamage,maxHp:res.maxHp,hpAfter:res.hpAfter,hpAfterAbs:res.hpAfterAbs,miss:res.miss,skillName:",
    'enemy event HP fields'
)
s = require_replace(
    s,
    "`，远征生命 -${Math.round(res.hpLoss)}%`",
    "`，HP -${Math.round(res.hpDamage)}（${Math.round(res.hpAfterAbs)}/${Math.round(res.maxHp)}）`",
    'enemy log actual HP'
)
p.write_text(s, encoding='utf-8')

# 3) Battle theater: ally cards show actual current/max HP and actual damage numbers.
p = Path('v201-battle-theater.js')
s = p.read_text(encoding='utf-8')

# Replace only the allies.map expression in the field; regex avoids quote-format fragility.
pat = re.compile(r"\$\{allies\.map\(\(m,i\)=>\{const hp=Math\.max\(0,Math\.min\(100,Number\(b\.startHp\?\.\[m\.id\]\?\?run\.hp\?\.\[m\.id\]\)\|\|0\)\),q=b\.allyInitialStats\?\.\[m\.id\]\|\|b\.allyFinalStats\?\.\[m\.id\]\|\|\{\};return`<div class=\\?\"rg-bt-unit\\?\" data-bt-ally=\\?\"\$\{i\}\\?\">.*?</div>`\}\)\.join\(''\)\}", re.S)
replacement = "${allies.map((m,i)=>{const pct=Math.max(0,Math.min(100,Number(b.startHp?.[m.id]??run.hp?.[m.id])||0)),q=b.allyInitialStats?.[m.id]||b.allyFinalStats?.[m.id]||{},maxHp=Math.max(1,Math.round(q.hp||q.con||1)),curHp=Math.round(maxHp*pct/100);return`<div class=\"rg-bt-unit\" data-bt-ally=\"${i}\">${sprite(m.species,m.shiny)}<small>${esc(name(m))}</small><small data-bt-ally-hptext=\"${i}\">HP ${curHp} / ${maxHp}</small><small class=\"rg-bt-finalstats\" data-bt-ally-stats=\"${i}\">最终：攻 ${Math.round(q.atk||0)} · 防 ${Math.round(q.def||0)} · 速 ${Math.round(q.spd||0)} · 运 ${Math.round(q.luck||0)}</small><div class=\"rg-bt-hp\"><i style=\"width:${pct}%\"></i></div><div class=\"rg-bt-atb\"><i></i></div></div>`}).join('')}"
s2, n = pat.subn(replacement, s, count=1)
if n != 1:
    # Reliable fallback based on fixed boundaries in the current markup.
    start = s.find('${allies.map((m,i)=>')
    end = s.find("}).join('')}</div><div class=\"rg-bt-side rg-bt-enemies\">", start)
    if start < 0 or end < 0:
        raise SystemExit('Missing expected pattern: ally theater cards')
    end += len("}).join('')}")
    s2 = s[:start] + replacement + s[end:]
s = s2

old_draw = "const drawAllyStats=state=>{if(!state)return;allies.forEach((m,i)=>{const q=state[m.id],el=box.querySelector(`[data-bt-ally-stats=\"${i}\"]`);if(q&&el)el.textContent=`最终：HP ${Math.round(q.con||0)} · 攻 ${Math.round(q.atk||0)} · 防 ${Math.round(q.def||0)} · 速 ${Math.round(q.spd||0)} · 运 ${Math.round(q.luck||0)}`})};"
new_draw = "const drawAllyStats=state=>{if(!state)return;allies.forEach((m,i)=>{const q=state[m.id],el=box.querySelector(`[data-bt-ally-stats=\"${i}\"]`);if(q&&el)el.textContent=`最终：攻 ${Math.round(q.atk||0)} · 防 ${Math.round(q.def||0)} · 速 ${Math.round(q.spd||0)} · 运 ${Math.round(q.luck||0)}`})};const drawAllyHp=(id,pct,state)=>{const i=allies.findIndex(m=>m.id===id),q=state?.[id]||b.allyFinalStats?.[id]||b.allyInitialStats?.[id]||{},maxHp=Math.max(1,Math.round(q.hp||q.con||1)),curHp=Math.max(0,Math.round(maxHp*Math.max(0,Math.min(100,Number(pct)||0))/100)),el=box.querySelector(`[data-bt-ally-hptext=\"${i}\"]`);if(el)el.textContent=`HP ${curHp} / ${maxHp}`};"
s = require_replace(s, old_draw, new_draw, 'draw ally stats')

# Both AOE and single target carry the full result from hurtAlly.
s = require_replace(s, "float(box,el,'-'+Math.round(tr.hpLoss||0)+'%')", "float(box,el,'-'+Math.round(tr.hpDamage||0))", 'AOE actual HP float')
s = require_replace(s, "float(box,el,'-'+Math.round(ev.hpLoss||0)+'%')", "float(box,el,'-'+Math.round(ev.hpDamage||0))", 'single actual HP float')
s = require_replace(s, "allyHp[tr.targetId]=Math.max(0,Number(tr.hpAfter)||0);setHp(el,allyHp[tr.targetId]);", "allyHp[tr.targetId]=Math.max(0,Number(tr.hpAfter)||0);setHp(el,allyHp[tr.targetId]);drawAllyHp(tr.targetId,allyHp[tr.targetId],ev.allyStats);", 'AOE current/max HP text')
s = require_replace(s, "allyHp[ev.targetId]=Math.max(0,Number(ev.hpAfter)||0);setHp(el,allyHp[ev.targetId]);", "allyHp[ev.targetId]=Math.max(0,Number(ev.hpAfter)||0);setHp(el,allyHp[ev.targetId]);drawAllyHp(ev.targetId,allyHp[ev.targetId],ev.allyStats);", 'single current/max HP text')
s = require_replace(s, "'远征生命 -'+Math.round(ev.hpLoss||0)+'%'", "'HP -'+Math.round(ev.hpDamage||0)", 'single feed actual HP')
p.write_text(s, encoding='utf-8')

# 4) Cache-bust every runtime script and visible error/version text.
p = Path('index.html')
s = p.read_text(encoding='utf-8').replace('v247', 'v248').replace('?v=247', '?v=248').replace('体质', 'HP')
p.write_text(s, encoding='utf-8')
