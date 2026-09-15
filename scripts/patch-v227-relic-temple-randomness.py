from pathlib import Path

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

# --- Expand relic pool ------------------------------------------------------
needle="{id:'trainerBadge',name:'教官徽章',text:'训练营额外 +1 个候选选项；训练收益 +25%（可叠加）',mods:{trainingChoices:1,trainingGain:.25}}\n];"
repl="""{id:'trainerBadge',name:'教官徽章',text:'训练营额外 +1 个候选选项；训练收益 +25%（可叠加）',mods:{trainingChoices:1,trainingGain:.25}},
{id:'trainingSandbag',name:'负重沙袋',text:'训练收益 +15%；全队防御 +5%',mods:{trainingGain:.15,def:.05}},
{id:'shrineIncense',name:'祈愿香炉',text:'神庙额外 +1 个候选选项；神庙祝福效果 +25%（可叠加）',mods:{templeChoices:1,templeGain:.25}},
{id:'sacredPage',name:'圣纹残页',text:'神庙祝福效果 +15%；全队幸运 +5%',mods:{templeGain:.15,luck:.05}},
{id:'thornBrace',name:'尖刺护腕',text:'全队攻击 +10% · 防御 +6%',mods:{atk:.10,def:.06}},
{id:'ironPendant',name:'铁心吊坠',text:'全队防御 +12%；每场第一次受伤再降低 15%',mods:{def:.12,firstGuard:.15}},
{id:'windFeather',name:'追风羽',text:'全队速度 +12% · 幸运 +6%',mods:{spd:.12,luck:.06}},
{id:'boneDice',name:'幸运骨骰',text:'全队幸运 +15%',mods:{luck:.15}},
{id:'hunterHorn',name:'猎人号角',text:'精英奖励 +20%；全队攻击 +5%',mods:{eliteReward:.20,atk:.05}},
{id:'treasureCompass',name:'寻宝罗盘',text:'宝箱灵能 +30%；全队幸运 +5%',mods:{chest:.30,luck:.05}},
{id:'rationBelt',name:'补给腰包',text:'营地恢复效果 +12%',mods:{rest:.12}}
];"""
if needle not in s: raise SystemExit('relic expansion target not found')
s=s.replace(needle,repl,1)

# --- Dynamic curse severity ------------------------------------------------
needle="function ensureRunMeta(run){if(!run.items)run.items={};if(!run.curses)run.curses=[];if(!run.nextBattleMods)run.nextBattleMods={};if(!run.templeMods)run.templeMods={};if(!run.trainingMods)run.trainingMods={};return run}"
repl="function ensureRunMeta(run){if(!run.items)run.items={};if(!run.curses)run.curses=[];if(!run.curseValues)run.curseValues={};if(!run.nextBattleMods)run.nextBattleMods={};if(!run.templeMods)run.templeMods={};if(!run.trainingMods)run.trainingMods={};return run}"
if needle not in s: raise SystemExit('ensureRunMeta v226 target not found')
s=s.replace(needle,repl,1)

# Replace fixed fatigue text/mod with a marker. Actual severity is rolled when inflicted.
s=s.replace("{id:'trainingFatigue',name:'倦怠',text:'训练营获得的能力值 -40%',mods:{trainingGain:-.40}}", "{id:'trainingFatigue',name:'倦怠',text:'训练营获得量随机降低 1%～40%',mods:{}}")

start=s.find('function inflictCurse(run,id,logs=[]){')
end=s.find('function useRunItem(id){',start)
if start<0 or end<0: raise SystemExit('inflictCurse bounds not found')
new_inflict=r'''function curseText(run,c){
  if(!c)return '';
  if(c.id==='trainingFatigue')return `训练营获得量 -${Math.round((run.curseValues?.trainingFatigue||.01)*100)}%`;
  return c.text;
}
function inflictCurse(run,id,logs=[]){
  ensureRunMeta(run);if(run.curses.includes(id))return null;
  run.curses.push(id);const c=CURSES.find(x=>x.id===id);
  if(id==='trainingFatigue')run.curseValues.trainingFatigue=(1+Math.floor(Math.random()*40))/100;
  if(c)logs.push(`遭受 Debuff：${c.name}（${curseText(run,c)}）。`);return c
}
'''
s=s[:start]+new_inflict+s[end:]

