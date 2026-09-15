from pathlib import Path


def replace_once(text, old, new, label):
    if old not in text:
        raise SystemExit(f'missing target: {label}')
    return text.replace(old, new, 1)

p = Path('v199-roguelike-expedition.js')
s = p.read_text(encoding='utf-8')

old = "function chooseRelic(run,id){if(!(run.relicChoices||[]).includes(id))return;run.relics.push(id);run.log.push(`获得遗物：${RELICS.find(x=>x.id===id)?.name||id}`);run.relicChoices=[];advance(run)}"
new = "function floorTransitionHeal(run){const next=floorNo(run.stage)+1;let count=0;for(const mid of run.teamIds||[]){if(!canReviveInRun(run,mid))continue;run.hp[mid]=Math.min(100,hpPct(run,mid)+50);count++}if(count)run.log.push(`楼层休整：进入 ${next}-1 前，队伍远征HP恢复 50%（上限100%）。`)}\nfunction chooseRelic(run,id){if(!(run.relicChoices||[]).includes(id))return;run.relics.push(id);run.log.push(`获得遗物：${RELICS.find(x=>x.id===id)?.name||id}`);run.relicChoices=[];if(run.stage%9===8)floorTransitionHeal(run);advance(run)}"
s = replace_once(s, old, new, 'boss relic floor transition heal')

old = "function continueEndlessFloor(run){run.endless=true;advance(run)}"
new = "function continueEndlessFloor(run){run.endless=true;floorTransitionHeal(run);advance(run)}"
s = replace_once(s, old, new, 'endless floor transition heal')

# Add the recovery information to the safe continuation prompt so the rule is visible.
s = s.replace("敌方所有能力 +${enemyExtra}% · 本层局内奖励 +${rewardExtra}%", "全队HP +50% · 敌方所有能力 +${enemyExtra}% · 本层局内奖励 +${rewardExtra}%")

# Visible/internal version bump.
s = s.replace("v246", "v247")
p.write_text(s, encoding='utf-8')

for fn in ['game.js','index.html','v201-battle-theater.js']:
    q = Path(fn)
    t = q.read_text(encoding='utf-8')
    t = t.replace('v246', 'v247')
    if fn == 'index.html':
        t = t.replace('?v=246', '?v=247')
    q.write_text(t, encoding='utf-8')

print('v247 floor transition heal applied')
