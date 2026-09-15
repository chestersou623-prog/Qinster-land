from pathlib import Path


def read(path):
    return Path(path).read_text(encoding='utf-8')


def write(path, text):
    Path(path).write_text(text, encoding='utf-8')


def replace_once(text, old, new, label):
    if old not in text:
        raise SystemExit(f'missing pattern: {label}')
    if text.count(old) != 1:
        raise SystemExit(f'pattern not unique ({text.count(old)}): {label}')
    return text.replace(old, new, 1)

# ---------- index.html ----------
p = Path('index.html')
s = read(p)
s = replace_once(s,
    '<button class="subtle" id="sound-btn" aria-label="音效设置">音效 🔊</button>',
    '<button class="subtle" id="sound-btn" aria-label="游戏设置">设置 ⚙</button>',
    'settings button')
s = replace_once(s,
    '<h2>🔊 音效设置</h2>\n    <label class="sound-row"><span>启用音效</span><input id="sound-enabled" type="checkbox" checked></label>',
    '<h2>⚙ 游戏设置</h2>\n    <label class="sound-row"><span>启用音效</span><input id="sound-enabled" type="checkbox" checked></label>\n    <label class="sound-row"><span>显示版本 / engine 调试标签</span><input id="debug-overlay-visible" type="checkbox" checked></label>',
    'settings dialog')
s = replace_once(s,
    '<p class="sound-hint">使用浏览器 Web Audio 即时合成，不需要额外 MP3/WAV。iPhone 会在你第一次点按页面后解锁声音。闪光、5★、孵化、派遣、购买与建筑升级都有独立反馈音。</p>',
    '<p class="sound-hint">音效使用浏览器 Web Audio 即时合成。版本 / engine 标签仅用于查看当前构建与排错；远征时如果觉得挡住画面，可以在这里关闭，选择会保存在当前浏览器。</p>',
    'settings hint')
s = replace_once(s,
    '<div id="boot-check" style="position:fixed;left:6px;bottom:6px;z-index:999999;background:#27242d;color:#ffe36f;border:2px solid #77717f;padding:4px 7px;font:700 10px monospace">v277 · 等待</div><div id="engine-heartbeat">v277 · engine</div>',
    '<div id="boot-check" style="position:fixed;left:6px;bottom:6px;z-index:999999;background:#27242d;color:#ffe36f;border:2px solid #77717f;padding:4px 7px;font:700 10px monospace">v278 · 等待</div><div id="engine-heartbeat">v278 · engine</div>',
    'initial build labels')
s = replace_once(s,
    "(function(){\n  const b=document.getElementById('boot-check');\n  window.__bootMark=function(msg){if(b){b.textContent='v266 · '+msg;b.style.background='#55461e';}};",
    "(function(){\n  const BUILD='v278';\n  window.__QINSTER_BUILD=BUILD;\n  const b=document.getElementById('boot-check');\n  window.__bootMark=function(msg){if(b){b.textContent=BUILD+' · '+msg;b.style.background='#55461e';}};",
    'boot version source')
s = replace_once(s,
    "x.textContent='Qinster v266 错误\\n'+(msg||String(e.error||'Unknown'))+'\\n'+file+':'+String(e.lineno||'')+':'+String(e.colno||'')+stack;",
    "x.textContent='Qinster '+BUILD+' 错误\\n'+(msg||String(e.error||'Unknown'))+'\\n'+file+':'+String(e.lineno||'')+':'+String(e.colno||'')+stack;",
    'fatal version source')
s = s.replace('?v=277', '?v=278')
write(p, s)

