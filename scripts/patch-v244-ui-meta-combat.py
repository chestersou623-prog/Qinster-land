from pathlib import Path
import re

exp=Path('v199-roguelike-expedition.js')
s=exp.read_text(encoding='utf-8')

# 1) Replace legacy supply meta with a meaningful first-battle-per-floor guard.
s=s.replace("{id:'supply',name:'先遣补给',max:3,cost:[15,30,60],text:'每级：开局补给 +1'}","{id:'vanguard',name:'先锋护符',max:3,cost:[15,30,60],text:'每级：每个楼层第一次战斗所受伤害 -3%'}",1)
s=s.replace("if(!e.metaTree)e.metaTree={atk:0,def:0,spd:0,luck:0,supply:0};","if(!e.metaTree)e.metaTree={atk:0,def:0,spd:0,luck:0,vanguard:0};if(e.metaTree.supply!=null&&e.metaTree.vanguard==null)e.metaTree.vanguard=Math.max(0,Number(e.metaTree.supply)||0);",1)
s=s.replace("function metaMods(e=ensure()){const t=e?.metaTree||{},out={};for(const k of ['atk','def','spd','luck'])out[k]=(Number(t[k])||0)*.01;out.supply=Number(t.supply)||0;return out}","function metaMods(e=ensure()){const t=e?.metaTree||{},out={};for(const k of ['atk','def','spd','luck'])out[k]=(Number(t[k])||0)*.01;out.vanguard=(Number(t.vanguard)||0)*.03;return out}",1)
s=s.replace("攻击/防御/速度/幸运每支满级仅 +5%，补给满级 +3。不会覆盖本局遗物与训练，而是作为独立的外部加成层。","攻击/防御/速度/幸运每支满级仅 +5%；先锋护符满级后，每个楼层第一次战斗所受伤害 -9%。不会覆盖本局遗物与训练，而是作为独立的外部加成层。",1)

# Keep legacy supply state harmless but remove it from visible UI and start bonuses.
s=s.replace("hp,supply:5+(metaMods(e).supply||0),relics:[]","hp,supply:5,relics:[]",1)
s=s.replace("<span>补给 ${run.supply}</span>","",1)
s=s.replace("run.supply=Math.min(7,run.supply+1+(mods.rest?1:0));run.log.push(`营地：仍站立队员恢复 ${Math.round(heal)}%，补给恢复。倒下队员可在这里选择复活。`);","run.log.push(`营地：仍站立队员恢复 ${Math.round(heal)}%。倒下队员可在这里选择复活。`);",1)

# 2) Leaderboard timestamp.
old="function ladderHTML(e){const rows=(e.leaderboard||[]).slice(0,20);return `${idleNav()}<section class=\"rg-panel\"><div class=\"rg-title\"><div><b>肉鸽积分榜</b><small>优先按积分排名；同时显示最后到达楼层</small></div><span>历史记录 ${rows.length}</span></div>${rows.length?`<div class=\"rg-log\" style=\"max-height:none;background:#232630\">${rows.map((r,i)=>`<div style=\"display:grid;grid-template-columns:40px 1fr 90px 90px;gap:8px;padding:5px;border-bottom:1px solid #484d59\"><b>#${i+1}</b><span>${r.zone||'远征'} · 难度 ${r.difficulty||0}</span><span>楼层 ${r.floor||'1-1'}</span><strong>${Math.round(r.score||0)} 分</strong></div>`).join('')}</div>`:'<p class=\"rg-note\">还没有完成过可记录的远征。</p>'}</section>`}"
new="function formatLadderTime(v){const d=new Date(Number(v)||0);if(!Number(v)||Number.isNaN(d.getTime()))return '旧记录';const p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}/${p(d.getMonth()+1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`}\nfunction ladderHTML(e){const rows=(e.leaderboard||[]).slice(0,20);return `${idleNav()}<section class=\"rg-panel\"><div class=\"rg-title\"><div><b>肉鸽积分榜</b><small>优先按积分排名；同时显示最后到达楼层与取得时间</small></div><span>历史记录 ${rows.length}</span></div>${rows.length?`<div class=\"rg-log\" style=\"max-height:none;background:#232630\">${rows.map((r,i)=>`<div style=\"display:grid;grid-template-columns:40px minmax(150px,1fr) 86px 96px 132px;gap:8px;padding:6px;border-bottom:1px solid #484d59;align-items:center\"><b>#${i+1}</b><span>${r.zone||'远征'} · 难度 ${r.difficulty||0}</span><span>楼层 ${r.floor||'1-1'}</span><strong>${Math.round(r.score||0)} 分</strong><small>${formatLadderTime(r.time)}</small></div>`).join('')}</div>`:'<p class=\"rg-note\">还没有完成过可记录的远征。</p>'}</section>`}"
if old not in s: raise SystemExit('ladderHTML anchor missing')
s=s.replace(old,new,1)

