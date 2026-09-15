from pathlib import Path
import re, json

ROOT=Path('.')
exp=ROOT/'v199-roguelike-expedition.js'
s=exp.read_text(encoding='utf-8')

# 1) migration-safe expedition box state
old="function ensure(){const s=S();if(!s)return null;if(!s.expedition||typeof s.expedition!=='object')s.expedition={};const e=s.expedition;if(e.dayKey!==today())"
new="function ensure(){const s=S();if(!s)return null;if(!s.expedition||typeof s.expedition!=='object')s.expedition={};const e=s.expedition;if(!Array.isArray(e.box))e.box=[];e.boxCapacity=Math.max(10,Math.min(200,Math.floor(Number(e.boxCapacity)||10)),e.box.length);if(e.dayKey!==today())"
assert old in s
s=s.replace(old,new,1)
old="if(!Array.isArray(e.leaderboard))e.leaderboard=[];if(!selected.length)selected=(e.lastTeamIds||[]).slice(0,3);"
new="if(!Array.isArray(e.leaderboard))e.leaderboard=[];if(!selected.length){const boxIds=new Set(e.box.map(m=>m.id));selected=(e.lastTeamIds||[]).filter(id=>boxIds.has(id)).slice(0,3)}"
assert old in s
s=s.replace(old,new,1)

# 2) replace ranch-backed expedition pool with independent expedition box + racial stats
old="""function monsterName(m){return R()?.name?.(m)||R()?.G?.SPECIES?.[m.species]?.name||('怪物 #'+m.id)}
function st(m){return R()?.G?.stats?.(m)||[0,0,0,0,0]} function stars(m){return R()?.G?.stars?.(m.star)||'★'.repeat(m.star||1)}
function eligible(zone){const s=S(),r=R();if(!s||!r)return[];return (s.monsters||[]).filter(m=>m&&m.life>0&&!r.isDispatched(m.id)&&(m.star||1)>=zone.minStar&&(!zone.shinyOnly||m.shiny))}
function recommendScore(m){const v=st(m),total=v.reduce((a,b)=>a+b,0),min=Math.min(...v),top=[...v].sort((a,b)=>b-a).slice(0,2).reduce((a,b)=>a+b,0);return total+min*1.4+top*.2+(m.star||1)*35+(m.shiny?15:0)}
function teamFromIds(ids){const map=new Map((S()?.monsters||[]).map(m=>[m.id,m]));return ids.map(id=>map.get(id)).filter(Boolean)}
function team(){return teamFromIds(selected)}
"""
new="""function monsterName(m){return R()?.name?.(m)||R()?.G?.SPECIES?.[m.species]?.name||('怪物 #'+m.id)}
function ranchStats(m){return R()?.G?.stats?.(m)||[0,0,0,0,0]}
function speciesBattleMultipliers(m){const base=R()?.G?.SPECIES?.[m.species]?.base||[1,1,1,1,1],den=[44,18,18,20,20];return base.map((v,i)=>1+.25*Math.max(0,Math.min(1,(Number(v)||0)/den[i])))}
function expeditionTraitFor(m){if(m?.expeditionTrait&&Number.isInteger(Number(m.expeditionTrait.stat))&&Number(m.expeditionTrait.flat)>0)return m.expeditionTrait;const base=R()?.G?.SPECIES?.[m?.species]?.base||[1,1,1,1,1],den=[44,18,18,20,20],score=base.map((v,i)=>(Number(v)||0)/den[i]);let stat=0;for(let i=1;i<5;i++)if(score[i]>score[stat])stat=i;const names=['体魄突破','猛攻突破','铁壁突破','疾速突破','幸运突破'];return{stat,flat:40,name:names[stat]}}
function expeditionStats(m){const base=ranchStats(m),mul=speciesBattleMultipliers(m),trait=expeditionTraitFor(m);return base.map((v,i)=>Math.round(((Number(v)||0)*(mul[i]||1)+(Number(trait.stat)===i?Number(trait.flat)||0:0))*10)/10)}
function st(m){return expeditionStats(m)} function stars(m){return R()?.G?.stars?.(m.star)||'★'.repeat(m.star||1)}
function expeditionBox(){return ensure()?.box||[]}
function eligible(zone){const e=ensure();if(!e)return[];return (e.box||[]).filter(m=>m&&m.life>0&&(m.star||1)>=zone.minStar&&(!zone.shinyOnly||m.shiny))}
function recommendScore(m){const v=st(m),total=v.reduce((a,b)=>a+b,0),min=Math.min(...v),top=[...v].sort((a,b)=>b-a).slice(0,2).reduce((a,b)=>a+b,0);return total+min*1.4+top*.2+(m.star||1)*35+(m.shiny?15:0)}
function teamFromIds(ids,allowLegacy=false){const e=ensure(),s=S(),map=new Map((e?.box||[]).map(m=>[m.id,m]));if(allowLegacy)for(const m of s?.monsters||[])if(!map.has(m.id))map.set(m.id,m);return ids.map(id=>map.get(id)).filter(Boolean)}
function team(){return teamFromIds(selected,false)}
"""
assert old in s
s=s.replace(old,new,1)

