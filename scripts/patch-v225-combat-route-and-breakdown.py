from pathlib import Path

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

# 1) Make combat the dominant route choice while keeping utility nodes rare.
start=s.find('function makeOptions(stage){')
end=s.find('function injectStyle(){', start)
if start<0 or end<0:
    raise SystemExit('makeOptions bounds not found')
new_make=r'''function weightedUtilityNode(exclude=[]){
  const pool=[
    ['challenge',24],['treasure',20],['elite',18],['rest',7],['temple',5]
  ].filter(([type])=>!exclude.includes(type));
  const total=pool.reduce((a,[,w])=>a+w,0),roll=Math.random()*total;
  let acc=0;for(const [type,w] of pool){acc+=w;if(roll<=acc)return type}return pool[0]?.[0]||'challenge';
}
function makeOptions(stage){
  if([8,17,26].includes(stage))return[{type:'boss'}];
  const local=stage%9,n=local>=5?3:2;
  const out=['battle'];
  // Late in each chapter, make elite combat a common additional route.
  if(local>=6&&n>=3)out.push('elite');
  while(out.length<n){
    const t=weightedUtilityNode(out);
    if(t&&!out.includes(t))out.push(t);
  }
  return shuffle(out).map(type=>({type,id:Math.random().toString(36).slice(2,8)}));
}
'''
s=s[:start]+new_make+s[end:]

# 2) Replace stat breakdown with source-by-source contributions.
start=s.find('function finalStatBreakdown(m,pos,run){')
end=s.find('function finalStatsHTML(m,pos,run){', start)
if start<0 or end<0:
    raise SystemExit('finalStatBreakdown bounds not found')
new_break=r'''function finalStatBreakdown(m,pos,run){
  const base=st(m),final=combatValue(m,pos,run),mods=combatMods(run);
  const labels=['体质','攻击','防御','速度','幸运'];
  const keys=['con','atk','def','spd','luck'];
  const vals=[final.con,final.atk,final.def,final.spd,final.luck];
  const signedPct=v=>(v>0?'+':'')+(Math.round(v*1000)/10)+'%';
  const relicContribution=k=>{
    let v=0,names=[];
    for(const id of run.relics||[]){const r=RELICS.find(x=>x.id===id),x=Number(r?.mods?.[k]||0);if(x){v+=x;names.push(r.name)}}
    return {v,names};
  };
  const curseContribution=k=>{
    let v=0,names=[];
    for(const id of run.curses||[]){const c=CURSES.find(x=>x.id===id),x=Number(c?.mods?.[k]||0);if(x){v+=x;names.push(c.name)}}
    return {v,names};
  };
  return labels.map((label,i)=>{
    const b=Number(base[i])||0,f=Math.round((Number(vals[i])||0)*10)/10,delta=f-b;
    let cls='same';if(delta>.05)cls='up';else if(delta<-.05)cls='down';
    const detail=['原始：'+Math.round(b*10)/10];
    if(i>0){
      const k=keys[i],rel=relicContribution(k),tem=Number(run.templeMods?.[k]||0),tmp=Number(run.nextBattleMods?.[k]||0),cur=curseContribution(k);
      if(rel.v)detail.push('遗物'+(rel.names.length?'（'+rel.names.join('、')+'）':'')+'：'+signedPct(rel.v));
      if(tem)detail.push('神庙祝福：'+signedPct(tem));
      if(tmp)detail.push('临时增益：'+signedPct(tmp));
      if(cur.v)detail.push('Debuff'+(cur.names.length?'（'+cur.names.join('、')+'）':'')+'：'+signedPct(cur.v));
      if(m.shiny&&(k==='atk'||k==='luck')&&(mods.shiny||0))detail.push('闪光加成：'+signedPct(Number(mods.shiny)||0));
      if(pos===0){const v=k==='def'?(mods.frontDef||0):k==='atk'?(mods.frontAtk||0):0;if(v)detail.push('前卫站位：'+signedPct(v));}
      if(pos===2){const v=k==='atk'?(mods.backAtk||0):k==='def'?(mods.backDef||0):0;if(v)detail.push('后卫站位：'+signedPct(v));}
      const net=b?((f/b)-1):0;if(Math.abs(net)>.0001)detail.push('最终净变化：'+signedPct(net));
    }
    detail.push('最终：'+f);
    return {label,base:b,final:f,delta,cls,detail};
  });
}
'''
s=s[:start]+new_break+s[end:]

# Improve tooltip color classification for explicit negative/positive lines.
s=s.replace("t.includes('Debuff')||t.includes('-')?'neg':t.includes('+')?'pos':''", "(t.includes('：-')||t.includes('Debuff'))?'neg':t.includes('：+')?'pos':''")

s=s.replace("version:'v224c-smooth-floor-scaling'","version:'v225-combat-route-breakdown'")
s=s.replace("version:'v224b-fixed-expedition'","version:'v225-combat-route-breakdown'")
s=s.replace("version:'v224-adaptive-expedition'","version:'v225-combat-route-breakdown'")

p.write_text(s,encoding='utf-8')
print('v225 combat-heavy routes and detailed breakdown applied')
