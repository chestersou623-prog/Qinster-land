from pathlib import Path

# Cache/version recovery after v244 mixed old ?v=242 assets with new HTML.
p=Path('index.html')
s=p.read_text(encoding='utf-8')
s=s.replace('Qinster v244 错误','Qinster v245 错误')
s=s.replace("b.textContent='v244 · '+msg", "b.textContent='v245 · '+msg")
# Force every runtime module to the same cache generation.
s=s.replace('<script src="game.js?v=242"></script><script src="v193-race-stats.js"></script><script src="v194-expedition.js"></script><script src="dispatch-pip.js?v=197"></script><script src="v197-more-menu.js"></script><script src="v199-roguelike-expedition.js?v=242"></script>\n<script src="v201-battle-theater.js?v=242"></script>', '<script src="game.js?v=245"></script><script src="v193-race-stats.js?v=245"></script><script src="v194-expedition.js?v=245"></script><script src="dispatch-pip.js?v=245"></script><script src="v197-more-menu.js?v=245"></script><script src="v199-roguelike-expedition.js?v=245"></script>\n<script src="v201-battle-theater.js?v=245"></script>')
p.write_text(s,encoding='utf-8')

p=Path('game.js')
s=p.read_text(encoding='utf-8').replace("window.__qinsterVersion='v244'", "window.__qinsterVersion='v245'").replace("'v244 · engine '", "'v245 · engine '")
p.write_text(s,encoding='utf-8')

# Bump theater style id so stale injected CSS cannot survive a soft navigation.
p=Path('v201-battle-theater.js')
s=p.read_text(encoding='utf-8').replace("qinster-v243-battle-theater-style", "qinster-v245-battle-theater-style")
p.write_text(s,encoding='utf-8')

# Defensive migration: make sure old supply-only saves cannot break the new meta tree.
p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')
old="if(!e.metaTree)e.metaTree={atk:0,def:0,spd:0,luck:0,vanguard:0};if(e.metaTree.supply!=null&&e.metaTree.vanguard==null)e.metaTree.vanguard=Math.max(0,Number(e.metaTree.supply)||0);"
new="if(!e.metaTree)e.metaTree={atk:0,def:0,spd:0,luck:0,vanguard:0};if(e.metaTree.vanguard==null)e.metaTree.vanguard=Math.max(0,Number(e.metaTree.supply)||0);for(const k of ['atk','def','spd','luck','vanguard'])e.metaTree[k]=Math.max(0,Number(e.metaTree[k])||0);"
if old in s:s=s.replace(old,new)
p.write_text(s,encoding='utf-8')
