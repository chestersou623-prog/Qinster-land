from pathlib import Path

exp=Path('v199-roguelike-expedition.js')
s=exp.read_text(encoding='utf-8')

def rep(old,new,label):
    global s
    if old not in s:
        raise SystemExit(f'{label} target not found')
    s=s.replace(old,new,1)

# idle sub-tabs
rep("let selected=[],selectedZone='normal',selectedDifficulty=0,sortMode='recommended',zoneInitialized=false;",
    "let selected=[],selectedZone='normal',selectedDifficulty=0,sortMode='recommended',zoneInitialized=false,idleTab='run';",
    'idle tab var')

# persistent expedition meta
rep("if(!e.loot)e.loot={relicDust:0,starCrystal:0,eggFragment:0};",
    "if(!e.loot)e.loot={relicDust:0,starCrystal:0,eggFragment:0};for(const k of ['relicDust','starCrystal','eggFragment','expeditionEggFragment','shinyEggFragment'])e.loot[k]=Math.max(0,Number(e.loot[k])||0);if(!e.metaTree)e.metaTree={atk:0,def:0,spd:0,luck:0,supply:0};if(!Array.isArray(e.leaderboard))e.leaderboard=[];",
    'ensure meta')

anchor="function endlessExtra(stage){return Math.max(0,floorNo(stage)-3)*.10}\n"
insert=r'''function endlessExtra(stage){return Math.max(0,floorNo(stage)-3)*.10}
const META_TREE=[
{id:'atk',name:'远征攻击',max:5,cost:[5,10,20,35,55],text:'每级：远征中全队攻击 +1%'},
{id:'def',name:'远征防御',max:5,cost:[5,10,20,35,55],text:'每级：远征中全队防御 +1%'},
{id:'spd',name:'远征速度',max:5,cost:[5,10,20,35,55],text:'每级：远征中全队速度 +1%'},
{id:'luck',name:'远征幸运',max:5,cost:[5,10,20,35,55],text:'每级：远征中全队幸运 +1%'},
{id:'supply',name:'先遣补给',max:3,cost:[15,30,60],text:'每级：开局补给 +1'}
];
function metaMods(e=ensure()){const t=e?.metaTree||{},out={};for(const k of ['atk','def','spd','luck'])out[k]=(Number(t[k])||0)*.01;out.supply=Number(t.supply)||0;return out}
function buyMeta(id){const e=ensure(),n=META_TREE.find(x=>x.id===id);if(!e||!n)return;const lv=Math.max(0,Number(e.metaTree?.[id])||0);if(lv>=n.max)return R()?.tell?.('这个远征加成已经满级。');const cost=n.cost[lv]||999;if(e.badges<cost)return R()?.tell?.(`远征徽章不足，需要 ${cost}。`);e.badges-=cost;e.metaTree[id]=lv+1;save(`${n.name} 升至 Lv${lv+1}。`)}
function idleNav(){return `<section class="rg-panel"><div class="rg-tabs"><button class="secondary ${idleTab==='run'?'on':''}" data-rg-idle-tab="run"><b>远征</b><small>出发与蛋碎片工坊</small></button><button class="secondary ${idleTab==='meta'?'on':''}" data-rg-idle-tab="meta"><b>远征加成树</b><small>消耗徽章，永久强化远征</small></button><button class="secondary ${idleTab==='ladder'?'on':''}" data-rg-idle-tab="ladder"><b>肉鸽积分榜</b><small>按本局累计击杀积分排序</small></button></div></section>`}
function metaTreeHTML(e){return `${idleNav()}<section class="rg-panel"><div class="rg-title"><div><b>远征加成树</b><small>永久生效；价格递增，设计为长期慢慢养成</small></div><span>可用徽章 ${e.badges}</span></div><div class="rg-relics">${META_TREE.map(n=>{const lv=Math.max(0,Number(e.metaTree?.[n.id])||0),full=lv>=n.max,cost=full?'MAX':n.cost[lv];return `<article class="rg-relic"><b>${n.name} · Lv${lv}/${n.max}</b><span>${n.text}</span><button class="secondary" data-rg-meta-buy="${n.id}" ${full?'disabled':''}>${full?'已满级':'升级 · '+cost+' 徽章'}</button></article>`}).join('')}</div><p class="rg-note">攻击/防御/速度/幸运每支满级仅 +5%，补给满级 +3。不会覆盖本局遗物与训练，而是作为独立的外部加成层。</p></section>`}
function ladderHTML(e){const rows=(e.leaderboard||[]).slice(0,20);return `${idleNav()}<section class="rg-panel"><div class="rg-title"><div><b>肉鸽积分榜</b><small>优先按积分排名；同时显示最后到达楼层</small></div><span>历史记录 ${rows.length}</span></div>${rows.length?`<div class="rg-log" style="max-height:none;background:#232630">${rows.map((r,i)=>`<div style="display:grid;grid-template-columns:40px 1fr 90px 90px;gap:8px;padding:5px;border-bottom:1px solid #484d59"><b>#${i+1}</b><span>${r.zone||'远征'} · 难度 ${r.difficulty||0}</span><span>楼层 ${r.floor||'1-1'}</span><strong>${Math.round(r.score||0)} 分</strong></div>`).join('')}</div>`:'<p class="rg-note">还没有完成过可记录的远征。</p>'}</section>`}
'''
if anchor not in s: raise SystemExit('endless anchor missing')
s=s.replace(anchor,insert,1)

