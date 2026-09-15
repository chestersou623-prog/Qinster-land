from pathlib import Path

GAME=Path('game.js')
s=GAME.read_text(encoding='utf-8')

# 1) Core personality stat model. Species remains a light baseline; genes + personality drive individuals.
old="""const stars=n=>'★'.repeat(n);const MAX_OFFLINE=8*3600*1000;
function createMonster(id,species,star=1,genes=[1,1,1,1,1],parents=[]){return {id,species,star,genes,parents,bond:0,cooldown:0,age:0,baseLife:5,life:5,maxLife:5,lifePotionUsed:false,lifeSkillApplied:0,tint:0,skillLv:star,starBoost:0,shiny:false,nickname:'',locked:false};}
"""
new="""const stars=n=>'★'.repeat(n);const MAX_OFFLINE=8*3600*1000;
// v277: individual personality is now a primary stat tendency instead of species deciding the build.
const PERSONALITY_STAT_MODS=Object.freeze({
  brave:Object.freeze([0,.12,-.04,0,0]),
  careful:Object.freeze([.03,-.03,.10,-.03,.02]),
  curious:Object.freeze([-.03,0,-.02,.05,.12]),
  lively:Object.freeze([-.04,.03,-.03,.12,.02]),
  gentle:Object.freeze([.08,-.04,.04,0,.04]),
  tough:Object.freeze([.12,0,.08,-.07,-.03]),
  greedy:Object.freeze([0,.07,-.04,0,.07]),
  friendly:Object.freeze([.02,.02,.02,.02,.02])
});
const PERSONALITY_IDS=Object.freeze(Object.keys(PERSONALITY_STAT_MODS));
function defaultPersonalityId(id,species=0){const n=Math.abs((Number(id)||0)*31+(Number(species)||0)*17);return PERSONALITY_IDS[n%PERSONALITY_IDS.length];}
function personalityStatMods(m){return PERSONALITY_STAT_MODS[m?.trait]||[0,0,0,0,0];}
function createMonster(id,species,star=1,genes=[1,1,1,1,1],parents=[]){return {id,species,star,genes,parents,bond:0,cooldown:0,age:0,baseLife:5,life:5,maxLife:5,lifePotionUsed:false,lifeSkillApplied:0,tint:0,skillLv:star,starBoost:0,shiny:false,nickname:'',locked:false,trait:defaultPersonalityId(id,species)};}
"""
if old not in s: raise SystemExit('core createMonster anchor missing')
s=s.replace(old,new,1)

old="""    const gene=Number(m.genes?.[i]);
    const geneBias=Math.max(0,Math.min(1,((Number.isFinite(gene)?gene:1)-.65)/.85));
    const quality=speciesBias*.62+geneBias*.38;
    let value=lo+span*quality;
    if(sp.passive==='guard'&&i===2)value*=1+.04*lv;
    if(sp.passive==='self_speed'&&i===3)value*=1+.025*lv;
    return Math.max(lo,Math.min(hi,Math.round(value)));
"""
new="""    const gene=Number(m.genes?.[i]);
    const geneBias=Math.max(0,Math.min(1,((Number.isFinite(gene)?gene:1)-.65)/.85));
    // Species supplies 30% of the base direction, inherited genes 50%; the remaining 20% is a neutral baseline.
    // Personality then gives the strongest visible directional push (up to +/-12%).
    const quality=speciesBias*.30+geneBias*.50+.10;
    const personality=Number(personalityStatMods(m)[i])||0;
    let value=(lo+span*quality)*(1+personality);
    if(sp.passive==='guard'&&i===2)value*=1+.04*lv;
    if(sp.passive==='self_speed'&&i===3)value*=1+.025*lv;
    return Math.max(lo,Math.min(hi,Math.round(value)));
"""
if old not in s: raise SystemExit('stats formula anchor missing')
s=s.replace(old,new,1)

