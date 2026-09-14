from pathlib import Path

src=Path('scripts/patch-v214-action-gauge.py').read_text(encoding='utf-8')
start=src.find('# Fill the relevant gauge immediately before each structured action.')
end=src.find("p.write_text(s,encoding='utf-8')", start)
if start<0 or end<0:
    raise SystemExit('v214 patch section bounds not found')
robust=r'''# Fill the relevant gauge immediately before each structured action.
ally_action="a?.classList.add('attack');await sleep(110);"
ally_with="await chargeGauge(`[data-bt-gauge-ally=\\\"${idx}\\\"]`,ev.spd,!!ev.extra);"+ally_action
if ally_action not in s:
    raise SystemExit('ally action not found')
s=s.replace(ally_action,ally_with,1)

enemy_action="enemy?.classList.add('attack');await sleep(150);"
enemy_with="await chargeGauge('[data-bt-gauge-enemy]',ev.spd||b.enemySpd,!!ev.extra);"+enemy_action
if enemy_action not in s:
    raise SystemExit('enemy action not found')
s=s.replace(enemy_action,enemy_with,1)

# Once an ally reaches 0 HP, gray its gauge and prevent any future charge/attack animation.
ko_action="el?.querySelector('.rg-bt-hp i')?.style.setProperty('width',allyHp[idx]+'%');el?.classList.add('hit');"
ko_with=ko_action+"if(allyHp[idx]<=0)box.querySelector(`[data-bt-gauge-ally=\\\"${idx}\\\"]`)?.classList.add('dead');"
if ko_action not in s:
    raise SystemExit('KO action not found')
s=s.replace(ko_action,ko_with,1)

'''
src=src[:start]+robust+src[end:]
exec(compile(src,'patch-v214b-action-gauge','exec'))
