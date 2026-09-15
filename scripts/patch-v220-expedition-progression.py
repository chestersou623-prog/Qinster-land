from pathlib import Path
import re

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

def sub(pattern,repl,count=1,flags=re.S,label='patch'):
    global s
    s2,n=re.subn(pattern,repl,s,count=count,flags=flags)
    if n!=count:
        raise SystemExit(f'{label}: expected {count}, got {n}')
    s=s2

# Two expedition maps instead of six fixed star brackets.
zone_block="""const ZONES=[
{id:'normal',tier:1,name:'远征',label:'普通远征',minStar:1,shinyOnly:false,attempts:5,badge:2,enemy:0.58,reward:1.00,desc:'1–5★都可参加 · 难度0也让1★队伍有通关机会'},
{id:'shiny',tier:2,name:'闪光远征',label:'闪光远征',minStar:1,shinyOnly:true,attempts:5,badge:4,enemy:0.75,reward:1.35,desc:'只允许闪光怪物 · 敌人更强 · 奖励更高'}
];
const DIFFICULTIES=[
{id:0,label:'难度 0',mods:{},reward:1.00,text:'无额外敌人加成'},
{id:1,label:'难度 1',mods:{hp:.10},reward:1.20,text:'敌人 HP +10%'},
{id:2,label:'难度 2',mods:{hp:.10,atk:.10},reward:1.40,text:'累计：HP +10% · 攻击 +10%'},
{id:3,label:'难度 3',mods:{hp:.10,atk:.10,def:.10},reward:1.60,text:'累计：HP/攻击/防御 +10%'},
{id:4,label:'难度 4',mods:{hp:.10,atk:.10,def:.10,spd:.10},reward:1.80,text:'累计：再加速度 +10% · 开始出现强化词条'},
{id:5,label:'难度 5',mods:{hp:.10,atk:.10,def:.10,spd:.10,luck:.10},reward:2.00,text:'累计：五项相关战斗属性 +10%'},
{id:6,label:'难度 6',mods:{hp:.25,atk:.10,def:.10,spd:.10,luck:.10},reward:2.25,text:'累计：HP 提升至 +25%'},
{id:7,label:'难度 7',mods:{hp:.25,atk:.25,def:.10,spd:.10,luck:.10},reward:2.50,text:'累计：攻击提升至 +25% · 最多2个强化词条'},
{id:8,label:'难度 8',mods:{hp:.25,atk:.25,def:.25,spd:.10,luck:.10},reward:2.75,text:'累计：防御提升至 +25%'},
{id:9,label:'难度 9',mods:{hp:.25,atk:.25,def:.25,spd:.25,luck:.10},reward:3.00,text:'累计：速度提升至 +25%'},
{id:10,label:'难度 10',mods:{hp:.25,atk:.25,def:.25,spd:.25,luck:.25},reward:3.30,text:'累计：五项相关战斗属性 +25% · 最多3个强化词条'}
];
function diff(id=selectedDifficulty){return DIFFICULTIES[Math.max(0,Math.min(10,Number(id)||0))]||DIFFICULTIES[0]}
"""
sub(r"const ZONES=\[.*?\n\];\nconst RELICS=",zone_block+"const RELICS=",label='zones')

s=s.replace("let selected=[],selectedZone='d1',sortMode='recommended',zoneInitialized=false;","let selected=[],selectedZone='normal',selectedDifficulty=0,sortMode='recommended',zoneInitialized=false;")

ensure_new="""function ensure(){const s=S();if(!s)return null;if(!s.expedition||typeof s.expedition!=='object')s.expedition={};const e=s.expedition;if(e.dayKey!==today()){e.dayKey=today();e.usedByZone={}}if(!e.usedByZone)e.usedByZone={};if(!e.extraAttempts)e.extraAttempts={};if(!e.difficultyUnlocked)e.difficultyUnlocked={normal:0,shiny:0};for(const x of ZONES)e.difficultyUnlocked[x.id]=Math.max(0,Math.min(10,Number(e.difficultyUnlocked[x.id])||0));e.attemptPotions=Math.max(0,Number(e.attemptPotions)||0);e.badges=Math.max(0,Number(e.badges)||0);if(!e.loot)e.loot={relicDust:0,starCrystal:0,eggFragment:0};if(!selected.length)selected=(e.lastTeamIds||[]).slice(0,3);if(!zoneInitialized){selectedZone=ZONES.some(x=>x.id===e.lastZone)?e.lastZone:'normal';selectedDifficulty=Math.min(Number(e.lastDifficulty)||0,e.difficultyUnlocked[selectedZone]||0);zoneInitialized=true}return e}"""
sub(r"function ensure\(\)\{.*?\}\nconst EGG_FRAGMENT_RECIPES=",ensure_new+"\nconst EGG_FRAGMENT_RECIPES=",label='ensure')

