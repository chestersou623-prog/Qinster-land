(()=>{
'use strict';
const G=window.MonsterGame;
if(!G||!Array.isArray(G.SPECIES))return;

const STAT_BANDS=G.STAT_BANDS||{1:[1,100],2:[1,200],3:[100,300],4:[200,400],5:[300,500]};
const sourceRanges=Array.from({length:5},(_,i)=>{
  const vals=G.SPECIES.map(sp=>Number(sp.base?.[i])||0);
  return [Math.min(...vals),Math.max(...vals)];
});
function roleBonus(sp,i){
  const p=sp?.passive;
  if(p==='guard'&&i===2)return 10;
  if(p==='self_speed'&&i===3)return 10;
  if(p==='fortune'&&i===4)return 8;
  if(p==='mission_success'&&(i===2||i===3))return i===3?8:4;
  if(p==='mission_item'&&i===4)return 12;
  if(p==='mission_guard'&&(i===0||i===2))return i===2?12:6;
  if(p==='mission_reward'&&i===1)return 10;
  if(p==='mission_hunt'&&(i===3||i===4))return i===4?10:6;
  return 0;
}
const RACE_STATS=G.SPECIES.map(sp=>sp.base.map((v,i)=>{
  const [mn,mx]=sourceRanges[i],span=Math.max(1,mx-mn);
  const normalized=Math.max(0,Math.min(1,(Number(v)-mn)/span));
  return Math.max(1,Math.min(100,Math.round(1+normalized*99+roleBonus(sp,i))));
}));
G.RACE_STATS=RACE_STATS;
G.stats=function(m){
  const sp=G.SPECIES[m.species],lv=G.skillLevel(m),band=STAT_BANDS[Math.max(1,Math.min(5,Number(m.star)||1))]||STAT_BANDS[1];
  const lo=band[0],hi=band[1],span=Math.max(1,hi-lo);
  return sp.base.map((_,i)=>{
    const race=RACE_STATS[m.species]?.[i]??50;
    const speciesBias=Math.max(0,Math.min(1,(race-1)/99));
    const gene=Number(m.genes?.[i]);
    const geneBias=Math.max(0,Math.min(1,((Number.isFinite(gene)?gene:1)-.65)/.85));
    const quality=speciesBias*.62+geneBias*.38;
    let value=lo+span*quality;
    if(sp.passive==='guard'&&i===2)value*=1+.04*lv;
    if(sp.passive==='self_speed'&&i===3)value*=1+.025*lv;
    return Math.max(lo,Math.min(hi,Math.round(value)));
  });
};
G.statGrade=function(m){
  const vals=G.stats(m),band=STAT_BANDS[Math.max(1,Math.min(5,Number(m.star)||1))]||STAT_BANDS[1];
  const min=band[0]*5,max=band[1]*5,total=vals.reduce((a,b)=>a+b,0);
  const pct=max<=min?1:Math.max(0,Math.min(1,(total-min)/(max-min)));
  const grade=pct>=.80?'S':pct>=.65?'A':pct>=.50?'B':pct>=.35?'C':'D';
  return {total,grade,pct,band};
};

function addStyle(){
  if(document.getElementById('v193-race-style'))return;
  const style=document.createElement('style');
  style.id='v193-race-style';
  style.textContent=`
.roster-filter-toggle-row{display:flex;align-items:center;gap:10px;padding:8px 12px;background:#504c58;border-top:2px solid #74707a;border-bottom:2px solid #403c46;color:#eee}
.roster-filter-toggle-row button{min-width:150px}.roster-filter-toggle-row span{font-size:9px;color:#d6d2db}.roster-filter-panel-v193.is-collapsed{display:none!important}
.species-stat-panel-v193{margin:10px 0 14px;background:#aaa9ae;border:4px solid #242229;box-shadow:inset 0 0 0 2px #77737d}.species-stat-panel-v193>summary{cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 12px;background:#302d36;color:#fff;border-bottom:3px solid #e33b34;list-style:none}.species-stat-panel-v193>summary::-webkit-details-marker{display:none}.species-stat-panel-v193>summary b{font-size:14px}.species-stat-panel-v193>summary span{font-size:9px;color:#e7dda9}.species-stat-panel-v193>summary::after{content:'▼';font-size:11px;color:#f2c451}.species-stat-panel-v193:not([open])>summary::after{content:'▶'}.species-stat-note-v193{margin:9px 12px;font-size:10px;line-height:1.55;color:#48444e}.species-stat-table-wrap-v193{margin:0 10px 10px;overflow:auto;max-height:540px;border:2px solid #706c76;background:#d1d0d5}.species-stat-table-v193{width:100%;border-collapse:collapse;min-width:760px;font-size:10px}.species-stat-table-v193 th{position:sticky;top:0;z-index:2;background:#3a3642;color:#fff;padding:7px 6px;border:1px solid #69646f}.species-stat-table-v193 td{padding:6px;border:1px solid #aaa6af;text-align:center}.species-stat-table-v193 td:nth-child(2){text-align:left;font-weight:900}.species-stat-table-v193 tbody tr:nth-child(even){background:#c5c4c9}.species-stat-table-v193 tbody tr:hover{background:#eee5bd}.species-stat-total-v193{font-weight:900;color:#5c4313}.species-stat-role-v193{font-size:9px;color:#51475d}
@media(max-width:720px){.roster-filter-toggle-row span{display:none}.roster-filter-toggle-row button{width:100%}.species-stat-panel-v193>summary{align-items:flex-start;flex-direction:column}.species-stat-table-wrap-v193{max-height:430px}}
`;
  document.head.appendChild(style);
}
function initRosterCollapse(){
  if(window.QinsterPicker)return;
  const panel=document.querySelector('.sort-bar.sort-bar-advanced');
  if(!panel||document.getElementById('roster-filter-toggle'))return;
  panel.classList.add('roster-filter-panel-v193','is-collapsed');
  const row=document.createElement('div');row.className='roster-filter-toggle-row';
  row.innerHTML='<button type="button" id="roster-filter-toggle" class="secondary" aria-expanded="false">筛选 / 排序 ▼</button><span>需要时再展开，减少怪物盒上方占用空间。</span>';
  panel.parentNode.insertBefore(row,panel);
  const btn=row.querySelector('button'),key='qinster-roster-filter-collapsed';let collapsed=true;
  try{const saved=localStorage.getItem(key);if(saved!==null)collapsed=saved!=='0';}catch(_){}
  const apply=()=>{panel.classList.toggle('is-collapsed',collapsed);btn.setAttribute('aria-expanded',String(!collapsed));btn.textContent=collapsed?'筛选 / 排序 ▼':'收起筛选 / 排序 ▲';};
  apply();btn.onclick=()=>{collapsed=!collapsed;try{localStorage.setItem(key,collapsed?'1':'0');}catch(_){}apply();};
}
function archetype(vals){
  const names=['体质','攻击','防御','速度','幸运'],ranked=vals.map((v,i)=>({v,i})).sort((a,b)=>b.v-a.v);
  return ranked[0].v-ranked[1].v<=5?names[ranked[0].i]+' / '+names[ranked[1].i]+'型':names[ranked[0].i]+'型';
}
function initRaceTable(){
  const dex=document.getElementById('dex-page'),content=document.getElementById('dex-content');
  if(!dex||!content||document.getElementById('species-stat-panel-v193'))return;
  const details=document.createElement('details');details.id='species-stat-panel-v193';details.className='species-stat-panel-v193';details.open=true;
  const rows=G.SPECIES.map((sp,i)=>{const v=RACE_STATS[i],total=v.reduce((a,b)=>a+b,0);return '<tr><td>'+(i+1)+'</td><td>'+sp.name+'</td><td>'+sp.element+'</td>'+v.map(n=>'<td>'+n+'</td>').join('')+'<td class="species-stat-total-v193">'+total+'</td><td class="species-stat-role-v193">'+archetype(v)+'</td></tr>';}).join('');
  details.innerHTML='<summary><b>'+G.SPECIES.length+' 种怪物完整种族值表</b><span>体质 / 攻击 / 防御 / 速度 / 幸运 · 每项 1–100</span></summary><p class="species-stat-note-v193">种族值代表品种天生倾向；最终能力仍由星级区间 + 种族值 62% + 个体基因 38% 计算，部分种族技能会再修正对应能力。</p><div class="species-stat-table-wrap-v193"><table class="species-stat-table-v193"><thead><tr><th>#</th><th>品种</th><th>系别</th><th>体质</th><th>攻击</th><th>防御</th><th>速度</th><th>幸运</th><th>总和</th><th>倾向</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
  dex.insertBefore(details,content);
}
function refreshVisibleStats(){
  try{if(typeof window.render==='function')window.render();}catch(_){}
}
function init(){addStyle();initRosterCollapse();initRaceTable();refreshVisibleStats();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,0),{once:true});else setTimeout(init,0);
})();
