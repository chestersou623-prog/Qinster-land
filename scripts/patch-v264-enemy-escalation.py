from pathlib import Path
import re,json
p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

# Enemy team size / elite / boss escalation.
pat=r"function enemyTeamRoles\(kind\)\{.*?\n\}\nfunction makeEnemyUnit"
rep="""function enemyTeamRoles(kind,run){
  const f=floorNo(run?.stage||0),d=diff(run?.difficulty||0),maxCount=Math.max(3,3+Math.floor((f-1)/3));
  const total=1+Math.floor(Math.random()*maxCount),roles=[];
  if(kind==='battle')return Array(total).fill('normal');
  if(kind==='elite'){
    const eliteMax=d.id>=6?2:1,eliteCount=Math.min(total,1+Math.floor(Math.random()*eliteMax));
    for(let i=0;i<eliteCount;i++)roles.push('elite');
    while(roles.length<total)roles.push('normal');
    return roles;
  }
  const bossMax=d.id>=9?2:1,bossCount=Math.min(total,1+Math.floor(Math.random()*bossMax));
  for(let i=0;i<bossCount;i++)roles.push('boss');
  while(roles.length<total)roles.push(d.id>=6&&Math.random()<.35?'elite':'normal');
  return roles;
}
function enemySkillRoll(run,role){
  const d=diff(run?.difficulty||0);if(d.id<4)return null;
  const chance=role==='boss'?.30:role==='elite'?.24:.16;
  if(role==='normal'&&Math.random()>.60)return null;
  const pool=[
    {id:'armorBreak',name:'破甲猛击',type:'single',power:1.25,debuff:{def:-.12},duration:2,chance},
    {id:'drain',name:'吸血撕咬',type:'single',power:1.15,heal:.15,chance},
    {id:'heavy',name:'震荡冲锋',type:'single',power:1.65,chance},
    {id:'slow',name:'迟滞爪击',type:'single',power:1.10,debuff:{spd:-.15},duration:2,chance},
    {id:'sweep',name:'横扫',type:'aoe',power:.72,chance}
  ];
  return rand(pool);
}
function makeEnemyUnit"""
s,n=re.subn(pat,rep,s,count=1,flags=re.S)
if n!=1: raise SystemExit('enemyTeamRoles anchor missing')

# Replace makeEnemyUnit with star-tiered floor scaling, formation scaling and enemy skills.
pat=r"function makeEnemyUnit\(run,role,index=0\)\{.*?\n\}\nfunction enemyPreview"
rep="""function makeEnemyUnit(run,role,index=0,teamSize=1){
  const zone=z(run.zone),d=diff(run.difficulty),stage=Math.max(0,Number(run.stage)||0),floor=floorNo(stage),endlessMul=1+endlessExtra(stage),kindScale=role==='boss'?1.42:role==='elite'?1.20:1;
  const starTier=floor<=1?.52:floor===2?.76:1.00;
  const formationScale=Math.max(.60,1-Math.max(0,teamSize-1)*.06);
  const range=role==='boss'?[.99,1.05]:role==='elite'?[.97,1.04]:[.96,1.04],variance=range[0]+Math.random()*(range[1]-range[0]),mods=d.mods||{},speciesCount=Math.max(1,R()?.G?.SPECIES?.length||1),enemySpecies=Math.floor(Math.random()*speciesCount),affixPool=[{name:'狂暴',mods:{atk:.20}},{name:'铁壁',mods:{def:.25}},{name:'迅捷',mods:{spd:.20}},{name:'强运',mods:{luck:.25}},{name:'巨躯',mods:{hp:.25}},{name:'精准',mods:{atk:.08,luck:.15}}],affixCount=d.id>=10?3:d.id>=7?2:d.id>=4?1:0,affixes=shuffle(affixPool).slice(0,affixCount),am={};
  for(const a of affixes)for(const [k,v] of Object.entries(a.mods))am[k]=(am[k]||0)+v;
  const base=starTier*kindScale*variance*formationScale*(zone.shinyOnly?1.20:1);
  const hpMul=1+(mods.hp||0)+(am.hp||0),atkMul=1+(mods.atk||0)+(am.atk||0),defMul=1+(mods.def||0)+(am.def||0),spdMul=1+(mods.spd||0)+(am.spd||0),luckMul=1+(mods.luck||0)+(am.luck||0);
  const maxHp=Math.round(1600*base*hpMul*endlessMul),atk=Math.round(400*base*atkMul*endlessMul),def=Math.round(360*base*defMul*endlessMul),spd=Math.round(340*base*spdMul*endlessMul),luck=Math.round(300*base*luckMul*endlessMul);
  const e={id:'e'+index,role,name:enemyRoleName(role),enemySpecies,enemyShiny:zone.shinyOnly,maxHp,hp:maxHp,atk,def,spd,luck,affixes:affixes.map(x=>x.name),variance:Math.round(variance*100),enemySkill:enemySkillRoll(run,role),starTier:floor>=3?5:(floor===2?4:2)};
  e.difficultyRating=enemyDifficultyRating(e);return e;
}
function enemyPreview"""
s,n=re.subn(pat,rep,s,count=1,flags=re.S)
if n!=1: raise SystemExit('makeEnemyUnit anchor missing')