# ---------- game.js ----------
p = Path('game.js')
s = read(p)
settings_marker = "if($('sound-btn'))$('sound-btn').onclick=()=>{refreshSoundUI();$('sound-dialog').showModal();};"
settings_block = """const DEBUG_OVERLAY_PREF_KEY='qinster-debug-overlay-visible';
function debugOverlayVisible(){
  try{const raw=localStorage.getItem(DEBUG_OVERLAY_PREF_KEY);return raw===null?true:raw==='1';}catch(_){return true;}
}
function applyDebugOverlayPreference(){
  const show=debugOverlayVisible();
  for(const id of ['boot-check','engine-heartbeat']){const el=$(id);if(el)el.hidden=!show;}
  const cb=$('debug-overlay-visible');if(cb)cb.checked=show;
  return show;
}
function setDebugOverlayVisible(show){
  try{localStorage.setItem(DEBUG_OVERLAY_PREF_KEY,show?'1':'0');}catch(_){}
  applyDebugOverlayPreference();
}
if($('sound-btn'))$('sound-btn').onclick=()=>{refreshSoundUI();applyDebugOverlayPreference();$('sound-dialog').showModal();};"""
s = replace_once(s, settings_marker, settings_block, 'debug overlay preference insertion')
s = replace_once(s,
    "if($('sound-enabled'))$('sound-enabled').onchange=e=>{audioPrefs.enabled=!!e.target.checked;saveAudioPrefs();if(audioPrefs.enabled){ensureAudio();playSfx('click');}refreshSoundUI();};",
    "if($('sound-enabled'))$('sound-enabled').onchange=e=>{audioPrefs.enabled=!!e.target.checked;saveAudioPrefs();if(audioPrefs.enabled){ensureAudio();playSfx('click');}refreshSoundUI();};\nif($('debug-overlay-visible'))$('debug-overlay-visible').onchange=e=>setDebugOverlayVisible(!!e.target.checked);",
    'debug overlay checkbox binding')
s = replace_once(s,
    "if($('sound-test'))$('sound-test').onclick=()=>{ensureAudio();playSfx('shiny');};\nrefreshSoundUI();",
    "if($('sound-test'))$('sound-test').onclick=()=>{ensureAudio();playSfx('shiny');};\nrefreshSoundUI();\napplyDebugOverlayPreference();",
    'initial debug overlay apply')
if "window.__qinsterVersion='v277';" not in s:
    raise SystemExit('missing game version v277')
s = s.replace("window.__qinsterVersion='v277';", "window.__qinsterVersion='v278';", 1)
write(p, s)

