from pathlib import Path

exp=Path('v199-roguelike-expedition.js')
s=exp.read_text(encoding='utf-8')

# 1) add speed helper before battle
needle="function prepareBattle(run,kind){run.pendingBattle=enemyPreview(run,kind);run.phase='battlePreview';save()}"
insert="""function prepareBattle(run,kind){run.pendingBattle=enemyPreview(run,kind);run.phase='battlePreview';save()}\nfunction speedExtraChance(diff){return diff>=250?.30:diff>=150?.20:diff>=50?.10:0}\nfunction speedRuleText(){return '速度决定先手；比对方快 50/150/250 时，每次行动分别有 10%/20%/30% 概率追加一次行动。'}"""
if needle not in s:
    raise SystemExit('prepareBattle target not found')
s=s.replace(needle,insert,1)

# 2) replace battle function as a whole up to offerRelic
start=s.find('function battle(run,kind){')
end=s.find('function offerRelic(run){', start)
if start<0 or end<0:
    raise SystemExit('battle function bounds not found')
new_battle=r'''function battle(run,kind){
  ensureRunMeta(run);
  const zone=z(run.zone),t=activeTeam(run),elite=kind==='elite',boss=kind==='boss',ep=run.pendingBattle&&run.pendingBattle.kind===kind?run.pendingBattle:enemyPreview(run,kind),enemyMax=ep.enemyMax,enemyAtk=ep.enemyAtk,enemyDef=ep.enemyDef,enemySpd=ep.enemySpd,enemyLuck=ep.enemyLuck;
  run.pendingBattle=null;
  const startHp={}; t.forEach(m=>startHp[m.id]=hpPct(run,m.id));
  let enemy=enemyMax,round=0,firstGuard=true;
  const logs=[],events=[];
  if((elite||boss)&&Math.random()<(boss?0.70:0.38)){const pool=CURSES.filter(c=>!run.curses.includes(c.id));if(pool.length)inflictCurse(run,rand(pool).id,logs)}
  const initialTeamPower=t.filter(m=>canReviveInRun(run,m.id)&&hpPct(run,m.id)>0).reduce((sum,m,i)=>{const p=combatValue(m,i,run);return sum+p.atk*1.1+p.def+p.spd*.65+p.luck*.35+p.con*.7},0),enemyPower=Math.round(enemyMax*.7+enemyAtk*2+enemyDef*1.3+enemySpd*.5+enemyLuck*.25);
  while(enemy>0&&round<8&&t.some(m=>hpPct(run,m.id)>0&&canReviveInRun(run,m.id))){
    round++;
    const aliveNow=t.map((m,orig)=>({m,orig,hp:hpPct(run,m.id)})).filter(x=>x.hp>0&&canReviveInRun(run,x.m.id));
    const fastestAlly=Math.max(0,...aliveNow.map((x,dynPos)=>combatValue(x.m,dynPos,run).spd));
    const allyFirst=fastestAlly>=enemySpd;
    const allyPhase=()=>{
      let total=0;
      const current=t.map((m,orig)=>({m,orig,hp:hpPct(run,m.id)})).filter(x=>x.hp>0&&canReviveInRun(run,x.m.id));
      current.forEach((x,dynPos)=>{
        if(enemy<=0||hpPct(run,x.m.id)<=0||!canReviveInRun(run,x.m.id))return;
        const p=combatValue(x.m,dynPos,run),crit=Math.random()<Math.min(.38,p.luck/1600),raw=(p.atk*.22+p.spd*.06+p.luck*.025)*(crit?1.65:1),hit=Math.max(7,raw-enemyDef*.07);
        enemy=Math.max(0,enemy-hit); total+=hit;
        events.push({type:'ally',round,actorId:x.m.id,damage:Math.round(hit),crit,enemyHp:enemy});
        const extra=speedExtraChance(p.spd-enemySpd);
        if(enemy>0&&extra>0&&Math.random()<extra){
          const crit2=Math.random()<Math.min(.38,p.luck/1600),raw2=(p.atk*.22+p.spd*.06+p.luck*.025)*(crit2?1.65:1),hit2=Math.max(7,raw2-enemyDef*.07);
          enemy=Math.max(0,enemy-hit2); total+=hit2;
          events.push({type:'ally',round,actorId:x.m.id,damage:Math.round(hit2),crit:crit2,extra:true,enemyHp:enemy});
          logs.push(`${monsterName(x.m)} 速度压制，追加行动造成 ${Math.round(hit2)} 伤害。`);
        }
      });
      if(total>0)logs.push(`第 ${round} 回合：队伍造成 ${Math.round(total)} 伤害${enemy<=0?'，敌人倒下。':''}`);
    };
    const enemyPhase=()=>{
      if(enemy<=0)return;
      const alive=t.map((m,orig)=>({m,orig,hp:hpPct(run,m.id)})).filter(x=>x.hp>0&&canReviveInRun(run,x.m.id)).map((x,dynPos)=>({...x,dynPos}));
      if(!alive.length)return;
      const roll=Math.random();let target=roll<.64?alive[0]:roll<.88?(alive[1]||alive[0]):(alive[2]||alive[1]||alive[0]);
      const p=combatValue(target.m,target.dynPos,run);
      const strike=(extra=false)=>{
        if(hpPct(run,target.m.id)<=0||!canReviveInRun(run,target.m.id))return;
        let incoming=Math.max(5,enemyAtk-p.def*.08);
        if(firstGuard&&(combatMods(run).firstGuard||0)){incoming*=1-combatMods(run).firstGuard;firstGuard=false}
        const hpLoss=Math.min(42,incoming/(65+p.con*.22)*100),before=hpPct(run,target.m.id);
        run.hp[target.m.id]=Math.max(0,before-hpLoss);
        events.push({type:'enemy',round,targetId:target.m.id,hpLoss,extra,hpAfter:run.hp[target.m.id]});
        logs.push(`${extra?'敌人速度压制追加攻击：':'敌人反击 '}${monsterName(target.m)}（${['前卫','中卫','后卫'][target.dynPos]}），远征生命 -${Math.round(hpLoss)}%。`);
        if(before>0&&run.hp[target.m.id]<=0){expeditionKnockout(run,target.m,logs);if(target.m.life>0)logs.push(`${monsterName(target.m)} 已倒下，但之后可通过营地/恢复效果复活；若再次归0会再次扣1生命。`);logs.push('后方存活队员自动向前补位。')}
      };
      strike(false);
      if(hpPct(run,target.m.id)>0&&enemy>0){const extra=speedExtraChance(enemySpd-p.spd);if(extra>0&&Math.random()<extra)strike(true)}
    };
    if(allyFirst){allyPhase();if(enemy>0)enemyPhase()}else{enemyPhase();if(t.some(m=>hpPct(run,m.id)>0&&canReviveInRun(run,m.id)))allyPhase()}
  }
  const win=enemy<=0,aliveCount=t.filter(m=>hpPct(run,m.id)>0&&canReviveInRun(run,m.id)).length,reason=win?`在第 ${round} 回合击穿敌方 ${enemyMax} HP`:(aliveCount===0?'队伍全部倒下':'8回合内未能击败敌人');
  if(win){const eliteBonus=elite?(1+(combatMods(run).eliteReward||0)):1,base=Math.round((1100+run.stage*330)*(elite?1.7:1)*(boss?2.8:1)*nodeRewardScale(zone,run.stage)*eliteBonus);run.energy+=base;if(elite)run.tempBadges+=Math.max(1,Math.round(zone.badge*.5));const heal=combatMods(run).heal||0;if(heal)t.forEach(m=>{if(canReviveInRun(run,m.id))run.hp[m.id]=Math.min(100,hpPct(run,m.id)+heal*100);else run.hp[m.id]=0});run.log.push(`${boss?'首领':elite?'精英':'战斗'}胜利：+${base} 灵能。`)}else run.log.push('战斗失败，远征被迫撤退。');
  run.battle={kind,enemyMax,enemyHp:enemy,enemyAtk,enemyDef,enemySpd,enemyLuck,enemyPower,teamPower:Math.round(initialTeamPower),rounds:round,logs,events,startHp,win,reason,enemySpecies:ep.enemySpecies};
  run.nextBattleMods={};run.phase='battleResult';save()
}
'''
s=s[:start]+new_battle+s[end:]

