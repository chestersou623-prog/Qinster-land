from pathlib import Path


def req(s, old, new, label, count=1):
    if old not in s:
        raise SystemExit(f'Missing expected pattern: {label}')
    return s.replace(old, new, count)

# Version bump
for fname in ['game.js','index.html','v199-roguelike-expedition.js','v201-battle-theater.js']:
    p=Path(fname)
    s=p.read_text(encoding='utf-8').replace('v249','v250').replace('?v=249','?v=250')
    p.write_text(s,encoding='utf-8')

# Core expedition relic + reflect combat logic
p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

s=req(s,
"{id:'bloodSpeedPump',name:'血速泵',text:'全队最大 HP +150，速度 +12%，防御 -5%',mods:{hpFlat:150,spd:.12,def:-.05}}\n];",
"{id:'bloodSpeedPump',name:'血速泵',text:'全队最大 HP +150，速度 +12%，防御 -5%',mods:{hpFlat:150,spd:.12,def:-.05}},\n{id:'reflectArmor',name:'反甲',text:'受到敌方攻击造成实际 HP 伤害后，攻击者受到该次伤害的 25% 反射伤害',mods:{reflectDamage:.25}}\n];",
'reflect relic definition')

old="const hurtAlly=(enemyUnit,target,mult=1)=>{const current=t.filter(m=>hpPct(run,m.id)>0&&canReviveInRun(run,m.id)),dynPos=current.indexOf(target),p=cv(target,Math.max(0,dynPos)),en2=enemyNow(enemyUnit),maxHp=Math.max(1,Math.round(p.con||1)),beforePct=hpPct(run,target.id),beforeHp=maxHp*beforePct/100;if(Math.random()<dodgeChance(p.luck,en2.luck))return{targetId:target.id,hpLoss:0,hpDamage:0,maxHp,currentHp:Math.round(beforeHp),hpAfter:beforePct,hpAfterAbs:Math.round(beforeHp),miss:true};let incoming=Math.max(5,en2.atk*mult-p.def*.08);if(vanguardGuard>0)incoming*=1-vanguardGuard;if(firstGuard&&(combatMods(run).firstGuard||0)){incoming*=1-combatMods(run).firstGuard;firstGuard=false}const hpDamage=Math.min(maxHp*.42,incoming),afterHp=Math.max(0,beforeHp-hpDamage),hpLoss=hpDamage/maxHp*100;run.hp[target.id]=Math.max(0,afterHp/maxHp*100);if(beforePct>0&&run.hp[target.id]<=0){gauge[target.id]=0;expeditionKnockout(run,target,logs);if(target.life>0)logs.push(`${monsterName(target)} 已倒下，只能在营地选择复活。`)}return{targetId:target.id,hpLoss,hpDamage,maxHp,currentHp:Math.round(beforeHp),hpAfter:run.hp[target.id],hpAfterAbs:Math.round(afterHp),miss:false}};"
new="const hurtAlly=(enemyUnit,target,mult=1)=>{const current=t.filter(m=>hpPct(run,m.id)>0&&canReviveInRun(run,m.id)),dynPos=current.indexOf(target),p=cv(target,Math.max(0,dynPos)),en2=enemyNow(enemyUnit),maxHp=Math.max(1,Math.round(p.con||1)),beforePct=hpPct(run,target.id),beforeHp=maxHp*beforePct/100;if(Math.random()<dodgeChance(p.luck,en2.luck))return{targetId:target.id,hpLoss:0,hpDamage:0,maxHp,currentHp:Math.round(beforeHp),hpAfter:beforePct,hpAfterAbs:Math.round(beforeHp),reflectDamage:0,enemyHp:enemyUnit.hp,enemyMax:enemyUnit.maxHp,miss:true};let incoming=Math.max(5,en2.atk*mult-p.def*.08);if(vanguardGuard>0)incoming*=1-vanguardGuard;if(firstGuard&&(combatMods(run).firstGuard||0)){incoming*=1-combatMods(run).firstGuard;firstGuard=false}const hpDamage=Math.min(maxHp*.42,incoming),afterHp=Math.max(0,beforeHp-hpDamage),hpLoss=hpDamage/maxHp*100;run.hp[target.id]=Math.max(0,afterHp/maxHp*100);const reflectRate=Math.max(0,Number(combatMods(run).reflectDamage)||0),reflectDamage=hpDamage>0&&reflectRate>0?Math.min(Number(enemyUnit.hp)||0,hpDamage*reflectRate):0;if(reflectDamage>0){enemyUnit.hp=Math.max(0,(Number(enemyUnit.hp)||0)-reflectDamage);if(enemyUnit.hp<=0)recordKill(enemyUnit)}if(beforePct>0&&run.hp[target.id]<=0){gauge[target.id]=0;expeditionKnockout(run,target,logs);if(target.life>0)logs.push(`${monsterName(target)} 已倒下，只能在营地选择复活。`)}return{targetId:target.id,hpLoss,hpDamage,maxHp,currentHp:Math.round(beforeHp),hpAfter:run.hp[target.id],hpAfterAbs:Math.round(afterHp),reflectDamage,enemyHp:enemyUnit.hp,enemyMax:enemyUnit.maxHp,miss:false}};"
s=req(s,old,new,'hurtAlly reflect logic')

