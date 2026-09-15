from pathlib import Path

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')
start=s.find('function enemyPreview(run,kind){')
end=s.find('function prepareBattle(run,kind){', start)
if start<0 or end<0:
    raise SystemExit('enemyPreview bounds not found')

new=r'''function enemyPreview(run,kind){const zone=z(run.zone),d=diff(run.difficulty),elite=kind==='elite',boss=kind==='boss',stage=Math.max(0,Number(run.stage)||0),stageScale=1+stage*.035,kindScale=boss?1.42:elite?1.20:1,base=zone.enemy*stageScale*kindScale,range=boss?[.99,1.05]:elite?[.97,1.04]:[.96,1.04],variance=range[0]+Math.random()*(range[1]-range[0]),mods=d.mods||{},speciesCount=Math.max(1,R()?.G?.SPECIES?.length||1),enemySpecies=Math.floor(Math.random()*speciesCount),affixPool=[{name:'狂暴',mods:{atk:.20}},{name:'铁壁',mods:{def:.25}},{name:'迅捷',mods:{spd:.20}},{name:'强运',mods:{luck:.25}},{name:'巨躯',mods:{hp:.25}},{name:'精准',mods:{atk:.08,luck:.15}}],affixCount=d.id>=10?3:d.id>=7?2:d.id>=4?1:0,affixes=shuffle(affixPool).slice(0,affixCount),am={};for(const a of affixes)for(const [k,v] of Object.entries(a.mods))am[k]=(am[k]||0)+v;const mult=base*variance,hpMul=1+(mods.hp||0)+(am.hp||0),atkMul=1+(mods.atk||0)+(am.atk||0),defMul=1+(mods.def||0)+(am.def||0),spdMul=1+(mods.spd||0)+(am.spd||0),luckMul=1+(mods.luck||0)+(am.luck||0);return{kind,enemySpecies,enemyShiny:zone.shinyOnly,enemyMax:Math.round((900*mult+180)*hpMul),enemyAtk:Math.round((95*mult+20)*atkMul),enemyDef:Math.round((82*mult+18)*defMul),enemySpd:Math.round((76*mult+16)*spdMul),enemyLuck:Math.round((62*mult+14)*luckMul),affixes:affixes.map(x=>x.name),variance:Math.round(variance*100)}}
'''
s=s[:start]+new+s[end:]
s=s.replace("version:'v224b-fixed-expedition'","version:'v224c-steady-expedition'")
p.write_text(s,encoding='utf-8')
print('v224c steady fixed expedition curve applied')
