from pathlib import Path
import json

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

# Add dedicated guaranteed-shiny expedition egg recipe.
old="{id:'expedition',cost:500,name:'远征秘藏蛋',text:'3★–5★ · 高概率远征限定种族 · 小概率闪光/特殊色',stars:[3,4,4,5,5]}\n];"
new="{id:'expedition',cost:500,name:'远征秘藏蛋',text:'3★–5★ · 高概率远征限定种族 · 小概率闪光/特殊色',stars:[3,4,4,5,5]},\n{id:'shinyExpedition',cost:100,currency:'shinyEggFragment',name:'闪光远征蛋',text:'保证闪光 · 3★–5★ · 远征限定种族 · 至少2项高区间',stars:[3,4,4,5,5]}\n];"
assert old in s
s=s.replace(old,new,1)

# Expedition-exclusive species pool applies to the shiny expedition recipe too.
old="if(recipe.id==='expedition'&&all.length>18){"
new="if((recipe.id==='expedition'||recipe.id==='shinyExpedition')&&all.length>18){"
assert old in s
s=s.replace(old,new,1)

# Use recipe-specific fragment currency and guarantee shiny for shinyExpedition.
start=s.index('function makeFragmentEgg(recipe){')
end=s.index('\nfunction eggWorkshopHTML(e)',start)
old=s[start:end]
new="""function makeFragmentEgg(recipe){const s=S(),r=R(),e=ensure();if(!s||!r||!e)return false;const currency=recipe.currency||'eggFragment',currencyName=currency==='shinyEggFragment'?'闪光蛋碎片':'蛋碎片',fragments=Math.max(0,Number(e.loot?.[currency])||0);if(fragments<recipe.cost)return r.tell?.(`${currencyName}不足，需要 ${recipe.cost}。`);if(totalEggsLocal(s)>=11)return r.tell?.('孵化巢和等候队列已满（最多 11 枚蛋）。');const star=rand(recipe.stars),species=expeditionEggSpecies(recipe),premium=recipe.id==='expedition'||recipe.id==='shinyExpedition',child=rollFragmentChild(r,s.nextId++,species,star,premium);child.fragmentEgg=true;child.fragmentRecipe=recipe.id;child.tint=Math.floor(Math.random()*6);if(recipe.id==='shinyExpedition'){child.shiny=true;child.locked=true;child.shinyAutoLockDone=true;if(Math.random()<.08)child.specialColor=Math.floor(Math.random()*3)}else if(recipe.id==='expedition'){if(Math.random()<.02){child.shiny=true;child.locked=true;child.shinyAutoLockDone=true}if(Math.random()<.08)child.specialColor=Math.floor(Math.random()*3)}r.ensureMonsterSystemsMonster?.(child,Date.now());const vals=r.G.stats(child)||[],floor=fragmentStatFloor(star),top=fragmentTop20Floor(star),topCount=vals.filter(v=>Number(v)>=top).length;if(vals.some(v=>Number(v)<floor)||(premium&&topCount<2)){console.warn('Fragment egg stat guarantee fallback used',{star,floor,top,vals,recipe:recipe.id})}const now=Date.now(),seconds=star===1?15:(22+star*12),duration=seconds*1000,egg={child,start:null,ready:null,base:star,chance:0,incubationDuration:duration,queuedAt:now,source:'eggFragment',recipe:recipe.id};if(!s.egg){egg.start=now;egg.ready=now+duration;egg.queuedAt=null;s.egg=egg}else if(Number(s.hatchSlots)>=2&&!s.egg2){egg.start=now;egg.ready=now+duration;egg.queuedAt=null;s.egg2=egg}else{if(!Array.isArray(s.eggQueue))s.eggQueue=[];s.eggQueue.push(egg)}e.loot[currency]=fragments-recipe.cost;save(`${recipe.name} 已制作：${'★'.repeat(star)} ${r.G.SPECIES?.[species]?.name||'怪物'}蛋 · 五维保底 ${floor}+${premium?` · 至少2项 ${top}+`:''}${child.shiny?' · 闪光！':''}${child.specialColor!=null?' · 特殊色！':''}`);return true}"""
s=s[:start]+new+s[end:]