attempts="""function attemptKey(zone,d=selectedDifficulty){return `${zone.id}:d${Math.max(0,Number(d)||0)}`}
function used(e,zone,d=selectedDifficulty){return Math.max(0,Number(e.usedByZone?.[attemptKey(zone,d)])||0)}
function bonusAttempts(e,zone,d=selectedDifficulty){return Math.max(0,Number(e.extraAttempts?.[attemptKey(zone,d)])||0)}
function freeRemain(e,zone,d=selectedDifficulty){return Math.max(0,zone.attempts-used(e,zone,d))}
function totalRemain(e,zone,d=selectedDifficulty){return freeRemain(e,zone,d)+bonusAttempts(e,zone,d)}
function buyAttemptPotion(){const s=S(),e=ensure();if(!s||!e)return;const price=100000;if((Number(s.energy)||0)<price)return R()?.tell?.('灵能不足，需要 100,000。');s.energy-=price;e.attemptPotions=(e.attemptPotions||0)+1;save('购买远征次数回复药水 ×1。')}
function useAttemptPotion(){const e=ensure(),zone=z(),k=attemptKey(zone);if(!e)return;if((e.attemptPotions||0)<=0)return R()?.tell?.('没有远征次数回复药水。');e.attemptPotions--;e.extraAttempts[k]=bonusAttempts(e,zone)+1;save(`${zone.label} · ${diff().label} 可用远征次数 +1。`) }"""
sub(r"function used\(e,zone\).*?function rand\(a\)",attempts+"\nfunction rand(a)",label='attempt functions')

make_options="""function makeOptions(stage){if([8,17,26].includes(stage))return[{type:'boss'}];const local=stage%9,base=local===2||local===5?['elite','battle','rest','temple']:['battle','challenge','treasure','rest','temple'];let n=local>=5?3:2;let out=shuffle(base).slice(0,n);if(local===6&&!out.includes('elite'))out[0]='elite';return out.map(type=>({type,id:Math.random().toString(36).slice(2,8)}))}"""
sub(r"function makeOptions\(stage\)\{.*?\}\nfunction injectStyle",make_options+"\nfunction injectStyle",label='makeOptions')

route="""function routeBar(run){let h='';for(let i=0;i<27;i++){const boss=[8,17,26].includes(i),chapter=Math.floor(i/9)+1,label=boss?`B${chapter}`:(i+1);h+=`<span class=\"${i<run.stage?'done':i===run.stage?'now':''}\">${label}</span>`}return `<div class=\"rg-route\">${h}</div>`}"""
sub(r"function routeBar\(run\)\{.*?\}\nfunction activeTeam",route+"\nfunction activeTeam",label='routeBar')

start="""function startRun(){const e=ensure(),zone=z(),t=team(),d=diff();if(!e)return;if(selectedDifficulty>(e.difficultyUnlocked?.[zone.id]||0))return R()?.tell?.('这个难度还没有解锁。');if(t.length!==3)return R()?.tell?.('需要选择 3 只怪物。');if(new Set(t.map(m=>m.id)).size!==3)return R()?.tell?.('不能重复选择同一只怪物。');if(zone.shinyOnly&&t.some(m=>!m.shiny))return R()?.tell?.('闪光远征只允许闪光怪物参加。');if(totalRemain(e,zone)<=0)return R()?.tell?.('这个地图与难度今天的免费次数已用完；可使用远征次数回复药水继续。');const k=attemptKey(zone);if(freeRemain(e,zone)>0)e.usedByZone[k]=used(e,zone)+1;else e.extraAttempts[k]=Math.max(0,bonusAttempts(e,zone)-1);e.lastZone=zone.id;e.lastDifficulty=selectedDifficulty;e.lastTeamIds=t.map(m=>m.id);const hp={};t.forEach(m=>hp[m.id]=100);e.rogueActive={zone:zone.id,difficulty:selectedDifficulty,teamIds:t.map(m=>m.id),stage:0,maxStage:27,hp,supply:5,relics:[],energy:0,tempBadges:0,materials:{relicDust:0,starCrystal:0,eggFragment:0},options:makeOptions(0),phase:'map',log:[`${zone.label} · ${d.label} 开始。目标：击败第9/18/27层三名大BOSS。`],startedAt:Date.now(),formation:0,items:{},curses:[],nextBattleMods:{},bossCount:0};save(`${zone.label} · ${d.label} 开始：共27层，每9层一个大BOSS。`)}"""
sub(r"function startRun\(\)\{.*?\}\nfunction rotateFormation",start+"\nfunction rotateFormation",label='startRun')

