from pathlib import Path
p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

start=s.index('function applyRest(run)')
end=s.index('function treasure(run)', start)
new_rest="""function persistentMonster(id){return (S()?.monsters||[]).find(m=>m.id===id)||null}
function expeditionKnockout(run,m,logs=[]){if(!m)return;run.knockouts=run.knockouts||{};run.lifeLoss=run.lifeLoss||{};run.knockouts[m.id]=(run.knockouts[m.id]||0)+1;m.life=Math.max(0,(Number(m.life)||0)-1);run.lifeLoss[m.id]=(run.lifeLoss[m.id]||0)+1;logs.push(`${monsterName(m)} 远征生命归0：牧场生命 -1（剩 ${m.life}）。`);if(m.life<=0){run.permaDead=run.permaDead||{};run.permaDead[m.id]=true;run.hp[m.id]=0;logs.push(`${monsterName(m)} 的牧场生命已归0，怪物死亡，本次远征不能再复活。`)}}
function canReviveInRun(run,id){const m=persistentMonster(id);return !!m&&Number(m.life)>0&&!run.permaDead?.[id]}
function applyRest(run){const mods=relicMods(run),heal=30+(mods.rest||0)*100;for(const id of run.teamIds){if(!canReviveInRun(run,id)){run.hp[id]=0;continue}run.hp[id]=Math.min(100,hpPct(run,id)+heal)}run.supply=Math.min(7,run.supply+1+(mods.rest?1:0));run.log.push(`营地：可复活的队员恢复 ${Math.round(heal)}%，补给恢复。`);advance(run)}
"""
s=s[:start]+new_rest+s[end:]

start=s.index('function battle(run,kind)')
end=s.index('function offerRelic(run)', start)
new_battle="""function battle(run,kind){const zone=z(run.zone),t=activeTeam(run),elite=kind==='elite',boss=kind==='boss',mult=zone.enemy*(1+run.stage*.085)*(elite?1.22:1)*(boss?1.48:1),enemyMax=Math.round(240*mult+zone.tier*70),enemyAtk=55*mult+zone.tier*11,enemyDef=45*mult+zone.tier*9;let enemy=enemyMax,round=0,firstGuard=true;const logs=[];while(enemy>0&&round<8&&t.some(m=>hpPct(run,m.id)>0&&canReviveInRun(run,m.id))){round++;const aliveNow=t.map((m,orig)=>({m,orig,hp:hpPct(run,m.id)})).filter(x=>x.hp>0&&canReviveInRun(run,x.m.id));let dmg=0;aliveNow.forEach((x,dynPos)=>{const p=combatValue(x.m,dynPos,run),crit=Math.random()<Math.min(.38,p.luck/1600),raw=(p.atk*.22+p.spd*.06+p.luck*.025)*(crit?1.65:1),hit=Math.max(7,raw-enemyDef*.07);dmg+=hit});enemy=Math.max(0,enemy-dmg);logs.push(`第 ${round} 回合：队伍造成 ${Math.round(dmg)} 伤害${enemy<=0?'，敌人倒下。':''}`);if(enemy<=0)break;const alive=t.map((m,orig)=>({m,orig,hp:hpPct(run,m.id)})).filter(x=>x.hp>0&&canReviveInRun(run,x.m.id)).map((x,dynPos)=>({...x,dynPos}));if(!alive.length)break;const roll=Math.random();let target=roll<.64?alive[0]:roll<.88?(alive[1]||alive[0]):(alive[2]||alive[1]||alive[0]);const p=combatValue(target.m,target.dynPos,run);let incoming=Math.max(5,enemyAtk-p.def*.08);if(firstGuard&&(relicMods(run).firstGuard||0)){incoming*=1-relicMods(run).firstGuard;firstGuard=false}const hpLoss=Math.min(42,incoming/(65+p.con*.22)*100),before=hpPct(run,target.m.id);run.hp[target.m.id]=Math.max(0,before-hpLoss);logs.push(`敌人反击 ${monsterName(target.m)}（${['前卫','中卫','后卫'][target.dynPos]}），远征生命 -${Math.round(hpLoss)}%。`);if(before>0&&run.hp[target.m.id]<=0){expeditionKnockout(run,target.m,logs);if(target.m.life>0)logs.push(`${monsterName(target.m)} 已倒下，但之后可通过营地/恢复效果复活；若再次归0会再次扣1生命。`);logs.push('后方存活队员自动向前补位。')}}const win=enemy<=0;if(win){const base=Math.round((1100+run.stage*330)*(elite?1.7:1)*(boss?2.8:1)*nodeRewardScale(zone,run.stage));run.energy+=base;if(elite)run.tempBadges+=Math.max(1,Math.round(zone.badge*.5));const heal=relicMods(run).heal||0;if(heal)t.forEach(m=>{if(canReviveInRun(run,m.id))run.hp[m.id]=Math.min(100,hpPct(run,m.id)+heal*100);else run.hp[m.id]=0});run.log.push(`${boss?'首领':elite?'精英':'战斗'}胜利：+${base} 灵能。`)}else run.log.push('战斗失败，远征被迫撤退。');run.battle={kind,enemyMax,enemyHp:enemy,rounds:round,logs,win};run.phase='battleResult';save()}\n"""
s=s[:start]+new_battle+s[end:]

