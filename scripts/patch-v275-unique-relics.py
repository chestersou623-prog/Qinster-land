from pathlib import Path

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')
old="function offerRelic(run){run.relicChoices=shuffle(RELICS).slice(0,3).map(x=>x.id);run.phase='relic';save()}"
new="function offerRelic(run){const owned=new Set(run.relics||[]),pool=RELICS.filter(x=>!owned.has(x.id));run.relicChoices=shuffle(pool).slice(0,3).map(x=>x.id);if(!run.relicChoices.length){run.materials.relicDust=(run.materials.relicDust||0)+1;run.log.push('遗物池已全部收集，本次改为遗物尘 +1。');if(run.stage%9===8&&floorNo(run.stage)<=2){run.phase='floorBossChoice';save(`${floorLabel(run.stage)} BOSS 已击败：遗物池已收集完，可按25%撤离，或继续下一楼层。`);return}if(run.stage%9===8)floorTransitionHeal(run);advance(run);return}run.phase='relic';save()}"
if old not in s: raise SystemExit('offerRelic pattern missing')
s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')

idx=Path('index.html')
h=idx.read_text(encoding='utf-8')
h=h.replace('v274 · 等待','v275 · 等待').replace('v274 · engine','v275 · engine')
for v in ('273','274'):
    h=h.replace(f'?v={v}', '?v=275')
idx.write_text(h,encoding='utf-8')

pkg=Path('package.json')
js=pkg.read_text(encoding='utf-8').replace('"version": "274.0.0"','"version": "275.0.0"',1)
pkg.write_text(js,encoding='utf-8')

lock=Path('package-lock.json')
if lock.exists():
    t=lock.read_text(encoding='utf-8')
    t=t.replace('"version": "272.0.0"','"version": "275.0.0"',2)
    lock.write_text(t,encoding='utf-8')

# version constant if present in game.js
q=Path('game.js')
g=q.read_text(encoding='utf-8')
for oldv in ('v274','v273','v272'):
    if f"window.__qinsterVersion='{oldv}'" in g:
        g=g.replace(f"window.__qinsterVersion='{oldv}'","window.__qinsterVersion='v275'",1)
        break
q.write_text(g,encoding='utf-8')

# Explicit release marker for easy verification.
if '/* Qinster release v275 */' not in s:
    s=p.read_text(encoding='utf-8')
    p.write_text('/* Qinster release v275 */\n'+s,encoding='utf-8')
