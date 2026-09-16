from pathlib import Path

root=Path(__file__).resolve().parents[1]
p=root/'index.html'
s=p.read_text(encoding='utf-8')
old='?v=278'
count=s.count(old)
if count < 7:
    raise SystemExit(f'expected at least 7 old cache keys, found {count}')
s=s.replace(old,'?v=279.1')
# The new dock is already on 279.1; leave it unchanged.
p.write_text(s,encoding='utf-8')
print(f'updated {count} stale script cache keys')
