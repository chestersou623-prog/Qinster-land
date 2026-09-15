from pathlib import Path
import re

root = Path('.')
exp = root / 'v199-roguelike-expedition.js'
text = exp.read_text(encoding='utf-8')

pattern = re.compile(r"function applyExpeditionLifeCost\(run,cleared\)\{.*?\}\nfunction finish\(run,cleared=false,defeated=false,choice=''\)\{", re.S)
replacement = r'''function applyExpeditionLifeCost(run,cleared,defeated=false){
  const s=S();if(!s)return[];
  const byId=new Map((s.monsters||[]).map(m=>[m.id,m])),notes=[],deadIds=[];
  if(cleared){
    for(const id of run.teamIds||[]){
      const m=byId.get(id);if(!m||Number(m.life)<=0)continue;
      m.life=Math.max(0,(Number(m.life)||0)-1);
      run.lifeLoss=run.lifeLoss||{};run.lifeLoss[id]=(run.lifeLoss[id]||0)+1;
      if(m.life<=0){deadIds.push(id);notes.push(`${monsterName(m)} 完成远征后生命归0，怪物死亡，已从Box移除`)}
      else notes.push(`${monsterName(m)} 完成远征 -1生命（剩 ${m.life}）`);
    }
  }
  for(const id of run.teamIds||[]){
    const m=byId.get(id);if(!m)continue;
    const alreadyDead=!!run.permaDead?.[id]||Number(m.life)<=0;
    const failedKnockout=!!defeated&&hpPct(run,id)<=0;
    if((alreadyDead||failedKnockout)&&!deadIds.includes(id)){
      m.life=0;deadIds.push(id);
      notes.push(`${monsterName(m)} ${failedKnockout?'远征失败阵亡':'生命归0死亡'}，已从Box移除`);
    }
  }
  if(deadIds.length){
    const dead=new Set(deadIds.map(Number));
    s.monsters=(s.monsters||[]).filter(m=>!dead.has(Number(m.id)));
    if(Array.isArray(s.expedition?.lastTeamIds))s.expedition.lastTeamIds=s.expedition.lastTeamIds.filter(id=>!dead.has(Number(id)));
    selected=selected.filter(id=>!dead.has(Number(id)));
  }
  for(const id of run.teamIds||[]){
    if(deadIds.includes(id))continue;
    const m=byId.get(id),lost=Number(run.lifeLoss?.[id])||0;
    if(lost>0&&!notes.some(x=>m&&x.startsWith(monsterName(m))))notes.push(`${m?monsterName(m):'怪物'} 本次远征累计 -${lost}生命`);
  }
  return notes;
}
function finish(run,cleared=false,defeated=false,choice=''){'''
new_text, n = pattern.subn(replacement, text, count=1)
if n != 1:
    raise SystemExit(f'applyExpeditionLifeCost replacement count={n}')
new_text = new_text.replace('const lifeNotes=applyExpeditionLifeCost(run,cleared),score=', 'const lifeNotes=applyExpeditionLifeCost(run,cleared,defeated),score=', 1)
if 'applyExpeditionLifeCost(run,cleared,defeated)' not in new_text:
    raise SystemExit('finish call was not updated')
exp.write_text(new_text, encoding='utf-8')

# Visible/cache version bump.
for name in ['game.js','index.html','v199-roguelike-expedition.js','v201-battle-theater.js']:
    p=root/name
    if not p.exists():
        continue
    s=p.read_text(encoding='utf-8')
    s=s.replace('v254','v255')
    s=s.replace('?v=254','?v=255')
    p.write_text(s,encoding='utf-8')
