from pathlib import Path
import json

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

# Pending transfer state.
marker="function expeditionTransferCost(m){return ({1:1000,2:3000,3:10000,4:25000,5:50000})[Math.max(1,Math.min(5,Number(m?.star)||1))]||1000}\n"
assert marker in s, 'transfer cost marker missing'
s=s.replace(marker, marker+"let pendingTransferId=null;\n", 1)

# Replace native-confirm transfer with direct confirmed action (UI confirmation happens before this call).
old="function transferToExpedition(id){const s=S(),e=ensure(),r=R();if(!s||!e||!r||e.rogueActive)return false;id=Number(id);const idx=(s.monsters||[]).findIndex(m=>m.id===id);if(idx<0)return false;const m=s.monsters[idx],cost=expeditionTransferCost(m);if(r.isDispatched?.(id))return r.tell?.('派遣中的怪物不能转入远征Box。'),false;if((e.box||[]).length>=e.boxCapacity)return r.tell?.('远征Box已满，请先扩建。'),false;if((Number(s.energy)||0)<cost)return r.tell?.(`灵能不足：${stars(m)} 转籍需要 ${cost.toLocaleString()} 灵能。`),false;if(!window.confirm(`将 ${monsterName(m)} #${m.id} 永久转入远征Box？\\n转籍费用：${cost.toLocaleString()} 灵能\\n转入后会离开牧场Box，不能用于牧场配种/派遣；远征属性会应用种族值修正${m.shiny?'，闪光怪额外获得远征基础五维 +5%':''}。`))return false;s.energy-=cost;m.expeditionTrait=expeditionTraitFor(m);m.expeditionTransferredAt=Date.now();s.monsters.splice(idx,1);e.box.push(m);"
new="function transferToExpedition(id){const s=S(),e=ensure(),r=R();if(!s||!e||!r||e.rogueActive)return false;id=Number(id);const idx=(s.monsters||[]).findIndex(m=>m.id===id);if(idx<0)return false;const m=s.monsters[idx],cost=expeditionTransferCost(m);if(r.isDispatched?.(id))return r.tell?.('派遣中的怪物不能转入远征Box。'),false;if((e.box||[]).length>=e.boxCapacity)return r.tell?.('远征Box已满，请先扩建。'),false;if((Number(s.energy)||0)<cost)return r.tell?.(`灵能不足：${stars(m)} 转籍需要 ${cost.toLocaleString()} 灵能。`),false;s.energy-=cost;m.expeditionTrait=expeditionTraitFor(m);m.expeditionTransferredAt=Date.now();s.monsters.splice(idx,1);e.box.push(m);"
assert old in s, 'native confirm transfer function missing'
s=s.replace(old,new,1)