# external tree modifies combat stats
old="function combatValue(m,pos,run){const v=trainedBaseStats(m,run),mods=combatMods(run),sh=m.shiny?(mods.shiny||0):0;let atk=v[1]*(1+(mods.atk||0)+sh),def=v[2]*(1+(mods.def||0)+sh),spd=v[3]*(1+(mods.spd||0)),luck=v[4]*(1+(mods.luck||0)+sh),con=v[0];if(pos===0){def*=1+(mods.frontDef||0);atk*=1+(mods.frontAtk||0)}if(pos===2){atk*=1+(mods.backAtk||0);def*=1+(mods.backDef||0)}return{atk,def,spd,luck,con}}"
new="function combatValue(m,pos,run){const v=trainedBaseStats(m,run),mods=combatMods(run),meta=metaMods(),sh=m.shiny?(mods.shiny||0):0;let atk=v[1]*(1+(mods.atk||0)+(meta.atk||0)+sh),def=v[2]*(1+(mods.def||0)+(meta.def||0)+sh),spd=v[3]*(1+(mods.spd||0)+(meta.spd||0)),luck=v[4]*(1+(mods.luck||0)+(meta.luck||0)+sh),con=v[0];if(pos===0){def*=1+(mods.frontDef||0);atk*=1+(mods.frontAtk||0)}if(pos===2){atk*=1+(mods.backAtk||0);def*=1+(mods.backDef||0)}return{atk,def,spd,luck,con}}"
rep(old,new,'combat meta')

# start run score + persistent tree supply
rep("hp,supply:5,relics:[]", "hp,supply:5+(metaMods(e).supply||0),relics:[]", 'start supply')
rep("nextBattleMods:{},bossCount:0};", "nextBattleMods:{},bossCount:0,score:0,kills:{normal:0,elite:0,boss:0}};", 'score init')

