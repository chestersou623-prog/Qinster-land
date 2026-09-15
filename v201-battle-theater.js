(()=>{
'use strict';
const STYLE_ID='qinster-v201-battle-theater-style';
let playingKey='';
function R(){return window.QinsterRuntime||null}
function S(){return R()?.getState?.()||null}
function ensureStyle(){if(document.getElementById(STYLE_ID))return;const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`
.rg-battle-theater{margin:10px 0 12px;background:#282531;border:4px solid #18161d;box-shadow:inset 0 0 0 2px #5d5865;padding:10px;color:#fff;overflow:hidden}
.rg-bt-head{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px}.rg-bt-head b{color:#f2c451}.rg-bt-controls{display:flex;gap:5px}.rg-bt-controls button{padding:5px 8px;font-size:9px}
.rg-bt-gauges{display:grid;grid-template-columns:minmax(0,1fr) 150px;gap:10px;margin:7px 0;padding:6px;background:#1d1a22;border:2px solid #57525e}.rg-bt-gauge-allies{display:flex;flex-direction:row-reverse;gap:5px}.rg-bt-gauge-allies>.rg-bt-gauge{flex:1}.rg-bt-gauge{min-width:0;padding:3px 4px;background:#2b2731;border:1px solid #706a77}.rg-bt-gauge small{display:flex;justify-content:space-between;gap:4px;font-size:8px;color:#fff3bf;white-space:nowrap;overflow:hidden}.rg-bt-gauge small span{color:#fff;font-weight:900}.rg-bt-charge{height:10px;margin-top:3px;background:#111;border:1px solid #69636f;overflow:hidden}.rg-bt-charge i{display:block;width:0%;height:100%;background:#f2c451}.rg-bt-gauge.ready{box-shadow:0 0 0 2px #ffe36f;filter:brightness(1.18)}.rg-bt-gauge.dead{opacity:.32}.rg-bt-gauge.dead .rg-bt-charge i{width:0%!important}.rg-bt-gauge-enemy .rg-bt-charge i{background:#d8675f}
.rg-bt-field{position:relative;min-height:235px;border:3px solid #69636f;background:linear-gradient(#5d6b72 0 48%,#66734f 48% 100%);overflow:hidden}
.rg-bt-field:before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 22% 82%,rgba(255,255,255,.12),transparent 28%),radial-gradient(ellipse at 78% 82%,rgba(0,0,0,.18),transparent 30%),repeating-linear-gradient(90deg,rgba(255,255,255,.025) 0 5px,transparent 5px 10px);pointer-events:none}
.rg-bt-side{position:absolute;inset:0;display:flex;align-items:flex-end;pointer-events:none}.rg-bt-allies{left:4%;right:51%;justify-content:space-around;flex-direction:row-reverse;padding-bottom:28px}.rg-bt-enemies{left:53%;right:4%;justify-content:center;padding-bottom:35px}
.rg-bt-unit{position:relative;width:88px;text-align:center;transition:transform .18s steps(3,end),filter .12s}.rg-bt-unit .sprite{width:72px!important;margin:auto;filter:drop-shadow(3px 4px 0 rgba(0,0,0,.35))}.rg-bt-unit small{display:block;background:#24212a;color:#fff3bf;border:1px solid #77717e;padding:2px 3px;margin-top:2px;font-size:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rg-bt-unit.hit{animation:rgBtHit .22s steps(2,end)}.rg-bt-unit.attack{animation:rgBtAttack .28s steps(3,end)}.rg-bt-enemy.attack{animation:rgBtEnemyAttack .28s steps(3,end)}.rg-bt-enemy.hit{animation:rgBtHit .22s steps(2,end)}
.rg-bt-enemy-card{width:150px;text-align:center}.rg-bt-enemy-card .sprite{width:92px!important;margin:auto;transform:scaleX(-1);filter:drop-shadow(4px 5px 0 rgba(0,0,0,.4))}.rg-bt-boss .sprite{width:112px!important}.rg-bt-enemy-info{margin-top:4px;background:rgba(36,33,42,.94);border:1px solid #77717e;padding:4px 5px}.rg-bt-enemy-info small{display:block;color:#fff3bf;font-size:8px;line-height:1.35;white-space:normal}.rg-bt-float{z-index:40}
.rg-bt-hp{height:9px;background:#17151b;border:1px solid #817a88;margin-top:4px}.rg-bt-hp i{display:block;height:100%;background:#78ae62;transition:width .35s linear}.rg-bt-enemy-card .rg-bt-hp i{background:#c84b45}
.rg-bt-float{position:absolute;z-index:20;font-size:14px;font-weight:900;color:#fff;text-shadow:2px 2px #401414;animation:rgBtFloat .65s ease-out forwards;pointer-events:none}.rg-bt-crit{color:#ffe36f;font-size:18px}.rg-bt-miss{color:#d5d1dc}
.rg-bt-banner{position:absolute;left:50%;top:12px;transform:translateX(-50%);z-index:30;background:#211e27;color:#ffe36f;border:2px solid #817a88;padding:5px 10px;font-size:10px;font-weight:900}
.rg-bt-feed{min-height:38px;margin-top:8px;background:#17151b;border:2px solid #57525e;padding:7px 9px;font-size:10px;line-height:1.5;color:#eee}.rg-bt-feed strong{color:#f2c451}
.rg-bt-result{font-weight:900}.rg-bt-result.win{color:#9bd286}.rg-bt-result.lose{color:#ff8178}
@keyframes rgBtAttack{50%{transform:translateX(18px) translateY(-3px)}}@keyframes rgBtEnemyAttack{50%{transform:translateX(-18px) translateY(-3px)}}@keyframes rgBtHit{25%{transform:translateX(-5px);filter:brightness(2)}75%{transform:translateX(5px);filter:brightness(.65)}}@keyframes rgBtFloat{0%{opacity:0;transform:translateY(0)}20%{opacity:1}100%{opacity:0;transform:translateY(-34px)}}
@media(max-width:760px){.rg-bt-gauges{grid-template-columns:1fr;gap:5px}.rg-bt-gauge-enemy{max-width:none}.rg-bt-field{min-height:205px}.rg-bt-unit{width:62px}.rg-bt-unit .sprite{width:52px!important}.rg-bt-enemy-card .sprite{width:72px!important}.rg-bt-boss .sprite{width:86px!important}.rg-bt-allies{left:1%;right:49%;}.rg-bt-enemies{left:51%;right:1%}.rg-bt-head{display:grid}}
`;document.head.appendChild(s)}
function esc(x){return String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function currentRun(){return S()?.expedition?.rogueActive||null}
function team(run){const map=new Map((S()?.monsters||[]).map(m=>[m.id,m]));return (run?.teamIds||[]).map(id=>map.get(id)).filter(Boolean)}
function enemyMonster(run,b){if(Number.isInteger(b?.enemySpecies))return b.enemySpecies;const all=Object.keys(R()?.G?.SPECIES||{});if(!all.length)return null;const tier=Number(String(run?.zone||'d1').replace('d',''))||1;return (tier*11+(run?.stage||0)*7)%all.length}
function sprite(species,shiny=false){try{return R()?.sprite?.(species,null,shiny,null)||''}catch{return ''}}
function name(m){try{return R()?.name?.(m)||R()?.G?.SPECIES?.[m.species]?.name||'怪物'}catch{return '怪物'}}
function statSpeed(m){try{return Math.round(Number(R()?.G?.stats?.(m)?.[3])||0)}catch{return 0}}
function battleKey(run){const b=run?.battle||{};return [run?.zone,run?.stage,b.kind,b.rounds,b.enemyMax,b.win].join('|')}
function estimateDamage(log){const m=String(log).match(/(?:造成|受到|伤害)\D*(\d+)/);return m?Math.max(1,Number(m[1])):null}
function estimateHpLoss(log){const m=String(log).match(/远征生命\s*-\s*(\d+(?:\.\d+)?)%/);return m?Math.max(0,Number(m[1])):null}
function isEnemyLine(log){return /(敌|守卫|首领|反击|攻击了|击中)/.test(log)&&!/(造成.*敌|对.*造成)/.test(log)}
function isCrit(log){return /(暴击|致命|CRIT)/i.test(log)}
function isMiss(log){return /(闪避|未命中|躲开|MISS)/i.test(log)}
function mount(){ensureStyle();const host=document.querySelector('.rg-battle');if(!host||document.querySelector('.rg-battle-theater'))return;const run=currentRun();if(!run?.battle)return;const b=run.battle,t=team(run),enemySpec=enemyMonster(run,b),enemyName=b.kind==='boss'?'区域首领':b.kind==='elite'?'精英守卫':'野外守卫';const box=document.createElement('section');box.className='rg-battle-theater';box.innerHTML=`<div class="rg-bt-head"><div><b>${b.kind==='boss'?'BOSS战':b.kind==='elite'?'精英战':'自动战斗'}</b><small> · 实时回放</small></div><div class="rg-bt-controls"><button class="secondary" data-bt-speed>速度 ×1</button><button class="secondary" data-bt-skip>跳过</button></div></div><div class="rg-bt-gauges"><div class="rg-bt-gauge-allies">${t.map((m,i)=>`<div class="rg-bt-gauge ${Math.max(0,Number(b.startHp?.[m.id] ?? run.hp?.[m.id])||0)<=0?'dead':''}" data-bt-gauge-ally="${i}"><small><span>${esc(name(m))} · 速 ${statSpeed(m)}</span><span data-bt-gauge-pct>0%</span></small><div class="rg-bt-charge"><i></i></div></div>`).join('')}</div><div class="rg-bt-gauge rg-bt-gauge-enemy" data-bt-gauge-enemy><small><span>敌方 · 速 ${Math.round(Number(b.enemySpd)||0)}</span><span data-bt-gauge-pct>0%</span></small><div class="rg-bt-charge"><i></i></div></div></div><div class="rg-bt-field"><div class="rg-bt-banner">行动准备</div><div class="rg-bt-side rg-bt-allies">${t.map((m,i)=>{const startHp=Math.max(0,Math.min(100,Number(b.startHp?.[m.id] ?? run.hp?.[m.id])||0));return `<div class="rg-bt-unit" data-bt-ally="${i}">${sprite(m.species,m.shiny)}<small>${esc(name(m))}</small><div class="rg-bt-hp"><i style="width:${startHp}%"></i></div></div>`}).join('')}</div><div class="rg-bt-side rg-bt-enemies"><div class="rg-bt-enemy rg-bt-enemy-card ${b.kind==='boss'?'rg-bt-boss':''}" data-bt-enemy>${enemySpec!==null&&enemySpec!==undefined?sprite(enemySpec,b.kind==='boss'):''}<div class="rg-bt-enemy-info"><small>${enemyName}</small><small>HP ${b.enemyMax||'?'} · 攻 ${b.enemyAtk||'?'} · 防 ${b.enemyDef||'?'} · 速 ${b.enemySpd||'?'} · 运 ${b.enemyLuck||'?'}</small><small>敌 ${b.enemyPower||'?'} / 我 ${b.teamPower||'?'}</small><div class="rg-bt-hp"><i style="width:100%"></i></div></div></div></div></div><div class="rg-bt-feed">准备战斗……</div>`;host.parentNode.insertBefore(box,host);host.style.display='none';const next=document.querySelector('[data-rg-battle-next]');if(next)next.disabled=true;play(box,run,host,next)}
async function play(box,run,original,next){
  const key=battleKey(run);playingKey=key;const b=run.battle,events=Array.isArray(b.events)?b.events:[],allies=team(run);
  let speed=1,skip=false,enemyHp=100,allyHp=allies.map(m=>Math.max(0,Math.min(100,Number(b.startHp?.[m.id] ?? run.hp?.[m.id])||0)));
  const speedBtn=box.querySelector('[data-bt-speed]'),skipBtn=box.querySelector('[data-bt-skip]'),feed=box.querySelector('.rg-bt-feed'),banner=box.querySelector('.rg-bt-banner');
  speedBtn?.addEventListener('click',()=>{speed=speed===1?2:speed===2?4:1;speedBtn.textContent='速度 ×'+speed});skipBtn?.addEventListener('click',()=>{skip=true});
  const sleep=ms=>new Promise(r=>setTimeout(r,ms/Math.max(1,speed)));
  const gaugeState={enemy:0,allies:Object.fromEntries(allies.map(m=>[m.id,0]))};
  const setGauge=(g,val)=>{if(!g)return;const v=Math.max(0,Math.min(100,val||0)),bar=g.querySelector('.rg-bt-charge i'),pct=g.querySelector('[data-bt-gauge-pct]');if(bar)bar.style.width=v+'%';if(pct)pct.textContent=Math.round(v)+'%'};
  const drawGauges=state=>{allies.forEach((m,i)=>{const g=box.querySelector(`[data-bt-gauge-ally="${i}"]`);setGauge(g,state.allies?.[m.id]||0)});setGauge(box.querySelector('[data-bt-gauge-enemy]'),state.enemy||0)};
  const animateGauges=async(ev)=>{
    const target=ev.gauges||{enemy:ev.type==='enemy'?100:gaugeState.enemy,allies:{...gaugeState.allies}};
    const from={enemy:gaugeState.enemy,allies:{...gaugeState.allies}};
    const duration=Math.max(180,Math.min(950,(Number(ev.wait)||.35)*1350));
    let virtual=0,last=performance.now();
    while(virtual<duration&&!skip&&battleKey(currentRun())===key){const now=performance.now();virtual+=(now-last)*Math.max(1,speed);last=now;const q=Math.min(1,virtual/duration),cur={enemy:from.enemy+(Number(target.enemy||0)-from.enemy)*q,allies:{}};allies.forEach(m=>{const a=Number(from.allies[m.id]||0),z=Number(target.allies?.[m.id]||0);cur.allies[m.id]=a+(z-a)*q});drawGauges(cur);if(q>=1)break;await new Promise(r=>requestAnimationFrame(r))}
    gaugeState.enemy=Number(target.enemy||0);allies.forEach(m=>gaugeState.allies[m.id]=Number(target.allies?.[m.id]||0));drawGauges(gaugeState);
  };
  drawGauges(gaugeState);
  if(events.length){
    for(const ev of events){
      if(skip||battleKey(currentRun())!==key)break;
      banner.textContent=(ev.skillName?'技能 · '+ev.skillName:'ACTION '+(ev.action||''));
      await animateGauges(ev);
      if(skip||battleKey(currentRun())!==key)break;
      if(ev.type==='ally'){
        const idx=allies.findIndex(m=>m.id===ev.actorId);if(idx<0||allyHp[idx]<=0)continue;
        const g=box.querySelector(`[data-bt-gauge-ally="${idx}"]`),a=box.querySelector(`[data-bt-ally="${idx}"]`),enemy=box.querySelector('[data-bt-enemy]');g?.classList.add('ready');await sleep(60);a?.classList.add('attack');await sleep(100);
        enemyHp=Math.max(0,Math.min(100,(Number(ev.enemyHp)||0)/Math.max(1,Number(b.enemyMax)||1)*100));enemy?.querySelector('.rg-bt-hp i')?.style.setProperty('width',enemyHp+'%');enemy?.classList.add('hit');float(box,enemy,'-'+Math.max(1,Math.round(ev.damage||0)),!!ev.crit,false);feed.innerHTML=(ev.crit?'<strong>暴击！</strong> ':'')+esc(name(allies[idx]))+' 行动条满，造成 '+Math.round(ev.damage||0)+' 伤害';
        await sleep(160);a?.classList.remove('attack');enemy?.classList.remove('hit');g?.classList.remove('ready');gaugeState.allies[ev.actorId]=0;setGauge(g,0);
      }else if(ev.type==='enemy'){
        const idx=allies.findIndex(m=>m.id===ev.targetId);if(idx<0)continue;const g=box.querySelector('[data-bt-gauge-enemy]'),enemy=box.querySelector('[data-bt-enemy]'),el=box.querySelector(`[data-bt-ally="${idx}"]`);g?.classList.add('ready');await sleep(60);enemy?.classList.add('attack');await sleep(120);
        const loss=Math.max(0,Number(ev.hpLoss)||0);allyHp[idx]=Math.max(0,Number(ev.hpAfter));el?.querySelector('.rg-bt-hp i')?.style.setProperty('width',allyHp[idx]+'%');el?.classList.add('hit');float(box,el,'-'+Math.max(1,Math.round(loss))+'%',false,false);feed.innerHTML='<strong>敌方行动条满！</strong> 攻击 '+esc(name(allies[idx]))+'，远征生命 -'+Math.round(loss)+'%';
        await sleep(190);enemy?.classList.remove('attack');el?.classList.remove('hit');g?.classList.remove('ready');gaugeState.enemy=0;setGauge(g,0);if(allyHp[idx]<=0){const ag=box.querySelector(`[data-bt-gauge-ally="${idx}"]`);ag?.classList.add('dead');gaugeState.allies[ev.targetId]=0;setGauge(ag,0)}
      }
      await sleep(90);
    }
  }else{
    feed.textContent='旧战斗记录：无法显示实时行动条。';await sleep(450);
  }
  if(battleKey(currentRun())!==key)return;
  const finalEnemy=Math.max(0,Math.min(100,(Number(b.enemyHp)||0)/Math.max(1,Number(b.enemyMax)||1)*100));box.querySelector('[data-bt-enemy] .rg-bt-hp i')?.style.setProperty('width',finalEnemy+'%');allies.forEach((m,i)=>{const p=Math.max(0,Math.min(100,Number(run.hp?.[m.id])||0));box.querySelector(`[data-bt-ally="${i}"] .rg-bt-hp i`)?.style.setProperty('width',p+'%')});banner.textContent=b.win?'VICTORY':'DEFEAT';feed.innerHTML=`<span class="rg-bt-result ${b.win?'win':'lose'}">${b.win?'战斗胜利！':'战斗失败'}</span> · ${b.atb?(b.actions||events.length)+' 次行动':(b.rounds||0)+' 回合'}`;if(original)original.style.display='grid';if(next)next.disabled=false
}
function float(box,target,text,crit,miss){if(!target)return;const f=document.createElement('div');f.className='rg-bt-float'+(crit?' rg-bt-crit':'')+(miss?' rg-bt-miss':'');f.textContent=text;const tr=target.getBoundingClientRect(),br=box.querySelector('.rg-bt-field').getBoundingClientRect();f.style.left=(tr.left-br.left+tr.width/2-12)+'px';f.style.top=(tr.top-br.top+8)+'px';box.querySelector('.rg-bt-field').appendChild(f);setTimeout(()=>f.remove(),700)}
const obs=new MutationObserver(()=>{if(document.querySelector('.rg-battle')&&!document.querySelector('.rg-battle-theater'))setTimeout(mount,0)});function init(){ensureStyle();obs.observe(document.body,{childList:true,subtree:true});mount()}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();