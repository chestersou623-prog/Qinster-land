from pathlib import Path

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

anchor="function enemyPreview(run,kind){"
if anchor not in s:
    raise SystemExit('enemyPreview anchor not found')

helper=r'''function finalStatBreakdown(m,pos,run){
  const base=st(m),final=combatValue(m,pos,run),mods=combatMods(run),sh=m.shiny?(mods.shiny||0):0;
  const labels=['体质','攻击','防御','速度','幸运'];
  const keys=['con','atk','def','spd','luck'];
  const vals=[final.con,final.atk,final.def,final.spd,final.luck];
  return labels.map((label,i)=>{
    const b=Number(base[i])||0,f=Math.round((Number(vals[i])||0)*10)/10,delta=f-b;
    let cls='same';if(delta>.05)cls='up';else if(delta<-.05)cls='down';
    const detail=[];
    detail.push('原始：'+Math.round(b*10)/10);
    if(i>0){
      const k=keys[i],global=(Number(mods[k])||0)+(m.shiny?sh:0);
      if(Math.abs(global)>.0001)detail.push('综合状态：'+(global>0?'+':'')+Math.round(global*1000)/10+'%');
      if(pos===0){const v=k==='def'?(mods.frontDef||0):k==='atk'?(mods.frontAtk||0):0;if(v)detail.push('前卫站位：'+(v>0?'+':'')+Math.round(v*1000)/10+'%');}
      if(pos===2){const v=k==='atk'?(mods.backAtk||0):k==='def'?(mods.backDef||0):0;if(v)detail.push('后卫站位：'+(v>0?'+':'')+Math.round(v*1000)/10+'%');}
    }
    if(m.shiny&&i>0&&['攻击','幸运'].includes(label)&&(mods.shiny||0))detail.push('闪光加成：+'+Math.round((mods.shiny||0)*1000)/10+'%');
    const relicNames=(run.relics||[]).map(id=>RELICS.find(x=>x.id===id)?.name).filter(Boolean);
    if(relicNames.length)detail.push('遗物：'+relicNames.join('、'));
    if((run.curses||[]).length)detail.push('Debuff：'+(run.curses||[]).map(id=>CURSES.find(x=>x.id===id)?.name||id).join('、'));
    detail.push('最终：'+f);
    return {label,base:b,final:f,delta,cls,detail};
  });
}
function finalStatsHTML(m,pos,run){
  return '<div class="rg-final-stats">'+finalStatBreakdown(m,pos,run).map((x,i)=>'<button type="button" class="rg-final-stat '+x.cls+'" data-rg-stat-toggle><span>'+x.label+'</span><b>'+x.final+'</b><small>原始 '+Math.round(x.base*10)/10+'</small><em>'+x.detail.map((t,j)=>'<i class="'+(j===x.detail.length-1?'total':t.includes('Debuff')||t.includes('-')?'neg':t.includes('+')?'pos':'')+'">'+t+'</i>').join('')+'</em></button>').join('')+'</div>';
}
function decorateFinalStats(run){
  if(!run)return;
  if(!document.getElementById('rg-final-stat-style')){
    const stl=document.createElement('style');stl.id='rg-final-stat-style';stl.textContent=`.rg-final-stats{display:grid;grid-template-columns:repeat(5,minmax(52px,1fr));gap:4px;margin-top:7px}.rg-final-stat{position:relative;background:#242832;border:1px solid #555d6c;color:#e9edf3;padding:5px 3px;text-align:center;box-shadow:none!important;transform:none!important}.rg-final-stat span{display:block;font-size:9px;opacity:.72}.rg-final-stat b{display:block;font-size:15px;line-height:1.15}.rg-final-stat small{display:block;font-size:8px;opacity:.62}.rg-final-stat.up b{color:#64d887}.rg-final-stat.down b{color:#ff7070}.rg-final-stat em{display:none;position:absolute;z-index:80;left:50%;top:calc(100% + 5px);transform:translateX(-50%);width:210px;background:#171a21;border:2px solid #626b7c;padding:7px;text-align:left;font-style:normal;box-shadow:3px 3px 0 #000}.rg-final-stat:hover em,.rg-final-stat.open em{display:grid;gap:3px}.rg-final-stat em i{font-style:normal;font-size:10px;color:#ddd}.rg-final-stat em i.pos{color:#64d887}.rg-final-stat em i.neg{color:#ff7070}.rg-final-stat em i.total{margin-top:3px;padding-top:4px;border-top:1px solid #596171;color:#fff;font-weight:700}@media(max-width:700px){.rg-final-stats{grid-template-columns:repeat(5,minmax(46px,1fr))}.rg-final-stat em{position:fixed;left:12px;right:12px;top:auto;bottom:14px;transform:none;width:auto;z-index:9999}}`;
    document.head.appendChild(stl);
  }
  const cards=[...document.querySelectorAll('#expedition-content .rg-team .rg-mon')];
  const teamNow=activeTeam(run);
  if(cards.length===teamNow.length){
    cards.forEach((card,visualIndex)=>{
      if(card.querySelector('.rg-final-stats'))return;
      const pos=teamNow.length-1-visualIndex,m=teamNow[pos];if(m)card.insertAdjacentHTML('beforeend',finalStatsHTML(m,pos,run));
    });
  }
}
'''
if 'function finalStatBreakdown(' not in s:
    s=s.replace(anchor,helper+anchor,1)

old="function render(){injectStyle();const box=document.getElementById('expedition-content');if(!box)return;const e=ensure();if(!e)return;box.innerHTML=e.rogueActive?`<div class=\"rogue\">${activeHTML(e.rogueActive)}</div>`:idleHTML(e)}"
new="function render(){injectStyle();const box=document.getElementById('expedition-content');if(!box)return;const e=ensure();if(!e)return;box.innerHTML=e.rogueActive?`<div class=\"rogue\">${activeHTML(e.rogueActive)}</div>`:idleHTML(e);if(e.rogueActive)decorateFinalStats(e.rogueActive)}"
if old not in s:
    raise SystemExit('render target not found')
s=s.replace(old,new,1)

click_anchor="document.addEventListener('click',ev=>{"
click_insert="document.addEventListener('click',ev=>{const stat=ev.target.closest?.('[data-rg-stat-toggle]');if(stat){ev.preventDefault();ev.stopPropagation();document.querySelectorAll('.rg-final-stat.open').forEach(x=>{if(x!==stat)x.classList.remove('open')});stat.classList.toggle('open');return;}"
if click_anchor not in s:
    raise SystemExit('click handler anchor not found')
s=s.replace(click_anchor,click_insert,1)

s=s.replace("version:'v220b-fix-boss-loop'","version:'v222-final-stat-breakdown'",1)
p.write_text(s,encoding='utf-8')
print('v222 final stat breakdown patch applied')
