from pathlib import Path
import json,re

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

# Random skill usage: 20% each ally action, otherwise normal attack.
old="const p=ready.p,en2=enemyNow(target),skillTurn=personalActions[m.id]%3===0,skill=skillTurn?battleSkillFor(m):null;let power=1,skillName='',specialText='';"
new="const p=ready.p,en2=enemyNow(target),skillTurn=Math.random()<.20,skill=skillTurn?battleSkillFor(m):null;let power=1,skillName='',specialText='';"
if old not in s: raise SystemExit('skill cadence anchor missing')
s=s.replace(old,new,1)

# Expand HP tooltip/breakdown with the actual HP formula and front-position modifier.
old="""    const detail=['原始：'+Math.round(b*10)/10];const tr=trainingEntry(run,m.id),trFlat=Number(tr.flat?.[i]||0),trPct=Number(tr.pct?.[i]||0);if(trFlat)detail.push('训练营固定：+'+Math.round(trFlat*10)/10);if(trPct)detail.push('训练营百分比：+'+Math.round(trPct*1000)/10+'%');
    if(i>0){"""
new="""    const detail=['原始：'+Math.round(b*10)/10];const tr=trainingEntry(run,m.id),trFlat=Number(tr.flat?.[i]||0),trPct=Number(tr.pct?.[i]||0);if(trFlat)detail.push('训练营固定：+'+Math.round(trFlat*10)/10);if(trPct)detail.push('训练营百分比：+'+Math.round(trPct*1000)/10+'%');
    if(i===0){
      const trained=Number(trainedBaseStats(m,run)[0])||0,hpPctRel=relicContribution('hpMult'),hpFlatRel=relicContribution('hpFlat');
      if(Math.abs(trained-b)>.05)detail.push('训练后HP：'+Math.round(trained*10)/10);
      if(hpPctRel.v)detail.push('HP百分比遗物：'+signedPct(hpPctRel.v)+(hpPctRel.names.length?'（'+hpPctRel.names.join('、')+'）':''));
      if(hpFlatRel.v)detail.push('固定HP遗物：+'+Math.round(hpFlatRel.v*10)/10+(hpFlatRel.names.length?'（'+hpFlatRel.names.join('、')+'）':''));
      if(pos===0)detail.push('前卫站位：HP +25%');
      detail.push('计算：('+Math.round(trained*10)/10+(hpPctRel.v?' × '+(Math.round((1+hpPctRel.v)*1000)/1000):'')+(hpFlatRel.v?' + '+Math.round(hpFlatRel.v*10)/10:'')+')'+(pos===0?' × 1.25':'')+' = '+f);
    }
    if(i>0){"""
if old not in s: raise SystemExit('stat detail anchor missing')
s=s.replace(old,new,1)

# Add a rule hint to the speed/rules copy where easy to inspect in UI/tooling.
s=s.replace("function speedRuleText(){return '速度决定行动条充能速度；所有参战单位（包括每一只敌人）会同时充能，行动条达到 100% 就立刻行动。'}",
            "function speedRuleText(){return '速度决定行动条充能速度；所有参战单位会同时充能，行动条达到 100% 就立刻行动。我方每次行动独立判定：80% 普通攻击，20% 使用战斗技能。'}")

p.write_text(s,encoding='utf-8')

# Visible/cache version bump.
idx=Path('index.html');x=idx.read_text(encoding='utf-8')
x=x.replace('v=261','v=262').replace('v261 ·','v262 ·').replace('Qinster v261 错误','Qinster v262 错误')
idx.write_text(x,encoding='utf-8')

# package versions
pkg=Path('package.json');d=json.loads(pkg.read_text(encoding='utf-8'));d['version']='262.0.0';pkg.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
lock=Path('package-lock.json');ld=json.loads(lock.read_text(encoding='utf-8'));ld['version']='262.0.0';ld['packages']['']['version']='262.0.0';lock.write_text(json.dumps(ld,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

cg=Path('scripts/check-game.mjs');c=cg.read_text(encoding='utf-8').replace('game.js?v=261','game.js?v=262');cg.write_text(c,encoding='utf-8')
print('v262 patch applied')
