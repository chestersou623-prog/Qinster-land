from pathlib import Path

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

old_training="""function trainingHTML(run){
  const choices=run.trainingChoices||[],gain=Math.round(trainingGainMultiplier(run)*100),extra=Math.max(0,trainingChoiceCount(run)-3);
  return `${runHeader(run)}${runInventoryHTML(run)}${teamHTML(run)}<section class=\"rg-panel\"><div class=\"rg-title\"><div><b>▲ 训练营</b><small>选择1项；训练强化只在本次远征永久生效</small></div><span>${choices.length}选1 · 当前训练效率 ${gain}%${extra?' · 额外候选 +'+extra:''}</span></div><div class=\"rg-event-picks\">${choices.map((c,i)=>`<button class=\"secondary\" data-rg-training-choice=\"${i}\"><b>${c.monsterName}</b><small>${STAT[c.stat]} +${c.value}${c.kind==='pct'?'%':''}${Math.abs(c.value-c.raw)>.01?` · 基础 ${c.raw}${c.kind==='pct'?'%':''}`:''}</small></button>`).join('')}</div><p class=\"rg-note\">基础训练范围：百分比 +1%～5%，固定值 +1～20。教官徽章提高候选数与训练量；倦怠会降低训练量。</p></section>`;
}
"""
new_training="""function trainingHTML(run){
  const choices=run.trainingChoices||[],gain=Math.round(trainingGainMultiplier(run)*100),extra=Math.max(0,trainingChoiceCount(run)-3);
  return `${runHeader(run)}${runInventoryHTML(run)}${teamHTML(run)}<section class=\"rg-panel rg-training-panel\"><div class=\"rg-title\"><div><b>▲ 训练营</b><small>选择1项；训练强化只在本次远征永久生效</small></div><span>${choices.length}选1 · 当前训练效率 ${gain}%${extra?' · 额外候选 +'+extra:''}</span></div><div class=\"rg-event-picks rg-training-picks\">${choices.map((c,i)=>{const m=persistentMonster(c.monsterId);return `<button class=\"secondary rg-training-choice\" data-rg-training-choice=\"${i}\"><span class=\"rg-training-sprite\">${m?(R()?.sprite?.(m.species,m.tint,m.shiny,m.specialColor)||''):''}</span><span class=\"rg-training-copy\"><b>${c.monsterName}</b><small>#${c.monsterId} · ${STAT[c.stat]}</small><strong>+${c.value}${c.kind==='pct'?'%':''}</strong>${Math.abs(c.value-c.raw)>.01?`<em>基础 ${c.raw}${c.kind==='pct'?'%':''} → 最终 ${c.value}${c.kind==='pct'?'%':''}</em>`:''}</span></button>`}).join('')}</div><p class=\"rg-note\">基础训练范围：百分比 +1%～5%，固定值 +1～20。教官徽章提高候选数与训练量；倦怠会降低训练量。</p></section>`;
}
"""
if old_training not in s:
    raise SystemExit('trainingHTML target not found')
s=s.replace(old_training,new_training,1)

old_node="function nodeHTML(run){return `<section class=\"rg-panel\"><div class=\"rg-title\"><div><b>选择下一条路线</b><small>共27层；第9、18、27层固定为大BOSS</small></div><span>第 ${run.stage+1}/27 层</span></div><div class=\"rg-nodes\">${run.options.map((o,i)=>{const m=NODE_META[o.type];return `<button class=\"rg-node\" data-rg-node=\"${i}\"><strong>${m[0]}</strong><b>${m[1]}</b><small>${m[2]}</small></button>`}).join('')}</div></section>`}"
new_node="function nodeHTML(run){return `<section class=\"rg-panel rg-route-choice-panel\"><div class=\"rg-title\"><div><b>选择下一条路线</b><small>共27层；第9、18、27层固定为大BOSS</small></div><span>第 ${run.stage+1}/27 层</span></div><div class=\"rg-nodes\">${run.options.map((o,i)=>{const m=NODE_META[o.type];return `<button class=\"rg-node rg-node-${o.type}\" data-rg-kind=\"${o.type}\" data-rg-node=\"${i}\"><span class=\"rg-node-icon\">${m[0]}</span><span class=\"rg-node-copy\"><b>${m[1]}</b><small>${m[2]}</small></span><span class=\"rg-node-arrow\">›</span></button>`}).join('')}</div></section>`}"
if old_node not in s:
    raise SystemExit('nodeHTML target not found')
