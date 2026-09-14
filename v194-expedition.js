(()=>{
'use strict';
const STAT_NAMES=['体质','攻击','防御','速度','幸运'];
const ZONES=[
  {id:'d1',tier:1,name:'草原遗迹',label:'难度 I',minStar:1,shinyOnly:false,attempts:5,diffAdd:0,rewardMul:1.00,clearBonus:1200,badge:1,desc:'最低 1★ · 入门远征'},
  {id:'d2',tier:2,name:'林野古径',label:'难度 II',minStar:2,shinyOnly:false,attempts:5,diffAdd:85,rewardMul:1.45,clearBonus:2200,badge:2,desc:'最低 2★ · 开始重视队伍分工'},
  {id:'d3',tier:3,name:'河谷深处',label:'难度 III',minStar:3,shinyOnly:false,attempts:5,diffAdd:150,rewardMul:2.05,clearBonus:3800,badge:3,desc:'最低 3★ · 能力搭配明显影响成功率'},
  {id:'d4',tier:4,name:'失落遗迹',label:'难度 IV',minStar:4,shinyOnly:false,attempts:5,diffAdd:245,rewardMul:2.90,clearBonus:6200,badge:5,desc:'最低 4★ · 种族值与基因开始决定差距'},
  {id:'d5',tier:5,name:'星门禁区',label:'难度 V',minStar:5,shinyOnly:false,attempts:5,diffAdd:335,rewardMul:4.10,clearBonus:10000,badge:8,desc:'仅 5★ · 普通怪物最高难度'},
  {id:'d6',tier:6,name:'闪光秘境',label:'难度 VI',minStar:5,shinyOnly:true,attempts:5,diffAdd:380,rewardMul:5.50,clearBonus:16000,badge:12,desc:'仅 5★闪光 · 终局远征'}
];
const EVENTS={
  fallen:{title:'倒木封路',text:'巨大的枯木横在旧路中央。',choices:[{label:'合力推开',stat:1,diff:72,reward:260},{label:'从树缝快速穿过',stat:3,diff:68,reward:220}]},
  bridge:{title:'断裂木桥',text:'桥面已经塌了一半，下面是湍急的溪流。',choices:[{label:'快速跃过断口',stat:3,diff:82,reward:300},{label:'稳住桥板慢慢通过',stat:2,diff:78,reward:270}]},
  mist:{title:'低地迷雾',text:'白雾盖住了草径，远处只能看到模糊的石柱。',choices:[{label:'凭直觉寻找旧路',stat:4,diff:86,reward:330},{label:'硬撑着穿过湿雾',stat:0,diff:80,reward:280}]},
  beast:{title:'遗迹守兽',text:'一只陌生野兽挡住入口，正在观察你的队伍。',choices:[{label:'正面震慑',stat:1,diff:94,reward:380},{label:'顶住冲击慢慢逼退',stat:2,diff:90,reward:350}]},
  ravine:{title:'狭窄裂谷',text:'旧路被裂谷切开，只剩一条危险的边缘通道。',choices:[{label:'沿边缘快速通过',stat:3,diff:98,reward:390},{label:'依靠体力稳步前进',stat:0,diff:92,reward:350}]},
  cache:{title:'隐蔽补给箱',text:'石墙后似乎藏着一个很久没人开启的箱子。',choices:[{label:'寻找机关',stat:4,diff:100,reward:460},{label:'直接破开外壳',stat:1,diff:106,reward:430}]},
  runes:{title:'风化符文门',text:'石门上残留着几处仍会发光的符文。',choices:[{label:'观察规律',stat:4,diff:108,reward:500},{label:'撑住石门强行开启',stat:0,diff:112,reward:470}]},
  chase:{title:'闪过的影子',text:'草丛里有稀有生物一闪而过。',choices:[{label:'立刻追上去',stat:3,diff:112,reward:520},{label:'预测它的路线',stat:4,diff:116,reward:560}]},
  core:{title:'远征核心',text:'远征最后的核心发出微弱光芒，这是本次最困难的考验。',choices:[{label:'集中力量启动核心',stat:1,diff:120,reward:650},{label:'寻找最安全的启动顺序',stat:4,diff:122,reward:700}]}
};
const EVENT_POOL=['fallen','bridge','mist','beast','ravine','cache','runes','chase'];
let selected=[],selectedZone='d1',sortMode='recommended';
function rt(){return window.QinsterRuntime||null;}
function state(){return rt()?.getState?.()||null;}
function zone(id=selectedZone){return ZONES.find(z=>z.id===id)||ZONES[0];}
function dayKey(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function ensure(){
  const s=state();if(!s)return null;
  if(!s.expedition||typeof s.expedition!=='object')s.expedition={};
  const e=s.expedition;
  if(e.dayKey!==dayKey()){e.dayKey=dayKey();e.usedByZone={};}
  if(!e.usedByZone||typeof e.usedByZone!=='object'){
    e.usedByZone={d1:Math.max(0,Number(e.used)||0)};
    delete e.used;
  }
  e.badges=Math.max(0,Number(e.badges)||0);
  if(e.lastZone&&ZONES.some(z=>z.id===e.lastZone))selectedZone=e.lastZone;
  if(!Array.isArray(selected)||!selected.length)selected=(e.lastTeamIds||[]).slice(0,3);
  return e;
}
function eligibleFor(z){const s=state(),R=rt();if(!s||!R)return[];return (s.monsters||[]).filter(m=>m&&m.life>0&&!R.isDispatched(m.id)&&(m.star||1)>=z.minStar&&(!z.shinyOnly||m.shiny));}
function n(m){return rt()?.name?.(m)||rt()?.G?.SPECIES?.[m.species]?.name||('怪物 #'+m.id);}
function stats(m){return rt()?.G?.stats?.(m)||[0,0,0,0,0];}
function stars(m){return rt()?.G?.stars?.(m.star)||'★'.repeat(m.star||1);}
function team(z=zone()){const by=new Map(eligibleFor(z).map(m=>[m.id,m]));return selected.map(id=>by.get(id)).filter(Boolean);}
function recommendationScore(m,z=zone()){
  const v=stats(m),total=v.reduce((a,b)=>a+b,0),floor=Math.min(...v),top=[...v].sort((a,b)=>b-a).slice(0,2).reduce((a,b)=>a+b,0);
  return total+floor*1.35+top*.18+(m.star||1)*35+(m.shiny?12:0);
}
function sortedEligible(z=zone()){
  const list=[...eligibleFor(z)];
  list.sort((a,b)=>{
    if(sortMode==='newest')return (b.createdAt||b.id||0)-(a.createdAt||a.id||0);
    if(sortMode==='oldest')return (a.createdAt||a.id||0)-(b.createdAt||b.id||0);
    if(sortMode==='total')return stats(b).reduce((x,y)=>x+y,0)-stats(a).reduce((x,y)=>x+y,0)||(b.id-a.id);
    if(sortMode==='star')return (b.star||1)-(a.star||1)||stats(b).reduce((x,y)=>x+y,0)-stats(a).reduce((x,y)=>x+y,0)||(b.id-a.id);
    if(sortMode==='luck')return (stats(b)[4]||0)-(stats(a)[4]||0)||recommendationScore(b,z)-recommendationScore(a,z);
    return recommendationScore(b,z)-recommendationScore(a,z)||(b.createdAt||b.id||0)-(a.createdAt||a.id||0);
  });
  return list;
}
function recommendTeam(z=zone()){return sortedEligible(z).slice(0,3);}
function eventScore(team,stat){
  const vals=team.map(m=>stats(m)[stat]||0).sort((a,b)=>b-a);
  const avg=vals.reduce((a,b)=>a+b,0)/Math.max(1,vals.length);
  const best=vals[0]||0;
  const luck=stat===4?0:team.reduce((a,m)=>a+(stats(m)[4]||0),0)/Math.max(1,team.length)*.06;
  return Math.round(avg*.72+best*.28+luck);
}
function chance(score,diff){return Math.max(.10,Math.min(.95,.5+(score-diff)/Math.max(85,diff)*.72));}
function fmtPct(v){return Math.round(v*100)+'%';}
function makeRoute(){const pool=[...EVENT_POOL];for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}return pool.slice(0,5).concat('core');}
function used(e,z){return Math.max(0,Number(e.usedByZone?.[z.id])||0);}
function saveRender(msg){const R=rt();if(!R)return;const s=state();if(s)s.revision=(s.revision||0)+1;R.save?.();R.render?.();if(msg)R.tell?.(msg);render();}
function start(){
  const s=state(),e=ensure(),z=zone(),t=team(z);if(!s||!e)return;
  if(t.length!==3){rt()?.tell?.('这个难度需要选择 3 只符合条件的怪物。');return;}
  if(new Set(t.map(m=>m.id)).size!==3){rt()?.tell?.('远征队伍不能重复选择同一只怪物。');return;}
  if(used(e,z)>=z.attempts){rt()?.tell?.('今天这个难度的远征次数已经用完。');return;}
  if(t.some(m=>(m.star||1)<z.minStar)){rt()?.tell?.('队伍星级不足。');return;}
  if(z.shinyOnly&&t.some(m=>!m.shiny||m.star<5)){rt()?.tell?.('闪光秘境只允许 5★闪光怪物进入。');return;}
  e.usedByZone[z.id]=used(e,z)+1;e.lastZone=z.id;e.lastTeamIds=t.map(m=>m.id);selected=[...e.lastTeamIds];
  e.active={zone:z.id,teamIds:[...selected],route:makeRoute(),step:0,stamina:3,reward:0,success:0,fail:0,log:[]};
  saveRender(z.label+'开始：'+t.map(n).join('、')+' 前往'+z.name+'。');
}
function finish(defeated=false){
  const s=state(),e=ensure(),a=e?.active;if(!s||!e||!a)return;
  const z=zone(a.zone);
  const payout=Math.round(a.reward*(defeated?.35:1)+(defeated?0:z.clearBonus));
  s.energy=(Number(s.energy)||0)+payout;
  let badge=0;if(!defeated){badge=z.badge+(a.success>=6?Math.max(1,Math.round(z.badge*.5)):0);e.badges+=badge;}
  e.lastResult={time:Date.now(),zone:z.id,zoneName:z.name,payout,badge,success:a.success,fail:a.fail,defeated};e.active=null;
  saveRender(defeated?z.name+'远征提前结束，带回 '+payout+' 灵能。':z.name+'远征完成！获得 '+payout+' 灵能、远征徽章 ×'+badge+'。');
}
function choose(idx){
  const e=ensure(),a=e?.active;if(!a)return;const z=zone(a.zone);
  const event=EVENTS[a.route[a.step]],choice=event?.choices?.[idx];if(!choice)return;
  const t=a.teamIds.map(id=>(state().monsters||[]).find(m=>m.id===id)).filter(Boolean);
  if(t.length!==3){e.active=null;saveRender('远征队伍资料异常，本次远征已安全结束。');return;}
  const sc=eventScore(t,choice.stat),target=choice.diff+z.diffAdd,p=chance(sc,target),ok=Math.random()<p;
  const reward=Math.round(choice.reward*z.rewardMul);
  if(ok){a.reward+=reward;a.success++;a.log.push('✓ '+event.title+' · '+STAT_NAMES[choice.stat]+' '+sc+' / '+target+' · 成功 +'+reward+' 灵能');}
  else{a.stamina--;a.fail++;a.log.push('× '+event.title+' · '+STAT_NAMES[choice.stat]+' '+sc+' / '+target+' · 失败，行动力 -1');}
  a.step++;
  if(a.stamina<=0){finish(true);return;}
  if(a.step>=a.route.length){finish(false);return;}
  saveRender(ok?'挑战成功。继续深入'+z.name+'。':'挑战失败，但队伍还能继续前进。');
}
function abandon(){const e=ensure();if(!e?.active)return;if(!confirm('确定结束这次远征吗？本次未结算奖励会失去。'))return;e.active=null;saveRender('本次远征已结束。');}
function teamCard(m){const v=stats(m);return '<div class="exp-team-card">'+(rt()?.sprite?.(m.species,m.tint,m.shiny,m.specialColor)||'')+'<div><b>'+n(m)+' '+stars(m)+(m.shiny?' ✦':'')+'</b><small>'+STAT_NAMES.map((x,i)=>x+' '+v[i]).join(' · ')+'</small></div></div>';}
function zoneTabs(e){return '<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px">'+ZONES.map(z=>{const remain=Math.max(0,z.attempts-used(e,z));return '<button class="'+(z.id===selectedZone?'primary':'secondary')+'" data-exp-zone="'+z.id+'"><b>'+z.label+'</b><small style="display:block;margin-top:3px">'+z.name+' · 剩 '+remain+'/'+z.attempts+'</small></button>';}).join('')+'</div>';}
function selectionHTML(z){
  const list=sortedEligible(z),recommended=new Set(recommendTeam(z).map(m=>m.id));
  const options=(slot)=>'<option value="">选择队员 '+(slot+1)+'</option>'+list.map((m,idx)=>'<option value="'+m.id+'" '+(selected[slot]===m.id?'selected':'')+'>'+(recommended.has(m.id)?'★推荐 '+(idx+1)+' · ':'')+stars(m)+(m.shiny?' ✦':'')+' '+n(m)+' · 总能力 '+stats(m).reduce((a,b)=>a+b,0)+'</option>').join('');
  return '<div class="exp-select-tools" style="display:flex;gap:8px;align-items:end;flex-wrap:wrap;margin:8px 0"><label style="min-width:220px"><b>队员排序</b><select data-exp-sort style="display:block;width:100%;margin-top:4px"><option value="recommended" '+(sortMode==='recommended'?'selected':'')+'>最佳推荐</option><option value="newest" '+(sortMode==='newest'?'selected':'')+'>加入时间 · 新 → 旧</option><option value="oldest" '+(sortMode==='oldest'?'selected':'')+'>加入时间 · 旧 → 新</option><option value="total" '+(sortMode==='total'?'selected':'')+'>总能力 · 高 → 低</option><option value="star" '+(sortMode==='star'?'selected':'')+'>星级 · 高 → 低</option><option value="luck" '+(sortMode==='luck'?'selected':'')+'>幸运 · 高 → 低</option></select></label><button type="button" class="secondary" data-exp-recommend>一键选择最佳推荐</button><small style="font-size:9px;color:#55515a">最佳推荐会综合总能力、短板能力、最高能力与星级；随机路线更重视均衡。</small></div><div class="exp-select-grid">'+[0,1,2].map(i=>'<label>队员 '+(i+1)+'<select data-exp-slot="'+i+'">'+options(i)+'</select></label>').join('')+'</div>';
}
function activeHTML(a){
  const z=zone(a.zone),t=a.teamIds.map(id=>(state().monsters||[]).find(m=>m.id===id)).filter(Boolean);
  const event=EVENTS[a.route[a.step]];
  const progress=a.route.map((id,i)=>'<span class="'+(i<a.step?'done':i===a.step?'current':'')+'">'+(i+1)+'</span>').join('');
  const choices=event.choices.map((c,i)=>{const sc=eventScore(t,c.stat),target=c.diff+z.diffAdd,p=chance(sc,target),reward=Math.round(c.reward*z.rewardMul);return '<button class="exp-choice" data-exp-choice="'+i+'"><b>'+c.label+'</b><small>使用 '+STAT_NAMES[c.stat]+' · 队伍评分 '+sc+' / 门槛 '+target+' · 成功率约 '+fmtPct(p)+'</small><em>成功奖励 +'+reward+' 灵能</em></button>';}).join('');
  return '<div class="exp-active"><div class="exp-overview"><div><b>'+z.label+' · '+z.name+'</b><small>'+z.desc+'</small></div><div><b>通关徽章 '+z.badge+' 枚</b><small>6/6 全成功还有额外完美奖励</small></div></div><div class="exp-progress">'+progress+'</div><div class="exp-status"><b>行动力 '+('♥'.repeat(a.stamina))+('♡'.repeat(Math.max(0,3-a.stamina)))+'</b><span>暂存奖励 '+a.reward+' 灵能</span><span>成功 '+a.success+' / 失败 '+a.fail+'</span></div><div class="exp-team-strip">'+t.map(teamCard).join('')+'</div><article class="exp-event"><span>节点 '+(a.step+1)+' / '+a.route.length+'</span><h3>'+event.title+'</h3><p>'+event.text+'</p><div class="exp-choices">'+choices+'</div></article><div class="exp-log">'+(a.log.length?a.log.slice(-4).reverse().map(x=>'<div>'+x+'</div>').join(''):'<div>队伍刚刚进入'+z.name+'。</div>')+'</div><button class="secondary" data-exp-abandon>结束本次远征</button></div>';
}
function render(){
  const box=document.getElementById('expedition-content');if(!box)return;
  const s=state(),e=ensure();if(!s||!e){box.innerHTML='<p>远征系统正在等待游戏资料。</p>';return;}
  if(e.active){box.innerHTML=activeHTML(e.active);return;}
  const z=zone(),t=team(z),remain=Math.max(0,z.attempts-used(e,z));
  const requirement=z.shinyOnly?'只允许 5★闪光怪物':'最低 '+z.minStar+'★';
  box.innerHTML=zoneTabs(e)+'<div class="exp-overview"><div><b>'+z.label+' · '+z.name+'</b><small>'+z.desc+'</small></div><div><b>今日剩余 '+remain+' / '+z.attempts+'</b><small>远征徽章 '+e.badges+' · 通关基础 '+z.badge+' 枚</small></div></div><p class="exp-intro"><b>准入：'+requirement+'</b>。选择 3 只怪物后连续处理 6 个事件。星级只决定能否进入；真正的成功率由体质 / 攻击 / 防御 / 速度 / 幸运决定。失败只消耗本次远征行动力，不直接扣怪物生命。</p>'+selectionHTML(z)+'<div class="exp-team-strip">'+t.map(teamCard).join('')+'</div><button class="primary exp-start" data-exp-start '+(t.length===3&&remain>0?'':'disabled')+'>开始 '+z.label+' · '+z.name+'</button>'+(e.lastResult?'<div class="exp-last">上次：'+(e.lastResult.zoneName||'远征')+' · '+(e.lastResult.defeated?'提前结束':'完成')+' · '+e.lastResult.success+' 成功 / '+e.lastResult.fail+' 失败 · '+e.lastResult.payout+' 灵能'+(e.lastResult.badge?' · 徽章 ×'+e.lastResult.badge:'')+'</div>':'');
}
document.addEventListener('change',e=>{const sort=e.target.closest?.('[data-exp-sort]');if(sort){sortMode=sort.value||'recommended';render();return;}const sel=e.target.closest?.('[data-exp-slot]');if(!sel)return;selected[Number(sel.dataset.expSlot)]=Number(sel.value)||null;render();});
document.addEventListener('click',e=>{const z=e.target.closest?.('[data-exp-zone]');if(z){selectedZone=z.dataset.expZone;selected=[];const ex=ensure();if(ex)ex.lastZone=selectedZone;render();return;}if(e.target.closest?.('[data-exp-recommend]')){const rec=recommendTeam(zone());selected=rec.map(m=>m.id);render();if(rec.length<3)rt()?.tell?.('当前难度符合条件的怪物不足 3 只。');return;}if(e.target.closest?.('[data-exp-start]')){start();return;}const c=e.target.closest?.('[data-exp-choice]');if(c){choose(Number(c.dataset.expChoice));return;}if(e.target.closest?.('[data-exp-abandon]'))abandon();});
window.QinsterExpedition={render,zones:ZONES};
})();