reward_scale="""function nodeRewardScale(zone,stage){const run=ensure()?.rogueActive,d=diff(run?.difficulty??selectedDifficulty),chapter=Math.floor((Number(stage)||0)/9),local=(Number(stage)||0)%9;return zone.reward*d.reward*(1+chapter*.18+local*.04)}"""
sub(r"function nodeRewardScale\(zone,stage\)\{.*?\}",reward_scale,label='nodeRewardScale')

enemy_preview="""function enemyPreview(run,kind){const zone=z(run.zone),d=diff(run.difficulty),elite=kind==='elite',boss=kind==='boss',local=run.stage%9,chapter=Math.floor(run.stage/9),base=zone.enemy*(1+local*.05+chapter*.18)*(elite?1.18:1)*(boss?1.32:1),range=boss?[1.20,1.45]:elite?[1.05,1.25]:[.90,1.10],variance=range[0]+Math.random()*(range[1]-range[0]),mods=d.mods||{},speciesCount=Math.max(1,R()?.G?.SPECIES?.length||1),enemySpecies=Math.floor(Math.random()*speciesCount),affixPool=[{name:'狂暴',mods:{atk:.20}},{name:'铁壁',mods:{def:.25}},{name:'迅捷',mods:{spd:.20}},{name:'强运',mods:{luck:.25}},{name:'巨躯',mods:{hp:.25}},{name:'精准',mods:{atk:.08,luck:.15}}],affixCount=d.id>=10?3:d.id>=7?2:d.id>=4?1:0,affixes=shuffle(affixPool).slice(0,affixCount),am={};for(const a of affixes)for(const [k,v] of Object.entries(a.mods))am[k]=(am[k]||0)+v;const mult=base*variance,hpMul=1+(mods.hp||0)+(am.hp||0),atkMul=1+(mods.atk||0)+(am.atk||0),defMul=1+(mods.def||0)+(am.def||0),spdMul=1+(mods.spd||0)+(am.spd||0),luckMul=1+(mods.luck||0)+(am.luck||0);return{kind,enemySpecies,enemyShiny:zone.shinyOnly,enemyMax:Math.round((190*mult+40)*hpMul),enemyAtk:Math.round((42*mult+8)*atkMul),enemyDef:Math.round((35*mult+7)*defMul),enemySpd:Math.round((30*mult+6)*spdMul),enemyLuck:Math.round((26*mult+5)*luckMul),affixes:affixes.map(x=>x.name),variance:Math.round(variance*100)}}"""
sub(r"function enemyPreview\(run,kind\)\{.*?\}\nfunction prepareBattle",enemy_preview+"\nfunction prepareBattle",label='enemyPreview')

# Add affix information to enemy cards in preview and result.
s=s.replace("<small>速度 ${b.enemySpd} · 幸运 ${b.enemyLuck}</small><div class=\"rg-hp\">","<small>速度 ${b.enemySpd} · 幸运 ${b.enemyLuck}</small><small>${b.affixes?.length?'强化词条：'+b.affixes.join(' · '):'强化词条：无'} · 随机系数 ${b.variance||100}%</small><div class=\"rg-hp\">")
s=s.replace("<small>速度 ${b.enemySpd||'-'} · 幸运 ${b.enemyLuck||'-'}</small><div class=\"rg-hp\">","<small>速度 ${b.enemySpd||'-'} · 幸运 ${b.enemyLuck||'-'}</small><small>${b.affixes?.length?'强化词条：'+b.affixes.join(' · '):'强化词条：无'} · 随机系数 ${b.variance||100}%</small><div class=\"rg-hp\">")

# Preserve preview metadata in battle result.
s=s.replace("enemyPower,teamPower:Math.round(initialTeamPower),logs,events,startHp,win,reason,enemySpecies:ep.enemySpecies","enemyPower,teamPower:Math.round(initialTeamPower),logs,events,startHp,win,reason,enemySpecies:ep.enemySpecies,enemyShiny:ep.enemyShiny,affixes:ep.affixes||[],variance:ep.variance")