# Single-target enemy event carries reflect result for replay.
s=req(s,
"targetId:res.targetId,hpLoss:res.hpLoss,hpDamage:res.hpDamage,maxHp:res.maxHp,hpAfter:res.hpAfter,hpAfterAbs:res.hpAfterAbs,miss:res.miss,skillName:",
"targetId:res.targetId,hpLoss:res.hpLoss,hpDamage:res.hpDamage,maxHp:res.maxHp,hpAfter:res.hpAfter,hpAfterAbs:res.hpAfterAbs,reflectDamage:res.reflectDamage,enemyHp:res.enemyHp,enemyMax:res.enemyMax,miss:res.miss,skillName:",
'single enemy event reflect fields')

# Show reflect in single-target combat log.
s=req(s,
"`，HP -${Math.round(res.hpDamage)}（${Math.round(res.hpAfterAbs)}/${Math.round(res.maxHp)}）`",
"`，HP -${Math.round(res.hpDamage)}（${Math.round(res.hpAfterAbs)}/${Math.round(res.maxHp)}）${res.reflectDamage>0?`；反甲反伤 ${Math.round(res.reflectDamage)}`:''}`",
'single enemy reflect log')

# AOE summary shows total reflected damage; each target already contains reflect fields.
s=req(s,
"const targets=current.map(x=>hurtAlly(e,x,.64));events.push({type:'enemy'",
"const targets=current.map(x=>hurtAlly(e,x,.64)),reflected=targets.reduce((n,x)=>n+(Number(x.reflectDamage)||0),0);events.push({type:'enemy'",
'aoe reflect total')
s=req(s,
"attackType:'全体攻击',targets,spd:ready.spd",
"attackType:'全体攻击',targets,reflectDamage:reflected,enemyHp:e.hp,enemyMax:e.maxHp,spd:ready.spd",
'aoe reflect event fields')
s=req(s,
"logs.push(`行动 ${actions}：${e.name} 使用【全体攻击】，攻击全队。`);",
"logs.push(`行动 ${actions}：${e.name} 使用【全体攻击】，攻击全队${reflected>0?`；反甲累计反伤 ${Math.round(reflected)}`:''}。`);",
'aoe reflect log')

p.write_text(s,encoding='utf-8')

# Battle theater: update attacker HP and show reflect float/feed.
p=Path('v201-battle-theater.js')
s=p.read_text(encoding='utf-8')
insert="const applyReflect=(ev)=>{const dmg=Math.max(0,Number(ev.reflectDamage)||0);if(!dmg)return '';const enemy=box.querySelector(`[data-bt-enemy=\"${ev.enemyId||'e0'}\"]`),pct=Math.max(0,Math.min(100,(Number(ev.enemyHp)||0)/Math.max(1,Number(ev.enemyMax)||1)*100));enemyHp[ev.enemyId||'e0']=pct;setHp(enemy,pct);enemy?.classList.add('hit');float(box,enemy,'反伤 -'+Math.round(dmg));setTimeout(()=>enemy?.classList.remove('hit'),180/Math.max(1,speed));if(pct<=0)enemy?.classList.add('rg-bt-dead');return '；反甲反伤 '+Math.round(dmg)};"
anchor="const animateGauges=async ev=>"
if anchor not in s: raise SystemExit('Missing expected pattern: theater animate anchor')
s=s.replace(anchor,insert+anchor,1)

# For AOE, apply reflection after all ally hits; for single target, after ally hit.
s=req(s,
"if(allyHp[tr.targetId]<=0)el?.classList.add('rg-bt-dead')}feed.innerHTML=",
"if(allyHp[tr.targetId]<=0)el?.classList.add('rg-bt-dead')}const reflectText=applyReflect(ev);feed.innerHTML=",
'aoe theater reflect')
s=req(s,
"+'敌方全体攻击！'</strong>",
"+'敌方全体攻击！'+reflectText+'</strong>",
'aoe feed reflect text') if "+'敌方全体攻击！'</strong>" in s else s

# Single target branch has one ally HP update before feed; insert a reflectText there.
needle="if(allyHp[ev.targetId]<=0)el?.classList.add('rg-bt-dead');feed.innerHTML="
if needle in s:
    s=s.replace(needle,"if(allyHp[ev.targetId]<=0)el?.classList.add('rg-bt-dead');const reflectText=applyReflect(ev);feed.innerHTML=",1)
# Append to the common enemy single-target HP damage feed when present.
s=s.replace("'HP -'+Math.round(ev.hpDamage||0)","'HP -'+Math.round(ev.hpDamage||0)+(reflectText||'')",1)

p.write_text(s,encoding='utf-8')