s=s.replace(old_node,new_node,1)

needle='.rg-node{min-height:116px;text-align:left;padding:12px;border:3px solid #6b6671;background:#d9d8dc}.rg-node strong{font-size:22px;display:block}.rg-node b{display:block;margin:5px 0}.rg-node small{font-size:9px}'
css='.rg-node{position:relative;min-height:106px;text-align:left;padding:12px 38px 12px 12px;border:3px solid #5d5964;background:linear-gradient(135deg,#e4e2e7,#c8c5ce);overflow:hidden;display:grid;grid-template-columns:48px 1fr;gap:10px;align-items:center;transition:transform .12s ease,filter .12s ease}.rg-node:hover{filter:brightness(1.05);transform:translateY(-1px)}.rg-node-icon{width:46px;height:46px;display:grid;place-items:center;font-size:25px;font-weight:900;background:#2d2a33;color:#fff4bd;border:2px solid #77727f;box-shadow:2px 2px 0 #3f3b45}.rg-node-copy b{display:block;margin:0 0 5px;font-size:14px}.rg-node-copy small{font-size:9px;line-height:1.45}.rg-node-arrow{position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:28px;font-weight:900;opacity:.55}.rg-node-battle{border-left:7px solid #b33c35;background:linear-gradient(135deg,#ead8d6,#c9b7b7)}.rg-node-elite{border-left:7px solid #6b2d71;background:linear-gradient(135deg,#e5d8e8,#c5b5ca)}.rg-node-treasure{border-left:7px solid #c5962d;background:linear-gradient(135deg,#eee2bd,#cfc19c)}.rg-node-training{border-left:7px solid #3f7a68;background:linear-gradient(135deg,#d7e8e1,#b7cfc6)}.rg-node-rest{border-left:7px solid #5a7e4c;background:linear-gradient(135deg,#dce9d6,#bccdb4)}.rg-node-challenge{border-left:7px solid #4c668f;background:linear-gradient(135deg,#d9e0eb,#b9c3d2)}.rg-node-temple{border-left:7px solid #8a6840;background:linear-gradient(135deg,#e8dfd1,#c8bba8)}.rg-node-boss{border-left:7px solid #9b2520;background:linear-gradient(135deg,#ead1cf,#c8a6a4);box-shadow:inset 0 0 0 2px #9b2520}.rg-node-boss .rg-node-icon{background:#7f211d;color:#ffe49a}.rg-training-panel{background:linear-gradient(180deg,#cbcbd0,#bebfc3)}.rg-training-picks{align-items:stretch}.rg-training-choice{min-height:96px;display:grid;grid-template-columns:72px 1fr;gap:10px;align-items:center;text-align:left;padding:8px 10px;background:linear-gradient(135deg,#e0e1df,#c7cbc6);border:3px solid #697068}.rg-training-choice:hover{background:linear-gradient(135deg,#e8eee7,#cbd7cd)}.rg-training-sprite{display:grid;place-items:center;min-height:72px;background:#bfc8bd;border:2px solid #747a72}.rg-training-sprite .sprite{width:62px!important;margin:auto}.rg-training-copy{display:grid;gap:3px;min-width:0}.rg-training-copy b{font-size:12px}.rg-training-copy small{font-size:9px;color:#555}.rg-training-copy strong{font-size:18px;color:#2f6d3d}.rg-training-copy em{font-style:normal;font-size:8px;color:#6d6252}@media(max-width:760px){.rg-node{grid-template-columns:42px 1fr;min-height:88px}.rg-node-icon{width:40px;height:40px;font-size:21px}.rg-training-choice{grid-template-columns:62px 1fr}.rg-training-sprite{min-height:62px}.rg-training-sprite .sprite{width:54px!important}}'
if needle not in s:
    raise SystemExit('node CSS target not found')
s=s.replace(needle,css,1)

s=s.replace("version:'v232-event-odds-rewards'","version:'v233-training-node-ui'")
p.write_text(s,encoding='utf-8')

for fp in ['game.js','index.html']:
    q=Path(fp);t=q.read_text(encoding='utf-8');t=t.replace('v232','v233');q.write_text(t,encoding='utf-8')

print('v233 training sprites and route-node visual polish applied')
