from pathlib import Path
import re

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

# Add requested special/survival/vulnerability relics before RELICS closes.
anchor="{id:'reflectArmor',name:'反甲',text:'受到敌方攻击造成实际 HP 伤害后，攻击者受到该次伤害的 25% 反射伤害',mods:{reflectDamage:.25}}\n];"
if anchor not in s: raise SystemExit('relic anchor missing')
extra="""{id:'reflectArmor',name:'反甲',text:'受到敌方攻击造成实际 HP 伤害后，攻击者受到该次伤害的 25% 反射伤害',mods:{reflectDamage:.25}},
{id:'relicWarBanner',name:'百宝战旗',text:'每持有 1 件遗物，全队攻击 +5%（包含本身）',mods:{relicAtkPerRelic:.05}},
{id:'buffResonator',name:'祝福共鸣',text:'每拥有 1 个正面 Buff，全队攻击 +1%、防御 +3%',mods:{atkPerBuff:.01,defPerBuff:.03}},
{id:'digitChaosCube',name:'乱序魔方',text:'进入每场战斗时，随机重排我方攻击力数字；战斗结束后恢复原值',mods:{digitShuffleAtk:1}},
{id:'formationCompass',name:'错位罗盘',text:'开战前将敌方前卫与后卫位置对调',mods:{swapEnemyEnds:1}},
{id:'dodgeCounterBlade',name:'闪避反刃',text:'我方闪避成功后，立刻对攻击者造成自身攻击力 50% 的伤害',mods:{dodgeCounterAtk:.50}},
{id:'phoenixCore',name:'复苏核心',text:'每只怪物每场第一次 HP 归 0 时自动恢复至 50% 最大 HP',mods:{autoRevive:.50}},
{id:'absoluteGuard',name:'绝对格挡器',text:'每只怪物每场第一次受到敌方攻击时完全格挡',mods:{blockFirstHit:1}},
{id:'energyShield100',name:'能量护盾·100',text:'每场战斗开始时，每只怪物获得 100 点护盾；伤害先扣护盾再扣 HP',mods:{shieldFlat:100}},
{id:'energyShield250',name:'能量护盾·250',text:'每场战斗开始时，每只怪物获得 250 点护盾；伤害先扣护盾再扣 HP',mods:{shieldFlat:250}},
{id:'vulnerabilityMark',name:'易伤刻印',text:'敌方受到的最终伤害 +15%',mods:{enemyVulnerable:.15}},
{id:'armorBreakSeal',name:'破甲封印',text:'敌方防御 -20%',mods:{enemyDefDown:.20}},
{id:'openingSunder',name:'开场碎甲',text:'战斗开始时敌方防御 -30%，持续整场',mods:{enemyDefDown:.30}},
{id:'stackingWound',name:'裂伤印记',text:'每次我方命中敌人，使其本场受到伤害 +2%，最多 +20%',mods:{stackVulnerable:.02,stackVulnerableCap:.20}},
{id:'bossBreaker',name:'屠王破甲器',text:'对 BOSS 伤害 +25%，并使 BOSS 防御 -15%',mods:{bossDamage:.25,bossDefDown:.15}}
];"""
s=s.replace(anchor,extra,1)

# Dodge bonus support.
s=s.replace("function dodgeChance(defLuck,atkLuck){return Math.max(.03,Math.min(.35,.08+(Number(defLuck||0)-Number(atkLuck||0))/1400))}",
            "function dodgeChance(defLuck,atkLuck,bonus=0){return Math.max(.03,Math.min(.70,.08+(Number(defLuck||0)-Number(atkLuck||0))/1400+Math.max(0,Number(bonus)||0)))}")