# Modal rendering.
marker="function expeditionBoxHTML(e){"
assert marker in s, 'box html marker missing'
modal=r'''function transferModalHTML(){const s=S(),e=ensure(),id=Number(pendingTransferId);if(!id||!s||!e)return '';const m=(s.monsters||[]).find(x=>Number(x.id)===id);if(!m){pendingTransferId=null;return ''}const esc=window.QinsterPicker.esc,cost=expeditionTransferCost(m),before=ranchStats(m),after=expeditionStats(m),sk=battleSkillFor(m),sp=R()?.G?.SPECIES?.[m.species]||{},fmt=v=>Math.round((Number(v)||0)*10)/10;return `<div class="rg-transfer-overlay" data-rg-transfer-overlay><section class="rg-transfer-modal" role="dialog" aria-modal="true" aria-label="确认转入远征Box"><div class="rg-transfer-head"><div><b>确认转入远征Box</b><small>转籍后将离开牧场Box，无法再用于牧场配种与派遣</small></div><button type="button" class="secondary rg-transfer-x" data-rg-transfer-cancel>×</button></div><div class="rg-transfer-mon">${R()?.sprite?.(m.species,m.tint,m.shiny,m.specialColor)||''}<div><strong>${esc(monsterName(m))} #${m.id} ${stars(m)}${m.shiny?' ✦闪光':''}</strong><small>${esc(sp.name||'未知种族')} · ${esc(m.gender||'')}</small><span class="rg-transfer-cost">转籍费用 <b>${cost.toLocaleString()} 灵能</b></span></div></div><div class="rg-transfer-compare"><div><b>牧场原值</b>${STAT.map((n,i)=>`<span>${n}<strong>${fmt(before[i])}</strong></span>`).join('')}</div><i>→</i><div><b>远征基础值</b>${STAT.map((n,i)=>`<span>${n}<strong>${fmt(after[i])}</strong></span>`).join('')}</div></div><div class="rg-transfer-details"><p><b>种族值</b><span>${esc(raceText(m))}</span></p><p><b>突破技能</b><span>${esc(traitText(m))}</span></p>${m.shiny?'<p class="shiny"><b>闪光加成</b><span>远征基础五维 +5%</span></p>':''}<p><b>战斗技能</b><span>${esc(sk.name)} · ${esc(sk.text||'无额外效果')}</span></p></div><div class="rg-transfer-warning">⚠ 此操作为单向转籍。怪物会从牧场Box移除，但星级、生命、颜色、闪光、家族与技能都会保留。</div><div class="rg-transfer-actions"><button type="button" class="secondary" data-rg-transfer-cancel>取消</button><button type="button" class="primary" data-rg-transfer-confirm="${m.id}">确认转入 · ${cost.toLocaleString()} 灵能</button></div></section></div>`}
'''
s=s.replace(marker,modal+marker,1)

# Append modal to box page.
old="${expeditionTransferPickerHTML(e)}</section>`}"
new="${expeditionTransferPickerHTML(e)}</section>${transferModalHTML()}`}"
assert old in s, 'box modal append marker missing'
s=s.replace(old,new,1)

# Add inline modal CSS to existing injected page through expeditionBoxHTML wrapper once.
old="function expeditionBoxHTML(e){const cost=expeditionBoxExpandCost(e),full=e.boxCapacity>=200;return `"
new="function expeditionBoxHTML(e){const cost=expeditionBoxExpandCost(e),full=e.boxCapacity>=200;return `<style>.rg-transfer-overlay{position:fixed;inset:0;z-index:5000;background:rgba(20,18,28,.76);display:grid;place-items:center;padding:18px}.rg-transfer-modal{width:min(720px,94vw);max-height:90vh;overflow:auto;background:#d9d9df;border:4px solid #272432;box-shadow:8px 8px 0 rgba(0,0,0,.55);padding:14px;color:#171622}.rg-transfer-head{display:flex;justify-content:space-between;gap:12px;align-items:start;border-bottom:3px solid #5a5865;padding-bottom:10px}.rg-transfer-head b{font-size:18px}.rg-transfer-head small{display:block;margin-top:4px}.rg-transfer-x{min-width:38px;font-size:18px}.rg-transfer-mon{display:flex;gap:14px;align-items:center;margin:14px 0;padding:10px;background:#c8c8cf;border:2px solid #777481}.rg-transfer-mon .sprite{flex:0 0 auto}.rg-transfer-mon strong,.rg-transfer-mon small,.rg-transfer-cost{display:block}.rg-transfer-cost{margin-top:7px}.rg-transfer-cost b{color:#7d4b00}.rg-transfer-compare{display:grid;grid-template-columns:1fr 30px 1fr;gap:8px;align-items:center}.rg-transfer-compare>div{border:2px solid #777481;background:#ececf0;padding:8px}.rg-transfer-compare>div>b{display:block;margin-bottom:6px}.rg-transfer-compare span{display:grid;grid-template-columns:1fr auto;border-top:1px solid #bbb;padding:3px 0}.rg-transfer-compare i{text-align:center;font-style:normal;font-size:22px;font-weight:bold}.rg-transfer-details{margin-top:10px;display:grid;gap:6px}.rg-transfer-details p{margin:0;padding:7px;border:2px solid #777481;background:#ececf0}.rg-transfer-details p b{display:inline-block;min-width:74px}.rg-transfer-details p.shiny{background:#fff0b8}.rg-transfer-warning{margin-top:10px;padding:9px;background:#fff3cf;border:2px solid #b07818}.rg-transfer-actions{display:grid;grid-template-columns:1fr 1.4fr;gap:8px;margin-top:12px}.rg-transfer-actions button{min-height:42px}@media(max-width:620px){.rg-transfer-compare{grid-template-columns:1fr}.rg-transfer-compare>i{transform:rotate(90deg)}.rg-transfer-actions{grid-template-columns:1fr}.rg-transfer-modal{padding:10px}}</style>"
assert old in s, 'box style insertion marker missing'
s=s.replace(old,new,1)

