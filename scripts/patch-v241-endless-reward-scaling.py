from pathlib import Path

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

old="function floorRewardBonus(stage){return Math.max(0,floorNo(stage)-1)*.05}"
new="function floorRewardBonus(stage){return Math.max(0,floorNo(stage)-3)*.05}"
if old not in s:
    raise SystemExit('floorRewardBonus target not found')
s=s.replace(old,new,1)

old="function prepareEggMilestone(run){const f=floorNo(run.stage),d=Number(run.difficulty)||0;run.eggMilestoneChoices=[\n{key:'eggFragment',name:'基础蛋碎片',value:24+f*2+d,text:'用于现有蛋碎片工坊'},\n{key:'expeditionEggFragment',name:'远征秘藏碎片',value:12+f+d,text:'更稀有的远征专属碎片'},\n{key:'shinyEggFragment',name:'闪光蛋碎片',value:6+Math.floor(f/2)+Math.floor(d/2),text:'最稀有，留给闪光相关配方'}\n];run.phase='eggMilestone';save(`${floorLabel(run.stage)}：达成每3楼层的蛋碎片奖励。`)}"
new="function prepareEggMilestone(run){const f=floorNo(run.stage),d=Number(run.difficulty)||0,rewardMul=1+floorRewardBonus(run.stage),scale=v=>Math.max(1,Math.round(v*rewardMul));run.eggMilestoneChoices=[\n{key:'eggFragment',name:'基础蛋碎片',value:scale(24+f*2+d),text:'用于现有蛋碎片工坊'},\n{key:'expeditionEggFragment',name:'远征秘藏碎片',value:scale(12+f+d),text:'更稀有的远征专属碎片'},\n{key:'shinyEggFragment',name:'闪光蛋碎片',value:scale(6+Math.floor(f/2)+Math.floor(d/2)),text:'最稀有，留给闪光相关配方'}\n];run.phase='eggMilestone';save(`${floorLabel(run.stage)}：达成每3楼层的蛋碎片奖励。`)}"
if old not in s:
    raise SystemExit('prepareEggMilestone target not found')
s=s.replace(old,new,1)

old="function checkpointBoss(run){const zone=z(run.zone),d=diff(run.difficulty),bossNo=floorNo(run.stage),mapBonus=zone.shinyOnly?1.35:1,crystals=Math.max(1,Math.round((bossNo+d.id/3)*mapBonus));run.materials.starCrystal=(run.materials.starCrystal||0)+crystals;"
new="function checkpointBoss(run){const zone=z(run.zone),d=diff(run.difficulty),bossNo=floorNo(run.stage),mapBonus=zone.shinyOnly?1.35:1,rewardMul=1+floorRewardBonus(run.stage),crystals=Math.max(1,Math.round((bossNo+d.id/3)*mapBonus*rewardMul));run.materials.starCrystal=(run.materials.starCrystal||0)+crystals;"
if old not in s:
    raise SystemExit('checkpointBoss target not found')
s=s.replace(old,new,1)

old="function floorBossChoiceHTML(run){const next=floorNo(run.stage)+1,enemyExtra=Math.max(0,next-3)*10,rewardExtra=Math.max(0,next-1)*5;"
new="function floorBossChoiceHTML(run){const next=floorNo(run.stage)+1,enemyExtra=Math.max(0,next-3)*10,rewardExtra=Math.max(0,next-3)*5;"
if old not in s:
    raise SystemExit('floorBossChoice target not found')
s=s.replace(old,new,1)

old="<span>进入 ${next}-1 · 敌方全能力 +${enemyExtra}% · 本层局内奖励 +${rewardExtra}%</span>"
new="<span>进入 ${next}-1 · 敌方所有能力 +${enemyExtra}% · 本层局内奖励 +${rewardExtra}%</span>"
if old not in s:
    raise SystemExit('floor choice text target not found')
s=s.replace(old,new,1)

# Add a clear reminder in the active-run header once endless scaling starts.
old="${floorNo(run.stage)>3?' · 无限加成 +'+Math.round(endlessExtra(run.stage)*100)+'%':''}</small>"
new="${floorNo(run.stage)>3?' · 敌方全能力 +'+Math.round(endlessExtra(run.stage)*100)+'% · 局内奖励 +'+Math.round(floorRewardBonus(run.stage)*100)+'%':''}</small>"
if old not in s:
    raise SystemExit('run header endless text target not found')
s=s.replace(old,new,1)

s=s.replace("window.QinsterExpedition={render,zones:ZONES,version:'v240-difficulty-score'};","window.QinsterExpedition={render,zones:ZONES,version:'v241-endless-reward-scaling'};",1)
p.write_text(s,encoding='utf-8')

for fn in ['game.js','index.html']:
    q=Path(fn)
    x=q.read_text(encoding='utf-8')
    x=x.replace('v240','v241')
    q.write_text(x,encoding='utf-8')
