from pathlib import Path

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

old="function nodeRewardScale(zone,stage){const run=ensure()?.rogueActive,d=diff(run?.difficulty??selectedDifficulty),chapter=Math.floor((Number(stage)||0)/9),local=(Number(stage)||0)%9;return zone.reward*d.reward*(1+chapter*.18+local*.04)}"
new="function floorRewardBonus(stage){return Math.max(0,floorNo(stage)-1)*.05}\nfunction nodeRewardScale(zone,stage){const run=ensure()?.rogueActive,d=diff(run?.difficulty??selectedDifficulty);return zone.reward*d.reward*(1+floorRewardBonus(stage))}"
if old not in s: raise SystemExit('nodeRewardScale target not found')
s=s.replace(old,new,1)

old="function enemyPreview(run,kind){const zone=z(run.zone),d=diff(run.difficulty),elite=kind==='elite',boss=kind==='boss',stage=Math.max(0,Number(run.stage)||0),stageScale=1+stage*.035,endlessMul=1+endlessExtra(stage),kindScale=boss?1.42:elite?1.20:1,base=zone.enemy*stageScale*endlessMul*kindScale,range=boss?[.99,1.05]:elite?[.97,1.04]:[.96,1.04],variance=range[0]+Math.random()*(range[1]-range[0]),mods=d.mods||{},speciesCount=Math.max(1,R()?.G?.SPECIES?.length||1),enemySpecies=Math.floor(Math.random()*speciesCount),affixPool=[{name:'狂暴',mods:{atk:.20}},{name:'铁壁',mods:{def:.25}},{name:'迅捷',mods:{spd:.20}},{name:'强运',mods:{luck:.25}},{name:'巨躯',mods:{hp:.25}},{name:'精准',mods:{atk:.08,luck:.15}}],affixCount=d.id>=10?3:d.id>=7?2:d.id>=4?1:0,affixes=shuffle(affixPool).slice(0,affixCount),am={};for(const a of affixes)for(const [k,v] of Object.entries(a.mods))am[k]=(am[k]||0)+v;const mult=base*variance,hpMul=1+(mods.hp||0)+(am.hp||0),atkMul=1+(mods.atk||0)+(am.atk||0),defMul=1+(mods.def||0)+(am.def||0),spdMul=1+(mods.spd||0)+(am.spd||0),luckMul=1+(mods.luck||0)+(am.luck||0);return{kind,enemySpecies,enemyShiny:zone.shinyOnly,enemyMax:Math.round((900*mult+180)*hpMul),enemyAtk:Math.round((95*mult+20)*atkMul),enemyDef:Math.round((82*mult+18)*defMul),enemySpd:Math.round((76*mult+16)*spdMul),enemyLuck:Math.round((62*mult+14)*luckMul),affixes:affixes.map(x=>x.name),variance:Math.round(variance*100)}}"
new="function enemyPreview(run,kind){const zone=z(run.zone),d=diff(run.difficulty),elite=kind==='elite',boss=kind==='boss',stage=Math.max(0,Number(run.stage)||0),stageScale=1+stage*.035,endlessMul=1+endlessExtra(stage),kindScale=boss?1.42:elite?1.20:1,base=zone.enemy*stageScale*kindScale,range=boss?[.99,1.05]:elite?[.97,1.04]:[.96,1.04],variance=range[0]+Math.random()*(range[1]-range[0]),mods=d.mods||{},speciesCount=Math.max(1,R()?.G?.SPECIES?.length||1),enemySpecies=Math.floor(Math.random()*speciesCount),affixPool=[{name:'狂暴',mods:{atk:.20}},{name:'铁壁',mods:{def:.25}},{name:'迅捷',mods:{spd:.20}},{name:'强运',mods:{luck:.25}},{name:'巨躯',mods:{hp:.25}},{name:'精准',mods:{atk:.08,luck:.15}}],affixCount=d.id>=10?3:d.id>=7?2:d.id>=4?1:0,affixes=shuffle(affixPool).slice(0,affixCount),am={};for(const a of affixes)for(const [k,v] of Object.entries(a.mods))am[k]=(am[k]||0)+v;const mult=base*variance,hpMul=1+(mods.hp||0)+(am.hp||0),atkMul=1+(mods.atk||0)+(am.atk||0),defMul=1+(mods.def||0)+(am.def||0),spdMul=1+(mods.spd||0)+(am.spd||0),luckMul=1+(mods.luck||0)+(am.luck||0);return{kind,enemySpecies,enemyShiny:zone.shinyOnly,enemyMax:Math.round((900*mult+180)*hpMul*endlessMul),enemyAtk:Math.round((95*mult+20)*atkMul*endlessMul),enemyDef:Math.round((82*mult+18)*defMul*endlessMul),enemySpd:Math.round((76*mult+16)*spdMul*endlessMul),enemyLuck:Math.round((62*mult+14)*luckMul*endlessMul),affixes:affixes.map(x=>x.name),variance:Math.round(variance*100)}}"
if old not in s: raise SystemExit('enemyPreview target not found')
s=s.replace(old,new,1)

