/* Qinster release v280 */
(()=>{
'use strict';
const STAT=['HP','攻击','防御','速度','幸运'];
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
function floorNo(stage){return Math.floor(Math.max(0,Number(stage)||0)/9)+1}
function floorStep(stage){return Math.max(0,Number(stage)||0)%9+1}
function floorLabel(stage){return floorNo(stage)+'-'+floorStep(stage)}
function endlessExtra(stage){return Math.max(0,floorNo(stage)-3)*.10}
const META_TREE=[
{id:'atk',name:'远征攻击',max:5,cost:[5,10,20,35,55],text:'每级：远征中全队攻击 +1%'},
{id:'def',name:'远征防御',max:5,cost:[5,10,20,35,55],text:'每级：远征中全队防御 +1%'},
{id:'spd',name:'远征速度',max:5,cost:[5,10,20,35,55],text:'每级：远征中全队速度 +1%'},
{id:'luck',name:'远征幸运',max:5,cost:[5,10,20,35,55],text:'每级：远征中全队幸运 +1%'},
{id:'vanguard',name:'先锋护符',max:3,cost:[15,30,60],text:'每级：每个楼层第一次战斗所受伤害 -3%'}
];
function metaMods(e=ensure()){const t=e?.metaTree||{},out={};for(const k of ['atk','def','spd','luck'])out[k]=(Number(t[k])||0)*.01;out.vanguard=(Number(t.vanguard)||0)*.03;return out}
function buyMeta(id){const e=ensure(),n=META_TREE.find(x=>x.id===id);if(!e||!n)return;const lv=Math.max(0,Number(e.metaTree?.[id])||0);if(lv>=n.max)return R()?.tell?.('这个远征加成已经满级。');const cost=n.cost[lv]||999;if(e.badges<cost)return R()?.tell?.(`远征徽章不足，需要 ${cost}。`);e.badges-=cost;e.metaTree[id]=lv+1;save(`${n.name} 升至 Lv${lv+1}。`)}
function idleNav(){return `<section class="rg-panel"><div class="rg-tabs"><button class="secondary ${idleTab==='run'?'on':''}" data-rg-idle-tab="run"><b>远征</b><small>出发与蛋碎片工坊</small></button><button class="secondary ${idleTab==='meta'?'on':''}" data-rg-idle-tab="meta"><b>远征加成树</b><small>消耗徽章，永久强化远征</small></button><button class="secondary ${idleTab==='ladder'?'on':''}" data-rg-idle-tab="ladder"><b>肉鸽积分榜</b><small>按本局累计击杀积分排序</small></button><button class="secondary ${idleTab==='box'?'on':''}" data-rg-idle-tab="box"><b>远征Box</b><small>转籍 · 种族值 · 扩建</small></button></div></section>`}
function metaTreeHTML(e){return `${idleNav()}<section class="rg-panel"><div class="rg-title"><div><b>远征加成树</b><small>永久生效；价格递增，设计为长期慢慢养成</small></div><span>可用徽章 ${e.badges}</span></div><div class="rg-relics">${META_TREE.map(n=>{const lv=Math.max(0,Number(e.metaTree?.[n.id])||0),full=lv>=n.max,cost=full?'MAX':n.cost[lv];return `<article class="rg-relic"><b>${n.name} · Lv${lv}/${n.max}</b><span>${n.text}</span><button class="secondary" data-rg-meta-buy="${n.id}" ${full?'disabled':''}>${full?'已满级':'升级 · '+cost+' 徽章'}</button></article>`}).join('')}</div><p class="rg-note">攻击/防御/速度/幸运每支满级仅 +5%；先锋护符满级后，每个楼层第一次战斗所受伤害 -9%。不会覆盖本局遗物与训练，而是作为独立的外部加成层。</p></section>`}
function formatLadderTime(v){const d=new Date(Number(v)||0);if(!Number(v)||Number.isNaN(d.getTime()))return '旧记录';const p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}/${p(d.getMonth()+1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`}
function ladderHTML(e){const rows=(e.leaderboard||[]).slice(0,20);return `${idleNav()}<section class="rg-panel"><div class="rg-title"><div><b>肉鸽积分榜</b><small>优先按积分排名；同时显示最后到达楼层与取得时间</small></div><span>历史记录 ${rows.length}</span></div>${rows.length?`<div class="rg-log" style="max-height:none;background:#232630">${rows.map((r,i)=>`<div style="display:grid;grid-template-columns:40px minmax(150px,1fr) 86px 96px 132px;gap:8px;padding:6px;border-bottom:1px solid #484d59;align-items:center"><b>#${i+1}</b><span>${r.zone||'远征'} · 难度 ${r.difficulty||0}</span><span>楼层 ${r.floor||'1-1'}</span><strong>${Math.round(r.score||0)} 分</strong><small>${formatLadderTime(r.time)}</small></div>`).join('')}</div>`:'<p class="rg-note">还没有完成过可记录的远征。</p>'}</section>`}
const RELICS=[
{id:'fang',name:'赤牙',text:'全队攻击 +18%',mods:{atk:.18}},
{id:'shell',name:'古壳',text:'全队防御 +20%',mods:{def:.20}},
{id:'boots',name:'风行靴',text:'全队速度 +22%',mods:{spd:.22}},
{id:'clover',name:'四叶结晶',text:'全队幸运 +24%',mods:{luck:.24}},
{id:'heart',name:'生命核心',text:'战后全队恢复 2% 远征生命',mods:{heal:.02}},
{id:'guard',name:'先祖护符',text:'每场战斗第一次受伤降低 45%',mods:{firstGuard:.45}},
{id:'blade',name:'玻璃刃',text:'后排攻击 +32%，防御 -10%',mods:{backAtk:.32,backDef:-.10}},
{id:'wall',name:'守门石',text:'前排防御 +35%，攻击 -8%',mods:{frontDef:.35,frontAtk:-.08}},
{id:'feast',name:'野营锅',text:'休息节点额外恢复 20%，补给 +1',mods:{rest:.20}},
{id:'hunter',name:'猎迹灯',text:'精英战奖励 +35%',mods:{eliteReward:.35}},
{id:'coin',name:'旧王金币',text:'宝箱灵能 +50%',mods:{chest:.50}},
{id:'star',name:'星辉镜',text:'闪光怪物攻击/幸运 +15%',mods:{shiny:.15}},
{id:'trainerBadge',name:'教官徽章',text:'训练营额外 +1 个候选选项；训练收益 +25%（可叠加）',mods:{trainingChoices:1,trainingGain:.25}},
{id:'trainingSandbag',name:'负重沙袋',text:'训练收益 +15%；全队防御 +5%',mods:{trainingGain:.15,def:.05}},
{id:'shrineIncense',name:'祈愿香炉',text:'神庙额外 +1 个候选选项；神庙祝福效果 +25%（可叠加）',mods:{templeChoices:1,templeGain:.25}},
{id:'sacredPage',name:'圣纹残页',text:'神庙祝福效果 +15%；全队幸运 +5%',mods:{templeGain:.15,luck:.05}},
{id:'thornBrace',name:'尖刺护腕',text:'全队攻击 +10% · 防御 +6%',mods:{atk:.10,def:.06}},
{id:'ironPendant',name:'铁心吊坠',text:'全队防御 +12%；每场第一次受伤再降低 15%',mods:{def:.12,firstGuard:.15}},
{id:'windFeather',name:'追风羽',text:'全队速度 +12% · 幸运 +6%',mods:{spd:.12,luck:.06}},
{id:'boneDice',name:'幸运骨骰',text:'全队幸运 +15%',mods:{luck:.15}},
{id:'hunterHorn',name:'猎人号角',text:'精英奖励 +20%；全队攻击 +5%',mods:{eliteReward:.20,atk:.05}},
{id:'treasureCompass',name:'寻宝罗盘',text:'宝箱灵能 +30%；全队幸运 +5%',mods:{chest:.30,luck:.05}},
{id:'rationBelt',name:'补给腰包',text:'营地恢复效果 +12%',mods:{rest:.12}},
{id:'fateWeight',name:'命运砝码',text:'随机 Buff 最低值 +2个百分点；随机 Debuff 最大值 -4个百分点（可叠加）',mods:{buffFloor:2,debuffCap:4}},
{id:'bloodCrown',name:'血战王冠',text:'全队攻击 +28%，防御 -14%',mods:{atk:.28,def:-.14}},
{id:'galeGamble',name:'疾风赌注',text:'全队速度 +30%，防御 -12%',mods:{spd:.30,def:-.12}},
{id:'fortunePact',name:'豪赌契约',text:'全队幸运 +32%，攻击 -10%',mods:{luck:.32,atk:-.10}},
{id:'glassHeart',name:'玻璃心核',text:'全队攻击 +20%、速度 +16%，防御 -18%',mods:{atk:.20,spd:.16,def:-.18}},
{id:'lifeGrail',name:'生命圣杯',text:'全队最大 HP ×1.5',mods:{hpMult:.50}},
{id:'thickBloodCharm',name:'厚血护符',text:'全队最大 HP +200',mods:{hpFlat:200}},
{id:'lifeChip',name:'小型生命芯片',text:'全队最大 HP +100',mods:{hpFlat:100}},
{id:'beastHeart',name:'巨兽心脏',text:'全队最大 HP +500，防御 -5%',mods:{hpFlat:500,def:-.05}},
{id:'bloodforgedBlade',name:'血铸利刃',text:'追加攻击力 = 最大 HP 的 25%',mods:{atkFromHp:.25}},
{id:'unyieldingBone',name:'不屈骨甲',text:'全队最大 HP +300，防御 +8%',mods:{hpFlat:300,def:.08}},
{id:'lastStandEngine',name:'残血引擎',text:'每损失 10% HP，攻击 +3%，最多 +27%',mods:{missingHpAtkPer10:.03}},
{id:'bloodSpeedPump',name:'血速泵',text:'全队最大 HP +150，速度 +12%，防御 -5%',mods:{hpFlat:150,spd:.12,def:-.05}},
{id:'reflectArmor',name:'反甲',text:'受到敌方攻击造成实际 HP 伤害后，攻击者受到该次伤害的 25% 反射伤害',mods:{reflectDamage:.25}},
{id:'relicWarBanner',name:'百宝战旗',text:'每持有 1 件遗物，全队攻击 +5%（包含本身）',mods:{relicAtkPerRelic:.05}},
{id:'buffResonator',name:'祝福共鸣',text:'每拥有 1 个正面 Buff，全队攻击 +1%、防御 +3%',mods:{atkPerBuff:.01,defPerBuff:.03}},
{id:'digitChaosCube',name:'乱序魔方',text:'进入每场战斗时，随机重排我方攻击力数字；战斗结束后恢复原值',mods:{digitShuffleAtk:1}},
{id:'formationCompass',name:'错位罗盘',text:'开战前将敌方前卫与后卫位置对调',mods:{swapEnemyEnds:1}},
{id:'dodgeCounterBlade',name:'闪避反刃',text:'我方闪避成功后，立刻对攻击者造成自身攻击力 50% 的伤害',mods:{dodgeCounterAtk:.50}},
{id:'phoenixCore',name:'复苏核心',text:'整次远征一次性复苏：任意队员 HP 归 0 时自动恢复至 50% 最大 HP；每持有1件增加1次复苏次数',mods:{autoReviveCharges:1}},
{id:'absoluteGuard',name:'绝对格挡器',text:'每只怪物每场第一次受到敌方攻击时完全格挡',mods:{blockFirstHit:1}},
{id:'energyShield100',name:'能量护盾·100',text:'每场战斗开始时，每只怪物获得 100 点护盾；伤害先扣护盾再扣 HP',mods:{shieldFlat:100}},
{id:'energyShield250',name:'能量护盾·250',text:'每场战斗开始时，每只怪物获得 250 点护盾；伤害先扣护盾再扣 HP',mods:{shieldFlat:250}},
{id:'vulnerabilityMark',name:'易伤刻印',text:'敌方受到的最终伤害 +15%',mods:{enemyVulnerable:.15}},
{id:'armorBreakSeal',name:'破甲封印',text:'敌方防御 -20%',mods:{enemyDefDown:.20}},
{id:'openingSunder',name:'开场碎甲',text:'战斗开始时敌方防御 -30%，持续整场',mods:{enemyDefDown:.30}},
{id:'stackingWound',name:'裂伤印记',text:'每次我方命中敌人，使其本场受到伤害 +2%，最多 +20%',mods:{stackVulnerable:.02,stackVulnerableCap:.20}},
{id:'bossBreaker',name:'屠王破甲器',text:'对 BOSS 伤害 +25%，并使 BOSS 防御 -15%',mods:{bossDamage:.25,bossDefDown:.15}}
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
function dodgeChance(defLuck,atkLuck,bonus=0){return Math.max(.03,Math.min(.70,.08+(Number(defLuck||0)-Number(atkLuck||0))/1400+Math.max(0,Number(bonus)||0)))}

const CURSES=[
{id:'weaken',name:'虚弱',text:'攻击随机降低 5%～25%',roll:{atk:[.05,.25]}},
{id:'breakArmor',name:'破甲',text:'防御随机降低 5%～25%',roll:{def:[.05,.25]}},
{id:'slow',name:'迟缓',text:'速度随机降低 5%～30%',roll:{spd:[.05,.30]}},
{id:'badLuck',name:'厄运',text:'幸运随机降低 5%～35%',roll:{luck:[.05,.35]}},
{id:'routeErosion',name:'侵蚀',text:'每到新地点随机失去 1%～4% 最大远征HP（最低保留 1%）',roll:{routeLoss:[1,4]}},
{id:'trainingFatigue',name:'倦怠',text:'训练营获得量随机降低 1%～40%',roll:{trainingGain:[.01,.40]}}
];
const CHALLENGES=[
{title:'断桥残索',text:'桥只剩几根绳索，选一只怪物先过去固定绳索。',stat:3},
{title:'巨石机关',text:'石门卡死，需要力量强的怪物强行推开。',stat:1},
{title:'毒雾湿地',text:'雾气持续侵蚀体力，需要HP最稳的怪物带路。',stat:0},
{title:'落石峡口',text:'连续落石，需要防御高的怪物顶住第一波。',stat:2},
{title:'隐秘岔路',text:'只有直觉和运气足够好的怪物能找到安全路线。',stat:4}
];
const NODE_META={battle:['⚔','普通战斗','自动战斗，胜利后继续'],elite:['☠','精英战','更强敌人，必出遗物三选一'],treasure:['▣','宝箱','获得灵能与随机远征材料'],training:['▲','训练营','三选一强化本次远征中的指定怪物'],rest:['♥','营地','恢复队伍并补充补给'],challenge:['?','特殊事件','指定一只怪物进行能力判定'],temple:['◆','神庙','可能得到祝福，也可能遭受诅咒'],boss:['★','区域首领','本局最终自动战斗']};
let selected=[],selectedZone='normal',selectedDifficulty=0,zoneInitialized=false,idleTab='run';
function R(){return window.QinsterRuntime||null} function S(){return R()?.getState?.()||null}
function z(id=selectedZone){return ZONES.find(x=>x.id===id)||ZONES[0]}
function today(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function save(msg){const s=S(),r=R();if(!s||!r)return;s.revision=(s.revision||0)+1;r.save?.();r.render?.();if(msg)r.tell?.(msg);render()}
function ensure(){const s=S();if(!s)return null;if(!s.expedition||typeof s.expedition!=='object')s.expedition={};const e=s.expedition;if(!Array.isArray(e.box))e.box=[];e.boxCapacity=Math.max(10,Math.min(200,Math.floor(Number(e.boxCapacity)||10)),e.box.length);if(e.dayKey!==today()){e.dayKey=today();e.usedByZone={}}if(!e.usedByZone)e.usedByZone={};if(!e.extraAttempts)e.extraAttempts={};if(!e.difficultyUnlocked)e.difficultyUnlocked={normal:0,shiny:0};for(const x of ZONES)e.difficultyUnlocked[x.id]=Math.max(0,Math.min(10,Number(e.difficultyUnlocked[x.id])||0));e.attemptPotions=Math.max(0,Number(e.attemptPotions)||0);e.badges=Math.max(0,Number(e.badges)||0);if(!e.loot)e.loot={relicDust:0,starCrystal:0,eggFragment:0};for(const k of ['relicDust','starCrystal','eggFragment','expeditionEggFragment','shinyEggFragment'])e.loot[k]=Math.max(0,Number(e.loot[k])||0);if(!e.metaTree)e.metaTree={atk:0,def:0,spd:0,luck:0,vanguard:0};if(e.metaTree.vanguard==null)e.metaTree.vanguard=Math.max(0,Number(e.metaTree.supply)||0);for(const k of ['atk','def','spd','luck','vanguard'])e.metaTree[k]=Math.max(0,Number(e.metaTree[k])||0);if(!Array.isArray(e.leaderboard))e.leaderboard=[];if(!selected.length){const boxIds=new Set(e.box.map(m=>m.id));selected=(e.lastTeamIds||[]).filter(id=>boxIds.has(id)).slice(0,3)}if(!zoneInitialized){selectedZone=ZONES.some(x=>x.id===e.lastZone)?e.lastZone:'normal';selectedDifficulty=Math.min(Number(e.lastDifficulty)||0,e.difficultyUnlocked[selectedZone]||0);zoneInitialized=true}return e}
const EGG_FRAGMENT_RECIPES=[
{id:'basic',cost:10,name:'基础远征蛋',text:'随机 1★–2★',stars:[1,1,1,2]},
{id:'fine',cost:30,name:'精制远征蛋',text:'随机 2★–3★',stars:[2,2,2,3]},
{id:'rare',cost:80,name:'稀有远征蛋',text:'随机 3★–4★',stars:[3,3,4]},
{id:'elite',cost:200,name:'精英远征蛋',text:'随机 4★–5★',stars:[4,4,5]},
{id:'expedition',cost:500,name:'远征秘藏蛋',text:'3★–5★ · 高概率远征限定种族 · 小概率闪光/特殊色',stars:[3,4,4,5,5]},
{id:'shinyExpedition',cost:100,currency:'shinyEggFragment',name:'闪光远征蛋',text:'保证闪光 · 3★–5★ · 远征限定种族 · 至少2项高区间',stars:[3,4,4,5,5]}
];
function eggUnitsLocal(egg){return egg?(1+(egg.twinChild?1:0)):0}
function totalEggsLocal(state){return eggUnitsLocal(state.egg)+eggUnitsLocal(state.egg2)+(state.eggQueue||[]).reduce((n,e)=>n+eggUnitsLocal(e),0)}
function expeditionEggSpecies(recipe){const all=R()?.G?.SPECIES||[];if(!all.length)return 0;if((recipe.id==='expedition'||recipe.id==='shinyExpedition')&&all.length>18){const pool=all.map((_,i)=>i).filter(i=>i>=18);return rand(pool)}return Math.floor(Math.random()*all.length)}
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
function makeFragmentEgg(recipe){const s=S(),r=R(),e=ensure();if(!s||!r||!e)return false;const currency=recipe.currency||'eggFragment',currencyName=currency==='shinyEggFragment'?'闪光蛋碎片':'蛋碎片',fragments=Math.max(0,Number(e.loot?.[currency])||0);if(fragments<recipe.cost)return r.tell?.(`${currencyName}不足，需要 ${recipe.cost}。`);if(totalEggsLocal(s)>=11)return r.tell?.('孵化巢和等候队列已满（最多 11 枚蛋）。');const star=rand(recipe.stars),species=expeditionEggSpecies(recipe),premium=recipe.id==='expedition'||recipe.id==='shinyExpedition',child=rollFragmentChild(r,s.nextId++,species,star,premium);child.fragmentEgg=true;child.fragmentRecipe=recipe.id;child.tint=Math.floor(Math.random()*6);if(recipe.id==='shinyExpedition'){child.shiny=true;child.locked=true;child.shinyAutoLockDone=true;if(Math.random()<.08)child.specialColor=Math.floor(Math.random()*3)}else if(recipe.id==='expedition'){if(Math.random()<.02){child.shiny=true;child.locked=true;child.shinyAutoLockDone=true}if(Math.random()<.08)child.specialColor=Math.floor(Math.random()*3)}r.ensureMonsterSystemsMonster?.(child,Date.now());const vals=r.G.stats(child)||[],floor=fragmentStatFloor(star),top=fragmentTop20Floor(star),topCount=vals.filter(v=>Number(v)>=top).length;if(vals.some(v=>Number(v)<floor)||(premium&&topCount<2)){console.warn('Fragment egg stat guarantee fallback used',{star,floor,top,vals,recipe:recipe.id})}const now=Date.now(),seconds=star===1?15:(22+star*12),duration=seconds*1000,egg={child,start:null,ready:null,base:star,chance:0,incubationDuration:duration,queuedAt:now,source:'eggFragment',recipe:recipe.id};if(!s.egg){egg.start=now;egg.ready=now+duration;egg.queuedAt=null;s.egg=egg}else if(Number(s.hatchSlots)>=2&&!s.egg2){egg.start=now;egg.ready=now+duration;egg.queuedAt=null;s.egg2=egg}else{if(!Array.isArray(s.eggQueue))s.eggQueue=[];s.eggQueue.push(egg)}e.loot[currency]=fragments-recipe.cost;save(`${recipe.name} 已制作：${'★'.repeat(star)} ${r.G.SPECIES?.[species]?.name||'怪物'}蛋 · 五维保底 ${floor}+${premium?` · 至少2项 ${top}+`:''}${child.shiny?' · 闪光！':''}${child.specialColor!=null?' · 特殊色！':''}`);return true}
function eggWorkshopHTML(e){const f=Math.max(0,Number(e.loot?.eggFragment)||0),sf=Math.max(0,Number(e.loot?.shinyEggFragment)||0),available=x=>Math.max(0,Number(e.loot?.[x.currency||'eggFragment'])||0),eggs=totalEggsLocal(S()),full=eggs>=11;return `<section class="rg-panel"><div class="rg-title"><div><b>蛋碎片工坊</b><small>消耗永久蛋碎片直接制作怪物蛋；蛋会进入现有孵化巢/等候队列</small></div><span class="rg-materials">基础碎片 ${f} · 闪光碎片 ${sf} · 蛋位 ${eggs}/11${full?' · 已满':''}</span></div><div class="rg-final" style="margin-top:8px">${EGG_FRAGMENT_RECIPES.map(x=>`<button class="secondary rg-relic" data-rg-craft-egg="${x.id}" ${available(x)>=x.cost?'':'disabled'}><b>${x.name} · ${x.cost}${x.currency==='shinyEggFragment'?'闪光碎片':'碎片'}</b><span>${x.text}${full?' · 当前蛋位已满，点击会提示':''}</span></button>`).join('')}</div><p class="rg-note">${full?'<b>当前孵化巢/等候队列已满（11/11）。</b> 先领取或孵化一枚蛋后即可制作；按钮保持可点击以显示原因。<br>':''}<b>碎片蛋五维保底：</b>1★ 50–100 · 2★ 100–200 · 3★ 200–300 · 4★ 300–400 · 5★ 400–500。五项能力分别保底。<br><b>远征秘藏蛋：</b>至少 2 项进入本星级最高20%，并使用远征限定种族池；2%闪光、8%特殊色。<br><b>闪光远征蛋：</b>消耗100闪光碎片，保证闪光，3★–5★，使用远征限定种族池并至少2项进入本星级最高20%。</p></section>`}
function monsterName(m){return R()?.name?.(m)||R()?.G?.SPECIES?.[m.species]?.name||('怪物 #'+m.id)}
function ranchStats(m){return R()?.G?.stats?.(m)||[0,0,0,0,0]}
function speciesBattleMultipliers(m){const base=R()?.G?.SPECIES?.[m.species]?.base||[1,1,1,1,1],den=[44,18,18,20,20];return base.map((v,i)=>1+.25*Math.max(0,Math.min(1,(Number(v)||0)/den[i])))}
function expeditionTraitFor(m){if(m?.expeditionTrait&&Number.isInteger(Number(m.expeditionTrait.stat))&&Number(m.expeditionTrait.flat)>0)return m.expeditionTrait;const base=R()?.G?.SPECIES?.[m?.species]?.base||[1,1,1,1,1],den=[44,18,18,20,20],score=base.map((v,i)=>(Number(v)||0)/den[i]);let stat=0;for(let i=1;i<5;i++)if(score[i]>score[stat])stat=i;const names=['体魄突破','猛攻突破','铁壁突破','疾速突破','幸运突破'];return{stat,flat:40,name:names[stat]}}
function expeditionStats(m){const base=ranchStats(m),mul=speciesBattleMultipliers(m),trait=expeditionTraitFor(m),shiny=m?.shiny?1.05:1;return base.map((v,i)=>Math.round((((Number(v)||0)*(mul[i]||1)+(Number(trait.stat)===i?Number(trait.flat)||0:0))*shiny)*100)/100)}
function fmt2(v){const n=Math.round((Number(v)||0)*100)/100;return Number.isInteger(n)?String(n):String(n).replace(/(\.\d*?[1-9])0+$|\.0+$/, '$1')}
function st(m){return expeditionStats(m)} function stars(m){return R()?.G?.stars?.(m.star)||'★'.repeat(m.star||1)}
function expeditionBox(){return ensure()?.box||[]}
const EXPEDITION_REST_MS=30*60*1000;
function maxLifeOf(m){return Math.max(1,Number(m?.maxLife)||20)}
function syncExpeditionRest(m,now=Date.now()){if(!m)return 0;const max=maxLifeOf(m);m.life=Math.max(0,Math.min(max,Number(m.life)||0));if(m.life>=max){m.expeditionRestAt=null;return m.life}if(!Number(m.expeditionRestAt))m.expeditionRestAt=now;const elapsed=Math.max(0,now-Number(m.expeditionRestAt)),gain=Math.floor(elapsed/EXPEDITION_REST_MS);if(gain>0){m.life=Math.min(max,m.life+gain);m.expeditionRestAt=Number(m.expeditionRestAt)+gain*EXPEDITION_REST_MS;if(m.life>=max)m.expeditionRestAt=null}return m.life}
function startExpeditionRest(m,now=Date.now()){if(!m)return;if((Number(m.life)||0)<maxLifeOf(m)&&!Number(m.expeditionRestAt))m.expeditionRestAt=now}
function expeditionRestText(m,now=Date.now()){syncExpeditionRest(m,now);const life=Math.max(0,Number(m.life)||0),max=maxLifeOf(m);if(life>=max)return `生命 ${life}/${max} · 已休息完成`;const base=Number(m.expeditionRestAt)||now,next=Math.max(0,EXPEDITION_REST_MS-(now-base)),need=Math.max(0,max-life),full=Math.max(0,next+(need-1)*EXPEDITION_REST_MS),fmt=ms=>{const sec=Math.max(0,Math.ceil(ms/1000)),h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),ss=sec%60;return h?`${h}小时${m}分${ss}秒`:`${m}分${ss}秒`};return `生命 ${life}/${max} · Rest中 · 下一点 ${fmt(next)} · 满生命 ${fmt(full)}`}
function syncAllExpeditionRest(e=ensure()){for(const m of e?.box||[])syncExpeditionRest(m);return e}
function eligible(zone){const e=syncAllExpeditionRest();if(!e)return[];return (e.box||[]).filter(m=>m&&Number(m.life)>0&&(m.star||1)>=zone.minStar&&(!zone.shinyOnly||m.shiny))}
function recommendScore(m){const v=st(m),total=v.reduce((a,b)=>a+b,0),min=Math.min(...v),top=[...v].sort((a,b)=>b-a).slice(0,2).reduce((a,b)=>a+b,0);return total+min*1.4+top*.2+(m.star||1)*35+(m.shiny?15:0)}
function teamFromIds(ids,allowLegacy=false){const e=ensure(),s=S(),map=new Map((e?.box||[]).map(m=>[m.id,m]));if(allowLegacy)for(const m of s?.monsters||[])if(!map.has(m.id))map.set(m.id,m);return ids.map(id=>map.get(id)).filter(Boolean)}
function team(){return teamFromIds(selected,false)}
function attemptKey(zone,d=selectedDifficulty){return `${zone.id}:d${Math.max(0,Number(d)||0)}`}
function used(e,zone,d=selectedDifficulty){return Math.max(0,Number(e.usedByZone?.[attemptKey(zone,d)])||0)}
function bonusAttempts(e,zone,d=selectedDifficulty){return Math.max(0,Number(e.extraAttempts?.[attemptKey(zone,d)])||0)}
function freeRemain(e,zone,d=selectedDifficulty){return Math.max(0,zone.attempts-used(e,zone,d))}
function totalRemain(e,zone,d=selectedDifficulty){return freeRemain(e,zone,d)+bonusAttempts(e,zone,d)}
function buyAttemptPotion(){const s=S(),e=ensure();if(!s||!e)return;const price=100000;if((Number(s.energy)||0)<price)return R()?.tell?.('灵能不足，需要 100,000。');s.energy-=price;e.attemptPotions=(e.attemptPotions||0)+1;save('购买远征次数回复药水 ×1。')}
function useAttemptPotion(){const e=ensure(),zone=z(),k=attemptKey(zone);if(!e)return;if((e.attemptPotions||0)<=0)return R()?.tell?.('没有远征次数回复药水。');e.attemptPotions--;e.extraAttempts[k]=bonusAttempts(e,zone)+1;save(`${zone.label} · ${diff().label} 可用远征次数 +1。`) }
function rand(a){return a[Math.floor(Math.random()*a.length)]} function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function rngControl(run){
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
function relicMods(run){const out={};for(const id of run.relics||[]){const x=RELICS.find(r=>r.id===id);for(const [k,v] of Object.entries(x?.mods||{}))out[k]=(out[k]||0)+v}return out}
function ensureRunMeta(run){if(!run.items)run.items={};if(!run.curses)run.curses=[];if(!run.curseValues)run.curseValues={};if(!run.nextBattleMods)run.nextBattleMods={};if(!run.templeMods)run.templeMods={};if(!run.trainingMods)run.trainingMods={};if(!Number.isFinite(Number(run.templeBuffCount)))run.templeBuffCount=0;if(!Number.isFinite(Number(run.nextBattleBuffCount)))run.nextBattleBuffCount=0;return run}
function positiveBuffCount(run){ensureRunMeta(run);return Math.max(0,Number(run.templeBuffCount)||0)+Math.max(0,Number(run.nextBattleBuffCount)||0)}
function combatMods(run){ensureRunMeta(run);const out=relicMods(run);for(const [k,v] of Object.entries(run.templeMods||{}))out[k]=(out[k]||0)+v;for(const [k,v] of Object.entries(run.nextBattleMods||{}))out[k]=(out[k]||0)+v;for(const id of run.curses||[]){const rv=rolledCurse(run,id);for(const k of ['atk','def','spd','luck']){const v=Number(rv[k]||0);if(v)out[k]=(out[k]||0)-v}}return out}
function grantRunItem(run,id){ensureRunMeta(run);run.items[id]=(run.items[id]||0)+1;return RUN_ITEMS.find(x=>x.id===id)}
function curseText(run,c){
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
function useRunItem(id){const run=ensure()?.rogueActive;if(!run)return;ensureRunMeta(run);if((run.items[id]||0)<=0)return R()?.tell?.('这个道具已经没有了。');if(run.phase==='battleResult')return R()?.tell?.('战斗结算中不能使用道具。');const it=RUN_ITEMS.find(x=>x.id===id);if(!it)return;let used=false;if(it.heal){for(const mid of run.teamIds){if(hpPct(run,mid)>0&&canReviveInRun(run,mid))run.hp[mid]=Math.min(100,hpPct(run,mid)+it.heal*100)}run.log.push(`使用 ${it.name}：仍站立队员恢复 ${Math.round(it.heal*100)}% HP（倒下队员不会复活）。`);used=true}if(it.supply){run.supply=Math.min(9,run.supply+it.supply);run.log.push(`补给 +${it.supply}。`);used=true}if(it.kind==='cleanse'){const count=Math.min(run.curses.length,Number(it.cleanse)||1);if(count<=0)return R()?.tell?.('当前没有 Debuff。');const goneIds=run.curses.splice(0,count);const gone=goneIds.map(cid=>{const n=CURSES.find(x=>x.id===cid)?.name||cid;delete run.curseValues?.[cid];return n});run.log.push(`使用 ${it.name}：移除 ${gone.join('、')}。`);used=true}if(it.mods){for(const [k,v] of Object.entries(it.mods))run.nextBattleMods[k]=(run.nextBattleMods[k]||0)+v;run.nextBattleBuffCount=(Number(run.nextBattleBuffCount)||0)+1;run.log.push(`使用 ${it.name}：下一场战斗增益已准备。`);used=true}if(!used)return;run.items[id]--;save()}
function runInventoryHTML(run){ensureRunMeta(run);const items=RUN_ITEMS.filter(x=>(run.items[x.id]||0)>0);const curses=(run.curses||[]).map(id=>CURSES.find(x=>x.id===id)).filter(Boolean);const buffs=Object.entries(run.nextBattleMods||{}).filter(([,v])=>v).map(([k,v])=>`${({atk:'攻击',def:'防御',spd:'速度',luck:'幸运'})[k]||k} ${v>0?'+':''}${Math.round(v*100)}%`);return `<section class="rg-panel"><div class="rg-title"><div><b>本局道具 / 状态</b><small>消耗品只在本次远征使用；战斗增益在下一场战斗后消失</small></div></div><div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:7px">${items.length?items.map(it=>`<button class="secondary" data-rg-item="${it.id}"><b>${it.name} ×${run.items[it.id]}</b><small>${it.text}</small></button>`).join(''):'<span class="rg-note">暂无可用道具</span>'}</div>${buffs.length?`<p class="rg-note"><b>下一战增益：</b>${buffs.join(' · ')}</p>`:''}${curses.length?`<p class="rg-danger"><b>Debuff：</b>${curses.map(c=>`${c.name}（${curseText(run,c)}）`).join(' · ')}</p>`:'<p class="rg-note">Debuff：无</p>'}</section>`}
function weightedUtilityNode(exclude=[]){
  const pool=[
    ['challenge',24],['treasure',20],['elite',18],['training',10],['rest',7],['temple',5]
  ].filter(([type])=>!exclude.includes(type));
  const total=pool.reduce((a,[,w])=>a+w,0),roll=Math.random()*total;
  let acc=0;for(const [type,w] of pool){acc+=w;if(roll<=acc)return type}return pool[0]?.[0]||'challenge';
}
function makeOptions(stage){
  if(stage%9===8)return[{type:'boss'}];
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
function injectStyle(){if(document.getElementById('qinster-v199-style'))return;const x=document.createElement('style');x.id='qinster-v199-style';x.textContent=`#expedition-page{max-width:1220px;margin:0 auto}.rogue{display:grid;gap:10px}.rg-panel{background:#c9c8cd;border:3px solid #57535e;box-shadow:inset 0 0 0 2px #aaa7af;padding:11px}.rg-title{display:flex;justify-content:space-between;align-items:center;gap:9px}.rg-title small{display:block;font-size:9px;margin-top:3px;color:#625e68}.rg-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}.rg-tabs button{text-align:left;min-height:58px}.rg-tabs .on{background:#df3d36;color:#fff}.rg-grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.rg-select select{width:100%}.rg-card{background:#dedde0;border:2px solid #85818b;padding:9px}.rg-card b,.rg-card small{display:block}.rg-card small{font-size:9px;margin-top:4px}.rg-route{display:grid;grid-template-columns:repeat(9,1fr);gap:5px;align-items:center}.rg-route span{height:28px;display:grid;place-items:center;background:#aaa8ae;border:2px solid #77727f;font-size:9px}.rg-route .done{background:#91b487}.rg-route .now{background:#f2c451}.rg-status{display:flex;gap:7px;flex-wrap:wrap}.rg-earned{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:7px;padding:7px;background:#252832;border:2px solid #66616c;color:#eee}.rg-earned>b{color:#f2c451;margin-right:4px}.rg-earned span{background:#343844;border:1px solid #626876;padding:4px 6px;font-size:9px}.rg-status span{background:#302d36;color:#fff1b5;border:2px solid #716d77;padding:6px 8px;font-size:9px}.rg-nodes{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.rg-node{position:relative;min-height:106px;text-align:left;padding:12px 38px 12px 12px;border:3px solid #5d5964;background:linear-gradient(135deg,#e4e2e7,#c8c5ce);overflow:hidden;display:grid;grid-template-columns:48px 1fr;gap:10px;align-items:center;transition:transform .12s ease,filter .12s ease}.rg-node:hover{filter:brightness(1.05);transform:translateY(-1px)}.rg-node-icon{width:46px;height:46px;display:grid;place-items:center;font-size:25px;font-weight:900;background:#2d2a33;color:#fff4bd;border:2px solid #77727f;box-shadow:2px 2px 0 #3f3b45}.rg-node-copy b{display:block;margin:0 0 5px;font-size:14px}.rg-node-copy small{font-size:9px;line-height:1.45}.rg-node-arrow{position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:28px;font-weight:900;opacity:.55}.rg-node-battle{border-left:7px solid #b33c35;background:linear-gradient(135deg,#ead8d6,#c9b7b7)}.rg-node-elite{border-left:7px solid #6b2d71;background:linear-gradient(135deg,#e5d8e8,#c5b5ca)}.rg-node-treasure{border-left:7px solid #c5962d;background:linear-gradient(135deg,#eee2bd,#cfc19c)}.rg-node-training{border-left:7px solid #3f7a68;background:linear-gradient(135deg,#d7e8e1,#b7cfc6)}.rg-node-rest{border-left:7px solid #5a7e4c;background:linear-gradient(135deg,#dce9d6,#bccdb4)}.rg-node-challenge{border-left:7px solid #4c668f;background:linear-gradient(135deg,#d9e0eb,#b9c3d2)}.rg-node-temple{border-left:7px solid #8a6840;background:linear-gradient(135deg,#e8dfd1,#c8bba8)}.rg-node-boss{border-left:7px solid #9b2520;background:linear-gradient(135deg,#ead1cf,#c8a6a4);box-shadow:inset 0 0 0 2px #9b2520}.rg-node-boss .rg-node-icon{background:#7f211d;color:#ffe49a}.rg-training-panel{background:linear-gradient(180deg,#cbcbd0,#bebfc3)}.rg-training-picks{align-items:stretch}.rg-training-choice{min-height:96px;display:grid;grid-template-columns:72px 1fr;gap:10px;align-items:center;text-align:left;padding:8px 10px;background:linear-gradient(135deg,#e0e1df,#c7cbc6);border:3px solid #697068}.rg-training-choice:hover{background:linear-gradient(135deg,#e8eee7,#cbd7cd)}.rg-training-sprite{display:grid;place-items:center;min-height:72px;background:#bfc8bd;border:2px solid #747a72}.rg-training-sprite .sprite{width:62px!important;margin:auto}.rg-training-copy{display:grid;gap:3px;min-width:0}.rg-training-copy b{font-size:12px}.rg-training-copy small{font-size:9px;color:#555}.rg-training-copy strong{font-size:18px;color:#2f6d3d}.rg-training-result{display:block;margin-top:5px;padding:4px 6px;background:#eef2e9;border:1px solid #899781;color:#30382d;font-style:normal;font-size:10px}.rg-training-result b{display:inline!important;color:#2f6d3d!important;font-size:12px}.rg-training-roll{display:block!important;margin-top:3px!important;color:#6b6258!important;font-size:8px!important}.rg-training-copy em{font-style:normal;font-size:8px;color:#6d6252}@media(max-width:760px){.rg-node{grid-template-columns:42px 1fr;min-height:88px}.rg-node-icon{width:40px;height:40px;font-size:21px}.rg-training-choice{grid-template-columns:62px 1fr}.rg-training-sprite{min-height:62px}.rg-training-sprite .sprite{width:54px!important}}.rg-team{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.rg-mon{background:#d9d8dc;border:2px solid #85818b;padding:8px;text-align:center;min-width:0}.rg-mon .sprite{width:58px!important;margin:auto}.rg-hp{height:10px;background:#77727f;border:1px solid #514d57;margin-top:5px}.rg-hp i{display:block;height:100%;background:#6da65d}.rg-formation{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.rg-pos{padding:5px;text-align:center;font-size:9px;background:#eee;border:1px solid #8a8690}.rg-battle{display:grid;grid-template-columns:1fr 110px 1fr;gap:12px;align-items:center}.rg-enemy-team{align-items:stretch}.rg-enemy-match{position:relative}.rg-enemy-elite{border-color:#725080;background:#d8cddd}.rg-enemy-boss{border-color:#9b2520;background:#ddc0bd;box-shadow:inset 0 0 0 2px #9b2520}.rg-enemy-final-title{display:block;margin-top:5px;color:#8d2d28;font-size:10px}.rg-enemy-final-stats{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:3px;margin:5px 0}.rg-enemy-final-stats i{font-style:normal;background:#252832;color:#fff;border:1px solid #66616c;padding:3px 2px}.rg-enemy-final-stats i small,.rg-enemy-final-stats i b{display:block!important}.rg-enemy-final-stats i small{font-size:7px;color:#bbb}.rg-enemy-final-stats i b{font-size:10px;color:#f2c451}.rg-vs{text-align:center;font-size:28px;font-weight:900}.rg-enemy{text-align:center;background:#3b3743;color:#fff;padding:12px;border:3px solid #1e1c23}.rg-log{max-height:150px;overflow:auto;background:#302d36;color:#eee;padding:8px;font-size:9px;line-height:1.6}.rg-relics,.rg-final{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.rg-relic{min-height:94px;text-align:left}.rg-relic b{display:block;color:#8d2d28;margin-bottom:4px}.rg-relic-tray{display:flex;gap:7px;flex-wrap:wrap;margin:8px 0}.rg-relic-chip{position:relative;display:inline-grid;place-items:center;width:64px;height:64px;background:#20232b;border:2px solid #77727f;box-shadow:2px 2px 0 #4e4a54;image-rendering:pixelated}.rg-relic-chip.small{width:54px;height:54px}.rg-relic-icon{display:block;width:56px;height:56px;max-width:none;object-fit:contain;background:none;image-rendering:pixelated;pointer-events:none}.rg-relic-chip.small .rg-relic-icon{width:48px;height:48px;transform:none}.rg-relic-count{position:absolute;right:-5px;top:-6px;background:#f2c451!important;color:#211e25!important;border:2px solid #514d57;padding:1px 4px!important;font-size:9px!important;z-index:3}.rg-relic-chip em{display:none;position:fixed;z-index:120;left:var(--relic-tip-left,12px);top:var(--relic-tip-top,80px);transform:none;width:230px;background:#171a21;color:#eee;border:2px solid #686270;padding:8px;text-align:left;font-style:normal;box-shadow:3px 3px 0 #000}.rg-relic-chip:focus-visible em,.rg-relic-chip.open em{display:grid;gap:4px}@media(hover:hover){.rg-relic-chip:hover em{display:grid;gap:4px}}.rg-relic-chip{cursor:pointer;flex-shrink:0}.rg-relic-chip:focus-visible{outline:3px solid #f2c451}.rg-relic-chip em{pointer-events:none}.rg-relic-chip em strong{color:#f2c451}.rg-relic-chip em span,.rg-relic-chip em small{font-size:9px;line-height:1.5}.rg-relic-card{display:grid;grid-template-columns:70px 1fr;grid-template-rows:auto auto;column-gap:8px;align-items:center}.rg-relic-card>.rg-relic-chip{grid-row:1/3}.rg-relic-card>b,.rg-relic-card>span{text-align:left}.rg-relic-card .rg-relic-chip em{pointer-events:none}@media(max-width:760px){.rg-relic-chip em{position:fixed;left:12px;right:12px;bottom:14px;top:auto;transform:none;width:auto;z-index:9999}.rg-relic-card{grid-template-columns:64px 1fr}}.rg-event-picks{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.rg-event-pick{display:grid;gap:4px;text-align:left}.rg-event-odds{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;margin-top:4px}.rg-event-odds i{font-style:normal;background:#222630;color:#dfe5ef;border:1px solid #596171;padding:4px;font-size:9px;line-height:1.35}.rg-event-odds strong{display:block;color:#f2c451;font-size:10px}@media(max-width:760px){.rg-event-odds{grid-template-columns:1fr}.rg-event-odds i{display:flex;justify-content:space-between;align-items:center}.rg-event-odds strong{display:inline}}.rg-mainbtn{width:100%;padding:12px}.rg-battle-next-wrap{position:sticky;bottom:8px;z-index:70;padding:4px 0 7px;background:linear-gradient(180deg,rgba(201,200,205,0),#c9c8cd 28%)}.rg-battle-next-sticky{box-shadow:0 3px 0 #7d241f,0 0 0 2px rgba(255,255,255,.22);font-size:13px;font-weight:900}.rg-materials{font-size:9px}.rg-note{font-size:10px;line-height:1.6;color:#4f4b55}.rg-danger{color:#9a2b25;font-weight:900}@media(max-width:760px){.rg-tabs,.rg-grid3,.rg-nodes,.rg-team,.rg-relics,.rg-final,.rg-event-picks{grid-template-columns:1fr}.rg-battle{grid-template-columns:1fr}.rg-vs{font-size:16px}.rg-route{grid-template-columns:repeat(9,28px);overflow-x:auto}.rg-title{display:grid}}`;document.head.appendChild(x)}
function hpPct(run,id){return Math.max(0,Math.min(100,Number(run.hp?.[id])||0))}
function monCard(m,run,i){const hp=hpPct(run,m.id),pos=['前卫','中卫','后卫'][i],bs=battleSkillFor(m);return `<div class="rg-mon rg-ally-mon">${R()?.sprite?.(m.species,m.tint,m.shiny,m.specialColor)||''}<b>${monsterName(m)} ${stars(m)}${m.shiny?' ✦':''}</b><small>${pos} · 点击能力值可查看加成 / 削减来源</small>${finalStatsHTML(m,i,run)}<small style="color:#6d2a73">战斗技能：${bs.name} · ${bs.text}</small><div class="rg-position-picks" style="display:grid;grid-template-columns:repeat(3,1fr);gap:3px;margin:5px 0">${['前卫','中卫','后卫'].map((name,j)=>`<button type="button" class="secondary ${i===j?'on':''}" data-rg-set-position="${j}" data-rg-monster-id="${m.id}" ${i===j?'disabled':''} style="padding:4px 2px;font-size:10px">${name}</button>`).join('')}</div><div class="rg-hp"><i style="width:${hp}%"></i></div><small>远征生命 ${Math.round(hp)}% · 牧场生命 ${Math.max(0,Number(m.life)||0)}${run.knockouts?.[m.id]?' · 本局倒下 '+run.knockouts[m.id]+'次':''}${run.permaDead?.[m.id]?' · 已死亡':''}</small></div>`}
function routeBar(run){let h='',base=(floorNo(run.stage)-1)*9;for(let j=0;j<9;j++){const i=base+j,label=j===8?'BOSS':(j+1);h+=`<span class="${i<run.stage?'done':i===run.stage?'now':''}">${label}</span>`}return `<div class="rg-route">${h}</div>`}
function activeTeam(run){return teamFromIds(run.teamIds)}
function startRun(){const e=syncAllExpeditionRest(),zone=z(),t=team(),d=diff();if(!e)return;if(selectedDifficulty>(e.difficultyUnlocked?.[zone.id]||0))return R()?.tell?.('这个难度还没有解锁。');if(t.length!==3)return R()?.tell?.('需要选择 3 只怪物。');if(new Set(t.map(m=>m.id)).size!==3)return R()?.tell?.('不能重复选择同一只怪物。');if(t.some(m=>syncExpeditionRest(m)<=0))return R()?.tell?.('队伍中有怪物正在Rest，至少恢复1生命后才能远征。');if(zone.shinyOnly&&t.some(m=>!m.shiny))return R()?.tell?.('闪光远征只允许闪光怪物参加。');if(totalRemain(e,zone)<=0)return R()?.tell?.('这个地图与难度今天的免费次数已用完；可使用远征次数回复药水继续。');const k=attemptKey(zone);if(freeRemain(e,zone)>0)e.usedByZone[k]=used(e,zone)+1;else e.extraAttempts[k]=Math.max(0,bonusAttempts(e,zone)-1);e.lastZone=zone.id;e.lastDifficulty=selectedDifficulty;e.lastTeamIds=t.map(m=>m.id);const hp={};for(const m of t){hp[m.id]=100;m.life=Math.max(0,(Number(m.life)||0)-1);startExpeditionRest(m)}e.rogueActive={zone:zone.id,difficulty:selectedDifficulty,teamIds:t.map(m=>m.id),stage:0,maxStage:27,hp,supply:5,relics:[],energy:0,tempBadges:0,materials:{relicDust:0,starCrystal:0,eggFragment:0},options:makeOptions(0),phase:'map',log:[`${zone.label} · ${d.label} 开始。每只参战怪物消耗1生命；生命会每30分钟恢复1点。`],startedAt:Date.now(),formation:0,items:{},curses:[],nextBattleMods:{},bossCount:0,score:0,kills:{normal:0,elite:0,boss:0}};save(`${zone.label} · ${d.label} 开始：参战怪物各消耗1生命。`)}
function rotateFormation(run){run.teamIds.push(run.teamIds.shift());save('已调整阵型。')}
function setFormationPosition(run,id,target){if(!run||!Array.isArray(run.teamIds))return;id=Number(id);target=Math.max(0,Math.min(2,Number(target)||0));const from=run.teamIds.findIndex(x=>Number(x)===id);if(from<0||from===target)return;[run.teamIds[from],run.teamIds[target]]=[run.teamIds[target],run.teamIds[from]];save(`${monsterName(persistentMonster(id))} 已调整为${['前卫','中卫','后卫'][target]}。`)}
function floorRewardBonus(stage){return Math.max(0,floorNo(stage)-3)*.05}
function nodeRewardScale(zone,stage){const run=ensure()?.rogueActive,d=diff(run?.difficulty??selectedDifficulty);return zone.reward*d.reward*(1+floorRewardBonus(stage))}
function persistentMonster(id){const e=ensure(),s=S();return (e?.box||[]).find(m=>m.id===id)||(s?.monsters||[]).find(m=>m.id===id)||null}
function expeditionKnockout(run,m,logs=[]){if(!m)return;run.knockouts=run.knockouts||{};run.knockouts[m.id]=(run.knockouts[m.id]||0)+1;run.hp[m.id]=0;logs.push(`${monsterName(m)} 本场远征HP归0，已倒下；不会因此直接死亡，可在营地复活。`)}
function canReviveInRun(run,id){const m=persistentMonster(id);return !!m&&!run.permaDead?.[id]}
function tryPhoenixRevive(run,m,logs=[],reason=''){if(!run||!m||hpPct(run,m.id)>0||!canReviveInRun(run,m.id))return false;const max=Math.max(0,Math.floor(Number(relicMods(run).autoReviveCharges)||0)),used=Math.max(0,Math.floor(Number(run.autoReviveUsed)||0));if(used>=max)return false;run.autoReviveUsed=used+1;run.hp[m.id]=50;logs.push(`${monsterName(m)} ${reason?reason+'':''}触发复苏核心，恢复至 50% 最大HP（本次远征剩余复苏 ${Math.max(0,max-run.autoReviveUsed)} 次）。`);return true}
function applyRest(run){const mods=relicMods(run),heal=30+(mods.rest||0)*100;run.campHeal=Math.round(heal);run.campRevived=false;for(const id of run.teamIds){if(hpPct(run,id)>0&&canReviveInRun(run,id))run.hp[id]=Math.min(100,hpPct(run,id)+heal);else if(!canReviveInRun(run,id))run.hp[id]=0}run.log.push(`营地：仍站立队员恢复 ${Math.round(heal)}%。倒下队员可在这里选择复活。`);run.phase='camp';save()}
function campRevive(run,id){if(run.phase!=='camp'||run.campRevived)return;const m=persistentMonster(id);if(!m||hpPct(run,id)>0||!canReviveInRun(run,id))return;run.hp[id]=30;run.campRevived=true;run.log.push(`营地复活：${monsterName(m)} 恢复至 30% 远征HP。`);save(`${monsterName(m)} 已在营地复活。`)}
function leaveCamp(run){run.campHeal=0;run.campRevived=false;advance(run)}
function treasure(run){const zone=z(run.zone),mods=relicMods(run),base=Math.round(400*nodeRewardScale(zone,run.stage)*(1+(mods.chest||0)));run.energy+=base;const r=Math.random();let got='',materialKey='';if(r<.45){run.materials.relicDust++;got='遗物尘';materialKey='relicDust'}else if(r<.82){run.materials.starCrystal++;got='星辉结晶';materialKey='starCrystal'}else{run.tempBadges++;got='远征徽章';materialKey='badge'}const result={energy:base,material:got,materialKey,count:1,item:null,relic:false};run.log.push(`宝箱：+${base} 灵能，并获得 ${got} ×1。`);if(Math.random()<.55){const it=grantRunItem(run,rand(RUN_ITEMS).id);result.item=it.name;run.log.push(`发现远征道具：${it.name} ×1。`)}result.relic=Math.random()<.45;run.treasureResult=result;run.phase='treasureResult';save('宝箱已开启！')}
function continueTreasure(run){const r=run.treasureResult||{};run.treasureResult=null;if(r.relic)offerRelic(run);else advance(run)}
function treasureResultHTML(run){const r=run.treasureResult||{};const item=r.item?`<span>远征道具：${r.item} ×1</span>`:'';const relic=r.relic?'<span>✦ 发现遗物：继续后进入遗物三选一</span>':'';return `${runHeader(run)}${runInventoryHTML(run)}<section class="rg-panel rg-treasure-result"><div class="rg-title"><div><b>▣ 宝箱获得</b><small>奖励已经加入本次远征；宝箱不会掉落任何蛋碎片</small></div></div><div class="rg-earned rg-treasure-earned"><span>灵能 +${Math.round(r.energy||0)}</span><span>${r.material||'奖励'} ×${r.count||1}</span>${item}${relic}</div><button class="primary rg-mainbtn" data-rg-treasure-next>收下奖励并继续</button></section>`}


function templeChoiceCount(run){return Math.min(6,3+Math.max(0,Math.round(Number(relicMods(run).templeChoices)||0)))}
function templeGainMultiplier(run){return Math.max(1,1+Number(relicMods(run).templeGain||0))}
function makeTempleChoices(run){
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
function temple(run){ensureRunMeta(run);run.templeChoices=makeTempleChoices(run);run.phase='temple';save()}
function chooseTemple(run,i){
  ensureRunMeta(run);const x=run.templeChoices?.[i];if(!x)return;let text='';
  if(x.kind==='buff'||x.kind==='risky'){
    run.templeBuffCount=(Number(run.templeBuffCount)||0)+1;
    for(const [k,v] of Object.entries(x.mods||{}))run.templeMods[k]=(run.templeMods[k]||0)+v;
    text=Object.entries(x.mods||{}).map(([k,v])=>`${({atk:'攻击',def:'防御',spd:'速度',luck:'幸运'})[k]} +${Math.round(v*1000)/10}%`).join('、');
  }
  if(x.kind==='cleanse'){
    const goneIds=run.curses.splice(0,Math.min(run.curses.length,x.count||1));const gone=goneIds.map(id=>{const n=CURSES.find(c=>c.id===id)?.name||id;delete run.curseValues?.[id];return n});text=gone.length?'移除 Debuff：'+gone.join('、'):'当前没有 Debuff，祷言化为保护';
  }
  if(x.kind==='heal'){
    for(const id of run.teamIds||[])if(hpPct(run,id)>0&&canReviveInRun(run,id))run.hp[id]=Math.min(100,hpPct(run,id)+x.heal*100);text=`仍站立队员恢复 ${Math.round(x.heal*100)}% 远征HP`;
  }
  if(x.kind==='risky'&&x.curse){const pool=CURSES.filter(c=>!run.curses.includes(c.id));if(pool.length){const c=inflictCurse(run,rand(pool).id,[]);if(c)text+=`；代价：${c.name}（${curseText(run,c)}）`;}}
  run.templeResult={good:x.kind!=='risky',title:x.title,text};run.templeChoices=[];run.phase='templeResult';run.log.push(`神庙：选择【${x.title}】。${text}`);save();
}
function challenge(run){const c=rand(CHALLENGES);run.challenge={...c};run.phase='challenge';save()}
function resolveChallenge(run,memberIndex){const t=activeTeam(run),m=t[memberIndex],c=run.challenge;if(!m||!c)return;const zone=z(run.zone),mods=relicMods(run),v=st(m)[c.stat],bonus=c.stat===4?(mods.luck||0)*v:c.stat===3?(mods.spd||0)*v:c.stat===2?(mods.def||0)*v:c.stat===1?(mods.atk||0)*v:0,target=70+zone.tier*58+run.stage*12,p=Math.max(.18,Math.min(.92,.52+(v+bonus-target)/Math.max(100,target)*.62));const success=Math.random()<p;let lines=[],after='advance';if(success){const gain=Math.round(300*nodeRewardScale(zone,run.stage));run.energy+=gain;lines.push(`事件成功：${monsterName(m)} 用${STAT[c.stat]}通过判定，+${gain} 灵能。`);if(Math.random()<.30){const it=grantRunItem(run,rand(RUN_ITEMS).id);lines.push(`额外发现：${it.name} ×1。`)}if(Math.random()<.35)after='relic'}else{run.supply=Math.max(0,run.supply-1);run.hp[m.id]=Math.max(1,hpPct(run,m.id)-18);lines.push(`事件失败：${monsterName(m)} 受伤 18%，补给 -1。`);if(Math.random()<.55){const pool=CURSES.filter(x=>!run.curses?.includes(x.id));if(pool.length){const before=run.log.length;inflictCurse(run,rand(pool).id,lines)}}}run.log.push(...lines);run.challengeResult={success,memberId:m.id,memberName:monsterName(m),stat:STAT[c.stat],value:Math.round(v+bonus),baseValue:v,target,chance:Math.round(p*100),title:c.title,lines,after};run.phase='challengeResult';save(success?'特殊事件成功！':'特殊事件失败。')}
function trainingEntry(run,id){
  ensureRunMeta(run);const k=String(id);if(!run.trainingMods[k])run.trainingMods[k]={flat:[0,0,0,0,0],pct:[0,0,0,0,0]};return run.trainingMods[k];
}
function trainingGainMultiplier(run){
  const rel=relicMods(run);let curse=0;if((run.curses||[]).includes('trainingFatigue'))curse-=Number(rolledCurse(run,'trainingFatigue').trainingGain||.01);
  return Math.max(.25,1+Number(rel.trainingGain||0)+curse);
}
function trainingChoiceCount(run){return Math.min(6,3+Math.max(0,Math.round(Number(relicMods(run).trainingChoices)||0)))}
function trainedBaseStats(m,run){
  const base=st(m),tr=trainingEntry(run,m.id);return base.map((v,i)=>(Number(v)||0)*(1+(Number(tr.pct?.[i])||0))+(Number(tr.flat?.[i])||0));
}
function makeTrainingChoices(run){
  ensureRunMeta(run);const t=activeTeam(run),count=trainingChoiceCount(run),gain=trainingGainMultiplier(run),out=[],used=new Set();let guard=0;
  while(out.length<count&&guard++<100){
    const m=rand(t);if(!m)break;const stat=Math.floor(Math.random()*5),kind=Math.random()<.5?'pct':'flat',raw=kind==='pct'?(1+Math.floor(Math.random()*5)):(1+Math.floor(Math.random()*20)),key=m.id+':'+stat+':'+kind;
    if(used.has(key))continue;used.add(key);
    const value=kind==='pct'?Math.round(raw*gain*10)/10:Math.max(1,Math.round(raw*gain));
    out.push({monsterId:m.id,monsterName:monsterName(m),stat,kind,raw,value});
  }
  return out;
}
function openTraining(run){ensureRunMeta(run);run.trainingChoices=makeTrainingChoices(run);run.phase='training';save()}
function chooseTraining(run,i){
  const c=run.trainingChoices?.[i];if(!c)return;const tr=trainingEntry(run,c.monsterId);
  if(c.kind==='pct')tr.pct[c.stat]=(Number(tr.pct[c.stat])||0)+c.value/100;else tr.flat[c.stat]=(Number(tr.flat[c.stat])||0)+c.value;
  run.log.push(`训练营：${c.monsterName} ${STAT[c.stat]} +${c.value}${c.kind==='pct'?'%':''}（本次远征永久生效）。`);run.trainingChoices=[];advance(run);
}
function combatValue(m,pos,run){const v=trainedBaseStats(m,run),mods=combatMods(run),meta=metaMods(),sh=m.shiny?(mods.shiny||0):0;let con=Math.max(1,v[0]*(1+(mods.hpMult||0))+(mods.hpFlat||0)),atk=v[1]*(1+(mods.atk||0)+(meta.atk||0)+sh),def=v[2]*(1+(mods.def||0)+(meta.def||0)+sh),spd=v[3]*(1+(mods.spd||0)+(meta.spd||0)),luck=v[4]*(1+(mods.luck||0)+(meta.luck||0)+sh);atk+=con*(mods.atkFromHp||0);if(mods.relicAtkPerRelic)atk*=1+(run.relics||[]).length*Number(mods.relicAtkPerRelic||0);const bc=positiveBuffCount(run);if(bc){atk*=1+bc*Number(mods.atkPerBuff||0);def*=1+bc*Number(mods.defPerBuff||0)}if(mods.missingHpAtkPer10){const missing=Math.max(0,100-hpPct(run,m.id)),steps=Math.min(9,Math.floor(missing/10));atk*=1+steps*(mods.missingHpAtkPer10||0)}if(pos===0){con*=1.25;def*=1.25;def*=1+(mods.frontDef||0);atk*=1+(mods.frontAtk||0)}if(pos===2){atk*=1.25*(1+(mods.backAtk||0));def*=1+(mods.backDef||0)}return{atk,def,spd,luck,con}}
function positionDodgeBonus(pos,mods){return Math.max(0,Number(mods.dodgeBonus)||0)+(pos===2?.25:0)+(pos===0?Math.max(0,Number(mods.frontDodge)||0):pos===2?Math.max(0,Number(mods.backDodge)||0):0)}
function shuffledAttackDigits(value,seed){const n=Math.max(1,Math.round(Number(value)||1)),a=String(n).split('');if(a.length<2)return n;let x=Math.max(1,Math.floor((Number(seed)||.5)*2147483646));for(let i=a.length-1;i>0;i--){x=x*48271%2147483647;const j=x%(i+1);[a[i],a[j]]=[a[j],a[i]]}if(a[0]==='0'){const j=a.findIndex(c=>c!=='0');if(j>0)[a[0],a[j]]=[a[j],a[0]]}let out=Number(a.join(''));if(out===n&&a.length>1){a.push(a.shift());out=Number(a.join(''))}return Math.max(1,out||n)}
function finalStatBreakdown(m,pos,run){
  const base=st(m),snap=run?.phase==='battleResult'?run?.battle?.allyInitialStats?.[m.id]:null,final=snap?{con:Number(snap.con??snap.hp)||0,atk:Number(snap.atk)||0,def:Number(snap.def)||0,spd:Number(snap.spd)||0,luck:Number(snap.luck)||0}:combatValue(m,pos,run),mods=combatMods(run);
  const labels=['HP','攻击','防御','速度','幸运'];
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
    for(const id of run.curses||[]){const c=CURSES.find(x=>x.id===id),x=-Number(rolledCurse(run,id)?.[k]||0);if(x){v+=x;names.push(c.name)}}
    return {v,names};
  };
  return labels.map((label,i)=>{
    const b=Number(base[i])||0,f=Math.round((Number(vals[i])||0)*10)/10,delta=f-b;
    let cls='same';if(delta>.05)cls='up';else if(delta<-.05)cls='down';
    const detail=['原始：'+Math.round(b*10)/10];const tr=trainingEntry(run,m.id),trFlat=Number(tr.flat?.[i]||0),trPct=Number(tr.pct?.[i]||0);if(trFlat)detail.push('训练营固定：+'+Math.round(trFlat*10)/10);if(trPct)detail.push('训练营百分比：+'+Math.round(trPct*1000)/10+'%');
    if(i===0){
      const trained=Number(trainedBaseStats(m,run)[0])||0,hpPctRel=relicContribution('hpMult'),hpFlatRel=relicContribution('hpFlat');
      if(Math.abs(trained-b)>.05)detail.push('训练后HP：'+Math.round(trained*10)/10);
      if(hpPctRel.v)detail.push('HP百分比遗物：'+signedPct(hpPctRel.v)+(hpPctRel.names.length?'（'+hpPctRel.names.join('、')+'）':''));
      if(hpFlatRel.v)detail.push('固定HP遗物：+'+Math.round(hpFlatRel.v*10)/10+(hpFlatRel.names.length?'（'+hpFlatRel.names.join('、')+'）':''));
      if(pos===0)detail.push('前卫站位：HP +25%');
      detail.push('计算：('+Math.round(trained*10)/10+(hpPctRel.v?' × '+(Math.round((1+hpPctRel.v)*1000)/1000):'')+(hpFlatRel.v?' + '+Math.round(hpFlatRel.v*10)/10:'')+')'+(pos===0?' × 1.25':'')+' = '+f);
    }
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
    const stl=document.createElement('style');stl.id='rg-final-stat-style';stl.textContent=`.rg-final-stats{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:2px;margin-top:7px;width:100%;min-width:0}.rg-final-stat{position:relative;background:#242832;border:1px solid #555d6c;color:#e9edf3;padding:4px 1px;text-align:center;box-shadow:none!important;transform:none!important;min-width:0;width:100%;overflow:visible}.rg-final-stat span{display:block;font-size:8px;opacity:.72;white-space:nowrap;overflow:hidden;text-overflow:clip}.rg-final-stat b{display:block;font-size:13px;line-height:1.15;white-space:nowrap}.rg-final-stat small{display:block;font-size:7px;opacity:.62;white-space:nowrap;overflow:hidden}.rg-final-stat.up b{color:#64d887}.rg-final-stat.down b{color:#ff7070}.rg-final-stat em{display:none;position:absolute;z-index:80;left:50%;top:calc(100% + 5px);transform:translateX(-50%);width:210px;background:#171a21;border:2px solid #626b7c;padding:7px;text-align:left;font-style:normal;box-shadow:3px 3px 0 #000}.rg-final-stat:hover em,.rg-final-stat.open em{display:grid;gap:3px}.rg-final-stat em i{font-style:normal;font-size:10px;color:#ddd}.rg-final-stat em i.pos{color:#64d887}.rg-final-stat em i.neg{color:#ff7070}.rg-final-stat em i.total{margin-top:3px;padding-top:4px;border-top:1px solid #596171;color:#fff;font-weight:700}@media(max-width:700px){.rg-final-stats{grid-template-columns:repeat(5,minmax(0,1fr));gap:1px}.rg-final-stat{padding:3px 0}.rg-final-stat b{font-size:12px}.rg-final-stat span,.rg-final-stat small{font-size:7px}.rg-final-stat em{position:fixed;left:12px;right:12px;top:auto;bottom:14px;transform:none;width:auto;z-index:9999}}`;
    document.head.appendChild(stl);
  }
  const groups=[...document.querySelectorAll('#expedition-content .rg-team:not(.rg-enemy-team)')];
  const teamNow=activeTeam(run);
  for(const group of groups){
    const cards=[...group.querySelectorAll(':scope > .rg-mon')];
    if(cards.length!==teamNow.length)continue;
    cards.forEach((card,visualIndex)=>{
      if(card.querySelector('.rg-final-stats'))return;
      const pos=teamNow.length-1-visualIndex,m=teamNow[pos];if(m)card.insertAdjacentHTML('beforeend',finalStatsHTML(m,pos,run));
    });
  }
}
function enemyRoleName(role){return role==='boss'?'区域首领':role==='elite'?'精英守卫':'野外守卫'}
function enemyDifficultyRating(e){return Math.max(1,Math.round((e.maxHp||e.enemyMax||0)*.7+(e.atk||e.enemyAtk||0)*2+(e.def||e.enemyDef||0)*1.3+(e.spd||e.enemySpd||0)*.5+(e.luck||e.enemyLuck||0)*.25))}
function enemyTeamRoles(kind,run){
  const f=floorNo(run?.stage||0),d=diff(run?.difficulty||0),maxCount=Math.max(3,3+Math.floor((f-1)/3));
  const total=1+Math.floor(Math.random()*maxCount),roles=[];
  if(kind==='battle')return Array(total).fill('normal');
  if(kind==='elite'){
    const eliteMax=d.id>=6?2:1,eliteCount=Math.min(total,1+Math.floor(Math.random()*eliteMax));
    for(let i=0;i<eliteCount;i++)roles.push('elite');
    while(roles.length<total)roles.push('normal');
    return roles;
  }
  const bossMax=d.id>=9?2:1,bossCount=Math.min(total,1+Math.floor(Math.random()*bossMax));
  for(let i=0;i<bossCount;i++)roles.push('boss');
  while(roles.length<total)roles.push(d.id>=6&&Math.random()<.35?'elite':'normal');
  return roles;
}
function enemySkillRoll(run,role){
  const d=diff(run?.difficulty||0);if(d.id<4)return null;
  const chance=role==='boss'?.30:role==='elite'?.24:.16;
  if(role==='normal'&&Math.random()>.60)return null;
  const pool=[
    {id:'armorBreak',name:'破甲猛击',type:'single',power:1.25,debuff:{def:-.12},duration:2,chance},
    {id:'drain',name:'吸血撕咬',type:'single',power:1.15,heal:.15,chance},
    {id:'heavy',name:'震荡冲锋',type:'single',power:1.65,chance},
    {id:'slow',name:'迟滞爪击',type:'single',power:1.10,debuff:{spd:-.15},duration:2,chance},
    {id:'sweep',name:'横扫',type:'aoe',power:.72,chance}
  ];
  return rand(pool);
}
function makeEnemyUnit(run,role,index=0,teamSize=1){
  const zone=z(run.zone),d=diff(run.difficulty),stage=Math.max(0,Number(run.stage)||0),floor=floorNo(stage),endlessMul=1+endlessExtra(stage),kindScale=role==='boss'?1.42:role==='elite'?1.20:1;
  const starTier=floor<=1?.52:floor===2?.76:1.00;
  const formationScale=Math.max(.60,1-Math.max(0,teamSize-1)*.06);
  const range=role==='boss'?[.99,1.05]:role==='elite'?[.97,1.04]:[.96,1.04],variance=range[0]+Math.random()*(range[1]-range[0]),mods=d.mods||{},speciesCount=Math.max(1,R()?.G?.SPECIES?.length||1),enemySpecies=Math.floor(Math.random()*speciesCount),affixPool=[{name:'狂暴',mods:{atk:.20}},{name:'铁壁',mods:{def:.25}},{name:'迅捷',mods:{spd:.20}},{name:'强运',mods:{luck:.25}},{name:'巨躯',mods:{hp:.25}},{name:'精准',mods:{atk:.08,luck:.15}}],affixCount=d.id>=10?3:d.id>=7?2:d.id>=4?1:0,affixes=shuffle(affixPool).slice(0,affixCount),am={};
  for(const a of affixes)for(const [k,v] of Object.entries(a.mods))am[k]=(am[k]||0)+v;
  const base=starTier*kindScale*variance*formationScale*(zone.shinyOnly?1.20:1);
  const hpMul=1+(mods.hp||0)+(am.hp||0),atkMul=1+(mods.atk||0)+(am.atk||0),defMul=1+(mods.def||0)+(am.def||0),spdMul=1+(mods.spd||0)+(am.spd||0),luckMul=1+(mods.luck||0)+(am.luck||0);
  const maxHp=Math.round(1600*base*hpMul*endlessMul),atk=Math.round(400*base*atkMul*endlessMul),def=Math.round(360*base*defMul*endlessMul),spd=Math.round(340*base*spdMul*endlessMul),luck=Math.round(300*base*luckMul*endlessMul);
  const e={id:'e'+index,role,name:enemyRoleName(role),enemySpecies,enemyShiny:zone.shinyOnly,maxHp,hp:maxHp,atk,def,spd,luck,affixes:affixes.map(x=>x.name),variance:Math.round(variance*100),enemySkill:enemySkillRoll(run,role),starTier:floor>=3?5:(floor===2?4:2)};
  e.difficultyRating=enemyDifficultyRating(e);return e;
}
function enemyPreview(run,kind){const roles=enemyTeamRoles(kind,run),enemies=roles.map((role,i)=>makeEnemyUnit(run,role,i,roles.length)),totals=roles.reduce((o,r)=>(o[r]=(o[r]||0)+1,o),{}),seen={};for(const e of enemies){seen[e.role]=(seen[e.role]||0)+1;if(totals[e.role]>1)e.name=`${enemyRoleName(e.role)} ${seen[e.role]}`}if(relicMods(run).swapEnemyEnds&&enemies.length>1){const j=enemies.length-1;[enemies[0],enemies[j]]=[enemies[j],enemies[0]]}const p=enemies[0],enemyPower=enemies.reduce((n,e)=>n+e.difficultyRating,0);return{kind,enemies,enemySpecies:p.enemySpecies,enemyShiny:p.enemyShiny,enemyMax:p.maxHp,enemyAtk:p.atk,enemyDef:p.def,enemySpd:p.spd,enemyLuck:p.luck,affixes:p.affixes,variance:p.variance,enemyPower,difficultyRating:enemyPower};}
function prepareBattle(run,kind){run.pendingBattle=enemyPreview(run,kind);run.phase='battlePreview';save()}
function atbRate(spd){return Math.max(20,60+Math.max(0,Number(spd)||0)*.45)}
function speedRuleText(){return '速度决定行动条充能速度；所有参战单位会同时充能，行动条达到 100% 就立刻行动。我方每次行动独立判定：80% 普通攻击，20% 使用战斗技能。敌方单体攻击严格优先前卫，前卫倒下后攻击中卫，最后才攻击后卫；全体攻击等特殊技能除外。'}
function battle(run,kind){
  ensureRunMeta(run);
  const zone=z(run.zone),t=activeTeam(run),elite=kind==='elite',boss=kind==='boss',ep=run.pendingBattle&&run.pendingBattle.kind===kind?run.pendingBattle:enemyPreview(run,kind);
  run.pendingBattle=null;
  const enemies=(ep.enemies?.length?ep.enemies:[{id:'e0',role:kind==='boss'?'boss':kind==='elite'?'elite':'normal',name:enemyRoleName(kind==='boss'?'boss':kind==='elite'?'elite':'normal'),enemySpecies:ep.enemySpecies,enemyShiny:ep.enemyShiny,maxHp:ep.enemyMax,hp:ep.enemyMax,atk:ep.enemyAtk,def:ep.enemyDef,spd:ep.enemySpd,luck:ep.enemyLuck,affixes:ep.affixes||[],variance:ep.variance}]).map((x,i)=>({...x,id:x.id||'e'+i,hp:Number(x.hp??x.maxHp??x.enemyMax)||1,maxHp:Number(x.maxHp??x.enemyMax)||1,atk:Number(x.atk??x.enemyAtk)||1,def:Number(x.def??x.enemyDef)||1,spd:Number(x.spd??x.enemySpd)||1,luck:Number(x.luck??x.enemyLuck)||1,difficultyRating:Number(x.difficultyRating)||enemyDifficultyRating(x),scored:false}));
  const preBattleReviveLogs=[];for(const m of t)if(hpPct(run,m.id)<=0)tryPhoenixRevive(run,m,preBattleReviveLogs,'开战前');const startHp={};t.forEach(m=>startHp[m.id]=hpPct(run,m.id));
  run.floorBattleSeen=run.floorBattleSeen||{};const floorKey=String(floorNo(run.stage)),firstBattleThisFloor=!run.floorBattleSeen[floorKey],vanguardGuard=firstBattleThisFloor?(metaMods().vanguard||0):0;run.floorBattleSeen[floorKey]=true;let firstGuard=true,actions=0,elapsed=0,battleScore=0;
  const battleMods=combatMods(run),logs=[...preBattleReviveLogs],events=[],gauge={},personalActions={},enemyActions={},allyBuff={atk:0,def:0,spd:0,luck:0,ttl:0},enemyDebuff={atk:0,def:0,spd:0,luck:0,ttl:0},digitSeed={},blocked={},shields={},vulnStack={};t.forEach((m,i)=>{digitSeed[m.id]=Math.random();gauge[m.id]=0;shields[m.id]=Math.max(0,Number(battleMods.shieldFlat)||0)+(i===0?Math.max(0,Number(battleMods.frontShieldFlat)||0):0)});enemies.forEach(e=>{gauge[e.id]=0;vulnStack[e.id]=0});
  if((elite||boss)&&Math.random()<(boss?.70:.38)){const pool=CURSES.filter(c=>!run.curses.includes(c.id));if(pool.length)inflictCurse(run,rand(pool).id,logs)}
  const cv=(m,pos)=>{const p=combatValue(m,pos,run);let atk=p.atk*(1+allyBuff.atk),def=p.def*(1+allyBuff.def),spd=p.spd*(1+allyBuff.spd),luck=p.luck*(1+allyBuff.luck);if(battleMods.digitShuffleAtk)atk=shuffledAttackDigits(atk,digitSeed[m.id]);return{...p,atk,def,spd,luck}};
  const allyStatsSnapshot=()=>Object.fromEntries(t.map((m,i)=>{const q=cv(m,i),hp=Math.max(1,Math.round(q.con||1));return[m.id,{hp,con:hp,atk:Math.round(q.atk||0),def:Math.round(q.def||0),spd:Math.round(q.spd||0),luck:Math.round(q.luck||0)}]}));
  const allyInitialStats=allyStatsSnapshot();
  const enemyNow=e=>({atk:e.atk*(1+enemyDebuff.atk),def:e.def*(1+enemyDebuff.def-Math.max(0,Number(battleMods.enemyDefDown)||0)-(e.role==='boss'?Math.max(0,Number(battleMods.bossDefDown)||0):0)),spd:e.spd*(1+enemyDebuff.spd),luck:e.luck*(1+enemyDebuff.luck)});
  const initialTeamPower=t.filter(m=>canReviveInRun(run,m.id)&&hpPct(run,m.id)>0).reduce((sum,m,i)=>{const p=cv(m,i);return sum+p.atk*1.1+p.def+p.spd*.65+p.luck*.35+p.con*.7},0),enemyPower=enemies.reduce((n,e)=>n+e.difficultyRating,0);
  const livingEnemies=()=>enemies.filter(e=>e.hp>0);
  const gaugeSnapshot=()=>({enemies:Object.fromEntries(enemies.map(e=>[e.id,Math.max(0,Math.min(100,gauge[e.id]||0))])),allies:Object.fromEntries(t.map(m=>[m.id,Math.max(0,Math.min(100,gauge[m.id]||0))]))});
  const tickStatus=()=>{if(allyBuff.ttl>0&&--allyBuff.ttl<=0)Object.assign(allyBuff,{atk:0,def:0,spd:0,luck:0,ttl:0});if(enemyDebuff.ttl>0&&--enemyDebuff.ttl<=0)Object.assign(enemyDebuff,{atk:0,def:0,spd:0,luck:0,ttl:0})};
  const applyBuff=(dst,obj,ttl)=>{for(const [k,v] of Object.entries(obj||{}))dst[k]=(dst[k]||0)+v;dst.ttl=Math.max(dst.ttl||0,ttl||3)};
  const lowestLiving=()=>t.filter(x=>hpPct(run,x.id)>0&&canReviveInRun(run,x.id)).sort((a,b)=>hpPct(run,a.id)-hpPct(run,b.id))[0];
  const recordKill=e=>{if(e.scored)return;e.scored=true;const pts=Math.max(1,Math.round(e.difficultyRating));battleScore+=pts;run.score=(Number(run.score)||0)+pts;run.kills=run.kills||{normal:0,elite:0,boss:0};run.kills[e.role]=(run.kills[e.role]||0)+1;logs.push(`击杀 ${e.name}：+${pts} 积分（难度评分 ${pts}）。`)};
  const hurtAlly=(enemyUnit,target,mult=1)=>{const current=t.filter(m=>hpPct(run,m.id)>0&&canReviveInRun(run,m.id)),dynPos=current.indexOf(target),p=cv(target,Math.max(0,dynPos)),en2=enemyNow(enemyUnit),maxHp=Math.max(1,Math.round(p.con||1)),beforePct=hpPct(run,target.id),beforeHp=maxHp*beforePct/100;if(Math.random()<dodgeChance(p.luck,en2.luck,positionDodgeBonus(dynPos,battleMods))){const counterDamage=Math.max(0,Number(battleMods.dodgeCounterAtk)||0)>0?Math.min(Number(enemyUnit.hp)||0,p.atk*Number(battleMods.dodgeCounterAtk)):0;if(counterDamage>0){enemyUnit.hp=Math.max(0,enemyUnit.hp-counterDamage);if(enemyUnit.hp<=0)recordKill(enemyUnit)}return{targetId:target.id,hpLoss:0,hpDamage:0,maxHp,currentHp:Math.round(beforeHp),hpAfter:beforePct,hpAfterAbs:Math.round(beforeHp),reflectDamage:0,counterDamage,shieldDamage:0,shieldAfter:shields[target.id]||0,enemyHp:enemyUnit.hp,enemyMax:enemyUnit.maxHp,miss:true}}if(Number(battleMods.blockFirstHit)>0&&!blocked[target.id]){blocked[target.id]=true;return{targetId:target.id,hpLoss:0,hpDamage:0,maxHp,currentHp:Math.round(beforeHp),hpAfter:beforePct,hpAfterAbs:Math.round(beforeHp),reflectDamage:0,counterDamage:0,shieldDamage:0,shieldAfter:shields[target.id]||0,enemyHp:enemyUnit.hp,enemyMax:enemyUnit.maxHp,miss:false,blocked:true}}const rawIncoming=Math.max(5,en2.atk*mult),defense=Math.max(0,Number(p.def)||0);let incoming=Math.max(1,rawIncoming*100/(100+defense));if(vanguardGuard>0)incoming*=1-vanguardGuard;if(firstGuard&&(battleMods.firstGuard||0)){incoming*=1-battleMods.firstGuard;firstGuard=false}let shieldDamage=Math.min(Math.max(0,shields[target.id]||0),incoming);shields[target.id]=Math.max(0,(shields[target.id]||0)-shieldDamage);incoming=Math.max(0,incoming-shieldDamage);let hpDamage=Math.min(maxHp*.42,incoming),afterHp=Math.max(0,beforeHp-hpDamage);run.hp[target.id]=Math.max(0,afterHp/maxHp*100);let autoRevived=false;if(beforePct>0&&run.hp[target.id]<=0){autoRevived=tryPhoenixRevive(run,target,logs,'战斗中');if(autoRevived)afterHp=maxHp*.5}const reflectRate=Math.max(0,Number(battleMods.reflectDamage)||0),reflectDamage=hpDamage>0&&reflectRate>0?Math.min(Number(enemyUnit.hp)||0,hpDamage*reflectRate):0;if(reflectDamage>0){enemyUnit.hp=Math.max(0,enemyUnit.hp-reflectDamage);if(enemyUnit.hp<=0)recordKill(enemyUnit)}if(beforePct>0&&run.hp[target.id]<=0&&!autoRevived){gauge[target.id]=0;expeditionKnockout(run,target,logs);if(target.life>0)logs.push(`${monsterName(target)} 已倒下，只能在营地选择复活。`)}const hpLoss=hpDamage/maxHp*100;return{targetId:target.id,hpLoss,hpDamage,maxHp,currentHp:Math.round(beforeHp),hpAfter:run.hp[target.id],hpAfterAbs:Math.round(afterHp),reflectDamage,counterDamage:0,shieldDamage,shieldAfter:shields[target.id]||0,autoRevived,enemyHp:enemyUnit.hp,enemyMax:enemyUnit.maxHp,miss:false}};
  const maxActions=60+(enemies.length-1)*15;
  while(livingEnemies().length&&actions<maxActions&&t.some(m=>hpPct(run,m.id)>0&&canReviveInRun(run,m.id))){
    const alive=t.filter(m=>hpPct(run,m.id)>0&&canReviveInRun(run,m.id)),actors=[];alive.forEach((m,dynPos)=>{const p=cv(m,dynPos);actors.push({type:'ally',key:m.id,m,dynPos,p,spd:p.spd,rate:atbRate(p.spd)})});for(const e of livingEnemies()){const p=enemyNow(e);actors.push({type:'enemy',key:e.id,e,p,spd:p.spd,rate:atbRate(p.spd)})}if(!actors.length)break;
    let dt=Infinity;for(const a of actors)dt=Math.min(dt,(100-(gauge[a.key]||0))/Math.max(1,a.rate));if(!Number.isFinite(dt)||dt<0)dt=0;elapsed+=dt;for(const a of actors)gauge[a.key]=Math.min(100,(gauge[a.key]||0)+a.rate*dt);const ready=actors.filter(a=>(gauge[a.key]||0)>=99.999).sort((a,b)=>b.spd-a.spd)[0];if(!ready)break;actions++;const snap=gaugeSnapshot();
    if(ready.type==='ally'){
      const m=ready.m;if(hpPct(run,m.id)<=0||!canReviveInRun(run,m.id)){gauge[m.id]=0;continue}const target=livingEnemies()[0];if(!target)break;personalActions[m.id]=(personalActions[m.id]||0)+1;const p=ready.p,en2=enemyNow(target),skillTurn=Math.random()<.20,skill=skillTurn?battleSkillFor(m):null;let power=1,skillName='',specialText='';
      if(skill){skillName=skill.name;if(skill.buff){applyBuff(allyBuff,skill.buff,skill.duration);specialText+=`；${skill.text}`}if(skill.debuff){applyBuff(enemyDebuff,skill.debuff,skill.duration);specialText+=`；${skill.text}`}if(skill.type==='heal'){const x=lowestLiving();if(x){run.hp[x.id]=Math.min(100,hpPct(run,x.id)+skill.heal*100);specialText+=`；${monsterName(x)} +${Math.round(skill.heal*100)}% HP`}}if(skill.type==='healall'||skill.type==='healBuff'){for(const x of t)if(hpPct(run,x.id)>0&&canReviveInRun(run,x.id))run.hp[x.id]=Math.min(100,hpPct(run,x.id)+(skill.heal||0)*100)}if(skill.type==='selfheal'||skill.type==='drain')run.hp[m.id]=Math.min(100,hpPct(run,m.id)+(skill.heal||0)*100);if(skill.power)power=skill.power;if(skill.type==='attackGauge')gauge[target.id]=Math.max(0,(gauge[target.id]||0)+(skill.gauge||0))}
      const doesDamage=!skill||['attack','attackGauge','attackDebuff','attackSelfGauge','drain'].includes(skill.type);let hit=0,crit=false,miss=false;if(doesDamage){miss=Math.random()<dodgeChance(en2.luck,p.luck);if(!miss){crit=Math.random()<Math.min(.38,p.luck/1600);const raw=(p.atk*.22+p.spd*.06+p.luck*.025)*(crit?1.65:1)*power;let damageMul=1+Math.max(0,Number(battleMods.enemyVulnerable)||0)+Math.max(0,Number(vulnStack[target.id])||0)+(target.role==='boss'?Math.max(0,Number(battleMods.bossDamage)||0):0);const mitigated=raw*100/(100+Math.max(0,Number(en2.def)||0));hit=Math.max(1,mitigated*damageMul);target.hp=Math.max(0,target.hp-hit);if(Number(battleMods.stackVulnerable)>0)vulnStack[target.id]=Math.min(Math.max(0,Number(battleMods.stackVulnerableCap)||.20),(vulnStack[target.id]||0)+Number(battleMods.stackVulnerable));if(target.hp<=0)recordKill(target)}}
      const attackType=skillName?`技能·${skillName}`:'普通攻击';events.push({type:'ally',action:actions,actorId:m.id,enemyId:target.id,enemyIndex:enemies.indexOf(target),enemyHp:target.hp,enemyMax:target.maxHp,damage:Math.round(hit),crit,miss,skillName,attackType,spd:p.spd,wait:dt,gauges:snap,allyStats:allyStatsSnapshot()});logs.push(`行动 ${actions}：${monsterName(m)} 使用【${attackType}】 → ${target.name}${doesDamage?(miss?'，被闪避。':`，造成 ${Math.round(hit)} 伤害${crit?'（暴击）':''}`):''}${specialText}。`);gauge[m.id]=skill?.type==='attackSelfGauge'?Math.max(0,skill.gauge||0):0;
    }else{
      const e=ready.e,current=t.filter(m=>hpPct(run,m.id)>0&&canReviveInRun(run,m.id));if(!e||!current.length){gauge[ready.key]=0;continue}enemyActions[e.id]=(enemyActions[e.id]||0)+1;const es=e.enemySkill||null;let mode='normal';if(es&&Math.random()<Number(es.chance||0))mode=es.type==='aoe'?'aoeSkill':'skill';else if(e.role==='boss'){const r=Math.random();mode=enemyActions[e.id]%4===0?'aoe':r<.55?'normal':r<.80?'skill':'aoe'}else if(e.role==='elite'&&Math.random()<.18)mode='skill';
      if(mode==='aoe'||mode==='aoeSkill'){
        const skillLabel=mode==='aoeSkill'?(es?.name||'横扫'):'全体攻击',aoePower=mode==='aoeSkill'?Number(es?.power||.72):.64,targets=current.map(x=>hurtAlly(e,x,aoePower)),reflected=targets.reduce((n,x)=>n+(Number(x.reflectDamage)||0),0);events.push({type:'enemy',action:actions,enemyId:e.id,enemyIndex:enemies.indexOf(e),aoe:true,skillName:skillLabel,attackType:skillLabel,targets,reflectDamage:reflected,enemyHp:e.hp,enemyMax:e.maxHp,spd:ready.spd,wait:dt,gauges:snap,allyStats:allyStatsSnapshot()});logs.push(`行动 ${actions}：${e.name} 使用【${skillLabel}】，攻击全队${reflected>0?`；反甲累计反伤 ${Math.round(reflected)}`:''}。`);
      }else{
        const target=current[0],dedicated=mode==='skill'&&es,skillLabel=dedicated?es.name:(mode==='skill'?'强袭技能':''),skillPower=dedicated?Number(es.power||1.2):(mode==='skill'?1.45:1),res=hurtAlly(e,target,skillPower);if(dedicated&&!res.miss){if(es.debuff)applyBuff(allyBuff,es.debuff,es.duration||2);if(es.heal)e.hp=Math.min(e.maxHp,e.hp+res.hpDamage*Number(es.heal||0))}events.push({type:'enemy',action:actions,enemyId:e.id,enemyIndex:enemies.indexOf(e),targetId:res.targetId,hpLoss:res.hpLoss,hpDamage:res.hpDamage,maxHp:res.maxHp,hpAfter:res.hpAfter,hpAfterAbs:res.hpAfterAbs,reflectDamage:res.reflectDamage,enemyHp:e.hp,enemyMax:e.maxHp,miss:res.miss,skillName:skillLabel,attackType:skillLabel||'普通攻击',spd:ready.spd,wait:dt,gauges:snap,allyStats:allyStatsSnapshot()});logs.push(`行动 ${actions}：${e.name} 使用【${skillLabel||'普通攻击'}】攻击 ${monsterName(target)}${res.miss?'，但被闪避。':`，HP -${Math.round(res.hpDamage)}（${Math.round(res.hpAfterAbs)}/${Math.round(res.maxHp)}）${res.reflectDamage>0?`；反甲反伤 ${Math.round(res.reflectDamage)}`:''}${dedicated&&es.debuff?'；附加能力削弱':''}${dedicated&&es.heal?'；吸取生命':''}`}。`)
      }
      gauge[e.id]=0;
    }
    tickStatus();
  }
  const win=livingEnemies().length===0,aliveCount=t.filter(m=>hpPct(run,m.id)>0&&canReviveInRun(run,m.id)).length,reason=win?`在第 ${actions} 次行动击败敌方 ${enemies.length} 只怪物`:(aliveCount===0?'队伍全部倒下':`达到 ${maxActions} 次行动上限仍有 ${livingEnemies().length} 只敌人存活`);
  if(win){const eliteBonus=elite?(1+(combatMods(run).eliteReward||0)):1,base=Math.round(500*(elite?1.7:1)*(boss?2.8:1)*nodeRewardScale(zone,run.stage)*eliteBonus);run.energy+=base;if(elite)run.tempBadges+=Math.max(1,Math.round(zone.badge*.5));const heal=combatMods(run).heal||0;if(heal)t.forEach(m=>{if(hpPct(run,m.id)>0&&canReviveInRun(run,m.id))run.hp[m.id]=Math.min(100,hpPct(run,m.id)+heal*100);else if(!canReviveInRun(run,m.id))run.hp[m.id]=0});run.log.push(`${boss?'首领':elite?'精英':'战斗'}胜利：敌方 ${enemies.length} 只 · +${base} 灵能 · 本战积分 +${battleScore}。`)}else run.log.push('战斗失败，远征被迫撤退。');
  const primary=enemies[0],enemyMax=enemies.reduce((n,e)=>n+e.maxHp,0),enemyHp=enemies.reduce((n,e)=>n+Math.max(0,e.hp),0);
  run.battle={kind,atb:true,actions,rounds:actions,elapsed,allyInitialStats,allyFinalStats:allyStatsSnapshot(),enemyMax,enemyHp,enemyAtk:primary.atk,enemyDef:primary.def,enemySpd:primary.spd,enemyLuck:primary.luck,enemyPower,difficultyRating:enemyPower,teamPower:Math.round(initialTeamPower),logs,events,startHp,win,reason,enemySpecies:primary.enemySpecies,enemyShiny:primary.enemyShiny,affixes:primary.affixes||[],variance:primary.variance,enemies:enemies.map(e=>({...e}))};run.nextBattleMods={};run.nextBattleBuffCount=0;run.phase='battleResult';save()
}
function offerRelic(run){const owned=new Set(run.relics||[]),pool=RELICS.filter(x=>!owned.has(x.id));run.relicChoices=shuffle(pool).slice(0,3).map(x=>x.id);if(!run.relicChoices.length){run.materials.relicDust=(run.materials.relicDust||0)+1;run.log.push('遗物池已全部收集，本次改为遗物尘 +1。');if(run.stage%9===8&&floorNo(run.stage)<=2){run.phase='floorBossChoice';save(`${floorLabel(run.stage)} BOSS 已击败：遗物池已收集完，可按25%撤离，或继续下一楼层。`);return}if(run.stage%9===8)floorTransitionHeal(run);advance(run);return}run.phase='relic';save()}
function floorTransitionHeal(run){const next=floorNo(run.stage)+1;let count=0;for(const mid of run.teamIds||[]){if(!canReviveInRun(run,mid))continue;run.hp[mid]=Math.min(100,hpPct(run,mid)+50);count++}if(count)run.log.push(`楼层休整：进入 ${next}-1 前，队伍远征HP恢复 50%（上限100%）。`)}
function chooseRelic(run,id){if(!(run.relicChoices||[]).includes(id))return;run.relics.push(id);run.log.push(`获得遗物：${RELICS.find(x=>x.id===id)?.name||id}`);run.relicChoices=[];if(run.stage%9===8&&floorNo(run.stage)<=2){run.phase='floorBossChoice';save(`${floorLabel(run.stage)} BOSS 已击败：可按25%撤离，或继续下一楼层。`);return}if(run.stage%9===8)floorTransitionHeal(run);advance(run)}
function checkpointBoss(run){const zone=z(run.zone),d=diff(run.difficulty),bossNo=floorNo(run.stage),mapBonus=zone.shinyOnly?1.35:1,rewardMul=1+floorRewardBonus(run.stage),crystals=Math.max(1,Math.round((bossNo+d.id/3)*mapBonus*rewardMul));run.materials.starCrystal=(run.materials.starCrystal||0)+crystals;run.tempBadges+=Math.max(1,Math.ceil(bossNo/2));run.bossCount=bossNo;run.log.push(`${floorLabel(run.stage)} BOSS击败：星辉结晶 +${crystals} · 临时徽章 +${Math.max(1,Math.ceil(bossNo/2))}。`)}
function prepareEggMilestone(run){const f=floorNo(run.stage),d=Number(run.difficulty)||0,rewardMul=1+floorRewardBonus(run.stage),scale=v=>Math.max(1,Math.round(v*rewardMul)),shinyChance=z(run.zone).shinyOnly?.35:.25;run.eggMilestoneChoices=[
{key:'eggFragment',name:'基础蛋碎片',value:scale(24+f*2+d),text:'用于现有蛋碎片工坊'},
{key:'expeditionEggFragment',name:'远征秘藏碎片',value:scale(12+f+d),text:'更稀有的远征专属碎片'}
];if(Math.random()<shinyChance)run.eggMilestoneChoices.push({key:'shinyEggFragment',name:'闪光蛋碎片',value:scale(6+Math.floor(f/2)+Math.floor(d/2)),text:`稀有出现（${Math.round(shinyChance*100)}%）；用于保证闪光的远征蛋`});run.phase='eggMilestone';save(`${floorLabel(run.stage)}：达成每3楼层的蛋碎片奖励。`)}
function chooseEggMilestone(run,i){const c=run.eggMilestoneChoices?.[i];if(!c)return;run.materials[c.key]=(run.materials[c.key]||0)+c.value;run.log.push(`里程碑奖励：${c.name} +${c.value}。`);run.eggMilestoneChoices=[];run.phase='floorBossChoice';save(`获得 ${c.name} ×${c.value}。`)}
function continueBattle(run){if(!run.battle)return;if(!run.battle.win){finish(run,false,true);return}const kind=run.battle.kind;run.battle=null;if(kind==='boss'){checkpointBoss(run);if(floorNo(run.stage)%3===0){prepareEggMilestone(run);return}if(run.stage>=26){run.phase='floorBossChoice';save(`${floorLabel(run.stage)} BOSS 已击败：可以领取全部奖励结束，或继续挑战下一楼层。`);return}offerRelic(run);return}if(kind==='elite'){offerRelic(run);return}if(Math.random()<.28){offerRelic(run);return}advance(run)}
function eggMilestoneHTML(run){const cs=run.eggMilestoneChoices||[];return `${runHeader(run)}${runInventoryHTML(run)}<section class="rg-panel"><div class="rg-title"><div><b>🥚 每3楼层里程碑</b><small>击败第3个楼层BOSS后选择蛋碎片；闪光碎片只会低概率出现</small></div><span>${floorLabel(run.stage)}</span></div><div class="rg-final">${cs.map((c,i)=>`<button class="primary rg-relic" data-rg-egg-milestone="${i}"><b>${c.name} ×${c.value}</b><span>${c.text}</span></button>`).join('')}</div></section>`}
function floorBossChoiceHTML(run){
  const current=floorNo(run.stage),next=current+1,early=current<=2,enemyExtra=Math.max(0,next-3)*10,rewardExtra=Math.max(0,next-3)*5;
  const exitTitle=early?'撤离并结束（25%）':'领取全部奖励并结束';
  const exitText=early?'只带回目前奖励的 25%；这是主动撤离，不视为战斗失败':'以 100% 结算目前已获得奖励';
  const continueTitle=early?'继续下一楼层':'继续无限模式';
  const continueText=early?`进入 ${next}-1 · 全队HP +50%`:`进入 ${next}-1 · 全队HP +50% · 敌方所有能力 +${enemyExtra}% · 本层局内奖励 +${rewardExtra}%`;
  return `${runHeader(run)}${runInventoryHTML(run)}<section class="rg-panel rg-floor-choice"><div class="rg-title"><div><b>${floorLabel(run.stage)} 楼层BOSS已击败</b><small>${early?'早期撤离点：现在撤离只能带回25%奖励；继续则进入下一楼层。':`现在是安全结算点。继续后进入 ${next}-1；敌方全能力与局内奖励使用独立倍率。`}</small></div></div><div class="rg-final"><button class="primary rg-relic" data-rg-floor-cashout><b>${exitTitle}</b><span>${exitText}</span></button><button class="secondary rg-relic" data-rg-floor-continue><b>${continueTitle}</b><span>${continueText}</span></button></div></section>`;
}
function cashoutFloor(run){const early=floorNo(run.stage)<=2;if(early)finish(run,false,false,`${floorLabel(run.stage)}撤离点（25%）`);else finish(run,true,false,`${floorLabel(run.stage)}安全结算`)}
function continueEndlessFloor(run){if(floorNo(run.stage)>=3)run.endless=true;floorTransitionHeal(run);advance(run)}
function finalChoices(run){const zone=z(run.zone),d=diff(run.difficulty),scale=zone.reward*d.reward,mapBonus=zone.shinyOnly?1.35:1;if(!run.finalBossBonusGiven){const fragments=Math.round((20+d.id*6)*mapBonus),crystals=Math.max(2,Math.round((3+d.id/2)*mapBonus));run.materials.eggFragment=(run.materials.eggFragment||0)+fragments;run.materials.starCrystal=(run.materials.starCrystal||0)+crystals;run.finalBossBonusGiven=true;run.log.push(`最终大BOSS奖励：蛋碎片 +${fragments} · 星辉结晶 +${crystals}。`)}run.finalChoices=shuffle([
{type:'badges',title:'徽章袋',text:`远征徽章 +${Math.round((zone.badge*2+d.id)*mapBonus)}`,value:Math.round((zone.badge*2+d.id)*mapBonus)},
{type:'energy',title:'灵能核心',text:`额外灵能 +${Math.round(2200*scale)}`,value:Math.round(2200*scale)},
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
    const loss=Math.max(1,Number(rolledCurse(run,'routeErosion').routeLoss)||1),before=hpPct(run,id),after=Math.max(1,before-loss);
    run.hp[id]=after;
    if(after<before){const m=persistentMonster(id);affected.push((m?monsterName(m):'#'+id)+' '+Math.round(before)+'%→'+Math.round(after)+'%');}
  }
  if(affected.length)run.log.push('侵蚀：抵达新地点，全队最大远征HP -'+Math.max(1,Number(rolledCurse(run,'routeErosion').routeLoss)||1)+'% · '+affected.join('、')+'。');
}
function advance(run){applyRouteDebuffs(run);run.stage++;run.challenge=null;run.options=makeOptions(run.stage);run.phase='map';if(run.supply<=0){run.log.push('补给耗尽：之后的挑战失败会更危险。')}save()}
function chooseNode(i){const e=ensure(),run=e?.rogueActive,node=run?.options?.[i];if(!run||!node)return;if(node.type==='rest')return applyRest(run);if(node.type==='treasure')return treasure(run);if(node.type==='training')return openTraining(run);if(node.type==='challenge')return challenge(run);if(node.type==='temple')return temple(run);if(node.type==='battle'||node.type==='elite'||node.type==='boss')return prepareBattle(run,node.type)}
function expeditionFailureDeathChance(m){const life=Math.max(0,Number(m?.life)||0);return life>=10?.05:life>=5?.08:life>=2?.10:.15}
function removeExpeditionMonster(s,id){const i=(s.expedition?.box||[]).findIndex(m=>Number(m.id)===Number(id));if(i>=0)return s.expedition.box.splice(i,1)[0];const j=(s.monsters||[]).findIndex(m=>Number(m.id)===Number(id));if(j>=0)return s.monsters.splice(j,1)[0];return null}
function applyExpeditionLifeCost(run,cleared,defeated=false){
  const s=S();if(!s)return[];const byId=new Map([...(s.monsters||[]),...(s.expedition?.box||[])].map(m=>[m.id,m])),notes=[];
  if(!defeated){for(const id of run.teamIds||[]){const m=byId.get(id);if(m){syncExpeditionRest(m);notes.push(`${monsterName(m)} ${expeditionRestText(m)}`)}}return notes}
  const now=Date.now();s.activityLog=Array.isArray(s.activityLog)?s.activityLog:[];
  for(const id of run.teamIds||[]){const m=byId.get(id);if(!m)continue;syncExpeditionRest(m,now);const death=expeditionFailureDeathChance(m),roll=Math.random();
    if(roll<death){const snapshot={...m};removeExpeditionMonster(s,id);run.permaDead=run.permaDead||{};run.permaDead[id]=true;notes.push(`${monsterName(snapshot)} 远征失败后伤重死亡（死亡率 ${Math.round(death*100)}%）`);s.activityLog.push({id:'L'+now+'-'+id,key:`expedition-death-${id}-${now}`,type:'death',time:now,reason:'远征失败后伤重死亡',monsterId:id,name:monsterName(snapshot),star:snapshot.star,shiny:!!snapshot.shiny});continue}
    if(roll<.85){m.life=0;m.expeditionRestAt=now;notes.push(`${monsterName(m)} 重伤归来：剩余生命归0，进入Rest（每30分钟+1）`)}
    else{m.life=Math.max(0,(Number(m.life)||0)-1);startExpeditionRest(m,now);notes.push(`${monsterName(m)} 侥幸撤回：额外失去1生命，${expeditionRestText(m,now)}`)}
  }
  return notes
}
function finish(run,cleared=false,defeated=false,choice=''){const s=S(),e=ensure();if(!s||!e)return;const zone=z(run.zone),fraction=cleared?1:.25,payout=Math.round(run.energy*fraction),badge=cleared?zone.badge+run.tempBadges:Math.floor(run.tempBadges*fraction);s.energy=(Number(s.energy)||0)+payout;e.badges+=badge;for(const k of Object.keys(run.materials))e.loot[k]=(e.loot[k]||0)+Math.floor((run.materials[k]||0)*fraction);if(cleared){const current=Math.max(0,Number(run.difficulty)||0),unlocked=Math.max(0,Number(e.difficultyUnlocked?.[zone.id])||0);if(current>=unlocked&&current<10)e.difficultyUnlocked[zone.id]=current+1}const lifeNotes=applyExpeditionLifeCost(run,cleared,defeated),score=Math.round(Number(run.score)||0),floor=floorLabel(run.stage);e.leaderboard=e.leaderboard||[];e.leaderboard.push({zone:zone.name,difficulty:run.difficulty||0,score,floor,stage:run.stage||0,cleared:!!cleared,time:Date.now()});e.leaderboard.sort((a,b)=>(b.score||0)-(a.score||0)||(b.stage||0)-(a.stage||0));e.leaderboard=e.leaderboard.slice(0,20);e.rogueLast={zone:zone.name,difficulty:run.difficulty||0,cleared,defeated,payout,badge,score,floor,relics:run.relics?.length||0,time:Date.now(),choice,lifeNotes};e.rogueActive=null;const lifeText=lifeNotes.length?' · '+lifeNotes.join('；'):'';const unlockText=cleared&&(run.difficulty||0)<10?` · 已解锁难度 ${(run.difficulty||0)+1}`:'';save((cleared?`远征通关！带回 ${payout} 灵能、徽章 ×${badge}。`:`远征结束，带回 ${payout} 灵能。`)+unlockText+lifeText)}
function abandon(){const e=ensure(),run=e?.rogueActive;if(!run)return;if(confirm('中途退出会视为远征失败，只能带回 25% 当前奖励。确定退出？'))finish(run,false,true,'中途退出')}

function trainingHTML(run){
  const choices=run.trainingChoices||[],gain=Math.round(trainingGainMultiplier(run)*100),extra=Math.max(0,trainingChoiceCount(run)-3);
  const fmtStat=v=>{const n=Math.round((Number(v)||0)*10)/10;return Number.isInteger(n)?String(n):n.toFixed(1)};
  return `${runHeader(run)}${runInventoryHTML(run)}${teamHTML(run)}<section class="rg-panel rg-training-panel"><div class="rg-title"><div><b>▲ 训练营</b><small>选择1项；训练强化只在本次远征永久生效</small></div><span>${choices.length}选1 · 当前训练效率 ${gain}%${extra?' · 额外候选 +'+extra:''}</span></div><div class="rg-event-picks rg-training-picks">${choices.map((c,i)=>{const m=persistentMonster(c.monsterId);let current=0,after=0;if(m){const trained=trainedBaseStats(m,run),base=st(m);current=Number(trained[c.stat])||0;after=c.kind==='pct'?current+(Number(base[c.stat])||0)*(Number(c.value)||0)/100:current+(Number(c.value)||0)}const adjusted=Math.abs(c.value-c.raw)>.01;return `<button class="secondary rg-training-choice" data-rg-training-choice="${i}"><span class="rg-training-sprite">${m?(R()?.sprite?.(m.species,m.tint,m.shiny,m.specialColor)||''):''}</span><span class="rg-training-copy"><b>${c.monsterName}</b><small>#${c.monsterId} · ${STAT[c.stat]}</small><strong>+${c.value}${c.kind==='pct'?'%':''}</strong><em class="rg-training-result">${STAT[c.stat]} ${fmtStat(current)} → <b>${fmtStat(after)}</b></em>${adjusted?`<small class="rg-training-roll">训练抽取 ${c.raw}${c.kind==='pct'?'%':''} · 效率修正后 +${c.value}${c.kind==='pct'?'%':''}</small>`:''}</span></button>`}).join('')}</div><p class="rg-note">基础训练范围：百分比 +1%～5%，固定值 +1～20。绿色箭头显示选择后该能力的实际数值；教官徽章提高候选数与训练量，倦怠会降低训练量。</p></section>`;
}
function campHTML(run){const knocked=activeTeam(run).filter(m=>hpPct(run,m.id)<=0&&canReviveInRun(run,m.id));return `${runHeader(run)}${runInventoryHTML(run)}${teamHTML(run)}<section class="rg-panel"><div class="rg-title"><div><b>♥ 营地</b><small>仍站立队员已恢复 ${run.campHeal||30}%；倒下队员只有在营地才能复活</small></div><span>${run.campRevived?'本营地已复活1只':'可选择复活1只'}</span></div>${knocked.length?`<div class="rg-event-picks">${knocked.map(m=>`<button class="secondary" data-rg-camp-revive="${m.id}" ${run.campRevived?'disabled':''}><b>复活 ${monsterName(m)}</b><small>恢复至 30% 远征HP</small></button>`).join('')}</div>`:'<p class="rg-note">目前没有可复活的队员。</p>'}<button class="primary rg-mainbtn" data-rg-camp-leave>离开营地</button></section>`}
function templeHTML(run){
  const choices=run.templeChoices||[],gain=Math.round(templeGainMultiplier(run)*100),extra=Math.max(0,templeChoiceCount(run)-3);
  const fmt=x=>{if(x.kind==='cleanse')return '移除 1 个 Debuff';if(x.kind==='heal')return `恢复 ${Math.round(x.heal*100)}% 远征HP`;const t=Object.entries(x.mods||{}).map(([k,v])=>`${({atk:'攻击',def:'防御',spd:'速度',luck:'幸运'})[k]} +${Math.round(v*1000)/10}%`).join(' · ');return x.kind==='risky'?t+' · 同时获得随机 Debuff':t};
  return `${runHeader(run)}${runInventoryHTML(run)}${teamHTML(run)}<section class="rg-panel"><div class="rg-title"><div><b>◆ 神庙 · 选择祈愿</b><small>选择1项；祝福在本次远征持续生效</small></div><span>${choices.length}选1 · 祝福效率 ${gain}%${extra?' · 额外候选 +'+extra:''}${rngControl(run).buffFloor?' · Buff最低 +'+rngControl(run).buffFloor+'%':''}</span></div><div class="rg-event-picks">${choices.map((x,i)=>`<button class="secondary" data-rg-temple-choice="${i}"><b>${x.title}</b><small>${fmt(x)}</small></button>`).join('')}</div></section>`;
}
function templeResultHTML(run){const x=run.templeResult||{good:true,title:'神庙',text:'没有发生任何事'};return `${runHeader(run)}${runInventoryHTML(run)}<section class="rg-panel"><div class="rg-title"><div><b>${x.good?'◆ 神庙祝福':'◆ 神庙诅咒'} · ${x.title}</b><small>踏入神庙的结果已经生效</small></div></div><p class="${x.good?'rg-note':'rg-danger'}" style="font-size:13px;padding:10px"><b>${x.text}</b></p><button class="primary rg-mainbtn" data-rg-temple-next>继续远征</button></section>`}
function nodeHTML(run){return `<section class="rg-panel rg-route-choice-panel"><div class="rg-title"><div><b>选择下一条路线</b><small>每楼层9关；X-9固定为楼层BOSS</small></div><span>当前 ${floorLabel(run.stage)}</span></div><div class="rg-nodes">${run.options.map((o,i)=>{const m=NODE_META[o.type];return `<button class="rg-node rg-node-${o.type}" data-rg-kind="${o.type}" data-rg-node="${i}"><span class="rg-node-icon">${m[0]}</span><span class="rg-node-copy"><b>${m[1]}</b><small>${m[2]}</small></span><span class="rg-node-arrow">›</span></button>`}).join('')}</div></section>`}
function runHeader(run){const zone=z(run.zone),d=diff(run.difficulty),chapter=Math.floor(run.stage/9)+1,enemyExtra=Math.round(endlessExtra(run.stage)*100),rewardExtra=Math.round(floorRewardBonus(run.stage)*100);return `<section class="rg-panel"><div class="rg-title"><div><b>${zone.label} · ${d.label}</b><small>当前楼层 ${floorLabel(run.stage)} · 每个 X-9 为楼层BOSS${enemyExtra?' · 敌方全能力 +'+enemyExtra+'%':''} · 本层局内奖励 +${rewardExtra}%</small></div><button class="secondary" data-rg-abandon>退出（失败·25%）</button></div>${routeBar(run)}<div class="rg-status"><span>积分 ${Math.round(run.score||0)}</span><span>遗物 ${(run.relics||[]).length} · 种类 ${Object.keys(relicCounts(run)).length}</span>${(run.relics||[]).includes('phoenixCore')?`<span>复苏 ${Math.max(0,(run.relics||[]).filter(id=>id==='phoenixCore').length-(Number(run.autoReviveUsed)||0))}/${(run.relics||[]).filter(id=>id==='phoenixCore').length}</span>`:''}</div><div class="rg-earned"><b>目前已获得奖励</b><span>灵能 ${Math.round(run.energy)}</span><span>临时徽章 ${run.tempBadges}</span><span>遗物尘 ${run.materials?.relicDust||0}</span><span>星辉结晶 ${run.materials?.starCrystal||0}</span><span>基础蛋碎片 ${run.materials?.eggFragment||0}</span><span>远征秘藏碎片 ${run.materials?.expeditionEggFragment||0}</span><span>闪光蛋碎片 ${run.materials?.shinyEggFragment||0}</span></div></section>`}
function teamHTML(run){const t=activeTeam(run);return `<section class="rg-panel"><div class="rg-title"><div><b>自走棋阵型</b><small>每只怪物可直接选择前卫 / 中卫 / 后卫；目标位置已有怪物时会自动对调。前卫倒下后仍由中卫补位，再由后卫补上。</small></div><span>点击卡片内位置按钮调整</span></div><div class="rg-team">${[...t].reverse().map((m,vi)=>monCard(m,run,t.length-1-vi)).join('')}</div></section>`}
function enemyList(b){if(Array.isArray(b?.enemies)&&b.enemies.length)return b.enemies;return[{id:'e0',role:b?.kind==='boss'?'boss':b?.kind==='elite'?'elite':'normal',name:enemyRoleName(b?.kind==='boss'?'boss':b?.kind==='elite'?'elite':'normal'),enemySpecies:b?.enemySpecies,enemyShiny:b?.enemyShiny,maxHp:b?.enemyMax||1,hp:b?.enemyHp??b?.enemyMax??1,atk:b?.enemyAtk||0,def:b?.enemyDef||0,spd:b?.enemySpd||0,luck:b?.enemyLuck||0,affixes:b?.affixes||[],variance:b?.variance||100,difficultyRating:b?.difficultyRating||b?.enemyPower||1}]}
const ENEMY_AFFIX_DETAILS={
  '狂暴':'攻击 +20%',
  '铁壁':'防御 +25%',
  '迅捷':'速度 +20%',
  '强运':'幸运 +25%',
  '巨躯':'HP +25%',
  '精准':'攻击 +8% · 幸运 +15%'
};
function ensureEnemyTipStyle(){
  if(document.getElementById('rg-enemy-tip-style'))return;
  const s=document.createElement('style');s.id='rg-enemy-tip-style';s.textContent=`.rg-enemy-tip{position:relative;display:inline-block;border:0;background:transparent;color:inherit;padding:0 1px;margin:0;font:inherit;line-height:inherit;box-shadow:none!important;text-decoration:underline dotted;text-underline-offset:2px;cursor:help;overflow:visible}.rg-enemy-tip:hover,.rg-enemy-tip:focus{color:#6b3e85;outline:none}.rg-enemy-tip:hover::after,.rg-enemy-tip:focus::after{content:attr(data-tip);position:absolute;z-index:999;left:50%;bottom:calc(100% + 6px);transform:translateX(-50%);min-width:150px;max-width:230px;padding:6px 8px;background:#171a21;color:#f3f3f3;border:2px solid #626b7c;box-shadow:3px 3px 0 rgba(0,0,0,.65);font-size:9px;line-height:1.4;white-space:normal;text-align:left;pointer-events:none}@media(max-width:700px){.rg-enemy-tip:hover::after,.rg-enemy-tip:focus::after{position:fixed;left:12px;right:12px;bottom:14px;transform:none;max-width:none;min-width:0;font-size:11px}}`;
  document.head.appendChild(s);
}
function enemyAffixHTML(e){
  ensureEnemyTipStyle();
  const names=Array.isArray(e.affixes)?e.affixes:[],variance=Math.round(Number(e.variance)||100),delta=variance-100;
  const affix=names.length?names.map(n=>{const tip=ENEMY_AFFIX_DETAILS[n]||'强化敌方能力';return `<button type="button" class="rg-enemy-tip" data-tip="${tip}" title="${tip}">${n}</button>`}).join(' · '):'无';
  const varianceTip=`本场随机模板倍率 ${variance}%（${delta>=0?'+':''}${delta}%）；先影响敌人的基础能力计算，再叠加难度、强化词条与无限层倍率。`;
  return `强化词条：${affix} · <button type="button" class="rg-enemy-tip" data-tip="${varianceTip}" title="${varianceTip}">随机 ${variance}%</button>`;
}
function enemyUnitCardHTML(e,result=false){const pct=Math.max(0,Math.min(100,(Number(e.hp??e.maxHp)||0)/Math.max(1,Number(e.maxHp)||1)*100)),role=e.role||'normal',label=e.name||enemyRoleName(role),sprite=R()?.sprite?.(e.enemySpecies,0,role==='boss'||e.enemyShiny,null)||`<div class="sprite" style="width:58px;height:58px;margin:auto;display:grid;place-items:center;font-size:28px">${role==='boss'?'★':role==='elite'?'☠':'⚔'}</div>`;return `<div class="rg-mon rg-enemy-match rg-enemy-${role}">${sprite}<b>${label}</b><strong class="rg-enemy-final-title">最终能力</strong><div class="rg-enemy-final-stats"><i><small>HP</small><b>${Math.round(e.maxHp||0)}</b></i><i><small>攻击</small><b>${Math.round(e.atk||0)}</b></i><i><small>防御</small><b>${Math.round(e.def||0)}</b></i><i><small>速度</small><b>${Math.round(e.spd||0)}</b></i><i><small>幸运</small><b>${Math.round(e.luck||0)}</b></i></div><small>${enemyAffixHTML(e)}</small><small>难度评分 ${e.difficultyRating||enemyDifficultyRating(e)}</small><div class="rg-hp"><i style="width:${result?pct:100}%"></i></div>${result?`<small>当前 HP ${Math.round(e.hp??e.maxHp)} / ${Math.round(e.maxHp||0)}</small>`:''}</div>`}
function battlePreviewHTML(run){const b=run.pendingBattle||enemyPreview(run,'battle'),t=activeTeam(run),enemies=enemyList(b),enemyPower=enemies.reduce((n,e)=>n+(Number(e.difficultyRating)||enemyDifficultyRating(e)),0),alive=t.filter(m=>hpPct(run,m.id)>0&&canReviveInRun(run,m.id)),teamPower=Math.round(alive.reduce((sum,m,i)=>{const p=combatValue(m,i,run);return sum+p.atk*1.1+p.def+p.spd*.65+p.luck*.35+p.con*.7},0));return `${runHeader(run)}${runInventoryHTML(run)}<section class="rg-panel"><div class="rg-title"><div><b>战斗准备</b><small>敌方本场随机 ${enemies.length} 只；普通节点只会出现普通怪</small></div><span>${b.kind==='boss'?'BOSS':b.kind==='elite'?'精英':'普通'} · 敌方 ${enemies.length}只</span></div><div class="rg-battle"><div class="rg-team">${[...t].reverse().map((m,vi)=>monCard(m,run,t.length-1-vi)).join('')}</div><div class="rg-vs">VS</div><div class="rg-team rg-enemy-team">${enemies.map(e=>enemyUnitCardHTML(e,false)).join('')}</div></div><p class="rg-note"><b>战力参考：</b>我方 ${teamPower} · 敌方总难度评分 ${enemyPower}。积分按每一只实际击杀敌人的难度评分分别加入。<br><b>速度：</b>${speedRuleText()}</p><button class="primary rg-mainbtn" data-rg-enter-battle>进入战斗</button></section>`}
function battleHTML(run){const b=run.battle,t=activeTeam(run),enemies=enemyList(b);return `${runHeader(run)}<section class="rg-panel"><div class="rg-title"><div><b>${b.kind==='boss'?'首领战':b.kind==='elite'?'精英战':'自动战斗'} · ${b.win?'胜利':'失败'}</b><small>敌方共 ${enemies.length} 只；每只拥有独立HP、速度行动条与难度评分</small></div><span>${b.atb?(b.actions||b.rounds)+' 次行动':b.rounds+' 回合'}</span></div><div class="rg-battle"><div class="rg-team">${[...t].reverse().map((m,vi)=>monCard(m,run,t.length-1-vi)).join('')}</div><div class="rg-vs">VS</div><div class="rg-team rg-enemy-team">${enemies.map(e=>enemyUnitCardHTML(e,true)).join('')}</div></div><p class="rg-note"><b>结果原因：</b>${b.reason||'根据双方属性、站位、遗物和随机暴击结算'} · 敌方总难度评分 ${b.difficultyRating||b.enemyPower||'-'} · 我方估值 ${b.teamPower||'-'}</p><div class="rg-battle-next-wrap"><button class="primary rg-mainbtn rg-battle-next-sticky" data-rg-battle-next>${b.win?'领取结果并继续':'结束远征'}</button></div><div class="rg-log">${b.logs.map(x=>`<div>${x}</div>`).join('')}</div></section>`}
function challengeHTML(run){const c=run.challenge,t=activeTeam(run),zone=z(run.zone),target=70+zone.tier*58+run.stage*12,mods=relicMods(run),gain=Math.round((250+run.stage*75)*nodeRewardScale(zone,run.stage));const preview=m=>{const v=st(m)[c.stat],bonus=c.stat===4?(mods.luck||0)*v:c.stat===3?(mods.spd||0)*v:c.stat===2?(mods.def||0)*v:c.stat===1?(mods.atk||0)*v:0,p=Math.max(.18,Math.min(.92,.52+(v+bonus-target)/Math.max(100,target)*.62));return{v,roll:Math.round(v+bonus),chance:Math.round(p*100),expected:Math.round(gain*p)}};return `${runHeader(run)}${runInventoryHTML(run)}${teamHTML(run)}<section class="rg-panel"><div class="rg-title"><div><b>${c.title}</b><small>${c.text}</small></div><span>判定：${STAT[c.stat]} · 目标约 ${target}</span></div><p class="rg-note">选择一只怪物处理这个事件。每个选项会直接显示成功率和成功后的回报，方便比较。</p><div class="rg-event-picks">${t.map((m,i)=>{const q=preview(m);return `<button class="secondary rg-event-pick" data-rg-event-member="${i}"><b>${monsterName(m)}</b><small>${STAT[c.stat]} ${q.v} · 判定值 ${q.roll}</small><span class="rg-event-odds"><i>成功率 <strong>${q.chance}%</strong></i><i>成功回报 <strong>+${gain} 灵能</strong></i><i>期望灵能 <strong>${q.expected}</strong></i></span><small>额外：道具 30% · 遗物 35%</small></button>`}).join('')}</div></section>`}
function challengeResultHTML(run){const r=run.challengeResult||{},m=persistentMonster(r.memberId),tone=r.success?'#2f6d3d':'#9a2b25';return `${runHeader(run)}${runInventoryHTML(run)}${teamHTML(run)}<section class="rg-panel"><div class="rg-title"><div><b>${r.success?'事件成功':'事件失败'} · ${r.title||'特殊事件'}</b><small>结果会保留在本局 Log；看完后再继续路线</small></div><span style="color:${tone};font-weight:900">${r.success?'SUCCESS':'FAILED'}</span></div><div class="rg-card" style="margin-top:9px;border-left:6px solid ${tone}"><b>${r.memberName||'怪物'} · ${r.stat||'能力'} ${r.baseValue??'-'}</b><small>本次判定值 ${r.value??'-'} · 目标约 ${r.target??'-'} · 成功率约 ${r.chance??'-'}%</small><div class="rg-log" style="margin-top:8px;max-height:none">${(r.lines||[]).map(x=>`<div>${x}</div>`).join('')}</div></div><button class="primary rg-mainbtn" data-rg-event-continue>继续远征</button></section>`}
function continueChallenge(run){const r=run.challengeResult;if(!r)return;const after=r.after;run.challengeResult=null;run.challenge=null;if(after==='relic')offerRelic(run);else advance(run)}
function relicCounts(run){
  const m={};for(const id of run.relics||[])m[id]=(m[id]||0)+1;return m;
}
const RELIC_ICON_FALLBACKS={
  relicWarBanner:'hunterHorn',
  buffResonator:'sacredPage',
  digitChaosCube:'boneDice',
  formationCompass:'treasureCompass',
  dodgeCounterBlade:'blade',
  phoenixCore:'heart',
  absoluteGuard:'guard',
  energyShield100:'shell',
  energyShield250:'ironPendant',
  vulnerabilityMark:'fang',
  armorBreakSeal:'thornBrace',
  openingSunder:'blade',
  stackingWound:'thornBrace',
  bossBreaker:'hunterHorn'
};
function relicIconAssetId(id){return RELIC_ICON_FALLBACKS[id]||id}
function relicIconHTML(id,count=1,small=false){
  const r=RELICS.find(x=>x.id===id);
  if(!r)return '';
  const assetId=relicIconAssetId(r.id);
  return `<span class="rg-relic-chip ${small?'small':''}" data-rg-relic-id="${r.id}" data-rg-relic-count="${count}" tabindex="0" role="button" aria-label="${r.name}${count>1?' x'+count:''}：${r.text}" aria-expanded="false"><img class="rg-relic-icon" src="assets/relics/${assetId}.png?v=263" alt="${r.name}" width="64" height="64" onerror="this.onerror=null;this.src='assets/relics/fateWeight.png?v=263'">${count>1?`<b class="rg-relic-count">x${count}</b>`:''}<em><strong>${r.name}${count>1?' x'+count:''}</strong><span>${r.text}</span>${count>1?`<small>当前持有 ${count} 个；可叠加的数值效果已经按数量累计。</small>`:''}</em></span>`;
}
function relicTrayHTML(run){
  const c=relicCounts(run),ids=Object.keys(c);return ids.length?`<div class="rg-relic-tray">${ids.map(id=>relicIconHTML(id,c[id],true)).join('')}</div>`:'<p class="rg-note">暂时没有遗物</p>';
}
function ensureRelicDetailDock(){
  let dock=document.getElementById('rg-relic-detail-dock');
  if(dock)return dock;
  if(!document.getElementById('rg-relic-detail-dock-style')){
    const st=document.createElement('style');st.id='rg-relic-detail-dock-style';
    st.textContent='#rg-relic-detail-dock{position:fixed;right:14px;top:96px;z-index:10050;width:min(310px,calc(100vw - 28px));max-height:calc(100vh - 120px);overflow:auto;background:#d6d5da;color:#222;border:4px solid #29262f;box-shadow:6px 6px 0 rgba(0,0,0,.45);padding:10px}#rg-relic-detail-dock[hidden]{display:none!important}.rg-relic-detail-head{display:flex;justify-content:space-between;align-items:center;gap:8px;padding-bottom:7px;border-bottom:3px solid #77727f}.rg-relic-detail-head b{font-size:13px}.rg-relic-detail-close{padding:3px 7px!important}.rg-relic-detail-main{display:grid;grid-template-columns:82px 1fr;gap:10px;align-items:center;margin-top:10px}.rg-relic-detail-main img{width:78px;height:78px;object-fit:contain;background:#20232b;border:3px solid #77727f;image-rendering:pixelated}.rg-relic-detail-main h3{margin:0 0 6px;color:#8d2d28;font-size:17px}.rg-relic-detail-main p{margin:0;font-size:11px;line-height:1.55}.rg-relic-detail-stack{margin-top:10px;padding:7px;background:#ece8d8;border:2px solid #8e8775;font-size:10px;line-height:1.5}.rg-relic-chip.detail-selected{outline:3px solid #f2c451;outline-offset:2px}.rg-relic-chip em{display:none!important}@media(max-width:900px){#rg-relic-detail-dock{left:10px;right:10px;top:auto;bottom:10px;width:auto;max-height:42vh}.rg-relic-detail-main{grid-template-columns:66px 1fr}.rg-relic-detail-main img{width:62px;height:62px}}';
    document.head.appendChild(st);
  }
  dock=document.createElement('aside');dock.id='rg-relic-detail-dock';dock.hidden=true;dock.setAttribute('aria-live','polite');dock.innerHTML='<div class="rg-relic-detail-head"><b>遗物详情</b><button type="button" class="secondary rg-relic-detail-close" data-rg-relic-detail-close>×</button></div><div data-rg-relic-detail-body></div>';
  document.body.appendChild(dock);
  return dock;
}
function showRelicDetails(id,count=1){
  const r=RELICS.find(x=>x.id===id);if(!r)return;
  const dock=ensureRelicDetailDock(),body=dock.querySelector('[data-rg-relic-detail-body]'),assetId=relicIconAssetId(r.id),n=Math.max(1,Number(count)||1);
  body.innerHTML=`<div class="rg-relic-detail-main"><img src="assets/relics/${assetId}.png?v=263" alt="${r.name}" onerror="this.onerror=null;this.src='assets/relics/fateWeight.png?v=263'"><div><h3>${r.name}${n>1?' ×'+n:''}</h3><p>${r.text}</p></div></div><div class="rg-relic-detail-stack">${n>1?`当前显示数量：<b>${n}</b>。如果该遗物属于可叠加效果，数值会按实际持有数量累计。`:'点击其他遗物图标可直接在这里切换详情，不需要回到页面上方。'}</div>`;
  dock.hidden=false;
  document.querySelectorAll('.rg-relic-chip.detail-selected').forEach(x=>x.classList.remove('detail-selected'));
  document.querySelectorAll(`.rg-relic-chip[data-rg-relic-id="${id}"]`).forEach(x=>x.classList.add('detail-selected'));
}
function relicHTML(run){const counts=relicCounts(run);return `${runHeader(run)}${runInventoryHTML(run)}${teamHTML(run)}<section class="rg-panel"><div class="rg-title"><div><b>遗物三选一</b><small>点击图标查看详情；重复遗物只显示一个图标，并标注 x2 / x3</small></div></div>${relicTrayHTML(run)}<div class="rg-relics" style="margin-top:10px">${run.relicChoices.map(id=>{const r=RELICS.find(x=>x.id===id),n=(counts[id]||0)+1;return `<article class="rg-relic rg-relic-card">${relicIconHTML(id,n,false)}<div><b>${r.name}${counts[id]?` · 获得后 x${n}`:''}</b><p>${r.text}</p><button class="secondary" data-rg-relic="${id}">选择此遗物</button></div></article>`}).join('')}</div></section>`}
function finalHTML(run){return `${runHeader(run)}${runInventoryHTML(run)}<section class="rg-panel"><div class="rg-title"><div><b>首领宝库 · 永久奖励三选一</b><small>这个奖励会真正带回牧场；远征材料之后用于远征兑换所</small></div></div><div class="rg-final">${run.finalChoices.map((c,i)=>`<button class="primary rg-relic" data-rg-final="${i}"><b>${c.title}</b><span>${c.text}</span></button>`).join('')}</div></section>`}
function activeHTML(run){if(run.phase==='eggMilestone')return eggMilestoneHTML(run);if(run.phase==='treasureResult')return treasureResultHTML(run);if(run.phase==='floorBossChoice')return floorBossChoiceHTML(run);if(run.phase==='training')return trainingHTML(run);if(run.phase==='temple')return templeHTML(run);if(run.phase==='camp')return campHTML(run);if(run.phase==='templeResult')return templeResultHTML(run);if(run.phase==='battlePreview')return battlePreviewHTML(run);if(run.phase==='battleResult')return battleHTML(run);if(run.phase==='challenge')return challengeHTML(run);if(run.phase==='challengeResult')return challengeResultHTML(run);if(run.phase==='relic')return relicHTML(run);if(run.phase==='final')return finalHTML(run);return `${runHeader(run)}${runInventoryHTML(run)}${teamHTML(run)}${nodeHTML(run)}<details class="rg-panel"><summary>本局遗物与记录</summary>${relicTrayHTML(run)}<div class="rg-log">${run.log.slice(-8).reverse().map(x=>`<div>${x}</div>`).join('')}</div></details>`}

function expeditionTransferCost(m){return ({1:1000,2:3000,3:10000,4:25000,5:50000})[Math.max(1,Math.min(5,Number(m?.star)||1))]||1000}
let pendingTransferId=null;
function expeditionBoxExpandCost(e){const bought=Math.max(0,Math.floor((Math.max(10,Number(e?.boxCapacity)||10)-10)/5));return Math.min(2000000,Math.round(50000*Math.pow(1.45,bought)/1000)*1000)}
function traitText(m){const t=expeditionTraitFor(m);return `${t.name}：${STAT[t.stat]} +${t.flat}`}
function raceText(m){const a=speciesBattleMultipliers(m);return STAT.map((n,i)=>`${n}×${a[i].toFixed(2)}`).join(' · ')}
function statsText(v){return STAT.map((n,i)=>`${n}${fmt2(v[i])}`).join(' · ')}
function transferToExpedition(id){const s=S(),e=ensure(),r=R();if(!s||!e||!r||e.rogueActive)return false;id=Number(id);const idx=(s.monsters||[]).findIndex(m=>m.id===id);if(idx<0)return false;const m=s.monsters[idx],cost=expeditionTransferCost(m);if(r.isDispatched?.(id))return r.tell?.('派遣中的怪物不能转入远征Box。'),false;if((e.box||[]).length>=e.boxCapacity)return r.tell?.('远征Box已满，请先扩建。'),false;if((Number(s.energy)||0)<cost)return r.tell?.(`灵能不足：${stars(m)} 转籍需要 ${cost.toLocaleString()} 灵能。`),false;s.energy-=cost;m.expeditionTrait=expeditionTraitFor(m);m.expeditionTransferredAt=Date.now();s.monsters.splice(idx,1);e.box.push(m);if(Array.isArray(s.farmIds))s.farmIds=s.farmIds.filter(x=>Number(x)!==id);if(Number(s.parentA)===id)s.parentA=null;if(Number(s.parentB)===id)s.parentB=null;if(Array.isArray(s.manualBreedPairIds))s.manualBreedPairIds=s.manualBreedPairIds.filter(x=>Number(x)!==id);if(Array.isArray(s.manualDispatchTeamIds))s.manualDispatchTeamIds=s.manualDispatchTeamIds.filter(x=>Number(x)!==id);selected=selected.filter(x=>Number(x)!==id);save(`${monsterName(m)} 已转入远征Box：-${cost.toLocaleString()} 灵能 · ${traitText(m)}${m.shiny?' · 闪光五维 +5%':''}。`);return true}
function expandExpeditionBox(){const s=S(),e=ensure();if(!s||!e||e.rogueActive)return;if(e.boxCapacity>=200)return R()?.tell?.('远征Box容量已达到上限 200。');const cost=expeditionBoxExpandCost(e);if((Number(s.energy)||0)<cost)return R()?.tell?.(`灵能不足，需要 ${cost.toLocaleString()}。`);s.energy-=cost;e.boxCapacity=Math.min(200,e.boxCapacity+5);save(`远征Box扩建至 ${e.boxCapacity} 格。`)}
function expeditionBoxRosterHTML(e){syncAllExpeditionRest(e);const esc=window.QinsterPicker.esc,pool=[...(e.box||[])];if(!pool.length)return '<p class="rg-note">远征Box还是空的。请从下方牧场Box转入怪物。</p>';const cfg=R().monsterPickerConfig('远征Box',pool,{originalLabel:'总战力推荐',recommended:new Set([...pool].sort((a,b)=>recommendScore(b)-recommendScore(a)).slice(0,3).map(m=>m.id)),recommendationNote:'按远征种族值修正后的能力推荐'});cfg.items.forEach(i=>{const m=i.value,sk=battleSkillFor(m);i.search=[i.search,sk.name,sk.text,traitText(m),raceText(m)].join(' ');i.description=`远征 ${statsText(st(m))}\n牧场原值 ${statsText(ranchStats(m))}`;i.facets.skill=[sk.name];i.facets.status=['远征Box'];i.battleSkill=sk});cfg.card=i=>{const m=i.value,sk=i.battleSkill;return `<article class="qp-card rg-exp-box-card">${i.art||''}<span class="qp-copy"><strong>${esc(i.title)} · #${m.id}</strong><small>${esc(i.description)}</small><span class="rg-exp-trait"><b>生命 / Rest</b> <span data-rg-rest-id="${m.id}">${esc(expeditionRestText(m))}</span></span><span class="rg-exp-trait"><b>种族值</b> ${esc(raceText(m))}</span><span class="rg-exp-trait"><b>突破技能</b> ${esc(traitText(m))}</span><details class="rg-exp-skill"><summary>⚔ ${esc(sk.name)}</summary><small>每次行动20%触发 · ${esc(sk.text||'无额外效果')}</small></details></span></article>`};return window.QinsterPicker.html('expedition-box-roster',cfg)}
function expeditionTransferPickerHTML(e){const esc=window.QinsterPicker.esc,s=S(),r=R(),pool=[...(s?.monsters||[])].filter(m=>m&&m.life>0);if(!pool.length)return '<p class="rg-note">牧场Box没有可转入的怪物。</p>';const cfg=r.monsterPickerConfig('从牧场转入远征Box',pool,{originalLabel:'远征潜力推荐',recommended:new Set([...pool].sort((a,b)=>recommendScore(b)-recommendScore(a)).slice(0,5).map(m=>m.id)),recommendationNote:'按转入后的种族值 + 突破技能预测排序'});cfg.items.forEach(i=>{const m=i.value,sk=battleSkillFor(m),projected=expeditionStats(m);i.search=[i.search,sk.name,sk.text,traitText(m),raceText(m)].join(' ');i.description=`牧场 ${statsText(ranchStats(m))}\n转入预计 ${statsText(projected)}`;i.facets.skill=[sk.name];i.facets.status=[r.isDispatched?.(m.id)?'派遣中':'牧场Box'];i.battleSkill=sk;i.transferCost=expeditionTransferCost(m);i.transferDisabled=!!r.isDispatched?.(m.id)||(Number(s?.energy)||0)<i.transferCost});cfg.sorts=[{id:'original',label:'远征潜力 · 高到低',compare:(a,b)=>recommendScore(b.value)-recommendScore(a.value)},...(cfg.sorts||[]).filter(x=>x.id!=='original')];cfg.card=i=>{const m=i.value,sk=i.battleSkill;return `<article class="qp-card rg-exp-box-card">${i.art||''}<span class="qp-copy"><strong>${esc(i.title)} · #${m.id}</strong><small>${esc(i.description)}</small><span class="rg-exp-trait"><b>种族值</b> ${esc(raceText(m))}</span><span class="rg-exp-trait"><b>转入突破</b> ${esc(traitText(m))}</span>${m.shiny?'<span class="rg-exp-trait"><b>闪光加成</b> 远征基础五维 +5%</span>':''}<span class="rg-exp-trait"><b>转籍费用</b> ${i.transferCost.toLocaleString()} 灵能</span><details class="rg-exp-skill"><summary>⚔ ${esc(sk.name)}</summary><small>每次行动20%触发 · ${esc(sk.text||'无额外效果')}</small></details><button type="button" class="secondary" data-rg-transfer="${m.id}" ${i.transferDisabled?'disabled':''}>${r.isDispatched?.(m.id)?'派遣中不可转入':(Number(s?.energy)||0)<i.transferCost?'灵能不足':`转入远征Box · ${i.transferCost.toLocaleString()}`}</button></span></article>`};return window.QinsterPicker.html('expedition-transfer',cfg)}
function transferModalHTML(){const s=S(),e=ensure(),id=Number(pendingTransferId);if(!id||!s||!e)return '';const m=(s.monsters||[]).find(x=>Number(x.id)===id);if(!m){pendingTransferId=null;return ''}const esc=window.QinsterPicker.esc,cost=expeditionTransferCost(m),before=ranchStats(m),after=expeditionStats(m),sk=battleSkillFor(m),sp=R()?.G?.SPECIES?.[m.species]||{},fmt=v=>Math.round((Number(v)||0)*10)/10;return `<div class="rg-transfer-overlay" data-rg-transfer-overlay><section class="rg-transfer-modal" role="dialog" aria-modal="true" aria-label="确认转入远征Box"><div class="rg-transfer-head"><div><b>确认转入远征Box</b><small>转籍后将离开牧场Box，无法再用于牧场配种与派遣</small></div><button type="button" class="secondary rg-transfer-x" data-rg-transfer-cancel>×</button></div><div class="rg-transfer-mon">${R()?.sprite?.(m.species,m.tint,m.shiny,m.specialColor)||''}<div><strong>${esc(monsterName(m))} #${m.id} ${stars(m)}${m.shiny?' ✦闪光':''}</strong><small>${esc(sp.name||'未知种族')} · ${esc(m.gender||'')}</small><span class="rg-transfer-cost">转籍费用 <b>${cost.toLocaleString()} 灵能</b></span></div></div><div class="rg-transfer-compare"><div><b>牧场原值</b>${STAT.map((n,i)=>`<span>${n}<strong>${fmt(before[i])}</strong></span>`).join('')}</div><i>→</i><div><b>远征基础值</b>${STAT.map((n,i)=>`<span>${n}<strong>${fmt(after[i])}</strong></span>`).join('')}</div></div><div class="rg-transfer-details"><p><b>种族值</b><span>${esc(raceText(m))}</span></p><p><b>突破技能</b><span>${esc(traitText(m))}</span></p>${m.shiny?'<p class="shiny"><b>闪光加成</b><span>远征基础五维 +5%</span></p>':''}<p><b>战斗技能</b><span>${esc(sk.name)} · ${esc(sk.text||'无额外效果')}</span></p></div><div class="rg-transfer-warning">⚠ 此操作为单向转籍。怪物会从牧场Box移除，但星级、生命、颜色、闪光、家族与技能都会保留。</div><div class="rg-transfer-actions"><button type="button" class="secondary" data-rg-transfer-cancel>取消</button><button type="button" class="primary" data-rg-transfer-confirm="${m.id}">确认转入 · ${cost.toLocaleString()} 灵能</button></div></section></div>`}
function expeditionBoxHTML(e){const cost=expeditionBoxExpandCost(e),full=e.boxCapacity>=200;return `<style>.rg-transfer-overlay{position:fixed;inset:0;z-index:5000;background:rgba(20,18,28,.76);display:grid;place-items:center;padding:18px}.rg-transfer-modal{width:min(720px,94vw);max-height:90vh;overflow:auto;background:#d9d9df;border:4px solid #272432;box-shadow:8px 8px 0 rgba(0,0,0,.55);padding:14px;color:#171622}.rg-transfer-head{display:flex;justify-content:space-between;gap:12px;align-items:start;border-bottom:3px solid #5a5865;padding-bottom:10px}.rg-transfer-head b{font-size:18px}.rg-transfer-head small{display:block;margin-top:4px}.rg-transfer-x{min-width:38px;font-size:18px}.rg-transfer-mon{display:flex;gap:14px;align-items:center;margin:14px 0;padding:10px;background:#c8c8cf;border:2px solid #777481}.rg-transfer-mon .sprite{flex:0 0 auto}.rg-transfer-mon strong,.rg-transfer-mon small,.rg-transfer-cost{display:block}.rg-transfer-cost{margin-top:7px}.rg-transfer-cost b{color:#7d4b00}.rg-transfer-compare{display:grid;grid-template-columns:1fr 30px 1fr;gap:8px;align-items:center}.rg-transfer-compare>div{border:2px solid #777481;background:#ececf0;padding:8px}.rg-transfer-compare>div>b{display:block;margin-bottom:6px}.rg-transfer-compare span{display:grid;grid-template-columns:1fr auto;border-top:1px solid #bbb;padding:3px 0}.rg-transfer-compare i{text-align:center;font-style:normal;font-size:22px;font-weight:bold}.rg-transfer-details{margin-top:10px;display:grid;gap:6px}.rg-transfer-details p{margin:0;padding:7px;border:2px solid #777481;background:#ececf0}.rg-transfer-details p b{display:inline-block;min-width:74px}.rg-transfer-details p.shiny{background:#fff0b8}.rg-transfer-warning{margin-top:10px;padding:9px;background:#fff3cf;border:2px solid #b07818}.rg-transfer-actions{display:grid;grid-template-columns:1fr 1.4fr;gap:8px;margin-top:12px}.rg-transfer-actions button{min-height:42px}@media(max-width:620px){.rg-transfer-compare{grid-template-columns:1fr}.rg-transfer-compare>i{transform:rotate(90deg)}.rg-transfer-actions{grid-template-columns:1fr}.rg-transfer-modal{padding:10px}}</style>${idleNav()}<section class="rg-panel"><div class="rg-title"><div><b>远征Box · ${e.box.length}/${e.boxCapacity}</b><small>与牧场Box完全分离。转入为单向转籍，不会复制怪物；牧场能力最高500，远征会应用种族值和突破技能，可超过500。</small></div><button class="secondary" data-rg-box-expand ${full?'disabled':''}>${full?'容量 MAX 200':`扩建 +5 · ${cost.toLocaleString()} 灵能`}</button></div><p class="rg-note"><b>转籍规则：</b>转入后怪物会从牧场Box移除，不能再用于牧场配种/派遣。费用：1★ 1,000 · 2★ 3,000 · 3★ 10,000 · 4★ 25,000 · 5★ 50,000 灵能。闪光怪转入后远征基础五维额外 +5%。<br><b>远征生命：</b>每次出发消耗1生命；生命每30分钟自动恢复1点（离线也计算）。0生命进入Rest，恢复到1即可再次出发。战斗HP归0不会直接死亡；只有整次远征失败才会触发死亡/重伤判定。</p>${expeditionBoxRosterHTML(e)}</section><section class="rg-panel"><div class="rg-title"><div><b>牧场 → 远征 转籍</b><small>卡片同时显示牧场原值和转入后的预计远征值，方便判断谁更适合战斗。</small></div><span>剩余 ${Math.max(0,e.boxCapacity-e.box.length)} 格</span></div>${expeditionTransferPickerHTML(e)}</section>${transferModalHTML()}`}

let pickerSlot=0;
function expeditionPickerHTML(){
 const pool=[...eligible(z())].sort((a,b)=>recommendScore(b)-recommendScore(a));
 const cfg=R().monsterPickerConfig('远征队员 · '+['前卫','中卫','后卫'][pickerSlot],pool,{originalLabel:'远征最佳推荐',recommended:new Set(pool.slice(0,3).map(m=>m.id)),recommendationNote:'沿用远征能力与队伍强度评分；排序不会改变推荐名单',selected:new Set(selected.filter(Boolean)),choose:i=>{const id=i.value.id;if(selected[pickerSlot]===id)selected[pickerSlot]=null;else{const old=selected.indexOf(id);if(old>=0)selected[old]=null;selected[pickerSlot]=id;const empty=[0,1,2].find(n=>!selected[n]);if(empty!==undefined)pickerSlot=empty}render()}});
 const esc=window.QinsterPicker.esc;
 cfg.placeholder='名字 / 战斗技能 / #编号';
 cfg.items.forEach(i=>{
   const m=i.value,sp=R()?.G?.SPECIES?.[m.species]||{},skill=battleSkillFor(m)||{name:'普通攻击',text:'无额外战斗技能'};
   i.search=[monsterName(m),'#'+m.id,sp.name||'',skill.name||'',skill.text||''].join(' ');
   i.description=`${sp.name||'未知种族'} · ${m.gender||''} · ${m.life}/${m.maxLife} 生命`;
   i.facets={...(i.facets||{}),skill:[skill.name||'普通攻击']};
   i.battleSkill=skill;
 });
 cfg.facets=(cfg.facets||[]).map(f=>f.id==='skill'?{...f,label:'战斗技能'}:f);
 cfg.card=i=>{const sk=i.battleSkill||{name:'普通攻击',text:'无额外战斗技能'},typeMap={attack:'攻击',attackGauge:'攻击/行动条',attackDebuff:'攻击/Debuff',attackSelfGauge:'攻击/自充能',drain:'吸血攻击',buff:'Buff',debuff:'Debuff',heal:'治疗',healall:'群体治疗',healBuff:'治疗/Buff',selfheal:'自愈'},kind=typeMap[sk.type]||'战斗技能',chance='每次行动 20% 概率使用',v=st(i.value),total=v.reduce((a,b)=>a+(Number(b)||0),0),statLine=`HP ${fmt2(v[0])} · 攻 ${fmt2(v[1])} · 防 ${fmt2(v[2])} · 速 ${fmt2(v[3])} · 运 ${fmt2(v[4])}`;return `<article class="qp-card rg-exp-picker-card ${i.selected?'selected':''}"><button type="button" class="rg-exp-pick-main" data-qp-item="${esc(i.id)}" aria-pressed="${!!i.selected}" ${i.disabled?'disabled':''}>${i.art||''}<span class="qp-copy"><strong>${esc(i.title)}</strong><small>${esc(i.description)}</small><small><b>远征五维</b> ${esc(statLine)}</small><small><b>总能力</b> ${fmt2(total)} · <b>生命</b> ${Math.max(0,Number(i.value.life)||0)}/${maxLifeOf(i.value)}</small><span class="qp-badges">${i.recommended?'<em>推荐</em>':''}${i.selected?'<em>✓ 已选</em>':''}</span></span></button><details class="rg-exp-skill"><summary>⚔ ${esc(sk.name||'普通攻击')}</summary><small><b>${esc(kind)}</b> · ${esc(chance)}<br>${esc(sk.text||'无额外效果')}</small></details></article>`};
 return '<div class="qp-slotbar">'+[0,1,2].map(i=>'<button type="button" class="secondary" data-rg-picker-slot="'+i+'" aria-pressed="'+(pickerSlot===i)+'">'+['前卫','中卫','后卫'][i]+'<small>'+window.QinsterPicker.esc((team().find(m=>m.id===selected[i])?monsterName(team().find(m=>m.id===selected[i])):'待选择'))+'</small></button>').join('')+'</div>'+window.QinsterPicker.html('expedition',cfg);
}
function idleHTML(e){if(idleTab==='meta')return `<div class="rogue">${metaTreeHTML(e)}</div>`;if(idleTab==='ladder')return `<div class="rogue">${ladderHTML(e)}</div>`;if(idleTab==='box')return `<div class="rogue">${expeditionBoxHTML(e)}</div>`;const zone=z(),d=diff(),unlock=Math.max(0,Number(e.difficultyUnlocked?.[zone.id])||0),free=freeRemain(e,zone),bonus=bonusAttempts(e,zone),remain=free+bonus;return `<div class="rogue">${idleNav()}<section class="rg-panel"><div class="rg-title"><div><b>选择远征地图</b><small>原来的1–5星难度已合并；普通远征允许任何1–5★怪物</small></div><span class="rg-materials">徽章 ${e.badges} · 遗物尘 ${e.loot.relicDust} · 星辉结晶 ${e.loot.starCrystal} · 基础碎片 ${e.loot.eggFragment} · 秘藏碎片 ${e.loot.expeditionEggFragment||0} · 闪光碎片 ${e.loot.shinyEggFragment||0}</span></div><div class="rg-tabs">${ZONES.map(x=>`<button class="secondary ${x.id===selectedZone?'on':''}" data-rg-zone="${x.id}"><b>${x.label}</b><small>${x.desc}</small></button>`).join('')}</div></section><section class="rg-panel"><div class="rg-title"><div><b>${zone.label} · 选择难度</b><small>通关当前最高难度后解锁下一档；加成会累计</small></div><span>最高已解锁：难度 ${unlock}</span></div><div class="rg-tabs">${DIFFICULTIES.map(x=>`<button class="secondary ${x.id===selectedDifficulty?'on':''}" data-rg-difficulty="${x.id}" ${x.id<=unlock?'':'disabled'}><b>${x.label}${x.id>unlock?' 🔒':''}</b><small>${x.text} · 奖励 ×${x.reward.toFixed(2)}</small></button>`).join('')}</div><p class="rg-note"><b>${d.label}：</b>${d.text}。普通敌人数值会在约90%–110%随机；精英约105%–125%；大BOSS约120%–145%。难度4起会出现随机强化词条。</p></section><section class="rg-panel"><div class="rg-title"><div><b>准备出发</b><small>${zone.shinyOnly?'只允许闪光怪物；1–5★均可':'1–5★均可参加；难度0按1★队伍也有机会通关来平衡'}</small></div><span>27层 · BOSS在9 / 18 / 27层</span></div><div class="rg-status"><span>今日免费剩余 ${free}</span><span>追加次数 ${bonus}</span><span>次数药水 ×${e.attemptPotions||0}</span></div><div style="display:flex;gap:8px;flex-wrap:wrap;margin:8px 0"><button class="secondary" data-rg-buy-attempt>购买药水 100,000 灵能</button><button class="secondary" data-rg-use-attempt ${(e.attemptPotions||0)>0?'':'disabled'}>使用药水：本地图/难度 +1次</button></div><p class="rg-note">三个大BOSS都会给蛋碎片；难度越高，碎片和整体奖励越高。第三名BOSS还会进入最终奖励三选一。</p><div class="rg-title"><div><b>选择3只远征Box怪物 · 点击席位后选择卡片</b><small>当前远征Box ${e.box.length}/${e.boxCapacity}${e.box.length<3?' · 至少需要3只，请先到远征Box转入怪物':''}</small></div><button class="secondary" data-rg-recommend>一键最佳推荐</button></div>${expeditionPickerHTML()}${team().length?`<div class="rg-team" style="margin-top:8px">${[...team()].reverse().map((m,vi)=>{const i=team().length-1-vi;return `<div class="rg-mon">${R()?.sprite?.(m.species,m.tint,m.shiny,m.specialColor)||''}<b>${monsterName(m)} ${stars(m)}</b><small>${['前卫','中卫','后卫'][i]} · 总能力 ${fmt2(st(m).reduce((a,b)=>a+b,0))}</small></div>`}).join('')}</div>`:''}<button class="primary rg-mainbtn" data-rg-start ${team().length===3&&remain>0&&selectedDifficulty<=unlock?'':'disabled'}>开始 ${zone.label} · ${d.label}</button></section>${eggWorkshopHTML(e)}${e.rogueLast?`<section class="rg-panel"><b>上次远征</b><small>${e.rogueLast.zone} · 难度 ${e.rogueLast.difficulty||0} · ${e.rogueLast.cleared?'通关':e.rogueLast.defeated?'战败':'撤退'} · ${e.rogueLast.payout} 灵能 · 徽章 ×${e.rogueLast.badge}</small></section>`:''}</div>`}
let restTicker=null;function refreshRestCountdowns(){const e=ensure();if(!e)return;document.querySelectorAll('[data-rg-rest-id]').forEach(el=>{const m=(e.box||[]).find(x=>Number(x.id)===Number(el.dataset.rgRestId));if(m)el.textContent=expeditionRestText(m,Date.now())})}function ensureRestTicker(){if(restTicker!=null)return;restTicker=setInterval(refreshRestCountdowns,1000)}function render(){injectStyle();ensureRelicDetailDock();const box=document.getElementById('expedition-content');if(!box)return;const e=ensure();if(!e)return;if(!e.rogueActive)closeRelicDetails();box.innerHTML=e.rogueActive?`<div class="rogue">${activeHTML(e.rogueActive)}</div>`:idleHTML(e);if(e.rogueActive)decorateFinalStats(e.rogueActive);ensureRestTicker();refreshRestCountdowns()}
document.addEventListener('click',ev=>{const fp=ev.target.closest?.('[data-rg-set-position]');if(fp){const run=ensure()?.rogueActive;if(run)setFormationPosition(run,fp.dataset.rgMonsterId,fp.dataset.rgSetPosition);return}const ps=ev.target.closest?.('[data-rg-picker-slot]');if(ps){pickerSlot=Number(ps.dataset.rgPickerSlot);render();return}const tab=ev.target.closest?.('[data-rg-idle-tab]');if(tab){idleTab=tab.dataset.rgIdleTab||'run';render();return}const tr=ev.target.closest?.('[data-rg-transfer]');if(tr){pendingTransferId=Number(tr.dataset.rgTransfer);render();return}if(ev.target.closest?.('[data-rg-transfer-cancel]')||ev.target.matches?.('[data-rg-transfer-overlay]')){pendingTransferId=null;render();return}const trc=ev.target.closest?.('[data-rg-transfer-confirm]');if(trc){const id=Number(trc.dataset.rgTransferConfirm);pendingTransferId=null;transferToExpedition(id);return}if(ev.target.closest?.('[data-rg-box-expand]')){expandExpeditionBox();return}const mb=ev.target.closest?.('[data-rg-meta-buy]');if(mb){buyMeta(mb.dataset.rgMetaBuy);return}const eggm=ev.target.closest?.('[data-rg-egg-milestone]');if(eggm){const run=ensure()?.rogueActive;if(run)chooseEggMilestone(run,Number(eggm.dataset.rgEggMilestone));return}const rc=ev.target.closest?.('.rg-relic-chip');if(rc&&!ev.target.closest?.('[data-rg-relic]')){ev.preventDefault();ev.stopPropagation();showRelicDetails(rc.dataset.rgRelicId,Number(rc.dataset.rgRelicCount)||1);return;}const stat=ev.target.closest?.('[data-rg-stat-toggle]');if(stat){ev.preventDefault();ev.stopPropagation();document.querySelectorAll('.rg-final-stat.open').forEach(x=>{if(x!==stat)x.classList.remove('open')});stat.classList.toggle('open');return;}const zone=ev.target.closest?.('[data-rg-zone]');if(zone){selectedZone=zone.dataset.rgZone;selectedDifficulty=0;selected=[];const e=ensure();if(e){e.lastZone=selectedZone;e.lastDifficulty=0}save();return}const difficulty=ev.target.closest?.('[data-rg-difficulty]');if(difficulty){const e=ensure(),n=Number(difficulty.dataset.rgDifficulty)||0;if(n<=(e?.difficultyUnlocked?.[selectedZone]||0)){selectedDifficulty=n;if(e)e.lastDifficulty=n;save()}return}if(ev.target.closest?.('[data-rg-buy-attempt]')){buyAttemptPotion();return}if(ev.target.closest?.('[data-rg-use-attempt]')){useAttemptPotion();return}const craft=ev.target.closest?.('[data-rg-craft-egg]');if(craft){const recipe=EGG_FRAGMENT_RECIPES.find(x=>x.id===craft.dataset.rgCraftEgg);if(recipe)makeFragmentEgg(recipe);return}if(ev.target.closest?.('[data-rg-recommend]')){selected=[...eligible(z())].sort((a,b)=>recommendScore(b)-recommendScore(a)).slice(0,3).map(m=>m.id);render();return}if(ev.target.closest?.('[data-rg-start]')){startRun();return}const item=ev.target.closest?.('[data-rg-item]');if(item){useRunItem(item.dataset.rgItem);return}if(ev.target.closest?.('[data-rg-rotate]')){const run=ensure()?.rogueActive;if(run)rotateFormation(run);return}const node=ev.target.closest?.('[data-rg-node]');if(node){chooseNode(Number(node.dataset.rgNode));return}const tpc=ev.target.closest?.('[data-rg-temple-choice]');if(tpc){const run=ensure()?.rogueActive;if(run)chooseTemple(run,Number(tpc.dataset.rgTempleChoice));return}const tc=ev.target.closest?.('[data-rg-training-choice]');if(tc){const run=ensure()?.rogueActive;if(run)chooseTraining(run,Number(tc.dataset.rgTrainingChoice));return}const em=ev.target.closest?.('[data-rg-event-member]');if(em){const run=ensure()?.rogueActive;if(run)resolveChallenge(run,Number(em.dataset.rgEventMember));return}if(ev.target.closest?.('[data-rg-event-continue]')){const run=ensure()?.rogueActive;if(run)continueChallenge(run);return}const cr=ev.target.closest?.('[data-rg-camp-revive]');if(cr){const run=ensure()?.rogueActive;if(run)campRevive(run,Number(cr.dataset.rgCampRevive));return}if(ev.target.closest?.('[data-rg-camp-leave]')){const run=ensure()?.rogueActive;if(run)leaveCamp(run);return}if(ev.target.closest?.('[data-rg-temple-next]')){const run=ensure()?.rogueActive;if(run){run.templeResult=null;advance(run)}return}if(ev.target.closest?.('[data-rg-treasure-next]')){const run=ensure()?.rogueActive;if(run)continueTreasure(run);return}const rel=ev.target.closest?.('[data-rg-relic]');if(rel){const run=ensure()?.rogueActive;if(run)chooseRelic(run,rel.dataset.rgRelic);return}if(ev.target.closest?.('[data-rg-enter-battle]')){const run=ensure()?.rogueActive;if(run?.pendingBattle)battle(run,run.pendingBattle.kind);return}if(ev.target.closest?.('[data-rg-battle-next]')){const run=ensure()?.rogueActive;if(run)continueBattle(run);return}if(ev.target.closest?.('[data-rg-floor-cashout]')){const run=ensure()?.rogueActive;if(run)cashoutFloor(run);return}if(ev.target.closest?.('[data-rg-floor-continue]')){const run=ensure()?.rogueActive;if(run)continueEndlessFloor(run);return}const fin=ev.target.closest?.('[data-rg-final]');if(fin){const run=ensure()?.rogueActive;if(run)chooseFinal(run,Number(fin.dataset.rgFinal));return}if(ev.target.closest?.('[data-rg-abandon]'))abandon()});
document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&pendingTransferId){pendingTransferId=null;render();return}const rc=ev.target.closest?.('.rg-relic-chip');if(rc&&(ev.key==='Enter'||ev.key===' ')){ev.preventDefault();rc.click();}if(ev.key==='Escape')closeRelicDetails();});
function positionRelicDetails(chip){
  if(window.matchMedia('(max-width:760px)').matches)return;
  const tip=chip.querySelector('em'),r=chip.getBoundingClientRect();
  const width=tip.offsetWidth||230,height=tip.offsetHeight||140;
  chip.style.setProperty('--relic-tip-left',Math.max(12,Math.min(r.left,window.innerWidth-width-12))+'px');
  chip.style.setProperty('--relic-tip-top',Math.max(12,Math.min(r.bottom+8,window.innerHeight-height-12))+'px');
}
for(const event of ['pointerover','focusin'])document.addEventListener(event,ev=>{const chip=ev.target.closest?.('.rg-relic-chip');if(chip)positionRelicDetails(chip);});
function closeRelicDetails(){const dock=document.getElementById('rg-relic-detail-dock');if(dock)dock.hidden=true;document.querySelectorAll('.rg-relic-chip.detail-selected').forEach(x=>x.classList.remove('detail-selected'));document.querySelectorAll('.rg-relic-chip.open').forEach(x=>{x.classList.remove('open');x.setAttribute('aria-expanded','false')});}
document.addEventListener('click',ev=>{if(ev.target.closest?.('[data-rg-relic-detail-close]')||ev.target.closest?.('#back-from-expedition'))closeRelicDetails();});
window.QinsterRelics={all:RELICS,iconHTML:relicIconHTML,trayHTML:relicTrayHTML};
window.QinsterExpedition={render,zones:ZONES,version:'v279'};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(render,0));else setTimeout(render,0);
})();
