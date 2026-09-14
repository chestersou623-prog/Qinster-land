from pathlib import Path

# --- Expedition combat: replace round/extra-action speed logic with real ATB scheduling ---
p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')
start=s.find('function speedExtraChance(')
end=s.find('function offerRelic(run){', start)
if start < 0 or end < 0:
    raise SystemExit('ATB battle anchors not found')

new_block=r'''function atbRate(spd){return Math.max(20,60+Math.max(0,Number(spd)||0)*.45)}
function speedRuleText(){return '速度决定行动条充能速度；所有参战单位会同时充能，行动条达到 100% 就立刻行动，攻击后清零重新累积。'}
function battle(run,kind){
  ensureRunMeta(run);
  const zone=z(run.zone),t=activeTeam(run),elite=kind==='elite',boss=kind==='boss',ep=run.pendingBattle&&run.pendingBattle.kind===kind?run.pendingBattle:enemyPreview(run,kind),enemyMax=ep.enemyMax,enemyAtk=ep.enemyAtk,enemyDef=ep.enemyDef,enemySpd=ep.enemySpd,enemyLuck=ep.enemyLuck;
  run.pendingBattle=null;
  const startHp={};t.forEach(m=>startHp[m.id]=hpPct(run,m.id));
  let enemy=enemyMax,firstGuard=true,actions=0,elapsed=0;
  const logs=[],events=[],gauge={enemy:0};t.forEach(m=>gauge[m.id]=0);
  if((elite||boss)&&Math.random()<(boss?.70:.38)){const pool=CURSES.filter(c=>!run.curses.includes(c.id));if(pool.length)inflictCurse(run,rand(pool).id,logs)}
  const initialTeamPower=t.filter(m=>canReviveInRun(run,m.id)&&hpPct(run,m.id)>0).reduce((sum,m,i)=>{const p=combatValue(m,i,run);return sum+p.atk*1.1+p.def+p.spd*.65+p.luck*.35+p.con*.7},0),enemyPower=Math.round(enemyMax*.7+enemyAtk*2+enemyDef*1.3+enemySpd*.5+enemyLuck*.25);
  const gaugeSnapshot=()=>({enemy:Math.max(0,Math.min(100,gauge.enemy||0)),allies:Object.fromEntries(t.map(m=>[m.id,Math.max(0,Math.min(100,gauge[m.id]||0))]))});
  while(enemy>0&&actions<48&&t.some(m=>hpPct(run,m.id)>0&&canReviveInRun(run,m.id))){
    const alive=t.map(m=>m).filter(m=>hpPct(run,m.id)>0&&canReviveInRun(run,m.id));
    const actors=[];
    alive.forEach((m,dynPos)=>{const p=combatValue(m,dynPos,run);actors.push({type:'ally',key:m.id,m,dynPos,p,spd:p.spd,rate:atbRate(p.spd)});});
    if(enemy>0)actors.push({type:'enemy',key:'enemy',spd:enemySpd,rate:atbRate(enemySpd)});
    if(!actors.length)break;
    let dt=Infinity;
    for(const a of actors){const g=a.type==='enemy'?(gauge.enemy||0):(gauge[a.key]||0);dt=Math.min(dt,(100-g)/Math.max(1,a.rate));}
    if(!Number.isFinite(dt)||dt<0)dt=0;
    elapsed+=dt;
    for(const a of actors){if(a.type==='enemy')gauge.enemy=Math.min(100,(gauge.enemy||0)+a.rate*dt);else gauge[a.key]=Math.min(100,(gauge[a.key]||0)+a.rate*dt);}
    const ready=actors.filter(a=>(a.type==='enemy'?gauge.enemy:gauge[a.key])>=99.999).sort((a,b)=>b.spd-a.spd)[0];
    if(!ready)break;
    actions++;
    const snap=gaugeSnapshot();
    if(ready.type==='ally'){
      const m=ready.m;if(hpPct(run,m.id)<=0||!canReviveInRun(run,m.id)){gauge[m.id]=0;continue}
      const p=ready.p,crit=Math.random()<Math.min(.38,p.luck/1600),raw=(p.atk*.22+p.spd*.06+p.luck*.025)*(crit?1.65:1),hit=Math.max(7,raw-enemyDef*.07);
      enemy=Math.max(0,enemy-hit);
      events.push({type:'ally',action:actions,actorId:m.id,damage:Math.round(hit),crit,enemyHp:enemy,spd:p.spd,wait:dt,gauges:snap});
      logs.push(`行动 ${actions}：${monsterName(m)} 造成 ${Math.round(hit)} 伤害${crit?'（暴击）':''}。`);
      gauge[m.id]=0;
    }else{
      const current=t.filter(m=>hpPct(run,m.id)>0&&canReviveInRun(run,m.id));
      if(!current.length)break;
      const roll=Math.random();let target=roll<.64?current[0]:roll<.88?(current[1]||current[0]):(current[2]||current[1]||current[0]);
      const dynPos=current.indexOf(target),p=combatValue(target,dynPos,run);
      let incoming=Math.max(5,enemyAtk-p.def*.08);
      if(firstGuard&&(combatMods(run).firstGuard||0)){incoming*=1-combatMods(run).firstGuard;firstGuard=false}
      const hpLoss=Math.min(42,incoming/(65+p.con*.22)*100),before=hpPct(run,target.id);
      run.hp[target.id]=Math.max(0,before-hpLoss);
      events.push({type:'enemy',action:actions,targetId:target.id,hpLoss,hpAfter:run.hp[target.id],spd:enemySpd,wait:dt,gauges:snap});
      logs.push(`行动 ${actions}：敌人攻击 ${monsterName(target)}（${['前卫','中卫','后卫'][dynPos]}），远征生命 -${Math.round(hpLoss)}%。`);
      gauge.enemy=0;
      if(before>0&&run.hp[target.id]<=0){gauge[target.id]=0;expeditionKnockout(run,target,logs);if(target.life>0)logs.push(`${monsterName(target)} 已倒下，之后可通过营地/恢复效果复活。`);logs.push('后方存活队员自动向前补位。')}
    }
  }
  const win=enemy<=0,aliveCount=t.filter(m=>hpPct(run,m.id)>0&&canReviveInRun(run,m.id)).length,reason=win?`在第 ${actions} 次行动击穿敌方 ${enemyMax} HP`:(aliveCount===0?'队伍全部倒下':'达到 48 次行动上限仍未击败敌人');
  if(win){const eliteBonus=elite?(1+(combatMods(run).eliteReward||0)):1,base=Math.round((1100+run.stage*330)*(elite?1.7:1)*(boss?2.8:1)*nodeRewardScale(zone,run.stage)*eliteBonus);run.energy+=base;if(elite)run.tempBadges+=Math.max(1,Math.round(zone.badge*.5));const heal=combatMods(run).heal||0;if(heal)t.forEach(m=>{if(canReviveInRun(run,m.id))run.hp[m.id]=Math.min(100,hpPct(run,m.id)+heal*100);else run.hp[m.id]=0});run.log.push(`${boss?'首领':elite?'精英':'战斗'}胜利：+${base} 灵能。`)}else run.log.push('战斗失败，远征被迫撤退。');
  run.battle={kind,atb:true,actions,rounds:actions,elapsed,enemyMax,enemyHp:enemy,enemyAtk,enemyDef,enemySpd,enemyLuck,enemyPower,teamPower:Math.round(initialTeamPower),logs,events,startHp,win,reason,enemySpecies:ep.enemySpecies};
  run.nextBattleMods={};run.phase='battleResult';save()
}
'''
s=s[:start]+new_block+s[end:]
# Result header wording for ATB battles.
s=s.replace('<span>${b.rounds} 回合</span>','<span>${b.atb?(b.actions||b.rounds)+\' 次行动\':b.rounds+\' 回合\'}</span>',1)
p.write_text(s,encoding='utf-8')

