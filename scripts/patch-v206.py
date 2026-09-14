from pathlib import Path
import re

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

# 1) Add run items and debuffs definitions.
anchor="const CHALLENGES=["
insert="""const RUN_ITEMS=[
{id:'stim',name:'战斗兴奋剂',text:'下一场战斗：全队攻击 +25%',mods:{atk:.25},kind:'boost'},
{id:'armorSpray',name:'护盾喷雾',text:'下一场战斗：全队防御 +30%',mods:{def:.30},kind:'boost'},
{id:'swiftCharm',name:'迅捷符',text:'下一场战斗：全队速度 +30%',mods:{spd:.30},kind:'boost'},
{id:'luckyDie',name:'幸运骰',text:'下一场战斗：全队幸运 +35%',mods:{luck:.35},kind:'boost'},
{id:'medkit',name:'远征急救包',text:'立即恢复全队 25% 远征HP',kind:'heal'},
{id:'cleanser',name:'净化剂',text:'移除一个当前 Debuff',kind:'cleanse'}
];
const CURSES=[
{id:'weaken',name:'虚弱',text:'攻击 -15%',mods:{atk:-.15}},
{id:'breakArmor',name:'破甲',text:'防御 -15%',mods:{def:-.15}},
{id:'slow',name:'迟缓',text:'速度 -18%',mods:{spd:-.18}},
{id:'badLuck',name:'厄运',text:'幸运 -20%',mods:{luck:-.20}}
];
"""
if insert not in s:
    s=s.replace(anchor,insert+anchor,1)

