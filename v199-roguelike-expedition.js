(()=>{
'use strict';
const STAT=['体质','攻击','防御','速度','幸运'];
const ZONES=[
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
const RELICS=[
{id:'fang',name:'赤牙',text:'全队攻击 +18%',mods:{atk:.18}},
{id:'shell',name:'古壳',text:'全队防御 +20%',mods:{def:.20}},
{id:'boots',name:'风行靴',text:'全队速度 +22%',mods:{spd:.22}},
{id:'clover',name:'四叶结晶',text:'全队幸运 +24%',mods:{luck:.24}},
{id:'heart',name:'生命核心',text:'战后全队恢复 12% 远征生命',mods:{heal:.12}},
{id:'guard',name:'先祖护符',text:'每场战斗第一次受伤降低 45%',mods:{firstGuard:.45}},
{id:'blade',name:'玻璃刃',text:'后排攻击 +32%，防御 -10%',mods:{backAtk:.32,backDef:-.10}},
{id:'wall',name:'守门石',text:'前排防御 +35%，攻击 -8%',mods:{frontDef:.35,frontAtk:-.08}},
{id:'feast',name:'野营锅',text:'休息节点额外恢复 20%，补给 +1',mods:{rest:.20}},
{id:'hunter',name:'猎迹灯',text:'精英战奖励 +35%',mods:{eliteReward:.35}},
{id:'coin',name:'旧王金币',text:'宝箱灵能 +50%',mods:{chest:.50}},
{id:'star',name:'星辉镜',text:'闪光怪物攻击/幸运 +15%',mods:{shiny:.15}}
];
const RUN_ITEMS=[
{id:'stim',name:'战斗兴奋剂',text:'下一场战斗：全队攻击 +25%',mods:{atk:.25},kind:'boost'},
{id:'armorSpray',name:'护盾喷雾',text:'下一场战斗：全队防御 +30%',mods:{def:.30},kind:'boost'},
{id:'swiftCharm',name:'迅捷符',text:'下一场战斗：全队速度 +30%',mods:{spd:.30},kind:'boost'},
{id:'luckyDie',name:'幸运骰',text:'下一场战斗：全队幸运 +35%',mods:{luck:.35},kind:'boost'},
{id:'medkit',name:'远征急救包',text:'立即恢复所有仍站立队员 25% 远征HP；不能复活',heal:.25,kind:'heal'},
{id:'cleanser',name:'净化剂',text:'移除一个当前 Debuff',kind:'cleanse'},
{id:'redTonic',name:'赤红强心剂',text:'下一场战斗：攻击 +15%',mods:{atk:.15},kind:'boost'},
{id:'ironTea',name:'铁壁茶',text:'下一场战斗：防御 +15%',mods:{def:.15},kind:'boost'},
{id:'windCandy',name:'风速糖',text:'下一场战斗：速度 +18%',mods:{spd:.18},kind:'boost'},
{id:'fortuneCoin',name:'祈运铜钱',text:'下一场战斗：幸运 +18%',mods:{luck:.18},kind:'boost'},
{id:'warDrum',name:'袖珍战鼓',text:'下一场战斗：攻击 +12%、速度 +8%',mods:{atk:.12,spd:.08},kind:'boost'},
{id:'stoneOil',name:'岩甲油',text:'下一场战斗：防御 +20%、速度 -5%',mods:{def:.20,spd:-.05},kind:'boost'},
{id:'starSyrup',name:'星辉糖浆',text:'下一场战斗：幸运 +22%、攻击 +6%',mods:{luck:.22,atk:.06},kind:'boost'},
{id:'hunterMark',name:'猎手标记',text:'下一场战斗：攻击 +10%、幸运 +10%',mods:{atk:.10,luck:.10},kind:'boost'},
{id:'quickBandage',name:'速效绷带',text:'立即恢复所有仍站立队员 12% HP',heal:.12,kind:'heal'},
{id:'largeMedkit',name:'强化急救箱',text:'立即恢复所有仍站立队员 40% HP',heal:.40,kind:'heal'},
{id:'herbalSoup',name:'野营药汤',text:'立即恢复所有仍站立队员 18% HP，并补给 +1',heal:.18,supply:1,kind:'heal'},
{id:'ration',name:'压缩口粮',text:'补给 +1',supply:1,kind:'supply'},
{id:'largeRation',name:'丰盛口粮',text:'补给 +2',supply:2,kind:'supply'},
{id:'puritySalt',name:'净邪盐',text:'移除一个 Debuff',kind:'cleanse'},
{id:'purityBell',name:'清心铃',text:'移除最多两个 Debuff',cleanse:2,kind:'cleanse'},
{id:'berserkSeed',name:'狂战种子',text:'下一场战斗：攻击 +32%、防御 -10%',mods:{atk:.32,def:-.10},kind:'boost'},
{id:'turtleCharm',name:'龟甲护符',text:'下一场战斗：防御 +35%、攻击 -8%',mods:{def:.35,atk:-.08},kind:'boost'},
{id:'flashPowder',name:'闪步粉',text:'下一场战斗：速度 +40%、防御 -8%',mods:{spd:.40,def:-.08},kind:'boost'},
{id:'oracleInk',name:'预言墨水',text:'下一场战斗：幸运 +40%、攻击 -5%',mods:{luck:.40,atk:-.05},kind:'boost'},
{id:'balancedMeal',name:'均衡便当',text:'下一场战斗：四项战斗属性 +8%',mods:{atk:.08,def:.08,spd:.08,luck:.08},kind:'boost'},
{id:'championMeal',name:'冠军便当',text:'下一场战斗：攻击/防御 +14%',mods:{atk:.14,def:.14},kind:'boost'},
{id:'scoutLens',name:'斥候镜片',text:'下一场战斗：速度/幸运 +14%',mods:{spd:.14,luck:.14},kind:'boost'},
{id:'bloodBerry',name:'血莓',text:'立即恢复仍站立队员 8% HP；下一战攻击 +8%',heal:.08,mods:{atk:.08},kind:'hybrid'},
{id:'moonWater',name:'月泉水',text:'立即恢复仍站立队员 15% HP；下一战幸运 +8%',heal:.15,mods:{luck:.08},kind:'hybrid'},
{id:'guardPaste',name:'护甲膏',text:'立即恢复仍站立队员 10% HP；下一战防御 +10%',heal:.10,mods:{def:.10},kind:'hybrid'},
{id:'swiftJuice',name:'迅捷果汁',text:'立即恢复仍站立队员 10% HP；下一战速度 +10%',heal:.10,mods:{spd:.10},kind:'hybrid'},
{id:'battleIncense',name:'战意香',text:'下一场战斗：攻击 +20%，幸运 +5%',mods:{atk:.20,luck:.05},kind:'boost'},
{id:'guardianIncense',name:'守护香',text:'下一场战斗：防御 +22%，幸运 +5%',mods:{def:.22,luck:.05},kind:'boost'},
{id:'runnerIncense',name:'疾行香',text:'下一场战斗：速度 +24%，幸运 +5%',mods:{spd:.24,luck:.05},kind:'boost'},
{id:'cloverTea',name:'四叶茶',text:'下一场战斗：幸运 +28%',mods:{luck:.28},kind:'boost'},
{id:'emberCapsule',name:'余烬胶囊',text:'下一场战斗：攻击 +18%、速度 +12%',mods:{atk:.18,spd:.12},kind:'boost'},
{id:'frostCapsule',name:'霜甲胶囊',text:'下一场战斗：防御 +18%、幸运 +12%',mods:{def:.18,luck:.12},kind:'boost'},
{id:'stormCapsule',name:'风暴胶囊',text:'下一场战斗：速度 +18%、攻击 +12%',mods:{spd:.18,atk:.12},kind:'boost'},
{id:'mistCapsule',name:'迷雾胶囊',text:'下一场战斗：幸运 +18%、防御 +12%',mods:{luck:.18,def:.12},kind:'boost'},
{id:'emergencySnack',name:'应急饼干',text:'恢复仍站立队员 6% HP，补给 +1',heal:.06,supply:1,kind:'heal'},
{id:'fieldSoup',name:'远征浓汤',text:'恢复仍站立队员 22% HP，补给 +1',heal:.22,supply:1,kind:'heal'},
{id:'royalSoup',name:'王家浓汤',text:'恢复仍站立队员 32% HP，补给 +2',heal:.32,supply:2,kind:'heal'},
{id:'wardRune',name:'守御符文',text:'下一场战斗：防御 +12%、速度 +12%',mods:{def:.12,spd:.12},kind:'boost'},
{id:'predatorRune',name:'猎食符文',text:'下一场战斗：攻击 +16%、幸运 +8%',mods:{atk:.16,luck:.08},kind:'boost'},
{id:'sageRune',name:'贤者符文',text:'下一场战斗：幸运 +16%、防御 +8%',mods:{luck:.16,def:.08},kind:'boost'},
{id:'cometRune',name:'彗星符文',text:'下一场战斗：速度 +16%、攻击 +8%',mods:{spd:.16,atk:.08},kind:'boost'},
{id:'fullCleanse',name:'圣洁瓶',text:'移除全部 Debuff',cleanse:99,kind:'cleanse'},
{id:'goldenMeal',name:'黄金料理',text:'恢复仍站立队员 20% HP；下一战四项属性 +6%',heal:.20,mods:{atk:.06,def:.06,spd:.06,luck:.06},kind:'hybrid'},
{id:'heroKit',name:'英雄远征包',text:'恢复仍站立队员 30% HP、补给 +1；下一战攻击/防御 +10%',heal:.30,supply:1,mods:{atk:.10,def:.10},kind:'hybrid'}
];

const BASE_BATTLE_SKILLS=[
{name:'新芽治愈',type:'heal',heal:.20,text:'治疗当前HP最低的队友 20%'},
{name:'烈角冲击',type:'attack',power:1.50,text:'造成 150% 技能伤害'},
{name:'潮盾守护',type:'buff',buff:{def:.22},duration:3,text:'全队防御 +22%，持续3次行动'},
{name:'月蚀诅咒',type:'debuff',debuff:{luck:-.25,def:-.08},duration:3,text:'敌方幸运 -25%、防御 -8%'},
{name:'曙光咆哮',type:'buff',buff:{atk:.18},duration:3,text:'全队攻击 +18%，持续3次行动'},
{name:'岩壳壁垒',type:'selfheal',heal:.20,buff:{def:.18},duration:3,text:'自身恢复20%并提高防御'},
{name:'雷羽突袭',type:'attackGauge',power:1.15,gauge:-25,text:'造成115%伤害并削减敌方25%行动条'},
{name:'孢子迷雾',type:'debuff',debuff:{spd:-.20},duration:3,text:'敌方速度 -20%'},
{name:'破甲突刺',type:'attackDebuff',power:1.15,debuff:{def:-.15},duration:3,text:'造成115%伤害并降低敌方防御15%'},
{name:'花棘再生',type:'healall',heal:.10,text:'全队恢复10% HP'},
{name:'双潮回响',type:'healBuff',heal:.08,buff:{def:.12},duration:3,text:'全队恢复8%并提高防御12%'},
{name:'霜闪',type:'attackSelfGauge',power:1.00,gauge:35,text:'造成100%伤害，攻击后保留35%行动条'},
{name:'暗幕侵蚀',type:'debuff',debuff:{atk:-.18},duration:3,text:'敌方攻击 -18%'},
{name:'电浆爆裂',type:'attack',power:1.65,text:'造成165%高额伤害'},
{name:'蝶舞惑光',type:'debuff',debuff:{atk:-.12,luck:-.12},duration:3,text:'敌方攻击/幸运 -12%'},
{name:'云幕庇护',type:'buff',buff:{def:.18},duration:3,text:'全队防御 +18%'},
{name:'星潮祝福',type:'healBuff',heal:.06,buff:{luck:.20},duration:3,text:'全队恢复6%并提高幸运20%'},
{name:'夜幕汲取',type:'drain',power:1.20,heal:.12,text:'造成120%伤害并恢复自身12% HP'}
];
function battleSkillFor(m){
  const sp=R()?.G?.SPECIES?.[m.species]||{};
  if(m.species<BASE_BATTLE_SKILLS.length)return BASE_BATTLE_SKILLS[m.species];
  const p=sp.passive||'';
  if(p==='mission_success')return{name:`${sp.name}·战阵号令`,type:'buff',buff:{atk:.10,def:.10},duration:3,text:'全队攻击/防御 +10%'};
  if(p==='mission_item')return{name:`${sp.name}·寻宝灵光`,type:'healBuff',heal:.05,buff:{luck:.18},duration:3,text:'全队恢复5%并提高幸运18%'};
  if(p==='mission_guard')return{name:`${sp.name}·护返壁垒`,type:'healBuff',heal:.08,buff:{def:.18},duration:3,text:'全队恢复8%并提高防御18%'};
  if(p==='mission_reward')return{name:`${sp.name}·赏金猛击`,type:'attack',power:1.35,text:'造成135%技能伤害'};
  return{name:`${sp.name}·追迹破绽`,type:'attackDebuff',power:1.05,debuff:{def:-.12,spd:-.12},duration:3,text:'造成105%伤害并降低敌方防御/速度12%'};
}
function dodgeChance(defLuck,atkLuck){return Math.max(.03,Math.min(.35,.08+(Number(defLuck||0)-Number(atkLuck||0))/1400))}

const CURSES=[
{id:'weaken',name:'虚弱',text:'攻击 -15%',mods:{atk:-.15}},
{id:'breakArmor',name:'破甲',text:'防御 -15%',mods:{def:-.15}},
{id:'slow',name:'迟缓',text:'速度 -18%',mods:{spd:-.18}},
{id:'badLuck',name:'厄运',text:'幸运 -20%',mods:{luck:-.20}},
{id:'routeErosion',name:'侵蚀',text:'每前进到一个新地点，全队仍站立成员失去最大远征HP的 2%（地图伤害最低保留 1% HP）',mods:{}}
];
const CHALLENGES=[
{title:'断桥残索',text:'桥只剩几根绳索，选一只怪物先过去固定绳索。',stat:3},
{title:'巨石机关',text:'石门卡死，需要力量强的怪物强行推开。',stat:1},
{title:'毒雾湿地',text:'雾气持续侵蚀体力，需要体质最稳的怪物带路。',stat:0},
{title:'落石峡口',text:'连续落石，需要防御高的怪物顶住第一波。',stat:2},
{title:'隐秘岔路',text:'只有直觉和运气足够好的怪物能找到安全路线。',stat:4}
];
const NODE_META={battle:['⚔','普通战斗','自动战斗，胜利后继续'],elite:['☠','精英战','更强敌人，必出遗物三选一'],treasure:['▣','宝箱','获得灵能与随机远征材料'],rest:['♥','营地','恢复队伍并补充补给'],challenge:['?','特殊事件','指定一只怪物进行能力判定'],temple:['◆','神庙','可能得到祝福，也可能遭受诅咒'],boss:['★','区域首领','本局最终自动战斗']};
let selected=[],selectedZone='normal',selectedDifficulty=0,sortMode='recommended',zoneInitialized=false;
function R(){return window.QinsterRuntime||null} function S(){return R()?.getState?.()||null}
function z(id=selectedZone){return ZONES.find(x=>x.id===id)||ZONES[0]}
function today(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function save(msg){const s=S(),r=R();if(!s||!r)return;s.revision=(s.revision||0)+1;r.save?.();r.render?.();if(msg)r.tell?.(msg);render()}
function ensure(){const s=S();if(!s)return null;if(!s.expedition||typeof s.expedition!=='object')s.expedition={};const e=s.expedition;if(e.dayKey!==today()){e.dayKey=today();e.usedByZone={}}if(!e.usedByZone)e.usedByZone={};if(!e.extraAttempts)e.extraAttempts={};if(!e.difficultyUnlocked)e.difficultyUnlocked={normal:0,shiny:0};for(const x of ZONES)e.difficultyUnlocked[x.id]=Math.max(0,Math.min(10,Number(e.difficultyUnlocked[x.id])||0));e.attemptPotions=Math.max(0,Number(e.attemptPotions)||0);e.badges=Math.max(0,Number(e.badges)||0);if(!e.loot)e.loot={relicDust:0,starCrystal:0,eggFragment:0};if(!selected.length)selected=(e.lastTeamIds||[]).slice(0,3);if(!zoneInitialized){selectedZone=ZONES.some(x=>x.id===e.lastZone)?e.lastZone:'normal';selectedDifficulty=Math.min(Number(e.lastDifficulty)||0,e.difficultyUnlocked[selectedZone]||0);zoneInitialized=true}return e}
const EGG_FRAGMENT_RECIPES=[
{id:'basic',cost:10,name:'基础远征蛋',text:'随机 1★–2★',stars:[1,1,1,2]},
{id:'fine',cost:30,name:'精制远征蛋',text:'随机 2★–3★',stars:[2,2,2,3]},
{id:'rare',cost:80,name:'稀有远征蛋',text:'随机 3★–4★',stars:[3,3,4]},
{id:'elite',cost:200,name:'精英远征蛋',text:'随机 4★–5★',stars:[4,4,5]},
{id:'expedition',cost:500,name:'远征秘藏蛋',text:'3★–5★ · 高概率远征限定种族 · 小概率闪光/特殊色',stars:[3,4,4,5,5]}
];
function eggUnitsLocal(egg){return egg?(1+(egg.twinChild?1:0)):0}
function totalEggsLocal(state){return eggUnitsLocal(state.egg)+eggUnitsLocal(state.egg2)+(state.eggQueue||[]).reduce((n,e)=>n+eggUnitsLocal(e),0)}
function expeditionEggSpecies(recipe){const all=R()?.G?.SPECIES||[];if(!all.length)return 0;if(recipe.id==='expedition'&&all.length>18){const pool=all.map((_,i)=>i).filter(i=>i>=18);return rand(pool)}return Math.floor(Math.random()*all.length)}
function fragmentStatFloor(star){return ({1:50,2:100,3:200,4:300,5:400})[star]||1}
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
function eggWorkshopHTML(e){const f=Math.max(0,Number(e.loot?.eggFragment)||0);return `<section class="rg-panel"><div class="rg-title"><div><b>蛋碎片工坊</b><small>消耗永久蛋碎片直接制作怪物蛋；蛋会进入现有孵化巢/等候队列</small></div><span class="rg-materials">当前蛋碎片 ${f}</span></div><div class="rg-final" style="margin-top:8px">${EGG_FRAGMENT_RECIPES.map(x=>`<button class="secondary rg-relic" data-rg-craft-egg="${x.id}" ${f>=x.cost&&totalEggsLocal(S())<11?'':'disabled'}><b>${x.name} · ${x.cost}碎片</b><span>${x.text}</span></button>`).join('')}</div><p class="rg-note"><b>碎片蛋五维保底：</b>1★ 50–100 · 2★ 100–200 · 3★ 200–300 · 4★ 300–400 · 5★ 400–500。五项能力分别保底。<br><b>远征秘藏蛋：</b>在上述保底上，至少 2 项进入本星级最高20%（3★≥260 / 4★≥360 / 5★≥460），并使用远征限定种族池；另有 2% 闪光、8% 特殊色概率。制作出来的蛋仍需正常孵化。</p></section>`}
function monsterName(m){return R()?.name?.(m)||R()?.G?.SPECIES?.[m.species]?.name||('怪物 #'+m.id)}
function st(m){return R()?.G?.stats?.(m)||[0,0,0,0,0]} function stars(m){return R()?.G?.stars?.(m.star)||'★'.repeat(m.star||1)}
function eligible(zone){const s=S(),r=R();if(!s||!r)return[];return (s.monsters||[]).filter(m=>m&&m.life>0&&!r.isDispatched(m.id)&&(m.star||1)>=zone.minStar&&(!zone.shinyOnly||m.shiny))}
function recommendScore(m){const v=st(m),total=v.reduce((a,b)=>a+b,0),min=Math.min(...v),top=[...v].sort((a,b)=>b-a).slice(0,2).reduce((a,b)=>a+b,0);return total+min*1.4+top*.2+(m.star||1)*35+(m.shiny?15:0)}
function sorted(zone){const a=[...eligible(zone)];a.sort((x,y)=>{if(sortMode==='newest')return (y.createdAt||y.id||0)-(x.createdAt||x.id||0);if(sortMode==='oldest')return (x.createdAt||x.id||0)-(y.createdAt||y.id||0);if(sortMode==='total')return st(y).reduce((a,b)=>a+b,0)-st(x).reduce((a,b)=>a+b,0);if(sortMode==='star')return (y.star||1)-(x.star||1)||recommendScore(y)-recommendScore(x);if(sortMode==='luck')return st(y)[4]-st(x)[4]||recommendScore(y)-recommendScore(x);return recommendScore(y)-recommendScore(x)});return a}
function teamFromIds(ids){const map=new Map((S()?.monsters||[]).map(m=>[m.id,m]));return ids.map(id=>map.get(id)).filter(Boolean)}
function team(){return teamFromIds(selected)}
function attemptKey(zone,d=selectedDifficulty){return `${zone.id}:d${Math.max(0,Number(d)||0)}`}
function used(e,zone,d=selectedDifficulty){return Math.max(0,Number(e.usedByZone?.[attemptKey(zone,d)])||0)}
function bonusAttempts(e,zone,d=selectedDifficulty){return Math.max(0,Number(e.extraAttempts?.[attemptKey(zone,d)])||0)}
function freeRemain(e,zone,d=selectedDifficulty){return Math.max(0,zone.attempts-used(e,zone,d))}
function totalRemain(e,zone,d=selectedDifficulty){return freeRemain(e,zone,d)+bonusAttempts(e,zone,d)}
function buyAttemptPotion(){const s=S(),e=ensure();if(!s||!e)return;const price=100000;if((Number(s.energy)||0)<price)return R()?.tell?.('灵能不足，需要 100,000。');s.energy-=price;e.attemptPotions=(e.attemptPotions||0)+1;save('购买远征次数回复药水 ×1。')}
function useAttemptPotion(){const e=ensure(),zone=z(),k=attemptKey(zone);if(!e)return;if((e.attemptPotions||0)<=0)return R()?.tell?.('没有远征次数回复药水。');e.attemptPotions--;e.extraAttempts[k]=bonusAttempts(e,zone)+1;save(`${zone.label} · ${diff().label} 可用远征次数 +1。`) }
function rand(a){return a[Math.floor(Math.random()*a.length)]} function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function relicMods(run){const out={};for(const id of run.relics||[]){const x=RELICS.find(r=>r.id===id);for(const [k,v] of Object.entries(x?.mods||{}))out[k]=(out[k]||0)+v}return out}
function ensureRunMeta(run){if(!run.items)run.items={};if(!run.curses)run.curses=[];if(!run.nextBattleMods)run.nextBattleMods={};if(!run.templeMods)run.templeMods={};return run}
function combatMods(run){ensureRunMeta(run);const out=relicMods(run);for(const [k,v] of Object.entries(run.templeMods||{}))out[k]=(out[k]||0)+v;for(const [k,v] of Object.entries(run.nextBattleMods||{}))out[k]=(out[k]||0)+v;for(const id of run.curses||[]){const c=CURSES.find(x=>x.id===id);for(const [k,v] of Object.entries(c?.mods||{}))out[k]=(out[k]||0)+v}return out}
function grantRunItem(run,id){ensureRunMeta(run);run.items[id]=(run.items[id]||0)+1;return RUN_ITEMS.find(x=>x.id===id)}
function inflictCurse(run,id,logs=[]){ensureRunMeta(run);if(run.curses.includes(id))return null;run.curses.push(id);const c=CURSES.find(x=>x.id===id);if(c)logs.push(`遭受 Debuff：${c.name}（${c.text}）。`);return c}
function useRunItem(id){const run=ensure()?.rogueActive;if(!run)return;ensureRunMeta(run);if((run.items[id]||0)<=0)return R()?.tell?.('这个道具已经没有了。');if(run.phase==='battleResult')return R()?.tell?.('战斗结算中不能使用道具。');const it=RUN_ITEMS.find(x=>x.id===id);if(!it)return;let used=false;if(it.heal){for(const mid of run.teamIds){if(hpPct(run,mid)>0&&canReviveInRun(run,mid))run.hp[mid]=Math.min(100,hpPct(run,mid)+it.heal*100)}run.log.push(`使用 ${it.name}：仍站立队员恢复 ${Math.round(it.heal*100)}% HP（倒下队员不会复活）。`);used=true}if(it.supply){run.supply=Math.min(9,run.supply+it.supply);run.log.push(`补给 +${it.supply}。`);used=true}if(it.kind==='cleanse'){const count=Math.min(run.curses.length,Number(it.cleanse)||1);if(count<=0)return R()?.tell?.('当前没有 Debuff。');const gone=run.curses.splice(0,count).map(cid=>CURSES.find(x=>x.id===cid)?.name||cid);run.log.push(`使用 ${it.name}：移除 ${gone.join('、')}。`);used=true}if(it.mods){for(const [k,v] of Object.entries(it.mods))run.nextBattleMods[k]=(run.nextBattleMods[k]||0)+v;run.log.push(`使用 ${it.name}：下一场战斗增益已准备。`);used=true}if(!used)return;run.items[id]--;save()}
function runInventoryHTML(run){ensureRunMeta(run);const items=RUN_ITEMS.filter(x=>(run.items[x.id]||0)>0);const curses=(run.curses||[]).map(id=>CURSES.find(x=>x.id===id)).filter(Boolean);const buffs=Object.entries(run.nextBattleMods||{}).filter(([,v])=>v).map(([k,v])=>`${({atk:'攻击',def:'防御',spd:'速度',luck:'幸运'})[k]||k} ${v>0?'+':''}${Math.round(v*100)}%`);return `<section class="rg-panel"><div class="rg-title"><div><b>本局道具 / 状态</b><small>消耗品只在本次远征使用；战斗增益在下一场战斗后消失</small></div></div><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:7px">${items.length?items.map(it=>`<button class="secondary" data-rg-item="${it.id}"><b>${it.name} ×${run.items[it.id]}</b><small>${it.text}</small></button>`).join(''):'<span class="rg-note">暂无可用道具</span>'}</div>${buffs.length?`<p class="rg-note"><b>下一战增益：</b>${buffs.join(' · ')}</p>`:''}${curses.length?`<p class="rg-danger"><b>Debuff：</b>${curses.map(c=>`${c.name}（${c.text}）`).join(' · ')}</p>`:'<p class="rg-note">Debuff：无</p>'}</section>`}
function weightedUtilityNode(exclude=[]){
  const pool=[
    ['challenge',24],['treasure',20],['elite',18],['rest',7],['temple',5]
  ].filter(([type])=>!exclude.includes(type));
  const total=pool.reduce((a,[,w])=>a+w,0),roll=Math.random()*total;
  let acc=0;for(const [type,w] of pool){acc+=w;if(roll<=acc)return type}return pool[0]?.[0]||'challenge';
}
function makeOptions(stage){
  if([8,17,26].includes(stage))return[{type:'boss'}];
  const local=stage%9,n=local>=5?3:2;
  const out=['battle'];
  // Late in each chapter, make elite combat a common additional route.
  if(local>=6&&n>=3)out.push('elite');
  while(out.length<n){
    const t=weightedUtilityNode(out);
    if(t&&!out.includes(t))out.push(t);
  }
  return shuffle(out).map(type=>({type,id:Math.random().toString(36).slice(2,8)}));
}
function injectStyle(){if(document.getElementById('qinster-v199-style'))return;const x=document.createElement('style');x.id='qinster-v199-style';x.textContent=`#expedition-page{max-width:1220px;margin:0 auto}.rogue{display:grid;gap:10px}.rg-panel{background:#c9c8cd;border:3px solid #57535e;box-shadow:inset 0 0 0 2px #aaa7af;padding:11px}.rg-title{display:flex;justify-content:space-between;align-items:center;gap:9px}.rg-title small{display:block;font-size:9px;margin-top:3px;color:#625e68}.rg-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}.rg-tabs button{text-align:left;min-height:58px}.rg-tabs .on{background:#df3d36;color:#fff}.rg-grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.rg-select select{width:100%}.rg-card{background:#dedde0;border:2px solid #85818b;padding:9px}.rg-card b,.rg-card small{display:block}.rg-card small{font-size:9px;margin-top:4px}.rg-route{display:grid;grid-template-columns:repeat(9,1fr);gap:5px;align-items:center}.rg-route span{height:28px;display:grid;place-items:center;background:#aaa8ae;border:2px solid #77727f;font-size:9px}.rg-route .done{background:#91b487}.rg-route .now{background:#f2c451}.rg-status{display:flex;gap:7px;flex-wrap:wrap}.rg-status span{background:#302d36;color:#fff1b5;border:2px solid #716d77;padding:6px 8px;font-size:9px}.rg-nodes{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.rg-node{min-height:116px;text-align:left;padding:12px;border:3px solid #6b6671;background:#d9d8dc}.rg-node strong{font-size:22px;display:block}.rg-node b{display:block;margin:5px 0}.rg-node small{font-size:9px}.rg-team{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.rg-mon{background:#d9d8dc;border:2px solid #85818b;padding:8px;text-align:center}.rg-mon .sprite{width:58px!important;margin:auto}.rg-hp{height:10px;background:#77727f;border:1px solid #514d57;margin-top:5px}.rg-hp i{display:block;height:100%;background:#6da65d}.rg-formation{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.rg-pos{padding:5px;text-align:center;font-size:9px;background:#eee;border:1px solid #8a8690}.rg-battle{display:grid;grid-template-columns:1fr 110px 1fr;gap:12px;align-items:center}.rg-vs{text-align:center;font-size:28px;font-weight:900}.rg-enemy{text-align:center;background:#3b3743;color:#fff;padding:12px;border:3px solid #1e1c23}.rg-log{max-height:150px;overflow:auto;background:#302d36;color:#eee;padding:8px;font-size:9px;line-height:1.6}.rg-relics,.rg-final{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.rg-relic{min-height:94px;text-align:left}.rg-relic b{display:block;color:#8d2d28;margin-bottom:4px}.rg-event-picks{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.rg-mainbtn{width:100%;padding:12px}.rg-materials{font-size:9px}.rg-note{font-size:10px;line-height:1.6;color:#4f4b55}.rg-danger{color:#9a2b25;font-weight:900}@media(max-width:760px){.rg-tabs,.rg-grid3,.rg-nodes,.rg-team,.rg-relics,.rg-final,.rg-event-picks{grid-template-columns:1fr}.rg-battle{grid-template-columns:1fr}.rg-vs{font-size:16px}.rg-route{grid-template-columns:repeat(9,28px);overflow-x:auto}.rg-title{display:grid}}`;document.head.appendChild(x)}
function hpPct(run,id){return Math.max(0,Math.min(100,Number(run.hp?.[id])||0))}
function monCard(m,run,i){const hp=hpPct(run,m.id),pos=['前卫','中卫','后卫'][i],bs=battleSkillFor(m);return `<div class="rg-mon">${R()?.sprite?.(m.species,m.tint,m.shiny,m.specialColor)||''}<b>${monsterName(m)} ${stars(m)}${m.shiny?' ✦':''}</b><small>${pos} · ${STAT.map((x,j)=>x+st(m)[j]).join(' · ')}</small><small style="color:#6d2a73">战斗技能：${bs.name} · ${bs.text}</small><div class="rg-hp"><i style="width:${hp}%"></i></div><small>远征生命 ${Math.round(hp)}% · 牧场生命 ${Math.max(0,Number(m.life)||0)}${run.knockouts?.[m.id]?' · 本局倒下 '+run.knockouts[m.id]+'次':''}${run.permaDead?.[m.id]?' · 已死亡':''}</small></div>`}
function routeBar(run){let h='';for(let i=0;i<27;i++){const boss=[8,17,26].includes(i),chapter=Math.floor(i/9)+1,label=boss?`B${chapter}`:(i+1);h+=`<span class="${i<run.stage?'done':i===run.stage?'now':''}">${label}</span>`}return `<div class="rg-route">${h}</div>`}
function activeTeam(run){return teamFromIds(run.teamIds)}
function startRun(){const e=ensure(),zone=z(),t=team(),d=diff();if(!e)return;if(selectedDifficulty>(e.difficultyUnlocked?.[zone.id]||0))return R()?.tell?.('这个难度还没有解锁。');if(t.length!==3)return R()?.tell?.('需要选择 3 只怪物。');if(new Set(t.map(m=>m.id)).size!==3)return R()?.tell?.('不能重复选择同一只怪物。');if(zone.shinyOnly&&t.some(m=>!m.shiny))return R()?.tell?.('闪光远征只允许闪光怪物参加。');if(totalRemain(e,zone)<=0)return R()?.tell?.('这个地图与难度今天的免费次数已用完；可使用远征次数回复药水继续。');const k=attemptKey(zone);if(freeRemain(e,zone)>0)e.usedByZone[k]=used(e,zone)+1;else e.extraAttempts[k]=Math.max(0,bonusAttempts(e,zone)-1);e.lastZone=zone.id;e.lastDifficulty=selectedDifficulty;e.lastTeamIds=t.map(m=>m.id);const hp={};t.forEach(m=>hp[m.id]=100);e.rogueActive={zone:zone.id,difficulty:selectedDifficulty,teamIds:t.map(m=>m.id),stage:0,maxStage:27,hp,supply:5,relics:[],energy:0,tempBadges:0,materials:{relicDust:0,starCrystal:0,eggFragment:0},options:makeOptions(0),phase:'map',log:[`${zone.label} · ${d.label} 开始。目标：击败第9/18/27层三名大BOSS。`],startedAt:Date.now(),formation:0,items:{},curses:[],nextBattleMods:{},bossCount:0};save(`${zone.label} · ${d.label} 开始：共27层，每9层一个大BOSS。`)}
function rotateFormation(run){run.teamIds.push(run.teamIds.shift());save('已调整阵型。')}
function nodeRewardScale(zone,stage){const run=ensure()?.rogueActive,d=diff(run?.difficulty??selectedDifficulty),chapter=Math.floor((Number(stage)||0)/9),local=(Number(stage)||0)%9;return zone.reward*d.reward*(1+chapter*.18+local*.04)}
function persistentMonster(id){return (S()?.monsters||[]).find(m=>m.id===id)||null}
function expeditionKnockout(run,m,logs=[]){if(!m)return;run.knockouts=run.knockouts||{};run.lifeLoss=run.lifeLoss||{};run.knockouts[m.id]=(run.knockouts[m.id]||0)+1;m.life=Math.max(0,(Number(m.life)||0)-1);run.lifeLoss[m.id]=(run.lifeLoss[m.id]||0)+1;logs.push(`${monsterName(m)} 远征生命归0：牧场生命 -1（剩 ${m.life}）。`);if(m.life<=0){run.permaDead=run.permaDead||{};run.permaDead[m.id]=true;run.hp[m.id]=0;logs.push(`${monsterName(m)} 的牧场生命已归0，怪物死亡，本次远征不能再复活。`)}}
function canReviveInRun(run,id){const m=persistentMonster(id);return !!m&&Number(m.life)>0&&!run.permaDead?.[id]}
function applyRest(run){const mods=relicMods(run),heal=30+(mods.rest||0)*100;run.campHeal=Math.round(heal);run.campRevived=false;for(const id of run.teamIds){if(hpPct(run,id)>0&&canReviveInRun(run,id))run.hp[id]=Math.min(100,hpPct(run,id)+heal);else if(!canReviveInRun(run,id))run.hp[id]=0}run.supply=Math.min(7,run.supply+1+(mods.rest?1:0));run.log.push(`营地：仍站立队员恢复 ${Math.round(heal)}%，补给恢复。倒下队员可在这里选择复活。`);run.phase='camp';save()}
function campRevive(run,id){if(run.phase!=='camp'||run.campRevived)return;const m=persistentMonster(id);if(!m||hpPct(run,id)>0||!canReviveInRun(run,id))return;run.hp[id]=30;run.campRevived=true;run.log.push(`营地复活：${monsterName(m)} 恢复至 30% 远征HP。`);save(`${monsterName(m)} 已在营地复活。`)}
function leaveCamp(run){run.campHeal=0;run.campRevived=false;advance(run)}
function treasure(run){const zone=z(run.zone),mods=relicMods(run),base=Math.round((850+run.stage*260)*nodeRewardScale(zone,run.stage)*(1+(mods.chest||0)));run.energy+=base;const r=Math.random();if(r<.38)run.materials.relicDust++;else if(r<.68)run.materials.eggFragment++;else if(r<.88)run.materials.starCrystal++;else run.tempBadges++;const got=r<.38?'遗物尘':r<.68?'蛋碎片':r<.88?'星辉结晶':'远征徽章';run.log.push(`宝箱：+${base} 灵能，并获得 ${got} ×1。`);if(Math.random()<.55){const it=grantRunItem(run,rand(RUN_ITEMS).id);run.log.push(`发现远征道具：${it.name} ×1。`)}if(Math.random()<.45)offerRelic(run);else advance(run)}

function temple(run){ensureRunMeta(run);const good=Math.random()<.55;if(good){const pool=[{name:'战神祝福',mods:{atk:.10}},{name:'石卫祝福',mods:{def:.10}},{name:'风灵祝福',mods:{spd:.10}},{name:'星运祝福',mods:{luck:.12}},{name:'四象祝福',mods:{atk:.05,def:.05,spd:.05,luck:.05}}],x=rand(pool);for(const [k,v] of Object.entries(x.mods))run.templeMods[k]=(run.templeMods[k]||0)+v;run.templeResult={good:true,title:x.name,text:'本次远征永久生效：'+Object.entries(x.mods).map(([k,v])=>`${({atk:'攻击',def:'防御',spd:'速度',luck:'幸运'})[k]} +${Math.round(v*100)}%`).join('、')};run.log.push(`神庙祝福：${x.name}。${run.templeResult.text}`)}else{const pool=CURSES.filter(c=>!run.curses.includes(c.id));const c=pool.length?rand(pool):rand(CURSES);if(!run.curses.includes(c.id))run.curses.push(c.id);run.templeResult={good:false,title:'神庙诅咒：'+c.name,text:c.text};run.log.push(`神庙诅咒：${c.name}（${c.text}）。`)}run.phase='templeResult';save()}
function challenge(run){const c=rand(CHALLENGES);run.challenge={...c};run.phase='challenge';save()}
function resolveChallenge(run,memberIndex){const t=activeTeam(run),m=t[memberIndex],c=run.challenge;if(!m||!c)return;const zone=z(run.zone),mods=relicMods(run),v=st(m)[c.stat],bonus=c.stat===4?(mods.luck||0)*v:c.stat===3?(mods.spd||0)*v:c.stat===2?(mods.def||0)*v:c.stat===1?(mods.atk||0)*v:0,target=70+zone.tier*58+run.stage*12,p=Math.max(.18,Math.min(.92,.52+(v+bonus-target)/Math.max(100,target)*.62));const success=Math.random()<p;let lines=[],after='advance';if(success){const gain=Math.round((700+run.stage*210)*nodeRewardScale(zone,run.stage));run.energy+=gain;lines.push(`事件成功：${monsterName(m)} 用${STAT[c.stat]}通过判定，+${gain} 灵能。`);if(Math.random()<.30){const it=grantRunItem(run,rand(RUN_ITEMS).id);lines.push(`额外发现：${it.name} ×1。`)}if(Math.random()<.35)after='relic'}else{run.supply=Math.max(0,run.supply-1);run.hp[m.id]=Math.max(1,hpPct(run,m.id)-18);lines.push(`事件失败：${monsterName(m)} 受伤 18%，补给 -1。`);if(Math.random()<.55){const pool=CURSES.filter(x=>!run.curses?.includes(x.id));if(pool.length){const before=run.log.length;inflictCurse(run,rand(pool).id,lines)}}}run.log.push(...lines);run.challengeResult={success,memberId:m.id,memberName:monsterName(m),stat:STAT[c.stat],value:Math.round(v+bonus),baseValue:v,target,chance:Math.round(p*100),title:c.title,lines,after};run.phase='challengeResult';save(success?'特殊事件成功！':'特殊事件失败。')}
function combatValue(m,pos,run){const v=st(m),mods=combatMods(run),sh=m.shiny?(mods.shiny||0):0;let atk=v[1]*(1+(mods.atk||0)+sh),def=v[2]*(1+(mods.def||0)+sh),spd=v[3]*(1+(mods.spd||0)),luck=v[4]*(1+(mods.luck||0)+sh),con=v[0];if(pos===0){def*=1+(mods.frontDef||0);atk*=1+(mods.frontAtk||0)}if(pos===2){atk*=1+(mods.backAtk||0);def*=1+(mods.backDef||0)}return{atk,def,spd,luck,con}}
function finalStatBreakdown(m,pos,run){
  const base=st(m),final=combatValue(m,pos,run),mods=combatMods(run);
  const labels=['体质','攻击','防御','速度','幸运'];
  const keys=['con','atk','def','spd','luck'];
  const vals=[final.con,final.atk,final.def,final.spd,final.luck];
  const signedPct=v=>(v>0?'+':'')+(Math.round(v*1000)/10)+'%';
  const relicContribution=k=>{
    let v=0,names=[];
    for(const id of run.relics||[]){const r=RELICS.find(x=>x.id===id),x=Number(r?.mods?.[k]||0);if(x){v+=x;names.push(r.name)}}
    return {v,names};
  };
  const curseContribution=k=>{
    let v=0,names=[];
    for(const id of run.curses||[]){const c=CURSES.find(x=>x.id===id),x=Number(c?.mods?.[k]||0);if(x){v+=x;names.push(c.name)}}
    return {v,names};
  };
  return labels.map((label,i)=>{
    const b=Number(base[i])||0,f=Math.round((Number(vals[i])||0)*10)/10,delta=f-b;
    let cls='same';if(delta>.05)cls='up';else if(delta<-.05)cls='down';
    const detail=['原始：'+Math.round(b*10)/10];
    if(i>0){
      const k=keys[i],rel=relicContribution(k),tem=Number(run.templeMods?.[k]||0),tmp=Number(run.nextBattleMods?.[k]||0),cur=curseContribution(k);
      if(rel.v)detail.push('遗物'+(rel.names.length?'（'+rel.names.join('、')+'）':'')+'：'+signedPct(rel.v));
      if(tem)detail.push('神庙祝福：'+signedPct(tem));
      if(tmp)detail.push('临时增益：'+signedPct(tmp));
      if(cur.v)detail.push('Debuff'+(cur.names.length?'（'+cur.names.join('、')+'）':'')+'：'+signedPct(cur.v));
      if(m.shiny&&(k==='atk'||k==='luck')&&(mods.shiny||0))detail.push('闪光加成：'+signedPct(Number(mods.shiny)||0));
      if(pos===0){const v=k==='def'?(mods.frontDef||0):k==='atk'?(mods.frontAtk||0):0;if(v)detail.push('前卫站位：'+signedPct(v));}
      if(pos===2){const v=k==='atk'?(mods.backAtk||0):k==='def'?(mods.backDef||0):0;if(v)detail.push('后卫站位：'+signedPct(v));}
      const net=b?((f/b)-1):0;if(Math.abs(net)>.0001)detail.push('最终净变化：'+signedPct(net));
    }
    detail.push('最终：'+f);
    return {label,base:b,final:f,delta,cls,detail};
  });
}
function finalStatsHTML(m,pos,run){
  return '<div class="rg-final-stats">'+finalStatBreakdown(m,pos,run).map((x,i)=>'<button type="button" class="rg-final-stat '+x.cls+'" data-rg-stat-toggle><span>'+x.label+'</span><b>'+x.final+'</b><small>原始 '+Math.round(x.base*10)/10+'</small><em>'+x.detail.map((t,j)=>'<i class="'+(j===x.detail.length-1?'total':(t.includes('：-')||t.includes('Debuff'))?'neg':t.includes('：+')?'pos':'')+'">'+t+'</i>').join('')+'</em></button>').join('')+'</div>';
}
function decorateFinalStats(run){
  if(!run)return;
  if(!document.getElementById('rg-final-stat-style')){
    const stl=document.createElement('style');stl.id='rg-final-stat-style';stl.textContent=`.rg-final-stats{display:grid;grid-template-columns:repeat(5,minmax(52px,1fr));gap:4px;margin-top:7px}.rg-final-stat{position:relative;background:#242832;border:1px solid #555d6c;color:#e9edf3;padding:5px 3px;text-align:center;box-shadow:none!important;transform:none!important}.rg-final-stat span{display:block;font-size:9px;opacity:.72}.rg-final-stat b{display:block;font-size:15px;line-height:1.15}.rg-final-stat small{display:block;font-size:8px;opacity:.62}.rg-final-stat.up b{color:#64d887}.rg-final-stat.down b{color:#ff7070}.rg-final-stat em{display:none;position:absolute;z-index:80;left:50%;top:calc(100% + 5px);transform:translateX(-50%);width:210px;background:#171a21;border:2px solid #626b7c;padding:7px;text-align:left;font-style:normal;box-shadow:3px 3px 0 #000}.rg-final-stat:hover em,.rg-final-stat.open em{display:grid;gap:3px}.rg-final-stat em i{font-style:normal;font-size:10px;color:#ddd}.rg-final-stat em i.pos{color:#64d887}.rg-final-stat em i.neg{color:#ff7070}.rg-final-stat em i.total{margin-top:3px;padding-top:4px;border-top:1px solid #596171;color:#fff;font-weight:700}@media(max-width:700px){.rg-final-stats{grid-template-columns:repeat(5,minmax(46px,1fr))}.rg-final-stat em{position:fixed;left:12px;right:12px;top:auto;bottom:14px;transform:none;width:auto;z-index:9999}}`;
    document.head.appendChild(stl);
  }
  const cards=[...document.querySelectorAll('#expedition-content .rg-team .rg-mon')];
  const teamNow=activeTeam(run);
  if(cards.length===teamNow.length){
    cards.forEach((card,visualIndex)=>{
      if(card.querySelector('.rg-final-stats'))return;
      const pos=teamNow.length-1-visualIndex,m=teamNow[pos];if(m)card.insertAdjacentHTML('beforeend',finalStatsHTML(m,pos,run));
    });
  }
}
function enemyPreview(run,kind){const zone=z(run.zone),d=diff(run.difficulty),elite=kind==='elite',boss=kind==='boss',stage=Math.max(0,Number(run.stage)||0),stageScale=1+stage*.035,kindScale=boss?1.42:elite?1.20:1,base=zone.enemy*stageScale*kindScale,range=boss?[.99,1.05]:elite?[.97,1.04]:[.96,1.04],variance=range[0]+Math.random()*(range[1]-range[0]),mods=d.mods||{},speciesCount=Math.max(1,R()?.G?.SPECIES?.length||1),enemySpecies=Math.floor(Math.random()*speciesCount),affixPool=[{name:'狂暴',mods:{atk:.20}},{name:'铁壁',mods:{def:.25}},{name:'迅捷',mods:{spd:.20}},{name:'强运',mods:{luck:.25}},{name:'巨躯',mods:{hp:.25}},{name:'精准',mods:{atk:.08,luck:.15}}],affixCount=d.id>=10?3:d.id>=7?2:d.id>=4?1:0,affixes=shuffle(affixPool).slice(0,affixCount),am={};for(const a of affixes)for(const [k,v] of Object.entries(a.mods))am[k]=(am[k]||0)+v;const mult=base*variance,hpMul=1+(mods.hp||0)+(am.hp||0),atkMul=1+(mods.atk||0)+(am.atk||0),defMul=1+(mods.def||0)+(am.def||0),spdMul=1+(mods.spd||0)+(am.spd||0),luckMul=1+(mods.luck||0)+(am.luck||0);return{kind,enemySpecies,enemyShiny:zone.shinyOnly,enemyMax:Math.round((900*mult+180)*hpMul),enemyAtk:Math.round((95*mult+20)*atkMul),enemyDef:Math.round((82*mult+18)*defMul),enemySpd:Math.round((76*mult+16)*spdMul),enemyLuck:Math.round((62*mult+14)*luckMul),affixes:affixes.map(x=>x.name),variance:Math.round(variance*100)}}
function prepareBattle(run,kind){run.pendingBattle=enemyPreview(run,kind);run.phase='battlePreview';save()}
function atbRate(spd){return Math.max(20,60+Math.max(0,Number(spd)||0)*.45)}
function speedRuleText(){return '速度决定行动条充能速度；所有参战单位会同时充能，行动条达到 100% 就立刻行动，攻击后清零重新累积。'}
function battle(run,kind){
  ensureRunMeta(run);
  const zone=z(run.zone),t=activeTeam(run),elite=kind==='elite',boss=kind==='boss',ep=run.pendingBattle&&run.pendingBattle.kind===kind?run.pendingBattle:enemyPreview(run,kind),enemyMax=ep.enemyMax,enemyAtk=ep.enemyAtk,enemyDef=ep.enemyDef,enemySpd=ep.enemySpd,enemyLuck=ep.enemyLuck;
  run.pendingBattle=null;
  const startHp={};t.forEach(m=>startHp[m.id]=hpPct(run,m.id));
  let enemy=enemyMax,firstGuard=true,actions=0,elapsed=0;
  const logs=[],events=[],gauge={enemy:0},personalActions={},allyBuff={atk:0,def:0,spd:0,luck:0,ttl:0},enemyDebuff={atk:0,def:0,spd:0,luck:0,ttl:0};t.forEach(m=>gauge[m.id]=0);
  if((elite||boss)&&Math.random()<(boss?.70:.38)){const pool=CURSES.filter(c=>!run.curses.includes(c.id));if(pool.length)inflictCurse(run,rand(pool).id,logs)}
  const cv=(m,pos)=>{const p=combatValue(m,pos,run);return{...p,atk:p.atk*(1+allyBuff.atk),def:p.def*(1+allyBuff.def),spd:p.spd*(1+allyBuff.spd),luck:p.luck*(1+allyBuff.luck)}};
  const enemyNow=()=>({atk:enemyAtk*(1+enemyDebuff.atk),def:enemyDef*(1+enemyDebuff.def),spd:enemySpd*(1+enemyDebuff.spd),luck:enemyLuck*(1+enemyDebuff.luck)});
  const initialTeamPower=t.filter(m=>canReviveInRun(run,m.id)&&hpPct(run,m.id)>0).reduce((sum,m,i)=>{const p=cv(m,i);return sum+p.atk*1.1+p.def+p.spd*.65+p.luck*.35+p.con*.7},0),enemyPower=Math.round(enemyMax*.7+enemyAtk*2+enemyDef*1.3+enemySpd*.5+enemyLuck*.25);
  const gaugeSnapshot=()=>({enemy:Math.max(0,Math.min(100,gauge.enemy||0)),allies:Object.fromEntries(t.map(m=>[m.id,Math.max(0,Math.min(100,gauge[m.id]||0))]))});
  const tickStatus=()=>{if(allyBuff.ttl>0&&--allyBuff.ttl<=0)Object.assign(allyBuff,{atk:0,def:0,spd:0,luck:0,ttl:0});if(enemyDebuff.ttl>0&&--enemyDebuff.ttl<=0)Object.assign(enemyDebuff,{atk:0,def:0,spd:0,luck:0,ttl:0})};
  const applyBuff=(dst,obj,ttl)=>{for(const [k,v] of Object.entries(obj||{}))dst[k]=(dst[k]||0)+v;dst.ttl=Math.max(dst.ttl||0,ttl||3)};
  const lowestLiving=()=>t.filter(x=>hpPct(run,x.id)>0&&canReviveInRun(run,x.id)).sort((a,b)=>hpPct(run,a.id)-hpPct(run,b.id))[0];
  while(enemy>0&&actions<60&&t.some(m=>hpPct(run,m.id)>0&&canReviveInRun(run,m.id))){
    const alive=t.filter(m=>hpPct(run,m.id)>0&&canReviveInRun(run,m.id));
    const actors=[];alive.forEach((m,dynPos)=>{const p=cv(m,dynPos);actors.push({type:'ally',key:m.id,m,dynPos,p,spd:p.spd,rate:atbRate(p.spd)});});
    const en=enemyNow();if(enemy>0)actors.push({type:'enemy',key:'enemy',spd:en.spd,rate:atbRate(en.spd),p:en});if(!actors.length)break;
    let dt=Infinity;for(const a of actors){const g=a.type==='enemy'?(gauge.enemy||0):(gauge[a.key]||0);dt=Math.min(dt,(100-g)/Math.max(1,a.rate));}if(!Number.isFinite(dt)||dt<0)dt=0;elapsed+=dt;
    for(const a of actors){if(a.type==='enemy')gauge.enemy=Math.min(100,(gauge.enemy||0)+a.rate*dt);else gauge[a.key]=Math.min(100,(gauge[a.key]||0)+a.rate*dt)}
    const ready=actors.filter(a=>(a.type==='enemy'?gauge.enemy:gauge[a.key])>=99.999).sort((a,b)=>b.spd-a.spd)[0];if(!ready)break;actions++;const snap=gaugeSnapshot();
    if(ready.type==='ally'){
      const m=ready.m;if(hpPct(run,m.id)<=0||!canReviveInRun(run,m.id)){gauge[m.id]=0;continue}personalActions[m.id]=(personalActions[m.id]||0)+1;const p=ready.p,en2=enemyNow(),skillTurn=personalActions[m.id]%3===0,skill=skillTurn?battleSkillFor(m):null;
      let power=1,skillName='',specialText='';if(skill){skillName=skill.name;if(skill.buff){applyBuff(allyBuff,skill.buff,skill.duration);specialText+=`；${skill.text}`}if(skill.debuff){applyBuff(enemyDebuff,skill.debuff,skill.duration);specialText+=`；${skill.text}`}if(skill.type==='heal'){const x=lowestLiving();if(x){run.hp[x.id]=Math.min(100,hpPct(run,x.id)+skill.heal*100);specialText+=`；${monsterName(x)} +${Math.round(skill.heal*100)}% HP`}}if(skill.type==='healall'||skill.type==='healBuff'){for(const x of t)if(hpPct(run,x.id)>0&&canReviveInRun(run,x.id))run.hp[x.id]=Math.min(100,hpPct(run,x.id)+(skill.heal||0)*100)}if(skill.type==='selfheal'||skill.type==='drain')run.hp[m.id]=Math.min(100,hpPct(run,m.id)+(skill.heal||0)*100);if(skill.power)power=skill.power;if(skill.type==='attackGauge')gauge.enemy=Math.max(0,(gauge.enemy||0)+(skill.gauge||0));}
      const doesDamage=!skill||['attack','attackGauge','attackDebuff','attackSelfGauge','drain'].includes(skill.type);let hit=0,crit=false,miss=false;
      if(doesDamage){miss=Math.random()<dodgeChance(en2.luck,p.luck);if(!miss){crit=Math.random()<Math.min(.38,p.luck/1600);const raw=(p.atk*.22+p.spd*.06+p.luck*.025)*(crit?1.65:1)*power;hit=Math.max(7,raw-en2.def*.07);enemy=Math.max(0,enemy-hit)}}
      events.push({type:'ally',action:actions,actorId:m.id,damage:Math.round(hit),crit,miss,skillName,enemyHp:enemy,spd:p.spd,wait:dt,gauges:snap});logs.push(`行动 ${actions}：${monsterName(m)}${skillName?' 使用【'+skillName+'】':''}${doesDamage?(miss?'，敌方闪避成功。':`，造成 ${Math.round(hit)} 伤害${crit?'（暴击）':''}`):''}${specialText}。`);gauge[m.id]=skill?.type==='attackSelfGauge'?Math.max(0,skill.gauge||0):0;
    }else{
      const current=t.filter(m=>hpPct(run,m.id)>0&&canReviveInRun(run,m.id));if(!current.length)break;const roll=Math.random();let target=roll<.64?current[0]:roll<.88?(current[1]||current[0]):(current[2]||current[1]||current[0]);const dynPos=current.indexOf(target),p=cv(target,dynPos),en2=enemyNow(),miss=Math.random()<dodgeChance(p.luck,en2.luck);
      if(miss){events.push({type:'enemy',action:actions,targetId:target.id,hpLoss:0,hpAfter:hpPct(run,target.id),miss:true,spd:en2.spd,wait:dt,gauges:snap});logs.push(`行动 ${actions}：敌人攻击 ${monsterName(target)}，但被闪避。`);gauge.enemy=0;tickStatus();continue}
      let incoming=Math.max(5,en2.atk-p.def*.08);if(firstGuard&&(combatMods(run).firstGuard||0)){incoming*=1-combatMods(run).firstGuard;firstGuard=false}const hpLoss=Math.min(42,incoming/(65+p.con*.22)*100),before=hpPct(run,target.id);run.hp[target.id]=Math.max(0,before-hpLoss);events.push({type:'enemy',action:actions,targetId:target.id,hpLoss,hpAfter:run.hp[target.id],miss:false,spd:en2.spd,wait:dt,gauges:snap});logs.push(`行动 ${actions}：敌人攻击 ${monsterName(target)}（${['前卫','中卫','后卫'][dynPos]}），远征生命 -${Math.round(hpLoss)}%。`);gauge.enemy=0;if(before>0&&run.hp[target.id]<=0){gauge[target.id]=0;expeditionKnockout(run,target,logs);if(target.life>0)logs.push(`${monsterName(target)} 已倒下，只能在营地选择复活。`);logs.push('后方存活队员自动向前补位。')}
    }
    tickStatus();
  }
  const win=enemy<=0,aliveCount=t.filter(m=>hpPct(run,m.id)>0&&canReviveInRun(run,m.id)).length,reason=win?`在第 ${actions} 次行动击穿敌方 ${enemyMax} HP`:(aliveCount===0?'队伍全部倒下':'达到 60 次行动上限仍未击败敌人');
  if(win){const eliteBonus=elite?(1+(combatMods(run).eliteReward||0)):1,base=Math.round((1100+run.stage*330)*(elite?1.7:1)*(boss?2.8:1)*nodeRewardScale(zone,run.stage)*eliteBonus);run.energy+=base;if(elite)run.tempBadges+=Math.max(1,Math.round(zone.badge*.5));const heal=combatMods(run).heal||0;if(heal)t.forEach(m=>{if(hpPct(run,m.id)>0&&canReviveInRun(run,m.id))run.hp[m.id]=Math.min(100,hpPct(run,m.id)+heal*100);else if(!canReviveInRun(run,m.id))run.hp[m.id]=0});run.log.push(`${boss?'首领':elite?'精英':'战斗'}胜利：+${base} 灵能。`)}else run.log.push('战斗失败，远征被迫撤退。');
  run.battle={kind,atb:true,actions,rounds:actions,elapsed,enemyMax,enemyHp:enemy,enemyAtk,enemyDef,enemySpd,enemyLuck,enemyPower,teamPower:Math.round(initialTeamPower),logs,events,startHp,win,reason,enemySpecies:ep.enemySpecies,enemyShiny:ep.enemyShiny,affixes:ep.affixes||[],variance:ep.variance};run.nextBattleMods={};run.phase='battleResult';save()
}
function offerRelic(run){const owned=new Set(run.relics||[]),pool=RELICS.filter(x=>!owned.has(x.id));run.relicChoices=shuffle(pool.length>=3?pool:RELICS).slice(0,3).map(x=>x.id);run.phase='relic';save()}
function chooseRelic(run,id){if(!(run.relicChoices||[]).includes(id))return;run.relics.push(id);run.log.push(`获得遗物：${RELICS.find(x=>x.id===id)?.name||id}`);run.relicChoices=[];advance(run)}
function checkpointBoss(run){const zone=z(run.zone),d=diff(run.difficulty),bossNo=Math.floor(run.stage/9)+1,mapBonus=zone.shinyOnly?1.35:1,fragments=Math.round((bossNo===1?5:10)+(bossNo===1?2:4)*d.id)*mapBonus,crystals=Math.max(1,Math.round((bossNo+d.id/3)*mapBonus));run.materials.eggFragment=(run.materials.eggFragment||0)+fragments;run.materials.starCrystal=(run.materials.starCrystal||0)+crystals;run.tempBadges+=bossNo;run.bossCount=bossNo;run.log.push(`第 ${bossNo} 名大BOSS击败：蛋碎片 +${fragments} · 星辉结晶 +${crystals} · 临时徽章 +${bossNo}。`);offerRelic(run)}
function continueBattle(run){if(!run.battle)return;if(!run.battle.win){finish(run,false,true);return}const kind=run.battle.kind;run.battle=null;if(kind==='boss'){if(run.stage>=26){finalChoices(run);return}checkpointBoss(run);return}if(kind==='elite'){offerRelic(run);return}if(Math.random()<.28){offerRelic(run);return}advance(run)}
function finalChoices(run){const zone=z(run.zone),d=diff(run.difficulty),scale=zone.reward*d.reward,mapBonus=zone.shinyOnly?1.35:1;if(!run.finalBossBonusGiven){const fragments=Math.round((20+d.id*6)*mapBonus),crystals=Math.max(2,Math.round((3+d.id/2)*mapBonus));run.materials.eggFragment=(run.materials.eggFragment||0)+fragments;run.materials.starCrystal=(run.materials.starCrystal||0)+crystals;run.finalBossBonusGiven=true;run.log.push(`最终大BOSS奖励：蛋碎片 +${fragments} · 星辉结晶 +${crystals}。`)}run.finalChoices=shuffle([
{type:'badges',title:'徽章袋',text:`远征徽章 +${Math.round((zone.badge*2+d.id)*mapBonus)}`,value:Math.round((zone.badge*2+d.id)*mapBonus)},
{type:'energy',title:'灵能核心',text:`额外灵能 +${Math.round(6500*scale)}`,value:Math.round(6500*scale)},
{type:'relicDust',title:'遗物尘',text:`遗物尘 +${Math.max(3,Math.round((3+d.id)*mapBonus))}`,value:Math.max(3,Math.round((3+d.id)*mapBonus))},
{type:'starCrystal',title:'星辉结晶',text:`星辉结晶 +${Math.max(2,Math.round((2+d.id/2)*mapBonus))}`,value:Math.max(2,Math.round((2+d.id/2)*mapBonus))},
{type:'eggFragment',title:'特殊蛋碎片',text:`特殊蛋碎片 +${Math.round((15+d.id*5)*mapBonus)}`,value:Math.round((15+d.id*5)*mapBonus)}]).slice(0,3);run.phase='final';save('第三名大BOSS已击败，选择本局最终奖励。')}
function chooseFinal(run,i){const c=run.finalChoices?.[i];if(!c)return;if(c.type==='badges')run.tempBadges+=c.value;else if(c.type==='energy')run.energy+=c.value;else run.materials[c.type]=(run.materials[c.type]||0)+c.value;finish(run,true,false,c.title)}
function applyRouteDebuffs(run){
  ensureRunMeta(run);
  if(!(run.curses||[]).includes('routeErosion'))return;
  const affected=[];
  for(const id of run.teamIds||[]){
    if(hpPct(run,id)<=0||!canReviveInRun(run,id))continue;
    const before=hpPct(run,id),after=Math.max(1,before-2);
    run.hp[id]=after;
    if(after<before){const m=persistentMonster(id);affected.push((m?monsterName(m):'#'+id)+' '+Math.round(before)+'%→'+Math.round(after)+'%');}
  }
  if(affected.length)run.log.push('侵蚀：抵达新地点，全队最大远征HP -2% · '+affected.join('、')+'。');
}
function advance(run){applyRouteDebuffs(run);run.stage++;run.challenge=null;run.options=makeOptions(run.stage);run.phase='map';if(run.supply<=0){run.log.push('补给耗尽：之后的挑战失败会更危险。')}save()}
function chooseNode(i){const e=ensure(),run=e?.rogueActive,node=run?.options?.[i];if(!run||!node)return;if(node.type==='rest')return applyRest(run);if(node.type==='treasure')return treasure(run);if(node.type==='challenge')return challenge(run);if(node.type==='temple')return temple(run);if(node.type==='battle'||node.type==='elite'||node.type==='boss')return prepareBattle(run,node.type)}
function applyExpeditionLifeCost(run,cleared){const s=S();if(!s)return[];const byId=new Map((s.monsters||[]).map(m=>[m.id,m])),notes=[];if(cleared){for(const id of run.teamIds||[]){const m=byId.get(id);if(!m||Number(m.life)<=0)continue;m.life=Math.max(0,(Number(m.life)||0)-1);run.lifeLoss=run.lifeLoss||{};run.lifeLoss[id]=(run.lifeLoss[id]||0)+1;notes.push(`${monsterName(m)} 完成远征 -1生命（剩 ${m.life}）${m.life<=0?'，怪物死亡':''}`)}}for(const id of run.teamIds||[]){const m=byId.get(id);const lost=Number(run.lifeLoss?.[id])||0;if(lost>0&&!notes.some(x=>m&&x.startsWith(monsterName(m))))notes.push(`${m?monsterName(m):'怪物'} 本次远征累计 -${lost}生命`)}return notes}
function finish(run,cleared=false,defeated=false,choice=''){const s=S(),e=ensure();if(!s||!e)return;const zone=z(run.zone),fraction=cleared?1:defeated?.35:.65,payout=Math.round(run.energy*fraction),badge=cleared?zone.badge+run.tempBadges:Math.floor(run.tempBadges*fraction);s.energy=(Number(s.energy)||0)+payout;e.badges+=badge;for(const k of Object.keys(run.materials))e.loot[k]=(e.loot[k]||0)+Math.floor((run.materials[k]||0)*fraction);if(cleared){const current=Math.max(0,Number(run.difficulty)||0),unlocked=Math.max(0,Number(e.difficultyUnlocked?.[zone.id])||0);if(current>=unlocked&&current<10)e.difficultyUnlocked[zone.id]=current+1}const lifeNotes=applyExpeditionLifeCost(run,cleared);e.rogueLast={zone:zone.name,difficulty:run.difficulty||0,cleared,defeated,payout,badge,relics:run.relics?.length||0,time:Date.now(),choice,lifeNotes};e.rogueActive=null;const lifeText=lifeNotes.length?' · '+lifeNotes.join('；'):'';const unlockText=cleared&&(run.difficulty||0)<10?` · 已解锁难度 ${(run.difficulty||0)+1}`:'';save((cleared?`远征通关！带回 ${payout} 灵能、徽章 ×${badge}。`:`远征结束，带回 ${payout} 灵能。`)+unlockText+lifeText)}
function abandon(){const e=ensure(),run=e?.rogueActive;if(!run)return;if(confirm('现在撤退？会保留约 65% 当前灵能与材料。'))finish(run,false,false)}

function campHTML(run){const knocked=activeTeam(run).filter(m=>hpPct(run,m.id)<=0&&canReviveInRun(run,m.id));return `${runHeader(run)}${runInventoryHTML(run)}${teamHTML(run)}<section class="rg-panel"><div class="rg-title"><div><b>♥ 营地</b><small>仍站立队员已恢复 ${run.campHeal||30}%；倒下队员只有在营地才能复活</small></div><span>${run.campRevived?'本营地已复活1只':'可选择复活1只'}</span></div>${knocked.length?`<div class="rg-event-picks">${knocked.map(m=>`<button class="secondary" data-rg-camp-revive="${m.id}" ${run.campRevived?'disabled':''}><b>复活 ${monsterName(m)}</b><small>恢复至 30% 远征HP</small></button>`).join('')}</div>`:'<p class="rg-note">目前没有可复活的队员。</p>'}<button class="primary rg-mainbtn" data-rg-camp-leave>离开营地</button></section>`}
function templeResultHTML(run){const x=run.templeResult||{good:true,title:'神庙',text:'没有发生任何事'};return `${runHeader(run)}${runInventoryHTML(run)}<section class="rg-panel"><div class="rg-title"><div><b>${x.good?'◆ 神庙祝福':'◆ 神庙诅咒'} · ${x.title}</b><small>踏入神庙的结果已经生效</small></div></div><p class="${x.good?'rg-note':'rg-danger'}" style="font-size:13px;padding:10px"><b>${x.text}</b></p><button class="primary rg-mainbtn" data-rg-temple-next>继续远征</button></section>`}
function nodeHTML(run){return `<section class="rg-panel"><div class="rg-title"><div><b>选择下一条路线</b><small>共27层；第9、18、27层固定为大BOSS</small></div><span>第 ${run.stage+1}/27 层</span></div><div class="rg-nodes">${run.options.map((o,i)=>{const m=NODE_META[o.type];return `<button class="rg-node" data-rg-node="${i}"><strong>${m[0]}</strong><b>${m[1]}</b><small>${m[2]}</small></button>`}).join('')}</div></section>`}
function runHeader(run){const zone=z(run.zone),d=diff(run.difficulty),chapter=Math.floor(run.stage/9)+1;return `<section class="rg-panel"><div class="rg-title"><div><b>${zone.label} · ${d.label}</b><small>27层 · 每9层一个大BOSS · 当前第 ${Math.min(3,chapter)} 区域</small></div><button class="secondary" data-rg-abandon>撤退结算</button></div>${routeBar(run)}<div class="rg-status"><span>补给 ${run.supply}</span><span>暂存灵能 ${Math.round(run.energy)}</span><span>临时徽章 ${run.tempBadges}</span><span>遗物 ${(run.relics||[]).length}</span><span>蛋碎片 ${run.materials?.eggFragment||0}</span></div></section>`}
function teamHTML(run){const t=activeTeam(run);return `<section class="rg-panel"><div class="rg-title"><div><b>自走棋阵型</b><small>前卫承担主要火力；倒下后中卫自动补位，再由后卫补上。部分遗物会强化站位</small></div><button class="secondary" data-rg-rotate>轮换阵型</button></div><div class="rg-team">${[...t].reverse().map((m,vi)=>monCard(m,run,t.length-1-vi)).join('')}</div></section>`}
function battlePreviewHTML(run){const b=run.pendingBattle||enemyPreview(run,'battle'),t=activeTeam(run),enemyPower=Math.round(b.enemyMax*.7+b.enemyAtk*2+b.enemyDef*1.3+b.enemySpd*.5+b.enemyLuck*.25);const alive=t.filter(m=>hpPct(run,m.id)>0&&canReviveInRun(run,m.id));const teamPower=Math.round(alive.reduce((sum,m,i)=>{const p=combatValue(m,i,run);return sum+p.atk*1.1+p.def+p.spd*.65+p.luck*.35+p.con*.7},0));const kindName=b.kind==='boss'?'区域首领':b.kind==='elite'?'精英守卫':'野外守卫';const enemyCard=`<div class="rg-mon rg-enemy-match">${R()?.sprite?.(b.enemySpecies,0,b.kind==='boss',null)||`<div class="sprite" style="width:58px;height:58px;margin:auto;display:grid;place-items:center;font-size:28px">${b.kind==='boss'?'★':b.kind==='elite'?'☠':'⚔'}</div>`}<b>${kindName}</b><small>体质 ${b.enemyMax} · 攻击 ${b.enemyAtk} · 防御 ${b.enemyDef}</small><small>速度 ${b.enemySpd} · 幸运 ${b.enemyLuck}</small><small>${b.affixes?.length?'强化词条：'+b.affixes.join(' · '):'强化词条：无'} · 随机系数 ${b.variance||100}%</small><div class="rg-hp"><i style="width:100%"></i></div><small>远征生命 100% · HP ${b.enemyMax}/${b.enemyMax}</small></div>`;return `${runHeader(run)}${runInventoryHTML(run)}<section class="rg-panel"><div class="rg-title"><div><b>战斗准备</b><small>先查看双方数值、当前HP、Debuff和道具，再决定是否进入战斗</small></div><span>${b.kind==='boss'?'BOSS':b.kind==='elite'?'精英':'普通'}</span></div><div class="rg-battle"><div class="rg-team">${[...t].reverse().map((m,vi)=>monCard(m,run,t.length-1-vi)).join('')}</div><div class="rg-vs">VS</div><div class="rg-team">${enemyCard}</div></div><p class="rg-note"><b>战力参考：</b>我方 ${teamPower} · 敌方 ${enemyPower}。注意：战力只是属性参考，<b>当前远征HP、站位、Debuff、暴击和8回合限制</b>都会影响输赢。<br><b>速度：</b>${speedRuleText()}</p><button class="primary rg-mainbtn" data-rg-enter-battle>进入战斗</button></section>`}
function battleHTML(run){const b=run.battle,t=activeTeam(run);return `${runHeader(run)}<section class="rg-panel"><div class="rg-title"><div><b>${b.kind==='boss'?'首领战':b.kind==='elite'?'精英战':'自动战斗'} · ${b.win?'胜利':'失败'}</b><small>战斗自动进行；五维、站位和遗物共同决定结果</small></div><span>${b.atb?(b.actions||b.rounds)+' 次行动':b.rounds+' 回合'}</span></div><div class="rg-battle"><div class="rg-team">${[...t].reverse().map((m,vi)=>monCard(m,run,t.length-1-vi)).join('')}</div><div class="rg-vs">VS</div><div class="rg-mon rg-enemy-match">${R()?.sprite?.(b.enemySpecies,0,b.kind==='boss',null)||`<div class="sprite" style="width:58px;height:58px;margin:auto;display:grid;place-items:center;font-size:28px">${b.kind==='boss'?'★':b.kind==='elite'?'☠':'⚔'}</div>`}<b>${b.kind==='boss'?'区域首领':b.kind==='elite'?'精英守卫':'野外守卫'}</b><small>体质 ${b.enemyMax} · 攻击 ${b.enemyAtk||'-'} · 防御 ${b.enemyDef||'-'}</small><small>速度 ${b.enemySpd||'-'} · 幸运 ${b.enemyLuck||'-'}</small><small>${b.affixes?.length?'强化词条：'+b.affixes.join(' · '):'强化词条：无'} · 随机系数 ${b.variance||100}%</small><div class="rg-hp"><i style="width:${Math.max(0,b.enemyHp/b.enemyMax*100)}%"></i></div><small>远征生命 ${Math.round(Math.max(0,b.enemyHp/b.enemyMax*100))}% · HP ${Math.round(b.enemyHp)}/${b.enemyMax}</small><small>敌方估值 ${b.enemyPower||'-'} · 我方估值 ${b.teamPower||'-'}</small></div></div><p class="rg-note"><b>结果原因：</b>${b.reason||'根据双方属性、站位、遗物和随机暴击结算'}</p><div class="rg-log">${b.logs.map(x=>`<div>${x}</div>`).join('')}</div><button class="primary rg-mainbtn" data-rg-battle-next>${b.win?'领取结果并继续':'结束远征'}</button></section>`}
function challengeHTML(run){const c=run.challenge,t=activeTeam(run),zone=z(run.zone),target=70+zone.tier*58+run.stage*12;return `${runHeader(run)}${runInventoryHTML(run)}${teamHTML(run)}<section class="rg-panel"><div class="rg-title"><div><b>${c.title}</b><small>${c.text}</small></div><span>判定：${STAT[c.stat]} · 目标约 ${target}</span></div><p class="rg-note">选择一只怪物处理这个事件。这里不再使用三只怪的平均值，因此培育专门擅长某项能力的怪物会有价值。</p><div class="rg-event-picks">${t.map((m,i)=>`<button class="secondary" data-rg-event-member="${i}"><b>${monsterName(m)}</b><small>${STAT[c.stat]} ${st(m)[c.stat]}</small></button>`).join('')}</div></section>`}
function challengeResultHTML(run){const r=run.challengeResult||{},m=persistentMonster(r.memberId),tone=r.success?'#2f6d3d':'#9a2b25';return `${runHeader(run)}${runInventoryHTML(run)}${teamHTML(run)}<section class="rg-panel"><div class="rg-title"><div><b>${r.success?'事件成功':'事件失败'} · ${r.title||'特殊事件'}</b><small>结果会保留在本局 Log；看完后再继续路线</small></div><span style="color:${tone};font-weight:900">${r.success?'SUCCESS':'FAILED'}</span></div><div class="rg-card" style="margin-top:9px;border-left:6px solid ${tone}"><b>${r.memberName||'怪物'} · ${r.stat||'能力'} ${r.baseValue??'-'}</b><small>本次判定值 ${r.value??'-'} · 目标约 ${r.target??'-'} · 成功率约 ${r.chance??'-'}%</small><div class="rg-log" style="margin-top:8px;max-height:none">${(r.lines||[]).map(x=>`<div>${x}</div>`).join('')}</div></div><button class="primary rg-mainbtn" data-rg-event-continue>继续远征</button></section>`}
function continueChallenge(run){const r=run.challengeResult;if(!r)return;const after=r.after;run.challengeResult=null;run.challenge=null;if(after==='relic')offerRelic(run);else advance(run)}
function relicHTML(run){const owned=(run.relics||[]).map(id=>RELICS.find(x=>x.id===id)?.name).filter(Boolean);return `${runHeader(run)}${runInventoryHTML(run)}${teamHTML(run)}<section class="rg-panel"><div class="rg-title"><div><b>遗物三选一</b><small>先看上方队伍当前HP、站位、数值和Debuff，再决定补哪一块短板</small></div><span>${owned.length?'已有：'+owned.join(' · '):'当前无遗物'}</span></div><div class="rg-relics">${run.relicChoices.map(id=>{const r=RELICS.find(x=>x.id===id);return `<button class="secondary rg-relic" data-rg-relic="${id}"><b>${r.name}</b><span>${r.text}</span></button>`}).join('')}</div></section>`}
function finalHTML(run){return `${runHeader(run)}${runInventoryHTML(run)}<section class="rg-panel"><div class="rg-title"><div><b>首领宝库 · 永久奖励三选一</b><small>这个奖励会真正带回牧场；远征材料之后用于远征兑换所</small></div></div><div class="rg-final">${run.finalChoices.map((c,i)=>`<button class="primary rg-relic" data-rg-final="${i}"><b>${c.title}</b><span>${c.text}</span></button>`).join('')}</div></section>`}
function activeHTML(run){if(run.phase==='camp')return campHTML(run);if(run.phase==='templeResult')return templeResultHTML(run);if(run.phase==='battlePreview')return battlePreviewHTML(run);if(run.phase==='battleResult')return battleHTML(run);if(run.phase==='challenge')return challengeHTML(run);if(run.phase==='challengeResult')return challengeResultHTML(run);if(run.phase==='relic')return relicHTML(run);if(run.phase==='final')return finalHTML(run);return `${runHeader(run)}${runInventoryHTML(run)}${teamHTML(run)}${nodeHTML(run)}<details class="rg-panel"><summary>本局遗物与记录</summary><p>${(run.relics||[]).map(id=>RELICS.find(x=>x.id===id)?.name).filter(Boolean).join(' · ')||'暂时没有遗物'}</p><div class="rg-log">${run.log.slice(-8).reverse().map(x=>`<div>${x}</div>`).join('')}</div></details>`}
function idleHTML(e){const zone=z(),d=diff(),unlock=Math.max(0,Number(e.difficultyUnlocked?.[zone.id])||0),list=sorted(zone),rec=new Set(list.slice(0,3).map(m=>m.id)),free=freeRemain(e,zone),bonus=bonusAttempts(e,zone),remain=free+bonus;const opts=i=>'<option value="">选择队员 '+(i+1)+'</option>'+list.map(m=>`<option value="${m.id}" ${selected[i]===m.id?'selected':''}>${rec.has(m.id)?'★推荐 · ':''}${stars(m)}${m.shiny?' ✦':''} ${monsterName(m)} · 总能力 ${st(m).reduce((a,b)=>a+b,0)}</option>`).join('');return `<div class="rogue"><section class="rg-panel"><div class="rg-title"><div><b>选择远征地图</b><small>原来的1–5星难度已合并；普通远征允许任何1–5★怪物</small></div><span class="rg-materials">徽章 ${e.badges} · 遗物尘 ${e.loot.relicDust} · 星辉结晶 ${e.loot.starCrystal} · 蛋碎片 ${e.loot.eggFragment}</span></div><div class="rg-tabs">${ZONES.map(x=>`<button class="secondary ${x.id===selectedZone?'on':''}" data-rg-zone="${x.id}"><b>${x.label}</b><small>${x.desc}</small></button>`).join('')}</div></section><section class="rg-panel"><div class="rg-title"><div><b>${zone.label} · 选择难度</b><small>通关当前最高难度后解锁下一档；加成会累计</small></div><span>最高已解锁：难度 ${unlock}</span></div><div class="rg-tabs">${DIFFICULTIES.map(x=>`<button class="secondary ${x.id===selectedDifficulty?'on':''}" data-rg-difficulty="${x.id}" ${x.id<=unlock?'':'disabled'}><b>${x.label}${x.id>unlock?' 🔒':''}</b><small>${x.text} · 奖励 ×${x.reward.toFixed(2)}</small></button>`).join('')}</div><p class="rg-note"><b>${d.label}：</b>${d.text}。普通敌人数值会在约90%–110%随机；精英约105%–125%；大BOSS约120%–145%。难度4起会出现随机强化词条。</p></section><section class="rg-panel"><div class="rg-title"><div><b>准备出发</b><small>${zone.shinyOnly?'只允许闪光怪物；1–5★均可':'1–5★均可参加；难度0按1★队伍也有机会通关来平衡'}</small></div><span>27层 · BOSS在9 / 18 / 27层</span></div><div class="rg-status"><span>今日免费剩余 ${free}</span><span>追加次数 ${bonus}</span><span>次数药水 ×${e.attemptPotions||0}</span></div><div style="display:flex;gap:8px;flex-wrap:wrap;margin:8px 0"><button class="secondary" data-rg-buy-attempt>购买药水 100,000 灵能</button><button class="secondary" data-rg-use-attempt ${(e.attemptPotions||0)>0?'':'disabled'}>使用药水：本地图/难度 +1次</button></div><p class="rg-note">三个大BOSS都会给蛋碎片；难度越高，碎片和整体奖励越高。第三名BOSS还会进入最终奖励三选一。</p><div class="rg-title"><div><b>选择3只怪物</b><small>队伍顺序：1号前卫、2号中卫、3号后卫</small></div><div><select data-rg-sort><option value="recommended" ${sortMode==='recommended'?'selected':''}>最佳推荐</option><option value="newest" ${sortMode==='newest'?'selected':''}>最新加入</option><option value="oldest" ${sortMode==='oldest'?'selected':''}>最早加入</option><option value="total" ${sortMode==='total'?'selected':''}>总能力</option><option value="star" ${sortMode==='star'?'selected':''}>星级</option><option value="luck" ${sortMode==='luck'?'selected':''}>幸运</option></select><button class="secondary" data-rg-recommend>一键最佳推荐</button></div></div><div class="rg-grid3 rg-select">${[0,1,2].map(i=>`<label><b>${['前卫','中卫','后卫'][i]}</b><select data-rg-slot="${i}">${opts(i)}</select></label>`).join('')}</div>${team().length?`<div class="rg-team" style="margin-top:8px">${[...team()].reverse().map((m,vi)=>{const i=team().length-1-vi;return `<div class="rg-mon">${R()?.sprite?.(m.species,m.tint,m.shiny,m.specialColor)||''}<b>${monsterName(m)} ${stars(m)}</b><small>${['前卫','中卫','后卫'][i]} · 总能力 ${st(m).reduce((a,b)=>a+b,0)}</small></div>`}).join('')}</div>`:''}<button class="primary rg-mainbtn" data-rg-start ${team().length===3&&remain>0&&selectedDifficulty<=unlock?'':'disabled'}>开始 ${zone.label} · ${d.label}</button></section>${eggWorkshopHTML(e)}${e.rogueLast?`<section class="rg-panel"><b>上次远征</b><small>${e.rogueLast.zone} · 难度 ${e.rogueLast.difficulty||0} · ${e.rogueLast.cleared?'通关':e.rogueLast.defeated?'战败':'撤退'} · ${e.rogueLast.payout} 灵能 · 徽章 ×${e.rogueLast.badge}</small></section>`:''}</div>`}
function render(){injectStyle();const box=document.getElementById('expedition-content');if(!box)return;const e=ensure();if(!e)return;box.innerHTML=e.rogueActive?`<div class="rogue">${activeHTML(e.rogueActive)}</div>`:idleHTML(e);if(e.rogueActive)decorateFinalStats(e.rogueActive)}
document.addEventListener('change',ev=>{const srt=ev.target.closest?.('[data-rg-sort]');if(srt){sortMode=srt.value;render();return}const slot=ev.target.closest?.('[data-rg-slot]');if(slot){selected[Number(slot.dataset.rgSlot)]=Number(slot.value)||null;render()}});
document.addEventListener('click',ev=>{const stat=ev.target.closest?.('[data-rg-stat-toggle]');if(stat){ev.preventDefault();ev.stopPropagation();document.querySelectorAll('.rg-final-stat.open').forEach(x=>{if(x!==stat)x.classList.remove('open')});stat.classList.toggle('open');return;}const zone=ev.target.closest?.('[data-rg-zone]');if(zone){selectedZone=zone.dataset.rgZone;selectedDifficulty=0;selected=[];const e=ensure();if(e){e.lastZone=selectedZone;e.lastDifficulty=0}save();return}const difficulty=ev.target.closest?.('[data-rg-difficulty]');if(difficulty){const e=ensure(),n=Number(difficulty.dataset.rgDifficulty)||0;if(n<=(e?.difficultyUnlocked?.[selectedZone]||0)){selectedDifficulty=n;if(e)e.lastDifficulty=n;save()}return}if(ev.target.closest?.('[data-rg-buy-attempt]')){buyAttemptPotion();return}if(ev.target.closest?.('[data-rg-use-attempt]')){useAttemptPotion();return}const craft=ev.target.closest?.('[data-rg-craft-egg]');if(craft){const recipe=EGG_FRAGMENT_RECIPES.find(x=>x.id===craft.dataset.rgCraftEgg);if(recipe)makeFragmentEgg(recipe);return}if(ev.target.closest?.('[data-rg-recommend]')){selected=sorted(z()).slice(0,3).map(m=>m.id);render();return}if(ev.target.closest?.('[data-rg-start]')){startRun();return}const item=ev.target.closest?.('[data-rg-item]');if(item){useRunItem(item.dataset.rgItem);return}if(ev.target.closest?.('[data-rg-rotate]')){const run=ensure()?.rogueActive;if(run)rotateFormation(run);return}const node=ev.target.closest?.('[data-rg-node]');if(node){chooseNode(Number(node.dataset.rgNode));return}const em=ev.target.closest?.('[data-rg-event-member]');if(em){const run=ensure()?.rogueActive;if(run)resolveChallenge(run,Number(em.dataset.rgEventMember));return}if(ev.target.closest?.('[data-rg-event-continue]')){const run=ensure()?.rogueActive;if(run)continueChallenge(run);return}const cr=ev.target.closest?.('[data-rg-camp-revive]');if(cr){const run=ensure()?.rogueActive;if(run)campRevive(run,Number(cr.dataset.rgCampRevive));return}if(ev.target.closest?.('[data-rg-camp-leave]')){const run=ensure()?.rogueActive;if(run)leaveCamp(run);return}if(ev.target.closest?.('[data-rg-temple-next]')){const run=ensure()?.rogueActive;if(run){run.templeResult=null;advance(run)}return}const rel=ev.target.closest?.('[data-rg-relic]');if(rel){const run=ensure()?.rogueActive;if(run)chooseRelic(run,rel.dataset.rgRelic);return}if(ev.target.closest?.('[data-rg-enter-battle]')){const run=ensure()?.rogueActive;if(run?.pendingBattle)battle(run,run.pendingBattle.kind);return}if(ev.target.closest?.('[data-rg-battle-next]')){const run=ensure()?.rogueActive;if(run)continueBattle(run);return}const fin=ev.target.closest?.('[data-rg-final]');if(fin){const run=ensure()?.rogueActive;if(run)chooseFinal(run,Number(fin.dataset.rgFinal));return}if(ev.target.closest?.('[data-rg-abandon]'))abandon()});
window.QinsterExpedition={render,zones:ZONES,version:'v224c-steady-expedition'};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(render,0));else setTimeout(render,0);
})();