# 3) add speed explanation to battle preview note
old='''<p class="rg-note"><b>战力参考：</b>我方 ${teamPower} · 敌方 ${enemyPower}。注意：战力只是属性参考，<b>当前远征HP、站位、Debuff、暴击和8回合限制</b>都会影响输赢。</p>'''
new='''<p class="rg-note"><b>战力参考：</b>我方 ${teamPower} · 敌方 ${enemyPower}。注意：战力只是属性参考，<b>当前远征HP、站位、Debuff、暴击和8回合限制</b>都会影响输赢。<br><b>速度：</b>${speedRuleText()}</p>'''
if old in s:
    s=s.replace(old,new,1)

exp.write_text(s,encoding='utf-8')

# Theater: replay structured events and use pre-battle HP snapshot
p=Path('v201-battle-theater.js')
t=p.read_text(encoding='utf-8')

# starting HP should use battle.startHp, not post-battle run.hp
old="const startHp=Math.max(0,Math.min(100,Number(run.hp?.[m.id])||0));"
new="const startHp=Math.max(0,Math.min(100,Number(b.startHp?.[m.id] ?? run.hp?.[m.id])||0));"
if old not in t:
    raise SystemExit('theater startHp target not found')
t=t.replace(old,new,1)
old2="allyHp=team(run).map(m=>Math.max(0,Math.min(100,Number(run.hp?.[m.id])||0)))"
new2="allyHp=team(run).map(m=>Math.max(0,Math.min(100,Number(b.startHp?.[m.id] ?? run.hp?.[m.id])||0)))"
if old2 not in t:
    raise SystemExit('theater allyHp target not found')
t=t.replace(old2,new2,1)

# Replace play loop body with structured-event aware path, keep legacy fallback
loop_start=t.find('for(let i=0;i<logs.length;i++){')
loop_end=t.find("if(battleKey(currentRun())!==key)return;", loop_start)
if loop_start<0 or loop_end<0:
    raise SystemExit('theater loop bounds not found')
