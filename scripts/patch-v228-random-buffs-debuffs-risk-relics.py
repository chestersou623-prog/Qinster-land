from pathlib import Path

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

# --- Add RNG-control and double-edged relics -------------------------------
needle="{id:'rationBelt',name:'补给腰包',text:'营地恢复效果 +12%',mods:{rest:.12}}\n];"
repl="""{id:'rationBelt',name:'补给腰包',text:'营地恢复效果 +12%',mods:{rest:.12}},
{id:'fateWeight',name:'命运砝码',text:'随机 Buff 最低值 +2个百分点；随机 Debuff 最大值 -4个百分点（可叠加）',mods:{buffFloor:2,debuffCap:4}},
{id:'bloodCrown',name:'血战王冠',text:'全队攻击 +28%，防御 -14%',mods:{atk:.28,def:-.14}},
{id:'galeGamble',name:'疾风赌注',text:'全队速度 +30%，防御 -12%',mods:{spd:.30,def:-.12}},
{id:'fortunePact',name:'豪赌契约',text:'全队幸运 +32%，攻击 -10%',mods:{luck:.32,atk:-.10}},
{id:'glassHeart',name:'玻璃心核',text:'全队攻击 +20%、速度 +16%，防御 -18%',mods:{atk:.20,spd:.16,def:-.18}}
];"""
if needle not in s:
    raise SystemExit('v228 relic insertion target not found')
s=s.replace(needle,repl,1)

# --- Make every expedition curse roll its own severity ---------------------
start=s.find('const CURSES=[')
end=s.find('];\nconst CHALLENGES=',start)
if start<0 or end<0:
    raise SystemExit('CURSES bounds not found')
new_curses=r'''const CURSES=[
{id:'weaken',name:'虚弱',text:'攻击随机降低 5%～25%',roll:{atk:[.05,.25]}},
{id:'breakArmor',name:'破甲',text:'防御随机降低 5%～25%',roll:{def:[.05,.25]}},
{id:'slow',name:'迟缓',text:'速度随机降低 5%～30%',roll:{spd:[.05,.30]}},
{id:'badLuck',name:'厄运',text:'幸运随机降低 5%～35%',roll:{luck:[.05,.35]}},
{id:'routeErosion',name:'侵蚀',text:'每到新地点随机失去 1%～4% 最大远征HP（最低保留 1%）',roll:{routeLoss:[1,4]}},
{id:'trainingFatigue',name:'倦怠',text:'训练营获得量随机降低 1%～40%',roll:{trainingGain:[.01,.40]}}
'''
s=s[:start]+new_curses+s[end:]

# --- Helpers for controlled RNG --------------------------------------------
marker='function relicMods(run){'
pos=s.find(marker)
if pos<0: raise SystemExit('relicMods marker not found')
helpers=r'''function rngControl(run){
  const m=relicMods(run);return{buffFloor:Math.max(0,Number(m.buffFloor)||0),debuffCap:Math.max(0,Number(m.debuffCap)||0)};
}
function rollBetween(a,b){return Number(a)+(Number(b)-Number(a))*Math.random()}
function rollBuffPct(run,min,max){
  const c=rngControl(run),lo=Math.min(Number(max),Number(min)+c.buffFloor/100),hi=Math.max(lo,Number(max));
  return Math.round(rollBetween(lo,hi)*1000)/1000;
}
function rollDebuffPct(run,min,max){
  const c=rngControl(run),lo=Math.max(0,Number(min)),hi=Math.max(lo,Number(max)-c.debuffCap/100);
  return Math.round(rollBetween(lo,hi)*1000)/1000;
}
function rolledCurse(run,id){ensureRunMeta(run);return run.curseValues?.[id]||{};}
'''
s=s[:pos]+helpers+s[pos:]

# ensure curseValues exists (v227 already has it, keep robust)
s=s.replace("if(!run.curses)run.curses=[];if(!run.curseValues)run.curseValues={};", "if(!run.curses)run.curses=[];if(!run.curseValues)run.curseValues={};",1)

# Replace curse display + infliction with generic rolled values.
start=s.find('function curseText(run,c){')
end=s.find('function useRunItem(id){',start)
if start<0 or end<0: raise SystemExit('curseText/inflict bounds not found')
new_inflict=r'''function curseText(run,c){
  if(!c)return '';
  const v=rolledCurse(run,c.id);
  if(c.id==='weaken')return `攻击 -${Math.round((v.atk||.05)*1000)/10}%`;
  if(c.id==='breakArmor')return `防御 -${Math.round((v.def||.05)*1000)/10}%`;
  if(c.id==='slow')return `速度 -${Math.round((v.spd||.05)*1000)/10}%`;
  if(c.id==='badLuck')return `幸运 -${Math.round((v.luck||.05)*1000)/10}%`;
  if(c.id==='routeErosion')return `每个新地点 -${Math.round(v.routeLoss||1)}% 最大远征HP`;
  if(c.id==='trainingFatigue')return `训练营获得量 -${Math.round((v.trainingGain||.01)*1000)/10}%`;
  return c.text;
}
function inflictCurse(run,id,logs=[]){
  ensureRunMeta(run);if(run.curses.includes(id))return null;
  const c=CURSES.find(x=>x.id===id);if(!c)return null;
  const out={};
  for(const [k,range] of Object.entries(c.roll||{})){
    if(k==='routeLoss'){
      const ctrl=rngControl(run),hi=Math.max(Number(range[0]),Number(range[1])-Math.floor(ctrl.debuffCap/4));
      out[k]=Math.max(1,Math.round(rollBetween(Number(range[0]),hi)));
    }else out[k]=rollDebuffPct(run,range[0],range[1]);
  }
  run.curseValues[id]=out;run.curses.push(id);
  logs.push(`遭受 Debuff：${c.name}（${curseText(run,c)}）。`);return c;
}
'''
s=s[:start]+new_inflict+s[end:]