old="root.MonsterGame={SPECIES,COLORS,deathChance,migrate,adopt,salePrice,sell,stars,createMonster,fresh,stats,statBand,statGrade,STAT_BANDS,income,pair,odds,breedCost,blocked,startBreed,hatch,advance,valid,skillLevel,MAX_OFFLINE,BASE_SPECIES_COUNT,MISSION_EXCLUSIVE_SPECIES,isMissionExclusiveSpecies,FARM_START_SLOTS,normalizeFarmState,isInFarmState,producingMonstersState};"
new="root.MonsterGame={SPECIES,COLORS,deathChance,migrate,adopt,salePrice,sell,stars,createMonster,fresh,stats,statBand,statGrade,STAT_BANDS,income,pair,odds,breedCost,blocked,startBreed,hatch,advance,valid,skillLevel,MAX_OFFLINE,BASE_SPECIES_COUNT,MISSION_EXCLUSIVE_SPECIES,isMissionExclusiveSpecies,FARM_START_SLOTS,normalizeFarmState,isInFarmState,producingMonstersState,PERSONALITY_STAT_MODS,defaultPersonalityId,personalityStatMods};"
if old not in s: raise SystemExit('MonsterGame export anchor missing')
s=s.replace(old,new,1)

# 2) Enrich existing personality system instead of inventing a second competing personality field.
old="""const TRAITS=[
{id:'brave',name:'勇敢',desc:'派遣成功率 +3 个百分点，但失败时事故风险略高。'},
{id:'careful',name:'谨慎',desc:'派遣事故风险 -20%，成功率 +1 个百分点。'},
{id:'curious',name:'好奇',desc:'探索道具发现率 +2 个百分点，并更容易发现稀有技能。'},
{id:'lively',name:'活泼',desc:'派遣属性评分 +5%，在草地上更爱活动。'},
{id:'gentle',name:'温顺',desc:'作为亲代时，产蛋后的死亡风险 -8%。'},
{id:'tough',name:'坚韧',desc:'派遣事故风险 -12%。'},
{id:'greedy',name:'贪吃',desc:'派遣灵能报酬 +6%，但任务时间 +5%。'},
{id:'friendly',name:'亲人',desc:'摸摸与成功派遣获得更多亲密度。'}
];
"""
new="""const TRAITS=[
{id:'brave',name:'勇敢',stats:G.PERSONALITY_STAT_MODS.brave,desc:'攻击 +12%、防御 -4%；派遣成功率 +3 个百分点，但失败时事故风险略高。'},
{id:'careful',name:'谨慎',stats:G.PERSONALITY_STAT_MODS.careful,desc:'HP +3%、攻击 -3%、防御 +10%、速度 -3%、幸运 +2%；派遣事故风险 -20%，成功率 +1 个百分点。'},
{id:'curious',name:'好奇',stats:G.PERSONALITY_STAT_MODS.curious,desc:'HP -3%、防御 -2%、速度 +5%、幸运 +12%；探索道具发现率 +2 个百分点，并更容易发现稀有技能。'},
{id:'lively',name:'活泼',stats:G.PERSONALITY_STAT_MODS.lively,desc:'HP -4%、攻击 +3%、防御 -3%、速度 +12%、幸运 +2%；派遣属性评分 +5%。'},
{id:'gentle',name:'温顺',stats:G.PERSONALITY_STAT_MODS.gentle,desc:'HP +8%、攻击 -4%、防御 +4%、幸运 +4%；作为亲代时繁育风险 -8%。'},
{id:'tough',name:'坚韧',stats:G.PERSONALITY_STAT_MODS.tough,desc:'HP +12%、防御 +8%、速度 -7%、幸运 -3%；派遣事故风险 -12%。'},
{id:'greedy',name:'贪吃',stats:G.PERSONALITY_STAT_MODS.greedy,desc:'攻击 +7%、防御 -4%、幸运 +7%；派遣灵能报酬 +6%，但任务时间 +5%。'},
{id:'friendly',name:'亲人',stats:G.PERSONALITY_STAT_MODS.friendly,desc:'五维各 +2%；摸摸与成功派遣获得更多亲密度。'}
];
"""
if old not in s: raise SystemExit('TRAITS block anchor missing')
s=s.replace(old,new,1)

old="if(!TRAIT_MAP[m.trait])m.trait=TRAITS[Math.abs(Number(m.id)||0)%TRAITS.length].id;"
new="if(!TRAIT_MAP[m.trait])m.trait=G.defaultPersonalityId?G.defaultPersonalityId(m.id,m.species):TRAITS[Math.abs(Number(m.id)||0)%TRAITS.length].id;"
if old not in s: raise SystemExit('trait fallback anchor missing')
s=s.replace(old,new,1)