old="function floorBossChoiceHTML(run){const next=floorNo(run.stage)+1,extra=Math.max(0,next-3)*10;return `${runHeader(run)}${runInventoryHTML(run)}<section class=\"rg-panel rg-floor-choice\"><div class=\"rg-title\"><div><b>${floorLabel(run.stage)} 楼层BOSS已击败</b><small>现在是安全结算点。继续后进入 ${next}-1；新楼层敌人在原有难度与流程成长上额外 +${extra}%。</small></div></div><div class=\"rg-final\"><button class=\"primary rg-relic\" data-rg-floor-cashout><b>领取全部奖励并结束</b><span>以 100% 结算目前已获得奖励</span></button><button class=\"secondary rg-relic\" data-rg-floor-continue><b>继续无限模式</b><span>进入 ${next}-1 · 无限额外 +${extra}%</span></button></div></section>`}"
new="function floorBossChoiceHTML(run){const next=floorNo(run.stage)+1,enemyExtra=Math.max(0,next-3)*10,rewardExtra=Math.max(0,next-1)*5;return `${runHeader(run)}${runInventoryHTML(run)}<section class=\"rg-panel rg-floor-choice\"><div class=\"rg-title\"><div><b>${floorLabel(run.stage)} 楼层BOSS已击败</b><small>现在是安全结算点。继续后进入 ${next}-1；敌方全能力与局内奖励使用独立倍率。</small></div></div><div class=\"rg-final\"><button class=\"primary rg-relic\" data-rg-floor-cashout><b>领取全部奖励并结束</b><span>以 100% 结算目前已获得奖励</span></button><button class=\"secondary rg-relic\" data-rg-floor-continue><b>继续无限模式</b><span>进入 ${next}-1 · 敌方全能力 +${enemyExtra}% · 本层局内奖励 +${rewardExtra}%</span></button></div></section>`}"
if old not in s: raise SystemExit('floorBossChoiceHTML target not found')
s=s.replace(old,new,1)

old="function runHeader(run){const zone=z(run.zone),d=diff(run.difficulty),chapter=Math.floor(run.stage/9)+1;return `<section class=\"rg-panel\"><div class=\"rg-title\"><div><b>${zone.label} · ${d.label}</b><small>当前楼层 ${floorLabel(run.stage)} · 每个 X-9 为楼层BOSS${floorNo(run.stage)>3?' · 无限加成 +'+Math.round(endlessExtra(run.stage)*100)+'%':''}</small></div><button class=\"secondary\" data-rg-abandon>退出（失败·25%）</button></div>"
new="function runHeader(run){const zone=z(run.zone),d=diff(run.difficulty),chapter=Math.floor(run.stage/9)+1,enemyExtra=Math.round(endlessExtra(run.stage)*100),rewardExtra=Math.round(floorRewardBonus(run.stage)*100);return `<section class=\"rg-panel\"><div class=\"rg-title\"><div><b>${zone.label} · ${d.label}</b><small>当前楼层 ${floorLabel(run.stage)} · 每个 X-9 为楼层BOSS${enemyExtra?' · 敌方全能力 +'+enemyExtra+'%':''} · 本层局内奖励 +${rewardExtra}%</small></div><button class=\"secondary\" data-rg-abandon>退出（失败·25%）</button></div>"
if old not in s: raise SystemExit('runHeader prefix target not found')
s=s.replace(old,new,1)

s=s.replace("version:'v240-difficulty-score'","version:'v241-endless-stats-rewards'",1)
p.write_text(s,encoding='utf-8')

for fn in ['game.js','index.html']:
    q=Path(fn)
    x=q.read_text(encoding='utf-8').replace('v240','v241')
    q.write_text(x,encoding='utf-8')
