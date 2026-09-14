from pathlib import Path

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

old="""function makeFragmentEgg(recipe){const s=S(),r=R(),e=ensure();if(!s||!r||!e)return false;const fragments=Math.max(0,Number(e.loot?.eggFragment)||0);if(fragments<recipe.cost)return r.tell?.(`蛋碎片不足，需要 ${recipe.cost}。`);if(totalEggsLocal(s)>=11)return r.tell?.('孵化巢和等候队列已满（最多 11 枚蛋）。');const star=rand(recipe.stars),species=expeditionEggSpecies(recipe),child=r.G.createMonster(s.nextId++,species,star);child.tint=Math.floor(Math.random()*6);if(recipe.id==='expedition'){if(Math.random()<.02){child.shiny=true;child.locked=true;child.shinyAutoLockDone=true}if(Math.random()<.08)child.specialColor=Math.floor(Math.random()*3)}r.ensureMonsterSystemsMonster?.(child,Date.now());const now=Date.now(),seconds=star===1?15:(22+star*12),duration=seconds*1000,egg={child,start:null,ready:null,base:star,chance:0,incubationDuration:duration,queuedAt:now,source:'eggFragment',recipe:recipe.id};if(!s.egg){egg.start=now;egg.ready=now+duration;egg.queuedAt=null;s.egg=egg}else if(Number(s.hatchSlots)>=2&&!s.egg2){egg.start=now;egg.ready=now+duration;egg.queuedAt=null;s.egg2=egg}else{if(!Array.isArray(s.eggQueue))s.eggQueue=[];s.eggQueue.push(egg)}e.loot.eggFragment=fragments-recipe.cost;save(`${recipe.name} 已制作：${'★'.repeat(star)} ${r.G.SPECIES?.[species]?.name||'怪物'}蛋${child.shiny?' · 闪光！':''}${child.specialColor!=null?' · 特殊色！':''}`);return true}
"""

new="""function fragmentStatFloor(star){return ({1:50,2:100,3:200,4:300,5:400})[star]||1}
function fragmentTop20Floor(star){return ({1:80,2:160,3:260,4:360,5:460})[star]||1}
function rollFragmentChild(r,id,species,star,secret=false){
  const floor=fragmentStatFloor(star),top=fragmentTop20Floor(star);
  let best=null,bestScore=-1;
  for(let i=0;i<12000;i++){
    const candidate=r.G.createMonster(id,species,star);
    const vals=r.G.stats(candidate)||[];
    const allFloor=vals.length>=5&&vals.every(v=>Number(v)>=floor);
    const topCount=vals.filter(v=>Number(v)>=top).length;
    const score=vals.reduce((a,b)=>a+Number(b||0),0)+topCount*10000+(allFloor?100000:0);
    if(score>bestScore){best=candidate;bestScore=score}
    if(allFloor&&(!secret||topCount>=2))return candidate;
  }
  // Extremely defensive fallback: keep the strongest rolled candidate, then mark it for a visible warning.
  // Normal stat generation should satisfy the guarantee well before this branch.
  if(best)best.fragmentGuaranteeFallback=true;
  return best||r.G.createMonster(id,species,star);
}
function makeFragmentEgg(recipe){const s=S(),r=R(),e=ensure();if(!s||!r||!e)return false;const fragments=Math.max(0,Number(e.loot?.eggFragment)||0);if(fragments<recipe.cost)return r.tell?.(`蛋碎片不足，需要 ${recipe.cost}。`);if(totalEggsLocal(s)>=11)return r.tell?.('孵化巢和等候队列已满（最多 11 枚蛋）。');const star=rand(recipe.stars),species=expeditionEggSpecies(recipe),child=rollFragmentChild(r,s.nextId++,species,star,recipe.id==='expedition');child.fragmentEgg=true;child.fragmentRecipe=recipe.id;child.tint=Math.floor(Math.random()*6);if(recipe.id==='expedition'){if(Math.random()<.02){child.shiny=true;child.locked=true;child.shinyAutoLockDone=true}if(Math.random()<.08)child.specialColor=Math.floor(Math.random()*3)}r.ensureMonsterSystemsMonster?.(child,Date.now());const vals=r.G.stats(child)||[],floor=fragmentStatFloor(star),top=fragmentTop20Floor(star),topCount=vals.filter(v=>Number(v)>=top).length;if(vals.some(v=>Number(v)<floor)||(recipe.id==='expedition'&&topCount<2)){console.warn('Fragment egg stat guarantee fallback used',{star,floor,top,vals,recipe:recipe.id})}const now=Date.now(),seconds=star===1?15:(22+star*12),duration=seconds*1000,egg={child,start:null,ready:null,base:star,chance:0,incubationDuration:duration,queuedAt:now,source:'eggFragment',recipe:recipe.id};if(!s.egg){egg.start=now;egg.ready=now+duration;egg.queuedAt=null;s.egg=egg}else if(Number(s.hatchSlots)>=2&&!s.egg2){egg.start=now;egg.ready=now+duration;egg.queuedAt=null;s.egg2=egg}else{if(!Array.isArray(s.eggQueue))s.eggQueue=[];s.eggQueue.push(egg)}e.loot.eggFragment=fragments-recipe.cost;save(`${recipe.name} 已制作：${'★'.repeat(star)} ${r.G.SPECIES?.[species]?.name||'怪物'}蛋 · 五维保底 ${floor}+${recipe.id==='expedition'?` · 至少2项 ${top}+`:''}${child.shiny?' · 闪光！':''}${child.specialColor!=null?' · 特殊色！':''}`);return true}
"""

if old not in s:
    raise SystemExit('makeFragmentEgg anchor not found')
s=s.replace(old,new,1)

old_note="<p class=\"rg-note\">远征秘藏蛋使用远征限定种族池，并有 2% 闪光、8% 特殊色概率。制作出来的蛋仍需正常孵化。</p>"
new_note="<p class=\"rg-note\"><b>碎片蛋五维保底：</b>1★ 50–100 · 2★ 100–200 · 3★ 200–300 · 4★ 300–400 · 5★ 400–500。五项能力分别保底。<br><b>远征秘藏蛋：</b>在上述保底上，至少 2 项进入本星级最高20%（3★≥260 / 4★≥360 / 5★≥460），并使用远征限定种族池；另有 2% 闪光、8% 特殊色概率。制作出来的蛋仍需正常孵化。</p>"
if old_note not in s:
    raise SystemExit('workshop note anchor not found')
s=s.replace(old_note,new_note,1)

s=s.replace("version:'v215-egg-fragment-workshop'","version:'v217-fragment-stat-guarantee'")
p.write_text(s,encoding='utf-8')