# 3) Make enemy final generated stats visually explicit.
old="function enemyUnitCardHTML(e,result=false){const pct=Math.max(0,Math.min(100,(Number(e.hp??e.maxHp)||0)/Math.max(1,Number(e.maxHp)||1)*100)),role=e.role||'normal',label=e.name||enemyRoleName(role),sprite=R()?.sprite?.(e.enemySpecies,0,role==='boss'||e.enemyShiny,null)||`<div class=\"sprite\" style=\"width:58px;height:58px;margin:auto;display:grid;place-items:center;font-size:28px\">${role==='boss'?'★':role==='elite'?'☠':'⚔'}</div>`;return `<div class=\"rg-mon rg-enemy-match rg-enemy-${role}\">${sprite}<b>${label}</b><small>HP ${Math.round(e.hp??e.maxHp)}/${e.maxHp} · 攻击 ${e.atk} · 防御 ${e.def}</small><small>速度 ${e.spd} · 幸运 ${e.luck}</small><small>${e.affixes?.length?'强化词条：'+e.affixes.join(' · '):'强化词条：无'} · 随机 ${e.variance||100}%</small><small>难度评分 ${e.difficultyRating||enemyDifficultyRating(e)}</small><div class=\"rg-hp\"><i style=\"width:${result?pct:100}%\"></i></div></div>`}"
new="function enemyUnitCardHTML(e,result=false){const pct=Math.max(0,Math.min(100,(Number(e.hp??e.maxHp)||0)/Math.max(1,Number(e.maxHp)||1)*100)),role=e.role||'normal',label=e.name||enemyRoleName(role),sprite=R()?.sprite?.(e.enemySpecies,0,role==='boss'||e.enemyShiny,null)||`<div class=\"sprite\" style=\"width:58px;height:58px;margin:auto;display:grid;place-items:center;font-size:28px\">${role==='boss'?'★':role==='elite'?'☠':'⚔'}</div>`;return `<div class=\"rg-mon rg-enemy-match rg-enemy-${role}\">${sprite}<b>${label}</b><strong class=\"rg-enemy-final-title\">最终能力</strong><div class=\"rg-enemy-final-stats\"><i><small>HP</small><b>${Math.round(e.maxHp||0)}</b></i><i><small>攻击</small><b>${Math.round(e.atk||0)}</b></i><i><small>防御</small><b>${Math.round(e.def||0)}</b></i><i><small>速度</small><b>${Math.round(e.spd||0)}</b></i><i><small>幸运</small><b>${Math.round(e.luck||0)}</b></i></div><small>${e.affixes?.length?'强化词条：'+e.affixes.join(' · '):'强化词条：无'} · 随机 ${e.variance||100}%</small><small>难度评分 ${e.difficultyRating||enemyDifficultyRating(e)}</small><div class=\"rg-hp\"><i style=\"width:${result?pct:100}%\"></i></div>${result?`<small>当前 HP ${Math.round(e.hp??e.maxHp)} / ${Math.round(e.maxHp||0)}</small>`:''}</div>`}"
if old not in s: raise SystemExit('enemy card anchor missing')
s=s.replace(old,new,1)