# active run compatibility
s=s.replace("function activeTeam(run){return teamFromIds(run.teamIds||[])}","function activeTeam(run){return teamFromIds(run.teamIds||[],true)}",1)
s=s.replace("function persistentMonster(id){return (S()?.monsters||[]).find(m=>m.id===id)||null}","function persistentMonster(id){const e=ensure(),s=S();return (e?.box||[]).find(m=>m.id===id)||(s?.monsters||[]).find(m=>m.id===id)||null}",1)

# death/removal should target expedition box (and legacy ranch fallback only if old run)
s=s.replace("const byId=new Map((s.monsters||[]).map(m=>[m.id,m])),notes=[],deadIds=[];","const byId=new Map([...(s.monsters||[]),...(s.expedition?.box||[])].map(m=>[m.id,m])),notes=[],deadIds=[];",1)
s=s.replace("s.monsters=(s.monsters||[]).filter(m=>!dead.has(Number(m.id)));","if(Array.isArray(s.expedition?.box))s.expedition.box=s.expedition.box.filter(m=>!dead.has(Number(m.id)));s.monsters=(s.monsters||[]).filter(m=>!dead.has(Number(m.id)));",1)

# 3) box controls, transfer, projected stats and shared picker UI
marker="let pickerSlot=0;\nfunction expeditionPickerHTML(){"
assert marker in s
box_code=r'''function expeditionBoxExpandCost(e){const bought=Math.max(0,Math.floor((Math.max(10,Number(e?.boxCapacity)||10)-10)/5));return Math.min(2000000,Math.round(50000*Math.pow(1.45,bought)/1000)*1000)}
function traitText(m){const t=expeditionTraitFor(m);return `${t.name}：${STAT[t.stat]} +${t.flat}`}
function raceText(m){const a=speciesBattleMultipliers(m);return STAT.map((n,i)=>`${n}×${a[i].toFixed(2)}`).join(' · ')}
function statsText(v){return STAT.map((n,i)=>`${n}${Math.round((Number(v[i])||0)*10)/10}`).join(' · ')}
function transferToExpedition(id){const s=S(),e=ensure(),r=R();if(!s||!e||!r||e.rogueActive)return false;id=Number(id);const idx=(s.monsters||[]).findIndex(m=>m.id===id);if(idx<0)return false;const m=s.monsters[idx];if(r.isDispatched?.(id))return r.tell?.('派遣中的怪物不能转入远征Box。'),false;if((e.box||[]).length>=e.boxCapacity)return r.tell?.('远征Box已满，请先扩建。'),false;if(!window.confirm(`将 ${monsterName(m)} #${m.id} 永久转入远征Box？\n转入后会离开牧场Box，不能用于牧场配种/派遣；远征属性会应用种族值修正。`))return false;m.expeditionTrait=expeditionTraitFor(m);m.expeditionTransferredAt=Date.now();s.monsters.splice(idx,1);e.box.push(m);if(Array.isArray(s.farmIds))s.farmIds=s.farmIds.filter(x=>Number(x)!==id);if(Number(s.parentA)===id)s.parentA=null;if(Number(s.parentB)===id)s.parentB=null;if(Array.isArray(s.manualBreedPairIds))s.manualBreedPairIds=s.manualBreedPairIds.filter(x=>Number(x)!==id);if(Array.isArray(s.manualDispatchTeamIds))s.manualDispatchTeamIds=s.manualDispatchTeamIds.filter(x=>Number(x)!==id);selected=selected.filter(x=>Number(x)!==id);save(`${monsterName(m)} 已转入远征Box：${traitText(m)}。`);return true}
function expandExpeditionBox(){const s=S(),e=ensure();if(!s||!e||e.rogueActive)return;if(e.boxCapacity>=200)return R()?.tell?.('远征Box容量已达到上限 200。');const cost=expeditionBoxExpandCost(e);if((Number(s.energy)||0)<cost)return R()?.tell?.(`灵能不足，需要 ${cost.toLocaleString()}。`);s.energy-=cost;e.boxCapacity=Math.min(200,e.boxCapacity+5);save(`远征Box扩建至 ${e.boxCapacity} 格。`)}
function expeditionBoxRosterHTML(e){const pool=[...(e.box||[])];if(!pool.length)return '<p class="rg-note">远征Box还是空的。请从下方牧场Box转入怪物。</p>';const cfg=R().monsterPickerConfig('远征Box',pool,{originalLabel:'总战力推荐',recommended:new Set([...pool].sort((a,b)=>recommendScore(b)-recommendScore(a)).slice(0,3).map(m=>m.id)),recommendationNote:'按远征种族值修正后的能力推荐'});cfg.items.forEach(i=>{const m=i.value,sk=battleSkillFor(m);i.search=[i.search,sk.name,sk.text,traitText(m),raceText(m)].join(' ');i.description=`远征 ${statsText(st(m))}\n牧场原值 ${statsText(ranchStats(m))}`;i.facets.skill=[sk.name];i.facets.status=['远征Box'];i.battleSkill=sk});cfg.card=i=>{const m=i.value,sk=i.battleSkill;return `<article class="qp-card rg-exp-box-card">${i.art||''}<span class="qp-copy"><strong>${esc(i.title)} · #${m.id}</strong><small>${esc(i.description)}</small><span class="rg-exp-trait"><b>种族值</b> ${esc(raceText(m))}</span><span class="rg-exp-trait"><b>突破技能</b> ${esc(traitText(m))}</span><details class="rg-exp-skill"><summary>⚔ ${esc(sk.name)}</summary><small>每次行动20%触发 · ${esc(sk.text||'无额外效果')}</small></details></span></article>`};return window.QinsterPicker.html('expedition-box-roster',cfg)}
function expeditionTransferPickerHTML(e){const s=S(),r=R(),pool=[...(s?.monsters||[])].filter(m=>m&&m.life>0);if(!pool.length)return '<p class="rg-note">牧场Box没有可转入的怪物。</p>';const cfg=r.monsterPickerConfig('从牧场转入远征Box',pool,{originalLabel:'远征潜力推荐',recommended:new Set([...pool].sort((a,b)=>recommendScore(b)-recommendScore(a)).slice(0,5).map(m=>m.id)),recommendationNote:'按转入后的种族值 + 突破技能预测排序'});cfg.items.forEach(i=>{const m=i.value,sk=battleSkillFor(m),projected=expeditionStats(m);i.search=[i.search,sk.name,sk.text,traitText(m),raceText(m)].join(' ');i.description=`牧场 ${statsText(ranchStats(m))}\n转入预计 ${statsText(projected)}`;i.facets.skill=[sk.name];i.facets.status=[r.isDispatched?.(m.id)?'派遣中':'牧场Box'];i.battleSkill=sk;i.transferDisabled=!!r.isDispatched?.(m.id)});cfg.sorts=[{id:'original',label:'远征潜力 · 高到低',compare:(a,b)=>recommendScore(b.value)-recommendScore(a.value)},...(cfg.sorts||[]).filter(x=>x.id!=='original')];cfg.card=i=>{const m=i.value,sk=i.battleSkill;return `<article class="qp-card rg-exp-box-card">${i.art||''}<span class="qp-copy"><strong>${esc(i.title)} · #${m.id}</strong><small>${esc(i.description)}</small><span class="rg-exp-trait"><b>种族值</b> ${esc(raceText(m))}</span><span class="rg-exp-trait"><b>转入突破</b> ${esc(traitText(m))}</span><details class="rg-exp-skill"><summary>⚔ ${esc(sk.name)}</summary><small>每次行动20%触发 · ${esc(sk.text||'无额外效果')}</small></details><button type="button" class="secondary" data-rg-transfer="${m.id}" ${i.transferDisabled?'disabled':''}>${i.transferDisabled?'派遣中不可转入':'转入远征Box'}</button></span></article>`};return window.QinsterPicker.html('expedition-transfer',cfg)}
function expeditionBoxHTML(e){const cost=expeditionBoxExpandCost(e),full=e.boxCapacity>=200;return `${idleNav()}<section class="rg-panel"><div class="rg-title"><div><b>远征Box · ${e.box.length}/${e.boxCapacity}</b><small>与牧场Box完全分离。转入为单向转籍，不会复制怪物；牧场能力最高500，远征会应用种族值和突破技能，可超过500。</small></div><button class="secondary" data-rg-box-expand ${full?'disabled':''}>${full?'容量 MAX 200':`扩建 +5 · ${cost.toLocaleString()} 灵能`}</button></div><p class="rg-note"><b>转籍规则：</b>转入后怪物会从牧场Box移除，不能再用于牧场配种/派遣。星级、性别、颜色、闪光、技能、家族和生命都会完整保留。</p>${expeditionBoxRosterHTML(e)}</section><section class="rg-panel"><div class="rg-title"><div><b>牧场 → 远征 转籍</b><small>卡片同时显示牧场原值和转入后的预计远征值，方便判断谁更适合战斗。</small></div><span>剩余 ${Math.max(0,e.boxCapacity-e.box.length)} 格</span></div>${expeditionTransferPickerHTML(e)}</section>`}

let pickerSlot=0;
function expeditionPickerHTML(){'''
s=s.replace(marker,box_code,1)

