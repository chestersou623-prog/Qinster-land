from pathlib import Path
import re

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

old="{id:'phoenixCore',name:'复苏核心',text:'每只怪物每场第一次 HP 归 0 时自动恢复至 50% 最大 HP',mods:{autoRevive:.50}},"
new="{id:'phoenixCore',name:'复苏核心',text:'整次远征一次性复苏：任意队员 HP 归 0 时自动恢复至 50% 最大 HP；每持有1件增加1次复苏次数',mods:{autoReviveCharges:1}},"
if old not in s: raise SystemExit('phoenixCore relic anchor missing')
s=s.replace(old,new,1)

old="const battleMods=combatMods(run),logs=[],events=[],gauge={},personalActions={},enemyActions={},allyBuff={atk:0,def:0,spd:0,luck:0,ttl:0},enemyDebuff={atk:0,def:0,spd:0,luck:0,ttl:0},digitSeed={},revived={},blocked={},shields={},vulnStack={};"
new="const battleMods=combatMods(run),logs=[],events=[],gauge={},personalActions={},enemyActions={},allyBuff={atk:0,def:0,spd:0,luck:0,ttl:0},enemyDebuff={atk:0,def:0,spd:0,luck:0,ttl:0},digitSeed={},blocked={},shields={},vulnStack={};"
if old not in s: raise SystemExit('battle local revive anchor missing')
s=s.replace(old,new,1)

old="let autoRevived=false;if(beforePct>0&&run.hp[target.id]<=0&&Number(battleMods.autoRevive)>0&&!revived[target.id]){revived[target.id]=true;run.hp[target.id]=Math.max(1,Math.min(100,Number(battleMods.autoRevive)*100));autoRevived=true;afterHp=maxHp*run.hp[target.id]/100;logs.push(`${monsterName(target)} 触发复苏核心，恢复至 ${Math.round(run.hp[target.id])}% HP。`)}"
new="let autoRevived=false;const reviveMax=Math.max(0,Math.floor(Number(battleMods.autoReviveCharges)||0)),reviveUsed=Math.max(0,Math.floor(Number(run.autoReviveUsed)||0));if(beforePct>0&&run.hp[target.id]<=0&&reviveUsed<reviveMax){run.autoReviveUsed=reviveUsed+1;run.hp[target.id]=50;autoRevived=true;afterHp=maxHp*.5;logs.push(`${monsterName(target)} 触发复苏核心，恢复至 50% HP（本次远征剩余复苏 ${Math.max(0,reviveMax-run.autoReviveUsed)} 次）。`)}"
if old not in s: raise SystemExit('auto revive logic anchor missing')
s=s.replace(old,new,1)

old="<span>遗物 ${(run.relics||[]).length} · 种类 ${Object.keys(relicCounts(run)).length}</span>"
new="<span>遗物 ${(run.relics||[]).length} · 种类 ${Object.keys(relicCounts(run)).length}</span>${(run.relics||[]).includes('phoenixCore')?`<span>复苏 ${Math.max(0,(run.relics||[]).filter(id=>id==='phoenixCore').length-(Number(run.autoReviveUsed)||0))}/${(run.relics||[]).filter(id=>id==='phoenixCore').length}</span>`:''}"
if old not in s: raise SystemExit('run header status anchor missing')
s=s.replace(old,new,1)

p.write_text(s,encoding='utf-8')

bt=Path('v201-battle-theater.js')
t=bt.read_text(encoding='utf-8').replace('qinster-v260-battle-theater-style','qinster-v261-battle-theater-style')
bt.write_text(t,encoding='utf-8')

idx=Path('index.html')
x=idx.read_text(encoding='utf-8')
x=x.replace("b.textContent='v259 · '+msg", "b.textContent='v261 · '+msg")
x=x.replace("Qinster v259 错误", "Qinster v261 错误")
x=re.sub(r'v=260(?:\.\d+)?', 'v=261', x)
idx.write_text(x,encoding='utf-8')

print('v261 patch applied')
