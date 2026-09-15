from pathlib import Path

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

start=s.find('function trainingHTML(run){')
end=s.find('function campHTML(run)', start)
if start < 0 or end < 0:
    raise SystemExit('trainingHTML bounds not found')

new=r'''function trainingHTML(run){
  const choices=run.trainingChoices||[],gain=Math.round(trainingGainMultiplier(run)*100),extra=Math.max(0,trainingChoiceCount(run)-3);
  const fmtStat=v=>{const n=Math.round((Number(v)||0)*10)/10;return Number.isInteger(n)?String(n):n.toFixed(1)};
  return `${runHeader(run)}${runInventoryHTML(run)}${teamHTML(run)}<section class="rg-panel rg-training-panel"><div class="rg-title"><div><b>▲ 训练营</b><small>选择1项；训练强化只在本次远征永久生效</small></div><span>${choices.length}选1 · 当前训练效率 ${gain}%${extra?' · 额外候选 +'+extra:''}</span></div><div class="rg-event-picks rg-training-picks">${choices.map((c,i)=>{const m=persistentMonster(c.monsterId);let current=0,after=0;if(m){const trained=trainedBaseStats(m,run),base=st(m);current=Number(trained[c.stat])||0;after=c.kind==='pct'?current+(Number(base[c.stat])||0)*(Number(c.value)||0)/100:current+(Number(c.value)||0)}const adjusted=Math.abs(c.value-c.raw)>.01;return `<button class="secondary rg-training-choice" data-rg-training-choice="${i}"><span class="rg-training-sprite">${m?(R()?.sprite?.(m.species,m.tint,m.shiny,m.specialColor)||''):''}</span><span class="rg-training-copy"><b>${c.monsterName}</b><small>#${c.monsterId} · ${STAT[c.stat]}</small><strong>+${c.value}${c.kind==='pct'?'%':''}</strong><em class="rg-training-result">${STAT[c.stat]} ${fmtStat(current)} → <b>${fmtStat(after)}</b></em>${adjusted?`<small class="rg-training-roll">训练抽取 ${c.raw}${c.kind==='pct'?'%':''} · 效率修正后 +${c.value}${c.kind==='pct'?'%':''}</small>`:''}</span></button>`}).join('')}</div><p class="rg-note">基础训练范围：百分比 +1%～5%，固定值 +1～20。绿色箭头显示选择后该能力的实际数值；教官徽章提高候选数与训练量，倦怠会降低训练量。</p></section>`;
}
'''
s=s[:start]+new+s[end:]

# Add styling for the actual before/after stat result without disturbing v233 card layout.
needle='.rg-training-copy strong{'
pos=s.find(needle)
if pos>=0:
    close=s.find('}',pos)+1
    css='.rg-training-result{display:block;margin-top:5px;padding:4px 6px;background:#eef2e9;border:1px solid #899781;color:#30382d;font-style:normal;font-size:10px}.rg-training-result b{display:inline!important;color:#2f6d3d!important;font-size:12px}.rg-training-roll{display:block!important;margin-top:3px!important;color:#6b6258!important;font-size:8px!important}'
    s=s[:close]+css+s[close:]
else:
    marker='.rg-event-picks{'
    pos=s.find(marker)
    if pos<0: raise SystemExit('CSS insertion target not found')
    css='.rg-training-result{display:block;margin-top:5px;padding:4px 6px;background:#eef2e9;border:1px solid #899781;color:#30382d;font-style:normal;font-size:10px}.rg-training-result b{display:inline!important;color:#2f6d3d!important;font-size:12px}.rg-training-roll{display:block!important;margin-top:3px!important;color:#6b6258!important;font-size:8px!important}'
    s=s[:pos]+css+s[pos:]

for oldv in ["version:'v234-training-final-stat-preview'","version:'v233-training-node-ui'","version:'v232-event-odds-rewards'"]:
    s=s.replace(oldv,"version:'v235-training-result-stat'")

p.write_text(s,encoding='utf-8')

for fp in ['game.js','index.html']:
    q=Path(fp);t=q.read_text(encoding='utf-8');t=t.replace('v234','v235').replace('v233','v235');q.write_text(t,encoding='utf-8')

print('v235 training actual post-training stat preview applied')