# 3) Personality inheritance + phenotype-guided gene inheritance.
anchor="function archiveSnapshot(m){"
helpers="""
const PERSONALITY_STAT_NAMES=['HP','攻击','防御','速度','幸运'];
function personalityStatSummary(id){
  const t=TRAIT_MAP[id]||TRAITS[0],mods=t.stats||[0,0,0,0,0],parts=[];
  for(let i=0;i<mods.length;i++)if(mods[i])parts.push(PERSONALITY_STAT_NAMES[i]+' '+(mods[i]>0?'+':'')+Math.round(mods[i]*100)+'%');
  return parts.length?parts.join(' · '):'五维无额外倾向';
}
function rollChildTrait(a,b,rng=Math.random){
  const ta=traitInfo(a).id,tb=traitInfo(b).id;
  const mutation=excluded=>{
    const pool=TRAITS.filter(t=>!excluded.includes(t.id));
    const pick=pool[Math.min(pool.length-1,Math.floor(rng()*pool.length))]||TRAITS[0];
    return {id:pick.id,source:'变异'};
  };
  if(ta===tb){
    if(rng()<.70)return {id:ta,source:'同个性继承'};
    return mutation([ta]);
  }
  const r=rng();
  if(r<.40)return {id:ta,source:'亲代A继承'};
  if(r<.80)return {id:tb,source:'亲代B继承'};
  return mutation([ta,tb]);
}
function statBandPercent(m,idx){
  const vals=G.stats(m),band=G.statBand(m.star),span=Math.max(1,band[1]-band[0]);
  return Math.max(0,Math.min(1,((Number(vals[idx])||band[0])-band[0])/span));
}
function sharedHighStatTendencies(a,b){
  const out=[];
  for(let i=0;i<5;i++){
    const score=Math.min(statBandPercent(a,i),statBandPercent(b,i));
    if(score>=.70)out.push({stat:i,score,tier:score>=.85?'极高':'高'});
  }
  return out;
}
function applySharedHighStatGenes(genes,a,b,rng=Math.random){
  const boosted=[];
  for(const t of sharedHighStatTendencies(a,b)){
    const elite=t.score>=.85,chance=elite?.65:.35;
    if(rng()>=chance)continue;
    const bonus=elite?(.06+rng()*.06):(.03+rng()*.04);
    genes[t.stat]=Math.max(.65,Math.min(1.5,(Number(genes[t.stat])||1)+bonus));
    boosted.push({stat:t.stat,tier:t.tier,bonus:Math.round(bonus*1000)/1000});
  }
  return boosted;
}
"""
if anchor not in s: raise SystemExit('archiveSnapshot anchor missing')
s=s.replace(anchor,helpers+anchor,1)

# Advanced breed generator is the authoritative current implementation.
old="""  const type=rollBreedSpecies(a,b,rng);
  const genes=a.genes.map((v,i)=>Math.max(.65,Math.min(1.5,(v+b.genes[i])/2*(.9+rng()*.2))));
  const embryoChance=perfectEmbryoChance(a,b);
"""
new="""  const type=rollBreedSpecies(a,b,rng);
  const genes=a.genes.map((v,i)=>Math.max(.65,Math.min(1.5,(v+b.genes[i])/2*(.9+rng()*.2))));
  const inheritedStatTendencies=applySharedHighStatGenes(genes,a,b,rng);
  const embryoChance=perfectEmbryoChance(a,b);
"""
if old not in s: raise SystemExit('advanced gene anchor missing')
s=s.replace(old,new,1)

old="  child.trait=rng()<.70?(rng()<.5?a.trait:b.trait):TRAITS[Math.floor(rng()*TRAITS.length)].id;"
new="""  const traitRoll=rollChildTrait(a,b,rng);
  child.trait=traitRoll.id;
  child.traitOrigin=traitRoll.source;
  child.breedStatTendency=inheritedStatTendencies;
"""
if old not in s: raise SystemExit('child trait roll anchor missing')
s=s.replace(old,new,1)