# 4) nav + idle route
old="<button class=\"secondary ${idleTab==='ladder'?'on':''}\" data-rg-idle-tab=\"ladder\"><b>肉鸽积分榜</b><small>按本局累计击杀积分排序</small></button></div></section>`}"
new="<button class=\"secondary ${idleTab==='ladder'?'on':''}\" data-rg-idle-tab=\"ladder\"><b>肉鸽积分榜</b><small>按本局累计击杀积分排序</small></button><button class=\"secondary ${idleTab==='box'?'on':''}\" data-rg-idle-tab=\"box\"><b>远征Box</b><small>转籍 · 种族值 · 扩建</small></button></div></section>`}"
assert old in s
s=s.replace(old,new,1)
old="function idleHTML(e){if(idleTab==='meta')return `<div class=\"rogue\">${metaTreeHTML(e)}</div>`;if(idleTab==='ladder')return `<div class=\"rogue\">${ladderHTML(e)}</div>`;"
new="function idleHTML(e){if(idleTab==='meta')return `<div class=\"rogue\">${metaTreeHTML(e)}</div>`;if(idleTab==='ladder')return `<div class=\"rogue\">${ladderHTML(e)}</div>`;if(idleTab==='box')return `<div class=\"rogue\">${expeditionBoxHTML(e)}</div>`;"
assert old in s
s=s.replace(old,new,1)
# Add box count/nudge in run page and enforce selection from box
s=s.replace("<div class=\"rg-title\"><b>选择3只怪物 · 点击席位后选择卡片</b><button class=\"secondary\" data-rg-recommend>一键最佳推荐</button></div>","<div class=\"rg-title\"><div><b>选择3只远征Box怪物 · 点击席位后选择卡片</b><small>当前远征Box ${e.box.length}/${e.boxCapacity}${e.box.length<3?' · 至少需要3只，请先到远征Box转入怪物':''}</small></div><button class=\"secondary\" data-rg-recommend>一键最佳推荐</button></div>",1)

