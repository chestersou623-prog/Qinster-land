from pathlib import Path

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

# Helpers for floor naming and endless scaling.
anchor="function diff(id=selectedDifficulty){return DIFFICULTIES[Math.max(0,Math.min(10,Number(id)||0))]||DIFFICULTIES[0]}"
insert=anchor+"\nfunction floorNo(stage){return Math.floor(Math.max(0,Number(stage)||0)/9)+1}\nfunction floorStep(stage){return Math.max(0,Number(stage)||0)%9+1}\nfunction floorLabel(stage){return floorNo(stage)+'-'+floorStep(stage)}\nfunction endlessExtra(stage){return Math.max(0,floorNo(stage)-3)*.10}"
if anchor not in s: raise SystemExit('diff anchor not found')
s=s.replace(anchor,insert,1)

# Any x-9 is a boss; route keeps combat-heavy structure in endless mode.
s=s.replace("if([8,17,26].includes(stage))return[{type:'boss'}];","if(stage%9===8)return[{type:'boss'}];",1)

# Enemy formula: preserve normal progression, then add +10% per whole floor after floor 3.
old="stageScale=1+stage*.035,kindScale=boss?1.42:elite?1.20:1,base=zone.enemy*stageScale*kindScale"
new="stageScale=1+stage*.035,endlessMul=1+endlessExtra(stage),kindScale=boss?1.42:elite?1.20:1,base=zone.enemy*stageScale*endlessMul*kindScale"
if old not in s: raise SystemExit('enemy scale target not found')
s=s.replace(old,new,1)

# Energy economy reduction, roughly 35-40% of prior values.
s=s.replace("(850+run.stage*260)","(300+run.stage*90)")
s=s.replace("(700+run.stage*210)","(250+run.stage*75)")
s=s.replace("(1100+run.stage*330)","(400+run.stage*120)")
s=s.replace("Math.round(6500*scale)","Math.round(2200*scale)")

# Defeat/abandon only keep 25%. Successful boss-floor cashout remains full.
s=s.replace("const zone=z(run.zone),fraction=cleared?1:defeated?.35:.65,payout=", "const zone=z(run.zone),fraction=cleared?1:.25,payout=",1)
s=s.replace("if(confirm('现在撤退？会保留约 65% 当前灵能与材料。'))finish(run,false,false)","if(confirm('中途退出会视为远征失败，只能带回 25% 当前奖励。确定退出？'))finish(run,false,true,'中途退出')",1)

# Header: floor notation + explicit acquired rewards panel + abandon warning.
old="<small>27层 · 每9层一个大BOSS · 当前第 ${Math.min(3,chapter)} 区域</small></div><button class=\"secondary\" data-rg-abandon>撤退结算</button>"
new="<small>当前楼层 ${floorLabel(run.stage)} · 每个 X-9 为楼层BOSS${floorNo(run.stage)>3?' · 无限加成 +'+Math.round(endlessExtra(run.stage)*100)+'%':''}</small></div><button class=\"secondary\" data-rg-abandon>退出（失败·25%）</button>"
if old not in s: raise SystemExit('runHeader title target not found')
s=s.replace(old,new,1)
old2="${routeBar(run)}<div class=\"rg-status\"><span>补给 ${run.supply}</span><span>暂存灵能 ${Math.round(run.energy)}</span><span>临时徽章 ${run.tempBadges}</span><span>遗物 ${(run.relics||[]).length} · 种类 ${Object.keys(relicCounts(run)).length}</span><span>蛋碎片 ${run.materials?.eggFragment||0}</span></div>"
new2="${routeBar(run)}<div class=\"rg-status\"><span>补给 ${run.supply}</span><span>遗物 ${(run.relics||[]).length} · 种类 ${Object.keys(relicCounts(run)).length}</span></div><div class=\"rg-earned\"><b>目前已获得奖励</b><span>灵能 ${Math.round(run.energy)}</span><span>临时徽章 ${run.tempBadges}</span><span>遗物尘 ${run.materials?.relicDust||0}</span><span>星辉结晶 ${run.materials?.starCrystal||0}</span><span>蛋碎片 ${run.materials?.eggFragment||0}</span></div>"
if old2 not in s: raise SystemExit('runHeader status target not found')
s=s.replace(old2,new2,1)

# Route bar: show current 9-step floor instead of fixed 27-step strip once endless starts.
old="function routeBar(run){let h='';for(let i=0;i<27;i++){const boss=[8,17,26].includes(i),chapter=Math.floor(i/9)+1,label=boss?`B${chapter}`:(i+1);h+=`<span class=\"${i<run.stage?'done':i===run.stage?'now':''}\">${label}</span>`}return `<div class=\"rg-route\">${h}</div>`}"
new="function routeBar(run){let h='',base=(floorNo(run.stage)-1)*9;for(let j=0;j<9;j++){const i=base+j,label=j===8?'BOSS':(j+1);h+=`<span class=\"${i<run.stage?'done':i===run.stage?'now':''}\">${label}</span>`}return `<div class=\"rg-route\">${h}</div>`}"
if old not in s: raise SystemExit('routeBar target not found')
s=s.replace(old,new,1)

