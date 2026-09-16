from pathlib import Path

root=Path(__file__).resolve().parents[1]
p=root/'monster-detail-dock.js'
s=p.read_text(encoding='utf-8')

def rep(old,new,label):
    global s
    if old not in s:
        raise SystemExit(f'missing {label}')
    s=s.replace(old,new,1)

rep("let dock=null, body=null, toggle=null, nameEl=null;","let dock=null, body=null, toggle=null, nameEl=null, farmWorkspace=null;",'dock vars')
rep("  if(nameEl)nameEl.textContent=label;\n}\nfunction setCollapsed", "  if(nameEl)nameEl.textContent=label;\n}\nfunction syncVisibility(){\n  if(!dock)return;\n  const hide=!!farmWorkspace?.hidden;\n  dock.hidden=hide;\n  document.body.classList.toggle('qinster-monster-dock-page-hidden',hide);\n}\nfunction setCollapsed",'visibility function')
rep("#monster-detail-dock{position:fixed;top:92px;right:12px;width:360px;max-height:calc(100vh - 104px);display:grid;grid-template-rows:auto minmax(0,1fr);background:#9b9b9f;border:4px solid #242229;box-shadow:inset 0 0 0 3px #69656f,6px 6px 0 rgba(24,23,28,.65);z-index:980;color:#202126}\n", "#monster-detail-dock{position:fixed;top:92px;right:12px;width:360px;max-height:calc(100vh - 104px);display:grid;grid-template-rows:auto minmax(0,1fr);background:#9b9b9f;border:4px solid #242229;box-shadow:inset 0 0 0 3px #69656f,6px 6px 0 rgba(24,23,28,.65);z-index:980;color:#202126}\n#monster-detail-dock[hidden]{display:none!important}\n",'hidden css')
s=s.replace("body.qinster-monster-dock-on:not(.qinster-monster-dock-collapsed){--monster-dock-space:390px}","body.qinster-monster-dock-on:not(.qinster-monster-dock-collapsed):not(.qinster-monster-dock-page-hidden){--monster-dock-space:390px}")
s=s.replace("body.qinster-monster-dock-on:not(.qinster-monster-dock-collapsed) .shell{max-width:calc(100vw - var(--monster-dock-space));margin-left:14px;margin-right:auto}","body.qinster-monster-dock-on:not(.qinster-monster-dock-collapsed):not(.qinster-monster-dock-page-hidden) .shell{max-width:calc(100vw - var(--monster-dock-space));margin-left:14px;margin-right:auto}")
rep("  const companion=document.getElementById('companion');\n  if(!companion||document.getElementById('monster-detail-dock'))return;\n  ensureStyle();", "  const companion=document.getElementById('companion');\n  if(!companion||document.getElementById('monster-detail-dock'))return;\n  farmWorkspace=document.querySelector('.workspace');\n  ensureStyle();",'workspace capture')
rep("  updateHeader();\n  new MutationObserver(updateHeader).observe(companion,{childList:true,subtree:true,characterData:true});", "  updateHeader();\n  syncVisibility();\n  new MutationObserver(updateHeader).observe(companion,{childList:true,subtree:true,characterData:true});\n  if(farmWorkspace)new MutationObserver(syncVisibility).observe(farmWorkspace,{attributes:true,attributeFilter:['hidden']});",'workspace observer')
rep("window.QinsterMonsterDock={open,close,toggle:()=>setCollapsed(!dock.classList.contains('collapsed')),updateHeader};", "window.QinsterMonsterDock={open,close,toggle:()=>setCollapsed(!dock.classList.contains('collapsed')),updateHeader,syncVisibility};",'runtime export')
p.write_text(s,encoding='utf-8')

idx=root/'index.html'
h=idx.read_text(encoding='utf-8')
if 'monster-detail-dock.js?v=279' not in h:
    raise SystemExit('dock cache marker missing')
h=h.replace('monster-detail-dock.js?v=279','monster-detail-dock.js?v=279.1',1)
idx.write_text(h,encoding='utf-8')
print('v279 detail visibility hotfix applied')