# Training fatigue now reads the rolled 1-40% severity.
old="const rel=relicMods(run),curse=(run.curses||[]).reduce((sum,id)=>sum+Number(CURSES.find(x=>x.id===id)?.mods?.trainingGain||0),0);\n  return Math.max(.25,1+Number(rel.trainingGain||0)+curse);"
new="const rel=relicMods(run);let curse=0;if((run.curses||[]).includes('trainingFatigue'))curse-=Number(run.curseValues?.trainingFatigue||.01);\n  return Math.max(.25,1+Number(rel.trainingGain||0)+curse);"
if old not in s: raise SystemExit('trainingGainMultiplier target not found')
s=s.replace(old,new,1)

# Show actual dynamic curse text in status panel.
s=s.replace("curses.map(c=>`${c.name}（${c.text}）`).join(' · ')", "curses.map(c=>`${c.name}（${curseText(run,c)}）`).join(' · ')")

# --- Relic offers: larger random pool with repeats possible between offers ---
start=s.find('function offerRelic(run){')
end=s.find('function chooseRelic(run,id){',start)
if start<0 or end<0: raise SystemExit('offerRelic bounds not found')
new_offer="function offerRelic(run){run.relicChoices=shuffle(RELICS).slice(0,3).map(x=>x.id);run.phase='relic';save()}\n"
s=s[:start]+new_offer+s[end:]

# --- Temple becomes a choice-based node ------------------------------------
start=s.find('function temple(run){')
end=s.find('function challenge(run){',start)
if start<0 or end<0: raise SystemExit('temple bounds not found')
new_temple=r'''function templeChoiceCount(run){return Math.min(6,3+Math.max(0,Math.round(Number(relicMods(run).templeChoices)||0)))}
function templeGainMultiplier(run){return Math.max(1,1+Number(relicMods(run).templeGain||0))}
function makeTempleChoices(run){
  const gain=templeGainMultiplier(run),pool=[
    {title:'战神祝福',kind:'buff',mods:{atk:.08}},
    {title:'石卫祝福',kind:'buff',mods:{def:.08}},
    {title:'风灵祝福',kind:'buff',mods:{spd:.08}},
    {title:'星运祝福',kind:'buff',mods:{luck:.09}},
    {title:'四象祝福',kind:'buff',mods:{atk:.04,def:.04,spd:.04,luck:.04}},
    {title:'净化祷言',kind:'cleanse',count:1},
    {title:'生命祷言',kind:'heal',heal:.20},
    {title:'禁忌祈愿',kind:'risky',mods:{atk:.12,def:.12},curse:true}
  ];
  return shuffle(pool).slice(0,templeChoiceCount(run)).map(x=>{
    const y={...x};if(y.mods)y.mods=Object.fromEntries(Object.entries(y.mods).map(([k,v])=>[k,Math.round(v*gain*1000)/1000]));if(y.heal)y.heal=Math.min(.60,y.heal*gain);return y;
  });
}
function temple(run){ensureRunMeta(run);run.templeChoices=makeTempleChoices(run);run.phase='temple';save()}
function chooseTemple(run,i){
  ensureRunMeta(run);const x=run.templeChoices?.[i];if(!x)return;let text='';
  if(x.kind==='buff'||x.kind==='risky'){
    for(const [k,v] of Object.entries(x.mods||{}))run.templeMods[k]=(run.templeMods[k]||0)+v;
    text=Object.entries(x.mods||{}).map(([k,v])=>`${({atk:'攻击',def:'防御',spd:'速度',luck:'幸运'})[k]} +${Math.round(v*1000)/10}%`).join('、');
  }
  if(x.kind==='cleanse'){
    const gone=run.curses.splice(0,Math.min(run.curses.length,x.count||1)).map(id=>CURSES.find(c=>c.id===id)?.name||id);text=gone.length?'移除 Debuff：'+gone.join('、'):'当前没有 Debuff，祷言化为保护';
  }
  if(x.kind==='heal'){
    for(const id of run.teamIds||[])if(hpPct(run,id)>0&&canReviveInRun(run,id))run.hp[id]=Math.min(100,hpPct(run,id)+x.heal*100);text=`仍站立队员恢复 ${Math.round(x.heal*100)}% 远征HP`;
  }
  if(x.kind==='risky'&&x.curse){const pool=CURSES.filter(c=>!run.curses.includes(c.id));if(pool.length){const c=inflictCurse(run,rand(pool).id,[]);if(c)text+=`；代价：${c.name}（${curseText(run,c)}）`;}}
  run.templeResult={good:x.kind!=='risky',title:x.title,text};run.templeChoices=[];run.phase='templeResult';run.log.push(`神庙：选择【${x.title}】。${text}`);save();
}
'''
s=s[:start]+new_temple+s[end:]

