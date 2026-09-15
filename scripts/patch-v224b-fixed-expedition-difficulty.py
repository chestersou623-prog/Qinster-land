from pathlib import Path

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')
start=s.find('function enemyPreview(run,kind){')
end=s.find('function prepareBattle(run,kind){', start)
if start<0 or end<0:
    raise SystemExit('enemyPreview bounds not found')

new=r'''function enemyPreview(run,kind){const zone=z(run.zone),d=diff(run.difficulty),elite=kind==='elite',boss=kind==='boss',local=run.stage%9,chapter=Math.floor(run.stage/9),base=zone.enemy*(1+local*.05+chapter*.18)*(elite?1.18:1)*(boss?1.32:1),range=boss?[1.20,1.45]:elite?[1.05,1.25]:[.90,1.10],variance=range[0]+Math.random()*(range[1]-range[0]),mods=d.mods||{},speciesCount=Math.max(1,R()?.G?.SPECIES?.length||1),enemySpecies=Math.floor(Math.random()*speciesCount),affixPool=[{name:'狂暴',mods:{atk:.20}},{name:'铁壁',mods:{def:.25}},{name:'迅捷',mods:{spd:.20}},{name:'强运',mods:{luck:.25}},{name:'巨躯',mods:{hp:.25}},{name:'精准',mods:{atk:.08,luck:.15}}],affixCount=d.id>=10?3:d.id>=7?2:d.id>=4?1:0,affixes=shuffle(affixPool).slice(0,affixCount),am={};for(const a of affixes)for(const [k,v] of Object.entries(a.mods))am[k]=(am[k]||0)+v;const mult=base*variance,hpMul=1+(mods.hp||0)+(am.hp||0),atkMul=1+(mods.atk||0)+(am.atk||0),defMul=1+(mods.def||0)+(am.def||0),spdMul=1+(mods.spd||0)+(am.spd||0),luckMul=1+(mods.luck||0)+(am.luck||0);return{kind,enemySpecies,enemyShiny:zone.shinyOnly,enemyMax:Math.round((2000*mult+450)*hpMul),enemyAtk:Math.round((190*mult+45)*atkMul),enemyDef:Math.round((180*mult+40)*defMul),enemySpd:Math.round((210*mult+50)*spdMul),enemyLuck:Math.round((150*mult+35)*luckMul),affixes:affixes.map(x=>x.name),variance:Math.round(variance*100)}}
'''
s=s[:start]+new+s[end:]

# Remove any adaptive-preview label left by v224.
s=s.replace("${b.variance||100}%${b.adaptive?' · 队伍强度自适应':''}","${b.variance||100}%")
s=s.replace("version:'v224-adaptive-expedition'","version:'v224b-fixed-expedition'")
p.write_text(s,encoding='utf-8')
print('v224b fixed expedition curve applied')