# 5) click handlers for transfer/expand
old="const tab=ev.target.closest?.('[data-rg-idle-tab]');if(tab){idleTab=tab.dataset.rgIdleTab||'run';render();return}"
new=old+"const tr=ev.target.closest?.('[data-rg-transfer]');if(tr){transferToExpedition(Number(tr.dataset.rgTransfer));return}if(ev.target.closest?.('[data-rg-box-expand]')){expandExpeditionBox();return}"
assert old in s
s=s.replace(old,new,1)

# 6) style + exported version
s=s.replace(".rg-exp-skill small{display:block;padding:6px 7px;background:#f6f2df;border-top:1px solid #a79a72;color:#40392d;font-size:9px;line-height:1.45}",".rg-exp-skill small{display:block;padding:6px 7px;background:#f6f2df;border-top:1px solid #a79a72;color:#40392d;font-size:9px;line-height:1.45}.rg-exp-box-card{align-items:flex-start!important}.rg-exp-box-card>.sprite{margin-top:7px}.rg-exp-trait{display:block;font-size:9px;line-height:1.45;padding:4px 6px;background:#e7e1c8;border:1px solid #9c926f}.rg-exp-box-card button[data-rg-transfer]{margin-top:5px;width:100%}",1)
s=re.sub(r"window\.QinsterExpedition=\{render,zones:ZONES,version:'v\d+'\}","window.QinsterExpedition={render,zones:ZONES,version:'v267'}",s)
exp.write_text(s,encoding='utf-8')

