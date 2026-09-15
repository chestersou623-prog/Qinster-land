from pathlib import Path

p = Path('v199-roguelike-expedition.js')
s = p.read_text(encoding='utf-8')

# Add a persistent route attrition curse.
old_curses = """const CURSES=[
{id:'weaken',name:'虚弱',text:'攻击 -15%',mods:{atk:-.15}},
{id:'breakArmor',name:'破甲',text:'防御 -15%',mods:{def:-.15}},
{id:'slow',name:'迟缓',text:'速度 -18%',mods:{spd:-.18}},
{id:'badLuck',name:'厄运',text:'幸运 -20%',mods:{luck:-.20}}
];"""
new_curses = """const CURSES=[
{id:'weaken',name:'虚弱',text:'攻击 -15%',mods:{atk:-.15}},
{id:'breakArmor',name:'破甲',text:'防御 -15%',mods:{def:-.15}},
{id:'slow',name:'迟缓',text:'速度 -18%',mods:{spd:-.18}},
{id:'badLuck',name:'厄运',text:'幸运 -20%',mods:{luck:-.20}},
{id:'routeErosion',name:'侵蚀',text:'每前进到一个新地点，全队仍站立成员失去最大远征HP的 2%（地图伤害最低保留 1% HP）',mods:{}}
];"""
if old_curses not in s:
    raise SystemExit('CURSES target not found')
s = s.replace(old_curses, new_curses, 1)

# Route attrition is applied only when a node is completed and the run advances.
old_advance = "function advance(run){run.stage++;run.challenge=null;run.options=makeOptions(run.stage);run.phase='map';if(run.supply<=0){run.log.push('补给耗尽：之后的挑战失败会更危险。')}save()}"
new_advance = """function applyRouteDebuffs(run){
  ensureRunMeta(run);
  if(!(run.curses||[]).includes('routeErosion'))return;
  const affected=[];
  for(const id of run.teamIds||[]){
    if(hpPct(run,id)<=0||!canReviveInRun(run,id))continue;
    const before=hpPct(run,id),after=Math.max(1,before-2);
    run.hp[id]=after;
    if(after<before){const m=persistentMonster(id);affected.push((m?monsterName(m):'#'+id)+' '+Math.round(before)+'%→'+Math.round(after)+'%');}
  }
  if(affected.length)run.log.push('侵蚀：抵达新地点，全队最大远征HP -2% · '+affected.join('、')+'。');
}
function advance(run){applyRouteDebuffs(run);run.stage++;run.challenge=null;run.options=makeOptions(run.stage);run.phase='map';if(run.supply<=0){run.log.push('补给耗尽：之后的挑战失败会更危险。')}save()}"""
if old_advance not in s:
    raise SystemExit('advance target not found')
s = s.replace(old_advance, new_advance, 1)

# Update exported version marker if present.
s = s.replace("version:'v222-final-stat-breakdown'", "version:'v223-route-erosion'", 1)

p.write_text(s, encoding='utf-8')
print('v223 route erosion debuff patch applied')
