from pathlib import Path
import re

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

old="function canReviveInRun(run,id){const m=persistentMonster(id);return !!m&&Number(m.life)>0&&!run.permaDead?.[id]}"
new="""function canReviveInRun(run,id){const m=persistentMonster(id);return !!m&&Number(m.life)>0&&!run.permaDead?.[id]}
function tryPhoenixRevive(run,m,logs=[],reason=''){if(!run||!m||hpPct(run,m.id)>0||!canReviveInRun(run,m.id))return false;const max=Math.max(0,Math.floor(Number(relicMods(run).autoReviveCharges)||0)),used=Math.max(0,Math.floor(Number(run.autoReviveUsed)||0));if(used>=max)return false;run.autoReviveUsed=used+1;run.hp[m.id]=50;logs.push(`${monsterName(m)} ${reason?reason+'':''}触发复苏核心，恢复至 50% 最大HP（本次远征剩余复苏 ${Math.max(0,max-run.autoReviveUsed)} 次）。`);return true}"""
assert old in s, 'canReviveInRun anchor missing'
s=s.replace(old,new,1)

old="const startHp={};t.forEach(m=>startHp[m.id]=hpPct(run,m.id));"
new="const preBattleReviveLogs=[];for(const m of t)if(hpPct(run,m.id)<=0)tryPhoenixRevive(run,m,preBattleReviveLogs,'开战前');const startHp={};t.forEach(m=>startHp[m.id]=hpPct(run,m.id));"
assert old in s, 'startHp anchor missing'
s=s.replace(old,new,1)

old="const battleMods=combatMods(run),logs=[],events=[],gauge={},personalActions={},enemyActions={},allyBuff={atk:0,def:0,spd:0,luck:0,ttl:0},enemyDebuff={atk:0,def:0,spd:0,luck:0,ttl:0},digitSeed={},blocked={},shields={},vulnStack={};"
new="const battleMods=combatMods(run),logs=[...preBattleReviveLogs],events=[],gauge={},personalActions={},enemyActions={},allyBuff={atk:0,def:0,spd:0,luck:0,ttl:0},enemyDebuff={atk:0,def:0,spd:0,luck:0,ttl:0},digitSeed={},blocked={},shields={},vulnStack={};"
assert old in s, 'battleMods/logs anchor missing'
s=s.replace(old,new,1)

old="let incoming=Math.max(5,en2.atk*mult-p.def*.08);"
new="const rawIncoming=Math.max(5,en2.atk*mult),defense=Math.max(0,Number(p.def)||0);let incoming=Math.max(1,rawIncoming*100/(100+defense));"
assert old in s, 'incoming damage formula missing'
s=s.replace(old,new,1)

old="let hpDamage=Math.min(maxHp*.42,incoming),afterHp=Math.max(0,beforeHp-hpDamage);run.hp[target.id]=Math.max(0,afterHp/maxHp*100);let autoRevived=false;const reviveMax=Math.max(0,Math.floor(Number(battleMods.autoReviveCharges)||0)),reviveUsed=Math.max(0,Math.floor(Number(run.autoReviveUsed)||0));if(beforePct>0&&run.hp[target.id]<=0&&reviveUsed<reviveMax){run.autoReviveUsed=reviveUsed+1;run.hp[target.id]=50;autoRevived=true;afterHp=maxHp*.5;logs.push(`${monsterName(target)} 触发复苏核心，恢复至 50% HP（本次远征剩余复苏 ${Math.max(0,reviveMax-run.autoReviveUsed)} 次）。`)}"
new="let hpDamage=Math.min(maxHp*.42,incoming),afterHp=Math.max(0,beforeHp-hpDamage);run.hp[target.id]=Math.max(0,afterHp/maxHp*100);let autoRevived=false;if(beforePct>0&&run.hp[target.id]<=0){autoRevived=tryPhoenixRevive(run,target,logs,'战斗中');if(autoRevived)afterHp=maxHp*.5}"
assert old in s, 'inline phoenix block missing'
s=s.replace(old,new,1)

old="hit=Math.max(7,(raw-en2.def*.07)*damageMul);"
new="const mitigated=raw*100/(100+Math.max(0,Number(en2.def)||0));hit=Math.max(1,mitigated*damageMul);"
assert old in s, 'outgoing damage formula missing'
s=s.replace(old,new,1)

# Version bump in expedition module.
s=s.replace("version:'v264'","version:'v265'")
s=s.replace("version:'v263'","version:'v265'")
p.write_text(s,encoding='utf-8')

# Visible/cache/package version bump.
for fn in ['game.js','index.html']:
    q=Path(fn)
    if not q.exists(): continue
    t=q.read_text(encoding='utf-8')
    t=t.replace('v264','v265').replace('v263','v265')
    t=re.sub(r'([?&]v=)264(\b)',r'\g<1>265\2',t)
    q.write_text(t,encoding='utf-8')

for fn in ['package.json','package-lock.json']:
    q=Path(fn)
    if q.exists():
        t=q.read_text(encoding='utf-8').replace('264.0.0','265.0.0')
        q.write_text(t,encoding='utf-8')

# Strong verification of generated source.
out=p.read_text(encoding='utf-8')
for needle in [
    "rawIncoming*100/(100+defense)",
    "mitigated=raw*100/(100+Math.max(0,Number(en2.def)||0))",
    "function tryPhoenixRevive",
    "preBattleReviveLogs",
    "run.hp[m.id]=50"
]:
    assert needle in out, needle
print('v265 patch applied')