# add score on every defeated enemy (single-enemy engine now; multi-enemy refactor will reuse this)
old="if(win){const eliteBonus=elite?(1+(combatMods(run).eliteReward||0)):1,base=Math.round((400+run.stage*120)*(elite?1.7:1)*(boss?2.8:1)*nodeRewardScale(zone,run.stage)*eliteBonus);run.energy+=base;"
new="if(win){const scoreBase=boss?600:elite?250:100,scoreGain=Math.round(scoreBase*(1+(floorNo(run.stage)-1)*.10)*(1+(Number(run.difficulty)||0)*.08));run.score=(Number(run.score)||0)+scoreGain;run.kills=run.kills||{normal:0,elite:0,boss:0};run.kills[kind]=(run.kills[kind]||0)+1;const eliteBonus=elite?(1+(combatMods(run).eliteReward||0)):1,base=Math.round((400+run.stage*120)*(elite?1.7:1)*(boss?2.8:1)*nodeRewardScale(zone,run.stage)*eliteBonus);run.energy+=base;"
rep(old,new,'score win')
rep("run.log.push(`${boss?'首领':elite?'精英':'战斗'}胜利：+${base} 灵能。`)", "run.log.push(`${boss?'首领':elite?'精英':'战斗'}胜利：+${base} 灵能 · 击杀积分 +${scoreGain}。`)", 'score log')

# Boss checkpoints: fragments only every third floor via choice
old="function checkpointBoss(run){const zone=z(run.zone),d=diff(run.difficulty),bossNo=Math.floor(run.stage/9)+1,mapBonus=zone.shinyOnly?1.35:1,fragments=Math.round((bossNo===1?5:10)+(bossNo===1?2:4)*d.id)*mapBonus,crystals=Math.max(1,Math.round((bossNo+d.id/3)*mapBonus));run.materials.eggFragment=(run.materials.eggFragment||0)+fragments;run.materials.starCrystal=(run.materials.starCrystal||0)+crystals;run.tempBadges+=bossNo;run.bossCount=bossNo;run.log.push(`第 ${bossNo} 名大BOSS击败：蛋碎片 +${fragments} · 星辉结晶 +${crystals} · 临时徽章 +${bossNo}。`);offerRelic(run)}"
new="function checkpointBoss(run){const zone=z(run.zone),d=diff(run.difficulty),bossNo=floorNo(run.stage),mapBonus=zone.shinyOnly?1.35:1,crystals=Math.max(1,Math.round((bossNo+d.id/3)*mapBonus));run.materials.starCrystal=(run.materials.starCrystal||0)+crystals;run.tempBadges+=Math.max(1,Math.ceil(bossNo/2));run.bossCount=bossNo;run.log.push(`${floorLabel(run.stage)} BOSS击败：星辉结晶 +${crystals} · 临时徽章 +${Math.max(1,Math.ceil(bossNo/2))}。`)}"
rep(old,new,'checkpoint boss')

milestone=r'''function prepareEggMilestone(run){const f=floorNo(run.stage),d=Number(run.difficulty)||0;run.eggMilestoneChoices=[
{key:'eggFragment',name:'基础蛋碎片',value:24+f*2+d,text:'用于现有蛋碎片工坊'},
{key:'expeditionEggFragment',name:'远征秘藏碎片',value:12+f+d,text:'更稀有的远征专属碎片'},
{key:'shinyEggFragment',name:'闪光蛋碎片',value:6+Math.floor(f/2)+Math.floor(d/2),text:'最稀有，留给闪光相关配方'}
];run.phase='eggMilestone';save(`${floorLabel(run.stage)}：达成每3楼层的蛋碎片奖励。`)}
function chooseEggMilestone(run,i){const c=run.eggMilestoneChoices?.[i];if(!c)return;run.materials[c.key]=(run.materials[c.key]||0)+c.value;run.log.push(`里程碑奖励：${c.name} +${c.value}。`);run.eggMilestoneChoices=[];run.phase='floorBossChoice';save(`获得 ${c.name} ×${c.value}。`)}
'''
needle="function continueBattle(run){"
if needle not in s: raise SystemExit('continueBattle anchor missing')
s=s.replace(needle,milestone+needle,1)

