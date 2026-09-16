/* Qinster v279 · persistent monster detail dock */
(()=>{
'use strict';
const STORAGE_KEY='qinster-monster-detail-collapsed-v279';
const MOBILE_QUERY='(max-width: 1050px)';
let dock=null, body=null, toggle=null, nameEl=null, farmWorkspace=null;

function savedCollapsed(){
  try{
    const v=localStorage.getItem(STORAGE_KEY);
    if(v==='1')return true;
    if(v==='0')return false;
  }catch(_){ }
  return window.matchMedia(MOBILE_QUERY).matches;
}
function saveCollapsed(v){try{localStorage.setItem(STORAGE_KEY,v?'1':'0')}catch(_){ }}
function updateHeader(){
  if(!dock)return;
  const h=document.querySelector('#companion h2');
  let label='当前选择';
  if(h){
    const clone=h.cloneNode(true);
    clone.querySelectorAll('.stars,.gender-badge,.shiny-badge,.fav-badge,.trait-badge,.farm-badge,.natural-life-badge,.life-badge,.dispatch-badge').forEach(x=>x.remove());
    label=(clone.textContent||'').replace(/\s+/g,' ').trim()||label;
  }
  if(nameEl)nameEl.textContent=label;
}
function syncVisibility(){
  if(!dock)return;
  const hide=!!farmWorkspace?.hidden;
  dock.hidden=hide;
  document.body.classList.toggle('qinster-monster-dock-page-hidden',hide);
}
function setCollapsed(v,{persist=true}={}){
  if(!dock)return;
  dock.classList.toggle('collapsed',!!v);
  document.body.classList.toggle('qinster-monster-dock-collapsed',!!v);
  toggle.textContent=v?'展开':'收起';
  toggle.setAttribute('aria-expanded',String(!v));
  if(persist)saveCollapsed(!!v);
}
function open(){setCollapsed(false)}
function close(){setCollapsed(true)}
function ensureStyle(){
  if(document.getElementById('qinster-monster-detail-dock-style'))return;
  const s=document.createElement('style');
  s.id='qinster-monster-detail-dock-style';
  s.textContent=`
#monster-detail-dock{position:fixed;top:92px;right:12px;width:360px;max-height:calc(100vh - 104px);display:grid;grid-template-rows:auto minmax(0,1fr);background:#9b9b9f;border:4px solid #242229;box-shadow:inset 0 0 0 3px #69656f,6px 6px 0 rgba(24,23,28,.65);z-index:980;color:#202126}
#monster-detail-dock[hidden]{display:none!important}
#monster-detail-dock .monster-detail-dock-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:8px 9px;background:#2c2933;color:#fff;border-bottom:4px solid #e33b34;position:sticky;top:0;z-index:3}
#monster-detail-dock .monster-detail-dock-title{min-width:0;display:grid;gap:2px}
#monster-detail-dock .monster-detail-dock-title b{font-size:14px;color:#fff}
#monster-detail-dock .monster-detail-dock-title small{font-size:9px;color:#d5d1dc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#monster-detail-dock .monster-detail-dock-toggle{flex:0 0 auto;background:#b6b6b9;color:#202126;border:2px solid #65616b;padding:5px 8px;font-size:10px;font-weight:800;box-shadow:inset 1px 1px #ededee,inset -1px -1px #85818a}
#monster-detail-dock .monster-detail-dock-body{overflow:auto;overscroll-behavior:contain;min-height:0;scrollbar-gutter:stable}
#monster-detail-dock #companion{border-top:0;margin:0;min-height:150px}
#monster-detail-dock #companion>.sprite{width:82px}
#monster-detail-dock .companion-actions{position:sticky;bottom:0;background:#c2c2c5;padding:7px 0 2px;z-index:2}
#monster-detail-dock.collapsed{width:auto;max-height:none;grid-template-rows:auto}
#monster-detail-dock.collapsed .monster-detail-dock-body{display:none}
#monster-detail-dock.collapsed .monster-detail-dock-title small{display:none}
#monster-detail-dock.collapsed .monster-detail-dock-head{border-bottom:0}
body.qinster-monster-dock-on{--monster-dock-space:0px}
@media(min-width:1600px){
  body.qinster-monster-dock-on:not(.qinster-monster-dock-collapsed):not(.qinster-monster-dock-page-hidden){--monster-dock-space:390px}
  body.qinster-monster-dock-on:not(.qinster-monster-dock-collapsed):not(.qinster-monster-dock-page-hidden) .shell{max-width:calc(100vw - var(--monster-dock-space));margin-left:14px;margin-right:auto}
}
@media(max-width:1050px){
  #monster-detail-dock{top:auto;left:8px;right:8px;bottom:8px;width:auto;max-height:58vh;box-shadow:0 -5px 0 rgba(24,23,28,.55);z-index:9998}
  #monster-detail-dock .monster-detail-dock-head{padding:7px 9px}
  #monster-detail-dock #companion{grid-template-columns:1fr!important;padding:10px!important}
  #monster-detail-dock #companion>.sprite{width:82px!important;justify-self:center!important}
  #monster-detail-dock .stat-list{grid-template-columns:repeat(5,minmax(0,1fr))!important}
  #monster-detail-dock .monster-detail-dock-body{max-height:calc(58vh - 46px)}
  #monster-detail-dock.collapsed{left:auto;width:auto;max-width:calc(100vw - 16px)}
}
@media(max-width:520px){
  #monster-detail-dock .stat-list{grid-template-columns:repeat(2,minmax(0,1fr))!important}
  #monster-detail-dock .companion-actions{grid-template-columns:1fr 1fr!important}
}
`;
  document.head.appendChild(s);
}
function shouldOpenFromClick(target){
  return !!target.closest('.critter,.monster-card,[data-log-monster],[data-parent-jump],[data-qp-item],#roster-quick [data-quick="family"],#roster-quick [data-quick="rename"]');
}
function build(){
  const companion=document.getElementById('companion');
  if(!companion||document.getElementById('monster-detail-dock'))return;
  farmWorkspace=document.querySelector('.workspace');
  ensureStyle();
  dock=document.createElement('aside');
  dock.id='monster-detail-dock';
  dock.setAttribute('aria-label','怪物详情');
  dock.innerHTML='<div class="monster-detail-dock-head"><div class="monster-detail-dock-title"><b>怪物详情</b><small id="monster-detail-dock-name">当前选择</small></div><button type="button" class="monster-detail-dock-toggle" aria-expanded="true">收起</button></div><div class="monster-detail-dock-body"></div>';
  document.body.appendChild(dock);
  body=dock.querySelector('.monster-detail-dock-body');
  toggle=dock.querySelector('.monster-detail-dock-toggle');
  nameEl=dock.querySelector('#monster-detail-dock-name');
  body.appendChild(companion);
  document.body.classList.add('qinster-monster-dock-on');
  toggle.addEventListener('click',()=>setCollapsed(!dock.classList.contains('collapsed')));
  setCollapsed(savedCollapsed(),{persist:false});
  updateHeader();
  syncVisibility();
  new MutationObserver(updateHeader).observe(companion,{childList:true,subtree:true,characterData:true});
  if(farmWorkspace)new MutationObserver(syncVisibility).observe(farmWorkspace,{attributes:true,attributeFilter:['hidden']});
  document.addEventListener('click',e=>{if(shouldOpenFromClick(e.target))requestAnimationFrame(open)},true);
  window.QinsterMonsterDock={open,close,toggle:()=>setCollapsed(!dock.classList.contains('collapsed')),updateHeader,syncVisibility};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build,{once:true});else build();
})();