# Positive buff counter.
s=s.replace("function ensureRunMeta(run){if(!run.items)run.items={};if(!run.curses)run.curses=[];if(!run.curseValues)run.curseValues={};if(!run.nextBattleMods)run.nextBattleMods={};if(!run.templeMods)run.templeMods={};if(!run.trainingMods)run.trainingMods={};return run}",
"function ensureRunMeta(run){if(!run.items)run.items={};if(!run.curses)run.curses=[];if(!run.curseValues)run.curseValues={};if(!run.nextBattleMods)run.nextBattleMods={};if(!run.templeMods)run.templeMods={};if(!run.trainingMods)run.trainingMods={};if(!Number.isFinite(Number(run.templeBuffCount)))run.templeBuffCount=0;if(!Number.isFinite(Number(run.nextBattleBuffCount)))run.nextBattleBuffCount=0;return run}\nfunction positiveBuffCount(run){ensureRunMeta(run);return Math.max(0,Number(run.templeBuffCount)||0)+Math.max(0,Number(run.nextBattleBuffCount)||0)}")
s=s.replace("if(it.mods){for(const [k,v] of Object.entries(it.mods))run.nextBattleMods[k]=(run.nextBattleMods[k]||0)+v;run.log.push(`使用 ${it.name}：下一场战斗增益已准备。`);used=true}",
"if(it.mods){for(const [k,v] of Object.entries(it.mods))run.nextBattleMods[k]=(run.nextBattleMods[k]||0)+v;run.nextBattleBuffCount=(Number(run.nextBattleBuffCount)||0)+1;run.log.push(`使用 ${it.name}：下一场战斗增益已准备。`);used=true}")
s=s.replace("if(x.kind==='buff'||x.kind==='risky'){\n    for(const [k,v] of Object.entries(x.mods||{}))run.templeMods[k]=(run.templeMods[k]||0)+v;",
"if(x.kind==='buff'||x.kind==='risky'){\n    run.templeBuffCount=(Number(run.templeBuffCount)||0)+1;\n    for(const [k,v] of Object.entries(x.mods||{}))run.templeMods[k]=(run.templeMods[k]||0)+v;")

# Formation base bonuses + generic relic scaling.
old="function combatValue(m,pos,run){const v=trainedBaseStats(m,run),mods=combatMods(run),meta=metaMods(),sh=m.shiny?(mods.shiny||0):0;let con=Math.max(1,v[0]*(1+(mods.hpMult||0))+(mods.hpFlat||0)),atk=v[1]*(1+(mods.atk||0)+(meta.atk||0)+sh),def=v[2]*(1+(mods.def||0)+(meta.def||0)+sh),spd=v[3]*(1+(mods.spd||0)+(meta.spd||0)),luck=v[4]*(1+(mods.luck||0)+(meta.luck||0)+sh);atk+=con*(mods.atkFromHp||0);if(mods.missingHpAtkPer10){const missing=Math.max(0,100-hpPct(run,m.id)),steps=Math.min(9,Math.floor(missing/10));atk*=1+steps*(mods.missingHpAtkPer10||0)}if(pos===0){def*=1+(mods.frontDef||0);atk*=1+(mods.frontAtk||0)}if(pos===2){atk*=1+(mods.backAtk||0);def*=1+(mods.backDef||0)}return{atk,def,spd,luck,con}}"
new="""function combatValue(m,pos,run){const v=trainedBaseStats(m,run),mods=combatMods(run),meta=metaMods(),sh=m.shiny?(mods.shiny||0):0;let con=Math.max(1,v[0]*(1+(mods.hpMult||0))+(mods.hpFlat||0)),atk=v[1]*(1+(mods.atk||0)+(meta.atk||0)+sh),def=v[2]*(1+(mods.def||0)+(meta.def||0)+sh),spd=v[3]*(1+(mods.spd||0)+(meta.spd||0)),luck=v[4]*(1+(mods.luck||0)+(meta.luck||0)+sh);atk+=con*(mods.atkFromHp||0);if(mods.relicAtkPerRelic)atk*=1+(run.relics||[]).length*Number(mods.relicAtkPerRelic||0);const bc=positiveBuffCount(run);if(bc){atk*=1+bc*Number(mods.atkPerBuff||0);def*=1+bc*Number(mods.defPerBuff||0)}if(mods.missingHpAtkPer10){const missing=Math.max(0,100-hpPct(run,m.id)),steps=Math.min(9,Math.floor(missing/10));atk*=1+steps*(mods.missingHpAtkPer10||0)}if(pos===0){con*=1.25;def*=1.25;def*=1+(mods.frontDef||0);atk*=1+(mods.frontAtk||0)}if(pos===2){atk*=1.25*(1+(mods.backAtk||0));def*=1+(mods.backDef||0)}return{atk,def,spd,luck,con}}\nfunction positionDodgeBonus(pos,mods){return Math.max(0,Number(mods.dodgeBonus)||0)+(pos===2?.25:0)+(pos===0?Math.max(0,Number(mods.frontDodge)||0):pos===2?Math.max(0,Number(mods.backDodge)||0):0)}\nfunction shuffledAttackDigits(value,seed){const n=Math.max(1,Math.round(Number(value)||1)),a=String(n).split('');if(a.length<2)return n;let x=Math.max(1,Math.floor((Number(seed)||.5)*2147483646));for(let i=a.length-1;i>0;i--){x=x*48271%2147483647;const j=x%(i+1);[a[i],a[j]]=[a[j],a[i]]}if(a[0]==='0'){const j=a.findIndex(c=>c!=='0');if(j>0)[a[0],a[j]]=[a[j],a[0]]}let out=Number(a.join(''));if(out===n&&a.length>1){a.push(a.shift());out=Number(a.join(''))}return Math.max(1,out||n)}"""
if old not in s: raise SystemExit('combatValue anchor missing')
s=s.replace(old,new,1)

