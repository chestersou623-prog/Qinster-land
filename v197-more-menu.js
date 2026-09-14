(()=>{
'use strict';
const KEEP_IDS=new Set(['dispatch-btn','expedition-btn','shop-btn','bag-btn','dex-btn','skill-btn']);
const GROUPS=[
  {title:'牧场与教学',match:t=>/牧场名|新手教学/.test(t)},
  {title:'存档管理',match:t=>/导出存档|导入存档/.test(t)},
  {title:'系统与帮助',match:t=>/音效|玩法说明/.test(t)}
];
function injectStyle(){
  if(document.getElementById('qinster-more-style'))return;
  const st=document.createElement('style');st.id='qinster-more-style';st.textContent=`
  header{overflow:visible}
  .more-wrap{position:relative;display:flex;align-items:center}
  #more-btn{min-width:62px}
  .more-menu{position:absolute;right:0;top:calc(100% + 8px);width:280px;background:#35313c;color:#fff;border:3px solid #77727f;box-shadow:5px 5px 0 #18171c;padding:8px;z-index:1000;display:none}
  .more-menu.open{display:block}
  .more-group{padding:7px;background:#45414d;border:2px solid #66616d;margin-bottom:7px}
  .more-group:last-child{margin-bottom:0}
  .more-group-title{font-size:9px;letter-spacing:1px;color:#d8d4df;margin:0 0 6px}
  .more-group-actions{display:grid;grid-template-columns:1fr 1fr;gap:6px}
  .more-menu button{width:100%;min-height:38px;padding:6px 8px;font-size:11px}
  .more-menu .more-empty{font-size:9px;color:#aaa6b1;padding:3px}
  @media(max-width:900px){header{gap:7px;padding-left:8px;padding-right:8px}.more-menu{position:fixed;right:10px;left:10px;top:76px;width:auto;max-height:calc(100vh - 90px);overflow:auto}.more-group-actions{grid-template-columns:1fr}.more-menu button{min-height:42px}}
  `;document.head.appendChild(st);
}
function textOf(el){return (el.textContent||'').replace(/\s+/g,'').trim();}
function findCandidates(header){
  return [...header.querySelectorAll('button')].filter(b=>{
    if(b.id==='more-btn'||KEEP_IDS.has(b.id))return false;
    const t=textOf(b);
    return GROUPS.some(g=>g.match(t));
  });
}
function build(){
  const header=document.querySelector('header');if(!header||document.getElementById('more-btn'))return;
  injectStyle();
  const wrap=document.createElement('div');wrap.className='more-wrap';
  const btn=document.createElement('button');btn.type='button';btn.id='more-btn';btn.className='subtle';btn.textContent='更多';btn.setAttribute('aria-expanded','false');
  const menu=document.createElement('div');menu.className='more-menu';menu.id='more-menu';
  GROUPS.forEach(g=>{const sec=document.createElement('section');sec.className='more-group';sec.dataset.group=g.title;sec.innerHTML='<div class="more-group-title">'+g.title+'</div><div class="more-group-actions"></div>';menu.appendChild(sec);});
  wrap.append(btn,menu);header.appendChild(wrap);
  const relocate=()=>{
    const candidates=findCandidates(header);
    for(const el of candidates){
      const t=textOf(el),g=GROUPS.find(x=>x.match(t));if(!g)continue;
      const target=menu.querySelector('[data-group="'+g.title+'"] .more-group-actions');
      if(target&&!target.contains(el))target.appendChild(el);
    }
  };
  relocate();
  const obs=new MutationObserver(relocate);obs.observe(header,{childList:true,subtree:true});
  btn.onclick=e=>{e.stopPropagation();const open=!menu.classList.contains('open');menu.classList.toggle('open',open);btn.setAttribute('aria-expanded',String(open));};
  menu.addEventListener('click',e=>e.stopPropagation());
  document.addEventListener('click',()=>{menu.classList.remove('open');btn.setAttribute('aria-expanded','false');});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.classList.remove('open');btn.setAttribute('aria-expanded','false');btn.focus();}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(build,0));else setTimeout(build,0);
})();
