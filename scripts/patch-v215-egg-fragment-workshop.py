from pathlib import Path
p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

anchor="function monsterName(m){return R()?.name?.(m)||R()?.G?.SPECIES?.[m.species]?.name||('怪物 #'+m.id)}"
insert=r'''const EGG_FRAGMENT_RECIPES=[
{id:'basic',cost:10,name:'基础远征蛋',text:'随机 1★–2★',stars:[1,1,1,2]},
{id:'fine',cost:30,name:'精制远征蛋',text:'随机 2★–3★',stars:[2,2,2,3]},
{id:'rare',cost:80,name:'稀有远征蛋',text:'随机 3★–4★',stars:[3,3,4]},
{id:'elite',cost:200,name:'精英远征蛋',text:'随机 4★–5★',stars:[4,4,5]},
{id:'expedition',cost:500,name:'远征秘藏蛋',text:'3★–5★ · 高概率远征限定种族 · 小概率闪光/特殊色',stars:[3,4,4,5,5]}
];
function eggUnitsLocal(egg){return egg?(1+(egg.twinChild?1:0)):0}
function totalEggsLocal(state){return eggUnitsLocal(state.egg)+eggUnitsLocal(state.egg2)+(state.eggQueue||[]).reduce((n,e)=>n+eggUnitsLocal(e),0)}
function expeditionEggSpecies(recipe){const all=R()?.G?.SPECIES||[];if(!all.length)return 0;if(recipe.id==='expedition'&&all.length>18){const pool=all.map((_,i)=>i).filter(i=>i>=18);return rand(pool)}return Math.floor(Math.random()*all.length)}
function makeFragmentEgg(recipe){const s=S(),r=R(),e=ensure();if(!s||!r||!e)return false;const fragments=Math.max(0,Number(e.loot?.eggFragment)||0);if(fragments<recipe.cost)return r.tell?.(`蛋碎片不足，需要 ${recipe.cost}。`);if(totalEggsLocal(s)>=11)return r.tell?.('孵化巢和等候队列已满（最多 11 枚蛋）。');const star=rand(recipe.stars),species=expeditionEggSpecies(recipe),child=r.G.createMonster(s.nextId++,species,star);child.tint=Math.floor(Math.random()*6);if(recipe.id==='expedition'){if(Math.random()<.02){child.shiny=true;child.locked=true;child.shinyAutoLockDone=true}if(Math.random()<.08)child.specialColor=Math.floor(Math.random()*3)}r.ensureMonsterSystemsMonster?.(child,Date.now());const now=Date.now(),seconds=star===1?15:(22+star*12),duration=seconds*1000,egg={child,start:null,ready:null,base:star,chance:0,incubationDuration:duration,queuedAt:now,source:'eggFragment',recipe:recipe.id};if(!s.egg){egg.start=now;egg.ready=now+duration;egg.queuedAt=null;s.egg=egg}else if(Number(s.hatchSlots)>=2&&!s.egg2){egg.start=now;egg.ready=now+duration;egg.queuedAt=null;s.egg2=egg}else{if(!Array.isArray(s.eggQueue))s.eggQueue=[];s.eggQueue.push(egg)}e.loot.eggFragment=fragments-recipe.cost;save(`${recipe.name} 已制作：${'★'.repeat(star)} ${r.G.SPECIES?.[species]?.name||'怪物'}蛋${child.shiny?' · 闪光！':''}${child.specialColor!=null?' · 特殊色！':''}`);return true}
function eggWorkshopHTML(e){const f=Math.max(0,Number(e.loot?.eggFragment)||0);return `<section class="rg-panel"><div class="rg-title"><div><b>蛋碎片工坊</b><small>消耗永久蛋碎片直接制作怪物蛋；蛋会进入现有孵化巢/等候队列</small></div><span class="rg-materials">当前蛋碎片 ${f}</span></div><div class="rg-final" style="margin-top:8px">${EGG_FRAGMENT_RECIPES.map(x=>`<button class="secondary rg-relic" data-rg-craft-egg="${x.id}" ${f>=x.cost&&totalEggsLocal(S())<11?'':'disabled'}><b>${x.name} · ${x.cost}碎片</b><span>${x.text}</span></button>`).join('')}</div><p class="rg-note">远征秘藏蛋使用远征限定种族池，并有 2% 闪光、8% 特殊色概率。制作出来的蛋仍需正常孵化。</p></section>`}
'''+anchor
if anchor not in s: raise SystemExit('monsterName anchor not found')
s=s.replace(anchor,insert,1)

old="run.log.push(`宝箱：+${base} 灵能，并获得一份远征材料。`);"
new="const got=r<.38?'遗物尘':r<.68?'蛋碎片':r<.88?'星辉结晶':'远征徽章';run.log.push(`宝箱：+${base} 灵能，并获得 ${got} ×1。`);"
if old not in s: raise SystemExit('treasure log anchor not found')
s=s.replace(old,new,1)

old="</section>${e.rogueLast?`<section class=\"rg-panel\"><b>上次远征</b>"
new="</section>${eggWorkshopHTML(e)}${e.rogueLast?`<section class=\"rg-panel\"><b>上次远征</b>"
if old not in s: raise SystemExit('idle workshop anchor not found')
s=s.replace(old,new,1)

old="if(ev.target.closest?.('[data-rg-recommend]')){selected=sorted(z()).slice(0,3).map(m=>m.id);render();return}"
new="const craft=ev.target.closest?.('[data-rg-craft-egg]');if(craft){const recipe=EGG_FRAGMENT_RECIPES.find(x=>x.id===craft.dataset.rgCraftEgg);if(recipe)makeFragmentEgg(recipe);return}if(ev.target.closest?.('[data-rg-recommend]')){selected=sorted(z()).slice(0,3).map(m=>m.id);render();return}"
if old not in s: raise SystemExit('click anchor not found')
s=s.replace(old,new,1)

s=s.replace("window.QinsterExpedition={render,zones:ZONES,version:'v199-roguelike'};","window.QinsterExpedition={render,zones:ZONES,version:'v215-egg-fragment-workshop'};")
p.write_text(s,encoding='utf-8')