# Enemy formation swap in preview.
old="function enemyPreview(run,kind){\n  const roles=enemyTeamRoles(kind),enemies=roles.map((role,i)=>makeEnemyUnit(run,role,i)),p=enemies[0],enemyPower=enemies.reduce((n,e)=>n+e.difficultyRating,0);\n  return{kind,enemies,enemySpecies:p.enemySpecies,enemyShiny:p.enemyShiny,enemyMax:p.maxHp,enemyAtk:p.atk,enemyDef:p.def,enemySpd:p.spd,enemyLuck:p.luck,affixes:p.affixes,variance:p.variance,enemyPower,difficultyRating:enemyPower};\n}"
new="""function enemyPreview(run,kind){const roles=enemyTeamRoles(kind),enemies=roles.map((role,i)=>makeEnemyUnit(run,role,i));if(relicMods(run).swapEnemyEnds&&enemies.length>1){const j=enemies.length-1;[enemies[0],enemies[j]]=[enemies[j],enemies[0]]}const p=enemies[0],enemyPower=enemies.reduce((n,e)=>n+e.difficultyRating,0);return{kind,enemies,enemySpecies:p.enemySpecies,enemyShiny:p.enemyShiny,enemyMax:p.maxHp,enemyAtk:p.atk,enemyDef:p.def,enemySpd:p.spd,enemyLuck:p.luck,affixes:p.affixes,variance:p.variance,enemyPower,difficultyRating:enemyPower};}"""
if old not in s: raise SystemExit('enemyPreview anchor missing')
s=s.replace(old,new,1)

# Battle-local state.
s=s.replace("  const logs=[],events=[],gauge={},personalActions={},enemyActions={},allyBuff={atk:0,def:0,spd:0,luck:0,ttl:0},enemyDebuff={atk:0,def:0,spd:0,luck:0,ttl:0};t.forEach(m=>gauge[m.id]=0);enemies.forEach(e=>gauge[e.id]=0);",
"  const battleMods=combatMods(run),logs=[],events=[],gauge={},personalActions={},enemyActions={},allyBuff={atk:0,def:0,spd:0,luck:0,ttl:0},enemyDebuff={atk:0,def:0,spd:0,luck:0,ttl:0},digitSeed={},revived={},blocked={},shields={},vulnStack={};t.forEach((m,i)=>{digitSeed[m.id]=Math.random();gauge[m.id]=0;shields[m.id]=Math.max(0,Number(battleMods.shieldFlat)||0)+(i===0?Math.max(0,Number(battleMods.frontShieldFlat)||0):0)});enemies.forEach(e=>{gauge[e.id]=0;vulnStack[e.id]=0});")

s=s.replace("  const cv=(m,pos)=>{const p=combatValue(m,pos,run);return{...p,atk:p.atk*(1+allyBuff.atk),def:p.def*(1+allyBuff.def),spd:p.spd*(1+allyBuff.spd),luck:p.luck*(1+allyBuff.luck)}};",
"  const cv=(m,pos)=>{const p=combatValue(m,pos,run);let atk=p.atk*(1+allyBuff.atk),def=p.def*(1+allyBuff.def),spd=p.spd*(1+allyBuff.spd),luck=p.luck*(1+allyBuff.luck);if(battleMods.digitShuffleAtk)atk=shuffledAttackDigits(atk,digitSeed[m.id]);return{...p,atk,def,spd,luck}};")