# Boss-floor decision: after 3-9 and every later x-9, ask whether to cash out or continue.
old="function continueBattle(run){if(!run.battle)return;if(!run.battle.win){finish(run,false,true);return}const kind=run.battle.kind;run.battle=null;if(kind==='boss'){if(run.stage>=26){finalChoices(run);return}checkpointBoss(run);return}if(kind==='elite'){offerRelic(run);return}if(Math.random()<.28){offerRelic(run);return}advance(run)}"
new="function continueBattle(run){if(!run.battle)return;if(!run.battle.win){finish(run,false,true);return}const kind=run.battle.kind;run.battle=null;if(kind==='boss'){checkpointBoss(run);if(run.stage>=26){run.phase='floorBossChoice';save(`${floorLabel(run.stage)} BOSS 已击败：可以领取全部奖励结束，或继续挑战下一楼层。`);return}return}if(kind==='elite'){offerRelic(run);return}if(Math.random()<.28){offerRelic(run);return}advance(run)}\nfunction floorBossChoiceHTML(run){const next=floorNo(run.stage)+1,extra=Math.max(0,next-3)*10;return `${runHeader(run)}${runInventoryHTML(run)}<section class=\"rg-panel rg-floor-choice\"><div class=\"rg-title\"><div><b>${floorLabel(run.stage)} 楼层BOSS已击败</b><small>现在是安全结算点。继续后进入 ${next}-1；新楼层敌人在原有难度与流程成长上额外 +${extra}%。</small></div></div><div class=\"rg-final\"><button class=\"primary rg-relic\" data-rg-floor-cashout><b>领取全部奖励并结束</b><span>以 100% 结算目前已获得奖励</span></button><button class=\"secondary rg-relic\" data-rg-floor-continue><b>继续无限模式</b><span>进入 ${next}-1 · 无限额外 +${extra}%</span></button></div></section>`}\nfunction cashoutFloor(run){finish(run,true,false,`${floorLabel(run.stage)}安全结算`)}\nfunction continueEndlessFloor(run){run.endless=true;advance(run)}"
if old not in s: raise SystemExit('continueBattle target not found')
s=s.replace(old,new,1)

# Active phase routing.
s=s.replace("function activeHTML(run){if(run.phase==='training')", "function activeHTML(run){if(run.phase==='floorBossChoice')return floorBossChoiceHTML(run);if(run.phase==='training')",1)

# Click handlers for floor choice.
needle="if(ev.target.closest?.('[data-rg-battle-next]')){const run=ensure()?.rogueActive;if(run)continueBattle(run);return}"
repl=needle+"if(ev.target.closest?.('[data-rg-floor-cashout]')){const run=ensure()?.rogueActive;if(run)cashoutFloor(run);return}if(ev.target.closest?.('[data-rg-floor-continue]')){const run=ensure()?.rogueActive;if(run)continueEndlessFloor(run);return}"
if needle not in s: raise SystemExit('click insertion target not found')
s=s.replace(needle,repl,1)

# Floor labels in node/map copy.
s=s.replace("<small>共27层；第9、18、27层固定为大BOSS</small>","<small>每楼层9关；X-9固定为楼层BOSS</small>")
s=s.replace("<span>第 ${run.stage+1}/27 层</span>","<span>当前 ${floorLabel(run.stage)}</span>")

# CSS for reward panel.
needle_css=".rg-status{display:flex;gap:7px;flex-wrap:wrap}"
css=needle_css+".rg-earned{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:7px;padding:7px;background:#252832;border:2px solid #66616c;color:#eee}.rg-earned>b{color:#f2c451;margin-right:4px}.rg-earned span{background:#343844;border:1px solid #626876;padding:4px 6px;font-size:9px}"
if needle_css in s:s=s.replace(needle_css,css,1)
else: raise SystemExit('CSS target not found')

# Version bump.
for oldv in ["version:'v235-training-result-stat'","version:'v234-training-stat-preview'","version:'v233-training-node-ui'"]:
    s=s.replace(oldv,"version:'v236-endless-core'")
p.write_text(s,encoding='utf-8')

for fp in ['game.js','index.html']:
    q=Path(fp);t=q.read_text(encoding='utf-8');t=t.replace('v235','v236').replace('v234','v236');q.write_text(t,encoding='utf-8')
print('v236 endless core applied')