# ---------- v199-roguelike-expedition.js ----------
p = Path('v199-roguelike-expedition.js')
s = read(p)
s = replace_once(s, '/* Qinster release v276 */', '/* Qinster release v278 */', 'expedition release marker')
old_return = "return `<span class=\"rg-relic-chip ${small?'small':''}\" tabindex=\"0\" role=\"button\" aria-label=\"${r.name}${count>1?' x'+count:''}：${r.text}\" aria-expanded=\"false\"><img class=\"rg-relic-icon\" src=\"assets/relics/${assetId}.png?v=263\" alt=\"${r.name}\" width=\"64\" height=\"64\" onerror=\"this.onerror=null;this.src='assets/relics/fateWeight.png?v=263'\">${count>1?`<b class=\"rg-relic-count\">x${count}</b>`:''}<em><strong>${r.name}${count>1?' x'+count:''}</strong><span>${r.text}</span>${count>1?`<small>当前持有 ${count} 个；可叠加的数值效果已经按数量累计。</small>`:''}</em></span>`;"
new_return = "return `<span class=\"rg-relic-chip ${small?'small':''}\" data-rg-relic-id=\"${r.id}\" data-rg-relic-count=\"${count}\" tabindex=\"0\" role=\"button\" aria-label=\"${r.name}${count>1?' x'+count:''}：${r.text}\" aria-expanded=\"false\"><img class=\"rg-relic-icon\" src=\"assets/relics/${assetId}.png?v=263\" alt=\"${r.name}\" width=\"64\" height=\"64\" onerror=\"this.onerror=null;this.src='assets/relics/fateWeight.png?v=263'\">${count>1?`<b class=\"rg-relic-count\">x${count}</b>`:''}<em><strong>${r.name}${count>1?' x'+count:''}</strong><span>${r.text}</span>${count>1?`<small>当前持有 ${count} 个；可叠加的数值效果已经按数量累计。</small>`:''}</em></span>`;"
s = replace_once(s, old_return, new_return, 'relic icon datasets')
marker = "function relicTrayHTML(run){\n  const c=relicCounts(run),ids=Object.keys(c);return ids.length?`<div class=\"rg-relic-tray\">${ids.map(id=>relicIconHTML(id,c[id],true)).join('')}</div>`:'<p class=\"rg-note\">暂时没有遗物</p>';\n}\nfunction relicHTML(run){"
insert = """function relicTrayHTML(run){
  const c=relicCounts(run),ids=Object.keys(c);return ids.length?`<div class=\"rg-relic-tray\">${ids.map(id=>relicIconHTML(id,c[id],true)).join('')}</div>`:'<p class=\"rg-note\">暂时没有遗物</p>';
}
function ensureRelicDetailDock(){
  let dock=document.getElementById('rg-relic-detail-dock');
  if(dock)return dock;
  if(!document.getElementById('rg-relic-detail-dock-style')){
    const st=document.createElement('style');st.id='rg-relic-detail-dock-style';
    st.textContent='#rg-relic-detail-dock{position:fixed;right:14px;top:96px;z-index:10050;width:min(310px,calc(100vw - 28px));max-height:calc(100vh - 120px);overflow:auto;background:#d6d5da;color:#222;border:4px solid #29262f;box-shadow:6px 6px 0 rgba(0,0,0,.45);padding:10px}#rg-relic-detail-dock[hidden]{display:none!important}.rg-relic-detail-head{display:flex;justify-content:space-between;align-items:center;gap:8px;padding-bottom:7px;border-bottom:3px solid #77727f}.rg-relic-detail-head b{font-size:13px}.rg-relic-detail-close{padding:3px 7px!important}.rg-relic-detail-main{display:grid;grid-template-columns:82px 1fr;gap:10px;align-items:center;margin-top:10px}.rg-relic-detail-main img{width:78px;height:78px;object-fit:contain;background:#20232b;border:3px solid #77727f;image-rendering:pixelated}.rg-relic-detail-main h3{margin:0 0 6px;color:#8d2d28;font-size:17px}.rg-relic-detail-main p{margin:0;font-size:11px;line-height:1.55}.rg-relic-detail-stack{margin-top:10px;padding:7px;background:#ece8d8;border:2px solid #8e8775;font-size:10px;line-height:1.5}.rg-relic-chip.detail-selected{outline:3px solid #f2c451;outline-offset:2px}.rg-relic-chip em{display:none!important}@media(max-width:900px){#rg-relic-detail-dock{left:10px;right:10px;top:auto;bottom:10px;width:auto;max-height:42vh}.rg-relic-detail-main{grid-template-columns:66px 1fr}.rg-relic-detail-main img{width:62px;height:62px}}';
    document.head.appendChild(st);
  }
  dock=document.createElement('aside');dock.id='rg-relic-detail-dock';dock.hidden=true;dock.setAttribute('aria-live','polite');dock.innerHTML='<div class=\"rg-relic-detail-head\"><b>遗物详情</b><button type=\"button\" class=\"secondary rg-relic-detail-close\" data-rg-relic-detail-close>×</button></div><div data-rg-relic-detail-body></div>';
  document.body.appendChild(dock);
  return dock;
}
function showRelicDetails(id,count=1){
  const r=RELICS.find(x=>x.id===id);if(!r)return;
  const dock=ensureRelicDetailDock(),body=dock.querySelector('[data-rg-relic-detail-body]'),assetId=relicIconAssetId(r.id),n=Math.max(1,Number(count)||1);
  body.innerHTML=`<div class=\"rg-relic-detail-main\"><img src=\"assets/relics/${assetId}.png?v=263\" alt=\"${r.name}\" onerror=\"this.onerror=null;this.src='assets/relics/fateWeight.png?v=263'\"><div><h3>${r.name}${n>1?' ×'+n:''}</h3><p>${r.text}</p></div></div><div class=\"rg-relic-detail-stack\">${n>1?`当前显示数量：<b>${n}</b>。如果该遗物属于可叠加效果，数值会按实际持有数量累计。`:'点击其他遗物图标可直接在这里切换详情，不需要回到页面上方。'}</div>`;
  dock.hidden=false;
  document.querySelectorAll('.rg-relic-chip.detail-selected').forEach(x=>x.classList.remove('detail-selected'));
  document.querySelectorAll(`.rg-relic-chip[data-rg-relic-id=\"${id}\"]`).forEach(x=>x.classList.add('detail-selected'));
}
function relicHTML(run){"""
s = replace_once(s, marker, insert, 'relic detail dock insertion')
old_click = "const rc=ev.target.closest?.('.rg-relic-chip');if(rc&&!ev.target.closest?.('[data-rg-relic]')){ev.preventDefault();ev.stopPropagation();document.querySelectorAll('.rg-relic-chip.open').forEach(x=>{if(x!==rc){x.classList.remove('open');x.setAttribute('aria-expanded','false')}});rc.classList.toggle('open');rc.setAttribute('aria-expanded',String(rc.classList.contains('open')));positionRelicDetails(rc);return;}"
new_click = "const rc=ev.target.closest?.('.rg-relic-chip');if(rc&&!ev.target.closest?.('[data-rg-relic]')){ev.preventDefault();ev.stopPropagation();showRelicDetails(rc.dataset.rgRelicId,Number(rc.dataset.rgRelicCount)||1);return;}"
s = replace_once(s, old_click, new_click, 'relic click behavior')
old_close = "function closeRelicDetails(){document.querySelectorAll('.rg-relic-chip.open').forEach(x=>{x.classList.remove('open');x.setAttribute('aria-expanded','false')});}\ndocument.addEventListener('click',ev=>{if(!ev.target.closest?.('.rg-relic-chip'))closeRelicDetails();});"
new_close = "function closeRelicDetails(){const dock=document.getElementById('rg-relic-detail-dock');if(dock)dock.hidden=true;document.querySelectorAll('.rg-relic-chip.detail-selected').forEach(x=>x.classList.remove('detail-selected'));document.querySelectorAll('.rg-relic-chip.open').forEach(x=>{x.classList.remove('open');x.setAttribute('aria-expanded','false')});}\ndocument.addEventListener('click',ev=>{if(ev.target.closest?.('[data-rg-relic-detail-close]')||ev.target.closest?.('#back-from-expedition'))closeRelicDetails();});"
s = replace_once(s, old_close, new_close, 'relic detail close behavior')
old_render = "function render(){injectStyle();const box=document.getElementById('expedition-content');if(!box)return;const e=ensure();if(!e)return;box.innerHTML=e.rogueActive?`<div class=\"rogue\">${activeHTML(e.rogueActive)}</div>`:idleHTML(e);if(e.rogueActive)decorateFinalStats(e.rogueActive);ensureRestTicker();refreshRestCountdowns()}"
new_render = "function render(){injectStyle();ensureRelicDetailDock();const box=document.getElementById('expedition-content');if(!box)return;const e=ensure();if(!e)return;if(!e.rogueActive)closeRelicDetails();box.innerHTML=e.rogueActive?`<div class=\"rogue\">${activeHTML(e.rogueActive)}</div>`:idleHTML(e);if(e.rogueActive)decorateFinalStats(e.rogueActive);ensureRestTicker();refreshRestCountdowns()}"
s = replace_once(s, old_render, new_render, 'expedition render dock init')
if "window.QinsterExpedition={render,zones:ZONES,version:'v273'};" not in s:
    raise SystemExit('missing expedition exported version')
s = s.replace("window.QinsterExpedition={render,zones:ZONES,version:'v273'};", "window.QinsterExpedition={render,zones:ZONES,version:'v278'};", 1)
write(p, s)

# ---------- package versions ----------
for path in ['package.json','package-lock.json']:
    p=Path(path); s=read(p)
    if '277.0.0' not in s: raise SystemExit(f'missing 277.0.0 in {path}')
    s=s.replace('277.0.0','278.0.0')
    write(p,s)

# ---------- picker assertion ----------
p=Path('scripts/check-picker.mjs'); s=read(p)
if "assert.equal(w.__qinsterVersion,'v277');" not in s:
    raise SystemExit('missing picker version assertion')
s=s.replace("assert.equal(w.__qinsterVersion,'v277');", "assert.equal(w.__qinsterVersion,'v278');",1)
write(p,s)

print('v278 patch applied')