start=s.index('function applyExpeditionLifeCost(run,cleared)')
end=s.index('function abandon()', start)
new_finish="""function applyExpeditionLifeCost(run,cleared){const s=S();if(!s)return[];const byId=new Map((s.monsters||[]).map(m=>[m.id,m])),notes=[];if(cleared){for(const id of run.teamIds||[]){const m=byId.get(id);if(!m||Number(m.life)<=0)continue;m.life=Math.max(0,(Number(m.life)||0)-1);run.lifeLoss=run.lifeLoss||{};run.lifeLoss[id]=(run.lifeLoss[id]||0)+1;notes.push(`${monsterName(m)} 完成远征 -1生命（剩 ${m.life}）${m.life<=0?'，怪物死亡':''}`)}}for(const id of run.teamIds||[]){const m=byId.get(id);const lost=Number(run.lifeLoss?.[id])||0;if(lost>0&&!notes.some(x=>m&&x.startsWith(monsterName(m))))notes.push(`${m?monsterName(m):'怪物'} 本次远征累计 -${lost}生命`)}return notes}
function finish(run,cleared=false,defeated=false,choice=''){const s=S(),e=ensure();if(!s||!e)return;const zone=z(run.zone),fraction=cleared?1:defeated?.35:.65,payout=Math.round(run.energy*fraction),badge=cleared?zone.badge+run.tempBadges:Math.floor(run.tempBadges*fraction);s.energy=(Number(s.energy)||0)+payout;e.badges+=badge;for(const k of Object.keys(run.materials))e.loot[k]=(e.loot[k]||0)+Math.floor((run.materials[k]||0)*fraction);const lifeNotes=applyExpeditionLifeCost(run,cleared);e.rogueLast={zone:zone.name,cleared,defeated,payout,badge,relics:run.relics?.length||0,time:Date.now(),choice,lifeNotes};e.rogueActive=null;const lifeText=lifeNotes.length?' · '+lifeNotes.join('；'):'';save((cleared?`远征通关！带回 ${payout} 灵能、徽章 ×${badge}。`:`远征结束，带回 ${payout} 灵能。`)+lifeText)}
"""
s=s[:start]+new_finish+s[end:]

# Show persistent life and knockout count in monster cards.
s=s.replace("<small>远征生命 ${Math.round(hp)}%</small>","<small>远征生命 ${Math.round(hp)}% · 牧场生命 ${Math.max(0,Number(m.life)||0)}${run.knockouts?.[m.id]?' · 本局倒下 '+run.knockouts[m.id]+'次':''}${run.permaDead?.[m.id]?' · 已死亡':''}</small>")

p.write_text(s,encoding='utf-8')
