from pathlib import Path


def req(s, old, new, label):
    if old not in s:
        raise SystemExit(f'Missing expected pattern: {label}')
    return s.replace(old, new, 1)

# Expedition reward economy: remove stage-linear energy inflation.
p = Path('v199-roguelike-expedition.js')
s = p.read_text(encoding='utf-8')
s = req(s, "base=Math.round((300+run.stage*90)*nodeRewardScale(zone,run.stage)*(1+(mods.chest||0)))", "base=Math.round(400*nodeRewardScale(zone,run.stage)*(1+(mods.chest||0)))", 'treasure energy base')
s = req(s, "gain=Math.round((250+run.stage*75)*nodeRewardScale(zone,run.stage))", "gain=Math.round(300*nodeRewardScale(zone,run.stage))", 'challenge energy base')
s = req(s, "base=Math.round((400+run.stage*120)*(elite?1.7:1)*(boss?2.8:1)*nodeRewardScale(zone,run.stage)*eliteBonus)", "base=Math.round(500*(elite?1.7:1)*(boss?2.8:1)*nodeRewardScale(zone,run.stage)*eliteBonus)", 'battle energy base')
s = s.replace('v251', 'v252')
p.write_text(s, encoding='utf-8')

# Visible/cache versions.
for fname in ['game.js','v201-battle-theater.js']:
    p = Path(fname)
    s = p.read_text(encoding='utf-8').replace('v251','v252')
    p.write_text(s, encoding='utf-8')

p = Path('index.html')
s = p.read_text(encoding='utf-8').replace('v251','v252').replace('?v=251','?v=252')
p.write_text(s, encoding='utf-8')
