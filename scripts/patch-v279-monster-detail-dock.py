from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


def read(name):
    return (ROOT / name).read_text(encoding='utf-8')


def write(name, text):
    (ROOT / name).write_text(text, encoding='utf-8')

# index.html: bump build/cache version and load the persistent dock.
idx = read('index.html').replace('v278', 'v279')
if 'monster-detail-dock.js' not in idx:
    tag = '<script src="monster-detail-dock.js?v=279"></script>\n'
    if '</body>' not in idx:
        raise SystemExit('index.html has no </body>')
    idx = idx.replace('</body>', tag + '</body>', 1)
write('index.html', idx)

# game.js: bump runtime metadata. The dock itself removes the need to scroll the page.
game = read('game.js')
game = re.sub(r'/\* Qinster v\d+[^*]*\*/', '/* Qinster v279 persistent monster detail dock */', game, count=1)
game, nver = re.subn(r"window\.__qinsterVersion='v\d+';", "window.__qinsterVersion='v279';", game, count=1)
if nver != 1:
    raise SystemExit('runtime version marker not found')
game = re.sub(r"'v\d+ · engine '\+__n", "'v279 · engine '+__n", game, count=1)
game = game.replace(
    "setTimeout(()=>document.querySelector('#companion')?.scrollIntoView({behavior:'smooth',block:'center'}),50);",
    "setTimeout(()=>window.QinsterMonsterDock?.open?.(),0);"
)
write('game.js', game)

# Expedition already has the current 1600×base enemy HP model; preserve it and only bump release metadata.
rg = read('v199-roguelike-expedition.js').replace('v278', 'v279')
if 'const maxHp=Math.round(1600*base*hpMul*endlessMul)' not in rg:
    raise SystemExit('unexpected expedition enemy HP model; refusing to overwrite balance')
write('v199-roguelike-expedition.js', rg)

# Package metadata.
pkg = read('package.json')
pkg, npkg = re.subn(r'"version":\s*"278\.0\.0"', '"version": "279.0.0"', pkg, count=1)
if npkg != 1:
    raise SystemExit('package version marker not found')
write('package.json', pkg)
lock = read('package-lock.json').replace('"version": "278.0.0"', '"version": "279.0.0"')
write('package-lock.json', lock)

# Touch this one-shot file after updating the picker test assertion so the workflow reruns.
print('v279 monster detail dock patch applied')