# Inject final-stat styling.
needle=".rg-enemy-boss{border-color:#9b2520;background:#ddc0bd;box-shadow:inset 0 0 0 2px #9b2520}"
style=needle+".rg-enemy-final-title{display:block;margin-top:5px;color:#8d2d28;font-size:10px}.rg-enemy-final-stats{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:3px;margin:5px 0}.rg-enemy-final-stats i{font-style:normal;background:#252832;color:#fff;border:1px solid #66616c;padding:3px 2px}.rg-enemy-final-stats i small,.rg-enemy-final-stats i b{display:block!important}.rg-enemy-final-stats i small{font-size:7px;color:#bbb}.rg-enemy-final-stats i b{font-size:10px;color:#f2c451}"
if needle not in s: raise SystemExit('enemy css anchor missing')
s=s.replace(needle,style,1)

# 4) First battle per floor gets vanguard damage reduction.
old="let firstGuard=true,actions=0,elapsed=0,battleScore=0;"
new="run.floorBattleSeen=run.floorBattleSeen||{};const floorKey=String(floorNo(run.stage)),firstBattleThisFloor=!run.floorBattleSeen[floorKey],vanguardGuard=firstBattleThisFloor?(metaMods().vanguard||0):0;run.floorBattleSeen[floorKey]=true;let firstGuard=true,actions=0,elapsed=0,battleScore=0;"
if old not in s: raise SystemExit('battle vars anchor missing')
s=s.replace(old,new,1)
old="let incoming=Math.max(5,en2.atk*mult-p.def*.08);if(firstGuard&&(combatMods(run).firstGuard||0)){incoming*=1-combatMods(run).firstGuard;firstGuard=false}"
new="let incoming=Math.max(5,en2.atk*mult-p.def*.08);if(vanguardGuard>0)incoming*=1-vanguardGuard;if(firstGuard&&(combatMods(run).firstGuard||0)){incoming*=1-combatMods(run).firstGuard;firstGuard=false}"
if old not in s: raise SystemExit('incoming anchor missing')
s=s.replace(old,new,1)

# 5) Explicitly tag normal attacks and skill types in both stored events and battle log.
old="events.push({type:'ally',action:actions,actorId:m.id,enemyId:target.id,enemyIndex:enemies.indexOf(target),enemyHp:target.hp,enemyMax:target.maxHp,damage:Math.round(hit),crit,miss,skillName,spd:p.spd,wait:dt,gauges:snap});logs.push(`行动 ${actions}：${monsterName(m)}${skillName?' 使用【'+skillName+'】':''} → ${target.name}${doesDamage?(miss?'，被闪避。':`，造成 ${Math.round(hit)} 伤害${crit?'（暴击）':''}`):''}${specialText}。`)"
new="const attackType=skillName?`技能·${skillName}`:'普通攻击';events.push({type:'ally',action:actions,actorId:m.id,enemyId:target.id,enemyIndex:enemies.indexOf(target),enemyHp:target.hp,enemyMax:target.maxHp,damage:Math.round(hit),crit,miss,skillName,attackType,spd:p.spd,wait:dt,gauges:snap});logs.push(`行动 ${actions}：${monsterName(m)} 使用【${attackType}】 → ${target.name}${doesDamage?(miss?'，被闪避。':`，造成 ${Math.round(hit)} 伤害${crit?'（暴击）':''}`):''}${specialText}。`)"
if old not in s: raise SystemExit('ally event anchor missing')
s=s.replace(old,new,1)
s=s.replace("skillName:'全体攻击',targets,spd:ready.spd,wait:dt,gauges:snap","skillName:'全体攻击',attackType:'全体攻击',targets,spd:ready.spd,wait:dt,gauges:snap",1)
s=s.replace("skillName:mode==='skill'?'强袭技能':'',spd:ready.spd,wait:dt,gauges:snap","skillName:mode==='skill'?'强袭技能':'',attackType:mode==='skill'?'强袭技能':'普通攻击',spd:ready.spd,wait:dt,gauges:snap",1)
s=s.replace("logs.push(`行动 ${actions}：${e.name}${mode==='skill'?' 使用【强袭技能】':''}攻击 ${monsterName(target)}${res.miss?'，但被闪避。':`，远征生命 -${Math.round(res.hpLoss)}%`}。`)","logs.push(`行动 ${actions}：${e.name} 使用【${mode==='skill'?'强袭技能':'普通攻击'}】攻击 ${monsterName(target)}${res.miss?'，但被闪避。':`，远征生命 -${Math.round(res.hpLoss)}%`}。`)",1)

