from pathlib import Path

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')
old="const scoreBase=boss?600:elite?250:100,scoreGain=Math.round(scoreBase*(1+(floorNo(run.stage)-1)*.10)*(1+(Number(run.difficulty)||0)*.08));run.score=(Number(run.score)||0)+scoreGain;"
new="const scoreGain=Math.max(1,Math.round(enemyPower));run.score=(Number(run.score)||0)+scoreGain;"
if old not in s:
    raise SystemExit('score formula target not found')
s=s.replace(old,new,1)
s=s.replace("· 击杀积分 +${scoreGain}。","· 击杀积分 +${scoreGain}（敌人难度评分 ${scoreGain}）。",1)
s=s.replace("enemyPower,teamPower:Math.round(initialTeamPower)","enemyPower,difficultyRating:Math.round(enemyPower),teamPower:Math.round(initialTeamPower)",1)
s=s.replace("<small>${b.affixes?.length?'强化词条：'+b.affixes.join(' · '):'强化词条：无'} · 随机系数 ${b.variance||100}%</small><div class=\"rg-hp\">","<small>${b.affixes?.length?'强化词条：'+b.affixes.join(' · '):'强化词条：无'} · 随机系数 ${b.variance||100}%</small><small>难度评分 ${enemyPower}</small><div class=\"rg-hp\">",1)
s=s.replace("<small>敌方估值 ${b.enemyPower||'-'} · 我方估值 ${b.teamPower||'-'}</small>","<small>敌人难度评分 ${b.difficultyRating||b.enemyPower||'-'} · 我方估值 ${b.teamPower||'-'}</small>",1)
old_battle="<p class=\"rg-note\"><b>结果原因：</b>${b.reason||'根据双方属性、站位、遗物和随机暴击结算'}</p><div class=\"rg-log\">${b.logs.map(x=>`<div>${x}</div>`).join('')}</div><button class=\"primary rg-mainbtn\" data-rg-battle-next>${b.win?'领取结果并继续':'结束远征'}</button>"
new_battle="<p class=\"rg-note\"><b>结果原因：</b>${b.reason||'根据双方属性、站位、遗物和随机暴击结算'}</p><div class=\"rg-battle-next-wrap\"><button class=\"primary rg-mainbtn rg-battle-next-sticky\" data-rg-battle-next>${b.win?'领取结果并继续':'结束远征'}</button></div><div class=\"rg-log\">${b.logs.map(x=>`<div>${x}</div>`).join('')}</div>"
if old_battle not in s:
    raise SystemExit('battle result button target not found')
s=s.replace(old_battle,new_battle,1)
style_anchor=".rg-mainbtn{width:100%;padding:12px}"
style_new=style_anchor+".rg-battle-next-wrap{position:sticky;bottom:8px;z-index:70;padding:4px 0 7px;background:linear-gradient(180deg,rgba(201,200,205,0),#c9c8cd 28%)}.rg-battle-next-sticky{box-shadow:0 3px 0 #7d241f,0 0 0 2px rgba(255,255,255,.22);font-size:13px;font-weight:900}"
if style_anchor not in s:
    raise SystemExit('main button style anchor not found')
s=s.replace(style_anchor,style_new,1)
s=s.replace("window.QinsterExpedition={render,zones:ZONES,version:'v239-rogue-score-meta'};","window.QinsterExpedition={render,zones:ZONES,version:'v240-difficulty-score'};",1)
p.write_text(s,encoding='utf-8')

for fn in ['game.js','index.html']:
    q=Path(fn)
    x=q.read_text(encoding='utf-8')
    x=x.replace('v239','v240')
    q.write_text(x,encoding='utf-8')