s=s.replace("  const enemyNow=e=>({atk:e.atk*(1+enemyDebuff.atk),def:e.def*(1+enemyDebuff.def),spd:e.spd*(1+enemyDebuff.spd),luck:e.luck*(1+enemyDebuff.luck)});",
"  const enemyNow=e=>({atk:e.atk*(1+enemyDebuff.atk),def:e.def*(1+enemyDebuff.def-Math.max(0,Number(battleMods.enemyDefDown)||0)-(e.role==='boss'?Math.max(0,Number(battleMods.bossDefDown)||0):0)),spd:e.spd*(1+enemyDebuff.spd),luck:e.luck*(1+enemyDebuff.luck)});")

# Replace hurtAlly function compactly.
pat=r"  const hurtAlly=\(enemyUnit,target,mult=1\)=>\{.*?return\{targetId:target\.id,hpLoss,hpDamage,maxHp,currentHp:Math\.round\(beforeHp\),hpAfter:run\.hp\[target\.id\],hpAfterAbs:Math\.round\(afterHp\),reflectDamage,enemyHp:enemyUnit\.hp,enemyMax:enemyUnit\.maxHp,miss:false\}\};"
m=re.search(pat,s,re.S)
if not m: raise SystemExit('hurtAlly missing')
rep="""  const hurtAlly=(enemyUnit,target,mult=1)=>{const current=t.filter(m=>hpPct(run,m.id)>0&&canReviveInRun(run,m.id)),dynPos=current.indexOf(target),p=cv(target,Math.max(0,dynPos)),en2=enemyNow(enemyUnit),maxHp=Math.max(1,Math.round(p.con||1)),beforePct=hpPct(run,target.id),beforeHp=maxHp*beforePct/100;if(Math.random()<dodgeChance(p.luck,en2.luck,positionDodgeBonus(dynPos,battleMods))){const counterDamage=Math.max(0,Number(battleMods.dodgeCounterAtk)||0)>0?Math.min(Number(enemyUnit.hp)||0,p.atk*Number(battleMods.dodgeCounterAtk)):0;if(counterDamage>0){enemyUnit.hp=Math.max(0,enemyUnit.hp-counterDamage);if(enemyUnit.hp<=0)recordKill(enemyUnit)}return{targetId:target.id,hpLoss:0,hpDamage:0,maxHp,currentHp:Math.round(beforeHp),hpAfter:beforePct,hpAfterAbs:Math.round(beforeHp),reflectDamage:0,counterDamage,shieldDamage:0,shieldAfter:shields[target.id]||0,enemyHp:enemyUnit.hp,enemyMax:enemyUnit.maxHp,miss:true}}if(Number(battleMods.blockFirstHit)>0&&!blocked[target.id]){blocked[target.id]=true;return{targetId:target.id,hpLoss:0,hpDamage:0,maxHp,currentHp:Math.round(beforeHp),hpAfter:beforePct,hpAfterAbs:Math.round(beforeHp),reflectDamage:0,counterDamage:0,shieldDamage:0,shieldAfter:shields[target.id]||0,enemyHp:enemyUnit.hp,enemyMax:enemyUnit.maxHp,miss:false,blocked:true}}let incoming=Math.max(5,en2.atk*mult-p.def*.08);if(vanguardGuard>0)incoming*=1-vanguardGuard;if(firstGuard&&(battleMods.firstGuard||0)){incoming*=1-battleMods.firstGuard;firstGuard=false}let shieldDamage=Math.min(Math.max(0,shields[target.id]||0),incoming);shields[target.id]=Math.max(0,(shields[target.id]||0)-shieldDamage);incoming=Math.max(0,incoming-shieldDamage);let hpDamage=Math.min(maxHp*.42,incoming),afterHp=Math.max(0,beforeHp-hpDamage);run.hp[target.id]=Math.max(0,afterHp/maxHp*100);let autoRevived=false;if(beforePct>0&&run.hp[target.id]<=0&&Number(battleMods.autoRevive)>0&&!revived[target.id]){revived[target.id]=true;run.hp[target.id]=Math.max(1,Math.min(100,Number(battleMods.autoRevive)*100));autoRevived=true;afterHp=maxHp*run.hp[target.id]/100;logs.push(`${monsterName(target)} 触发复苏核心，恢复至 ${Math.round(run.hp[target.id])}% HP。`)}const reflectRate=Math.max(0,Number(battleMods.reflectDamage)||0),reflectDamage=hpDamage>0&&reflectRate>0?Math.min(Number(enemyUnit.hp)||0,hpDamage*reflectRate):0;if(reflectDamage>0){enemyUnit.hp=Math.max(0,enemyUnit.hp-reflectDamage);if(enemyUnit.hp<=0)recordKill(enemyUnit)}if(beforePct>0&&run.hp[target.id]<=0&&!autoRevived){gauge[target.id]=0;expeditionKnockout(run,target,logs);if(target.life>0)logs.push(`${monsterName(target)} 已倒下，只能在营地选择复活。`)}const hpLoss=hpDamage/maxHp*100;return{targetId:target.id,hpLoss,hpDamage,maxHp,currentHp:Math.round(beforeHp),hpAfter:run.hp[target.id],hpAfterAbs:Math.round(afterHp),reflectDamage,counterDamage:0,shieldDamage,shieldAfter:shields[target.id]||0,autoRevived,enemyHp:enemyUnit.hp,enemyMax:enemyUnit.maxHp,miss:false}};"""
s=s[:m.start()]+rep+s[m.end():]