# Workshop displays both balances and enables recipes from their own currency.
start=s.index('function eggWorkshopHTML(e){')
end=s.index('\nfunction monsterName(m)',start)
old=s[start:end]
new="""function eggWorkshopHTML(e){const f=Math.max(0,Number(e.loot?.eggFragment)||0),sf=Math.max(0,Number(e.loot?.shinyEggFragment)||0),available=x=>Math.max(0,Number(e.loot?.[x.currency||'eggFragment'])||0);return `<section class=\"rg-panel\"><div class=\"rg-title\"><div><b>蛋碎片工坊</b><small>消耗永久蛋碎片直接制作怪物蛋；蛋会进入现有孵化巢/等候队列</small></div><span class=\"rg-materials\">基础碎片 ${f} · 闪光碎片 ${sf}</span></div><div class=\"rg-final\" style=\"margin-top:8px\">${EGG_FRAGMENT_RECIPES.map(x=>`<button class=\"secondary rg-relic\" data-rg-craft-egg=\"${x.id}\" ${available(x)>=x.cost&&totalEggsLocal(S())<11?'':'disabled'}><b>${x.name} · ${x.cost}${x.currency==='shinyEggFragment'?'闪光碎片':'碎片'}</b><span>${x.text}</span></button>`).join('')}</div><p class=\"rg-note\"><b>碎片蛋五维保底：</b>1★ 50–100 · 2★ 100–200 · 3★ 200–300 · 4★ 300–400 · 5★ 400–500。五项能力分别保底。<br><b>远征秘藏蛋：</b>至少 2 项进入本星级最高20%，并使用远征限定种族池；2%闪光、8%特殊色。<br><b>闪光远征蛋：</b>消耗100闪光碎片，保证闪光，3★–5★，使用远征限定种族池并至少2项进入本星级最高20%。</p></section>`}"""
s=s[:start]+new+s[end:]

# Up to two decimal places for expedition base stats and shared formatter.
old="function expeditionStats(m){const base=ranchStats(m),mul=speciesBattleMultipliers(m),trait=expeditionTraitFor(m),shiny=m?.shiny?1.05:1;return base.map((v,i)=>Math.round((((Number(v)||0)*(mul[i]||1)+(Number(trait.stat)===i?Number(trait.flat)||0:0))*shiny)*10)/10)}"
new="function expeditionStats(m){const base=ranchStats(m),mul=speciesBattleMultipliers(m),trait=expeditionTraitFor(m),shiny=m?.shiny?1.05:1;return base.map((v,i)=>Math.round((((Number(v)||0)*(mul[i]||1)+(Number(trait.stat)===i?Number(trait.flat)||0:0))*shiny)*100)/100)}\nfunction fmt2(v){const n=Math.round((Number(v)||0)*100)/100;return Number.isInteger(n)?String(n):String(n).replace(/(\\.\\d*?[1-9])0+$|\\.0+$/, '$1')}"
assert old in s
s=s.replace(old,new,1)

old="function statsText(v){return STAT.map((n,i)=>`${n}${Math.round((Number(v[i])||0)*10)/10}`).join(' · ')}"
new="function statsText(v){return STAT.map((n,i)=>`${n}${fmt2(v[i])}`).join(' · ')}"
assert old in s
s=s.replace(old,new,1)

# Make shiny fragments a rare milestone option instead of guaranteed every milestone.
start=s.index('function prepareEggMilestone(run){')
end=s.index('\nfunction chooseEggMilestone',start)
old=s[start:end]
new="""function prepareEggMilestone(run){const f=floorNo(run.stage),d=Number(run.difficulty)||0,rewardMul=1+floorRewardBonus(run.stage),scale=v=>Math.max(1,Math.round(v*rewardMul)),shinyChance=z(run.zone).shinyOnly?.35:.25;run.eggMilestoneChoices=[
{key:'eggFragment',name:'基础蛋碎片',value:scale(24+f*2+d),text:'用于现有蛋碎片工坊'},
{key:'expeditionEggFragment',name:'远征秘藏碎片',value:scale(12+f+d),text:'更稀有的远征专属碎片'}
];if(Math.random()<shinyChance)run.eggMilestoneChoices.push({key:'shinyEggFragment',name:'闪光蛋碎片',value:scale(6+Math.floor(f/2)+Math.floor(d/2)),text:`稀有出现（${Math.round(shinyChance*100)}%）；用于保证闪光的远征蛋`});run.phase='eggMilestone';save(`${floorLabel(run.stage)}：达成每3楼层的蛋碎片奖励。`)}"""
s=s[:start]+new+s[end:]

