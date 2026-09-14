from pathlib import Path

# index.html
p=Path('index.html')
h=p.read_text(encoding='utf-8')
if 'id="expedition-btn"' not in h:
    old='<button class="subtle" id="dispatch-btn">派遣</button><button class="subtle" id="shop-btn">商店</button>'
    new='<button class="subtle" id="dispatch-btn">派遣</button><button class="subtle" id="expedition-btn">远征</button><button class="subtle" id="shop-btn">商店</button>'
    if old not in h: raise SystemExit('header dispatch marker not found')
    h=h.replace(old,new,1)

if 'id="expedition-page"' not in h:
    marker='<section id="dex-page" style="display:none">'
    page='''<section id="expedition-page" style="display:none" hidden>
  <div class="shop-head expedition-head">
    <div><span class="eyebrow">ACTIVE EXPEDITION</span><h2>远征</h2><p>带 3 只怪物主动探索路线，用五项能力处理事件。和挂机派遣不同，每一步都由你选择。</p></div>
    <button class="secondary" id="back-from-expedition">返回牧场</button>
  </div>
  <div id="expedition-content" class="expedition-content"></div>
</section>
'''
    if marker not in h: raise SystemExit('dex section marker not found')
    h=h.replace(marker,page+marker,1)

if '/* ===== v194 expedition ===== */' not in h:
    marker='</style>\n<body>'
    css='''
/* ===== v194 expedition ===== */
#expedition-page{background:#77737e;padding:10px;border:4px solid #242229}.expedition-head{margin-bottom:10px}.expedition-content{display:grid;gap:10px}.exp-overview{display:grid;grid-template-columns:1fr 1fr;gap:8px}.exp-overview>div{background:#d2d2d6;border:3px solid #77727f;padding:10px}.exp-overview b,.exp-overview small{display:block}.exp-overview small{margin-top:4px;font-size:9px;color:#59545e}.exp-intro{margin:0;padding:9px 10px;background:#c9c8cd;border:2px solid #85818b;font-size:10px;line-height:1.6}.exp-select-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.exp-select-grid label{font-size:10px;font-weight:900}.exp-select-grid select{display:block;width:100%;margin-top:4px}.exp-team-strip{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.exp-team-card{display:grid;grid-template-columns:58px minmax(0,1fr);gap:7px;align-items:center;background:#d5d4d8;border:2px solid #89858f;padding:7px}.exp-team-card .sprite{width:54px!important}.exp-team-card b,.exp-team-card small{display:block}.exp-team-card small{margin-top:4px;font-size:8px;line-height:1.45;color:#55515a}.exp-start{width:100%;padding:11px}.exp-progress{display:flex;gap:7px;justify-content:center;padding:7px}.exp-progress span{width:28px;height:28px;display:grid;place-items:center;border:2px solid #77727f;background:#bab9bf;font-size:10px;font-weight:900}.exp-progress span.current{background:#f0d26d;border-color:#80681e}.exp-progress span.done{background:#9fc093;border-color:#57764e}.exp-status{display:flex;gap:10px;flex-wrap:wrap;justify-content:space-between;background:#302d36;color:#fff4bd;border:3px solid #77727f;padding:8px 10px;font-size:10px}.exp-event{background:#d2d2d6;border:4px solid #55515c;padding:12px}.exp-event>span{font-size:9px;color:#69636d}.exp-event h3{margin:4px 0 7px}.exp-event p{font-size:11px;line-height:1.55}.exp-choices{display:grid;grid-template-columns:1fr 1fr;gap:8px}.exp-choice{min-height:92px;text-align:left;background:#c6c5ca;border:3px solid #76717d;padding:9px;color:#242229}.exp-choice:hover{background:#ded8bc}.exp-choice b,.exp-choice small,.exp-choice em{display:block}.exp-choice small{margin-top:6px;font-size:9px;line-height:1.45}.exp-choice em{margin-top:5px;font-size:9px;color:#6a4b13;font-style:normal;font-weight:900}.exp-log{display:grid;gap:4px;padding:8px;background:#b9b8bd;border:2px solid #7d7982;font-size:9px;line-height:1.4}.exp-last{padding:8px;background:#c5c4c9;border:2px solid #88848e;font-size:10px}@media(max-width:760px){.exp-overview,.exp-select-grid,.exp-team-strip,.exp-choices{grid-template-columns:1fr}.exp-status{display:grid}}
'''
    if marker not in h: raise SystemExit('body style marker not found')
    h=h.replace(marker,css+'\n</style>\n<body>',1)

