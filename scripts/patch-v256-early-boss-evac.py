from pathlib import Path
import re

root=Path('.')
p=root/'v199-roguelike-expedition.js'
s=p.read_text(encoding='utf-8')

old="function chooseRelic(run,id){if(!(run.relicChoices||[]).includes(id))return;run.relics.push(id);run.log.push(`获得遗物：${RELICS.find(x=>x.id===id)?.name||id}`);run.relicChoices=[];if(run.stage%9===8)floorTransitionHeal(run);advance(run)}"
new="function chooseRelic(run,id){if(!(run.relicChoices||[]).includes(id))return;run.relics.push(id);run.log.push(`获得遗物：${RELICS.find(x=>x.id===id)?.name||id}`);run.relicChoices=[];if(run.stage%9===8&&floorNo(run.stage)<=2){run.phase='floorBossChoice';save(`${floorLabel(run.stage)} BOSS 已击败：可按25%撤离，或继续下一楼层。`);return}if(run.stage%9===8)floorTransitionHeal(run);advance(run)}"
if old not in s: raise SystemExit('chooseRelic target not found')
s=s.replace(old,new,1)

pattern=re.compile(r"function floorBossChoiceHTML\(run\)\{.*?\}\nfunction cashoutFloor\(run\)\{.*?\}\nfunction continueEndlessFloor\(run\)\{.*?\}",re.S)
replacement=r'''function floorBossChoiceHTML(run){
  const current=floorNo(run.stage),next=current+1,early=current<=2,enemyExtra=Math.max(0,next-3)*10,rewardExtra=Math.max(0,next-3)*5;
  const exitTitle=early?'撤离并结束（25%）':'领取全部奖励并结束';
  const exitText=early?'只带回目前奖励的 25%；这是主动撤离，不视为战斗失败':'以 100% 结算目前已获得奖励';
  const continueTitle=early?'继续下一楼层':'继续无限模式';
  const continueText=early?`进入 ${next}-1 · 全队HP +50%`:`进入 ${next}-1 · 全队HP +50% · 敌方所有能力 +${enemyExtra}% · 本层局内奖励 +${rewardExtra}%`;
  return `${runHeader(run)}${runInventoryHTML(run)}<section class="rg-panel rg-floor-choice"><div class="rg-title"><div><b>${floorLabel(run.stage)} 楼层BOSS已击败</b><small>${early?'早期撤离点：现在撤离只能带回25%奖励；继续则进入下一楼层。':`现在是安全结算点。继续后进入 ${next}-1；敌方全能力与局内奖励使用独立倍率。`}</small></div></div><div class="rg-final"><button class="primary rg-relic" data-rg-floor-cashout><b>${exitTitle}</b><span>${exitText}</span></button><button class="secondary rg-relic" data-rg-floor-continue><b>${continueTitle}</b><span>${continueText}</span></button></div></section>`;
}
function cashoutFloor(run){const early=floorNo(run.stage)<=2;if(early)finish(run,false,false,`${floorLabel(run.stage)}撤离点（25%）`);else finish(run,true,false,`${floorLabel(run.stage)}安全结算`)}
function continueEndlessFloor(run){if(floorNo(run.stage)>=3)run.endless=true;floorTransitionHeal(run);advance(run)}'''
s,n=pattern.subn(replacement,s,count=1)
if n!=1: raise SystemExit(f'floor choice replacement count={n}')

for name in ['game.js','index.html','v199-roguelike-expedition.js','v201-battle-theater.js']:
    q=root/name
    if not q.exists(): continue
    t=q.read_text(encoding='utf-8')
    t=t.replace('v255','v256').replace('?v=255','?v=256')
    q.write_text(t,encoding='utf-8')
