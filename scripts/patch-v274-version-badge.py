from pathlib import Path

p=Path('index.html')
s=p.read_text(encoding='utf-8')
old=s
s=s.replace('>v268 · 等待</div><div id="engine-heartbeat">v268 · engine</div>', '>v274 · 等待</div><div id="engine-heartbeat">v274 · engine</div>')
if s==old:
    raise SystemExit('target version badge text not found')
p.write_text(s,encoding='utf-8')

pkg=Path('package.json')
ps=pkg.read_text(encoding='utf-8')
ps2=ps.replace('"version": "273.0.0"','"version": "274.0.0"')
if ps2==ps:
    raise SystemExit('package version 273.0.0 not found')
pkg.write_text(ps2,encoding='utf-8')

print('patched visible badge to v274 and package version to 274.0.0')