checkpoint="""function checkpointBoss(run){const zone=z(run.zone),d=diff(run.difficulty),bossNo=Math.floor(run.stage/9)+1,mapBonus=zone.shinyOnly?1.35:1,fragments=Math.round((bossNo===1?5:10)+(bossNo===1?2:4)*d.id)*mapBonus,crystals=Math.max(1,Math.round((bossNo+d.id/3)*mapBonus));run.materials.eggFragment=(run.materials.eggFragment||0)+fragments;run.materials.starCrystal=(run.materials.starCrystal||0)+crystals;run.tempBadges+=bossNo;run.bossCount=bossNo;run.log.push(`第 ${bossNo} 名大BOSS击败：蛋碎片 +${fragments} · 星辉结晶 +${crystals} · 临时徽章 +${bossNo}。`);offerRelic(run)}
function continueBattle(run){if(!run.battle)return;if(!run.battle.win){finish(run,false,true);return}const kind=run.battle.kind;run.battle=null;if(kind==='boss'){if(run.stage>=26){finalChoices(run);return}checkpointBoss(run);return}if(kind==='elite'){offerRelic(run);return}if(Math.random()<.28){offerRelic(run);return}advance(run)}"""
sub(r"function continueBattle\(run\)\{.*?\}\nfunction finalChoices",checkpoint+"\nfunction finalChoices",label='continueBattle')

final_choices="""function finalChoices(run){const zone=z(run.zone),d=diff(run.difficulty),scale=zone.reward*d.reward,mapBonus=zone.shinyOnly?1.35:1;if(!run.finalBossBonusGiven){const fragments=Math.round((20+d.id*6)*mapBonus),crystals=Math.max(2,Math.round((3+d.id/2)*mapBonus));run.materials.eggFragment=(run.materials.eggFragment||0)+fragments;run.materials.starCrystal=(run.materials.starCrystal||0)+crystals;run.finalBossBonusGiven=true;run.log.push(`最终大BOSS奖励：蛋碎片 +${fragments} · 星辉结晶 +${crystals}。`)}run.finalChoices=shuffle([
{type:'badges',title:'徽章袋',text:`远征徽章 +${Math.round((zone.badge*2+d.id)*mapBonus)}`,value:Math.round((zone.badge*2+d.id)*mapBonus)},
{type:'energy',title:'灵能核心',text:`额外灵能 +${Math.round(6500*scale)}`,value:Math.round(6500*scale)},
{type:'relicDust',title:'遗物尘',text:`遗物尘 +${Math.max(3,Math.round((3+d.id)*mapBonus))}`,value:Math.max(3,Math.round((3+d.id)*mapBonus))},
{type:'starCrystal',title:'星辉结晶',text:`星辉结晶 +${Math.max(2,Math.round((2+d.id/2)*mapBonus))}`,value:Math.max(2,Math.round((2+d.id/2)*mapBonus))},
{type:'eggFragment',title:'特殊蛋碎片',text:`特殊蛋碎片 +${Math.round((15+d.id*5)*mapBonus)}`,value:Math.round((15+d.id*5)*mapBonus)}]).slice(0,3);run.phase='final';save('第三名大BOSS已击败，选择本局最终奖励。')}"""
sub(r"function finalChoices\(run\)\{.*?\}\nfunction chooseFinal",final_choices+"\nfunction chooseFinal",label='finalChoices')

# Unlock next difficulty after a full clear.
finish_new="""function finish(run,cleared=false,defeated=false,choice=''){const s=S(),e=ensure();if(!s||!e)return;const zone=z(run.zone),fraction=cleared?1:defeated?.35:.65,payout=Math.round(run.energy*fraction),badge=cleared?zone.badge+run.tempBadges:Math.floor(run.tempBadges*fraction);s.energy=(Number(s.energy)||0)+payout;e.badges+=badge;for(const k of Object.keys(run.materials))e.loot[k]=(e.loot[k]||0)+Math.floor((run.materials[k]||0)*fraction);if(cleared){const current=Math.max(0,Number(run.difficulty)||0),unlocked=Math.max(0,Number(e.difficultyUnlocked?.[zone.id])||0);if(current>=unlocked&&current<10)e.difficultyUnlocked[zone.id]=current+1}const lifeNotes=applyExpeditionLifeCost(run,cleared);e.rogueLast={zone:zone.name,difficulty:run.difficulty||0,cleared,defeated,payout,badge,relics:run.relics?.length||0,time:Date.now(),choice,lifeNotes};e.rogueActive=null;const lifeText=lifeNotes.length?' · '+lifeNotes.join('；'):'';const unlockText=cleared&&(run.difficulty||0)<10?` · 已解锁难度 ${(run.difficulty||0)+1}`:'';save((cleared?`远征通关！带回 ${payout} 灵能、徽章 ×${badge}。`:`远征结束，带回 ${payout} 灵能。`)+unlockText+lifeText)}"""
sub(r"function finish\(run,cleared=false,defeated=false,choice=''\)\{.*?\}\nfunction abandon",finish_new+"\nfunction abandon",label='finish')