# Make combat mods consume rolled curse values instead of fixed curse mods.
old="for(const id of run.curses||[]){const c=CURSES.find(x=>x.id===id);for(const [k,v] of Object.entries(c?.mods||{}))out[k]=(out[k]||0)+v}return out}"
new="for(const id of run.curses||[]){const rv=rolledCurse(run,id);for(const k of ['atk','def','spd','luck']){const v=Number(rv[k]||0);if(v)out[k]=(out[k]||0)-v}}return out}"
if old not in s: raise SystemExit('combatMods curse loop target not found')
s=s.replace(old,new,1)

# Training fatigue uses generic rolled severity.
s=s.replace("if((run.curses||[]).includes('trainingFatigue'))curse-=Number(run.curseValues?.trainingFatigue||.01);", "if((run.curses||[]).includes('trainingFatigue'))curse-=Number(rolledCurse(run,'trainingFatigue').trainingGain||.01);",1)

# Route erosion uses its rolled loss instead of fixed 2%.
s=s.replace("const before=hpPct(run,id),after=Math.max(1,before-2);", "const loss=Math.max(1,Number(rolledCurse(run,'routeErosion').routeLoss)||1),before=hpPct(run,id),after=Math.max(1,before-loss);",1)
s=s.replace("run.log.push('侵蚀：抵达新地点，全队最大远征HP -2% · '+affected.join('、')+'。');", "run.log.push('侵蚀：抵达新地点，全队最大远征HP -'+Math.max(1,Number(rolledCurse(run,'routeErosion').routeLoss)||1)+'% · '+affected.join('、')+'。');",1)

# Cleansing should also discard rolled curse values, so re-acquiring rerolls it.
s=s.replace("const gone=run.curses.splice(0,count).map(cid=>CURSES.find(x=>x.id===cid)?.name||cid);", "const goneIds=run.curses.splice(0,count);const gone=goneIds.map(cid=>{const n=CURSES.find(x=>x.id===cid)?.name||cid;delete run.curseValues?.[cid];return n});",1)
s=s.replace("const gone=run.curses.splice(0,Math.min(run.curses.length,x.count||1)).map(id=>CURSES.find(c=>c.id===id)?.name||id);", "const goneIds=run.curses.splice(0,Math.min(run.curses.length,x.count||1));const gone=goneIds.map(id=>{const n=CURSES.find(c=>c.id===id)?.name||id;delete run.curseValues?.[id];return n});",1)

# Tooltip must use rolled debuff values.
old="for(const id of run.curses||[]){const c=CURSES.find(x=>x.id===id),x=Number(c?.mods?.[k]||0);if(x){v+=x;names.push(c.name)}}"
new="for(const id of run.curses||[]){const c=CURSES.find(x=>x.id===id),x=-Number(rolledCurse(run,id)?.[k]||0);if(x){v+=x;names.push(c.name)}}"
if old not in s: raise SystemExit('tooltip curseContribution target not found')
s=s.replace(old,new,1)

# --- Temple buffs: every blessing rolls within a range ---------------------
start=s.find('function makeTempleChoices(run){')
end=s.find('function temple(run){',start)
if start<0 or end<0: raise SystemExit('makeTempleChoices bounds not found')
new_temple=r'''function makeTempleChoices(run){
  const gain=templeGainMultiplier(run),pct=(a,b)=>Math.round(rollBuffPct(run,a,b)*gain*1000)/1000,pool=[
    {title:'战神祝福',kind:'buff',make:()=>({atk:pct(.03,.15)})},
    {title:'石卫祝福',kind:'buff',make:()=>({def:pct(.03,.15)})},
    {title:'风灵祝福',kind:'buff',make:()=>({spd:pct(.03,.15)})},
    {title:'星运祝福',kind:'buff',make:()=>({luck:pct(.03,.18)})},
    {title:'四象祝福',kind:'buff',make:()=>{const v=pct(.02,.08);return{atk:v,def:v,spd:v,luck:v}}},
    {title:'净化祷言',kind:'cleanse',count:1},
    {title:'生命祷言',kind:'heal',heal:Math.round(rollBetween(.10,.30)*gain*1000)/1000},
    {title:'禁忌祈愿',kind:'risky',make:()=>({atk:pct(.08,.20),def:pct(.08,.20)}),curse:true}
  ];
  return shuffle(pool).slice(0,templeChoiceCount(run)).map(x=>{const y={...x};if(y.make)y.mods=y.make();delete y.make;return y});
}
'''
s=s[:start]+new_temple+s[end:]

# Explain RNG control in temple screen when present.
s=s.replace("<span>${choices.length}选1 · 祝福效率 ${gain}%${extra?' · 额外候选 +'+extra:''}</span>", "<span>${choices.length}选1 · 祝福效率 ${gain}%${extra?' · 额外候选 +'+extra:''}${rngControl(run).buffFloor?' · Buff最低 +'+rngControl(run).buffFloor+'%':''}</span>",1)

# Version marker.
for old in ["version:'v227-relic-temple-randomness'","version:'v226-training-camp'","version:'v225-combat-route-breakdown'"]:
    s=s.replace(old,"version:'v228-random-buff-debuff-risk-relics'")

p.write_text(s,encoding='utf-8')
print('v228 randomized buffs/debuffs and risk relics applied')