if 'v194-expedition.js' not in h:
    old='<script src="game.js?v=189"></script><script src="v193-race-stats.js"></script></body></html>'
    new='<script src="game.js?v=194"></script><script src="v193-race-stats.js"></script><script src="v194-expedition.js"></script></body></html>'
    if old not in h: raise SystemExit('script footer marker not found')
    h=h.replace(old,new,1)
p.write_text(h,encoding='utf-8')

# game.js
p=Path('game.js')
s=p.read_text(encoding='utf-8')
if "next==='expedition'" not in s:
    old="""  const dp=$('dispatch-page');
  if(dp){dp.hidden=next!=='dispatch';dp.style.display=next==='dispatch'?'block':'none';}
  $('shop-page').style.display=next==='shop'?'block':'none';
"""
    new="""  const dp=$('dispatch-page');
  if(dp){dp.hidden=next!=='dispatch';dp.style.display=next==='dispatch'?'block':'none';}
  const ep=$('expedition-page');
  if(ep){ep.hidden=next!=='expedition';ep.style.display=next==='expedition'?'block':'none';}
  $('shop-page').style.display=next==='shop'?'block':'none';
"""
    if old not in s: raise SystemExit('setPage visibility marker not found')
    s=s.replace(old,new,1)

    old="""  $('dispatch-btn').setAttribute('aria-pressed',String(next==='dispatch'));
  $('shop-btn').setAttribute('aria-pressed',String(next==='shop'));
"""
    new="""  $('dispatch-btn').setAttribute('aria-pressed',String(next==='dispatch'));
  if($('expedition-btn'))$('expedition-btn').setAttribute('aria-pressed',String(next==='expedition'));
  $('shop-btn').setAttribute('aria-pressed',String(next==='shop'));
"""
    if old not in s: raise SystemExit('setPage aria marker not found')
    s=s.replace(old,new,1)

    old="""  if(next==='dispatch')renderDispatch();
  if(next==='dex')renderDex();
"""
    new="""  if(next==='dispatch')renderDispatch();
  if(next==='expedition'&&window.QinsterExpedition?.render)window.QinsterExpedition.render();
  if(next==='dex')renderDex();
"""
    if old not in s: raise SystemExit('setPage render marker not found')
    s=s.replace(old,new,1)

    old="""$('dispatch-btn').onclick=()=>{setPage('dispatch');};$('shop-btn').onclick=()=>{setPage('shop');};$('bag-btn').onclick=()=>{setPage('bag');};
$('dex-btn').onclick=()=>{setPage('dex');};
"""
    new="""$('dispatch-btn').onclick=()=>{setPage('dispatch');};if($('expedition-btn'))$('expedition-btn').onclick=()=>{setPage('expedition');};$('shop-btn').onclick=()=>{setPage('shop');};$('bag-btn').onclick=()=>{setPage('bag');};
$('dex-btn').onclick=()=>{setPage('dex');};
"""
    if old not in s: raise SystemExit('nav onclick marker not found')
    s=s.replace(old,new,1)

    old="""$('back-farm').onclick=()=>{setPage('farm');};$('back-from-bag').onclick=()=>{setPage('farm');};$('back-from-dispatch').onclick=()=>{setPage('farm');};
$('back-from-dex').onclick=()=>{setPage('farm');};
"""
    new="""$('back-farm').onclick=()=>{setPage('farm');};$('back-from-bag').onclick=()=>{setPage('farm');};$('back-from-dispatch').onclick=()=>{setPage('farm');};if($('back-from-expedition'))$('back-from-expedition').onclick=()=>{setPage('farm');};
$('back-from-dex').onclick=()=>{setPage('farm');};
"""
    if old not in s: raise SystemExit('back nav marker not found')
    s=s.replace(old,new,1)

if 'window.QinsterRuntime=' not in s:
    marker="setTimeout(()=>runIntegrityAudit(),0);"
    bridge="""window.QinsterRuntime={getState:()=>s,G,name,sprite,save,render,tell,setPage,isDispatched,ensureMonsterSystemsMonster};
setTimeout(()=>runIntegrityAudit(),0);"""
    if marker not in s: raise SystemExit('runtime bridge marker not found')
    s=s.replace(marker,bridge,1)

s=s.replace("window.__qinsterVersion='v192';","window.__qinsterVersion='v194';")
s=s.replace("__eb.textContent='v192 · engine '+__n","__eb.textContent='v194 · engine '+__n")
p.write_text(s,encoding='utf-8')