old="function continueBattle(run){if(!run.battle)return;if(!run.battle.win){finish(run,false,true);return}const kind=run.battle.kind;run.battle=null;if(kind==='boss'){checkpointBoss(run);if(run.stage>=26){run.phase='floorBossChoice';save(`${floorLabel(run.stage)} BOSS 已击败：可以领取全部奖励结束，或继续挑战下一楼层。`);return}return}if(kind==='elite'){offerRelic(run);return}if(Math.random()<.28){offerRelic(run);return}advance(run)}"
new="function continueBattle(run){if(!run.battle)return;if(!run.battle.win){finish(run,false,true);return}const kind=run.battle.kind;run.battle=null;if(kind==='boss'){checkpointBoss(run);if(floorNo(run.stage)%3===0){prepareEggMilestone(run);return}if(run.stage>=26){run.phase='floorBossChoice';save(`${floorLabel(run.stage)} BOSS 已击败：可以领取全部奖励结束，或继续挑战下一楼层。`);return}offerRelic(run);return}if(kind==='elite'){offerRelic(run);return}if(Math.random()<.28){offerRelic(run);return}advance(run)}"
rep(old,new,'continue boss')

# leaderboard record on finish
old="const lifeNotes=applyExpeditionLifeCost(run,cleared);e.rogueLast={zone:zone.name,difficulty:run.difficulty||0,cleared,defeated,payout,badge,relics:run.relics?.length||0,time:Date.now(),choice,lifeNotes};e.rogueActive=null;"
new="const lifeNotes=applyExpeditionLifeCost(run,cleared),score=Math.round(Number(run.score)||0),floor=floorLabel(run.stage);e.leaderboard=e.leaderboard||[];e.leaderboard.push({zone:zone.name,difficulty:run.difficulty||0,score,floor,stage:run.stage||0,cleared:!!cleared,time:Date.now()});e.leaderboard.sort((a,b)=>(b.score||0)-(a.score||0)||(b.stage||0)-(a.stage||0));e.leaderboard=e.leaderboard.slice(0,20);e.rogueLast={zone:zone.name,difficulty:run.difficulty||0,cleared,defeated,payout,badge,score,floor,relics:run.relics?.length||0,time:Date.now(),choice,lifeNotes};e.rogueActive=null;"
rep(old,new,'leaderboard finish')

# Correct v238 treasure result implementation, no egg fragments
start=s.index('function treasure(run){')
end=s.index('\n\nfunction templeChoiceCount',start)
newtreasure=r'''function treasure(run){const zone=z(run.zone),mods=relicMods(run),base=Math.round((300+run.stage*90)*nodeRewardScale(zone,run.stage)*(1+(mods.chest||0)));run.energy+=base;const r=Math.random();let got='',materialKey='';if(r<.45){run.materials.relicDust++;got='遗物尘';materialKey='relicDust'}else if(r<.82){run.materials.starCrystal++;got='星辉结晶';materialKey='starCrystal'}else{run.tempBadges++;got='远征徽章';materialKey='badge'}const result={energy:base,material:got,materialKey,count:1,item:null,relic:false};run.log.push(`宝箱：+${base} 灵能，并获得 ${got} ×1。`);if(Math.random()<.55){const it=grantRunItem(run,rand(RUN_ITEMS).id);result.item=it.name;run.log.push(`发现远征道具：${it.name} ×1。`)}result.relic=Math.random()<.45;run.treasureResult=result;run.phase='treasureResult';save('宝箱已开启！')}
function continueTreasure(run){const r=run.treasureResult||{};run.treasureResult=null;if(r.relic)offerRelic(run);else advance(run)}
function treasureResultHTML(run){const r=run.treasureResult||{};const item=r.item?`<span>远征道具：${r.item} ×1</span>`:'';const relic=r.relic?'<span>✦ 发现遗物：继续后进入遗物三选一</span>':'';return `${runHeader(run)}${runInventoryHTML(run)}<section class="rg-panel rg-treasure-result"><div class="rg-title"><div><b>▣ 宝箱获得</b><small>奖励已经加入本次远征；宝箱不会掉落任何蛋碎片</small></div></div><div class="rg-earned rg-treasure-earned"><span>灵能 +${Math.round(r.energy||0)}</span><span>${r.material||'奖励'} ×${r.count||1}</span>${item}${relic}</div><button class="primary rg-mainbtn" data-rg-treasure-next>收下奖励并继续</button></section>`}
'''
s=s[:start]+newtreasure+s[end:]