# 2) Helpers + combat-only mods.
old="function relicMods(run){const out={};for(const id of run.relics||[]){const x=RELICS.find(r=>r.id===id);for(const [k,v] of Object.entries(x?.mods||{}))out[k]=(out[k]||0)+v}return out}"
new="""function relicMods(run){const out={};for(const id of run.relics||[]){const x=RELICS.find(r=>r.id===id);for(const [k,v] of Object.entries(x?.mods||{}))out[k]=(out[k]||0)+v}return out}
function ensureRunMeta(run){if(!run.items)run.items={};if(!run.curses)run.curses=[];if(!run.nextBattleMods)run.nextBattleMods={};return run}
function combatMods(run){ensureRunMeta(run);const out=relicMods(run);for(const [k,v] of Object.entries(run.nextBattleMods||{}))out[k]=(out[k]||0)+v;for(const id of run.curses||[]){const c=CURSES.find(x=>x.id===id);for(const [k,v] of Object.entries(c?.mods||{}))out[k]=(out[k]||0)+v}return out}
function grantRunItem(run,id){ensureRunMeta(run);run.items[id]=(run.items[id]||0)+1;return RUN_ITEMS.find(x=>x.id===id)}
function inflictCurse(run,id,logs=[]){ensureRunMeta(run);if(run.curses.includes(id))return null;run.curses.push(id);const c=CURSES.find(x=>x.id===id);if(c)logs.push(`遭受 Debuff：${c.name}（${c.text}）。`);return c}
function useRunItem(id){const run=ensure()?.rogueActive;if(!run)return;ensureRunMeta(run);if((run.items[id]||0)<=0)return R()?.tell?.('这个道具已经没有了。');if(run.phase==='battleResult')return R()?.tell?.('战斗结算中不能使用道具。');const it=RUN_ITEMS.find(x=>x.id===id);if(!it)return;if(it.kind==='heal'){for(const mid of run.teamIds){if(canReviveInRun(run,mid))run.hp[mid]=Math.min(100,hpPct(run,mid)+25)}run.log.push('使用远征急救包：可复活队员恢复 25% 远征HP。')}else if(it.kind==='cleanse'){if(!run.curses.length)return R()?.tell?.('当前没有 Debuff。');const cid=run.curses.shift(),c=CURSES.find(x=>x.id===cid);run.log.push(`使用净化剂：移除 ${c?.name||'Debuff'}。`)}else{for(const [k,v] of Object.entries(it.mods||{}))run.nextBattleMods[k]=(run.nextBattleMods[k]||0)+v;run.log.push(`使用 ${it.name}：效果将在下一场战斗生效。`)}run.items[id]--;save()}
function runInventoryHTML(run){ensureRunMeta(run);const items=RUN_ITEMS.filter(x=>(run.items[x.id]||0)>0);const curses=(run.curses||[]).map(id=>CURSES.find(x=>x.id===id)).filter(Boolean);const buffs=Object.entries(run.nextBattleMods||{}).filter(([,v])=>v).map(([k,v])=>`${({atk:'攻击',def:'防御',spd:'速度',luck:'幸运'})[k]||k} ${v>0?'+':''}${Math.round(v*100)}%`);return `<section class=\"rg-panel\"><div class=\"rg-title\"><div><b>本局道具 / 状态</b><small>消耗品只在本次远征使用；战斗增益在下一场战斗后消失</small></div></div><div style=\"display:flex;gap:6px;flex-wrap:wrap;margin-top:7px\">${items.length?items.map(it=>`<button class=\"secondary\" data-rg-item=\"${it.id}\"><b>${it.name} ×${run.items[it.id]}</b><small>${it.text}</small></button>`).join(''):'<span class=\"rg-note\">暂无可用道具</span>'}</div>${buffs.length?`<p class=\"rg-note\"><b>下一战增益：</b>${buffs.join(' · ')}</p>`:''}${curses.length?`<p class=\"rg-danger\"><b>Debuff：</b>${curses.map(c=>`${c.name}（${c.text}）`).join(' · ')}</p>`:'<p class=\"rg-note\">Debuff：无</p>'}</section>`}"
if old not in s:
    raise SystemExit('relicMods target not found')
s=s.replace(old,new,1)

# 3) Start run with new containers.
needle="startedAt:Date.now(),formation:0}"
repl="startedAt:Date.now(),formation:0,items:{},curses:[],nextBattleMods:{}}"
if needle not in s:
    raise SystemExit('startRun target not found')
s=s.replace(needle,repl,1)

# 4) Combat uses combat-only modifiers.
s=s.replace("function combatValue(m,pos,run){const v=st(m),mods=relicMods(run)","function combatValue(m,pos,run){const v=st(m),mods=combatMods(run)",1)

# 5) Treasure can award consumables.
old_treasure="run.log.push(`宝箱：+${base} 灵能，并获得一份远征材料。`);if(Math.random()<.45)offerRelic(run);else advance(run)"
new_treasure="run.log.push(`宝箱：+${base} 灵能，并获得一份远征材料。`);if(Math.random()<.55){const it=grantRunItem(run,rand(RUN_ITEMS).id);run.log.push(`发现远征道具：${it.name} ×1。`)}if(Math.random()<.45)offerRelic(run);else advance(run)"
if old_treasure not in s:
    raise SystemExit('treasure target not found')
s=s.replace(old_treasure,new_treasure,1)

# 6) Challenge success may award item; failure may add debuff.
old_success="if(Math.random()<.35)offerRelic(run);else advance(run)}else{run.supply=Math.max(0,run.supply-1);run.hp[m.id]=Math.max(1,hpPct(run,m.id)-18);run.log.push(`事件失败：${monsterName(m)} 受伤 18%，补给 -1。`);advance(run)}}"
new_success="if(Math.random()<.30){const it=grantRunItem(run,rand(RUN_ITEMS).id);run.log.push(`额外发现：${it.name} ×1。`)}if(Math.random()<.35)offerRelic(run);else advance(run)}else{run.supply=Math.max(0,run.supply-1);run.hp[m.id]=Math.max(1,hpPct(run,m.id)-18);run.log.push(`事件失败：${monsterName(m)} 受伤 18%，补给 -1。`);if(Math.random()<.55){const pool=CURSES.filter(c=>!run.curses?.includes(c.id));if(pool.length)inflictCurse(run,rand(pool).id,run.log)}advance(run)}}"
if old_success not in s:
    raise SystemExit('challenge target not found')
s=s.replace(old_success,new_success,1)

# 7) Replace battle function with stats, curse sources and clear next-battle buffs.
start=s.find('function battle(run,kind){')
end=s.find('function offerRelic',start)
if start<0 or end<0:
    raise SystemExit('battle function bounds not found')
new_battle="""function battle(run,kind){ensureRunMeta(run);const zone=z(run.zone),t=activeTeam(run),elite=kind==='elite',boss=kind==='boss',mult=zone.enemy*(1+run.stage*.085)*(elite?1.22:1)*(boss?1.48:1),enemyMax=Math.round(240*mult+zone.tier*70),enemyAtk=Math.round(55*mult+zone.tier*11),enemyDef=Math.round(45*mult+zone.tier*9),enemySpd=Math.round(40*mult+zone.tier*8),enemyLuck=Math.round(32*mult+zone.tier*6);let enemy=enemyMax,round=0,firstGuard=true;const logs=[];if((elite||boss)&&Math.random()<(boss?.70:.38)){const pool=CURSES.filter(c=>!run.curses.includes(c.id));if(pool.length)inflictCurse(run,rand(pool).id,logs)}const initialTeamPower=t.filter(m=>canReviveInRun(run,m.id)&&hpPct(run,m.id)>0).reduce((sum,m,i)=>{const p=combatValue(m,i,run);return sum+p.atk*1.1+p.def+p.spd*.65+p.luck*.35+p.con*.7},0),enemyPower=Math.round(enemyMax*.7+enemyAtk*2+enemyDef*1.3+enemySpd*.5+enemyLuck*.25);while(enemy>0&&round<8&&t.some(m=>hpPct(run,m.id)>0&&canReviveInRun(run,m.id))){round++;const aliveNow=t.map((m,orig)=>({m,orig,hp:hpPct(run,m.id)})).filter(x=>x.hp>0&&canReviveInRun(run,x.m.id));let dmg=0;aliveNow.forEach((x,dynPos)=>{const p=combatValue(x.m,dynPos,run),crit=Math.random()<Math.min(.38,p.luck/1600),raw=(p.atk*.22+p.spd*.06+p.luck*.025)*(crit?1.65:1),hit=Math.max(7,raw-enemyDef*.07);dmg+=hit});enemy=Math.max(0,enemy-dmg);logs.push(`第 ${round} 回合：队伍造成 ${Math.round(dmg)} 伤害${enemy<=0?'，敌人倒下。':''}`);if(enemy<=0)break;const alive=t.map((m,orig)=>({m,orig,hp:hpPct(run,m.id)})).filter(x=>x.hp>0&&canReviveInRun(run,x.m.id)).map((x,dynPos)=>({...x,dynPos}));if(!alive.length)break;const roll=Math.random();let target=roll<.64?alive[0]:roll<.88?(alive[1]||alive[0]):(alive[2]||alive[1]||alive[0]);const p=combatValue(target.m,target.dynPos,run);let incoming=Math.max(5,enemyAtk-p.def*.08);if(firstGuard&&(combatMods(run).firstGuard||0)){incoming*=1-combatMods(run).firstGuard;firstGuard=false}const hpLoss=Math.min(42,incoming/(65+p.con*.22)*100),before=hpPct(run,target.m.id);run.hp[target.m.id]=Math.max(0,before-hpLoss);logs.push(`敌人反击 ${monsterName(target.m)}（${['前卫','中卫','后卫'][target.dynPos]}），远征生命 -${Math.round(hpLoss)}%。`);if(before>0&&run.hp[target.m.id]<=0){expeditionKnockout(run,target.m,logs);if(target.m.life>0)logs.push(`${monsterName(target.m)} 已倒下，但之后可通过营地/恢复效果复活；若再次归0会再次扣1生命。`);logs.push('后方存活队员自动向前补位。')}}const win=enemy<=0,aliveCount=t.filter(m=>hpPct(run,m.id)>0&&canReviveInRun(run,m.id)).length,reason=win?`在第 ${round} 回合击穿敌方 ${enemyMax} HP`:(aliveCount===0?'队伍全部倒下':'8回合内未能击败敌人');if(win){const eliteBonus=elite?(1+(combatMods(run).eliteReward||0)):1,base=Math.round((1100+run.stage*330)*(elite?1.7:1)*(boss?2.8:1)*nodeRewardScale(zone,run.stage)*eliteBonus);run.energy+=base;if(elite)run.tempBadges+=Math.max(1,Math.round(zone.badge*.5));const heal=combatMods(run).heal||0;if(heal)t.forEach(m=>{if(canReviveInRun(run,m.id))run.hp[m.id]=Math.min(100,hpPct(run,m.id)+heal*100);else run.hp[m.id]=0});run.log.push(`${boss?'首领':elite?'精英':'战斗'}胜利：+${base} 灵能。`)}else run.log.push('战斗失败，远征被迫撤退。');run.battle={kind,enemyMax,enemyHp:enemy,enemyAtk,enemyDef,enemySpd,enemyLuck,enemyPower,teamPower:Math.round(initialTeamPower),rounds:round,logs,win,reason};run.nextBattleMods={};run.phase='battleResult';save()}\n"""
s=s[:start]+new_battle+s[end:]

# 8) Enemy stats + explanation in result UI.
old_html="<div class=\"rg-enemy\"><b>${b.kind==='boss'?'区域首领':b.kind==='elite'?'精英守卫':'野外守卫'}</b><div class=\"rg-hp\"><i style=\"width:${Math.max(0,b.enemyHp/b.enemyMax*100)}%\"></i></div><small>剩余生命 ${Math.round(Math.max(0,b.enemyHp/b.enemyMax*100))}%</small></div>"
new_html="<div class=\"rg-enemy\"><b>${b.kind==='boss'?'区域首领':b.kind==='elite'?'精英守卫':'野外守卫'}</b><div class=\"rg-hp\"><i style=\"width:${Math.max(0,b.enemyHp/b.enemyMax*100)}%\"></i></div><small>HP ${Math.round(b.enemyHp)}/${b.enemyMax}</small><small>攻击 ${b.enemyAtk||'-'} · 防御 ${b.enemyDef||'-'} · 速度 ${b.enemySpd||'-'} · 幸运 ${b.enemyLuck||'-'}</small><small>敌方估值 ${b.enemyPower||'-'} · 我方估值 ${b.teamPower||'-'}</small></div>"
if old_html not in s:
    raise SystemExit('battleHTML enemy target not found')
s=s.replace(old_html,new_html,1)
s=s.replace("<div class=\"rg-log\">${b.logs.map(x=>`<div>${x}</div>`).join('')}</div><button", "<p class=\"rg-note\"><b>结果原因：</b>${b.reason||'根据双方属性、站位、遗物和随机暴击结算'}</p><div class=\"rg-log\">${b.logs.map(x=>`<div>${x}</div>`).join('')}</div><button",1)

# 9) Show inventory/status throughout run.
s=s.replace("return `${runHeader(run)}${teamHTML(run)}${nodeHTML(run)}<details", "return `${runHeader(run)}${runInventoryHTML(run)}${teamHTML(run)}${nodeHTML(run)}<details",1)
s=s.replace("return `${runHeader(run)}${teamHTML(run)}<section class=\"rg-panel\"><div class=\"rg-title\"><div><b>${c.title}", "return `${runHeader(run)}${runInventoryHTML(run)}${teamHTML(run)}<section class=\"rg-panel\"><div class=\"rg-title\"><div><b>${c.title}",1)
s=s.replace("function relicHTML(run){return `${runHeader(run)}<section", "function relicHTML(run){return `${runHeader(run)}${runInventoryHTML(run)}<section",1)
s=s.replace("function finalHTML(run){return `${runHeader(run)}<section", "function finalHTML(run){return `${runHeader(run)}${runInventoryHTML(run)}<section",1)

# 10) Item click handler.
click_anchor="if(ev.target.closest?.('[data-rg-start]')){startRun();return}"
click_repl="if(ev.target.closest?.('[data-rg-start]')){startRun();return}const item=ev.target.closest?.('[data-rg-item]');if(item){useRunItem(item.dataset.rgItem);return}"
if click_anchor not in s:
    raise SystemExit('click handler target not found')
s=s.replace(click_anchor,click_repl,1)

p.write_text(s,encoding='utf-8')

# Patch theater so enemy stats are visible while animation is playing.
p2=Path('v201-battle-theater.js')
t=p2.read_text(encoding='utf-8')
old="<small>${enemyName}</small><div class=\"rg-bt-hp\"><i style=\"width:100%\"></i></div>"
new="<small>${enemyName}</small><small>HP ${b.enemyMax||'?'} · 攻 ${b.enemyAtk||'?'} · 防 ${b.enemyDef||'?'} · 速 ${b.enemySpd||'?'} · 运 ${b.enemyLuck||'?'}</small><small>敌 ${b.enemyPower||'?'} / 我 ${b.teamPower||'?'}</small><div class=\"rg-bt-hp\"><i style=\"width:100%\"></i></div>"
if old not in t:
    raise SystemExit('battle theater enemy target not found')
t=t.replace(old,new,1)
p2.write_text(t,encoding='utf-8')