# --- Theater: all gauges move simultaneously to the next action snapshot ---
p=Path('v201-battle-theater.js')
s=p.read_text(encoding='utf-8')
# Slightly stronger gauge visuals and percentage text.
s=s.replace(".rg-bt-gauge small{display:block;font-size:8px;color:#fff3bf;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",".rg-bt-gauge small{display:flex;justify-content:space-between;gap:4px;font-size:8px;color:#fff3bf;white-space:nowrap;overflow:hidden}.rg-bt-gauge small span{color:#fff;font-weight:900}",1)
s=s.replace(".rg-bt-charge{height:7px;margin-top:3px;background:#111;border:1px solid #69636f;overflow:hidden}",".rg-bt-charge{height:10px;margin-top:3px;background:#111;border:1px solid #69636f;overflow:hidden}",1)
s=s.replace(".rg-bt-gauge.ready{box-shadow:0 0 0 2px #ffe36f}",".rg-bt-gauge.ready{box-shadow:0 0 0 2px #ffe36f;filter:brightness(1.18)}",1)
# Mount labels + banner.
s=s.replace("<small>${esc(name(m))} · 速 ${statSpeed(m)}</small><div class=\"rg-bt-charge\"><i></i></div>","<small><span>${esc(name(m))} · 速 ${statSpeed(m)}</span><span data-bt-gauge-pct>0%</span></small><div class=\"rg-bt-charge\"><i></i></div>")
s=s.replace("<small>敌方 · 速 ${Math.round(Number(b.enemySpd)||0)}</small><div class=\"rg-bt-charge\"><i></i></div>","<small><span>敌方 · 速 ${Math.round(Number(b.enemySpd)||0)}</span><span data-bt-gauge-pct>0%</span></small><div class=\"rg-bt-charge\"><i></i></div>",1)
s=s.replace('<div class="rg-bt-banner">ROUND 1</div>','<div class="rg-bt-banner">行动准备</div>',1)