# milestone UI before floor boss choice
ui=r'''function eggMilestoneHTML(run){const cs=run.eggMilestoneChoices||[];return `${runHeader(run)}${runInventoryHTML(run)}<section class="rg-panel"><div class="rg-title"><div><b>🥚 每3楼层里程碑</b><small>击败第3个楼层BOSS后，从三种蛋碎片中选择一种</small></div><span>${floorLabel(run.stage)}</span></div><div class="rg-final">${cs.map((c,i)=>`<button class="primary rg-relic" data-rg-egg-milestone="${i}"><b>${c.name} ×${c.value}</b><span>${c.text}</span></button>`).join('')}</div></section>`}
'''
needle='function floorBossChoiceHTML(run)'
if needle not in s: raise SystemExit('floor ui anchor missing')
s=s.replace(needle,ui+needle,1)

# active phases
rep("function activeHTML(run){if(run.phase==='floorBossChoice')return floorBossChoiceHTML(run);",
    "function activeHTML(run){if(run.phase==='eggMilestone')return eggMilestoneHTML(run);if(run.phase==='treasureResult')return treasureResultHTML(run);if(run.phase==='floorBossChoice')return floorBossChoiceHTML(run);",
    'active phases')

# header score + fragment inventory
rep("<div class=\"rg-status\"><span>补给 ${run.supply}</span><span>遗物 ${(run.relics||[]).length} · 种类 ${Object.keys(relicCounts(run)).length}</span></div>",
    "<div class=\"rg-status\"><span>补给 ${run.supply}</span><span>积分 ${Math.round(run.score||0)}</span><span>遗物 ${(run.relics||[]).length} · 种类 ${Object.keys(relicCounts(run)).length}</span></div>",
    'header score')
rep("<span>蛋碎片 ${run.materials?.eggFragment||0}</span></div>",
    "<span>基础蛋碎片 ${run.materials?.eggFragment||0}</span><span>远征秘藏碎片 ${run.materials?.expeditionEggFragment||0}</span><span>闪光蛋碎片 ${run.materials?.shinyEggFragment||0}</span></div>",
    'earned fragments')

# idle tabs without rewriting existing run page
oldstart="function idleHTML(e){const zone=z(),d=diff(),unlock="
newstart="function idleHTML(e){if(idleTab==='meta')return `<div class=\"rogue\">${metaTreeHTML(e)}</div>`;if(idleTab==='ladder')return `<div class=\"rogue\">${ladderHTML(e)}</div>`;const zone=z(),d=diff(),unlock="
rep(oldstart,newstart,'idle special tabs')
rep("return `<div class=\"rogue\"><section class=\"rg-panel\"><div class=\"rg-title\"><div><b>选择远征地图</b>",
    "return `<div class=\"rogue\">${idleNav()}<section class=\"rg-panel\"><div class=\"rg-title\"><div><b>选择远征地图</b>",
    'idle run nav')

# permanent inventory display on idle page
rep("徽章 ${e.badges} · 遗物尘 ${e.loot.relicDust} · 星辉结晶 ${e.loot.starCrystal} · 蛋碎片 ${e.loot.eggFragment}",
    "徽章 ${e.badges} · 遗物尘 ${e.loot.relicDust} · 星辉结晶 ${e.loot.starCrystal} · 基础碎片 ${e.loot.eggFragment} · 秘藏碎片 ${e.loot.expeditionEggFragment||0} · 闪光碎片 ${e.loot.shinyEggFragment||0}",
    'idle inventory')