# Temple choice screen before result screen.
marker='function templeResultHTML(run){'
pos=s.find(marker)
if pos<0: raise SystemExit('templeResultHTML marker not found')
html=r'''function templeHTML(run){
  const choices=run.templeChoices||[],gain=Math.round(templeGainMultiplier(run)*100),extra=Math.max(0,templeChoiceCount(run)-3);
  const fmt=x=>{if(x.kind==='cleanse')return '移除 1 个 Debuff';if(x.kind==='heal')return `恢复 ${Math.round(x.heal*100)}% 远征HP`;const t=Object.entries(x.mods||{}).map(([k,v])=>`${({atk:'攻击',def:'防御',spd:'速度',luck:'幸运'})[k]} +${Math.round(v*1000)/10}%`).join(' · ');return x.kind==='risky'?t+' · 同时获得随机 Debuff':t};
  return `${runHeader(run)}${runInventoryHTML(run)}${teamHTML(run)}<section class="rg-panel"><div class="rg-title"><div><b>◆ 神庙 · 选择祈愿</b><small>选择1项；祝福在本次远征持续生效</small></div><span>${choices.length}选1 · 祝福效率 ${gain}%${extra?' · 额外候选 +'+extra:''}</span></div><div class="rg-event-picks">${choices.map((x,i)=>`<button class="secondary" data-rg-temple-choice="${i}"><b>${x.title}</b><small>${fmt(x)}</small></button>`).join('')}</div></section>`;
}
'''
s=s[:pos]+html+s[pos:]

# Render temple choice phase.
s=s.replace("function activeHTML(run){if(run.phase==='training')return trainingHTML(run);", "function activeHTML(run){if(run.phase==='training')return trainingHTML(run);if(run.phase==='temple')return templeHTML(run);")

# Click handler for temple choices.
needle="const tc=ev.target.closest?.('[data-rg-training-choice]');"
repl="const tpc=ev.target.closest?.('[data-rg-temple-choice]');if(tpc){const run=ensure()?.rogueActive;if(run)chooseTemple(run,Number(tpc.dataset.rgTempleChoice));return}const tc=ev.target.closest?.('[data-rg-training-choice]');"
if needle not in s: raise SystemExit('temple click insertion target not found')
s=s.replace(needle,repl,1)

# Version marker.
for old in ["version:'v226-training-camp'","version:'v225-combat-route-breakdown'","version:'v224c-smooth-floor-scaling'"]:
    s=s.replace(old,"version:'v227-relic-temple-randomness'")

p.write_text(s,encoding='utf-8')
print('v227 relic pool, temple choices, and variable fatigue applied')