s=s.replace('<small>击败第3个楼层BOSS后，从三种蛋碎片中选择一种</small>','<small>击败第3个楼层BOSS后选择蛋碎片；闪光碎片只会低概率出现</small>',1)

# Picker cards show expedition five stats and total.
needle="cfg.card=i=>{const sk=i.battleSkill||{name:'普通攻击',text:'无额外战斗技能'},typeMap="
pos=s.index(needle)
end=s.index(";\n return '<div class=\"qp-slotbar\">'",pos)
old=s[pos:end]
new="""cfg.card=i=>{const sk=i.battleSkill||{name:'普通攻击',text:'无额外战斗技能'},typeMap={attack:'攻击',attackGauge:'攻击/行动条',attackDebuff:'攻击/Debuff',attackSelfGauge:'攻击/自充能',drain:'吸血攻击',buff:'Buff',debuff:'Debuff',heal:'治疗',healall:'群体治疗',healBuff:'治疗/Buff',selfheal:'自愈'},kind=typeMap[sk.type]||'战斗技能',chance='每次行动 20% 概率使用',v=st(i.value),total=v.reduce((a,b)=>a+(Number(b)||0),0),statLine=`HP ${fmt2(v[0])} · 攻 ${fmt2(v[1])} · 防 ${fmt2(v[2])} · 速 ${fmt2(v[3])} · 运 ${fmt2(v[4])}`;return `<article class=\"qp-card rg-exp-picker-card ${i.selected?'selected':''}\"><button type=\"button\" class=\"rg-exp-pick-main\" data-qp-item=\"${esc(i.id)}\" aria-pressed=\"${!!i.selected}\" ${i.disabled?'disabled':''}>${i.art||''}<span class=\"qp-copy\"><strong>${esc(i.title)}</strong><small>${esc(i.description)}</small><small><b>远征五维</b> ${esc(statLine)}</small><small><b>总能力</b> ${fmt2(total)}</small><span class=\"qp-badges\">${i.recommended?'<em>推荐</em>':''}${i.selected?'<em>✓ 已选</em>':''}</span></span></button><details class=\"rg-exp-skill\"><summary>⚔ ${esc(sk.name||'普通攻击')}</summary><small><b>${esc(kind)}</b> · ${esc(chance)}<br>${esc(sk.text||'无额外效果')}</small></details></article>`}"""
s=s[:pos]+new+s[end:]

# Selected team summary total also uses max two decimals.
s=s.replace("总能力 ${st(m).reduce((a,b)=>a+b,0)}","总能力 ${fmt2(st(m).reduce((a,b)=>a+b,0))}",1)

# Number duplicate enemies per role in a battle, keeping singletons clean.
old="function enemyPreview(run,kind){const roles=enemyTeamRoles(kind,run),enemies=roles.map((role,i)=>makeEnemyUnit(run,role,i,roles.length));if(relicMods(run).swapEnemyEnds&&enemies.length>1){"
new="function enemyPreview(run,kind){const roles=enemyTeamRoles(kind,run),enemies=roles.map((role,i)=>makeEnemyUnit(run,role,i,roles.length)),totals=roles.reduce((o,r)=>(o[r]=(o[r]||0)+1,o),{}),seen={};for(const e of enemies){seen[e.role]=(seen[e.role]||0)+1;if(totals[e.role]>1)e.name=`${enemyRoleName(e.role)} ${seen[e.role]}`}if(relicMods(run).swapEnemyEnds&&enemies.length>1){"
assert old in s
s=s.replace(old,new,1)

# Version bump.
s=s.replace("version:'v270'","version:'v271'",1)
p.write_text(s,encoding='utf-8')

g=Path('game.js');t=g.read_text(encoding='utf-8').replace("__qinsterVersion='v270'","__qinsterVersion='v271'",1);g.write_text(t,encoding='utf-8')
i=Path('index.html');t=i.read_text(encoding='utf-8').replace('?v=270','?v=271');i.write_text(t,encoding='utf-8')
q=Path('package.json');data=json.loads(q.read_text(encoding='utf-8'));data['version']='271.0.0';q.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
cp=Path('scripts/check-picker.mjs');t=cp.read_text(encoding='utf-8').replace("assert.equal(w.__qinsterVersion,'v270')","assert.equal(w.__qinsterVersion,'v271')",1);cp.write_text(t,encoding='utf-8')
print('v271 patch applied')