node_html="""function nodeHTML(run){return `<section class=\"rg-panel\"><div class=\"rg-title\"><div><b>选择下一条路线</b><small>共27层；第9、18、27层固定为大BOSS</small></div><span>第 ${run.stage+1}/27 层</span></div><div class=\"rg-nodes\">${run.options.map((o,i)=>{const m=NODE_META[o.type];return `<button class=\"rg-node\" data-rg-node=\"${i}\"><strong>${m[0]}</strong><b>${m[1]}</b><small>${m[2]}</small></button>`}).join('')}</div></section>`}"""
sub(r"function nodeHTML\(run\)\{.*?\}\nfunction runHeader",node_html+"\nfunction runHeader",label='nodeHTML')

run_header="""function runHeader(run){const zone=z(run.zone),d=diff(run.difficulty),chapter=Math.floor(run.stage/9)+1;return `<section class=\"rg-panel\"><div class=\"rg-title\"><div><b>${zone.label} · ${d.label}</b><small>27层 · 每9层一个大BOSS · 当前第 ${Math.min(3,chapter)} 区域</small></div><button class=\"secondary\" data-rg-abandon>撤退结算</button></div>${routeBar(run)}<div class=\"rg-status\"><span>补给 ${run.supply}</span><span>暂存灵能 ${Math.round(run.energy)}</span><span>临时徽章 ${run.tempBadges}</span><span>遗物 ${(run.relics||[]).length}</span><span>蛋碎片 ${run.materials?.eggFragment||0}</span></div></section>`}"""
sub(r"function runHeader\(run\)\{.*?\}\nfunction teamHTML",run_header+"\nfunction teamHTML",label='runHeader')

