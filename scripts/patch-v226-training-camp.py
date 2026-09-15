from pathlib import Path

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

# Relic: extra training choice + stronger training gains. Duplicate copies stack.
needle="{id:'star',name:'星辉镜',text:'闪光怪物攻击/幸运 +15%',mods:{shiny:.15}}\n];"
repl="{id:'star',name:'星辉镜',text:'闪光怪物攻击/幸运 +15%',mods:{shiny:.15}},\n{id:'trainerBadge',name:'教官徽章',text:'训练营额外 +1 个候选选项；训练收益 +25%（可叠加）',mods:{trainingChoices:1,trainingGain:.25}}\n];"
if needle not in s: raise SystemExit('RELICS insertion target not found')
s=s.replace(needle,repl,1)

# Debuff: lower training gain.
needle="{id:'routeErosion',name:'侵蚀',text:'每前进到一个新地点，全队仍站立成员失去最大远征HP的 2%（地图伤害最低保留 1% HP）',mods:{}}\n];"
repl="{id:'routeErosion',name:'侵蚀',text:'每前进到一个新地点，全队仍站立成员失去最大远征HP的 2%（地图伤害最低保留 1% HP）',mods:{}},\n{id:'trainingFatigue',name:'倦怠',text:'训练营获得的能力值 -40%',mods:{trainingGain:-.40}}\n];"
if needle not in s: raise SystemExit('CURSES insertion target not found')
s=s.replace(needle,repl,1)

# Add training node metadata.
needle="const NODE_META={battle:['⚔','普通战斗','自动战斗，胜利后继续'],elite:['☠','精英战','更强敌人，必出遗物三选一'],treasure:['▣','宝箱','获得灵能与随机远征材料'],rest:['♥','营地','恢复队伍并补充补给'],challenge:['?','特殊事件','指定一只怪物进行能力判定'],temple:['◆','神庙','可能得到祝福，也可能遭受诅咒'],boss:['★','区域首领','本局最终自动战斗']};"
repl="const NODE_META={battle:['⚔','普通战斗','自动战斗，胜利后继续'],elite:['☠','精英战','更强敌人，必出遗物三选一'],treasure:['▣','宝箱','获得灵能与随机远征材料'],training:['▲','训练营','三选一强化本次远征中的指定怪物'],rest:['♥','营地','恢复队伍并补充补给'],challenge:['?','特殊事件','指定一只怪物进行能力判定'],temple:['◆','神庙','可能得到祝福，也可能遭受诅咒'],boss:['★','区域首领','本局最终自动战斗']};"
if needle not in s: raise SystemExit('NODE_META target not found')
s=s.replace(needle,repl,1)

# Persist run-only training stats.
needle="function ensureRunMeta(run){if(!run.items)run.items={};if(!run.curses)run.curses=[];if(!run.nextBattleMods)run.nextBattleMods={};if(!run.templeMods)run.templeMods={};return run}"
repl="function ensureRunMeta(run){if(!run.items)run.items={};if(!run.curses)run.curses=[];if(!run.nextBattleMods)run.nextBattleMods={};if(!run.templeMods)run.templeMods={};if(!run.trainingMods)run.trainingMods={};return run}"
if needle not in s: raise SystemExit('ensureRunMeta target not found')
s=s.replace(needle,repl,1)

# Training camp is an occasional utility node; combat remains guaranteed in every normal route set.
needle="['challenge',24],['treasure',20],['elite',18],['rest',7],['temple',5]"
repl="['challenge',24],['treasure',20],['elite',18],['training',10],['rest',7],['temple',5]"
if needle not in s: raise SystemExit('utility weights target not found')
s=s.replace(needle,repl,1)

# Insert training helpers before combatValue.
marker='function combatValue(m,pos,run){'
pos=s.find(marker)
if pos<0: raise SystemExit('combatValue marker not found')
training_code=r'''function trainingEntry(run,id){
  ensureRunMeta(run);const k=String(id);if(!run.trainingMods[k])run.trainingMods[k]={flat:[0,0,0,0,0],pct:[0,0,0,0,0]};return run.trainingMods[k];
}
function trainingGainMultiplier(run){
  const rel=relicMods(run),curse=(run.curses||[]).reduce((sum,id)=>sum+Number(CURSES.find(x=>x.id===id)?.mods?.trainingGain||0),0);
  return Math.max(.25,1+Number(rel.trainingGain||0)+curse);
}
function trainingChoiceCount(run){return Math.min(6,3+Math.max(0,Math.round(Number(relicMods(run).trainingChoices)||0)))}
function trainedBaseStats(m,run){
  const base=st(m),tr=trainingEntry(run,m.id);return base.map((v,i)=>(Number(v)||0)*(1+(Number(tr.pct?.[i])||0))+(Number(tr.flat?.[i])||0));
}
function makeTrainingChoices(run){
  ensureRunMeta(run);const t=activeTeam(run),count=trainingChoiceCount(run),gain=trainingGainMultiplier(run),out=[],used=new Set();let guard=0;
  while(out.length<count&&guard++<100){
    const m=rand(t);if(!m)break;const stat=Math.floor(Math.random()*5),kind=Math.random()<.5?'pct':'flat',raw=kind==='pct'?(1+Math.floor(Math.random()*5)):(1+Math.floor(Math.random()*20)),key=m.id+':'+stat+':'+kind;
    if(used.has(key))continue;used.add(key);
    const value=kind==='pct'?Math.round(raw*gain*10)/10:Math.max(1,Math.round(raw*gain));
    out.push({monsterId:m.id,monsterName:monsterName(m),stat,kind,raw,value});
  }
  return out;
}
function openTraining(run){ensureRunMeta(run);run.trainingChoices=makeTrainingChoices(run);run.phase='training';save()}
function chooseTraining(run,i){
  const c=run.trainingChoices?.[i];if(!c)return;const tr=trainingEntry(run,c.monsterId);
  if(c.kind==='pct')tr.pct[c.stat]=(Number(tr.pct[c.stat])||0)+c.value/100;else tr.flat[c.stat]=(Number(tr.flat[c.stat])||0)+c.value;
  run.log.push(`训练营：${c.monsterName} ${STAT[c.stat]} +${c.value}${c.kind==='pct'?'%':''}（本次远征永久生效）。`);run.trainingChoices=[];advance(run);
}
'''
s=s[:pos]+training_code+s[pos:]

