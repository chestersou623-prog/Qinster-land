from pathlib import Path

# v199: one enemy identity shared by preview, result card, and theater.
p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')
old="function enemyPreview(run,kind){const zone=z(run.zone),elite=kind==='elite',boss=kind==='boss',mult=zone.enemy*(1+run.stage*.085)*(elite?1.22:1)*(boss?1.48:1);return{kind,enemyMax:Math.round(240*mult+zone.tier*70),enemyAtk:Math.round(55*mult+zone.tier*11),enemyDef:Math.round(45*mult+zone.tier*9),enemySpd:Math.round(40*mult+zone.tier*8),enemyLuck:Math.round(32*mult+zone.tier*6)}}"
new="function enemyPreview(run,kind){const zone=z(run.zone),elite=kind==='elite',boss=kind==='boss',mult=zone.enemy*(1+run.stage*.085)*(elite?1.22:1)*(boss?1.48:1),speciesCount=Math.max(1,R()?.G?.SPECIES?.length||1),enemySpecies=(zone.tier*11+(run.stage||0)*7+(boss?5:elite?2:0))%speciesCount;return{kind,enemySpecies,enemyMax:Math.round(240*mult+zone.tier*70),enemyAtk:Math.round(55*mult+zone.tier*11),enemyDef:Math.round(45*mult+zone.tier*9),enemySpd:Math.round(40*mult+zone.tier*8),enemyLuck:Math.round(32*mult+zone.tier*6)}}"
assert old in s, 'enemyPreview target not found'
s=s.replace(old,new,1)
old="run.battle={kind,enemyMax,enemyHp:enemy,enemyAtk,enemyDef,enemySpd,enemyLuck,enemyPower,teamPower:Math.round(initialTeamPower),rounds:round,logs,win,reason};"
new="run.battle={kind,enemySpecies:ep.enemySpecies,enemyMax,enemyHp:enemy,enemyAtk,enemyDef,enemySpd,enemyLuck,enemyPower,teamPower:Math.round(initialTeamPower),rounds:round,logs,win,reason};"
assert old in s, 'battle result target not found'
s=s.replace(old,new,1)
old="const enemyCard=`<div class=\"rg-mon rg-enemy-match\"><div class=\"sprite\" style=\"width:58px;height:58px;margin:auto;display:grid;place-items:center;font-size:28px\">${b.kind==='boss'?'★':b.kind==='elite'?'☠':'⚔'}</div><b>${kindName}</b>"
new="const enemyCard=`<div class=\"rg-mon rg-enemy-match\">${R()?.sprite?.(b.enemySpecies,0,b.kind==='boss',null)||`<div class=\"sprite\" style=\"width:58px;height:58px;margin:auto;display:grid;place-items:center;font-size:28px\">${b.kind==='boss'?'★':b.kind==='elite'?'☠':'⚔'}</div>`}<b>${kindName}</b>"
assert old in s, 'preview card target not found'
s=s.replace(old,new,1)
old="<div class=\"rg-mon rg-enemy-match\"><div class=\"sprite\" style=\"width:58px;height:58px;margin:auto;display:grid;place-items:center;font-size:28px\">${b.kind==='boss'?'★':b.kind==='elite'?'☠':'⚔'}</div><b>${b.kind==='boss'?'区域首领':b.kind==='elite'?'精英守卫':'野外守卫'}</b>"
new="<div class=\"rg-mon rg-enemy-match\">${R()?.sprite?.(b.enemySpecies,0,b.kind==='boss',null)||`<div class=\"sprite\" style=\"width:58px;height:58px;margin:auto;display:grid;place-items:center;font-size:28px\">${b.kind==='boss'?'★':b.kind==='elite'?'☠':'⚔'}</div>`}<b>${b.kind==='boss'?'区域首领':b.kind==='elite'?'精英守卫':'野外守卫'}</b>"
assert old in s, 'result card target not found'
s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')

# v201: same sprite source and live HP bars that update on each hit.
p=Path('v201-battle-theater.js')
s=p.read_text(encoding='utf-8')
old="function enemyMonster(run){const all=Object.keys(R()?.G?.SPECIES||{});if(!all.length)return null;const tier=Number(String(run?.zone||'d1').replace('d',''))||1;const idx=(tier*11+(run?.stage||0)*7)%all.length;return all[idx]}"
new="function enemyMonster(run,b){if(Number.isInteger(b?.enemySpecies))return b.enemySpecies;const all=Object.keys(R()?.G?.SPECIES||{});if(!all.length)return null;const tier=Number(String(run?.zone||'d1').replace('d',''))||1;return (tier*11+(run?.stage||0)*7)%all.length}"
assert old in s, 'enemyMonster target not found'
s=s.replace(old,new,1)
old="enemySpec=enemyMonster(run),enemyName="
new="enemySpec=enemyMonster(run,b),enemyName="
assert old in s, 'mount enemySpec target not found'
s=s.replace(old,new,1)
old="function estimateDamage(log){const m=String(log).match(/(?:造成|受到|伤害)\\D*(\\d+)/);return m?Math.max(1,Number(m[1])):null}"
new=old+"\nfunction estimateHpLoss(log){const m=String(log).match(/远征生命\\s*-\\s*(\\d+(?:\\.\\d+)?)%/);return m?Math.max(0,Number(m[1])):null}"
assert old in s, 'estimateDamage target not found'
s=s.replace(old,new,1)
old="if(!miss){allyHp[target]=Math.max(0,allyHp[target]-Math.min(35,dmg/4));el?.querySelector('.rg-bt-hp i')?.style.setProperty('width',allyHp[target]+'%');el?.classList.add('hit');float(box,el,miss?'MISS':'-'+Math.max(1,Math.round(dmg/4)),crit,miss)}else float(box,el,'MISS',false,true);"
new="if(!miss){const hpLoss=estimateHpLoss(line)??Math.min(35,dmg/4);allyHp[target]=Math.max(0,allyHp[target]-hpLoss);el?.querySelector('.rg-bt-hp i')?.style.setProperty('width',allyHp[target]+'%');el?.classList.add('hit');float(box,el,'-'+Math.max(1,Math.round(hpLoss))+'%',crit,miss)}else float(box,el,'MISS',false,true);"
assert old in s, 'enemy live HP target not found'
s=s.replace(old,new,1)
old="if(!miss){const dealt=Math.min(18,share/3);enemyHp=Math.max(0,enemyHp-dealt);enemy?.querySelector('.rg-bt-hp i')?.style.setProperty('width',enemyHp+'%');enemy?.classList.add('hit');float(box,enemy,'-'+Math.max(1,Math.round(dealt)),crit,miss)}else float(box,enemy,'MISS',false,true);"
new="if(!miss){const dealtPct=Math.min(enemyHp,share/Math.max(1,Number(b.enemyMax)||1)*100);enemyHp=Math.max(0,enemyHp-dealtPct);enemy?.querySelector('.rg-bt-hp i')?.style.setProperty('width',enemyHp+'%');enemy?.classList.add('hit');float(box,enemy,'-'+Math.max(1,Math.round(share)),crit,miss)}else float(box,enemy,'MISS',false,true);"
assert old in s, 'ally live enemy HP target not found'
s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')
print('v210b applied')