# Version.
s=re.sub(r"window\.QinsterExpedition=\{render,zones:ZONES,version:'[^']+'\};","window.QinsterExpedition={render,zones:ZONES,version:'v244-combat-clarity'};",s,count=1)
exp.write_text(s,encoding='utf-8')

# Battle theater: show enemy final stats and attack/skill label during replay.
bt=Path('v201-battle-theater.js')
t=bt.read_text(encoding='utf-8')
t=t.replace("const STYLE_ID='qinster-v243-battle-theater-style';","const STYLE_ID='qinster-v244-battle-theater-style';",1)
t=t.replace(".rg-bt-unit small{display:block;background:#24212a;color:#fff3bf;border:1px solid #77717e;padding:2px 3px;margin-top:2px;font-size:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",".rg-bt-unit small{display:block;background:#24212a;color:#fff3bf;border:1px solid #77717e;padding:2px 3px;margin-top:2px;font-size:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rg-bt-finalstats{white-space:normal!important;line-height:1.35;color:#d9e1eb!important}.rg-bt-kind{display:inline-block;margin-right:5px;color:#ffe36f;font-weight:900}",1)
t=t.replace("<small>${esc(e.name||'敌人')} · 速${Math.round(e.spd||0)}</small><div class=\"rg-bt-hp\">","<small>${esc(e.name||'敌人')}</small><small class=\"rg-bt-finalstats\">最终：HP ${Math.round(e.maxHp||0)} · 攻 ${Math.round(e.atk||0)} · 防 ${Math.round(e.def||0)} · 速 ${Math.round(e.spd||0)} · 运 ${Math.round(e.luck||0)}</small><div class=\"rg-bt-hp\">",1)
t=t.replace("banner.textContent=(ev.skillName?'技能 · '+ev.skillName:'ACTION '+(ev.action||i+1));","banner.textContent=(ev.attackType||ev.skillName||'普通攻击')+' · ACTION '+(ev.action||i+1);",1)
t=t.replace("feed.innerHTML=(ev.crit?'<strong>暴击！</strong> ':'')+esc(name(allies.find(m=>m.id===ev.actorId)))+' → '","feed.innerHTML='<span class=\"rg-bt-kind\">【'+esc(ev.attackType||ev.skillName||'普通攻击')+'】</span>'+(ev.crit?'<strong>暴击！</strong> ':'')+esc(name(allies.find(m=>m.id===ev.actorId)))+' → '",1)
t=t.replace("feed.innerHTML='<strong>敌方全体攻击！</strong> 全队受到伤害'","feed.innerHTML='<span class=\"rg-bt-kind\">【'+esc(ev.attackType||'全体攻击')+'】</span><strong>敌方全体攻击！</strong> 全队受到伤害'",1)
t=t.replace("feed.innerHTML='<strong>'+esc(enemies.find(e=>e.id===ev.enemyId)?.name||'敌人')+'行动！</strong> '+","feed.innerHTML='<span class=\"rg-bt-kind\">【'+esc(ev.attackType||ev.skillName||'普通攻击')+'】</span><strong>'+esc(enemies.find(e=>e.id===ev.enemyId)?.name||'敌人')+'行动！</strong> '+",1)
bt.write_text(t,encoding='utf-8')

for fn in ['game.js','index.html']:
    p=Path(fn);x=p.read_text(encoding='utf-8');x=x.replace('v243','v244');x=x.replace('v242','v244');p.write_text(x,encoding='utf-8')