s=s.replace("function enemyPreview(run,kind){const roles=enemyTeamRoles(kind),enemies=roles.map((role,i)=>makeEnemyUnit(run,role,i));",
            "function enemyPreview(run,kind){const roles=enemyTeamRoles(kind,run),enemies=roles.map((role,i)=>makeEnemyUnit(run,role,i,roles.length));",1)

# Enemy skills: difficulty 4+, probabilistic. Preserve legacy boss/elite behavior when no dedicated skill triggers.
old="enemyActions[e.id]=(enemyActions[e.id]||0)+1;let mode='normal';if(e.role==='boss'){const r=Math.random();mode=enemyActions[e.id]%4===0?'aoe':r<.55?'normal':r<.80?'skill':'aoe'}else if(e.role==='elite'&&Math.random()<.18)mode='skill';"
new="enemyActions[e.id]=(enemyActions[e.id]||0)+1;const es=e.enemySkill||null;let mode='normal';if(es&&Math.random()<Number(es.chance||0))mode=es.type==='aoe'?'aoeSkill':'skill';else if(e.role==='boss'){const r=Math.random();mode=enemyActions[e.id]%4===0?'aoe':r<.55?'normal':r<.80?'skill':'aoe'}else if(e.role==='elite'&&Math.random()<.18)mode='skill';"
if old not in s: raise SystemExit('enemy mode anchor missing')
s=s.replace(old,new,1)

s=s.replace("if(mode==='aoe'){\n        const targets=current.map(x=>hurtAlly(e,x,.64)),reflected=targets.reduce((n,x)=>n+(Number(x.reflectDamage)||0),0);events.push({type:'enemy',action:actions,enemyId:e.id,enemyIndex:enemies.indexOf(e),aoe:true,skillName:'全体攻击',attackType:'全体攻击',targets,reflectDamage:reflected,enemyHp:e.hp,enemyMax:e.maxHp,spd:ready.spd,wait:dt,gauges:snap,allyStats:allyStatsSnapshot()});logs.push(`行动 ${actions}：${e.name} 使用【全体攻击】，攻击全队${reflected>0?`；反甲累计反伤 ${Math.round(reflected)}`:''}。`);",
"if(mode==='aoe'||mode==='aoeSkill'){\n        const skillLabel=mode==='aoeSkill'?(es?.name||'横扫'):'全体攻击',aoePower=mode==='aoeSkill'?Number(es?.power||.72):.64,targets=current.map(x=>hurtAlly(e,x,aoePower)),reflected=targets.reduce((n,x)=>n+(Number(x.reflectDamage)||0),0);events.push({type:'enemy',action:actions,enemyId:e.id,enemyIndex:enemies.indexOf(e),aoe:true,skillName:skillLabel,attackType:skillLabel,targets,reflectDamage:reflected,enemyHp:e.hp,enemyMax:e.maxHp,spd:ready.spd,wait:dt,gauges:snap,allyStats:allyStatsSnapshot()});logs.push(`行动 ${actions}：${e.name} 使用【${skillLabel}】，攻击全队${reflected>0?`；反甲累计反伤 ${Math.round(reflected)}`:''}。`);",1)

