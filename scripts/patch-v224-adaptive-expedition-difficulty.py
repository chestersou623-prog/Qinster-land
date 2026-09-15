from pathlib import Path

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')
start=s.find('function enemyPreview(run,kind){')
end=s.find('function prepareBattle(run,kind){', start)
if start<0 or end<0:
    raise SystemExit('enemyPreview bounds not found')

new=r'''function enemyPreview(run,kind){
  const zone=z(run.zone),d=diff(run.difficulty),elite=kind==='elite',boss=kind==='boss',local=run.stage%9,chapter=Math.floor(run.stage/9),base=zone.enemy*(1+local*.05+chapter*.18)*(elite?1.18:1)*(boss?1.32:1),range=boss?[1.20,1.45]:elite?[1.05,1.25]:[.90,1.10],variance=range[0]+Math.random()*(range[1]-range[0]),mods=d.mods||{},speciesCount=Math.max(1,R()?.G?.SPECIES?.length||1),enemySpecies=Math.floor(Math.random()*speciesCount),affixPool=[{name:'狂暴',mods:{atk:.20}},{name:'铁壁',mods:{def:.25}},{name:'迅捷',mods:{spd:.20}},{name:'强运',mods:{luck:.25}},{name:'巨躯',mods:{hp:.25}},{name:'精准',mods:{atk:.08,luck:.15}}],affixCount=d.id>=10?3:d.id>=7?2:d.id>=4?1:0,affixes=shuffle(affixPool).slice(0,affixCount),am={};
  for(const a of affixes)for(const [k,v] of Object.entries(a.mods))am[k]=(am[k]||0)+v;
  const mult=base*variance,hpMul=1+(mods.hp||0)+(am.hp||0),atkMul=1+(mods.atk||0)+(am.atk||0),defMul=1+(mods.def||0)+(am.def||0),spdMul=1+(mods.spd||0)+(am.spd||0),luckMul=1+(mods.luck||0)+(am.luck||0);

  // v224: keep difficulty 0 accessible to low-star teams, but stop high-star teams from fighting low-star-stat enemies.
  // The enemy keeps the old progression formula, then receives a minimum stat floor derived from the actual three-monster team.
  const party=activeTeam(run),n=Math.max(1,party.length),avg=[0,0,0,0,0];
  for(const m of party){const v=st(m);for(let i=0;i<5;i++)avg[i]+=Number(v[i])||0}
  for(let i=0;i<5;i++)avg[i]/=n;
  const routeScale=1+local*.015+chapter*.08,diffFloor=1+(Number(d.id)||0)*.025;
  const hpFactor=boss?5.5:elite?4.1:3.0;
  const atkFactor=boss?.22:elite?.18:.14;
  const defFactor=boss?.90:elite?.78:.65;
  const spdFactor=boss?1.05:elite?.95:.82;
  const luckFactor=boss?1.00:elite?.85:.70;
  const staticHp=Math.round((520*mult+100)*hpMul),staticAtk=Math.round((42*mult+8)*atkMul),staticDef=Math.round((35*mult+7)*defMul),staticSpd=Math.round((30*mult+6)*spdMul),staticLuck=Math.round((26*mult+5)*luckMul);
  const adaptiveHp=Math.round(avg[0]*hpFactor*routeScale*diffFloor*variance*hpMul);
  const adaptiveAtk=Math.round(avg[1]*atkFactor*routeScale*diffFloor*variance*atkMul);
  const adaptiveDef=Math.round(avg[2]*defFactor*routeScale*diffFloor*variance*defMul);
  const adaptiveSpd=Math.round(avg[3]*spdFactor*routeScale*diffFloor*variance*spdMul);
  const adaptiveLuck=Math.round(avg[4]*luckFactor*routeScale*diffFloor*variance*luckMul);
  return{kind,enemySpecies,enemyShiny:zone.shinyOnly,enemyMax:Math.max(staticHp,adaptiveHp),enemyAtk:Math.max(staticAtk,adaptiveAtk),enemyDef:Math.max(staticDef,adaptiveDef),enemySpd:Math.max(staticSpd,adaptiveSpd),enemyLuck:Math.max(staticLuck,adaptiveLuck),affixes:affixes.map(x=>x.name),variance:Math.round(variance*100),adaptive:true,teamAvg:avg.map(x=>Math.round(x))};
}
'''
s=s[:start]+new+s[end:]

# Make the preview explain that enemy values now scale to the selected team.
needle="<small>${b.affixes?.length?'强化词条：'+b.affixes.join(' · '):'强化词条：无'} · 随机系数 ${b.variance||100}%</small>"
repl="<small>${b.affixes?.length?'强化词条：'+b.affixes.join(' · '):'强化词条：无'} · 随机系数 ${b.variance||100}%${b.adaptive?' · 队伍强度自适应':''}</small>"
s=s.replace(needle,repl)
s=s.replace("version:'v223-route-erosion'","version:'v224-adaptive-expedition'")
p.write_text(s,encoding='utf-8')
print('v224 adaptive expedition difficulty applied')