new_loop=r'''const events=Array.isArray(b.events)?b.events:[];
if(events.length){
  for(let i=0;i<events.length;i++){
    if(skip||battleKey(currentRun())!==key)break;
    const ev=events[i];round=ev.round||round;banner.textContent='ROUND '+round;
    if(ev.type==='ally'){
      const allies=team(run),idx=allies.findIndex(m=>m.id===ev.actorId);if(idx<0)continue;
      if(allyHp[idx]<=0)continue;
      const a=box.querySelector(`[data-bt-ally="${idx}"]`),enemy=box.querySelector('[data-bt-enemy]');
      a?.classList.add('attack');await sleep(110);
      enemyHp=Math.max(0,Math.min(100,(Number(ev.enemyHp)||0)/Math.max(1,Number(b.enemyMax)||1)*100));
      enemy?.querySelector('.rg-bt-hp i')?.style.setProperty('width',enemyHp+'%');enemy?.classList.add('hit');
      float(box,enemy,'-'+Math.max(1,Math.round(ev.damage||0)),!!ev.crit,false);
      feed.innerHTML=(ev.extra?'<strong>速度追加！</strong> ':'')+(ev.crit?'<strong>暴击！</strong> ':'')+esc(name(allies[idx]))+' 造成 '+Math.round(ev.damage||0)+' 伤害';
      await sleep(150);a?.classList.remove('attack');enemy?.classList.remove('hit');await sleep(70);
    }else if(ev.type==='enemy'){
      const allies=team(run),idx=allies.findIndex(m=>m.id===ev.targetId);if(idx<0)continue;
      const enemy=box.querySelector('[data-bt-enemy]'),el=box.querySelector(`[data-bt-ally="${idx}"]`);
      enemy?.classList.add('attack');await sleep(150);
      const loss=Math.max(0,Number(ev.hpLoss)||0);allyHp[idx]=Math.max(0,Number(ev.hpAfter));
      el?.querySelector('.rg-bt-hp i')?.style.setProperty('width',allyHp[idx]+'%');el?.classList.add('hit');
      float(box,el,'-'+Math.max(1,Math.round(loss))+'%',false,false);
      feed.innerHTML=(ev.extra?'<strong>敌方速度追加！</strong> ':' )+'敌人攻击 '+esc(name(allies[idx]))+'，远征生命 -'+Math.round(loss)+'%';
      await sleep(220);enemy?.classList.remove('attack');el?.classList.remove('hit');
    }
    await sleep(220);
  }
}else{
for(let i=0;i<logs.length;i++){if(skip||battleKey(currentRun())!==key)break;const line=logs[i];const rm=String(line).match(/(?:回合|Round)\s*(\d+)/i);if(rm){round=Number(rm[1])||round;banner.textContent='ROUND '+round}const enemyActs=isEnemyLine(line);const crit=isCrit(line),miss=isMiss(line),dmg=estimateDamage(line)||Math.round(8+Math.random()*16);if(enemyActs){const enemy=box.querySelector('[data-bt-enemy]');enemy?.classList.add('attack');await sleep(150);const live=allyHp.map((x,j)=>x>0?j:-1).filter(j=>j>=0);const target=live.length?live[i%live.length]:0;const el=box.querySelector(`[data-bt-ally="${target}"]`);if(!miss){const hpLoss=estimateHpLoss(line)??Math.min(35,dmg/4);allyHp[target]=Math.max(0,allyHp[target]-hpLoss);el?.querySelector('.rg-bt-hp i')?.style.setProperty('width',allyHp[target]+'%');el?.classList.add('hit');float(box,el,'-'+Math.max(1,Math.round(hpLoss))+'%',crit,miss)}else float(box,el,'MISS',false,true);await sleep(220);enemy?.classList.remove('attack');el?.classList.remove('hit')}else{const enemy=box.querySelector('[data-bt-enemy]');const allies=team(run);const attackers=allies.map((m,j)=>({m,j})).filter(x=>allyHp[x.j]>0);const share=Math.max(1,dmg/Math.max(1,attackers.length));for(const x of attackers){if(skip)break;const a=box.querySelector(`[data-bt-ally="${x.j}"]`);if(allyHp[x.j]<=0)continue;a?.classList.add('attack');await sleep(110);if(!miss){const dealtPct=Math.min(enemyHp,share/Math.max(1,Number(b.enemyMax)||1)*100);enemyHp=Math.max(0,enemyHp-dealtPct);enemy?.querySelector('.rg-bt-hp i')?.style.setProperty('width',enemyHp+'%');enemy?.classList.add('hit');float(box,enemy,'-'+Math.max(1,Math.round(share)),crit,miss)}else float(box,enemy,'MISS',false,true);await sleep(150);a?.classList.remove('attack');enemy?.classList.remove('hit');await sleep(70)}}feed.innerHTML=(crit?'<strong>暴击！</strong> ':'')+esc(line);await sleep(300)}
}
'''
t=t[:loop_start]+new_loop+t[loop_end:]
p.write_text(t,encoding='utf-8')