old="const roll=Math.random(),target=roll<.64?current[0]:roll<.88?(current[1]||current[0]):(current[2]||current[1]||current[0]),res=hurtAlly(e,target,mode==='skill'?1.45:1);events.push({type:'enemy',action:actions,enemyId:e.id,enemyIndex:enemies.indexOf(e),targetId:res.targetId,hpLoss:res.hpLoss,hpDamage:res.hpDamage,maxHp:res.maxHp,hpAfter:res.hpAfter,hpAfterAbs:res.hpAfterAbs,reflectDamage:res.reflectDamage,enemyHp:res.enemyHp,enemyMax:res.enemyMax,miss:res.miss,skillName:mode==='skill'?'强袭技能':'',attackType:mode==='skill'?'强袭技能':'普通攻击',spd:ready.spd,wait:dt,gauges:snap,allyStats:allyStatsSnapshot()});logs.push(`行动 ${actions}：${e.name} 使用【${mode==='skill'?'强袭技能':'普通攻击'}】攻击 ${monsterName(target)}${res.miss?'，但被闪避。':`，HP -${Math.round(res.hpDamage)}（${Math.round(res.hpAfterAbs)}/${Math.round(res.maxHp)}）${res.reflectDamage>0?`；反甲反伤 ${Math.round(res.reflectDamage)}`:''}`}。`)"
new="const roll=Math.random(),target=roll<.64?current[0]:roll<.88?(current[1]||current[0]):(current[2]||current[1]||current[0]),dedicated=mode==='skill'&&es,skillLabel=dedicated?es.name:(mode==='skill'?'强袭技能':''),skillPower=dedicated?Number(es.power||1.2):(mode==='skill'?1.45:1),res=hurtAlly(e,target,skillPower);if(dedicated&&!res.miss){if(es.debuff)applyBuff(allyBuff,es.debuff,es.duration||2);if(es.heal)e.hp=Math.min(e.maxHp,e.hp+res.hpDamage*Number(es.heal||0))}events.push({type:'enemy',action:actions,enemyId:e.id,enemyIndex:enemies.indexOf(e),targetId:res.targetId,hpLoss:res.hpLoss,hpDamage:res.hpDamage,maxHp:res.maxHp,hpAfter:res.hpAfter,hpAfterAbs:res.hpAfterAbs,reflectDamage:res.reflectDamage,enemyHp:e.hp,enemyMax:e.maxHp,miss:res.miss,skillName:skillLabel,attackType:skillLabel||'普通攻击',spd:ready.spd,wait:dt,gauges:snap,allyStats:allyStatsSnapshot()});logs.push(`行动 ${actions}：${e.name} 使用【${skillLabel||'普通攻击'}】攻击 ${monsterName(target)}${res.miss?'，但被闪避。':`，HP -${Math.round(res.hpDamage)}（${Math.round(res.hpAfterAbs)}/${Math.round(res.maxHp)}）${res.reflectDamage>0?`；反甲反伤 ${Math.round(res.reflectDamage)}`:''}${dedicated&&es.debuff?'；附加能力削弱':''}${dedicated&&es.heal?'；吸取生命':''}`}。`)"
if old not in s: raise SystemExit('enemy single attack anchor missing')
s=s.replace(old,new,1)

# Show enemy skill and star tier in preview/result cards where possible.
s=s.replace("affixes:primary.affixes,variance:primary.variance,enemyPower,difficultyRating:enemyPower};",
            "affixes:primary.affixes,variance:primary.variance,enemyPower,difficultyRating:enemyPower};",1)

# Version bumps.
s=s.replace("window.QinsterExpedition={render,zones:ZONES,version:'v263'}","window.QinsterExpedition={render,zones:ZONES,version:'v264'}")
p.write_text(s,encoding='utf-8')

idx=Path('index.html');x=idx.read_text(encoding='utf-8').replace('v=263','v=264').replace('v263 ·','v264 ·').replace('Qinster v263 错误','Qinster v264 错误');idx.write_text(x,encoding='utf-8')
pkg=Path('package.json');d=json.loads(pkg.read_text(encoding='utf-8'));d['version']='264.0.0';pkg.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
lock=Path('package-lock.json');ld=json.loads(lock.read_text(encoding='utf-8'));ld['version']='264.0.0';ld['packages']['']['version']='264.0.0';lock.write_text(json.dumps(ld,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('v264 patch applied')
