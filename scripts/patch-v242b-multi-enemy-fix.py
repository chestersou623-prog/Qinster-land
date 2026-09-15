from pathlib import Path
import runpy

# Apply the full v242 patch first.
runpy.run_path('scripts/patch-v242-multi-enemy.py', run_name='__main__')

# Fix the replay layer's final enemy HP setHp call: the generated line was
# missing the final ')' that closes setHp(...).
p=Path('v201-battle-theater.js')
s=p.read_text(encoding='utf-8')
old="*100))}for(const m of allies)setHp("
new="*100)))}for(const m of allies)setHp("
if old not in s:
    raise SystemExit('v242 theater closing-paren target not found')
s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')