# Replace combatValue so training modifies the run-only base stats before relic/buff/debuff multipliers.
start=s.find('function combatValue(m,pos,run){')
end=s.find('function finalStatBreakdown(m,pos,run){',start)
if start<0 or end<0: raise SystemExit('combatValue bounds not found')
new_combat="function combatValue(m,pos,run){const v=trainedBaseStats(m,run),mods=combatMods(run),sh=m.shiny?(mods.shiny||0):0;let atk=v[1]*(1+(mods.atk||0)+sh),def=v[2]*(1+(mods.def||0)+sh),spd=v[3]*(1+(mods.spd||0)),luck=v[4]*(1+(mods.luck||0)+sh),con=v[0];if(pos===0){def*=1+(mods.frontDef||0);atk*=1+(mods.frontAtk||0)}if(pos===2){atk*=1+(mods.backAtk||0);def*=1+(mods.backDef||0)}return{atk,def,spd,luck,con}}\n"
s=s[:start]+new_combat+s[end:]

# Add training source lines to stat tooltip after the original value.
needle="const detail=['原始：'+Math.round(b*10)/10];"
repl="const detail=['原始：'+Math.round(b*10)/10];const tr=trainingEntry(run,m.id),trFlat=Number(tr.flat?.[i]||0),trPct=Number(tr.pct?.[i]||0);if(trFlat)detail.push('训练营固定：+'+Math.round(trFlat*10)/10);if(trPct)detail.push('训练营百分比：+'+Math.round(trPct*1000)/10+'%');"
if needle not in s: raise SystemExit('breakdown detail target not found')
s=s.replace(needle,repl,1)

# Route into training camp.
needle="if(node.type==='rest')return applyRest(run);if(node.type==='treasure')return treasure(run);if(node.type==='challenge')return challenge(run);if(node.type==='temple')return temple(run);"
repl="if(node.type==='rest')return applyRest(run);if(node.type==='treasure')return treasure(run);if(node.type==='training')return openTraining(run);if(node.type==='challenge')return challenge(run);if(node.type==='temple')return temple(run);"
if needle not in s: raise SystemExit('chooseNode target not found')
s=s.replace(needle,repl,1)

# Training camp screen.
marker='function campHTML(run){'
pos=s.find(marker)
if pos<0: raise SystemExit('campHTML marker not found')
training_html=r'''function trainingHTML(run){
  const choices=run.trainingChoices||[],gain=Math.round(trainingGainMultiplier(run)*100),extra=Math.max(0,trainingChoiceCount(run)-3);
  return `${runHeader(run)}${runInventoryHTML(run)}${teamHTML(run)}<section class="rg-panel"><div class="rg-title"><div><b>▲ 训练营</b><small>选择1项；训练强化只在本次远征永久生效</small></div><span>${choices.length}选1 · 当前训练效率 ${gain}%${extra?' · 额外候选 +'+extra:''}</span></div><div class="rg-event-picks">${choices.map((c,i)=>`<button class="secondary" data-rg-training-choice="${i}"><b>${c.monsterName}</b><small>${STAT[c.stat]} +${c.value}${c.kind==='pct'?'%':''}${Math.abs(c.value-c.raw)>.01?` · 基础 ${c.raw}${c.kind==='pct'?'%':''}`:''}</small></button>`).join('')}</div><p class="rg-note">基础训练范围：百分比 +1%～5%，固定值 +1～20。教官徽章提高候选数与训练量；倦怠会降低训练量。</p></section>`;
}
'''
s=s[:pos]+training_html+s[pos:]

# Render training phase.
needle="function activeHTML(run){if(run.phase==='camp')return campHTML(run);"
repl="function activeHTML(run){if(run.phase==='training')return trainingHTML(run);if(run.phase==='camp')return campHTML(run);"
if needle not in s: raise SystemExit('activeHTML target not found')
s=s.replace(needle,repl,1)

# Handle training choice clicks.
needle="const em=ev.target.closest?.('[data-rg-event-member]');"
repl="const tc=ev.target.closest?.('[data-rg-training-choice]');if(tc){const run=ensure()?.rogueActive;if(run)chooseTraining(run,Number(tc.dataset.rgTrainingChoice));return}const em=ev.target.closest?.('[data-rg-event-member]');"
if needle not in s: raise SystemExit('click handler target not found')
s=s.replace(needle,repl,1)

# Version marker.
for old in ["version:'v225-combat-route-breakdown'","version:'v224c-smooth-floor-scaling'","version:'v224b-fixed-expedition'"]:
    s=s.replace(old,"version:'v226-training-camp'")

p.write_text(s,encoding='utf-8')
print('v226 training camp applied')
