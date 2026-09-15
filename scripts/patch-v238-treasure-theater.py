from pathlib import Path

exp=Path('v199-roguelike-expedition.js')
s=exp.read_text(encoding='utf-8')
old="function treasure(run){const zone=z(run.zone),mods=relicMods(run),base=Math.round((300+run.stage*90)*nodeRewardScale(zone,run.stage)*(1+(mods.chest||0)));run.energy+=base;const r=Math.random();if(r<.38)run.materials.relicDust++;else if(r<.68)run.materials.eggFragment++;else if(r<.88)run.materials.starCrystal++;else run.tempBadges++;const got=r<.38?'遗物尘':r<.68?'蛋碎片':r<.88?'星辉结晶':'远征徽章';run.log.push(`宝箱：+${base} 灵能，并获得 ${got} ×1。`);if(Math.random()<.55){const it=grantRunItem(run,rand(RUN_ITEMS).id);run.log.push(`发现远征道具：${it.name} ×1。`)}if(Math.random()<.45)offerRelic(run);else advance(run)}"
new="function treasure(run){const zone=z(run.zone),mods=relicMods(run),base=Math.round((300+run.stage*90)*nodeRewardScale(zone,run.stage)*(1+(mods.chest||0)));run.energy+=base;const r=Math.random();let got='',materialKey='';if(r<.45){run.materials.relicDust++;got='遗物尘';materialKey='relicDust'}else if(r<.82){run.materials.starCrystal++;got='星辉结晶';materialKey='starCrystal'}else{run.tempBadges++;got='远征徽章';materialKey='badge'}const result={energy:base,material:got,materialKey,count:1,item:null,relic:false};run.log.push(`宝箱：+${base} 灵能，并获得 ${got} ×1。`);if(Math.random()<.55){const it=grantRunItem(run,rand(RUN_ITEMS).id);result.item=it.name;run.log.push(`发现远征道具：${it.name} ×1。`)}result.relic=Math.random()<.45;run.treasureResult=result;run.phase='treasureResult';save('宝箱已开启！')}
function continueTreasure(run){const r=run.treasureResult||{};run.treasureResult=null;if(r.relic)offerRelic(run);else advance(run)}"
if old not in s: raise SystemExit('treasure target not found')
s=s.replace(old,new,1)

anchor="function templeChoiceCount(run){"
insert="""function treasureResultHTML(run){const r=run.treasureResult||{};const item=r.item?`<span>远征道具：${r.item} ×1</span>`:'';const relic=r.relic?'<span>✦ 发现遗物：继续后进入遗物三选一</span>':'';return `${runHeader(run)}${runInventoryHTML(run)}<section class=\"rg-panel rg-treasure-result\"><div class=\"rg-title\"><div><b>▣ 宝箱获得</b><small>奖励已经加入本次远征；宝箱不会掉落蛋碎片</small></div></div><div class=\"rg-earned rg-treasure-earned\"><span>灵能 +${Math.round(r.energy||0)}</span><span>${r.material||'奖励'} ×${r.count||1}</span>${item}${relic}</div><button class=\"primary rg-mainbtn\" data-rg-treasure-next>收下奖励并继续</button></section>`}
"""
if insert not in s:
    if anchor not in s: raise SystemExit('temple anchor not found')
    s=s.replace(anchor,insert+anchor,1)

old_active="function activeHTML(run){if(run.phase==='floorBossChoice')return floorBossChoiceHTML(run);if(run.phase==='training')return trainingHTML(run);"
new_active="function activeHTML(run){if(run.phase==='floorBossChoice')return floorBossChoiceHTML(run);if(run.phase==='treasureResult')return treasureResultHTML(run);if(run.phase==='training')return trainingHTML(run);"
if old_active not in s: raise SystemExit('activeHTML target not found')
s=s.replace(old_active,new_active,1)

click_anchor="if(ev.target.closest?.('[data-rg-temple-next]')){const run=ensure()?.rogueActive;if(run){run.templeResult=null;advance(run)}return}"
click_new=click_anchor+"if(ev.target.closest?.('[data-rg-treasure-next]')){const run=ensure()?.rogueActive;if(run)continueTreasure(run);return}"
if click_anchor not in s: raise SystemExit('click anchor not found')
s=s.replace(click_anchor,click_new,1)
s=s.replace("window.QinsterExpedition={render,zones:ZONES,version:'v236-endless-core'};","window.QinsterExpedition={render,zones:ZONES,version:'v238-treasure-theater'};",1)
exp.write_text(s,encoding='utf-8')

bt=Path('v201-battle-theater.js')
t=bt.read_text(encoding='utf-8')
old="const next=document.querySelector('[data-rg-battle-next]');if(next)next.disabled=true;play(box,run,host,next)}"
new="const next=document.querySelector('[data-rg-battle-next]');if(next)next.disabled=true;const progress=host.closest('.rg-panel')?.querySelector('.rg-title>span');if(progress){progress.dataset.btProgress='1';progress.textContent='行动 0 / '+((b.events||[]).length||b.actions||0)}play(box,run,host,next,progress)}"
if old not in t: raise SystemExit('mount progress target not found')
t=t.replace(old,new,1)
t=t.replace("async function play(box,run,original,next){","async function play(box,run,original,next,progress){",1)
old_loop="for(const ev of events){\n      if(skip||battleKey(currentRun())!==key)break;"
new_loop="for(let eventIndex=0;eventIndex<events.length;eventIndex++){\n      const ev=events[eventIndex];\n      if(skip||battleKey(currentRun())!==key)break;"
if old_loop not in t: raise SystemExit('event loop target not found')
t=t.replace(old_loop,new_loop,1)
old_step="      await sleep(90);\n    }"
new_step="      await sleep(90);\n      if(progress&&!skip)progress.textContent='行动 '+(ev.action||eventIndex+1)+' / '+events.length;\n    }"
if old_step not in t: raise SystemExit('step target not found')
t=t.replace(old_step,new_step,1)
old_final="banner.textContent=b.win?'VICTORY':'DEFEAT';feed.innerHTML=`<span class=\"rg-bt-result ${b.win?'win':'lose'}\">${b.win?'战斗胜利！':'战斗失败'}</span> · ${b.atb?(b.actions||events.length)+' 次行动':(b.rounds||0)+' 回合'}`;if(original)original.style.display='grid';if(next)next.disabled=false"
new_final="if(progress)progress.textContent=(b.atb?'总计 '+(b.actions||events.length)+' 次行动':(b.rounds||0)+' 回合');banner.textContent=b.win?'VICTORY':'DEFEAT';feed.innerHTML=`<span class=\"rg-bt-result ${b.win?'win':'lose'}\">${b.win?'战斗胜利！':'战斗失败'}</span> · ${b.atb?(b.actions||events.length)+' 次行动':(b.rounds||0)+' 回合'}`;if(original)original.style.display='grid';if(next)next.disabled=false"
if old_final not in t: raise SystemExit('final target not found')
t=t.replace(old_final,new_final,1)
bt.write_text(t,encoding='utf-8')

for fn in ['game.js','index.html']:
    p=Path(fn)
    x=p.read_text(encoding='utf-8')
    x=x.replace('v237','v238')
    p.write_text(x,encoding='utf-8')
