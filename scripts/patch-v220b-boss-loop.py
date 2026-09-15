from pathlib import Path
import re
p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')
pattern=r"function advance\(run\)\{run\.stage\+\+;run\.challenge=null;if\(run\.stage>=8\)\{run\.options=\[\{type:'boss'\}\]\}else run\.options=makeOptions\(run\.stage\);run\.phase='map';if\(run\.supply<=0\)\{run\.log\.push\('补给耗尽：之后的挑战失败会更危险。'\)\}save\(\)\}"
repl="function advance(run){run.stage++;run.challenge=null;run.options=makeOptions(run.stage);run.phase='map';if(run.supply<=0){run.log.push('补给耗尽：之后的挑战失败会更危险。')}save()}"
s2,n=re.subn(pattern,repl,s,count=1)
if n!=1:
    # More robust fallback for minor formatting differences.
    s2,n=re.subn(r"function advance\(run\)\{.*?save\(\)\}",repl,s,count=1,flags=re.S)
if n!=1:
    raise SystemExit(f'advance patch failed: {n}')
s=s2.replace("version:'v220-two-maps-27f-difficulty-ladder'","version:'v220b-fix-boss-loop'")
p.write_text(s,encoding='utf-8')
print('v220b boss loop hotfix applied')