# Click flow: open modal instead of transferring immediately, plus cancel/confirm.
old="const tr=ev.target.closest?.('[data-rg-transfer]');if(tr){transferToExpedition(Number(tr.dataset.rgTransfer));return}if(ev.target.closest?.('[data-rg-box-expand]')){expandExpeditionBox();return}"
new="const tr=ev.target.closest?.('[data-rg-transfer]');if(tr){pendingTransferId=Number(tr.dataset.rgTransfer);render();return}if(ev.target.closest?.('[data-rg-transfer-cancel]')||ev.target.matches?.('[data-rg-transfer-overlay]')){pendingTransferId=null;render();return}const trc=ev.target.closest?.('[data-rg-transfer-confirm]');if(trc){const id=Number(trc.dataset.rgTransferConfirm);pendingTransferId=null;transferToExpedition(id);return}if(ev.target.closest?.('[data-rg-box-expand]')){expandExpeditionBox();return}"
assert old in s, 'transfer click handler marker missing'
s=s.replace(old,new,1)

# Escape closes modal before relic popovers.
old="document.addEventListener('keydown',ev=>{const rc=ev.target.closest?.('.rg-relic-chip');"
new="document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&pendingTransferId){pendingTransferId=null;render();return}const rc=ev.target.closest?.('.rg-relic-chip');"
assert old in s, 'keydown marker missing'
s=s.replace(old,new,1)

s=s.replace("version:'v269'","version:'v270'",1)
p.write_text(s,encoding='utf-8')

# Visible/cache/package/test version bump.
g=Path('game.js'); t=g.read_text(encoding='utf-8').replace("__qinsterVersion='v269'","__qinsterVersion='v270'",1); g.write_text(t,encoding='utf-8')
i=Path('index.html'); t=i.read_text(encoding='utf-8').replace('?v=269','?v=270'); i.write_text(t,encoding='utf-8')
pkg=Path('package.json'); data=json.loads(pkg.read_text(encoding='utf-8')); data['version']='270.0.0'; pkg.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
cp=Path('scripts/check-picker.mjs'); ct=cp.read_text(encoding='utf-8').replace("assert.equal(w.__qinsterVersion,'v269')","assert.equal(w.__qinsterVersion,'v270')",1)
# Verify transfer modal actually opens/cancels in integration test.
needle="click(w.document.querySelector('[data-rg-idle-tab=\\\"box\\\"]'));assert.match(w.document.querySelector('#expedition-content').textContent,/远征Box/);"
repl=needle+"const transferBtn=w.document.querySelector('[data-rg-transfer]:not(:disabled)');if(transferBtn){click(transferBtn);assert.ok(w.document.querySelector('[data-rg-transfer-overlay]'));assert.match(w.document.querySelector('[data-rg-transfer-overlay]').textContent,/确认转入远征Box/);click(w.document.querySelector('[data-rg-transfer-cancel]'));assert.equal(w.document.querySelector('[data-rg-transfer-overlay]'),null);}"
assert needle in ct, 'picker box test marker missing'
ct=ct.replace(needle,repl,1); cp.write_text(ct,encoding='utf-8')
print('v270 custom expedition transfer modal applied')
