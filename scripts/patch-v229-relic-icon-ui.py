from pathlib import Path

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

# Helpers for iconized, stacked relic display.
marker='function relicHTML(run){'
pos=s.find(marker)
if pos<0: raise SystemExit('relicHTML marker not found')
helpers=r'''function relicCounts(run){
  const m={};for(const id of run.relics||[])m[id]=(m[id]||0)+1;return m;
}
function relicIconHTML(id,count=1,small=false){
  const i=Math.max(0,RELICS.findIndex(x=>x.id===id)),x=-(i%7)*64,y=-Math.floor(i/7)*64,r=RELICS[i]||{name:id,text:''};
  return `<span class="rg-relic-chip ${small?'small':''}" tabindex="0"><i class="rg-relic-icon" style="background-position:${x}px ${y}px"></i>${count>1?`<b class="rg-relic-count">x${count}</b>`:''}<em><strong>${r.name}${count>1?' x'+count:''}</strong><span>${r.text}</span>${count>1?`<small>当前持有 ${count} 个；可叠加的数值效果已经按数量累计。</small>`:''}</em></span>`;
}
function relicTrayHTML(run){
  const c=relicCounts(run),ids=Object.keys(c);return ids.length?`<div class="rg-relic-tray">${ids.map(id=>relicIconHTML(id,c[id],true)).join('')}</div>`:'<p class="rg-note">暂时没有遗物</p>';
}
'''
s=s[:pos]+helpers+s[pos:]

# Replace plain relic selection UI with icon cards and stack-aware owned tray.
start=s.find('function relicHTML(run){')
end=s.find('function finalHTML(run){',start)
if start<0 or end<0: raise SystemExit('relicHTML bounds not found')
new=r'''function relicHTML(run){const counts=relicCounts(run);return `${runHeader(run)}${runInventoryHTML(run)}${teamHTML(run)}<section class="rg-panel"><div class="rg-title"><div><b>遗物三选一</b><small>重复遗物会叠加，并在图标右上角显示 x2 / x3</small></div></div>${relicTrayHTML(run)}<div class="rg-relics" style="margin-top:10px">${run.relicChoices.map(id=>{const r=RELICS.find(x=>x.id===id),n=(counts[id]||0)+1;return `<button class="secondary rg-relic rg-relic-card" data-rg-relic="${id}">${relicIconHTML(id,n,false)}<b>${r.name}${counts[id]?` · 获得后 x${n}`:''}</b><span>${r.text}</span></button>`}).join('')}</div></section>`}
'''
s=s[:start]+new+s[end:]

# Replace plain relic list in map log details with the icon tray.
old="<details class=\"rg-panel\"><summary>本局遗物与记录</summary><p>${(run.relics||[]).map(id=>RELICS.find(x=>x.id===id)?.name).filter(Boolean).join(' · ')||'暂时没有遗物'}</p><div class=\"rg-log\">"
new="<details class=\"rg-panel\"><summary>本局遗物与记录</summary>${relicTrayHTML(run)}<div class=\"rg-log\">"
if old not in s: raise SystemExit('activeHTML relic list target not found')
s=s.replace(old,new,1)

# Show grouped relic count in top status.
s=s.replace("<span>遗物 ${(run.relics||[]).length}</span>", "<span>遗物 ${(run.relics||[]).length} · 种类 ${Object.keys(relicCounts(run)).length}</span>",1)

# Add sprite/icon styles to existing injected style block.
needle='.rg-relic b{display:block;color:#8d2d28;margin-bottom:4px}'
repl=needle+'''.rg-relic-tray{display:flex;gap:7px;flex-wrap:wrap;margin:8px 0}.rg-relic-chip{position:relative;display:inline-grid;place-items:center;width:64px;height:64px;background:#20232b;border:2px solid #77727f;box-shadow:2px 2px 0 #4e4a54;image-rendering:pixelated}.rg-relic-chip.small{width:54px;height:54px}.rg-relic-icon{display:block;width:64px;height:64px;background-image:url('assets/relic-icons-v229.webp');background-size:448px 256px;background-repeat:no-repeat;image-rendering:pixelated}.rg-relic-chip.small .rg-relic-icon{transform:scale(.82)}.rg-relic-count{position:absolute;right:-5px;top:-6px;background:#f2c451!important;color:#211e25!important;border:2px solid #514d57;padding:1px 4px!important;font-size:9px!important;z-index:3}.rg-relic-chip em{display:none;position:absolute;z-index:120;left:50%;top:calc(100% + 7px);transform:translateX(-50%);width:230px;background:#171a21;color:#eee;border:2px solid #686270;padding:8px;text-align:left;font-style:normal;box-shadow:3px 3px 0 #000}.rg-relic-chip:hover em,.rg-relic-chip:focus em,.rg-relic-chip.open em{display:grid;gap:4px}.rg-relic-chip em strong{color:#f2c451}.rg-relic-chip em span,.rg-relic-chip em small{font-size:9px;line-height:1.5}.rg-relic-card{display:grid;grid-template-columns:70px 1fr;grid-template-rows:auto auto;column-gap:8px;align-items:center}.rg-relic-card>.rg-relic-chip{grid-row:1/3}.rg-relic-card>b,.rg-relic-card>span{text-align:left}.rg-relic-card .rg-relic-chip em{pointer-events:none}@media(max-width:760px){.rg-relic-chip em{position:fixed;left:12px;right:12px;bottom:14px;top:auto;transform:none;width:auto;z-index:9999}.rg-relic-card{grid-template-columns:64px 1fr}}'''
if needle not in s: raise SystemExit('relic CSS target not found')
s=s.replace(needle,repl,1)

# Mobile tap support for owned relic tooltips.
needle="const stat=ev.target.closest?.('[data-rg-stat-toggle]');"
repl="const rc=ev.target.closest?.('.rg-relic-chip');if(rc&&!ev.target.closest?.('[data-rg-relic]')){ev.preventDefault();ev.stopPropagation();document.querySelectorAll('.rg-relic-chip.open').forEach(x=>{if(x!==rc)x.classList.remove('open')});rc.classList.toggle('open');return;}const stat=ev.target.closest?.('[data-rg-stat-toggle]');"
if needle not in s: raise SystemExit('click handler relic tooltip target not found')
s=s.replace(needle,repl,1)

for old in ["version:'v228-random-buff-debuff-risk-relics'","version:'v227-relic-temple-randomness'"]:
    s=s.replace(old,"version:'v229-relic-icon-ui'")

p.write_text(s,encoding='utf-8')
print('v229 relic icon UI and stack counts applied')