# Damage vulnerability on ally attacks.
old="const raw=(p.atk*.22+p.spd*.06+p.luck*.025)*(crit?1.65:1)*power;hit=Math.max(7,raw-en2.def*.07);target.hp=Math.max(0,target.hp-hit);if(target.hp<=0)recordKill(target)"
new="const raw=(p.atk*.22+p.spd*.06+p.luck*.025)*(crit?1.65:1)*power;let damageMul=1+Math.max(0,Number(battleMods.enemyVulnerable)||0)+Math.max(0,Number(vulnStack[target.id])||0)+(target.role==='boss'?Math.max(0,Number(battleMods.bossDamage)||0):0);hit=Math.max(7,(raw-en2.def*.07)*damageMul);target.hp=Math.max(0,target.hp-hit);if(Number(battleMods.stackVulnerable)>0)vulnStack[target.id]=Math.min(Math.max(0,Number(battleMods.stackVulnerableCap)||.20),(vulnStack[target.id]||0)+Number(battleMods.stackVulnerable));if(target.hp<=0)recordKill(target)"
if old not in s: raise SystemExit('damage anchor missing')
s=s.replace(old,new,1)

# Clear next-battle buff count after battle.
s=s.replace("run.nextBattleMods={};run.phase='battleResult';save()", "run.nextBattleMods={};run.nextBattleBuffCount=0;run.phase='battleResult';save()")

# Bump internal style/version references from v258/v259-ish to v260 where present.
s=s.replace("qinster-v258", "qinster-v260")
P.write_text(s,encoding='utf-8')

# battle theater: show shields/block/revive text and v260 style id
bt=Path('v201-battle-theater.js');t=bt.read_text(encoding='utf-8').replace("qinster-v258-battle-theater-style","qinster-v260-battle-theater-style")
t=t.replace("(ev.miss?'攻击被闪避':'HP -'+Math.round(ev.hpDamage||0)+(reflectText||''))", "(ev.miss?'攻击被闪避':ev.blocked?'攻击被完全格挡':((Number(ev.shieldDamage)||0)>0?'护盾 -'+Math.round(ev.shieldDamage)+(Number(ev.hpDamage)>0?'；HP -'+Math.round(ev.hpDamage):''):'HP -'+Math.round(ev.hpDamage||0))+(ev.autoRevived?'；复苏至50% HP':'')+(reflectText||''))")
bt.write_text(t,encoding='utf-8')

# version/cache bump
idx=Path('index.html');x=idx.read_text(encoding='utf-8')
x=re.sub(r'v=259(?:\.\d+)?', 'v=260', x)
idx.write_text(x,encoding='utf-8')

pkg=Path('package.json')
if pkg.exists():
    z=pkg.read_text(encoding='utf-8');z=re.sub(r'"version"\s*:\s*"[^"]+"','"version": "260.0.0"',z,count=1);pkg.write_text(z,encoding='utf-8')
lock=Path('package-lock.json')
if lock.exists():
    z=lock.read_text(encoding='utf-8').replace('"version": "259.0.0"','"version": "260.0.0"');lock.write_text(z,encoding='utf-8')