# 4) Breeding UI: show parents' personality directions, inheritance odds, and shared high-stat tendency.
anchor="function breedSpeciesPreviewHTML(a,b){"
preview="""function breedingPersonalityPreviewHTML(a,b){
  if(!a||!b)return '';
  ensureMonsterSystemsMonster(a);ensureMonsterSystemsMonster(b);
  const ta=traitInfo(a),tb=traitInfo(b),same=ta.id===tb.id;
  const inherit=same?`${ta.name} 70% · 变异 30%`:`${ta.name} 40% · ${tb.name} 40% · 变异 20%`;
  const shared=sharedHighStatTendencies(a,b);
  const sharedText=shared.length?shared.map(x=>PERSONALITY_STAT_NAMES[x.stat]+(x.tier==='极高'?'（双方极高）':'（双方较高）')).join(' · '):'暂无双方共同达到高区间的五维';
  return '<div class="inherit-preview compact-preview"><h4>个性 / 能力倾向</h4><div class="inherit-skill-grid">'
    +'<div class="inherit-skill"><b>'+escapeActivity(name(a))+' · '+escapeActivity(ta.name)+'</b><br><span>'+escapeActivity(personalityStatSummary(ta.id))+'</span></div>'
    +'<div class="inherit-skill"><b>'+escapeActivity(name(b))+' · '+escapeActivity(tb.name)+'</b><br><span>'+escapeActivity(personalityStatSummary(tb.id))+'</span></div>'
    +'<div class="inherit-skill"><b>后代个性</b><br><span>'+escapeActivity(inherit)+'</span></div>'
    +'</div><p class="odds-note"><b>共同高能力：</b>'+escapeActivity(sharedText)+'。双方同一项能力越接近本星级高区间，后代该项基因越有机会获得额外提升；不是固定配方，也不会保证必出。</p></div>';
}
"""
if anchor not in s: raise SystemExit('breedSpeciesPreviewHTML anchor missing')
s=s.replace(anchor,preview+anchor,1)

old="breedSpeciesPreviewHTML(a,b)+breedingSkillPreview(a,b,o);"
new="breedingPersonalityPreviewHTML(a,b)+breedSpeciesPreviewHTML(a,b)+breedingSkillPreview(a,b,o);"
if old not in s: raise SystemExit('breed preview composition anchor missing')
s=s.replace(old,new,1)

old="个性效果会直接参与对应的派遣、繁育或亲密度计算。"
new="个性会直接改变五维能力倾向，也会参与对应的派遣、繁育或亲密度计算。"
if old not in s: raise SystemExit('trait tooltip text anchor missing')
s=s.replace(old,new,1)

# 5) Version bump.
s=s.replace("window.__qinsterVersion='v276';","window.__qinsterVersion='v277';",1)
if "window.__qinsterVersion='v277';" not in s: raise SystemExit('game version bump failed')
if '/* Qinster v277 personality-driven breeding */' not in s:
    s='/* Qinster v277 personality-driven breeding */\n'+s
GAME.write_text(s,encoding='utf-8')

idx=Path('index.html')
h=idx.read_text(encoding='utf-8')
h=h.replace('v276 · 等待','v277 · 等待').replace('v276 · engine','v277 · engine')
h=h.replace('?v=276','?v=277')
idx.write_text(h,encoding='utf-8')

pkg=Path('package.json')
p=pkg.read_text(encoding='utf-8').replace('"version": "276.0.0"','"version": "277.0.0"',1)
if '"version": "277.0.0"' not in p: raise SystemExit('package version bump failed')
pkg.write_text(p,encoding='utf-8')

lock=Path('package-lock.json')
if lock.exists():
    t=lock.read_text(encoding='utf-8')
    t=t.replace('"version": "276.0.0"','"version": "277.0.0"',2)
    lock.write_text(t,encoding='utf-8')

picker=Path('scripts/check-picker.mjs')
pt=picker.read_text(encoding='utf-8')
pt=pt.replace("assert.equal(w.__qinsterVersion,'v276');","""const personalityBrave=R.G.createMonster(9001,0,3,[1,1,1,1,1],[]),personalityFriendly=R.G.createMonster(9002,0,3,[1,1,1,1,1],[]);personalityBrave.trait='brave';personalityFriendly.trait='friendly';const braveStats=R.G.stats(personalityBrave),friendlyStats=R.G.stats(personalityFriendly);assert.ok(braveStats[1]>friendlyStats[1],'brave should lean toward attack');assert.ok(braveStats[2]<friendlyStats[2],'brave should trade defense for attack');const gameSource=fs.readFileSync('game.js','utf8');assert.match(gameSource,/function rollChildTrait/);assert.match(gameSource,/function applySharedHighStatGenes/);assert.match(gameSource,/breedingPersonalityPreviewHTML/);assert.equal(w.__qinsterVersion,'v277');""",1)
if "w.__qinsterVersion,'v277'" not in pt: raise SystemExit('picker version/assertions patch failed')
pt=pt.replace('unique expedition team.','unique expedition team, personality stat tendencies and breeding inheritance hooks.')
picker.write_text(pt,encoding='utf-8')