idle="""function idleHTML(e){const zone=z(),d=diff(),unlock=Math.max(0,Number(e.difficultyUnlocked?.[zone.id])||0),list=sorted(zone),rec=new Set(list.slice(0,3).map(m=>m.id)),free=freeRemain(e,zone),bonus=bonusAttempts(e,zone),remain=free+bonus;const opts=i=>'<option value=\"\">选择队员 '+(i+1)+'</option>'+list.map(m=>`<option value=\"${m.id}\" ${selected[i]===m.id?'selected':''}>${rec.has(m.id)?'★推荐 · ':''}${stars(m)}${m.shiny?' ✦':''} ${monsterName(m)} · 总能力 ${st(m).reduce((a,b)=>a+b,0)}</option>`).join('');return `<div class=\"rogue\"><section class=\"rg-panel\"><div class=\"rg-title\"><div><b>选择远征地图</b><small>原来的1–5星难度已合并；普通远征允许任何1–5★怪物</small></div><span class=\"rg-materials\">徽章 ${e.badges} · 遗物尘 ${e.loot.relicDust} · 星辉结晶 ${e.loot.starCrystal} · 蛋碎片 ${e.loot.eggFragment}</span></div><div class=\"rg-tabs\">${ZONES.map(x=>`<button class=\"secondary ${x.id===selectedZone?'on':''}\" data-rg-zone=\"${x.id}\"><b>${x.label}</b><small>${x.desc}</small></button>`).join('')}</div></section><section class=\"rg-panel\"><div class=\"rg-title\"><div><b>${zone.label} · 选择难度</b><small>通关当前最高难度后解锁下一档；加成会累计</small></div><span>最高已解锁：难度 ${unlock}</span></div><div class=\"rg-tabs\">${DIFFICULTIES.map(x=>`<button class=\"secondary ${x.id===selectedDifficulty?'on':''}\" data-rg-difficulty=\"${x.id}\" ${x.id<=unlock?'':'disabled'}><b>${x.label}${x.id>unlock?' 🔒':''}</b><small>${x.text} · 奖励 ×${x.reward.toFixed(2)}</small></button>`).join('')}</div><p class=\"rg-note\"><b>${d.label}：</b>${d.text}。普通敌人数值会在约90%–110%随机；精英约105%–125%；大BOSS约120%–145%。难度4起会出现随机强化词条。</p></section><section class=\"rg-panel\"><div class=\"rg-title\"><div><b>准备出发</b><small>${zone.shinyOnly?'只允许闪光怪物；1–5★均可':'1–5★均可参加；难度0按1★队伍也有机会通关来平衡'}</small></div><span>27层 · BOSS在9 / 18 / 27层</span></div><div class=\"rg-status\"><span>今日免费剩余 ${free}</span><span>追加次数 ${bonus}</span><span>次数药水 ×${e.attemptPotions||0}</span></div><div style=\"display:flex;gap:8px;flex-wrap:wrap;margin:8px 0\"><button class=\"secondary\" data-rg-buy-attempt>购买药水 100,000 灵能</button><button class=\"secondary\" data-rg-use-attempt ${(e.attemptPotions||0)>0?'':'disabled'}>使用药水：本地图/难度 +1次</button></div><p class=\"rg-note\">三个大BOSS都会给蛋碎片；难度越高，碎片和整体奖励越高。第三名BOSS还会进入最终奖励三选一。</p><div class=\"rg-title\"><div><b>选择3只怪物</b><small>队伍顺序：1号前卫、2号中卫、3号后卫</small></div><div><select data-rg-sort><option value=\"recommended\" ${sortMode==='recommended'?'selected':''}>最佳推荐</option><option value=\"newest\" ${sortMode==='newest'?'selected':''}>最新加入</option><option value=\"oldest\" ${sortMode==='oldest'?'selected':''}>最早加入</option><option value=\"total\" ${sortMode==='total'?'selected':''}>总能力</option><option value=\"star\" ${sortMode==='star'?'selected':''}>星级</option><option value=\"luck\" ${sortMode==='luck'?'selected':''}>幸运</option></select><button class=\"secondary\" data-rg-recommend>一键最佳推荐</button></div></div><div class=\"rg-grid3 rg-select\">${[0,1,2].map(i=>`<label><b>${['前卫','中卫','后卫'][i]}</b><select data-rg-slot=\"${i}\">${opts(i)}</select></label>`).join('')}</div>${team().length?`<div class=\"rg-team\" style=\"margin-top:8px\">${[...team()].reverse().map((m,vi)=>{const i=team().length-1-vi;return `<div class=\"rg-mon\">${R()?.sprite?.(m.species,m.tint,m.shiny,m.specialColor)||''}<b>${monsterName(m)} ${stars(m)}</b><small>${['前卫','中卫','后卫'][i]} · 总能力 ${st(m).reduce((a,b)=>a+b,0)}</small></div>`}).join('')}</div>`:''}<button class=\"primary rg-mainbtn\" data-rg-start ${team().length===3&&remain>0&&selectedDifficulty<=unlock?'':'disabled'}>开始 ${zone.label} · ${d.label}</button></section>${eggWorkshopHTML(e)}${e.rogueLast?`<section class=\"rg-panel\"><b>上次远征</b><small>${e.rogueLast.zone} · 难度 ${e.rogueLast.difficulty||0} · ${e.rogueLast.cleared?'通关':e.rogueLast.defeated?'战败':'撤退'} · ${e.rogueLast.payout} 灵能 · 徽章 ×${e.rogueLast.badge}</small></section>`:''}</div>`}"""
sub(r"function idleHTML\(e\)\{.*?\}\nfunction render",idle+"\nfunction render",label='idleHTML')

# Map and difficulty click handlers.
s=s.replace("if(zone){selectedZone=zone.dataset.rgZone;selected=[];const e=ensure();if(e)e.lastZone=selectedZone;save();return}if(ev.target.closest?.('[data-rg-buy-attempt]'))", "if(zone){selectedZone=zone.dataset.rgZone;selectedDifficulty=0;selected=[];const e=ensure();if(e){e.lastZone=selectedZone;e.lastDifficulty=0}save();return}const difficulty=ev.target.closest?.('[data-rg-difficulty]');if(difficulty){const e=ensure(),n=Number(difficulty.dataset.rgDifficulty)||0;if(n<=(e?.difficultyUnlocked?.[selectedZone]||0)){selectedDifficulty=n;if(e)e.lastDifficulty=n;save()}return}if(ev.target.closest?.('[data-rg-buy-attempt]'))")

s=s.replace("version:'v219-combat-skills-dodge-temple-50items'","version:'v220-two-maps-27f-difficulty-ladder'")

p.write_text(s,encoding='utf-8')
print('v220 patch applied')