# 7) battle theater resolves expedition box, with ranch fallback for legacy active runs
tp=ROOT/'v201-battle-theater.js'
t=tp.read_text(encoding='utf-8')
old="function team(run){const map=new Map((S()?.monsters||[]).map(m=>[m.id,m]));return(run?.teamIds||[]).map(id=>map.get(id)).filter(Boolean)}"
new="function team(run){const s=S(),map=new Map((s?.expedition?.box||[]).map(m=>[m.id,m]));for(const m of s?.monsters||[])if(!map.has(m.id))map.set(m.id,m);return(run?.teamIds||[]).map(id=>map.get(id)).filter(Boolean)}"
assert old in t
t=t.replace(old,new,1).replace("qinster-v261-battle-theater-style","qinster-v267-battle-theater-style")
tp.write_text(t,encoding='utf-8')

# 8) visible/cache/package version bump
for fn in ['game.js','index.html','package.json','package-lock.json']:
    p=ROOT/fn
    x=p.read_text(encoding='utf-8')
    if fn=='game.js':
        x=x.replace("window.__qinsterVersion='v259'","window.__qinsterVersion='v267'").replace("'v259 · engine '+__n","'v267 · engine '+__n")
    elif fn=='index.html':
        x=x.replace('v259 · 等待','v267 · 等待').replace('v259 · engine','v267 · engine')
        x=re.sub(r'\.js\?v=\d+', '.js?v=267', x)
        x=re.sub(r'\.css\?v=\d+', '.css?v=267', x)
    else:
        x=x.replace('"version": "266.0.0"','"version": "267.0.0"')
    p.write_text(x,encoding='utf-8')

print('v267 expedition box split patch applied')