play_start=s.find('async function play(box,run,original,next){')
play_end=s.find('function float(box,target,text,crit,miss){',play_start)
if play_start<0 or play_end<0:
    raise SystemExit('theater play anchors not found')

new_play=r'''async function play(box,run,original,next){
  const key=battleKey(run);playingKey=key;const b=run.battle,events=Array.isArray(b.events)?b.events:[],allies=team(run);
  let speed=1,skip=false,enemyHp=100,allyHp=allies.map(m=>Math.max(0,Math.min(100,Number(b.startHp?.[m.id] ?? run.hp?.[m.id])||0)));
  const speedBtn=box.querySelector('[data-bt-speed]'),skipBtn=box.querySelector('[data-bt-skip]'),feed=box.querySelector('.rg-bt-feed'),banner=box.querySelector('.rg-bt-banner');
  speedBtn?.addEventListener('click',()=>{speed=speed===1?2:speed===2?4:1;speedBtn.textContent='速度 ×'+speed});skipBtn?.addEventListener('click',()=>{skip=true});
  const sleep=ms=>new Promise(r=>setTimeout(r,ms/Math.max(1,speed)));
  const gaugeState={enemy:0,allies:Object.fromEntries(allies.map(m=>[m.id,0]))};
  const setGauge=(g,val)=>{if(!g)return;const v=Math.max(0,Math.min(100,val||0)),bar=g.querySelector('.rg-bt-charge i'),pct=g.querySelector('[data-bt-gauge-pct]');if(bar)bar.style.width=v+'%';if(pct)pct.textContent=Math.round(v)+'%'};
  const drawGauges=state=>{allies.forEach((m,i)=>{const g=box.querySelector(`[data-bt-gauge-ally="${i}"]`);setGauge(g,state.allies?.[m.id]||0)});setGauge(box.querySelector('[data-bt-gauge-enemy]'),state.enemy||0)};
  const animateGauges=async(ev)=>{
    const target=ev.gauges||{enemy:ev.type==='enemy'?100:gaugeState.enemy,allies:{...gaugeState.allies}};
    const from={enemy:gaugeState.enemy,allies:{...gaugeState.allies}};
    const duration=Math.max(180,Math.min(950,(Number(ev.wait)||.35)*1350));
    let virtual=0,last=performance.now();
    while(virtual<duration&&!skip&&battleKey(currentRun())===key){const now=performance.now();virtual+=(now-last)*Math.max(1,speed);last=now;const q=Math.min(1,virtual/duration),cur={enemy:from.enemy+(Number(target.enemy||0)-from.enemy)*q,allies:{}};allies.forEach(m=>{const a=Number(from.allies[m.id]||0),z=Number(target.allies?.[m.id]||0);cur.allies[m.id]=a+(z-a)*q});drawGauges(cur);if(q>=1)break;await new Promise(r=>requestAnimationFrame(r))}
    gaugeState.enemy=Number(target.enemy||0);allies.forEach(m=>gaugeState.allies[m.id]=Number(target.allies?.[m.id]||0));drawGauges(gaugeState);
  };
  drawGauges(gaugeState);
  if(events.length){
    for(const ev of events){
      if(skip||battleKey(currentRun())!==key)break;
      banner.textContent='ACTION '+(ev.action||'');
      await animateGauges(ev);
      if(skip||battleKey(currentRun())!==key)break;
      if(ev.type==='ally'){
        const idx=allies.findIndex(m=>m.id===ev.actorId);if(idx<0||allyHp[idx]<=0)continue;
        const g=box.querySelector(`[data-bt-gauge-ally="${idx}"]`),a=box.querySelector(`[data-bt-ally="${idx}"]`),enemy=box.querySelector('[data-bt-enemy]');g?.classList.add('ready');await sleep(60);a?.classList.add('attack');await sleep(100);
        enemyHp=Math.max(0,Math.min(100,(Number(ev.enemyHp)||0)/Math.max(1,Number(b.enemyMax)||1)*100));enemy?.querySelector('.rg-bt-hp i')?.style.setProperty('width',enemyHp+'%');enemy?.classList.add('hit');float(box,enemy,'-'+Math.max(1,Math.round(ev.damage||0)),!!ev.crit,false);feed.innerHTML=(ev.crit?'<strong>暴击！</strong> ':'')+esc(name(allies[idx]))+' 行动条满，造成 '+Math.round(ev.damage||0)+' 伤害';
        await sleep(160);a?.classList.remove('attack');enemy?.classList.remove('hit');g?.classList.remove('ready');gaugeState.allies[ev.actorId]=0;setGauge(g,0);
      }else if(ev.type==='enemy'){
        const idx=allies.findIndex(m=>m.id===ev.targetId);if(idx<0)continue;const g=box.querySelector('[data-bt-gauge-enemy]'),enemy=box.querySelector('[data-bt-enemy]'),el=box.querySelector(`[data-bt-ally="${idx}"]`);g?.classList.add('ready');await sleep(60);enemy?.classList.add('attack');await sleep(120);
        const loss=Math.max(0,Number(ev.hpLoss)||0);allyHp[idx]=Math.max(0,Number(ev.hpAfter));el?.querySelector('.rg-bt-hp i')?.style.setProperty('width',allyHp[idx]+'%');el?.classList.add('hit');float(box,el,'-'+Math.max(1,Math.round(loss))+'%',false,false);feed.innerHTML='<strong>敌方行动条满！</strong> 攻击 '+esc(name(allies[idx]))+'，远征生命 -'+Math.round(loss)+'%';
        await sleep(190);enemy?.classList.remove('attack');el?.classList.remove('hit');g?.classList.remove('ready');gaugeState.enemy=0;setGauge(g,0);if(allyHp[idx]<=0){const ag=box.querySelector(`[data-bt-gauge-ally="${idx}"]`);ag?.classList.add('dead');gaugeState.allies[ev.targetId]=0;setGauge(ag,0)}
      }
      await sleep(90);
    }
  }else{
    feed.textContent='旧战斗记录：无法显示实时行动条。';await sleep(450);
  }
  if(battleKey(currentRun())!==key)return;
  const finalEnemy=Math.max(0,Math.min(100,(Number(b.enemyHp)||0)/Math.max(1,Number(b.enemyMax)||1)*100));box.querySelector('[data-bt-enemy] .rg-bt-hp i')?.style.setProperty('width',finalEnemy+'%');allies.forEach((m,i)=>{const p=Math.max(0,Math.min(100,Number(run.hp?.[m.id])||0));box.querySelector(`[data-bt-ally="${i}"] .rg-bt-hp i`)?.style.setProperty('width',p+'%')});banner.textContent=b.win?'VICTORY':'DEFEAT';feed.innerHTML=`<span class="rg-bt-result ${b.win?'win':'lose'}">${b.win?'战斗胜利！':'战斗失败'}</span> · ${b.atb?(b.actions||events.length)+' 次行动':(b.rounds||0)+' 回合'}`;if(original)original.style.display='grid';if(next)next.disabled=false
}
'''
s=s[:play_start]+new_play+s[play_end:]
p.write_text(s,encoding='utf-8')