# click handlers
click_anchor="document.addEventListener('click',ev=>{"
click_insert="document.addEventListener('click',ev=>{const tab=ev.target.closest?.('[data-rg-idle-tab]');if(tab){idleTab=tab.dataset.rgIdleTab||'run';render();return}const mb=ev.target.closest?.('[data-rg-meta-buy]');if(mb){buyMeta(mb.dataset.rgMetaBuy);return}const eggm=ev.target.closest?.('[data-rg-egg-milestone]');if(eggm){const run=ensure()?.rogueActive;if(run)chooseEggMilestone(run,Number(eggm.dataset.rgEggMilestone));return}"
rep(click_anchor,click_insert,'click meta')
# treasure result click
needle="if(ev.target.closest?.('[data-rg-temple-next]')){const run=ensure()?.rogueActive;if(run){run.templeResult=null;advance(run)}return}"
if needle in s and "data-rg-treasure-next" not in s[s.index(needle):s.index(needle)+500]:
    s=s.replace(needle,needle+"if(ev.target.closest?.('[data-rg-treasure-next]')){const run=ensure()?.rogueActive;if(run)continueTreasure(run);return}",1)

s=s.replace("window.QinsterExpedition={render,zones:ZONES,version:'v236-endless-core'};","window.QinsterExpedition={render,zones:ZONES,version:'v239-score-meta'};",1)
exp.write_text(s,encoding='utf-8')

# v238 battle theater pacing fix
bt=Path('v201-battle-theater.js')
t=bt.read_text(encoding='utf-8')
old="const next=document.querySelector('[data-rg-battle-next]');if(next)next.disabled=true;play(box,run,host,next)}"
new="const next=document.querySelector('[data-rg-battle-next]');if(next)next.disabled=true;const progress=host.closest('.rg-panel')?.querySelector('.rg-title>span');if(progress){progress.dataset.btProgress='1';progress.textContent='行动 0 / '+((b.events||[]).length||b.actions||0)}play(box,run,host,next,progress)}"
if old in t:t=t.replace(old,new,1)
if "async function play(box,run,original,next){" in t:t=t.replace("async function play(box,run,original,next){","async function play(box,run,original,next,progress){",1)
if "for(const ev of events){\n      if(skip||battleKey(currentRun())!==key)break;" in t:
    t=t.replace("for(const ev of events){\n      if(skip||battleKey(currentRun())!==key)break;","for(let eventIndex=0;eventIndex<events.length;eventIndex++){\n      const ev=events[eventIndex];\n      if(skip||battleKey(currentRun())!==key)break;",1)
if "      await sleep(90);\n    }" in t:
    t=t.replace("      await sleep(90);\n    }","      await sleep(90);\n      if(progress&&!skip)progress.textContent='行动 '+(ev.action||eventIndex+1)+' / '+events.length;\n    }",1)
oldf="banner.textContent=b.win?'VICTORY':'DEFEAT';feed.innerHTML=`<span class=\"rg-bt-result ${b.win?'win':'lose'}\">${b.win?'战斗胜利！':'战斗失败'}</span> · ${b.atb?(b.actions||events.length)+' 次行动':(b.rounds||0)+' 回合'}`;if(original)original.style.display='grid';if(next)next.disabled=false"
newf="if(progress)progress.textContent=(b.atb?'总计 '+(b.actions||events.length)+' 次行动':(b.rounds||0)+' 回合');banner.textContent=b.win?'VICTORY':'DEFEAT';feed.innerHTML=`<span class=\"rg-bt-result ${b.win?'win':'lose'}\">${b.win?'战斗胜利！':'战斗失败'}</span> · ${b.atb?(b.actions||events.length)+' 次行动':(b.rounds||0)+' 回合'}`;if(original)original.style.display='grid';if(next)next.disabled=false"
if oldf in t:t=t.replace(oldf,newf,1)
bt.write_text(t,encoding='utf-8')

# bump visible version
for fn in ['game.js','index.html']:
    p=Path(fn);x=p.read_text(encoding='utf-8');x=x.replace('v237','v239').replace('v238','v239');p.write_text(x,encoding='utf-8')

print('v239 patch applied')
