from pathlib import Path

p = Path('v199-roguelike-expedition.js')
s = p.read_text(encoding='utf-8')

old = "enemyMax:Math.round((190*mult+40)*hpMul)"
new = "enemyMax:Math.round((520*mult+100)*hpMul)"

if old not in s:
    raise SystemExit('enemy HP formula target not found; file may have changed')

s = s.replace(old, new, 1)
s = s.replace("window.QinsterExpedition={render,zones:ZONES,version:'v220b-fix-boss-loop'};", "window.QinsterExpedition={render,zones:ZONES,version:'v221-enemy-hp-test'};", 1)

p.write_text(s, encoding='utf-8')
print('v221 enemy HP test patch applied')
