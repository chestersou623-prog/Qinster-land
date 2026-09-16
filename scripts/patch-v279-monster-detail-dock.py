from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(name):
    return (ROOT / name).read_text(encoding='utf-8')


def write(name, text):
    (ROOT / name).write_text(text, encoding='utf-8')


def must_replace(text, old, new, label):
    if old not in text:
        raise SystemExit(f'missing expected text for {label}: {old[:120]!r}')
    return text.replace(old, new)

# index.html: bump build/cache version and load the new dock after the main game scripts.
idx = read('index.html')
idx = idx.replace('v278', 'v279')
needle = '<script src="v201-battle-theater.js?v=279"></script>'
insert = needle + '\n<script src="monster-detail-dock.js?v=279"></script>'
if 'monster-detail-dock.js' not in idx:
    idx = must_replace(idx, needle, insert, 'dock script include')
write('index.html', idx)

# game.js: publish the new version and stop the old log jump from scrolling the page.
game = read('game.js')
game = game.replace('/* Qinster v277 personality-driven breeding */', '/* Qinster v279 persistent monster detail dock */', 1)
game = must_replace(game, "window.__qinsterVersion='v278';", "window.__qinsterVersion='v279';", 'runtime version')
game = game.replace("'v268 · engine '+__n", "'v279 · engine '+__n")
old_jump = "setTimeout(()=>document.querySelector('#companion')?.scrollIntoView({behavior:'smooth',block:'center'}),50);"
new_jump = "setTimeout(()=>window.QinsterMonsterDock?.open?.(),0);"
game = must_replace(game, old_jump, new_jump, 'log monster jump')
write('game.js', game)

# Expedition already contains the current higher enemy-HP model; only bump release metadata.
rg = read('v199-roguelike-expedition.js').replace('v278', 'v279')
write('v199-roguelike-expedition.js', rg)

# Package metadata.
pkg = read('package.json')
pkg = must_replace(pkg, '"version": "278.0.0"', '"version": "279.0.0"', 'package version')
write('package.json', pkg)
lock = read('package-lock.json')
lock = lock.replace('"version": "278.0.0"', '"version": "279.0.0"')
write('package-lock.json', lock)

print('v279 monster detail dock patch applied')
