from pathlib import Path

# Fix expedition stat breakdown cards overflowing/stacking into neighboring monsters.
p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

repls={
".rg-final-stats{display:grid;grid-template-columns:repeat(5,minmax(52px,1fr));gap:4px;margin-top:7px}":".rg-final-stats{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:2px;margin-top:7px;width:100%;min-width:0}",
".rg-final-stat{position:relative;background:#242832;border:1px solid #555d6c;color:#e9edf3;padding:5px 3px;text-align:center;box-shadow:none!important;transform:none!important}":".rg-final-stat{position:relative;background:#242832;border:1px solid #555d6c;color:#e9edf3;padding:4px 1px;text-align:center;box-shadow:none!important;transform:none!important;min-width:0;width:100%;overflow:visible}",
".rg-final-stat span{display:block;font-size:9px;opacity:.72}":".rg-final-stat span{display:block;font-size:8px;opacity:.72;white-space:nowrap;overflow:hidden;text-overflow:clip}",
".rg-final-stat b{display:block;font-size:15px;line-height:1.15}":".rg-final-stat b{display:block;font-size:13px;line-height:1.15;white-space:nowrap}",
".rg-final-stat small{display:block;font-size:8px;opacity:.62}":".rg-final-stat small{display:block;font-size:7px;opacity:.62;white-space:nowrap;overflow:hidden}",
"@media(max-width:700px){.rg-final-stats{grid-template-columns:repeat(5,minmax(46px,1fr))}":"@media(max-width:700px){.rg-final-stats{grid-template-columns:repeat(5,minmax(0,1fr));gap:1px}.rg-final-stat{padding:3px 0}.rg-final-stat b{font-size:12px}.rg-final-stat span,.rg-final-stat small{font-size:7px}"
}
for old,new in repls.items():
    if old not in s:
        raise SystemExit('missing CSS target: '+old[:80])
    s=s.replace(old,new,1)

# Ensure grid children can shrink instead of forcing the parent wider.
old=".rg-mon{background:#d9d8dc;border:2px solid #85818b;padding:8px;text-align:center}"
new=".rg-mon{background:#d9d8dc;border:2px solid #85818b;padding:8px;text-align:center;min-width:0}"
if old in s:
    s=s.replace(old,new,1)

# Mark expedition module revision when the marker is present.
s=s.replace("version:'v229-relic-icon-ui'","version:'v231-expedition-stat-grid'")
s=s.replace("version:'v230-relic-icons'","version:'v231-expedition-stat-grid'")
p.write_text(s,encoding='utf-8')

# Bump visible game version on every shipped update.
p=Path('game.js');g=p.read_text(encoding='utf-8')
g=g.replace("window.__qinsterVersion='v230';","window.__qinsterVersion='v231';")
g=g.replace("__eb.textContent='v230 · engine '+__n;","__eb.textContent='v231 · engine '+__n;")
p.write_text(g,encoding='utf-8')

p=Path('index.html');h=p.read_text(encoding='utf-8')
h=h.replace('>v230 · 等待</div>','>v231 · 等待</div>')
h=h.replace('>v230 · engine</div>','>v231 · engine</div>')
h=h.replace('game.js?v=230','game.js?v=231')
h=h.replace('v199-roguelike-expedition.js?v=230','v199-roguelike-expedition.js?v=231')
p.write_text(h,encoding='utf-8')

# Keep QA fixture cache-buster in sync if present.
p=Path('scripts/check-game.mjs');q=p.read_text(encoding='utf-8')
q=q.replace("src=\"game.js?v=230\"","src=\"game.js?v=231\"")
p.write_text(q,encoding='utf-8')

print('v231 expedition stat grid + visible version applied')
