window.__bootMark&&__bootMark('01 core 开始');

window.addEventListener('error',e=>{
  console.error('Qinster runtime error:',e.error||e.message);
});
'use strict';
(function(root){
const SPECIES=[
 {name:'苗芽团',element:'草木',skill:'丰收叶脉',effect:'自身灵能产量随技能等级提高；Lv10 +30%。',base:[38,8,12,10,12],color:'#79b47e',passive:'harvest'},
 {name:'焰角仔',element:'火焰',skill:'暖巢火绒',effect:'作为亲代时缩短孵化时间；Lv10 -25%，多个来源可叠加。',base:[33,16,9,12,8],color:'#da7856',passive:'incubate'},
 {name:'潮鳍獭',element:'水潮',skill:'潮盾',effect:'提高自身防御；Lv10 +40%，已计入能力值。',base:[37,10,16,8,9],color:'#74b8c8',passive:'guard'},
 {name:'月影狐',element:'月夜',skill:'月兆',effect:'作为亲代时提高升星概率；Lv10 +3.0pp。较高亲代已为 5★ 时，50% 转为保底。',base:[28,12,8,17,15],color:'#8c82bd',passive:'fortune'},
 {name:'晨辉狮',element:'晨光',skill:'辉庭祝福',effect:'在家园中提高全体灵能产量；Lv10 +10%，多只可叠加。',base:[43,15,12,10,11],color:'#d8b55c',passive:'aura'},
 {name:'岩背龟',element:'岩石',skill:'岩脉耐性',effect:'提高自身最大生命；Lv10 +20%。',base:[44,9,18,6,7],color:'#7f8b67',passive:'self_vitality'},
 {name:'雷羽隼',element:'雷风',skill:'雷仓蓄能',effect:'农场获得道具时额外获得灵能；Lv10 每次 +1000 灵能。',base:[31,15,9,18,10],color:'#6c86d6',passive:'farm_item_energy'},
 {name:'菇帽灵',element:'森林',skill:'菌道捷径',effect:'缩短所在队伍的派遣时间；Lv10 -10%。',base:[34,8,11,9,16],color:'#d38f8a',passive:'dispatch_fast'},
 {name:'角甲骑',element:'虫铠',skill:'血脉精炼',effect:'作为亲代时，后代有概率额外提升技能等级；Lv10 +5%。优先种族技能，满级后转普通/闪光技能；家族技能不受此效果直接升级。',base:[36,16,12,11,10],color:'#88a35d',passive:'skill_refine'},
 {name:'花刺犬',element:'花棘',skill:'沃土红利',effect:'农场获得道具时额外获得灵能，并提高自身产能；Lv10 +500 灵能且自身产能 +10%。',base:[35,12,11,14,12],color:'#88ba6d',passive:'farm_item_mix'},
 {name:'珊泡鱼',element:'海珊',skill:'双潮卵息',effect:'作为亲代时有概率形成双蛋；Lv10 +1%。',base:[32,9,13,16,12],color:'#d58a7c',passive:'twin_hatch'},
 {name:'霜耳兔',element:'冰霜',skill:'霜行反射',effect:'提高自身速度；Lv10 +25%。',base:[34,11,14,15,10],color:'#b2d6ea',passive:'self_speed'},
 {name:'黯翼胶',element:'夜影',skill:'暗脉承恩',effect:'作为亲代时，提高后代保留正面 Buff 的概率；Lv10 +5%。',base:[30,10,9,17,17],color:'#9d79c0',passive:'buff_preserve'},
 {name:'轰鳞蜥',element:'雷火',skill:'电浆增幅',effect:'提高自身农场灵能产量；Lv10 +20%。',base:[39,17,10,14,9],color:'#dcb056',passive:'farm_energy_20'},
 {name:'兰蝶灵',element:'花舞',skill:'花市溢价',effect:'出售自身时获得更多灵能；Lv10 售价 +50%。',base:[28,10,9,18,18],color:'#d3a0c9',passive:'sale_bonus'},
 {name:'云角绵',element:'云团',skill:'云染遗传',effect:'作为亲代时提高后代出现不同普通颜色的概率；Lv10 +5%。',base:[37,8,13,10,17],color:'#d8d2ea',passive:'color_mutation'},
 {name:'星穹水母',element:'星海',skill:'星潮遗传',effect:'作为亲代时提高正面 Buff 的普通技能继承率；Lv10 +5%。',base:[31,9,10,13,20],color:'#76a9da',passive:'buff_inherit'},
 {name:'夜烟浣',element:'烟影',skill:'夜育体魄',effect:'提高后代天生生命随机上限；最低仍为 5。Lv2/4/6/8/10 各 +1，Lv10 共 +5 HP。',base:[33,12,11,15,14],color:'#706a88',passive:'offspring_hp'}
];
const BASE_SPECIES_COUNT=SPECIES.length;
SPECIES.push(
{name:"芽团仔",element:"草原",skill:"新手领路",effect:"牧场巡查限定种族技能。",base:[30,9,9,15,15],color:'#b8cf8b',passive:"mission_success",exclusiveMission:'meadow'},
{name:"晨羽鸡",element:"草原",skill:"晨风寻物",effect:"牧场巡查限定种族技能。",base:[30,9,9,15,15],color:'#b8cf8b',passive:"mission_item",exclusiveMission:'meadow'},
{name:"软土鼹",element:"草原",skill:"土径护返",effect:"牧场巡查限定种族技能。",base:[30,9,9,15,15],color:'#b8cf8b',passive:"mission_guard",exclusiveMission:'meadow'},
{name:"露珠蜗",element:"草原",skill:"露草报酬",effect:"牧场巡查限定种族技能。",base:[30,9,9,15,15],color:'#b8cf8b',passive:"mission_reward",exclusiveMission:'meadow'},
{name:"短尾犬",element:"草原",skill:"围栏追迹",effect:"牧场巡查限定种族技能。",base:[30,9,9,15,15],color:'#b8cf8b',passive:"mission_hunt",exclusiveMission:'meadow'},
{name:"苔芽鹿",element:"林野",skill:"苔径领路",effect:"在原生派遣任务中提高队伍成功率；Lv10 最高 +2.5%。",base:[36, 11, 10, 15, 14],color:'#b7a7cf',passive:"mission_success",exclusiveMission:"forage",spriteBase:0,spriteHue:95},
{name:"蜜尾鼠",element:"林野",skill:"蜜仓嗅觉",effect:"在原生派遣任务中提高道具发现率；Lv10 最高 +2.5%。",base:[29, 9, 8, 17, 18],color:'#b7a7cf',passive:"mission_item",exclusiveMission:"forage",spriteBase:9,spriteHue:135},
{name:"风铃雀",element:"林野",skill:"林风回响",effect:"在原生派遣任务中提高灵能报酬；Lv10 最高 +15%。",base:[28, 13, 8, 20, 15],color:'#b7a7cf',passive:"mission_reward",exclusiveMission:"forage",spriteBase:6,spriteHue:185},
{name:"叶灯虫",element:"林野",skill:"叶灯护程",effect:"在原生派遣任务中强化归途保护；Lv10 时任务生命损耗额外 -1，最低仍扣 1。",base:[33, 10, 14, 12, 13],color:'#b7a7cf',passive:"mission_guard",exclusiveMission:"forage",spriteBase:8,spriteHue:105},
{name:"树皮犬",element:"林野",skill:"野径追迹",effect:"在原生派遣任务中提高限定怪物与稀有技能发现率。",base:[38, 14, 13, 13, 12],color:'#b7a7cf',passive:"mission_hunt",exclusiveMission:"forage",spriteBase:9,spriteHue:235},
{name:"溪鳍猫",element:"河谷",skill:"流线引航",effect:"在原生派遣任务中提高队伍成功率；Lv10 最高 +2.5%。",base:[34, 12, 10, 18, 15],color:'#b7a7cf',passive:"mission_success",exclusiveMission:"river",spriteBase:2,spriteHue:175},
{name:"泡泡蛙",element:"河谷",skill:"水泡寻藏",effect:"在原生派遣任务中提高道具发现率；Lv10 最高 +2.5%。",base:[35, 9, 13, 13, 18],color:'#b7a7cf',passive:"mission_item",exclusiveMission:"river",spriteBase:10,spriteHue:205},
{name:"苔甲虾",element:"河谷",skill:"潮汐回收",effect:"在原生派遣任务中提高灵能报酬；Lv10 最高 +15%。",base:[42, 13, 18, 8, 10],color:'#b7a7cf',passive:"mission_reward",exclusiveMission:"river",spriteBase:5,spriteHue:155},
{name:"流羽鸭",element:"河谷",skill:"顺流护返",effect:"在原生派遣任务中强化归途保护；Lv10 时任务生命损耗额外 -1，最低仍扣 1。",base:[32, 11, 10, 19, 14],color:'#b7a7cf',passive:"mission_guard",exclusiveMission:"river",spriteBase:6,spriteHue:235},
{name:"水镜狐",element:"河谷",skill:"镜流追迹",effect:"在原生派遣任务中提高限定怪物与稀有技能发现率。",base:[30, 12, 9, 17, 19],color:'#b7a7cf',passive:"mission_hunt",exclusiveMission:"river",spriteBase:3,spriteHue:275},
{name:"碑纹猿",element:"遗迹",skill:"碑路解析",effect:"在原生派遣任务中提高队伍成功率；Lv10 最高 +2.5%。",base:[41, 17, 14, 10, 11],color:'#b7a7cf',passive:"mission_success",exclusiveMission:"ruins",spriteBase:4,spriteHue:210},
{name:"铜铃鼬",element:"遗迹",skill:"古藏听觉",effect:"在原生派遣任务中提高道具发现率；Lv10 最高 +2.5%。",base:[32, 12, 10, 17, 17],color:'#b7a7cf',passive:"mission_item",exclusiveMission:"ruins",spriteBase:17,spriteHue:155},
{name:"石瞳鸦",element:"遗迹",skill:"残铭估价",effect:"在原生派遣任务中提高灵能报酬；Lv10 最高 +15%。",base:[29, 14, 10, 18, 17],color:'#b7a7cf',passive:"mission_reward",exclusiveMission:"ruins",spriteBase:12,spriteHue:245},
{name:"遗砂蝎",element:"遗迹",skill:"石室护返",effect:"在原生派遣任务中强化归途保护；Lv10 时任务生命损耗额外 -1，最低仍扣 1。",base:[38, 17, 15, 11, 10],color:'#b7a7cf',passive:"mission_guard",exclusiveMission:"ruins",spriteBase:8,spriteHue:285},
{name:"铭甲羊",element:"遗迹",skill:"铭文追迹",effect:"在原生派遣任务中提高限定怪物与稀有技能发现率。",base:[42, 11, 17, 9, 14],color:'#b7a7cf',passive:"mission_hunt",exclusiveMission:"ruins",spriteBase:15,spriteHue:195},
{name:"晶角鼹",element:"晶洞",skill:"晶脉导航",effect:"在原生派遣任务中提高队伍成功率；Lv10 最高 +2.5%。",base:[43, 14, 18, 8, 11],color:'#b7a7cf',passive:"mission_success",exclusiveMission:"cavern",spriteBase:5,spriteHue:255},
{name:"荧岩蜥",element:"晶洞",skill:"荧矿嗅觉",effect:"在原生派遣任务中提高道具发现率；Lv10 最高 +2.5%。",base:[39, 17, 13, 13, 11],color:'#b7a7cf',passive:"mission_item",exclusiveMission:"cavern",spriteBase:13,spriteHue:185},
{name:"紫晶蛾",element:"晶洞",skill:"晶尘折价",effect:"在原生派遣任务中提高灵能报酬；Lv10 最高 +15%。",base:[28, 10, 9, 19, 20],color:'#b7a7cf',passive:"mission_reward",exclusiveMission:"cavern",spriteBase:14,spriteHue:295},
{name:"矿灯兔",element:"晶洞",skill:"灯穹护返",effect:"在原生派遣任务中强化归途保护；Lv10 时任务生命损耗额外 -1，最低仍扣 1。",base:[35, 10, 14, 17, 12],color:'#b7a7cf',passive:"mission_guard",exclusiveMission:"cavern",spriteBase:11,spriteHue:225},
{name:"岩脉獾",element:"晶洞",skill:"深脉追迹",effect:"在原生派遣任务中提高限定怪物与稀有技能发现率。",base:[45, 16, 17, 9, 12],color:'#b7a7cf',passive:"mission_hunt",exclusiveMission:"cavern",spriteBase:5,spriteHue:325},
{name:"星轨狐",element:"星门",skill:"星轨校准",effect:"在原生派遣任务中提高队伍成功率；Lv10 最高 +2.5%。",base:[31, 13, 9, 19, 20],color:'#b7a7cf',passive:"mission_success",exclusiveMission:"astral",spriteBase:3,spriteHue:315},
{name:"月环鲸",element:"星门",skill:"环月寻宝",effect:"在原生派遣任务中提高道具发现率；Lv10 最高 +2.5%。",base:[45, 10, 17, 9, 19],color:'#b7a7cf',passive:"mission_item",exclusiveMission:"astral",spriteBase:16,spriteHue:195},
{name:"彗尾猫",element:"星门",skill:"彗光增幅",effect:"在原生派遣任务中提高灵能报酬；Lv10 最高 +15%。",base:[30, 15, 8, 20, 17],color:'#b7a7cf',passive:"mission_reward",exclusiveMission:"astral",spriteBase:6,spriteHue:335},
{name:"星核鹿",element:"星门",skill:"星核护返",effect:"在原生派遣任务中强化归途保护；Lv10 时任务生命损耗额外 -1，最低仍扣 1。",base:[44, 14, 16, 12, 14],color:'#b7a7cf',passive:"mission_guard",exclusiveMission:"astral",spriteBase:4,spriteHue:255},
{name:"天幕蛾",element:"星门",skill:"星幕追迹",effect:"在原生派遣任务中提高限定怪物与稀有技能发现率。",base:[29, 11, 9, 19, 21],color:'#b7a7cf',passive:"mission_hunt",exclusiveMission:"astral",spriteBase:14,spriteHue:355},
{name:"云翼狼",element:"天穹",skill:"高风引路",effect:"在原生派遣任务中提高队伍成功率；Lv10 最高 +2.5%。",base:[39, 16, 12, 19, 14],color:'#b7a7cf',passive:"mission_success",exclusiveMission:"summit",spriteBase:17,spriteHue:205},
{name:"霁角羊",element:"天穹",skill:"云隙寻藏",effect:"在原生派遣任务中提高道具发现率；Lv10 最高 +2.5%。",base:[43, 11, 16, 12, 17],color:'#b7a7cf',passive:"mission_item",exclusiveMission:"summit",spriteBase:15,spriteHue:285},
{name:"风冠隼",element:"天穹",skill:"峰流增幅",effect:"在原生派遣任务中提高灵能报酬；Lv10 最高 +15%。",base:[30, 17, 9, 22, 14],color:'#b7a7cf',passive:"mission_reward",exclusiveMission:"summit",spriteBase:6,spriteHue:35},
{name:"霞背熊",element:"天穹",skill:"峰顶护返",effect:"在原生派遣任务中强化归途保护；Lv10 时任务生命损耗额外 -1，最低仍扣 1。",base:[48, 17, 18, 9, 10],color:'#b7a7cf',passive:"mission_guard",exclusiveMission:"summit",spriteBase:4,spriteHue:325},
{name:"雪铃鹿",element:"天穹",skill:"雪线追迹",effect:"在原生派遣任务中提高限定怪物与稀有技能发现率。",base:[38, 11, 14, 17, 18],color:'#b7a7cf',passive:"mission_hunt",exclusiveMission:"summit",spriteBase:11,spriteHue:165},
{name:"裂纹龙",element:"裂隙",skill:"裂隙定锚",effect:"在原生派遣任务中提高队伍成功率；Lv10 最高 +2.5%。",base:[46, 20, 16, 13, 12],color:'#b7a7cf',passive:"mission_success",exclusiveMission:"rift",spriteBase:13,spriteHue:315},
{name:"虚空鼬",element:"裂隙",skill:"虚藏感应",effect:"在原生派遣任务中提高道具发现率；Lv10 最高 +2.5%。",base:[33, 15, 10, 21, 18],color:'#b7a7cf',passive:"mission_item",exclusiveMission:"rift",spriteBase:17,spriteHue:265},
{name:"熵翼鸦",element:"裂隙",skill:"熵流收束",effect:"在原生派遣任务中提高灵能报酬；Lv10 最高 +15%。",base:[31, 18, 10, 21, 17],color:'#b7a7cf',passive:"mission_reward",exclusiveMission:"rift",spriteBase:12,spriteHue:345},
{name:"黑晶兽",element:"裂隙",skill:"黑晶护返",effect:"在原生派遣任务中强化归途保护；Lv10 时任务生命损耗额外 -1，最低仍扣 1。",base:[49, 18, 20, 8, 10],color:'#b7a7cf',passive:"mission_guard",exclusiveMission:"rift",spriteBase:5,spriteHue:335},
{name:"时隙狐",element:"裂隙",skill:"时隙追迹",effect:"在原生派遣任务中提高限定怪物与稀有技能发现率。",base:[32, 14, 9, 20, 22],color:'#b7a7cf',passive:"mission_hunt",exclusiveMission:"rift",spriteBase:3,spriteHue:25}
);
const MISSION_EXCLUSIVE_SPECIES={};for(let i=BASE_SPECIES_COUNT;i<SPECIES.length;i++){const mid=SPECIES[i].exclusiveMission;if(mid)(MISSION_EXCLUSIVE_SPECIES[mid]||(MISSION_EXCLUSIVE_SPECIES[mid]=[])).push(i);}function isMissionExclusiveSpecies(id){return !!SPECIES[id]?.exclusiveMission;}
const stars=n=>'★'.repeat(n);const MAX_OFFLINE=8*3600*1000;
function createMonster(id,species,star=1,genes=[1,1,1,1,1],parents=[]){return {id,species,star,genes,parents,bond:0,cooldown:0,age:0,baseLife:5,life:5,maxLife:5,lifePotionUsed:false,lifeSkillApplied:0,tint:0,skillLv:star,starBoost:0,shiny:false,nickname:'',locked:false};}

const FARM_START_SLOTS=4;
function normalizeFarmState(state){
  if(!Number.isFinite(state.farmSlots))state.farmSlots=FARM_START_SLOTS;
  state.farmSlots=Math.max(1,Math.floor(state.farmSlots));
  if(!Array.isArray(state.farmIds))state.farmIds=[];if(typeof state.autoFillFarm!=='boolean')state.autoFillFarm=true;
  const livingIds=new Set((state.monsters||[]).map(m=>m.id));
  state.farmIds=state.farmIds.filter((id,i,a)=>livingIds.has(id)&&a.indexOf(id)===i).slice(0,state.farmSlots);
  if(state.farmIds.length===0&&(state.monsters||[]).length){
    state.farmIds=(state.monsters||[]).slice(0,state.farmSlots).map(m=>m.id);
  }
}
function isInFarmState(state,id){
  normalizeFarmState(state);
  return state.farmIds.includes(Number(id));
}
function producingMonstersState(state){
  normalizeFarmState(state);
  const dispatched=state.dispatch?(Array.isArray(state.dispatch.monsterIds)?state.dispatch.monsterIds:[state.dispatch.monsterId]):[];
  return (state.monsters||[]).filter(m=>state.farmIds.includes(m.id)&&!dispatched.includes(m.id));
}
function fresh(now=Date.now()){const starterA=createMonster(1,0),starterB=createMonster(2,1);starterA.gender='公';starterB.gender='母';return {version:9,memorial:[],deaths:0,revision:0,energy:200,ranchXp:0,ranchName:'Qinster 牧场',tutorialCompleted:false,tutorialStep:0,tutorialActive:false,monsters:[starterA,starterB],farmSlots:FARM_START_SLOTS,farmIds:[starterA.id,starterB.id],autoFillFarm:true,farmItemLast:now,buildings:{energy:0,hatch:0,shiny:0,item:0,breedRest:0},nextId:3,parentA:1,parentB:2,autoBreed:false,autoBreedPriority:'star',manualBreedRepeat:false,manualBreedPairIds:[],autoHatch:true,autoDispatch:false,manualDispatchRepeat:false,manualDispatchTeamIds:[],manualDispatchMission:null,autoDispatchMission:'highest',autoDispatchPowerMode:'efficient',autoDispatchReserveBreed:true,egg:null,egg2:null,hatchSlots:1,eggQueue:[],dispatch:null,items:{colors:[0,0,0,0,0,0],specialColors:[0,0,0],star:0,skill:0,reroll:0,life:0,timeCut:0,timeInstant:0,shiny:0},capacity:30,hatched:0,last:now,paused:false};}
const COLORS=['原色','薄荷','绯红','月蓝','紫晶','金辉'];
function deathChance(age){return 0;}
function migrate(s){
  if(!s)return s;
  if(s.version===2){
    s=JSON.parse(JSON.stringify(s));
    s.version=3;
    s.memorial=[];
    s.deaths=0;
    s.revision=0;
    for(const m of s.monsters||[]){m.age=0;m.tint=0;}
    if(s.egg){s.egg.child.age=0;s.egg.child.tint=0;}
  }
  if(s.version===3){
    s=JSON.parse(JSON.stringify(s));
    s.version=4;
    s.dispatch=null;
  }
  if(s.version===4){
    s=JSON.parse(JSON.stringify(s));
    s.version=5;
    s.dispatch=null;
  }
  if(s.version===5){s=JSON.parse(JSON.stringify(s));s.version=6;s.dispatch=null;}
  if(s.version===6){s=JSON.parse(JSON.stringify(s));s.version=7;s.dispatch=null;}
  if(s.version===7){s=JSON.parse(JSON.stringify(s));s.version=8;s.dispatch=null;}
  if(s.version===8){
    s=JSON.parse(JSON.stringify(s));
    s.version=9;
  }
  return s;
}
function adopt(s){if(s.monsters.length>=2||s.egg)return null;const m=createMonster(s.nextId++,s.monsters.length?1:0);m.rescue=true;s.monsters.push(m);s.parentA=s.monsters[0].id;s.parentB=s.monsters[1]?.id||null;s.revision++;return m;}
function salePrice(m){
  if(m.rescue)return 0;
  const lifeRatio=Math.max(.35,Math.min(1,(m.life||1)/(m.maxLife||20)));
  const sp=SPECIES[m.species],lv=skillLevel(m);
  const saleMult=sp?.passive==='sale_bonus'?1+.05*lv:1;
  return Math.max(1,Math.round(
    15*Math.pow(3,m.star-1)*(m.genes.reduce((a,b)=>a+b,0)/5)*
    (m.tint?1.2:1)*(m.shiny?1.8:1)*(.65+.35*lifeRatio)*saleMult
  ));
}
function sell(s,id){const m=s.monsters.find(m=>m.id===id);if(!m||(m.rescue&&!isMissionExclusiveSpecies(m.species))||m.locked)return null;const price=salePrice(m);s.energy+=price;s.monsters=s.monsters.filter(x=>x.id!==id);if(s.manualBreedRepeat&&Array.isArray(s.manualBreedPairIds)&&s.manualBreedPairIds.includes(id)){s.manualBreedRepeat=false;s.manualBreedPairIds=[];}if(s.parentA===id)s.parentA=null;if(s.parentB===id)s.parentB=null;s.revision++;return {monster:m,price};}
function skillLevel(m){return Math.max(1,Math.min(10,Number.isInteger(m.skillLv)?m.skillLv:m.star));}
const STAT_BANDS={1:[1,100],2:[1,200],3:[100,300],4:[200,400],5:[300,500]};
const STAT_SOURCE_RANGES=Array.from({length:5},(_,i)=>{
  const vals=SPECIES.map(sp=>Number(sp.base?.[i])||0);
  return [Math.min(...vals),Math.max(...vals)];
});
function statBand(star){return STAT_BANDS[Math.max(1,Math.min(5,Number(star)||1))]||STAT_BANDS[1];}
function stats(m){
  const sp=SPECIES[m.species],lv=skillLevel(m),band=statBand(m.star),lo=band[0],hi=band[1],span=Math.max(1,hi-lo);
  return sp.base.map((v,i)=>{
    const src=STAT_SOURCE_RANGES[i],srcSpan=Math.max(1,src[1]-src[0]);
    const speciesBias=Math.max(0,Math.min(1,(v-src[0])/srcSpan));
    const gene=Number(m.genes?.[i]);
    const geneBias=Math.max(0,Math.min(1,((Number.isFinite(gene)?gene:1)-.65)/.85));
    const quality=speciesBias*.62+geneBias*.38;
    let value=lo+span*quality;
    if(sp.passive==='guard'&&i===2)value*=1+.04*lv;
    if(sp.passive==='self_speed'&&i===3)value*=1+.025*lv;
    return Math.max(lo,Math.min(hi,Math.round(value)));
  });
}
function statGrade(m){
  const vals=stats(m),band=statBand(m.star),min=band[0]*5,max=band[1]*5,total=vals.reduce((a,b)=>a+b,0);
  const pct=max<=min?1:Math.max(0,Math.min(1,(total-min)/(max-min)));
  const grade=pct>=.80?'S':pct>=.65?'A':pct>=.50?'B':pct>=.35?'C':'D';
  return {total,grade,pct,band};
}
function income(s){
  const active=producingMonstersState(s);
  const auraLv=active.filter(m=>SPECIES[m.species].passive==='aura').reduce((sum,m)=>sum+skillLevel(m),0);
  const glow=1+auraLv*.01;
  const building=1+Math.max(0,Math.min(10,Number(s.buildings?.energy)||0))*.05;
  return active.reduce((sum,m)=>{
    const sp=SPECIES[m.species],lv=skillLevel(m);
    let self=1;
    if(sp.passive==='harvest')self+=.03*lv;
    else if(sp.passive==='farm_item_mix')self+=.01*lv;
    else if(sp.passive==='farm_energy_20')self+=.02*lv;
    return sum+0.3*m.star*self;
  },0)*glow*building;
}
function pair(s){return [s.monsters.find(m=>m.id===s.parentA),s.monsters.find(m=>m.id===s.parentB)];}
function odds(a,b){if(!a||!b||a.id===b.id)return null;const base=Math.min(a.star,b.star),fortune=Math.max(0,...[a,b].filter(m=>SPECIES[m.species].passive==='fortune').map(m=>skillLevel(m)*.003)),potion=(a.starBoost||0)+(b.starBoost||0);const raw=base===5?0:(a.star===b.star?[0,.10,.06,.04,.01][base]:[0,.04,.025,.015,.005][base])+fortune+potion;const chance=base===5?0:Math.min(.95,raw),down=base===1?0:[0,0,.15,.30,.50,.75][base];return {base,up:Math.min(5,base+1),chance,down,lower:Math.max(1,base-1),stay:Math.max(0,1-chance-down-.01),fortune,potion};}
function breedCost(s){const [a,b]=pair(s);return a&&b?20*Math.pow(Math.min(a.star,b.star),2):20;}
function blocked(s,now){const [a,b]=pair(s);if(!a||!b||a.id===b.id)return '请选择两只不同的怪物';const expeditionIds=s.expedition?.rogueActive?.teamIds||[];if(expeditionIds.includes(a.id)||expeditionIds.includes(b.id))return '亲代正在远征中';if(s.dispatch&&[a.id,b.id].includes(s.dispatch.monsterId))return '亲代正在派遣中';if(s.egg)return '孵化巢正在使用中';if(s.monsters.length>=s.capacity)return '家园满员，请先扩建';if(a.cooldown>now||b.cooldown>now)return '亲代休息中 · '+Math.ceil((Math.max(a.cooldown,b.cooldown)-now)/1000)+' 秒';if(s.energy+1e-8<breedCost(s))return '灵能不足，伙伴正在积累';return '';}
function startBreed(s,now,rng=Math.random){if(blocked(s,now))return false;const [a,b]=pair(s),o=odds(a,b);const starRoll=rng();const star=starRoll<o.chance?o.up:starRoll<o.chance+o.down?o.lower:o.base;let type;const roll=rng();if(roll<.45)type=a.species;else if(roll<.90)type=b.species;else{const pool=SPECIES.map((_,i)=>i).filter(i=>i!==a.species&&i!==b.species);type=pool[Math.min(pool.length-1,Math.floor(rng()*pool.length))];}
const genes=a.genes.map((v,i)=>Math.max(.65,Math.min(1.5,(v+b.genes[i])/2*(.9+rng()*.2))));const incubateLv=Math.max(0,...[a,b].filter(m=>SPECIES[m.species].passive==='incubate').map(skillLevel));const baseIncubateSeconds=star===1?15:(22+star*12);const duration=Math.round(baseIncubateSeconds*(1-incubateLv*.025)*1000);
s.energy=Math.max(0,s.energy-breedCost(s));s.egg={child:createMonster(s.nextId++,type,star,genes,[a.id,b.id]),start:now,ready:now+duration,base:o.base,chance:o.chance};if(rng()<Math.max(1,Math.min(5,star))*.001){s.egg.child.shiny=true;s.egg.child.locked=true;s.egg.child.shinyAutoLockDone=true;}a.starBoost=0;b.starBoost=0;const colorRoll=rng();s.egg.child.tint=colorRoll<.475?a.tint:colorRoll<.95?b.tint:(()=>{const pool=[0,1,2,3,4,5].filter(c=>c!==a.tint&&c!==b.tint);return pool[Math.min(pool.length-1,Math.floor(rng()*pool.length))];})();
for(const m of [a,b]){m.cooldown=now+30000;}s.revision++;return true;}
function hatch(s,now){
  if(!s.egg||s.egg.ready>now||s.monsters.length>=s.capacity)return null;

  if(Math.random()<.01){
    s.egg=null;
    s.revision++;
    return false;
  }

  const child=s.egg.child;
  s.monsters.push(child);
  s.egg=null;
  s.hatched++;
  s.revision++;
  return child;
}function advance(s,now,rng=Math.random){
  const end=Math.max(s.last,now),start=Math.max(s.last,end-MAX_OFFLINE);
  let t=start,births=[],guard=0;
  while(t<=end&&guard++<1000){
    if(s.egg&&s.egg.ready<=t&&s.autoHatch){
      const child=hatch(s,t);if(child)births.push(child);
    }
    if(t>=end)break;
    let next=end;
    if(s.egg&&s.autoHatch&&s.egg.ready>t)next=Math.min(next,s.egg.ready);
    if(next<=t)next=Math.min(end,t+1000);
    s.energy+=income(s)*(next-t)/1000;
    t=next;
  }
  // Important: no new auto-breed is started while offline.
  s.last=end;
  return births;
}
function validMonster(m){return m&&Number.isInteger(m.tint)&&m.tint>=0&&m.tint<6&&Number.isInteger(m.id)&&m.id>0&&Number.isInteger(m.species)&&m.species>=0&&m.species<SPECIES.length&&Number.isInteger(m.star)&&m.star>=1&&m.star<=5&&Array.isArray(m.genes)&&m.genes.length===5&&m.genes.every(n=>Number.isFinite(n)&&n>=.65&&n<=1.5)&&Number.isFinite(m.cooldown)&&Number.isFinite(m.bond)&&Array.isArray(m.parents)&&m.parents.every(Number.isInteger);}
function valid(s){return s&&s.version===9&&Array.isArray(s.memorial)&&s.memorial.length<=200&&s.memorial.every(validMonster)&&Number.isInteger(s.deaths)&&s.deaths>=0&&Number.isInteger(s.revision)&&s.revision>=0&&Number.isFinite(s.energy)&&s.energy>=0&&Number.isFinite(s.last)&&Array.isArray(s.monsters)&&s.monsters.length<=500&&s.monsters.every(validMonster)&&new Set(s.monsters.map(m=>m.id)).size===s.monsters.length&&Number.isInteger(s.capacity)&&s.capacity>=s.monsters.length&&s.capacity>=30&&s.capacity<=500&&Number.isInteger(s.nextId)&&s.nextId>Math.max(...s.monsters.map(m=>m.id))&&Number.isInteger(s.hatched)&&s.hatched>=0&&(s.parentA===null||s.monsters.some(m=>m.id===s.parentA))&&(s.parentB===null||s.monsters.some(m=>m.id===s.parentB))&&(s.parentA===null||s.parentB===null||s.parentA!==s.parentB)&&typeof s.autoBreed==='boolean'&&typeof s.autoHatch==='boolean'&&(!s.egg||(validMonster(s.egg.child)&&s.egg.child.id<s.nextId&&!s.monsters.some(m=>m.id===s.egg.child.id)&&Number.isFinite(s.egg.start)&&Number.isFinite(s.egg.ready)&&s.egg.ready>s.egg.start&&Number.isInteger(s.egg.base)&&s.egg.base>=1&&s.egg.base<=5&&Number.isFinite(s.egg.chance)&&s.egg.chance>=0&&s.egg.chance<=1));}
root.MonsterGame={SPECIES,COLORS,deathChance,migrate,adopt,salePrice,sell,stars,createMonster,fresh,stats,statBand,statGrade,STAT_BANDS,income,pair,odds,breedCost,blocked,startBreed,hatch,advance,valid,skillLevel,MAX_OFFLINE,BASE_SPECIES_COUNT,MISSION_EXCLUSIVE_SPECIES,isMissionExclusiveSpecies,FARM_START_SLOTS,normalizeFarmState,isInFarmState,producingMonstersState};
})(typeof module!=='undefined'?module.exports:globalThis);

window.__bootMark&&__bootMark('02 core 完成');


window.__bootMark&&__bootMark('03 UI 开始');
'use strict';
const G=MonsterGame,$=id=>document.getElementById(id),fmt=n=>Math.floor(n).toLocaleString('zh-CN'),fmtEnergy=n=>(Math.floor(Number(n)*10)/10).toLocaleString('zh-CN',{minimumFractionDigits:1,maximumFractionDigits:1}),key='eggwood-monsters-v3',BASE_SPECIES_COUNT=G.BASE_SPECIES_COUNT,MISSION_EXCLUSIVE_SPECIES=G.MISSION_EXCLUSIVE_SPECIES,isMissionExclusiveSpecies=G.isMissionExclusiveSpecies;

function hasUnlockedShinyBuilding(){
  s.flags=s.flags||{};
  if(s.flags.shinyBuildingUnlocked)return true;
  if([...(s.monsters||[]),...(s.memorial||[])].some(m=>(m.star||0)>=5)){
    s.flags.shinyBuildingUnlocked=true;return true;
  }
  return false;
}
function shinyBuildingBonus(state=s){return Math.min(.003,(state?.buildings?.shiny||0)*.0003);}
function itemBuildingBonus(){return Math.min(.05,(s.buildings?.item||0)*.005);}
function breedRestReduction(state=s){
  const lv=Math.max(0,Math.min(20,Number(state.buildings?.breedRest)||0));
  return Math.min(.90,lv<=10?lv*.05:.50+(lv-10)*.04);
}
function breedRestBuildingMult(state=s){return Math.max(.10,1-breedRestReduction(state));}
function buildingMaxLevel(type){return type==='breedRest'?20:10;}
function buildingCost(type,lv){
  const max=buildingMaxLevel(type);
  lv=Math.max(0,Math.min(max-1,Number(lv)||0));
  const base=type==='energy'?2500:type==='hatch'?3000:type==='shiny'?5000:type==='breedRest'?3500:3500;
  if(type==='breedRest'&&lv>=10){
    const lv10Base=Math.round(base*Math.pow(1.8,9)/100)*100;
    return Math.round((lv10Base*Math.pow(1.55,lv-9))/100)*100;
  }
  return Math.round(base*Math.pow(1.8,lv)/100)*100;
}
function buyBuilding(type){
  window.__bootMark&&__bootMark('06 怪物系统整理');ensureMonsterSystemsState(s);window.__bootMark&&__bootMark('07 怪物系统完成');
  if(type==='shiny'&&!hasUnlockedShinyBuilding()){
    tell('闪光祭坛需要先获得至少 1 只 5★ 怪物才会解锁。');return;
  }
  const lv=s.buildings[type]||0;
  if(lv>=buildingMaxLevel(type)){tell('这个建筑已经满级。');return;}
  const cost=buildingCost(type,lv);
  if(s.energy<cost){tell('灵能不足，需要 '+fmt(cost)+'。');return;}
  s.energy-=cost;s.buildings[type]=lv+1;s.revision++;dirty=true;save();render();
  // v164: force-refresh building panel after purchase so next-level price never stays stale.
  try{renderBuildings();}catch(err){console.error('Building price refresh error:',err);}
  const label={energy:'灵能塔',hatch:'孵化室',shiny:'闪光祭坛',item:'寻宝工坊',breedRest:'亲育休息屋'}[type]||'建筑';
  playSfx('upgrade');tell(label+' 已升到 Lv'+(lv+1)+'。');
}
function buySecondHatchSlot(){
  ensureMonsterSystemsState(s);
  if(hatchSlotCount(s)>=2){tell('第二孵化栏已经永久解锁。');return;}
  if(s.energy+1e-8<SECOND_HATCH_SLOT_PRICE){tell('灵能不足，需要 '+fmt(SECOND_HATCH_SLOT_PRICE)+' 灵能。');return;}
  s.energy-=SECOND_HATCH_SLOT_PRICE;s.hatchSlots=2;s.revision++;dirty=true;
  fillOpenHatchSlots(s,Date.now());save();render();playSfx('upgrade');tell('第二孵化栏已永久解锁！现在可以同时孵化 2 颗蛋。');
}
function renderBuildings(){
  if(!$('building-energy-lv'))return;
  ensureMonsterSystemsState(s);
  const el=s.buildings.energy||0,hl=s.buildings.hatch||0,sl=s.buildings.shiny||0,il=s.buildings.item||0,bl=s.buildings.breedRest||0;
  const hs=hatchSlotCount(s);
  if($('second-hatch-slot-status'))$('second-hatch-slot-status').textContent=hs>=2?'已解锁 · 同时孵化 2 颗蛋':'未解锁 · 当前同时孵化 1 颗蛋';
  if($('second-hatch-slot-price'))$('second-hatch-slot-price').textContent=hs>=2?'永久设施 · 已购买':'价格：'+fmt(SECOND_HATCH_SLOT_PRICE)+' 灵能';
  if($('buy-second-hatch-slot')){$('buy-second-hatch-slot').disabled=hs>=2;$('buy-second-hatch-slot').textContent=hs>=2?'已永久解锁':'购买';}
  const unlocked=hasUnlockedShinyBuilding();
  $('building-energy-lv').textContent='Lv'+el+'/10';
  $('building-hatch-lv').textContent='Lv'+hl+'/10';
  $('building-shiny-lv').textContent='Lv'+sl+'/10';
  $('building-item-lv').textContent='Lv'+il+'/10';
  if($('building-breed-rest-lv'))$('building-breed-rest-lv').textContent='Lv'+bl+'/20';
  $('building-energy-effect').textContent='全牧场灵能 +'+(el*5)+'%';
  $('building-hatch-effect').textContent='孵化时间 -'+(hl*5)+'%';
  $('building-shiny-effect').textContent=unlocked?'全星级闪光率 +'+(sl*.03).toFixed(2)+'%（最高 +0.30%）':'🔒 获得第一只 5★ 后解锁';
  $('building-item-effect').textContent='农场普通道具率 +'+(il*.5).toFixed(1)+'%';
  if($('building-breed-rest-effect')){const cut=Math.round(breedRestReduction(s)*100);const nextCut=bl<20?Math.round((bl+1<=10?(bl+1)*.05:.50+(bl+1-10)*.04)*100):cut;$('building-breed-rest-effect').textContent='当前：冷却 -'+cut+'% · '+Math.round(30*breedRestBuildingMult(s))+' 秒'+(bl<20?' ｜ 下一级：-'+nextCut+'% · '+Math.round(30*Math.max(.10,1-(nextCut/100)))+' 秒':'');}
  const buildingRows=[
    ['energy',el,'building-energy-price'],
    ['hatch',hl,'building-hatch-price'],
    ['shiny',sl,'building-shiny-price'],
    ['item',il,'building-item-price'],
    ['breedRest',bl,'building-breed-rest-price']
  ];
  for(const [type,lv,priceId] of buildingRows){
    const b=$('buy-building-'+type.replace(/[A-Z]/g,m=>'-'+m.toLowerCase()));
    const locked=type==='shiny'&&!unlocked;
    const maxLv=buildingMaxLevel(type);
    const cost=buildingCost(type,Math.min(lv,maxLv-1));
    if(b){
      b.disabled=locked||lv>=maxLv;
      b.textContent=locked?'未解锁':lv>=maxLv?'已满级':'升级';
    }
    const priceEl=$(priceId);
    if(priceEl)priceEl.textContent=locked?'价格：解锁后显示':lv>=maxLv?'价格：— · 已满级':('价格：'+fmt(cost)+' 灵能');
  }
  const buffs=[
    el?'灵能 +'+(el*5)+'%':null,
    hl?'孵化 -'+(hl*5)+'%':null,
    sl&&unlocked?'闪光率 +'+(sl*.03).toFixed(2)+'%':null,
    il?'道具 +'+(il*.5).toFixed(1)+'%':null,
    bl?'生蛋冷却 -'+Math.round(breedRestReduction(s)*100)+'%':null
  ].filter(Boolean);
  $('building-buff-summary').innerHTML='<b>当前建筑 Buff：</b> '+(buffs.length?buffs.join(' · '):'暂无');
}

const SHOP_PRICES=Object.freeze({
  skill:3000,
  reroll:2000,
  life:100000,
  timeCut:1000,
  timeInstant:5000,
  shiny:1000000
});

const normalizeFarmState=G.normalizeFarmState;
const isInFarm=(id,state=s)=>G.isInFarmState(state,id);
const producingMonsters=(state=s)=>G.producingMonstersState(state);
function setFarmAssignment(id,wantIn){
  normalizeFarmState(s);
  id=Number(id);
  const m=s.monsters.find(x=>x.id===id);
  if(!m)return false;
  const has=s.farmIds.includes(id);
  if(wantIn){
    if(has)return true;
    if(s.farmIds.length>=s.farmSlots){
      tell('生产牧场已满（'+s.farmIds.length+' / '+s.farmSlots+'）。先把一只怪物移回怪物盒。');
      return false;
    }
    s.farmIds.push(id);
    tell(name(m)+' 已放入生产牧场，现在可以产出灵能。');
  }else{
    if(!has)return true;
    s.farmIds=s.farmIds.filter(x=>x!==id);
    tell(name(m)+' 已移回怪物盒，不再产出灵能。');
  }
  s.revision++;dirty=true;save();render();
  return true;
}

function farmAutoScore(m){
  ensureMonsterSystemsMonster(m);
  const species=G.SPECIES[m.species],lv=skillNum(m);
  let self=1;
  if(species.passive==='harvest')self+=.03*lv;
  else if(species.passive==='farm_item_mix')self+=.01*lv;
  else if(species.passive==='farm_energy_20')self+=.02*lv;
  let score=0.3*m.star*self;
  if(species.passive==='aura')score+=0.45+.12*lv;
  if(species.passive==='farm_item_energy')score+=.22+.05*lv;
  if(species.passive==='farm_item_mix')score+=.15+.03*lv;
  if(m.autoUse)score+=0.28;
  if(m.favorite)score+=0.06;
  score+=(m.life/Math.max(1,m.maxLife))*0.08;
  return score;
}

function autoManageFarm(){
  normalizeFarmState(s);
  if(!s.autoFillFarm)return false;

  const current=(s.farmIds||[]).filter(id=>{
    const mon=s.monsters.find(x=>x.id===id);
    return mon&&mon.life>0&&!isDispatched(id);
  });

  const used=new Set(current);
  const need=Math.max(0,s.farmSlots-current.length);
  if(need<=0){
    const changed=current.join(',')!==(s.farmIds||[]).join(',');
    if(changed){s.farmIds=current;s.revision++;dirty=true;}
    return changed;
  }

  const candidates=s.monsters
    .filter(mon=>mon&&mon.life>0&&!mon.locked&&!isDispatched(mon.id)&&!used.has(mon.id))
    .sort((a,b)=>farmAutoScore(b)-farmAutoScore(a)||b.star-a.star||b.life-a.life||a.id-b.id);

  const next=[...current,...candidates.slice(0,need).map(mon=>mon.id)];
  const changed=next.join(',')!==(s.farmIds||[]).join(',');
  if(changed){
    s.farmIds=next;
    normalizeFarmState(s);
    s.revision++;
    dirty=true;
  }
  return changed;
}

function farmGeneralItemChance(){
  const mons=producingMonsters(s);
  if(!mons.length)return {chance:0,base:0,luck:0,buff:0,debuff:0,building:0};
  const base=.005;
  const luck=mons.reduce((sum,m)=>sum+Math.min(.006,(G.stats(m)[4]||0)*.000012),0);
  let buff=0,debuff=0;
  for(const m of mons){
    for(const ent of effectiveExtraSkillEntries(m)){
      if(ent.id==='farm_gather')buff+=ent.lv*.002;
      else if(ent.id==='farm_jinx')debuff+=ent.lv*.002;
    }
  }
  const building=itemBuildingBonus();
  return {chance:Math.max(0,Math.min(.30,base+luck+buff+building-debuff)),base,luck,buff,debuff,building};
}
function farmSpecificItemForMonster(m){
  if(!isMissionExclusiveSpecies(m?.species))return null;
  const passive=G.SPECIES[m.species]?.passive;
  if(passive==='mission_success')return {type:'star'};
  if(passive==='mission_item')return {type:'skill'};
  if(passive==='mission_reward')return {type:'reroll'};
  if(passive==='mission_guard')return {type:'life'};
  if(passive==='mission_hunt')return {type:'specialColor',variant:m.id%3};
  return null;
}
function farmSpecificItemEntries(){
  return producingMonsters(s).filter(m=>isMissionExclusiveSpecies(m.species)).map(m=>({
    monster:m,item:farmSpecificItemForMonster(m),chance:Math.min(.008,skillNum(m)*.0003)
  })).filter(x=>x.item);
}
function rollFarmGeneralItem(){
  const r=Math.random();
  if(r<.65)return {type:'color',tint:Math.floor(Math.random()*6)};
  if(r<.80)return {type:'reroll'};
  if(r<.90)return {type:'skill'};
  if(r<.97)return {type:'star'};
  if(r<.995)return {type:'timeCut'};
  return {type:'life'};
}

function farmItemSpeciesEnergyBonus(){
  return producingMonsters(s).reduce((sum,m)=>{
    const sp=G.SPECIES[m.species],lv=skillNum(m);
    if(sp.passive==='farm_item_energy')return sum+lv*100;
    if(sp.passive==='farm_item_mix')return sum+lv*50;
    return sum;
  },0);
}
function addFarmItemWithSpeciesBonus(item,source){
  const bonus=farmItemSpeciesEnergyBonus();
  if(bonus>0)s.energy+=bonus;
  addItem(item,source+(bonus>0?' · 种族技能额外 +'+fmt(bonus)+' 灵能':''));
  return bonus;
}

function farmScavengerChance(){
  let lv=0;
  for(const m of producingMonsters(s))lv+=totalEffectiveSkillLevel(m,'scavenger_expert');
  return Math.min(.30,lv*.015);
}
function rollFarmItems(now=Date.now()){
  if(!Number.isFinite(s.farmItemLast))s.farmItemLast=now;
  const elapsed=Math.max(0,Math.min(60000,now-s.farmItemLast));
  s.farmItemLast=now;
  if(elapsed<=0||!producingMonsters(s).length)return false;
  const frac=elapsed/60000;
  let changed=false;
  const g=farmGeneralItemChance();
  const gp=1-Math.pow(1-g.chance,frac);
  if(gp>0&&Math.random()<gp){
    addFarmItemWithSpeciesBonus(rollFarmGeneralItem(),'生产牧场');
    if(farmScavengerChance()>0&&Math.random()<farmScavengerChance()){
      addFarmItemWithSpeciesBonus(rollFarmGeneralItem(),'生产牧场 · 拾荒专家追加');
    }
    changed=true;
  }
  for(const ent of farmSpecificItemEntries()){
    const p=1-Math.pow(1-ent.chance,frac);
    if(Math.random()<p){
      addFarmItemWithSpeciesBonus(ent.item,'生产牧场 · 限定种族技能 · '+name(ent.monster));
      changed=true;
    }
  }
  if(changed){s.revision++;dirty=true;save();}
  return changed;
}
function renderFarmItemInfo(){
  const rate=$('farm-item-rate');if(!rate)return;
  const g=farmGeneralItemChance(),spec=farmSpecificItemEntries();
  const pct=x=>(x*100).toFixed(2)+'%';
  rate.textContent='🎁 '+pct(g.chance)+' / 分'+(spec.length?' · 限定 '+spec.length:'');
  rate.title='普通道具：'+pct(g.chance)+'/分钟'
    +'｜基础 '+pct(g.base)
    +'｜幸运 +'+pct(g.luck)
    +'｜技能 +'+pct(g.buff)+'｜建筑 +'+pct(g.building||0)
    +(g.debuff?'｜Debuff -'+pct(g.debuff):'')
    +(spec.length?'｜限定：'+spec.map(x=>name(x.monster)+'→'+itemLabel(x.item)+' '+pct(x.chance)+'/分钟').join('；'):'');
}
function smartFillFarm(){
  normalizeFarmState(s);
  const pool=s.monsters
    .filter(mon=>mon&&mon.life>0&&!mon.locked&&!isDispatched(mon.id))
    .sort((a,b)=>farmAutoScore(b)-farmAutoScore(a)||b.star-a.star||b.life-a.life||a.id-b.id);
  s.farmIds=pool.slice(0,s.farmSlots).map(mon=>mon.id);
  normalizeFarmState(s);
  s.revision++;
  dirty=true;
  render();
  save();
  tell('已按当前产能评分重新优化一次生产牧场。');
}

// v188: one canonical view of every monster currently inside an egg, including twin eggs, slot 2, and the waiting queue.
function eggMonsters(state=s){
  const eggs=[state?.egg,state?.egg2,...(Array.isArray(state?.eggQueue)?state.eggQueue:[])].filter(Boolean);
  return eggs.flatMap(e=>[e?.child,e?.twinChild]).filter(Boolean);
}
function normalizeMonsterFields(state){
  for(const m of [...(state.monsters||[]),...(state.memorial||[]),...eggMonsters(state)]){
    if(!Number.isInteger(m.skillLv))m.skillLv=m.star;
    m.skillLv=Math.max(1,Math.min(10,m.skillLv));
    if(!Number.isFinite(m.starBoost))m.starBoost=0;if(!Number.isFinite(m.shinyBoost))m.shinyBoost=0;m.shinyBoost=Math.max(0,Math.min(.03,Number(m.shinyBoost)||0));if(typeof m.dexColorEligible!=='boolean')m.dexColorEligible=true;
    // v164: 每只怪物最多储存 1 瓶升星药水（+20pp）。旧存档若已有第二瓶，退回背包。
    if(m.starBoost>.200001&&state.items){
      state.items.star=(Number(state.items.star)||0)+Math.max(1,Math.round((m.starBoost-.2)/.2));
    }
    m.starBoost=Math.max(0,Math.min(.2,m.starBoost));
    if(typeof m.shiny!=='boolean')m.shiny=false;
    if(!Array.isArray(m.colorHistory))m.colorHistory=[];
    const currentColorKey=Number.isInteger(m.specialColor)?('s:'+m.specialColor):('n:'+Math.max(0,Math.min(5,Number(m.tint)||0)));
    if(!m.colorHistory.includes(currentColorKey))m.colorHistory.push(currentColorKey);
    if(typeof m.nickname!=='string')m.nickname='';
    if(typeof m.locked!=='boolean')m.locked=false;
    if(typeof m.shinyAutoLockDone!=='boolean')m.shinyAutoLockDone=false;
    if(m.shiny&&!m.shinyAutoLockDone){m.locked=true;m.shinyAutoLockDone=true;}
    if(typeof m.favorite!=='boolean')m.favorite=false;
    if(typeof m.autoUse!=='boolean')m.autoUse=false;
    if(typeof m.gender!=='string'||!['公','母'].includes(m.gender))m.gender=m.id%2?'公':'母';
    if(!Number.isFinite(m.createdAt))m.createdAt=Date.now()-m.id*1000;
    if(!Array.isArray(m.extraSkills))m.extraSkills=[null,null,null,null];
    if(!Array.isArray(m.extraSkillLv))m.extraSkillLv=[1,1,1,1];
    while(m.extraSkills.length<4)m.extraSkills.push(null);
    while(m.extraSkillLv.length<4)m.extraSkillLv.push(1);
    m.extraSkillLv=[0,1,2,3].map(i=>Math.max(1,Math.min(10,Number(m.extraSkillLv[i])||1)));
    if(!Number.isInteger(m.specialColor)||m.specialColor<0||m.specialColor>2)m.specialColor=null;
  }

  const living=(state.monsters||[]).filter(m=>m&&m.life>0);
  if(living.length===2&&living[0].gender===living[1].gender){
    living[0].gender='公';
    living[1].gender='母';
  }

  // Startup repair only: use a simple star/life score that does not depend on
  // EXTRA_SKILLS, BREED_SKILL_WEIGHTS, or any later-initialized constants.
  const dispatchedIds=state.dispatch
    ?(Array.isArray(state.dispatch.monsterIds)?state.dispatch.monsterIds:(state.dispatch.monsterId?[state.dispatch.monsterId]:[]))
    :[];
  const usable=living.filter(m=>!dispatchedIds.includes(m.id));

  const simpleScore=m=>(Number(m.star)||1)*1000+(Number(m.life)||0)*10+(Number(m.maxLife)||0);
  const bestOpposite=anchor=>usable
    .filter(m=>m.id!==anchor.id&&m.gender!==anchor.gender)
    .sort((x,y)=>simpleScore(y)-simpleScore(x)||y.id-x.id)[0]||null;

  let a=usable.find(m=>m.id===state.parentA)||null;
  let b=usable.find(m=>m.id===state.parentB)||null;

  if(a&&b&&(a.id===b.id||a.gender===b.gender)){b=null;state.parentB=null;}

  if(a&&!b){
    b=bestOpposite(a);state.parentB=b?.id||null;
  }else if(b&&!a){
    a=bestOpposite(b);state.parentA=a?.id||null;
  }else if(!a&&!b){
    const males=usable.filter(m=>m.gender==='公').sort((x,y)=>simpleScore(y)-simpleScore(x)||y.id-x.id);
    const females=usable.filter(m=>m.gender==='母').sort((x,y)=>simpleScore(y)-simpleScore(x)||y.id-x.id);
    if(males[0]&&females[0]){
      state.parentA=males[0].id;
      state.parentB=females[0].id;
    }else{
      state.parentA=null;
      state.parentB=null;
    }
  }

  if(!state.dispatch||typeof state.dispatch!=='object')state.dispatch=null;
  if(!state.items||typeof state.items!=='object')state.items={colors:[0,0,0,0,0,0],specialColors:[0,0,0],star:0,skill:0,reroll:0,life:0,timeCut:0,timeInstant:0,shiny:0};
  if(!Array.isArray(state.items.colors))state.items.colors=[0,0,0,0,0,0];
  state.items.colors=Array.from({length:6},(_,i)=>Math.max(0,Math.floor(Number(state.items.colors[i])||0)));
  if(!Array.isArray(state.items.specialColors))state.items.specialColors=[0,0,0];
  state.items.specialColors=Array.from({length:3},(_,i)=>Math.max(0,Math.floor(Number(state.items.specialColors[i])||0)));
  state.items.star=Math.max(0,Math.floor(Number(state.items.star)||0));
  state.items.skill=Math.max(0,Math.floor(Number(state.items.skill)||0));
  state.items.reroll=Math.max(0,Math.floor(Number(state.items.reroll)||0));
  state.items.life=Math.max(0,Math.floor(Number(state.items.life)||0));
  state.items.timeCut=Math.max(0,Math.floor(Number(state.items.timeCut)||0));
  state.items.timeInstant=Math.max(0,Math.floor(Number(state.items.timeInstant)||0));
  state.items.shiny=Math.max(0,Math.floor(Number(state.items.shiny)||0));
  if(!Number.isFinite(state.capacity))state.capacity=30;
  state.capacity=Math.max(Math.max(30,Math.floor(state.capacity)),(state.monsters||[]).length);
  if(typeof state.autoDispatch!=='boolean')state.autoDispatch=false;
  if(typeof state.autoDispatchMission!=='string')state.autoDispatchMission='highest';
  if(!['efficient','max'].includes(state.autoDispatchPowerMode))state.autoDispatchPowerMode='efficient';
  if(typeof state.autoDispatchReserveBreed!=='boolean')state.autoDispatchReserveBreed=true;
  if(typeof state.manualDispatchRepeat!=='boolean')state.manualDispatchRepeat=false;
  if(!Array.isArray(state.manualDispatchTeamIds))state.manualDispatchTeamIds=[];
  state.manualDispatchTeamIds=state.manualDispatchTeamIds.filter(id=>(state.monsters||[]).some(m=>m.id===id));
  if(typeof state.manualDispatchMission!=='string')state.manualDispatchMission=null;
  if(!['star','skill'].includes(state.autoBreedPriority))state.autoBreedPriority='star';
  if(typeof state.manualBreedRepeat!=='boolean')state.manualBreedRepeat=false;
  if(!Array.isArray(state.manualBreedPairIds))state.manualBreedPairIds=[];
  state.manualBreedPairIds=state.manualBreedPairIds.filter(id=>(state.monsters||[]).some(m=>m.id===id));
  if(!Number.isFinite(state.ranchXp))state.ranchXp=0;
  state.ranchXp=Math.max(0,Math.floor(state.ranchXp));
  if(!Array.isArray(state.activityLog))state.activityLog=[];
  state.activityLog=state.activityLog.filter(x=>x&&typeof x==='object').slice(0,300);
  if(!state.skillDex||typeof state.skillDex!=='object')state.skillDex={extra:{}};
  if(!state.skillDex.extra||typeof state.skillDex.extra!=='object')state.skillDex.extra={};
  if(state.pendingSkillDrop&&typeof state.pendingSkillDrop!=='object')state.pendingSkillDrop=null;
}
let s=G.fresh(),selected=1,timer,petTime=0,lastFrame=0,dirty=true,sellTarget=null,page='farm',dispatchSelected=null,pendingBulkSaleIds=[],dispatchTeamSelected=[];
const actors=new Map(),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const MONSTER_SPRITES=[];
const SPECIAL_COLORS=[{name:'极光',hue:175},{name:'琉璃',hue:235},{name:'夜曜',hue:270}];
const DEX_COLORS=[...G.COLORS.map((name,i)=>({name,kind:'normal',index:i,hue:[0,155,349,212,274,40][i]})),...SPECIAL_COLORS.map((c,i)=>({name:c.name+'（探索限定）',kind:'special',index:i,hue:c.hue}))];
function dexColorIndex(m){return Number.isInteger(m?.specialColor)?G.COLORS.length+m.specialColor:m.tint;}
function dexSprite(species,ci,shiny=false){return ci<G.COLORS.length?sprite(species,ci,shiny,null):sprite(species,0,shiny,ci-G.COLORS.length);}
// v189: indexed artwork compiled to nine atlases. No runtime colour filters/masks.
const MONSTER_ATLAS_COLS=8,MONSTER_ATLAS_ROWS=8;
const MONSTER_ATLASES=['monster-atlas.png',...Array.from({length:8},(_,i)=>'assets/monster-atlas-'+(i+1)+'.png')].map(path=>path+'?v=196');
function sprite(type,tint=0,shiny=false,specialColor=null){
  const numeric=Number(type);
  const idx=Number.isFinite(numeric)?Math.max(0,Math.min(G.SPECIES.length-1,Math.floor(numeric))):0;
  const normal=Number(tint);
  const ci=Number.isInteger(specialColor)&&specialColor>=0&&specialColor<3?6+specialColor:Number.isFinite(normal)?Math.max(0,Math.min(5,Math.floor(normal))):0;
  const px=(idx%8)/7*100,py=Math.floor(idx/8)/7*100;
  return '<span aria-hidden="true" data-species="'+idx+'" data-color="'+ci+'" class="sprite'+(shiny?' shiny-sprite':'')+'" style="--sprite-filter:none;--monster-atlas-image:url('+MONSTER_ATLASES[ci]+');--atlas-x:'+px+'%;--atlas-y:'+py+'%;aspect-ratio:1/1;background-position:var(--atlas-x) var(--atlas-y)">'+(shiny?'<span class="shiny-fx" aria-hidden="true"><i></i><i></i><i></i></span>':'')+'</span>';
}
function colorName(m){return Number.isInteger(m?.specialColor)&&SPECIAL_COLORS[m.specialColor]?SPECIAL_COLORS[m.specialColor].name+'（探索限定）':G.COLORS[m.tint]||G.COLORS[0];}
document.documentElement.style.setProperty('--monster-atlas-image','url("'+MONSTER_ATLASES[0]+'")');
const EGG_QUEUE_MAX=10,SECOND_HATCH_SLOT_PRICE=5000000;
function hatchSlotCount(state=s){return Number(state?.hatchSlots)>=2?2:1;}
function eggTotalMax(state=s){return 11;} // v164: second incubator increases concurrency, not total egg capacity
function eggUnits(egg){return egg?(1+(egg.twinChild?1:0)):0;}
function totalQueuedEggs(state=s){return eggUnits(state.egg)+eggUnits(state.egg2)+(state.eggQueue||[]).reduce((n,e)=>n+eggUnits(e),0);}
function queuedEggCount(state=s){return (state.eggQueue||[]).reduce((n,e)=>n+eggUnits(e),0);}
function eggPatternIndex(species){return Math.abs(Number(species)||0)%12;}
function eggVisualStyle(m){
  const sp=Math.max(0,Number(m?.species)||0),tint=Math.max(0,Number(m?.tint)||0),star=Math.max(1,Number(m?.star)||1);
  const h1=(sp*47+tint*31+star*9)%360;
  const h2=(h1+48+(sp%7)*17)%360;
  const h3=(h1+175+(sp%5)*11)%360;
  const width=48+(sp%5)*2;
  const height=62+(sp%4)*2;
  const tilt=((sp%7)-3)*1.4;
  const rx=44+(sp%4)*2;
  const top=51+(sp%5);
  return '--egg-h1:'+h1+';--egg-h2:'+h2+';--egg-h3:'+h3+';--egg-w:'+width+'px;--egg-h:'+height+'px;--egg-tilt:'+tilt+'deg;--egg-rx:'+rx+'%;--egg-top:'+top+'%;';
}
function eggArt(m,opts={}){
  if(!m)return '';
  const compact=!!opts.compact,labels=opts.labels!==false;
  const shiny=!!m.shiny,pattern=eggPatternIndex(m.species),sp=G.SPECIES[m.species];
  return '<div class="egg-wrap '+(compact?'egg-wrap-compact ':'')+(shiny?'egg-wrap-shiny':'')+'">'
    +'<span aria-hidden="true" class="species-egg egg-pattern-'+pattern+' '+(shiny?'shiny-egg':'')+'" data-egg-species="'+m.species+'" style="'+eggVisualStyle(m)+'">'
    +'<i class="egg-glyph glyph-a"></i><i class="egg-glyph glyph-b"></i><i class="egg-highlight"></i></span>'
    +(labels?'<span class="egg-grade">'+G.stars(m.star)+'</span><span class="egg-kind">'+colorName(m)+' · '+sp.name+(shiny?' · ✦ 闪光':'')+'</span>':'')
    +'</div>';
}
function hatchSeconds(m){return 22+m.star*12;}
function serialName(m){return G.SPECIES[m.species].name+' #'+m.id;}
function name(m){return m&&m.nickname&&m.nickname.trim()?m.nickname.trim():serialName(m);}
function tell(msg){$('log').textContent=msg;$('toast').textContent=msg;$('toast').classList.add('show');clearTimeout(timer);timer=setTimeout(()=>$('toast').classList.remove('show'),3200);}

// ===== v160 lightweight Web Audio sound system =====
const AUDIO_PREF_KEY='qinster-audio-v1';
let audioCtx=null,audioMaster=null;
let audioPrefs={enabled:true,volume:.55};
try{const p=JSON.parse(localStorage.getItem(AUDIO_PREF_KEY)||'null');if(p&&typeof p==='object'){audioPrefs.enabled=p.enabled!==false;audioPrefs.volume=Math.max(0,Math.min(1,Number.isFinite(Number(p.volume))?Number(p.volume):.55));}}catch(_){}
function saveAudioPrefs(){try{localStorage.setItem(AUDIO_PREF_KEY,JSON.stringify(audioPrefs));}catch(_){} }
function ensureAudio(){
  if(!audioPrefs.enabled)return null;
  try{
    if(!audioCtx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;audioCtx=new AC();audioMaster=audioCtx.createGain();audioMaster.gain.value=audioPrefs.volume;audioMaster.connect(audioCtx.destination);}
    if(audioCtx.state==='suspended')audioCtx.resume().catch(()=>{});
    if(audioMaster)audioMaster.gain.setTargetAtTime(audioPrefs.volume,audioCtx.currentTime,.01);
    return audioCtx;
  }catch(_){return null;}
}
function sfxTone(freq,dur=.08,type='square',gain=.07,delay=0,slide=0){
  const c=ensureAudio();if(!c||!audioMaster)return;const t=c.currentTime+delay;
  const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,freq+slide),t+dur);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,gain),t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(audioMaster);o.start(t);o.stop(t+dur+.02);
}
function sfxNoise(dur=.1,gain=.025,delay=0){
  const c=ensureAudio();if(!c||!audioMaster)return;const n=Math.max(1,Math.floor(c.sampleRate*dur)),buf=c.createBuffer(1,n,c.sampleRate),a=buf.getChannelData(0);for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*(1-i/n);const src=c.createBufferSource(),g=c.createGain(),t=c.currentTime+delay;src.buffer=buf;g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);src.connect(g);g.connect(audioMaster);src.start(t);
}
function playSfx(kind){
  if(!audioPrefs.enabled)return;
  switch(kind){
    case 'click':sfxTone(560,.035,'square',.026);break;
    case 'breed':sfxTone(392,.10,'triangle',.055);sfxTone(523,.11,'triangle',.05,.07);sfxTone(659,.14,'triangle',.045,.14);break;
    case 'hatch':sfxTone(523,.10,'triangle',.06);sfxTone(659,.12,'triangle',.06,.08);sfxTone(784,.18,'triangle',.065,.16);break;
    case 'fiveStar':[659,784,988,1318].forEach((f,i)=>sfxTone(f,.13,'triangle',.06,i*.075));break;
    case 'shiny':[988,1318,1568,1976,2637].forEach((f,i)=>sfxTone(f,.12,'sine',.052,i*.06));sfxTone(659,.34,'triangle',.035,.06);break;
    case 'dispatchStart':sfxTone(330,.09,'square',.04);sfxTone(440,.11,'square',.04,.07);sfxTone(587,.13,'square',.04,.14);break;
    case 'dispatchSuccess':sfxTone(523,.10,'triangle',.055);sfxTone(659,.10,'triangle',.055,.08);sfxTone(784,.18,'triangle',.06,.16);break;
    case 'dispatchFail':sfxTone(330,.12,'sawtooth',.035,0,-90);sfxTone(220,.18,'triangle',.045,.1,-70);sfxNoise(.12,.018,.04);break;
    case 'buy':sfxTone(1047,.055,'square',.04);sfxTone(1397,.07,'square',.035,.055);break;
    case 'upgrade':[523,659,784,1047].forEach((f,i)=>sfxTone(f,.11,'triangle',.05,i*.06));break;
  }
}
function refreshSoundUI(){const btn=$('sound-btn'),en=$('sound-enabled'),vol=$('sound-volume'),lab=$('sound-volume-label');if(btn){btn.textContent=audioPrefs.enabled?'音效 🔊':'音效 🔇';btn.classList.toggle('sound-off',!audioPrefs.enabled);}if(en)en.checked=audioPrefs.enabled;if(vol)vol.value=Math.round(audioPrefs.volume*100);if(lab)lab.textContent=Math.round(audioPrefs.volume*100)+'%';}
window.addEventListener('pointerdown',()=>{if(audioPrefs.enabled)ensureAudio();},{once:true,capture:true});
function save(force=true){
  try{
    if(!force){
      compactFamilyArchive(s,6000);
    }
    localStorage.setItem(key,JSON.stringify(s));
  }catch(e){
    const el=$('saved');
    if(el)el.textContent='当前浏览器无法保存，请勿关闭页面。';
  }
}
function exportSave(){
  settle();
  save();
  const payload={
    game:'Qinster 牧场',
    format:1,
    exportedAt:new Date().toISOString(),
    save:s
  };
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  const d=new Date();
  const stamp=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')+'_'+String(d.getHours()).padStart(2,'0')+'-'+String(d.getMinutes()).padStart(2,'0');
  a.href=url;
  a.download='eggwood-save_'+stamp+'.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  tell('存档已导出。以后换新版时可用「导入存档」恢复。');
}
function importSaveObject(raw){
  const candidate=raw&&raw.save?raw.save:raw;
  if(!candidate||typeof candidate!=='object')throw new Error('invalid');
  const imported=G.migrate(JSON.parse(JSON.stringify(candidate)));
  if(!imported)throw new Error('invalid');
  normalizeMonsterFields(imported);
  ensureDex(imported);
  if(!G.valid(imported))throw new Error('invalid');
  s=imported;
  smartBreedCache={key:'',ids:null};smartDispatchCache={key:'',ids:[]};
  if(!s.monsters.some(m=>m.id===selected))selected=s.monsters[0]?.id||null;
  dirty=true;
  save();
  setPage('farm');
  render();
  tell('存档导入成功！怪物、灵能、图鉴和进度已经恢复。');
}
function setDexFlags(state,m){
  if(!m)return false;
  let changed=false,ci=dexColorIndex(m);
  if(!state.dex.species[m.species]){state.dex.species[m.species]=true;changed=true;}
  // v188: ordinary color potions are cosmetic only and must not unlock color/combo dex entries.
  // Natural hatch, dispatch returns, legacy monsters, and limited-color potions remain dex-eligible.
  if(m.dexColorEligible===false)return changed;
  if(!state.dex.colors[ci]){state.dex.colors[ci]=true;changed=true;}
  const key=m.species+'-'+ci;
  if(!state.dex.combos[key]){state.dex.combos[key]=true;changed=true;}

  // Shiny dex unlocks per exact species + color combination.
  // A green shiny does not unlock the red shiny for the same species.
  if(m.shiny){
    state.dex.shinyCombos=state.dex.shinyCombos||{};
    if(!state.dex.shinyCombos[key]){state.dex.shinyCombos[key]=true;changed=true;}
  }
  return changed;
}
function ensureDex(state){
  const total=DEX_COLORS.length;
  const fresh={species:Array(G.SPECIES.length).fill(false),colors:Array(total).fill(false),combos:{},shinyCombos:{}};
  if(!state.dex||!Array.isArray(state.dex.species)||!Array.isArray(state.dex.colors)||typeof state.dex.combos!=='object')state.dex=fresh;
  state.dex.species=Array.from({length:G.SPECIES.length},(_,i)=>!!state.dex.species[i]);
  state.dex.colors=Array.from({length:total},(_,i)=>!!state.dex.colors[i]);
  state.dex.combos=state.dex.combos||{};
  state.dex.shinyCombos=state.dex.shinyCombos||{};
  for(const m of [...(state.monsters||[]),...(state.memorial||[])])setDexFlags(state,m);
  return state.dex;
}
function markDex(state,m,bump=false){if(!m)return false;ensureDex(state);const changed=setDexFlags(state,m);if(changed&&bump)state.revision++;return changed;}
let bulkSellMode=false;const parentSearch={a:'',b:''},parentSort={a:'recommended',b:'recommended'},parentSkillFilter={a:'',b:''},parentStarFilter={a:'',b:''},parentSpeciesFilter={a:'',b:''};let bagTargetSearch='',bagTargetSort='star-desc',bagTargetSkill='',bagTargetStar='',bagTargetSpecies='',bagTargetFamily='';let dispatchSkillFilter='',dispatchStarFilter='',dispatchSpeciesFilter='',dispatchFamilyFilter='';
const bulkSellSelected=new Set();

function escapeActivity(v){
  return String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function activityTime(ts){
  let n=Number(ts);
  if(!Number.isFinite(n)||n<=0)n=Date.now();
  if(n<1e12)n*=1000;
  const d=new Date(n);
  if(Number.isNaN(d.getTime()))return '--:--';
  return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
}
function activityMonsterName(m){
  const cls=m?.shiny?'rarity-shiny':'rarity-'+Math.max(1,Math.min(5,m?.star||1));
  const display=m?.nickname?.trim()?m.nickname.trim():(G.SPECIES[m?.species||0]?.name||'怪物')+' #'+(m?.id??'?');
  return '<span class="rarity-name '+cls+'">'+escapeActivity(display)+'</span>';
}
function recordActivity(type,data={},state=s){
  if(!Array.isArray(state.activityLog))state.activityLog=[];
  let time=Number(data.time);
  if(!Number.isFinite(time)||time<=0)time=Date.now();
  if(time<1e12)time*=1000;
  const entry={id:data.id||('L'+Date.now()+'-'+Math.random().toString(36).slice(2,7)),type,...data,time};
  if(entry.key&&state.activityLog.some(x=>x.key===entry.key))return;
  state.activityLog.push(entry);
  state.activityLog.sort((a,b)=>(Number(b.time)||0)-(Number(a.time)||0));
  state.activityLog=state.activityLog.slice(0,300);
}
function syncMemorialDeathsToLog(state=s){
  if(!Array.isArray(state.activityLog))state.activityLog=[];
  for(const m of (state.memorial||[])){
    const diedAt=m.diedAt||0,key='death-'+m.id+'-'+diedAt;
    if(!state.activityLog.some(x=>x.key===key)){
      recordActivity('death',{
        key,time:diedAt||Date.now(),
        monster:{id:m.id,species:m.species,star:m.star,shiny:!!m.shiny,nickname:m.nickname||'',tint:m.tint,specialColor:m.specialColor??null,deathReason:m.deathReason||''},
        reason:m.deathReason||'旧记录未保存具体原因'
      },state);
    }
  }
}
function logMonsterLink(monster,label=null){if(!monster)return '';const id=Number(monster.id),alive=s.monsters.some(m=>m.id===id),txt=label||activityMonsterName(monster);return '<span class="log-monster-link '+(alive?'':'unavailable')+'" data-log-monster="'+id+'" title="'+(alive?'点击查看怪物':'这只怪物已经不在牧场')+'">'+txt+'</span>';}
function goToLogMonster(id){const m=s.monsters.find(x=>x.id===Number(id));if(!m){tell('这只怪物已经离开牧场或已经离世。');return;}selected=m.id;setPage('farm');dirty=true;render();setTimeout(()=>document.querySelector('#companion')?.scrollIntoView({behavior:'smooth',block:'center'}),50);}
function activityEntryHTML(e){
  const time='<span class="activity-time">'+activityTime(e.time)+'</span>';
  if(e.type==='birth'){
    const m=e.monster||{};
    const growth=Array.isArray(e.skillGrowth)&&e.skillGrowth.length?' · '+e.skillGrowth.map(g=>g.id&&String(g.id).startsWith('family:')?'<b class="family-growth-log">家族技能提升：'+escapeActivity(String(g.name||'').replace(/^家族·/,''))+' Lv'+g.from+'→Lv'+g.to+'</b>':g.id&&String(g.id).startsWith('species:')?'<b class="skill-growth-log">种族技能提升：'+escapeActivity(g.name)+' Lv'+g.from+'→Lv'+g.to+'</b>':'<b class="skill-growth-log">技能提升：'+escapeActivity(g.name)+' Lv'+g.from+'→Lv'+g.to+'</b>').join(' · '):'';return '<div class="activity-entry">'+time+'<div class="activity-text"><span class="activity-tag birth">获得怪物</span>'+logMonsterLink(m)+' · '+G.stars(m.star||1)+(m.shiny?' · 闪光':'')+(m.colorName?' · '+escapeActivity(m.colorName):'')+(Number.isFinite(m.life)?' · ❤ '+m.life+(Number.isFinite(m.maxLife)?'/'+m.maxLife:''):'')+'<small class="activity-source">来源：'+escapeActivity(e.source||'来源未记录')+'</small>'+growth+'</div></div>';
  }
  if(e.type==='twin'){
    const parents=Array.isArray(e.parentNames)?e.parentNames.join(' × '):'双亲';
    return '<div class="activity-entry">'+time+'<div class="activity-text"><span class="activity-tag twin">双蛋触发</span><b>'+escapeActivity(e.skill||'双潮卵息')+'</b> · '+escapeActivity(parents)+'<small class="activity-source">本次配种形成 2 颗蛋 · 触发率 '+((Number(e.chance)||0)*100).toFixed(2)+'%</small></div></div>';
  }
  if(e.type==='twin_stage'){
    const m=e.monster||{};
    return '<div class="activity-entry">'+time+'<div class="activity-text"><span class="activity-tag twin">双蛋续孵</span>'+logMonsterLink(m)+' · 第 1 颗已破壳，第 2 颗蛋已进入孵化巢。</div></div>';
  }
  if(e.type==='death'){
    const m=e.monster||{};
    const reason=e.reason||m.deathReason||'原因未记录';
    return '<div class="activity-entry">'+time+'<div class="activity-text"><span class="activity-tag death">离世</span>'+logMonsterLink(m)+' · '+G.stars(m.star||1)+' · <b>生命耗尽</b> · 原因：'+escapeActivity(reason)+'</div></div>';
  }
  if(e.type==='item'){
    return '<div class="activity-entry">'+time+'<div class="activity-text"><span class="activity-tag item">获得道具</span>'+escapeActivity(e.item||'未知道具')+'<small class="activity-source">来源：'+escapeActivity(e.source||'来源未记录')+'</small></div></div>';
  }
  if(e.type==='dispatch'){
    const team=Array.isArray(e.team)?e.team.map((n,i)=>e.teamIds?.[i]?logMonsterLink({id:e.teamIds[i]},escapeActivity(n)):escapeActivity(n)).join('、'):'派遣队';
    const result=e.success?'成功':'失败';
    const parts=[escapeActivity(e.mission||'未知任务')+' · '+result];
    if(e.success&&Number(e.energy)>0)parts.push('+'+fmt(e.energy)+' 灵能');
    if(e.item)parts.push('带回 '+escapeActivity(e.item));
    if(e.skill)parts.push('发现技能 '+escapeActivity(e.skill));
    if(e.shiny)parts.push('发现闪光 '+escapeActivity(e.shiny));if(e.exclusive)parts.push('带回限定怪 '+escapeActivity(e.exclusive)+'（任务加入）');if(e.ordinary)parts.push('带回普通怪 '+escapeActivity(e.ordinary)+'（任务加入）');
    if(e.life)parts.push(escapeActivity(e.life));
    return '<div class="activity-entry">'+time+'<div class="activity-text"><span class="activity-tag dispatchlog">派遣</span>'+team+' · '+parts.join(' · ')+'</div></div>';
  }
  if(e.type==='sale'){
    return '<div class="activity-entry">'+time+'<div class="activity-text"><span class="activity-tag sale">出售</span>'+escapeActivity(e.count||1)+' 只怪物 · 获得 '+fmt(e.energy||0)+' 灵能</div></div>';
  }
  return '<div class="activity-entry">'+time+'<div class="activity-text">'+escapeActivity(e.text||'发生了一件事。')+'</div></div>';
}
function renderActivityLog(){
  syncMemorialDeathsToLog(s);
  const list=[...(s.activityLog||[])].map((e,i)=>{
    let t=Number(e.time);if(Number.isFinite(t)&&t>0&&t<1e12)t*=1000;
    return {...e,__time:Number.isFinite(t)&&t>0?t:0,__order:i};
  }).sort((a,b)=>b.__time-a.__time||a.__order-b.__order).slice(0,50);
  $('activity-count').textContent='最近 '+list.length+' 条 · 新 → 旧';
  $('activity-list').innerHTML=list.length?list.map(activityEntryHTML).join(''):'<div class="activity-empty">还没有记录。</div>';
}

function canBulkSell(m){
  return !!(m&&(!m.rescue||isMissionExclusiveSpecies(m.species))&&!m.locked&&!isDispatched(m.id));
}
function bulkSellTotal(){
  let total=0,count=0;
  const byId=new Map(s.monsters.map(m=>[m.id,m]));
  for(const id of bulkSellSelected){
    const m=byId.get(id);
    if(m&&canBulkSell(m)){total+=G.salePrice(m);count++;}
  }
  return {total,count};
}
function renderBulkSellControls(){
  const t=bulkSellTotal();
  $('bulk-select-toggle').hidden=bulkSellMode;
  $('bulk-select-all').hidden=!bulkSellMode;
  $('bulk-select-filtered').hidden=!bulkSellMode;
  $('bulk-sell-confirm').hidden=!bulkSellMode;
  $('bulk-select-cancel').hidden=!bulkSellMode;
  $('bulk-sell-confirm').disabled=t.count===0;
  $('bulk-sell-confirm').textContent='出售已选 · '+t.count+' 只 · '+fmt(t.total)+' 灵能';
  const activeFilters=[$('filter-skill')?.value,$('filter-star')?.value,$('filter-species')?.value,$('filter-family')?.value,($('filter-name')?.value||'').trim()].filter(v=>v!==''&&v!=null);
  $('bulk-select-filtered').textContent='勾选当前筛选';
  $('bulk-select-filtered').disabled=!activeFilters.length;
  $('bulk-sell-summary').textContent=bulkSellMode
    ?'已选 '+t.count+' 只，共 '+fmt(t.total)+' 灵能。也可以先在上方筛技能，再点「勾选当前技能怪」。'
    :'可一次勾选多只怪物出售；锁定、派遣中和救助怪物不会被选中。';
  document.body.classList.toggle('bulk-mode',bulkSellMode);
}
function getFilteredSellableMonsters(){
  return getSortedRoster().filter(m=>canBulkSell(m));
}
function openBulkSaleDialog(ids){
  pendingBulkSaleIds=[...ids];
  const byId=new Map(s.monsters.map(m=>[m.id,m]));
  let total=0;
  const names=[];
  for(let i=0;i<ids.length;i++){
    const m=byId.get(ids[i]);
    if(!m)continue;
    total+=G.salePrice(m);
    if(names.length<6)names.push(name(m)+' '+G.stars(m.star)+(m.shiny?' ✦':''));
  }
  const count=ids.length;
  $('bulk-sale-info').innerHTML=
    '<div class="bulk-sale-summary"><b>准备出售 '+count+' 只怪物</b><br>预计获得 <b>'+fmt(total)+' 灵能</b></div>'+
    '<div class="bulk-sale-list">'+(names.length?names.join('、'):'没有可出售对象')+(count>6?' 等…':'')+'</div>'+
    '<div class="bulk-sale-tip">已锁定、派遣中或救助怪物不会被勾选。此操作无法撤回。</div>';
  $('bulk-sale-dialog').showModal();
}
function cancelBulkSell(){
  bulkSellMode=false;
  bulkSellSelected.clear();
  dirty=true;
  render();
}
function performBulkSell(){
  if(!bulkSellSelected.size)return;
  const byId=new Map(s.monsters.map(m=>[m.id,m]));
  const ids=[];
  for(const id of bulkSellSelected){
    const m=byId.get(id);
    if(m&&canBulkSell(m))ids.push(id);
  }
  if(!ids.length)return;
  openBulkSaleDialog(ids);
}
function finalizeBulkSell(){
  const sellSet=new Set(pendingBulkSaleIds);
  $('bulk-sale-dialog').close();
  pendingBulkSaleIds=[];

  if(!sellSet.size){tell('没有可出售的怪物。');return;}

  let sold=0,earned=0;
  const validIds=new Set();

  // 只扫描怪物数组一次。
  for(const m of s.monsters){
    if(sellSet.has(m.id)&&canBulkSell(m)){
      archiveMonster(m,s);
      validIds.add(m.id);
      sold++;
      earned+=G.salePrice(m);
    }
  }

  if(!sold){
    tell('这些怪物当前已经无法出售。');
    return;
  }

  // 一次性删除，而不是每只都重新 filter 整个数组。
  s.monsters=s.monsters.filter(m=>!validIds.has(m.id));
  s.energy+=earned;

  if(s.manualBreedRepeat&&Array.isArray(s.manualBreedPairIds)&&s.manualBreedPairIds.some(id=>validIds.has(id))){
    s.manualBreedRepeat=false;
    s.manualBreedPairIds=[];
  }
  if(validIds.has(s.parentA))s.parentA=null;
  if(validIds.has(s.parentB))s.parentB=null;
  if(validIds.has(selected))selected=s.monsters[0]?.id||null;

  // 清理农场分配，避免旧 ID 留在 farmIds。
  if(Array.isArray(s.farmIds))s.farmIds=s.farmIds.filter(id=>!validIds.has(id));

  s.revision++;
  safeFamilyRegistry(s);
  recordActivity('sale',{count:sold,energy:earned});
  bulkSellMode=false;
  bulkSellSelected.clear();
  dirty=true;

  // 只 render / save 一次。
  save();
  render();
  tell('已出售 '+sold+' 只怪物，获得 '+fmt(earned)+' 灵能。');
}

function newbornSkillGrowth(m){
  if(!m?.parents?.length)return [];
  const parents=m.parents.map(id=>familyRecord(id)).filter(Boolean);
  if(!parents.length)return [];

  const parentMax=new Map();
  for(const p of parents){
    try{
      for(const [id,lv] of parentAbilityMap(p)){
        parentMax.set(id,Math.max(parentMax.get(id)||0,lv));
      }
    }catch(e){}
  }

  const out=[];
  for(let idx=0;idx<2;idx++){
    const id=m.extraSkills?.[idx];
    if(!id)continue;
    const lv=extraLv(m,idx);
    const old=parentMax.get(id)||0;
    if(old>0&&lv>old){
      out.push({id,name:extraSkill(id)?.name||id,from:old,to:lv});
    }
  }
  const fp=familySkillParts(m)[0];
  if(fp){
    let oldFamily=0;
    for(const p of parents){
      const pp=familySkillParts(p)[0];
      if(pp&&pp.id===fp.id)oldFamily=Math.max(oldFamily,pp.lv);
    }
    if(oldFamily>0&&fp.lv>oldFamily){
      out.push({id:'family:'+fp.id,name:'家族·'+(extraSkill(fp.id)?.name||fp.id),from:oldFamily,to:fp.lv});
    }
  }
  if(Array.isArray(m.birthBonusGrowth)){
    for(const g of m.birthBonusGrowth){
      if(!g)continue;
      const key=(g.id||'')+'|'+g.from+'|'+g.to;
      if(!out.some(x=>((x.id||'')+'|'+x.from+'|'+x.to)===key))out.push(g);
    }
  }
  return out;
}

function showShinyPopup(m,source='获得'){
  if(!m||!m.shiny)return;
  const dlg=$('shiny-dialog'),box=$('shiny-popup-content');
  if(!dlg||!box)return;
  box.innerHTML=sprite(m.species,m.tint,true,m.specialColor)
    +'<h2>'+G.stars(m.star)+' '+name(m)+'</h2>'
    +'<div class="stars">✦ '+colorName(m)+' · 闪光 ✦</div>'
    +'<p><b>❤ '+m.life+' / '+m.maxLife+' 生命</b></p>'
    +'<p>来源：<b>'+escapeActivity(source)+'</b></p>'
    +'<p>'+G.SPECIES[m.species].skill+' Lv'+skillNum(m)+' · '+skillEffect(m)+'</p>';
  if(!dlg.open){
    try{dlg.showModal();}catch(_){}
  }
}
function births(list,offline=false){if(!list.length)return;for(const m of list){markDex(s,m,false);discoverMonsterSkills(m,s);archiveMonster(m,s);gainRanchXp(ranchXpForBirth(m),'孵化新伙伴获得经验。');const skillGrowth=newbornSkillGrowth(m);recordActivity('birth',{key:'birth-'+m.id,time:m.createdAt||Date.now(),monster:{id:m.id,species:m.species,star:m.star,shiny:!!m.shiny,nickname:m.nickname||'',tint:m.tint,specialColor:m.specialColor??null,colorName:colorName(m),life:m.life,maxLife:m.maxLife},source:'配种孵化',skillGrowth});}dirty=true;syncActors();if(offline||list.length>1){tell('欢迎回来！'+list.length+' 位新伙伴已经破壳，在草地上等你。');return;}const m=list[0];selected=m.id;talk(m.id,'你好呀 ♡');playSfx(m.shiny?'shiny':m.star>=5?'fiveStar':'hatch');tell((m.shiny?'✦ 闪光 ':'')+G.stars(m.star)+' '+name(m)+' 破壳了！');if(m.shiny)showShinyPopup(m,'配种孵化');if(!m.shiny&&!s.autoBreed&&!$('guide').open){$('birth-content').innerHTML=sprite(m.species,m.tint,m.shiny,m.specialColor)+'<h2>'+name(m)+genderBadge(m)+(m.shiny?'<span class="shiny-badge">闪光</span>':'')+'</h2><div class="stars">'+G.stars(m.star)+'</div><p><b>❤ '+m.life+' / '+m.maxLife+' 生命</b></p><p>'+G.SPECIES[m.species].skill+' Lv'+skillNum(m)+' · '+skillEffect(m)+'</p>'+skillListHTML(m);$('birth').showModal();}}
function settle(){const revision=s.revision;const list=G.advance(s,Date.now());if(s.revision!==revision)dirty=true;births(list);}
// v165: independent incubator clock/visual settlement. Egg timing must not depend on the full-page render loop.
function refreshEggClockUI(){
  const now=Date.now();
  for(const slot of [1,2]){
    const unlocked=slot===1||hatchSlotCount(s)>=2;
    const shell=$(slot===2?'incubator-slot-2':'incubator-slot-1');
    if(shell)shell.hidden=!unlocked;
    if(!unlocked)continue;
    const egg=slot===2?s.egg2:s.egg;
    const statusEl=$(slot===2?'egg-status-2':'egg-status');
    const progressEl=$(slot===2?'progress-2':'progress');
    const hatchEl=$(slot===2?'hatch-2':'hatch');
    const nestEl=$(slot===2?'nest-2':'nest');
    const infoEl=$(slot===2?'nest-info-2':'nest-info');
    if(!statusEl||!progressEl||!hatchEl||!nestEl)continue;
    if(!egg){
      statusEl.textContent='空闲';
      progressEl.value=0;
      hatchEl.hidden=true;
      nestEl.className='nest empty';
      if(nestEl.textContent!=='✧ 等待下一颗蛋')nestEl.textContent='✧ 等待下一颗蛋';
      if(infoEl)infoEl.textContent='等候列表中的下一颗蛋会自动进入这个栏位。';
      continue;
    }
    const readyAt=Number(egg.ready),startAt=Number(egg.start);
    if(!Number.isFinite(readyAt)||!Number.isFinite(startAt)||readyAt<=startAt){
      const duration=Math.max(1000,eggEntryDuration(egg));
      egg.start=now;egg.ready=now+duration;egg.incubationDuration=duration;s.revision++;dirty=true;
    }
    const ready=Number(egg.ready)<=now;
    const remain=Math.max(0,Math.ceil((Number(egg.ready)-now)/1000));
    const twinStage=Number(egg.twinStage)||0;
    const child=egg.child;
    statusEl.textContent=(slot===2?'栏位 2 · ':'')+(twinStage?'双蛋第 '+twinStage+' 颗 · ':'')+(ready?'可以破壳':remain+' 秒后孵化');
    const den=Math.max(1,Number(egg.ready)-Number(egg.start));
    progressEl.value=Math.min(1,Math.max(0,(now-Number(egg.start))/den));
    hatchEl.hidden=!ready;hatchEl.disabled=s.monsters.length>=s.capacity;
    const expectedKey=child?String(child.id)+':'+(child.shiny?1:0)+':'+twinStage:'';
    if(child&&nestEl.dataset.eggKey!==expectedKey){
      nestEl.innerHTML=(twinStage?'<div class="twin-egg-notice">✦ 双蛋 · 第 '+twinStage+' 颗 / 2</div>':'')+eggArt(child);
      nestEl.dataset.eggKey=expectedKey;
    }
    nestEl.className='nest'+(ready?' ready':'')+(twinStage?' twin-ready':'')+(child?.shiny?' shiny-nest':'');
    if(infoEl&&child){
      infoEl.innerHTML=(twinStage?'<b>双潮卵息已触发：这一窝共有 2 颗蛋。</b><br>':'')+'双亲 #'+child.parents.join(' 与 #')+'<br>'+G.stars(child.star)+' '+G.SPECIES[child.species].name+(child.shiny?' · <b>✦ 闪光蛋</b>':'');
    }
  }
  const totalEggs=totalQueuedEggs(s),totalMax=eggTotalMax(s);
  if($('egg-total-status'))$('egg-total-status').textContent='总蛋数 '+totalEggs+' / '+totalMax;
  if($('egg-queue-summary'))$('egg-queue-summary').textContent='🥚 '+totalEggs+' / '+totalMax;
  const qCount=$('egg-queue-count');
  if(qCount){const activeUnits=eggUnits(s.egg)+eggUnits(s.egg2);qCount.textContent=queuedEggCount(s)+' / '+Math.max(0,totalMax-activeUnits);}
}
function incubatorHeartbeat(){
  if(document.visibilityState==='hidden')return;
  try{
    const revision=s.revision;
    const list=G.advance(s,Date.now());
    if(s.revision!==revision)dirty=true;
    if(list.length){
      births(list);
      dirty=true;
      try{render();}catch(err){console.error('Post-hatch render error:',err);}
      try{save(false);}catch(err){console.error('Post-hatch save error:',err);}
    }
  }catch(err){console.error('Incubator settle error:',err);}
  try{refreshEggClockUI();}catch(err){console.error('Incubator clock error:',err);}
}
try{const old=G.migrate(JSON.parse(localStorage.getItem(key)||localStorage.getItem('eggwood-monsters-v2')));if(G.valid(old)){s=old;const elapsed=Date.now()-s.last;const list=G.advance(s,Date.now());if(elapsed>60000){if(list.length)births(list,true);else tell('欢迎回来！离线灵能已经收好，伙伴们一直在等你。');}}else{const previous=JSON.parse(localStorage.getItem('eggwood-v1'));if(previous&&Number.isFinite(previous.coins)&&previous.coins>=0){s.energy+=previous.coins;tell('欢迎来到怪物版！旧版 '+fmt(previous.coins)+' 金币已转为灵能，旧存档仍保留。');}s.paused=reduced;}}catch(e){s.paused=reduced;}
window.__bootMark&&__bootMark('04 存档读取完成');
try{
  normalizeMonsterFields(s);
  ensureDex(s);
  window.__bootMark&&__bootMark('05 存档整理完成');
}catch(err){
  const detail=String(err&&((err.stack||err.message))||err);
  if(window.__qinsterShowFatal)window.__qinsterShowFatal(detail);
  throw err;
}
const EXTRA_SKILLS=[
{id:'warm_nest',name:'暖巢',tone:'buff',group:'配种',desc:'缩短孵化时间；Lv10 最高 -15%'},
{id:'lucky_blossom',name:'福星花粉',tone:'buff',group:'配种',desc:'提高升星概率；Lv10 最高 +3.0 个百分点；较高亲代为 5★ 时 50% 转为保底'},
{id:'thick_shell',name:'厚壳',tone:'buff',group:'配种',desc:'降低孵化失败率'},
{id:'stable_blood',name:'稳血',tone:'buff',group:'配种',desc:'降低掉星概率；Lv10 最高 -7%'},
{id:'legacy_mark',name:'传承印记',tone:'buff',group:'配种',desc:'提高额外技能继承率；Lv10 最高 +15%'},
{id:'guardian_heart',name:'护亲',tone:'buff',group:'配种',desc:'降低亲代配种生命消耗，并提高技能继承率'},
{id:'swift_rest',name:'轻步回巢',tone:'buff',group:'配种',desc:'缩短配种后冷却'},
{id:'treasure_nose',name:'寻宝鼻',tone:'buff',group:'探索',desc:'提高任务道具掉率；Lv10 最高 +5%'},
{id:'sure_step',name:'稳步',tone:'buff',group:'探索',desc:'提高任务成功率；Lv10 最高 +5%'},
{id:'bounty_hunter',name:'赏金嗅觉',tone:'buff',group:'探索',desc:'提高任务灵能报酬；Lv10 最高 +20%'},
{id:'mission_guard',name:'护航体魄',tone:'buff',group:'探索',desc:'减少任务结束时的生命损耗，最低仍扣 1'},
{id:'vital_growth',name:'生命萌芽',tone:'buff',group:'生命',desc:'技能每升 1 级，最大生命 +1'},
{id:'shiny_breed',name:'星辉血脉',tone:'buff',group:'稀有·配种',desc:'提高所有星级蛋成为闪光的概率；每级 +0.1%，Lv10 +1%'},
{id:'shiny_explore',name:'星迹追寻',tone:'buff',group:'稀有·探索',desc:'提高探索发现闪光伙伴的概率；每级 +0.1%，Lv10 +1%'},
{id:'farm_gather',name:'拾物灵感',tone:'buff',group:'农场',desc:'提高生产牧场捡到普通道具的概率；每级 +0.20 个百分点/分钟'},
{id:'life_floor_up',name:'生命底蕴',tone:'buff',group:'配种·生命',desc:'提高后代天生生命随机下限；Lv10 +10，若超过最终上限则下限等于上限'},
{id:'life_ceiling_up',name:'生命拓域',tone:'buff',group:'配种·生命',desc:'提高后代天生生命随机上限；Lv10 +10'},
{id:'long_life_line',name:'长寿血脉',tone:'buff',group:'配种·生命',desc:'后代若随机到最低生命，有概率重抽一次；Lv10 50%'},
{id:'perfect_embryo',name:'完美胚芽',tone:'buff',group:'配种·基因',desc:'后代最低基因有概率向父母较高基因靠近；Lv10 10%'},
{id:'same_species_resonance',name:'同族共鸣',tone:'buff',group:'配种·血统',desc:'同物种配种时，提高后代种族技能额外升级概率；Lv10 +5pp'},
{id:'hybrid_vigor',name:'混血优势',tone:'buff',group:'配种·血统',desc:'不同物种配种时提高生命随机上限与技能变异率；Lv10 上限 +2、变异 +5pp'},
{id:'chroma_resonance',name:'异色共鸣',tone:'buff',group:'配种·颜色',desc:'发生颜色突变时，有概率直接变成探索限定颜色；Lv10 10%'},
{id:'scavenger_expert',name:'拾荒专家',tone:'buff',group:'农场',desc:'农场获得普通道具时有概率再获得一个普通道具；Lv10 15%'},
{id:'forced_march',name:'急行军',tone:'buff',group:'探索·双刃',desc:'任务更快完成，但成功率略降；Lv10 时间 -15%、成功率 -2pp'},
{id:'rescue_instinct',name:'救援本能',tone:'buff',group:'探索·队伍',desc:'队友本次任务损耗会致死时，有概率替其挡 1 点；Lv10 20%'},
{id:'cold_shell',name:'寒壳',tone:'debuff',group:'配种',desc:'延长孵化时间'},
{id:'dull_luck',name:'晦运',tone:'debuff',group:'配种',desc:'降低升星概率'},
{id:'fragile_shell',name:'脆壳',tone:'debuff',group:'配种',desc:'提高孵化失败率'},
{id:'wild_blood',name:'乱血',tone:'debuff',group:'配种',desc:'提高掉星概率'},
{id:'broken_legacy',name:'断承',tone:'debuff',group:'配种',desc:'降低额外技能继承率'},
{id:'frail_parent',name:'耗命',tone:'debuff',group:'配种',desc:'提高产蛋后的死亡风险'},
{id:'slow_rest',name:'倦巢',tone:'debuff',group:'配种',desc:'延长配种后冷却'},
{id:'lost_route',name:'迷途',tone:'debuff',group:'探索',desc:'降低任务成功率'},
{id:'empty_pouch',name:'空囊',tone:'debuff',group:'探索',desc:'降低任务道具掉率'},
{id:'thin_reward',name:'薄赏',tone:'debuff',group:'探索',desc:'降低任务灵能报酬'},
{id:'farm_jinx',name:'漏袋',tone:'debuff',group:'农场',desc:'降低生产牧场捡到普通道具的概率；每级 -0.20 个百分点/分钟'},
{id:'life_floor_down',name:'先天虚弱',tone:'debuff',group:'配种·生命',desc:'降低后代天生生命随机下限；Lv10 -5，可能出生时生命为 0'},
{id:'life_ceiling_down',name:'衰竭血脉',tone:'debuff',group:'配种·生命',desc:'降低后代天生生命随机上限；Lv10 -10，最终上限最低为 5'},
{id:'atavism',name:'返祖',tone:'debuff',group:'配种',desc:'有概率让后代直接采用较低亲代的星级；Lv10 10%'},
{id:'skill_disorder',name:'技能紊乱',tone:'debuff',group:'配种',desc:'后代继承到 Buff 时有概率被随机普通技能替换；Lv10 10%'}
];
const EXTRA_SKILL_MAP=Object.fromEntries(EXTRA_SKILLS.map(x=>[x.id,x]));
const coreBreedCost=G.breedCost;
function skillNum(m){return Math.max(1,Math.min(10,Number.isInteger(m.skillLv)?m.skillLv:m.star));}
function extraLv(m,idx){return Math.max(1,Math.min(10,Number.isInteger(m.extraSkillLv?.[idx])?m.extraSkillLv[idx]:1));}
function skillEffect(m){
  const sp=G.SPECIES[m.species],lv=skillNum(m);
  if(sp.passive==='harvest')return '自身农场灵能产量 +'+(lv*3)+'%（Lv10 +30%）。';
  if(sp.passive==='incubate')return '作为亲代时，孵化时间 -'+(lv*2.5).toFixed(1)+'%（Lv10 -25%，多个来源可叠加）。';
  if(sp.passive==='guard')return '自身防御 +'+(lv*4)+'%（Lv10 +40%，已计入能力值）。';
  if(sp.passive==='fortune')return '作为亲代时，升星概率 +'+(lv*.3).toFixed(1)+'pp（Lv10 +3pp；5★封顶时 50% 转保底）。';
  if(sp.passive==='aura')return '在家园中使全体灵能产量 +'+lv+'%（Lv10 +10%，多只可叠加）。';

  if(sp.passive==='farm_item_energy')return '生产牧场获得道具时额外 +'+(lv*100)+' 灵能（Lv10 +1000）。';
  if(sp.passive==='farm_item_mix')return '农场获得道具时额外 +'+(lv*50)+' 灵能；自身灵能产量 +'+lv+'%（Lv10 +500 / +10%）。';
  if(sp.passive==='farm_energy_20')return '自身农场灵能产量 +'+(lv*2)+'%（Lv10 +20%）。';
  if(sp.passive==='twin_hatch')return '作为亲代时，双蛋概率 +'+(lv*.1).toFixed(1)+'%（Lv10 +1%）。';
  if(sp.passive==='offspring_hp')return '提高后代天生生命随机上限 +'+Math.floor(lv/2)+'；最低仍为 5（Lv2/4/6/8/10 各 +1，Lv10 +5）。';
  if(sp.passive==='self_vitality')return '自身最大生命 +'+(lv*2)+'%（Lv10 +20%）。';
  if(sp.passive==='self_speed')return '自身速度 +'+(lv*2.5).toFixed(1)+'%（Lv10 +25%，已计入能力值）。';
  if(sp.passive==='skill_refine')return '后代额外技能升级机会 +'+(lv*.5).toFixed(1)+'%（Lv10 +5%；种族→普通/闪光技能；不直接升级家族技能）。';
  if(sp.passive==='buff_preserve')return '后代保留父母正面 Buff 的额外机会 +'+(lv*.5).toFixed(1)+'%（Lv10 +5%）。';
  if(sp.passive==='buff_inherit')return '后代正面 Buff 普通技能继承率 +'+(lv*.5).toFixed(1)+'pp（Lv10 +5pp）。';
  if(sp.passive==='dispatch_fast')return '所在派遣队任务时间 -'+lv+'%（Lv10 -10%，多只可叠加）。';
  if(sp.passive==='sale_bonus')return '出售自身时售价 +'+(lv*5)+'%（Lv10 +50%）。';
  if(sp.passive==='color_mutation')return '后代出现不同普通颜色的概率 +'+(lv*.5).toFixed(1)+'pp（Lv10 +5pp）。';

  if(sp.exclusiveMission&&['mission_success','mission_item','mission_reward','mission_guard','mission_hunt'].includes(sp.passive))return exclusiveSpeciesSkillEffect(m);
  return sp.effect;
}
function extraSkill(id){return EXTRA_SKILL_MAP[id]||null;}
function extraSkillDesc(id,lv=1){
  const n=Math.max(1,Math.min(10,lv));
  switch(id){
    case'warm_nest':return '孵化时间 -'+(n*1.5).toFixed(1)+'%（Lv10 最高 -15%）';
    case'lucky_blossom':return '升星概率 +'+(n*.3).toFixed(1)+' 个百分点；较高亲代为 5★ 时，50% 转为保底';
    case'thick_shell':return '孵化失败率 -'+(n*.08).toFixed(2)+' 个百分点（Lv10 最高 -0.80%）';
    case'stable_blood':return '掉星概率 -'+(n*.7).toFixed(1)+' 个百分点（Lv10 最高 -7%）';
    case'legacy_mark':return '额外技能继承率 +'+(n*1.5).toFixed(1)+' 个百分点（Lv10 最高 +15%）';
    case'guardian_heart':return (n>=5?'配种后亲代生命损耗 -1；':'')+'额外技能继承率 +'+(n*.5).toFixed(1)+' 个百分点'+(n<5?'（Lv5 起额外获得护亲减伤）':'');
    case'swift_rest':return '配种冷却 -'+(n*1.5).toFixed(1)+'%（Lv10 最高 -15%）';
    case'treasure_nose':return '探索道具掉率 +'+(n*.5).toFixed(1)+' 个百分点（Lv10 最高 +5%）';
    case'sure_step':return '探索成功率 +'+(n*.5).toFixed(1)+' 个百分点（Lv10 最高 +5%）';
    case'bounty_hunter':return '探索灵能报酬 +'+(n*2)+'%（Lv10 最高 +20%）';
    case'mission_guard':return '任务生命损耗 -'+(n===10?4:n>=9?3:n>=6?2:n>=3?1:0)+'（最低仍扣 1）';
    case'vital_growth':return '最大生命 +'+n;
    case'shiny_breed':return '所有星级蛋闪光概率 +'+(n*.1).toFixed(1)+'%';
    case'shiny_explore':return '探索发现闪光伙伴概率 +'+(n*.1).toFixed(1)+'%';
    case'farm_gather':return '农场普通道具发现率 +'+(n*.20).toFixed(2)+' 个百分点/分钟';
    case'life_floor_up':return '后代天生生命随机下限 +'+n+'（Lv10 +10；若超过上限，则最终下限=上限）';
    case'life_ceiling_up':return '后代天生生命随机上限 +'+n+'（Lv10 +10）';
    case'long_life_line':return '后代随机到最低生命时，'+(n*5)+'% 几率重抽一次（Lv10 50%）';
    case'perfect_embryo':return '后代最低基因有 '+n+'% 几率向父母较高基因靠近（Lv10 10%）';
    case'same_species_resonance':return '同物种配种时，后代种族技能额外升级率 +'+(n*.5).toFixed(1)+'pp（Lv10 +5pp）';
    case'hybrid_vigor':return '不同物种配种时，生命随机上限 +'+Math.floor(n/5)+'，技能变异率 +'+(n*.5).toFixed(1)+'pp（Lv10 +2 / +5pp）';
    case'chroma_resonance':return '颜色突变发生时，'+n+'% 几率变为探索限定颜色（Lv10 10%）';
    case'scavenger_expert':return '农场获得普通道具时，'+(n*1.5).toFixed(1)+'% 几率额外再获得 1 个普通道具（Lv10 15%）';
    case'forced_march':return '派遣时间 -'+(n*1.5).toFixed(1)+'%，但成功率 -'+(n*.2).toFixed(1)+'pp（Lv10 -15% / -2pp）';
    case'rescue_instinct':return '队友任务生命损耗会致死时，'+(n*2)+'% 几率替其挡 1 点生命（Lv10 20%）';

    case'cold_shell':return '孵化时间 +'+(n*1.5).toFixed(1)+'%（Lv10 最高 +15%）';
    case'dull_luck':return '升星概率 -'+(n*.3).toFixed(1)+' 个百分点（Lv10 最低 -3%）';
    case'fragile_shell':return '孵化失败率 +'+(n*.1).toFixed(1)+' 个百分点（Lv10 最高 +1%）';
    case'wild_blood':return '掉星概率 +'+n+' 个百分点（Lv10 最高 +10%）';
    case'broken_legacy':return '额外技能继承率 -'+(n*1.5).toFixed(1)+' 个百分点（Lv10 最低 -15%）';
    case'frail_parent':return (n>=5?'配种后亲代生命损耗 +1；':'')+'额外技能继承率 -'+(n*.5).toFixed(1)+' 个百分点'+(n<5?'（Lv5 起额外增加生命损耗）':'');
    case'slow_rest':return '配种冷却 +'+(n*2)+'%（Lv10 最高 +20%）';
    case'lost_route':return '探索成功率 -'+(n*.5).toFixed(1)+' 个百分点（Lv10 最低 -5%）';
    case'empty_pouch':return '探索道具掉率 -'+(n*.5).toFixed(1)+' 个百分点（Lv10 最低 -5%）';
    case'thin_reward':return '探索灵能报酬 -'+(n*2)+'%（Lv10 最低 -20%）';
    case'farm_jinx':return '农场普通道具发现率 -'+(n*.20).toFixed(2)+' 个百分点/分钟';
    case'life_floor_down':return '后代天生生命随机下限 -'+Math.floor(n/2)+'（Lv2/4/6/8/10 各 -1；Lv10 -5，可能出生即死亡）';
    case'life_ceiling_down':return '后代天生生命随机上限 -'+n+'（Lv10 -10；最终上限最低为 5）';
    case'atavism':return (n)+'% 几率让后代直接采用较低亲代的星级（Lv10 10%）';
    case'skill_disorder':return (n)+'% 几率把后代继承到的 Buff 替换成随机普通技能（Lv10 10%）';
    default:return '未知效果';
  }
}
const ULTRA_RARE_SKILLS=['shiny_breed','shiny_explore'];
function ordinarySkillPool(){return EXTRA_SKILLS.filter(sk=>sk.tone==='buff'&&!ULTRA_RARE_SKILLS.includes(sk.id));}
function randomExtraSkillId(rng=Math.random){
  const r=rng();
  if(r<.001)return 'shiny_breed';
  if(r<.002)return 'shiny_explore';
  const pool=ordinarySkillPool();
  return pool[Math.floor(rng()*pool.length)].id;
}
function seededSkill(seed,chance=.5){
  const r=Math.abs(Math.sin(seed*12.9898)*43758.5453)%1;
  if(r>=chance)return null;
  const rr=Math.abs(Math.sin(seed*5.17+2.31)*43758.5453)%1;
  if(rr<.001)return 'shiny_breed';
  if(rr<.002)return 'shiny_explore';
  const pool=ordinarySkillPool();
  return pool[Math.floor((Math.abs(Math.sin(seed*7.91))*1000)%pool.length)].id;
}
function ordinarySkillLevel(rng=Math.random){return 1+Math.floor(rng()*10);}
function shinyBonusSkillLevel(rng=Math.random){return 5+Math.floor(rng()*6);}
function seededOrdinarySkillLevel(seed){const r=Math.abs(Math.sin(seed*9.73+4.11)*43758.5453)%1;return 1+Math.floor(r*10);}
function seededShinyBonusSkillLevel(seed){const r=Math.abs(Math.sin(seed*9.73+4.11)*43758.5453)%1;return 5+Math.floor(r*6);}
function ensureSkillSlots(m){
  if(!Array.isArray(m.extraSkills))m.extraSkills=[null,null,null,null];
  if(!Array.isArray(m.extraSkillLv))m.extraSkillLv=[1,1,1,1];
  while(m.extraSkills.length<4)m.extraSkills.push(null);
  while(m.extraSkillLv.length<4)m.extraSkillLv.push(1);

  if(!m.skillLayoutV80){
    // Previous versions wrongly used slot 4 as one ordinary skill.
    // Move an old shiny-only skill to shiny slot 5 if possible, then clear slot 4.
    if(m.shiny&&m.extraSkills[2]&&!m.extraSkills[3]){
      m.extraSkills[3]=m.extraSkills[2];
      m.extraSkillLv[3]=m.extraSkillLv[2]||1;
    }
    m.extraSkills[2]=null;
    m.extraSkillLv[2]=1;
    if((m.generation||1)<10)m.familySkill=null;
    m.skillLayoutV80=true;
  }

  m.extraSkills=[0,1,2,3].map(i=>i===2?null:(extraSkill(m.extraSkills[i])?m.extraSkills[i]:null));
  // v188: ordinary skill2/3 use Lv1–Lv10. Only the shiny-exclusive skill5 has a Lv5 floor.
  m.extraSkillLv=[0,1,2,3].map(i=>{
    if(!m.extraSkills[i])return 1;
    const lv=Math.max(1,Math.min(10,Number.isInteger(m.extraSkillLv[i])?m.extraSkillLv[i]:1));
    return i===3&&m.shiny?Math.max(5,lv):lv;
  });

  if(!m.extraSkills[0]&&!m.extraSkills[1]){
    const seedA=m.id+m.species*11+m.star*7,seedB=m.id*3+m.species*19+.3;
    m.extraSkills[0]=seededSkill(seedA,.65);
    m.extraSkills[1]=seededSkill(seedB,.32);
    if(m.extraSkills[0])m.extraSkillLv[0]=seededOrdinarySkillLevel(seedA);
    if(m.extraSkills[1])m.extraSkillLv[1]=seededOrdinarySkillLevel(seedB);
  }

  if(m.shiny&&!m.extraSkills[3]){const seed=m.id*13+m.species*5+.7;m.extraSkills[3]=seededSkill(seed,.68);if(m.extraSkills[3])m.extraSkillLv[3]=seededShinyBonusSkillLevel(seed);}
  if(!m.shiny)m.extraSkills[3]=null;

  if((m.generation||1)<10)m.familySkill=null;
  if(typeof m.familyName!=='string')m.familyName='';
}
const BASE_LIFE=5,SHINY_LINEAGE_BASE_LIFE=10,MAX_NATURAL_LIFE=999999,NATURAL_BIRTH_CAP=20,LIFE_UP_CHANCE=.35;
function deterministicBaseLife(m){
  const seed=Math.abs(Math.sin(((m?.id||1)*17.17+(m?.species||0)*3.71))*43758.5453)%1;
  return BASE_LIFE;
}
function vitalitySkillBonus(m){
  if(!m)return 0;
  return totalEffectiveSkillLevel(m,'vital_growth');
}
function refreshLifeCapacity(m,healPositive=true){
  if(!m)return;
  if(!Number.isFinite(m.baseLife))m.baseLife=deterministicBaseLife(m);
  m.baseLife=Math.max(BASE_LIFE,Math.min(MAX_NATURAL_LIFE,Math.round(m.baseLife)));
  if(!Number.isFinite(m.heritageLifeBonus))m.heritageLifeBonus=0;
  m.heritageLifeBonus=Math.max(0,Math.floor(m.heritageLifeBonus));

  const skill=vitalitySkillBonus(m),prev=Number.isFinite(m.lifeSkillApplied)?m.lifeSkillApplied:skill;
  const raw=m.baseLife+(m.lifePotionUsed?5:0)+skill+m.heritageLifeBonus;
  const sp=G.SPECIES[m.species],speciesMult=sp?.passive==='self_vitality'?1+.02*skillNum(m):1;
  const target=Math.max(1,Math.round(raw*speciesMult));

  if(!Number.isFinite(m.life))m.life=target;
  if(healPositive&&skill>prev)m.life+=skill-prev;
  m.lifeSkillApplied=skill;m.maxLife=target;
  m.life=Math.max(0,Math.min(m.maxLife,Math.floor(m.life)));
}


function pairExtraSkillLevel(a,b,id){
  let lv=0;
  for(const m of [a,b])if(m)lv+=totalEffectiveSkillLevel(m,id);
  const tone=extraSkill(id)?.tone||'buff';
  // Positive copies are intentionally allowed to stack across normal/family/shiny
  // and both parents. Debuffs are capped at one Lv10-equivalent to avoid
  // punishing a player for rolling multiple negative copies.
  return Math.max(0,Math.min(tone==='buff'?30:10,lv));
}
function sameSpeciesResonanceChance(a,b){
  if(!a||!b||a.species!==b.species)return 0;
  return Math.min(.15,pairExtraSkillLevel(a,b,'same_species_resonance')*.005);
}
function hybridVigorMods(a,b){
  if(!a||!b||a.species===b.species)return {lifeMax:0,mutate:0};
  const lv=pairExtraSkillLevel(a,b,'hybrid_vigor');
  return {lifeMax:Math.min(6,Math.floor(lv/5)),mutate:Math.min(.15,lv*.005)};
}
function chromaResonanceChance(a,b){return Math.min(.30,pairExtraSkillLevel(a,b,'chroma_resonance')*.01);}
function longLifeRerollChance(a,b){return Math.min(1,pairExtraSkillLevel(a,b,'long_life_line')*.05);}
function perfectEmbryoChance(a,b){return Math.min(.30,pairExtraSkillLevel(a,b,'perfect_embryo')*.01);}
function atavismChance(a,b){return Math.min(.10,pairExtraSkillLevel(a,b,'atavism')*.01);}
function skillDisorderChance(a,b){return Math.min(.10,pairExtraSkillLevel(a,b,'skill_disorder')*.01);}
function naturalLifeAbilityMods(a,b){
  const o={minUp:0,maxUp:0,minDown:0,maxDown:0};
  for(const m of [a,b]){
    if(!m)continue;
    for(const ent of effectiveExtraSkillEntries(m)){
      const lv=Math.max(1,Math.min(10,Number(ent.lv)||1));
      if(ent.id==='life_floor_up')o.minUp+=lv;
      else if(ent.id==='life_ceiling_up')o.maxUp+=lv;
      else if(ent.id==='life_floor_down')o.minDown+=Math.floor(lv/2);
      else if(ent.id==='life_ceiling_down')o.maxDown+=lv;
    }
  }
  return o;
}
function naturalLifeRange(a,b,hasShinyLineage=false){
  if(!a||!b)return {min:BASE_LIFE,max:BASE_LIFE,shiny:false};
  const pa=Math.max(BASE_LIFE,Number(a.maxLife)||Number(a.baseLife)||BASE_LIFE);
  const pb=Math.max(BASE_LIFE,Number(b.maxLife)||Number(b.baseLife)||BASE_LIFE);
  const shiny=!!hasShinyLineage;
  const ability=naturalLifeAbilityMods(a,b);
  const speciesBonus=offspringHpSpeciesBonus(a,b);
  const rawMin=shiny?SHINY_LINEAGE_BASE_LIFE:BASE_LIFE;
  const rawMax=shiny?Math.ceil((pa+pb)/1.5+5):Math.ceil((pa+pb)/2)+1;
  // v188: the 10+ / 1.5 formula belongs to 闪光血统：只要至少一位亲代为闪光即可。
  let max=Math.min(NATURAL_BIRTH_CAP,Math.max(BASE_LIFE,rawMax+speciesBonus+ability.maxUp-ability.maxDown));
  let min=Math.max(0,rawMin+ability.minUp-ability.minDown);
  min=Math.min(min,max);
  return {min,max,shiny,rawMin,rawMax,speciesBonus,ability};
}
function naturalLifeOdds(a,b,hasShinyLineage=false){
  return naturalLifeRange(a,b,hasShinyLineage);
}
function rollNaturalLife(a,b,rng=Math.random,hasShinyLineage=false){
  const range=naturalLifeRange(a,b,hasShinyLineage);
  let roll=range.min+Math.floor(rng()*(range.max-range.min+1));
  const reroll=longLifeRerollChance(a,b);
  if(roll===range.min&&reroll>0&&rng()<reroll){
    roll=range.min+Math.floor(rng()*(range.max-range.min+1));
  }
  return roll;
}
function shinyLineageCount(list){return (list||[]).filter(m=>m&&m.shiny).length;}
function shinyBaseChanceByStar(star){return Math.max(1,Math.min(5,Number(star)||1))*.001;}
function shinyLineageBreedBonus(a,b){return shinyLineageCount([a,b])*.01;}
function shinyPotionBreedBonus(a,b){return Math.min(.06,((a?.shinyBoost||0)+(b?.shinyBoost||0)));}
function shinyLineageDispatchBonus(team){return shinyLineageCount(team)*.01;}
function shinyBreedBonus(a,b){
  let lv=0;
  for(const m of [a,b])if(m)lv+=totalEffectiveSkillLevel(m,'shiny_breed');
  return Math.min(.01,lv*.001);
}
function exploreShinyChance(team,mission=null){
  let lv=0,extra=0;
  for(const m of (team||[])){
    lv+=totalEffectiveSkillLevel(m,'shiny_explore');
    if(mission)extra+=speciesMissionMods(m,mission).shiny||0;
  }
  return Math.min(.20,lv*.001+extra+shinyLineageDispatchBonus(team));
}
function naturalLifeBadge(m){
  ensureMonsterSystemsMonster(m);
  return '<span class="natural-life-badge">天生生命 '+m.baseLife+'</span>';
}
function lifeBadge(m){const cls=(m.life||0)<=5?'life-meter life-low':'life-meter';return '<span class="'+cls+'">❤ '+Math.max(0,m.life||0)+' / '+Math.max(1,m.maxLife||BASE_LIFE)+'</span>'+(m.lifePotionUsed?'<span class="life-used">生命药已使用</span>':'');}
function missionLifeReduction(m){return dispatchMods(m).lifeReduce||0;}
function missionLifeLoss(m,failed,mission=null){if(m?.shiny)return 1;const base=failed?5:1,special=mission?speciesMissionMods(m,mission).lifeReduce:0;return Math.max(1,base-missionLifeReduction(m)-special);}
function removeMonsterForLife(state,m,reason,time=Date.now()){
  if(!m)return false;
  archiveMonster(m,state);
  state.monsters=state.monsters.filter(x=>x.id!==m.id);
  if(typeof safeFamilyRegistry==='function')safeFamilyRegistry(state);
  state.memorial.unshift({...m,diedAt:time,deathReason:reason});
  state.memorial=state.memorial.slice(0,200);
  state.deaths++;

  // Smart auto-breeding must NOT switch off just because a parent dies.
  // It will select a new valid male/female pair on the next automation tick.
  if(state.manualBreedRepeat&&Array.isArray(state.manualBreedPairIds)&&state.manualBreedPairIds.includes(m.id)){
    state.manualBreedRepeat=false;
    state.manualBreedPairIds=[];
  }

  if(state.parentA===m.id)state.parentA=null;
  if(state.parentB===m.id)state.parentB=null;

  if(typeof recordActivity==='function')recordActivity('death',{key:'death-'+m.id+'-'+time,time,monster:{id:m.id,species:m.species,star:m.star,shiny:!!m.shiny,nickname:m.nickname||'',life:0,tint:m.tint,specialColor:m.specialColor??null},reason},state);
  return true;
}
function loseLife(state,m,amount,reason,time=Date.now()){
  if(!m||amount<=0)return false;
  m.life=Math.max(0,(m.life||0)-amount);
  archiveMonster(m,state);
  if(m.life<=0)return removeMonsterForLife(state,m,reason,time);
  return false;
}
const TRAITS=[
{id:'brave',name:'勇敢',desc:'派遣成功率 +3 个百分点，但失败时事故风险略高。'},
{id:'careful',name:'谨慎',desc:'派遣事故风险 -20%，成功率 +1 个百分点。'},
{id:'curious',name:'好奇',desc:'探索道具发现率 +2 个百分点，并更容易发现稀有技能。'},
{id:'lively',name:'活泼',desc:'派遣属性评分 +5%，在草地上更爱活动。'},
{id:'gentle',name:'温顺',desc:'作为亲代时，产蛋后的死亡风险 -8%。'},
{id:'tough',name:'坚韧',desc:'派遣事故风险 -12%。'},
{id:'greedy',name:'贪吃',desc:'派遣灵能报酬 +6%，但任务时间 +5%。'},
{id:'friendly',name:'亲人',desc:'摸摸与成功派遣获得更多亲密度。'}
];
const TRAIT_MAP=Object.fromEntries(TRAITS.map(x=>[x.id,x]));
function traitInfo(m){return TRAIT_MAP[m?.trait]||TRAITS[0];}
function traitBadge(m){const t=traitInfo(m);return '<span class="trait-badge trait-hover-target" data-trait-tip="'+escapeActivity(t.name)+'" data-trait-desc="'+escapeActivity(t.desc)+'">'+t.name+'</span>';}
function traitMods(m){const t=m?.trait,o={success:0,death:1,item:0,reward:1,duration:1,state:1,skillFind:1,bond:0,breedDeath:1};if(t==='brave'){o.success+=.03;o.death*=1.08;}else if(t==='careful'){o.success+=.01;o.death*=.80;}else if(t==='curious'){o.item+=.02;o.skillFind*=1.5;}else if(t==='lively'){o.state*=1.05;}else if(t==='gentle'){o.breedDeath*=.92;}else if(t==='tough'){o.death*=.88;}else if(t==='greedy'){o.reward*=1.06;o.duration*=1.05;}else if(t==='friendly'){o.bond+=2;}return o;}
function archiveSnapshot(m){
  if(!m)return null;
  return {
    id:m.id,species:m.species,star:m.star,shiny:!!m.shiny,nickname:m.nickname||'',
    gender:m.gender||'',life:m.life||0,maxLife:m.maxLife||BASE_LIFE,
    lifePotionUsed:!!m.lifePotionUsed,tint:m.tint||0,
    specialColor:Number.isInteger(m.specialColor)?m.specialColor:null,
    trait:m.trait||null,generation:m.generation||1,
    parents:Array.isArray(m.parents)?[...m.parents]:[],createdAt:m.createdAt||0,
    skillLv:Number.isInteger(m.skillLv)?m.skillLv:undefined,
    extraSkills:Array.isArray(m.extraSkills)?[...m.extraSkills]:[],
    extraSkillLv:Array.isArray(m.extraSkillLv)?[...m.extraSkillLv]:[],
    familySkill:m.familySkill?JSON.parse(JSON.stringify(m.familySkill)):null,
    familyName:m.familyName||''
  };
}
function ensureFamilyArchive(state=s){
  if(!state.familyArchive||typeof state.familyArchive!=='object')state.familyArchive={};
  for(const m of [...(state.monsters||[]),...(state.memorial||[]),...eggMonsters(state)])if(m)state.familyArchive[m.id]=archiveSnapshot(m);
  return state.familyArchive;
}
function archiveMonster(m,state=s){
  if(!m)return;
  if(!state.familyArchive||typeof state.familyArchive!=='object')state.familyArchive={};
  state.familyArchive[m.id]=archiveSnapshot(m);
}

function compactFamilyArchive(state=s,limit=6000){
  const arc=state.familyArchive;
  if(!arc||typeof arc!=='object')return 0;
  const keys=Object.keys(arc);
  if(keys.length<=limit)return 0;

  const keep=new Set();
  const activeFamilies=activeFamilyNames(state);

  // Preserve every member of an active family.
  for(const [id,rec] of Object.entries(arc)){
    if(rec?.familyName&&activeFamilies.has(rec.familyName))keep.add(Number(id));
  }

  // Preserve living monsters and all of their ancestors recursively.
  const stack=(state.monsters||[]).map(m=>m.id);
  while(stack.length){
    const id=Number(stack.pop());
    if(!id||keep.has(id))continue;
    keep.add(id);
    const rec=arc[id]||(state.monsters||[]).find(m=>m.id===id);
    for(const p of (rec?.parents||[]))if(!keep.has(Number(p)))stack.push(Number(p));
  }

  const remaining=keys.map(Number)
    .filter(id=>!keep.has(id))
    .sort((a,b)=>(Number(arc[b]?.createdAt)||0)-(Number(arc[a]?.createdAt)||0));

  const room=Math.max(0,limit-keep.size);
  for(const id of remaining.slice(0,room))keep.add(id);

  // If protected history alone exceeds the limit, do not destroy it.
  if(keep.size>=keys.length)return 0;

  let removed=0;
  for(const id of keys){
    if(!keep.has(Number(id))){delete arc[id];removed++;}
  }
  return removed;
}
function familyRecord(id){return s.monsters.find(m=>m.id===id)||s.memorial.find(m=>m.id===id)||eggMonsters(s).find(m=>m.id===id)||s.familyArchive?.[id]||null;}
function familySkillSummaryHTML(rec){
  if(!rec)return '';
  const m={...rec,extraSkills:Array.isArray(rec.extraSkills)?[...rec.extraSkills]:[],extraSkillLv:Array.isArray(rec.extraSkillLv)?[...rec.extraSkillLv]:[],familySkill:rec.familySkill?JSON.parse(JSON.stringify(rec.familySkill)):null};
  ensureMonsterSystemsMonster(m);
  return '<div class="family-skill-summary">'+monsterSkillSummary(m)+'</div>';
}

function familyCard(rec,currentId=null){
  if(!rec)return '<div class="family-missing">资料缺失。</div>';
  const fake={...rec,trait:rec.trait||'brave'};
  const cur=familyRecord(currentId);
  const other=cur?.familyName&&rec.familyName&&cur.familyName!==rec.familyName;
  return '<div class="family-card '+(rec.id===currentId?'current':'')+'" data-family-id="'+rec.id+'">'
    +sprite(rec.species,rec.tint,rec.shiny,rec.specialColor)
    +'<span><strong>'+G.stars(rec.star)+' '+(rec.nickname||G.SPECIES[rec.species]?.name||('怪物 #'+rec.id))+(rec.shiny?' ✦':'')+'</strong>'
    +'<small>#'+rec.id+' · '+(rec.gender||'？')+' · 第 '+(rec.generation||1)+' 代 · ❤ '+(rec.life??'?')+'/'+(rec.maxLife??'?')+'<br>个性：'+traitInfo(fake).name+'</small>'
    +(rec.familyName?'<span class="family-link-badge '+(other?'family-other-family':'')+'">'+escapeActivity(rec.familyName)+'</span>':'<span class="family-link-badge">无家族</span>')
    +familySkillSummaryHTML(rec)+'</span></div>';
}
function renderFamily(m){
  if(!m)return;
  ensureFamilyArchive(s);archiveMonster(m,s);
  const all=Object.values(s.familyArchive||{});
  const parents=(m.parents||[]).map(familyRecord).filter(Boolean);
  const grandparents=[];
  for(const p of parents)for(const gid of (p.parents||[])){const g=familyRecord(gid);if(g&&!grandparents.some(x=>x.id===g.id))grandparents.push(g);}
  const siblings=m.parents?.length?all.filter(x=>x.id!==m.id&&Array.isArray(x.parents)&&x.parents.some(id=>m.parents.includes(id))):[];
  const children=all.filter(x=>Array.isArray(x.parents)&&x.parents.includes(m.id));
  const grandchildren=all.filter(x=>children.some(c=>Array.isArray(x.parents)&&x.parents.includes(c.id)));

  $('family-content').innerHTML=
    '<div class="family-navbar"><strong>家族 Tree · '+escapeActivity(name(m))+'</strong><small>#'+m.id+' · 第 '+(m.generation||1)+' 代'+(m.familyName?' · '+escapeActivity(m.familyName):' · 无家族')+'</small></div>'
    +'<div class="family-root">'+sprite(m.species,m.tint,m.shiny,m.specialColor)+'<div><h2>'+name(m)+' '+G.stars(m.star)+genderBadge(m)+traitBadge(m)+'</h2><p>❤ '+m.life+'/'+m.maxLife+' · '+colorName(m)+'</p>'+familySkillSummaryHTML(m)+skillListHTML(m)+'</div></div>'
    +'<div class="family-branch-summary">后代如果加入其他家族，会用紫色家族名标出。<b>点击任何怪物卡片</b>即可切换到它自己的家族 Tree。</div>'
    +'<div class="family-tree-main">'
    +'<section class="family-gen-section"><h3>祖父母</h3><div class="family-gen-row">'+(grandparents.length?grandparents.map(x=>familyCard(x,m.id)).join(''):'<div class="family-missing">暂无记录。</div>')+'</div></section>'
    +'<section class="family-gen-section"><h3>父母</h3><div class="family-gen-row">'+(parents.length?parents.map(x=>familyCard(x,m.id)).join(''):'<div class="family-missing">初代伙伴。</div>')+'</div></section>'
    +'<section class="family-gen-section"><h3>当前</h3><div class="family-gen-row">'+familyCard(m,m.id)+'</div></section>'
    +'<section class="family-gen-section"><h3>兄弟姐妹</h3><div class="family-gen-row">'+(siblings.length?siblings.map(x=>familyCard(x,m.id)).join(''):'<div class="family-missing">暂无记录。</div>')+'</div></section>'
    +'<section class="family-gen-section"><h3>子代</h3><div class="family-gen-row">'+(children.length?children.map(x=>familyCard(x,m.id)).join(''):'<div class="family-missing">暂无记录。</div>')+'</div></section>'
    +'<section class="family-gen-section"><h3>孙代</h3><div class="family-gen-row">'+(grandchildren.length?grandchildren.map(x=>familyCard(x,m.id)).join(''):'<div class="family-missing">暂无记录。</div>')+'</div></section>'
    +'</div>';

  $('family-content').querySelectorAll('[data-family-id]').forEach(card=>card.onclick=()=>{
    const rec=familyRecord(Number(card.dataset.familyId));if(rec)renderFamily(rec);
  });
  if(!$('family-dialog').open)$('family-dialog').showModal();
}
function ensureMonsterSystemsMonster(m,now=Date.now()){
  if(!m)return;
  if(typeof m.gender!=='string'||!['公','母'].includes(m.gender))m.gender=m.id%2?'公':'母';
  if(typeof m.favorite!=='boolean')m.favorite=false;
  if(typeof m.shinyAutoLockDone!=='boolean')m.shinyAutoLockDone=false;
  if(m.shiny&&!m.shinyAutoLockDone){m.locked=true;m.shinyAutoLockDone=true;}
  if(!Number.isFinite(m.createdAt))m.createdAt=now-m.id*1000;
  if(!TRAIT_MAP[m.trait])m.trait=TRAITS[Math.abs(Number(m.id)||0)%TRAITS.length].id;
  if(!Number.isInteger(m.generation)||m.generation<1)m.generation=(m.parents&&m.parents.length)?2:1;
  ensureSkillSlots(m);
  if(!Number.isFinite(m.baseLife)){
    m.baseLife=deterministicBaseLife(m);
    const oldMax=Number(m.maxLife)||20,oldLife=Number(m.life);
    const ratio=Number.isFinite(oldLife)&&oldMax>0?Math.max(0,Math.min(1,oldLife/oldMax)):1;
    m.lifePotionUsed=!!m.lifePotionUsed;
    m.lifeSkillApplied=vitalitySkillBonus(m);
    m.maxLife=m.baseLife+(m.lifePotionUsed?5:0)+m.lifeSkillApplied;
    m.life=Math.max(1,Math.round(m.maxLife*ratio));
  }
  if(typeof m.lifePotionUsed!=='boolean')m.lifePotionUsed=false;
  if(!Number.isFinite(m.lifeSkillApplied))m.lifeSkillApplied=vitalitySkillBonus(m);
  refreshLifeCapacity(m,true);
}
function ensureMonsterSystemsState(state){
  if(typeof state.ranchName!=='string'||!state.ranchName.trim())state.ranchName='Qinster 牧场';
  state.ranchName=state.ranchName.trim().slice(0,16)||'Qinster 牧场';
  if(typeof state.tutorialCompleted!=='boolean')state.tutorialCompleted=false;
  if(!Number.isInteger(state.tutorialStep))state.tutorialStep=0;
  if(typeof state.tutorialActive!=='boolean')state.tutorialActive=false;
  if(!Array.isArray(state.eggQueue))state.eggQueue=[];
  state.hatchSlots=Number(state.hatchSlots)>=2?2:1;
  if(!state.egg2||!state.egg2.child)state.egg2=null;
  state.eggQueue=state.eggQueue.filter(e=>e&&e.child).slice(0,EGG_QUEUE_MAX);
  if(!state.buildings||typeof state.buildings!=='object')state.buildings={energy:0,hatch:0,shiny:0,item:0,breedRest:0};
  state.buildings.energy=Math.max(0,Math.min(10,Math.floor(Number(state.buildings.energy)||0)));
  state.buildings.hatch=Math.max(0,Math.min(10,Math.floor(Number(state.buildings.hatch)||0)));
  state.buildings.shiny=Math.max(0,Math.min(10,Math.floor(Number(state.buildings.shiny)||0)));
  state.buildings.item=Math.max(0,Math.min(10,Math.floor(Number(state.buildings.item)||0)));
  state.buildings.breedRest=Math.max(0,Math.min(20,Math.floor(Number(state.buildings.breedRest)||0)));
  state.flags=state.flags||{};
  if(!state.flags.shinyBuildingUnlocked&&[...(state.monsters||[]),...(state.memorial||[])].some(m=>(m.star||0)>=5))state.flags.shinyBuildingUnlocked=true;

if(!Number.isFinite(state.farmItemLast))state.farmItemLast=Date.now();for(const m of [...(state.monsters||[]),...(state.memorial||[]),...(state.egg?[state.egg.child,state.egg.twinChild].filter(Boolean):[]),...(state.egg2?[state.egg2.child,state.egg2.twinChild].filter(Boolean):[]),...(state.eggQueue||[]).flatMap(e=>[e.child,e.twinChild].filter(Boolean))])ensureMonsterSystemsMonster(m,state.last||Date.now());if(!state.items||typeof state.items!=='object')state.items={colors:[0,0,0,0,0,0],specialColors:[0,0,0],star:0,skill:0,reroll:0,life:0,timeCut:0,timeInstant:0,shiny:0};if(!Array.isArray(state.items.colors))state.items.colors=[0,0,0,0,0,0];state.items.colors=Array.from({length:6},(_,i)=>Math.max(0,Math.floor(Number(state.items.colors[i])||0)));if(!Array.isArray(state.items.specialColors))state.items.specialColors=[0,0,0];state.items.specialColors=Array.from({length:3},(_,i)=>Math.max(0,Math.floor(Number(state.items.specialColors[i])||0)));state.items.star=Math.max(0,Math.floor(Number(state.items.star)||0));state.items.skill=Math.max(0,Math.floor(Number(state.items.skill)||0));state.items.reroll=Math.max(0,Math.floor(Number(state.items.reroll)||0));state.items.life=Math.max(0,Math.floor(Number(state.items.life)||0));state.items.shiny=Math.max(0,Math.floor(Number(state.items.shiny)||0));if(state.dispatch&&typeof state.dispatch==='object'){if(!Array.isArray(state.dispatch.monsterIds))state.dispatch.monsterIds=state.dispatch.monsterId?[state.dispatch.monsterId]:[];state.dispatch.monsterIds=state.dispatch.monsterIds.filter(id=>(state.monsters||[]).some(m=>m.id===id)).slice(0,3);if(!state.dispatch.monsterIds.length)state.dispatch=null;}if(!state.familyArchive||typeof state.familyArchive!=='object')state.familyArchive={};}
ensureMonsterSystemsState(s);
ensureFamilyArchive(s);
function genderBadge(m){return '<span class="gender-badge '+(m.gender==='公'?'male':'female')+'">'+m.gender+'</span>';}
function favoriteBadge(m){return m.favorite?'<span class="fav-badge">最爱</span>':'';}
function shinyBadge(m){return m&&m.shiny?'<span class="shiny-badge">闪光</span>':'';}
function shinyText(m){return m&&m.shiny?' · 闪光':'';}
function dispatchReadyBadge(m){
  if(isDispatched(m.id))return '<span class="dispatch-badge">派遣中</span>';
  if(isEggParent(m.id))return '<span class="dispatch-badge">孵化亲代</span>';
  if(m.locked)return '<span class="dispatch-badge">已锁定 · 仅手动</span>'; 
  return isInFarm(m.id)?'<span class="dispatch-badge farm-badge">生产牧场</span>':'<span class="box-badge">怪物盒</span>';
}
function isEggParent(id){const eggs=[s.egg,s.egg2,...(s.eggQueue||[])].filter(Boolean);return eggs.some(e=>Array.isArray(e.child?.parents)&&e.child.parents.includes(id));}
function skillTooltipData(id,kind='extra',m=null,slotIdx=null){
  if(kind==='innate'){
    if(!m)return null;
    return {name:G.SPECIES[m.species].skill,tone:'buff',desc:skillEffect(m),extra:'种族技能 · Lv'+skillNum(m)+'/10 · 不可替换'};
  }
  const sk=extraSkill(id);if(!sk)return null;const lv=m&&Number.isInteger(slotIdx)?extraLv(m,slotIdx):1;
  return {name:sk.name,tone:sk.tone,desc:extraSkillDesc(id,lv),extra:(sk.tone==='buff'?'Buff':'Debuff')+' · '+(sk.group||'技能')+' · 当前 Lv'+lv+'/10'};
}
function familySkillHoverAttrs(id,lv){
  const sk=extraSkill(id);if(!sk)return '';
  const tone=sk.tone||'buff';
  return ' class="skill-hover-target '+(tone==='debuff'?'skill-tone-debuff':'skill-tone-buff')+'" data-skill-tip="'+escapeActivity(sk.name)+'" data-skill-tone="'+escapeActivity(tone)+'" data-skill-desc="'+escapeActivity(extraSkillDesc(id,lv))+'" data-skill-extra="'+escapeActivity((tone==='buff'?'Buff':'Debuff')+' · '+(sk.group||'技能')+' · 当前 Lv'+lv+'/10')+'"';
}
function skillHoverAttrs(id,kind='extra',m=null,slotIdx=null){const d=skillTooltipData(id,kind,m,slotIdx);if(!d)return '';return ' class="skill-hover-target '+(d.tone==='debuff'?'skill-tone-debuff':d.tone==='buff'?'skill-tone-buff':'')+'" data-skill-tip="'+escapeActivity(d.name)+'" data-skill-tone="'+escapeActivity(d.tone)+'" data-skill-desc="'+escapeActivity(d.desc)+'" data-skill-extra="'+escapeActivity(d.extra)+'"';}
function calcHoverAttrs(title,formula,extra='鼠标停留 1 秒或点击查看计算方法'){
  return ' class="calc-hover-target" data-calc-tip="'+escapeActivity(title)+'" data-calc-formula="'+escapeActivity(formula)+'" data-calc-extra="'+escapeActivity(extra)+'"';
}
function bindSkillTooltip(){
  let tip=$('skill-tooltip');if(!tip){tip=document.createElement('div');tip.id='skill-tooltip';tip.setAttribute('role','tooltip');document.body.appendChild(tip);}
  let timer=null,current=null,pinned=false;
  const selector='[data-skill-tip],[data-calc-tip],[data-trait-tip]';
  const pos=el=>{const r=el.getBoundingClientRect(),w=tip.offsetWidth,h=tip.offsetHeight;let l=Math.min(window.innerWidth-w-10,Math.max(10,r.left)),t=r.bottom+8;if(t+h>window.innerHeight-10)t=Math.max(10,r.top-h-8);tip.style.left=l+'px';tip.style.top=t+'px';};
  const show=(el,pin=false)=>{const host=el.closest?.('dialog[open]')||document.body;if(tip.parentElement!==host)host.appendChild(tip);if(el.dataset.calcTip){tip.innerHTML='<strong>计算 · '+escapeActivity(el.dataset.calcTip)+'</strong><div class="tooltip-tone calc">'+escapeActivity(el.dataset.calcFormula||'')+'</div><div>'+escapeActivity(el.dataset.calcExtra||'')+'</div>';}else if(el.dataset.traitTip){tip.innerHTML='<strong>个性 · '+escapeActivity(el.dataset.traitTip)+'</strong><div class="tooltip-tone buff">'+escapeActivity(el.dataset.traitDesc||'')+'</div><div>个性效果会直接参与对应的派遣、繁育或亲密度计算。</div>';}else{tip.innerHTML='<strong>'+escapeActivity(el.dataset.skillTip||'技能')+'</strong><div class="tooltip-tone '+(el.dataset.skillTone==='debuff'?'debuff':'buff')+'">'+escapeActivity(el.dataset.skillDesc||'')+'</div><div>'+escapeActivity(el.dataset.skillExtra||'')+'</div>';}tip.style.display='block';pinned=pin;tip.classList.toggle('pinned',pinned);requestAnimationFrame(()=>pos(el));};
  const hide=force=>{if(timer){clearTimeout(timer);timer=null;}current=null;if(pinned&&!force)return;pinned=false;tip.classList.remove('pinned');tip.style.display='none';};
  document.addEventListener('pointerover',e=>{const el=e.target.closest?.(selector);if(!el||el===current||pinned)return;hide(true);current=el;timer=setTimeout(()=>{if(current===el&&!pinned)show(el,false);},1000);});
  document.addEventListener('pointerout',e=>{const from=e.target.closest?.(selector);if(!from)return;const to=e.relatedTarget?.closest?.(selector);if(to===from)return;if(!pinned)hide(true);});
  document.addEventListener('click',e=>{const el=e.target.closest?.(selector);if(el){e.preventDefault();e.stopPropagation();current=el;show(el,true);return;}if(pinned&&!e.target.closest('#skill-tooltip'))hide(true);});
  document.addEventListener('scroll',()=>{if(!pinned)hide(true);},true);
}
function skillChipHTML(label,id,kind='extra',m=null,slotIdx=null){
  if(kind==='innate'){
    const lv=skillNum(m),title=G.SPECIES[m.species].skill+' Lv'+lv;
    return '<div class="skill-chip primary-skill"><b>'+label+' · <span'+skillHoverAttrs(null,'innate',m,null)+'>'+title+'</span></b><span class="skill-value">'+skillEffect(m)+'</span></div>';
  }
  const sk=extraSkill(id);
  if(!sk)return '<div class="skill-chip empty"><b>'+label+'</b><span>— 空位 —</span></div>';
  const lv=extraLv(m,slotIdx);
  return '<div class="skill-chip '+(sk.tone==='debuff'?'negative':'positive')+'"><b>'+label+' · <span'+skillHoverAttrs(id,'extra',m,slotIdx)+'>'+sk.name+' Lv'+lv+'</span></b><span class="skill-value">'+extraSkillDesc(id,lv)+'</span></div>';
}


function familyNameSeed(a,b,child=null){
  const syllables=['芽','星','月','森','焰','羽','露','岩','风','霜','辉','影','晶','岚','虹','砂','藤','溪','曜','云'];
  const ai=Math.abs((a?.species||0)*7+(a?.id||0))%syllables.length;
  const bi=Math.abs((b?.species||0)*11+(b?.id||0)+3)%syllables.length;
  let first=syllables[ai],second=syllables[bi];
  if(first===second)second=syllables[(bi+5)%syllables.length];
  const suffix=(child?.id||0)%3===0?'氏族':'家族';
  return first+second+suffix;
}
function assignFamilyName(child,a,b,rng=Math.random){
  const gen=child.generation||1;
  const fa=(a?.familyName||'').trim(),fb=(b?.familyName||'').trim();

  // Every Gen5 / Gen10 / Gen15... milestone can found a new family.
  if(gen>=5&&gen%5===0&&rng()<.50){
    child.familyName=familyNameSeed(a,b,child);
    return child.familyName;
  }

  if(fa&&fb&&fa===fb){
    child.familyName=fa;
  }else if(fa&&fb&&fa!==fb){
    const r=rng();
    child.familyName=r<.25?fa:r<.50?fb:'';
  }else if(fa||fb){
    child.familyName=rng()<.50?(fa||fb):'';
  }else{
    // Both parents are already familyless: this is one continuous new bloodline.
    child.familyName='';
  }

  // Only a child that LOST an existing family starts a new Gen1 bloodline.
  // If both parents were already familyless, generation keeps increasing normally.
  if(!child.familyName&&(fa||fb)){
    child.generation=1;
    child.familySkill=null;
  }
  return child.familyName;
}

function activeFamilyNames(state=s){
  const out=new Set();
  for(const m of (state.monsters||[])){
    const fam=(m?.familyName||'').trim();
    if(fam&&m.life>0)out.add(fam);
  }
  for(const m of eggMonsters(state)){
    const fam=(m?.familyName||'').trim();
    if(fam)out.add(fam);
  }
  return out;
}
function safeFamilyRegistry(state=s){
  if(!state.familySkillRegistry||typeof state.familySkillRegistry!=='object')state.familySkillRegistry={};
  const active=activeFamilyNames(state);

  // Remove extinct active families from the registry only.
  for(const fam of Object.keys(state.familySkillRegistry)){
    if(!active.has(fam))delete state.familySkillRegistry[fam];
  }

  const used=new Set(Object.values(state.familySkillRegistry).map(x=>x?.id).filter(id=>extraSkill(id)));
  const members=[...(state.monsters||[]),...eggMonsters(state)].filter(Boolean);

  for(const fam of active){
    if(state.familySkillRegistry[fam]?.id)continue;

    const same=members.filter(m=>(m.familyName||'').trim()===fam);
    const candidates=same.map(m=>m.familySkill?.parts?.[0]).filter(p=>p&&extraSkill(p.id))
      .sort((a,b)=>(Number(b.lv)||1)-(Number(a.lv)||1));

    let id=candidates.find(p=>!used.has(p.id))?.id||null;
    if(!id){
      const pool=EXTRA_SKILLS.map(x=>x.id);
      // deterministic starting point by family name, but avoid used skill IDs
      let hash=0;
      for(const ch of fam)hash=(hash*31+ch.codePointAt(0))>>>0;
      for(let k=0;k<pool.length;k++){
        const pick=pool[(hash+k)%pool.length];
        if(!used.has(pick)){id=pick;break;}
      }
      if(!id)id=pool[hash%pool.length]||null;
    }
    if(id){state.familySkillRegistry[fam]={id};used.add(id);}
  }
  return state.familySkillRegistry;
}
function canonicalFamilySkillId(familyName,state=s){
  return familyName?state.familySkillRegistry?.[familyName]?.id||null:null;
}
function normalizeFamilySkill(m){
  if((m.generation||1)<10||!(m.familyName||'').trim()){
    m.familySkill=null;
    return null;
  }
  const fam=(m.familyName||'').trim();
  const canonical=canonicalFamilySkillId(fam,s);
  const old=m.familySkill?.parts?.[0];

  // Active family uses its fixed canonical skill.
  if(canonical){
    const lv=Math.max(1,Math.min(10,Number(old?.lv)||1));
    m.familySkill={parts:[{id:canonical,lv}]};
    return m.familySkill;
  }

  // Historical/archived family keeps its old recorded skill for genealogy.
  if(old&&extraSkill(old.id)){
    const lv=Math.max(1,Math.min(10,Number(old.lv)||1));
    m.familySkill={parts:[{id:old.id,lv}]};
    return m.familySkill;
  }
  m.familySkill=null;
  return null;
}
function familySkillParts(m){
  ensureSkillSlots(m);
  return normalizeFamilySkill(m)?.parts||[];
}
function familySkillName(m){
  const p=familySkillParts(m)[0];
  return p?(extraSkill(p.id)?.name||'未知技能')+' Lv'+p.lv:'空';
}
function familySkillChipHTML(m){
  if((m.generation||1)<10){
    return '<div class="skill-chip empty"><b>技能4（家族技能）</b><span>第10代起才会出现</span></div>';
  }
  const p=familySkillParts(m)[0];
  const familyLabel=m.familyName?(' · '+escapeActivity(m.familyName)):'';
  if(!p)return '<div class="skill-chip empty"><b>技能4（家族技能）'+familyLabel+'</b><span>尚未形成家族技能</span></div>';
  const other=effectiveExtraSkillEntries(m).filter(e=>e.id===p.id&&e.source!=='family');
  const otherLv=other.reduce((sum,e)=>sum+e.lv,0);
  const stack=otherLv?'<br><b>叠加：</b>其他同效果技能 Lv'+otherLv+' + 家族 Lv'+p.lv+' = 有效 Lv'+(otherLv+p.lv):'';
  return '<div class="skill-chip family-skill"><b>技能4（家族技能）'+familyLabel+' · '+escapeActivity(extraSkill(p.id)?.name||'未知技能')+' Lv'+p.lv+'</b><span class="skill-value">'+extraSkillDesc(p.id,p.lv)+stack+'</span></div>';
}
function effectiveExtraSkillEntries(m){
  ensureSkillSlots(m);
  const out=[];
  for(const idx of [0,1]){
    const id=m.extraSkills?.[idx];
    if(id)out.push({id,lv:extraLv(m,idx),source:'normal'});
  }
  for(const p of familySkillParts(m))out.push({id:p.id,lv:p.lv,source:'family'});
  if(m.shiny&&m.extraSkills?.[3])out.push({id:m.extraSkills[3],lv:extraLv(m,3),source:'shiny'});
  return out;
}
function totalEffectiveSkillLevel(m,id){
  return effectiveExtraSkillEntries(m)
    .filter(ent=>ent.id===id)
    .reduce((sum,ent)=>sum+ent.lv,0);
}
function effectiveSkillCopies(m,id){
  return effectiveExtraSkillEntries(m).filter(ent=>ent.id===id);
}
function extraIdByName(name){
  const hit=EXTRA_SKILLS.find(sk=>sk.name===name);
  return hit?.id||null;
}

function speciesEquivalentExtraId(m){
  const passive=G.SPECIES[m?.species]?.passive;
  return ({
    incubate:'warm_nest',
    fortune:'lucky_blossom',
    mission_success:'sure_step',
    mission_item:'treasure_nose',
    mission_reward:'bounty_hunter',
    mission_guard:'mission_guard'
  })[passive]||null;
}
function parentAbilityMap(m){
  ensureMonsterSystemsMonster(m);
  const map=new Map();
  const add=(id,lv)=>{
    if(!id||!extraSkill(id))return;
    map.set(id,Math.max(map.get(id)||0,Math.max(1,Math.min(10,Number(lv)||1))));
  };
  // If a species skill has exactly the same ability name as an ordinary skill,
  // it counts as the same ability source for inheritance level calculations.
  add(speciesEquivalentExtraId(m)||extraIdByName(G.SPECIES[m.species]?.skill),skillNum(m));
  for(const ent of effectiveExtraSkillEntries(m))add(ent.id,ent.lv);
  return map;
}
function inheritedLevelRange(id,a,b){
  const ma=parentAbilityMap(a),mb=parentAbilityMap(b);
  const la=ma.get(id)||0,lb=mb.get(id)||0;
  if(la&&lb)return {min:1,max:Math.min(10,Math.floor((la+lb)/2)+1),a:la,b:lb};
  const one=Math.max(la,lb);
  return {min:1,max:Math.max(1,one||1),a:la,b:lb};
}
function rollInheritedAbilityLevel(id,a,b,rng=Math.random){
  const r=inheritedLevelRange(id,a,b),min=Math.max(1,r.min),max=Math.max(min,Math.min(10,r.max));
  return min+Math.floor(rng()*(max-min+1));
}
function inheritedAbilityPool(a,b){
  return [...new Set([...parentAbilityMap(a).keys(),...parentAbilityMap(b).keys()])].filter(id=>extraSkill(id)?.tone!=='debuff');
}
function rollInheritedAbility(a,b,rng=Math.random,used=[]){
  const pool=inheritedAbilityPool(a,b).filter(id=>!used.includes(id));
  if(!pool.length)return null;
  const id=pool[Math.min(pool.length-1,Math.floor(rng()*pool.length))];
  return {id,lv:rollInheritedAbilityLevel(id,a,b,rng)};
}
function familySkillUpgradeChance(lv){
  lv=Math.max(1,Math.min(10,Math.floor(Number(lv)||1)));
  if(lv>=10)return 0;
  // Same-level parents become progressively harder to advance:
  // Lv1+1 -> Lv2: 90%, ... Lv8+8 -> Lv9: 20%, Lv9+9 -> Lv10: 10%.
  return Math.max(.10,Math.min(.90,(10-lv)*.10));
}
function rollFamilySkill(a,b,child,rng=Math.random){
  if((child.generation||1)<10||!(child.familyName||'').trim())return null;
  safeFamilyRegistry(s);

  const fam=child.familyName.trim();
  let id=canonicalFamilySkillId(fam,s);

  if(!id){
    // A newly formed family starts its fixed family skill at Lv1.
    const used=new Set(Object.values(s.familySkillRegistry||{}).map(x=>x?.id).filter(Boolean));
    const preferred=[a,b]
      .filter(m=>(m?.familyName||'').trim()===fam)
      .map(m=>m?.familySkill?.parts?.[0]?.id)
      .filter(id=>id&&extraSkill(id)&&!used.has(id));
    id=preferred[0]||EXTRA_SKILLS.find(sk=>!used.has(sk.id))?.id||EXTRA_SKILLS[0]?.id||null;
    if(id)s.familySkillRegistry[fam]={id};
  }
  if(!id)return null;

  // v188 family progression rule:
  // - family skill never drops a level on inheritance;
  // - two same-family parents with the same fixed family skill and SAME level may advance by 1;
  // - the chance gets lower at high levels: (10 - currentLv) * 10%;
  // - unequal levels inherit the higher level unchanged;
  // - a single matching parent passes its current level unchanged.
  const matching=[a,b].map(p=>{
    if((p?.familyName||'').trim()!==fam)return null;
    const fp=p?.familySkill?.parts?.[0];
    if(!fp||fp.id!==id)return null;
    return Math.max(1,Math.min(10,Number(fp.lv)||1));
  }).filter(v=>v!==null);

  let lv=matching.length?Math.max(...matching):1;
  if(matching.length===2&&matching[0]===matching[1]&&lv<10){
    const chance=familySkillUpgradeChance(lv);
    if(rng()<chance){
      const from=lv;
      lv=Math.min(10,lv+1);
      child._familySkillUpgrade={id,name:extraSkill(id)?.name||id,from,to:lv,chance};
    }else{
      child._familySkillUpgrade={id,name:extraSkill(id)?.name||id,from:lv,to:lv,chance,failed:true};
    }
  }
  return {parts:[{id,lv}]};
}
function skillListHTML(m){
  ensureMonsterSystemsMonster(m);
  const html=[
    skillChipHTML('技能1（种族技能）',null,'innate',m,null),
    skillChipHTML('技能2（普通技能）',m.extraSkills[0],'extra',m,0),
    skillChipHTML('技能3（普通技能）',m.extraSkills[1],'extra',m,1),
    familySkillChipHTML(m)
  ];
  if(m.shiny)html.push(skillChipHTML('技能5（闪光专属）',m.extraSkills[3],'extra',m,3));
  return '<div class="skill-list">'+html.join('')+'</div>';
}
function breedMods(a,b){
  const mods={star:0,down:0,incubateMult:1,inherit:.55,mutate:.10,thirdChance:.35,fail:.01,deathMult:1,cooldownMult:1,costMult:1,parentLifeReduce:0,parentLifeBonus:0};
  mods.mutate+=hybridVigorMods(a,b).mutate;
  for(const m of [a,b])for(const ent of effectiveExtraSkillEntries(m)){
    const id=ent.id,lv=ent.lv;if(!id)continue;
    switch(id){
      case'warm_nest':mods.incubateMult*=1-.015*lv;break;
      case'lucky_blossom':mods.star+=.003*lv;break;
      case'thick_shell':mods.fail-=.0008*lv;break;
      case'stable_blood':mods.down-=.007*lv;break;
      case'legacy_mark':mods.inherit+=.015*lv;break;
      case'guardian_heart':if(lv>=5)mods.parentLifeReduce+=1;mods.inherit+=.005*lv;break;
      case'swift_rest':mods.cooldownMult*=Math.max(.70,1-.015*lv);break;
      case'cold_shell':mods.incubateMult*=1+.015*lv;break;
      case'dull_luck':mods.star-=.003*lv;break;
      case'fragile_shell':mods.fail+=.001*lv;break;
      case'wild_blood':mods.down+=.01*lv;break;
      case'broken_legacy':mods.inherit-=.015*lv;break;
      case'frail_parent':if(lv>=5)mods.parentLifeBonus+=1;mods.inherit-=.005*lv;break;
      case'slow_rest':mods.cooldownMult*=1+.02*lv;break;
    }
  }
  mods.inherit=Math.max(.20,Math.min(.85,mods.inherit));
  mods.fail=Math.max(.002,Math.min(.06,mods.fail));
  // v164: 掉星相关技能允许真正叠加。最终概率仍由 applyDropStarModifier 的自然边界控制，
  // 因此不再用旧的 -8pp / +18pp 隐藏截断，让多只怪物/多个技能的投入有实际回报。
  mods.down=Math.max(-.45,Math.min(.45,mods.down));
  return mods;
}
function dispatchMods(m){
  ensureMonsterSystemsMonster(m);
  const mods={reward:1,fail:0,item:0,deathMult:1,duration:1,lifeReduce:0};
  for(const ent of effectiveExtraSkillEntries(m)){
    const id=ent.id,lv=ent.lv;if(!id)continue;
    switch(id){
      case'treasure_nose':mods.item+=.005*lv;break;
      case'sure_step':mods.fail-=.005*lv;break;
      case'bounty_hunter':mods.reward*=1+.02*lv;break;
      case'mission_guard':mods.lifeReduce+=lv>=10?4:lv>=9?3:lv>=6?2:lv>=3?1:0;break;
      case'lost_route':mods.fail+=.005*lv;break;
      case'empty_pouch':mods.item-=.005*lv;break;
      case'thin_reward':mods.reward*=Math.max(.55,1-.02*lv);break;
      case'forced_march':mods.duration*=Math.max(.70,1-.015*lv);mods.fail+=.002*lv;break;
    }
  }
  mods.fail=Math.max(-.08,Math.min(.08,mods.fail));
  mods.item=Math.max(-.08,Math.min(.08,mods.item));
  mods.lifeReduce=Math.min(4,mods.lifeReduce);
  return mods;
}
function newbornSkillLevel(id,rng=Math.random,shinySlot=false){return id?(shinySlot?shinyBonusSkillLevel(rng):ordinarySkillLevel(rng)):1;}
function uniqueSkillRoll(rng,used){let tries=0,id=null;do{id=randomExtraSkillId(rng);tries++;}while(used.includes(id)&&tries<8);return id;}
function rerollSkillId(rng=Math.random,used=[]){
  const ordinary=ordinarySkillPool().filter(sk=>!used.includes(sk.id));
  const rare=ULTRA_RARE_SKILLS.map(id=>extraSkill(id)).filter(sk=>sk&&!used.includes(sk.id));
  // v188: skill reshape potion can roll rare shiny skills; each rare skill has 25% of a normal skill's weight.
  const entries=[...ordinary.map(sk=>({id:sk.id,w:1})),...rare.map(sk=>({id:sk.id,w:.25}))];
  if(!entries.length)return uniqueSkillRoll(rng,used);
  let roll=rng()*entries.reduce((sum,e)=>sum+e.w,0);
  for(const e of entries){roll-=e.w;if(roll<=0)return e.id;}
  return entries[entries.length-1].id;
}
G.breedCost=function(state){const [a,b]=G.pair(state);if(!a||!b)return 20;return Math.max(10,Math.round(coreBreedCost(state)*breedMods(a,b).costMult));};
G.blocked=function(state,now){const [a,b]=G.pair(state);if(!a||!b||a.id===b.id)return '请选择两只不同的怪物';if(a.gender===b.gender)return '配种需要一公一母；选择一边后，另一边会自动优先匹配异性';if(state.dispatch&&((state.dispatch.monsterIds||[state.dispatch.monsterId]).filter(Boolean)).some(id=>[a.id,b.id].includes(id)))return '亲代正在派遣中';if(state.egg)return '孵化巢正在使用中';if(state.monsters.length>=state.capacity)return '家园满员，请先扩建';if(a.cooldown>now||b.cooldown>now)return '亲代休息中 · '+Math.ceil((Math.max(a.cooldown,b.cooldown)-now)/1000)+' 秒';if(state.energy+1e-8<G.breedCost(state))return '灵能不足，伙伴正在积累';return '';};
function baseMixedStarDistribution(low,high){
  const same=low===high,gap=high-low;
  const d={1:0,2:0,3:0,4:0,5:0};

  if(same){
    if(high===1){d[1]=.80;d[2]=.20;}
    else if(high===2){d[1]=.06;d[2]=.78;d[3]=.16;}
    else if(high===3){d[2]=.12;d[3]=.79;d[4]=.09;}
    else if(high===4){d[3]=.16;d[4]=.82;d[5]=.02;}
    else {d[4]=.50;d[5]=.50;}
    return d;
  }

  if(gap===1){
    if(low===1&&high===2){d[1]=.45;d[2]=.43;d[3]=.12;}
    else if(low===2&&high===3){d[1]=.03;d[2]=.35;d[3]=.54;d[4]=.08;}
    else if(low===3&&high===4){d[2]=.04;d[3]=.36;d[4]=.56;d[5]=.04;}
    else if(low===4&&high===5){d[3]=.06;d[4]=.44;d[5]=.50;}
    return d;
  }

  if(gap===2){
    if(low===1&&high===3){d[1]=.50;d[2]=.28;d[3]=.18;d[4]=.04;}
    else if(low===2&&high===4){d[1]=.10;d[2]=.40;d[3]=.28;d[4]=.20;d[5]=.02;}
    else if(low===3&&high===5){d[1]=.03;d[2]=.12;d[3]=.40;d[4]=.35;d[5]=.10;}
    return d;
  }

  if(gap===3){
    if(low===1&&high===4){d[1]=.58;d[2]=.18;d[3]=.15;d[4]=.08;d[5]=.01;}
    else if(low===2&&high===5){d[1]=.08;d[2]=.36;d[3]=.28;d[4]=.20;d[5]=.08;}
    return d;
  }

  // 1★ + 5★：能被高星带起来，但 5★ 仍很难直接冲出。
  d[1]=.62;d[2]=.15;d[3]=.12;d[4]=.08;d[5]=.03;
  return d;
}
function applyTopStarModifier(probs,high,delta){
  if(high>=5||!delta)return probs;
  const top=Math.min(5,high+1);
  const current=probs[top]||0;

  if(delta>0){
    const add=Math.min(delta,Math.max(0,.95-current));
    if(add<=0)return probs;
    const donors=Object.keys(probs).map(Number).filter(st=>st!==top&&probs[st]>0);
    const total=donors.reduce((sum,st)=>sum+probs[st],0);
    if(total<=0)return probs;
    for(const st of donors)probs[st]=Math.max(0,probs[st]-add*(probs[st]/total));
    probs[top]=current+add;
    return probs;
  }

  // Negative star modifiers (e.g. 晦运) now genuinely reduce the top-star result.
  const take=Math.min(current,-delta);
  probs[top]=Math.max(0,current-take);
  const receivers=Object.keys(probs).map(Number).filter(st=>st!==top);
  const total=receivers.reduce((sum,st)=>sum+(probs[st]||0),0);
  if(total>0){
    for(const st of receivers)probs[st]=(probs[st]||0)+take*((probs[st]||0)/total);
  }else{
    probs[high]=(probs[high]||0)+take;
  }
  return probs;
}
function applyDropStarModifier(probs,low,high,delta){
  if(!delta)return probs;
  // "掉星"严格定义为：掉到较低亲代星级以下（同星时则是掉到共同星级以下）。
  const threshold=low===high?high:low;
  const lower=[1,2,3,4,5].filter(st=>st<threshold);
  const safe=[1,2,3,4,5].filter(st=>st>=threshold);
  const lowerTotal=lower.reduce((sum,st)=>sum+(probs[st]||0),0);

  // v164: 较低亲代已经是 1★ 时不存在“更低星级”。稳血/乱血/5★保底都不应偷偷改动升星分布。
  if(lower.length===0)return probs;

  if(delta>0){
    // 乱血: move probability mass from safe outcomes into the nearest lower-star result.
    const add=Math.min(delta,.45-lowerTotal);
    if(add<=0)return probs;
    const safeTotal=safe.reduce((sum,st)=>sum+(probs[st]||0),0);
    if(safeTotal<=0)return probs;
    for(const st of safe)probs[st]=Math.max(0,(probs[st]||0)-add*((probs[st]||0)/safeTotal));
    const target=Math.max(...lower);
    probs[target]=(probs[target]||0)+add;
    return probs;
  }

  // 稳血: remove low-star probability and move it primarily to the threshold result.
  const remove=Math.min(lowerTotal,-delta);
  if(remove<=0)return probs;
  for(const st of lower){
    if(lowerTotal>0)probs[st]=Math.max(0,(probs[st]||0)-remove*((probs[st]||0)/lowerTotal));
  }
  probs[threshold]=(probs[threshold]||0)+remove;
  return probs;
}
G.odds=function(a,b){
  if(!a||!b||a.id===b.id)return null;
  const low=Math.min(a.star,b.star),high=Math.max(a.star,b.star),gap=high-low,
    fortune=[a,b].filter(m=>G.SPECIES[m.species].passive==='fortune').reduce((sum,m)=>sum+skillNum(m)*.003,0),
    potion=(a.starBoost||0)+(b.starBoost||0),
    mods=breedMods(a,b);
  // 闪光血统保证孵化成功：概率面板与实际孵化都直接使用 0% 失败率。
  let fail=(a.shiny||b.shiny)?0:Math.max(0,Math.min(.12,mods.fail));
  let probs=baseMixedStarDistribution(low,high);

  const starDelta=high<5?(fortune+potion+mods.star):0;
  probs=applyTopStarModifier(probs,high,starDelta);

  const positiveStarSkill=Math.max(0,fortune+mods.star);
  const starFallback=high>=5?positiveStarSkill*.5:0;
  const effectiveDropDelta=mods.down-starFallback;
  probs=applyDropStarModifier(probs,low,high,effectiveDropDelta);

  // v164: 返祖必须直接计入最终星级分布，保证 UI 概率与实际抽取完全一致。
  const atavism=atavismChance(a,b);
  if(atavism>0){
    for(const st of [1,2,3,4,5])probs[st]=(probs[st]||0)*(1-atavism);
    probs[low]=(probs[low]||0)+atavism;
  }

  const total=Object.values(probs).reduce((x,y)=>x+y,0)||1;
  for(const st of [1,2,3,4,5])probs[st]=(probs[st]||0)/total;

  const top=Math.min(5,high+1);
  return {
    base:high,up:top,chance:probs[top]||0,down:0,lower:Math.max(1,low-1),stay:probs[high]||0,
    low,high,gap,starProbs:probs,fortune,potion,starDelta,starFallback,
    effectiveDropDelta,dropDelta:mods.down,atavism,fail,
    inherit:mods.inherit,mutate:.10,thirdChance:.35,incubateMult:mods.incubateMult,
    deathMult:mods.deathMult,cooldownMult:mods.cooldownMult,parentLifeReduce:mods.parentLifeReduce,
    parentLifeBonus:mods.parentLifeBonus
  };
};
function rollBreedSpecies(a,b,rng=Math.random){
  const aEx=isMissionExclusiveSpecies(a.species),bEx=isMissionExclusiveSpecies(b.species),r=rng();
  if(aEx&&bEx){
    if(a.species===b.species)return r<.70?a.species:Math.floor(rng()*BASE_SPECIES_COUNT);
    if(r<.30)return a.species;
    if(r<.60)return b.species;
    return Math.floor(rng()*BASE_SPECIES_COUNT);
  }
  if(aEx||bEx){
    const ex=aEx?a:b,normal=aEx?b:a;
    if(r<.35)return ex.species;
    if(!isMissionExclusiveSpecies(normal.species)&&r<.90)return normal.species;
    return Math.floor(rng()*BASE_SPECIES_COUNT);
  }
  if(r<.45)return a.species;
  if(r<.90)return b.species;
  const pool=Array.from({length:BASE_SPECIES_COUNT},(_,i)=>i).filter(i=>i!==a.species&&i!==b.species);
  return pool[Math.min(pool.length-1,Math.floor(rng()*pool.length))];
}

function parentSpeciesPassiveLevel(a,b,passive){
  return [a,b].filter(m=>m&&G.SPECIES[m.species]?.passive===passive).reduce((sum,m)=>sum+skillNum(m),0);
}
function twinHatchChance(a,b){return Math.min(.05,parentSpeciesPassiveLevel(a,b,'twin_hatch')*.001);}
function offspringHpSpeciesBonus(a,b){
  return [a,b].filter(m=>m&&G.SPECIES[m.species]?.passive==='offspring_hp').reduce((sum,m)=>sum+Math.floor(skillNum(m)/2),0);
}
function colorMutationSpeciesBonus(a,b){return Math.min(.15,parentSpeciesPassiveLevel(a,b,'color_mutation')*.005);}
function buffInheritanceSpeciesBonus(a,b){return Math.min(.15,parentSpeciesPassiveLevel(a,b,'buff_inherit')*.005);}
function buffPreserveSpeciesChance(a,b){return Math.min(.15,parentSpeciesPassiveLevel(a,b,'buff_preserve')*.005);}
function skillRefineSpeciesChance(a,b){return Math.min(.15,parentSpeciesPassiveLevel(a,b,'skill_refine')*.005);}

function parentBuffPool(a,b){
  const out=[];
  for(const id of inheritedAbilityPool(a,b)){
    const sk=extraSkill(id);
    if(sk?.tone==='buff')out.push(id);
  }
  return out;
}
function preserveParentBuff(child,a,b,rng=Math.random){
  const chance=buffPreserveSpeciesChance(a,b);
  if(!chance||rng()>=chance)return null;
  const pool=parentBuffPool(a,b);
  if(!pool.length)return null;

  // If a parental Buff already survived, the preserve roll is not consumed.
  const existing=[child.extraSkills?.[0],child.extraSkills?.[1],child.shiny?child.extraSkills?.[3]:null].filter(Boolean);
  if(existing.some(id=>pool.includes(id)))return null;

  const id=pool[Math.min(pool.length-1,Math.floor(rng()*pool.length))];
  const lv=rollInheritedAbilityLevel(id,a,b,rng);
  let idx=[0,1].find(i=>!child.extraSkills[i]);
  if(idx===undefined)idx=[0,1].find(i=>extraSkill(child.extraSkills[i])?.tone==='debuff');
  if(idx===undefined)return null;

  child.extraSkills[idx]=id;
  child.extraSkillLv[idx]=lv;
  return {id,name:extraSkill(id)?.name||id,from:0,to:lv,note:'Buff保留'};
}
function applySpeciesRefine(child,a,b,rng=Math.random){
  const chance=skillRefineSpeciesChance(a,b);
  if(!chance||rng()>=chance)return null;

  const logs=[];
  const slv=skillNum(child);
  if(slv<10){
    child.skillLv=slv+1;
    logs.push({id:'species:'+child.species,name:G.SPECIES[child.species].skill,from:slv,to:slv+1});
    return logs;
  }

  // v188: family skill may only advance through same-level family-skill parents.
  // Species refinement therefore skips skill4 entirely.
  const slots=[0,1].concat(child.shiny?[3]:[])
    .filter(i=>child.extraSkills?.[i]&&extraLv(child,i)<10)
    .sort((x,y)=>extraLv(child,y)-extraLv(child,x));
  if(slots.length){
    const idx=slots[0],from=extraLv(child,idx);
    child.extraSkillLv[idx]=from+1;
    logs.push({id:child.extraSkills[idx],name:extraSkill(child.extraSkills[idx])?.name||child.extraSkills[idx],from,to:from+1});
  }
  return logs;
}
function makeTwinChild(child,state,a,b,shinyChance,rng=Math.random){
  const twin=JSON.parse(JSON.stringify(child));
  twin.id=state.nextId++;
  twin.gender=rng()<.5?'公':'母';
  twin.createdAt=child.createdAt;
  twin.genes=child.genes.map(v=>Math.max(.65,Math.min(1.5,v*(.96+rng()*.08))));
  twin.shiny=!!shinyChance&&rng()<shinyChance;
  twin.locked=!!twin.shiny;
  twin.shinyAutoLockDone=!!twin.shiny;
  // v188: 双蛋同样按亲代闪光血统决定生命公式。
  twin.baseLife=rollNaturalLife(a,b,rng,shinyLineageCount([a,b])>0);
  twin.life=twin.baseLife;
  twin.maxLife=twin.baseLife;

  // Twin gets an independent ordinary color roll.
  const mutation=Math.min(.25,.05+colorMutationSpeciesBonus(a,b));
  const parentShare=(1-mutation)/2;
  const r=rng();
  twin.tint=r<parentShare?a.tint:r<parentShare*2?b.tint:(()=>{
    const pool=[0,1,2,3,4,5].filter(c=>c!==a.tint&&c!==b.tint);
    return pool[Math.min(pool.length-1,Math.floor(rng()*pool.length))];
  })();
  twin.specialColor=null;
  return twin;
}
G.startBreed=function(state,now,rng=Math.random){
  const issue=G.blocked(state,now);if(issue)return false;
  const [a,b]=G.pair(state),o=G.odds(a,b);

  const starRoll=rng();let star=1,acc=0;
  for(const st of [1,2,3,4,5]){
    acc+=o.starProbs?.[st]||0;
    if(starRoll<=acc){star=st;break;}
  }
  // 返祖已包含在 G.odds().starProbs 中，不再进行第二次隐藏判定。

  const type=rollBreedSpecies(a,b,rng);
  const genes=a.genes.map((v,i)=>Math.max(.65,Math.min(1.5,(v+b.genes[i])/2*(.9+rng()*.2))));
  const embryoChance=perfectEmbryoChance(a,b);
  if(embryoChance>0&&rng()<embryoChance){
    let lowIdx=0;
    for(let i=1;i<genes.length;i++)if(genes[i]<genes[lowIdx])lowIdx=i;
    const parentHigh=Math.max(a.genes[lowIdx]||genes[lowIdx],b.genes[lowIdx]||genes[lowIdx]);
    genes[lowIdx]=Math.min(1.5,(genes[lowIdx]+parentHigh)/2);
  }
  const incubateLv=[a,b].filter(m=>G.SPECIES[m.species].passive==='incubate').reduce((sum,m)=>sum+skillNum(m),0);
  const baseIncubateSeconds=star===1?15:(22+star*12);
  const duration=Math.round(baseIncubateSeconds*(1-incubateLv*.025)*o.incubateMult*Math.max(.50,1-(state.buildings?.hatch||0)*.05)*1000);

  state.energy=Math.max(0,state.energy-G.breedCost(state));

  const child=G.createMonster(state.nextId++,type,star,genes,[a.id,b.id]);
  ensureMonsterSystemsMonster(child,now);
  child.gender=rng()<.5?'公':'母';
  child.createdAt=now;
  child.specialColor=null;
  child.heritageLifeBonus=0;
  child.lifePotionUsed=false;
  child.lifeSkillApplied=0;
  child.generation=Math.max(a.generation||1,b.generation||1)+1;
  assignFamilyName(child,a,b,rng);
  child.trait=rng()<.70?(rng()<.5?a.trait:b.trait):TRAITS[Math.floor(rng()*TRAITS.length)].id;

  const mutationChance=Math.min(.25,.05+colorMutationSpeciesBonus(a,b));
  const parentShare=(1-mutationChance)/2;
  const colorRoll=rng();
  const colorMutated=colorRoll>=parentShare*2;
  child.tint=colorRoll<parentShare?a.tint:colorRoll<parentShare*2?b.tint:(()=>{
    const pool=[0,1,2,3,4,5].filter(c=>c!==a.tint&&c!==b.tint);
    return pool[Math.min(pool.length-1,Math.floor(rng()*pool.length))];
  })();
  if(colorMutated&&chromaResonanceChance(a,b)>0&&rng()<chromaResonanceChance(a,b)){
    child.specialColor=Math.floor(rng()*SPECIAL_COLORS.length);
  }

  const shinyBonus=shinyBreedBonus(a,b),lineageBonus=shinyLineageBreedBonus(a,b),potionShiny=shinyPotionBreedBonus(a,b);
  const shinyChance=Math.min(.25,shinyBaseChanceByStar(star)+shinyBonus+shinyBuildingBonus(state)+lineageBonus+potionShiny);
  if(shinyChance&&rng()<shinyChance)child.shiny=true;
  // v188: 只要双亲至少一位为闪光，本胎属于闪光血统并使用 10 起步生命公式；后代外观是否闪光不影响该血统生命公式。
  const hasShinyLineage=shinyLineageCount([a,b])>0;
  child.baseLife=rollNaturalLife(a,b,rng,hasShinyLineage);
  child.life=child.baseLife;
  child.maxLife=child.baseLife;

  const buffBonus=buffInheritanceSpeciesBonus(a,b);
  const inherited2=rollInheritedAbility(a,b,rng,[]);
  const chance2=.70+(inherited2&&extraSkill(inherited2.id)?.tone==='buff'?buffBonus:0);
  const normal2=inherited2&&rng()<chance2?inherited2:null;

  const inherited3=rollInheritedAbility(a,b,rng,normal2?[normal2.id]:[]);
  const chance3=o.thirdChance+(inherited3&&extraSkill(inherited3.id)?.tone==='buff'?buffBonus:0);
  const normal3=inherited3&&rng()<chance3?inherited3:null;

  child.extraSkills=[
    normal2?.id||null,
    normal3?.id||null,
    null,
    child.shiny?uniqueSkillRoll(rng,[normal2?.id,normal3?.id].filter(Boolean)):null
  ];
  child.extraSkillLv=[
    normal2?.lv||1,
    normal3?.lv||1,
    1,
    newbornSkillLevel(child.extraSkills[3],rng,true)
  ];
  const disorderChance=skillDisorderChance(a,b);
  if(disorderChance>0){
    for(const idx of [0,1].concat(child.shiny?[3]:[])){
      const id=child.extraSkills[idx];
      if(id&&extraSkill(id)?.tone==='buff'&&rng()<disorderChance){
        let next=randomExtraSkillId(rng),guard=0;
        while(next===id&&guard++<8)next=randomExtraSkillId(rng);
        child.extraSkills[idx]=next;
        child.extraSkillLv[idx]=newbornSkillLevel(next,rng,idx===3);
      }
    }
  }

  const preserved=preserveParentBuff(child,a,b,rng);
  child.familySkill=rollFamilySkill(a,b,child,rng);
  child.skillLayoutV80=true;

  const refineLogs=applySpeciesRefine(child,a,b,rng)||[];
  const sameChance=sameSpeciesResonanceChance(a,b);
  if(sameChance>0&&child.skillLv<10&&rng()<sameChance){
    const from=skillNum(child);
    child.skillLv=Math.min(10,from+1);
    refineLogs.push({id:'species:'+child.species,name:G.SPECIES[child.species].skill,from,to:child.skillLv,note:'同族共鸣'});
  }
  child.birthBonusGrowth=[];
  if(preserved)child.birthBonusGrowth.push(preserved);
  if(refineLogs.length)child.birthBonusGrowth.push(...refineLogs);
  if(child._familySkillUpgrade&&!child._familySkillUpgrade.failed&&child._familySkillUpgrade.to>child._familySkillUpgrade.from){
    child.birthBonusGrowth.push({id:'family:'+child._familySkillUpgrade.id,name:'家族·'+child._familySkillUpgrade.name,from:child._familySkillUpgrade.from,to:child._familySkillUpgrade.to,note:'同级血统突破'});
  }
  delete child._familySkillUpgrade;

  refreshLifeCapacity(child,true);

  const twinChance=twinHatchChance(a,b);
  const twinChild=twinChance&&rng()<twinChance?makeTwinChild(child,state,a,b,shinyChance,rng):null;
  if(twinChild){
    // Twin inherits the same family/history framework but gets its own stable record.
    ensureMonsterSystemsMonster(twinChild,now);
    archiveMonster(twinChild,state);
  }

  state.egg={
    child,
    twinChild,
    twinChance,
    twinStage:twinChild?1:0,
    shinyLineage:shinyLineageCount([a,b])>0,
    shinyLineageCount:shinyLineageCount([a,b]),
    start:now,ready:now+duration,base:o.base,chance:o.chance,fail:o.fail,inherit:o.inherit
  };
  if(twinChild&&typeof recordActivity==='function'){
    recordActivity('twin',{
      key:'twin-'+child.id+'-'+twinChild.id,
      time:now,
      parents:[a.id,b.id],
      parentNames:[name(a),name(b)],
      chance:twinChance,
      firstId:child.id,
      secondId:twinChild.id,
      skill:'双潮卵息'
    },state);
  }

  archiveMonster(a,state);archiveMonster(b,state);archiveMonster(child,state);
  // v164: 升星药水只在较高亲代未达 5★、确实参与升星计算时才消耗。5★封顶配种会保留药水。
  if(o.high<5){a.starBoost=0;b.starBoost=0;}
  // v188: 闪光药水是怪物身上的长期培育效果。使用后该怪物存活期间每次作为亲代都 +3pp；配种后不清除。
  const parentLoss=breedingParentLifeLoss(a,b);
  for(const m of [a,b]){
    m.cooldown=now+Math.round(30000*o.cooldownMult*breedRestBuildingMult(state));
    const loss=m.shiny?1:parentLoss;
    loseLife(state,m,loss,'繁育后生命耗尽',now);
  }
  state.revision++;
  return true;
};
G.hatch=function(state,now){
  if(!state.egg||state.egg.ready>now||state.monsters.length>=state.capacity)return null;
  // v164: preserve a genuine 0% failure rate. `0 || .01` previously reintroduced a hidden 1% failure.
  const rawFail=Number(state.egg.fail);
  const failChance=state.tutorialActive?0:(state.egg.shinyLineage?0:Math.max(0,Math.min(.12,Number.isFinite(rawFail)?rawFail:.01)));
  if(Math.random()<failChance){state.egg=null;state.revision++;return false;}

  const egg=state.egg;
  const child=egg.child;
  const rolledBirthLife=Number(child.baseLife);
  if(rolledBirthLife===0){
    child.createdAt=now;
    child.life=0;child.maxLife=0;
    archiveMonster(child,state);
    state.memorial.unshift({...child,diedAt:now,deathReason:'出生时天生生命为 0'});
    state.memorial=state.memorial.slice(0,200);
    state.deaths++;
    if(typeof recordActivity==='function')recordActivity('death',{
      key:'death-'+child.id+'-'+now,time:now,
      monster:{id:child.id,species:child.species,star:child.star,shiny:!!child.shiny,nickname:child.nickname||'',life:0,tint:child.tint,specialColor:child.specialColor??null},
      reason:'出生时天生生命为 0'
    },state);
    state.egg=null;state.hatched++;state.revision++;
    return false;
  }
  ensureMonsterSystemsMonster(child,now);
  child.createdAt=now;
  state.monsters.push(child);
  state.flags=state.flags||{};
  if((child.star||0)>=5)state.flags.shinyBuildingUnlocked=true;

  // If 双潮卵息 triggered, the second egg becomes immediately ready.
  if(egg.twinChild){
    state.egg={
      child:egg.twinChild,
      twinChild:null,
      twinChance:0,
      shinyLineage:!!egg.shinyLineage,
      shinyLineageCount:Number(egg.shinyLineageCount)||0,
      twinStage:2,
      start:now,
      ready:now,
      base:egg.base,
      chance:egg.chance,
      fail:0,
      inherit:egg.inherit
    };
    if(typeof recordActivity==='function')recordActivity('twin_stage',{
      key:'twin-stage-'+egg.twinChild.id,
      time:now,
      monster:{id:egg.twinChild.id,species:egg.twinChild.species,star:egg.twinChild.star,shiny:!!egg.twinChild.shiny,nickname:egg.twinChild.nickname||''}
    },state);
  }else{
    state.egg=null;
  }

  state.hatched++;
  state.revision++;
  return child;
};
G.advance=function(state,now,rng=Math.random){ensureMonsterSystemsState(state);const end=Math.max(state.last,now),start=Math.max(state.last,end-G.MAX_OFFLINE);let t=start,births=[],guard=0;while(t<=end&&guard++<1000){if(state.egg&&state.egg.ready<=t&&state.autoHatch){const child=G.hatch(state,t);if(child)births.push(child);}if(t>=end)break;let next=end;if(state.egg&&state.autoHatch&&state.egg.ready>t)next=Math.min(next,state.egg.ready);if(next<=t)next=t+1000;const seconds=(next-t)/1000;if(seconds>0)state.energy+=G.income(state)*seconds;t=next;}state.last=end;return births;};


// ===== v144 sequential egg queue: 1 incubating + 10 waiting =====
const __v144StartBreed=G.startBreed;
const __v144Hatch=G.hatch;
function eggEntryDuration(egg){
  const d=Number(egg?.incubationDuration);
  if(Number.isFinite(d)&&d>0)return d;
  const raw=Number(egg?.ready)-Number(egg?.start);
  return Number.isFinite(raw)&&raw>0?raw:Math.max(1000,hatchSeconds(egg?.child||{star:1})*1000);
}
function removeOverflowTwinLog(state,twin){
  if(!twin||!Array.isArray(state.activityLog))return;
  state.activityLog=state.activityLog.filter(e=>!(e&&e.type==='twin'&&(e.secondId===twin.id||e.monster?.id===twin.id)));
}
function normalizeEggEntryForQueue(egg,now){
  if(!egg)return egg;
  egg.incubationDuration=eggEntryDuration(egg);
  egg.queuedAt=now;
  egg.start=null;egg.ready=null;
  return egg;
}
function promoteNextEgg(state,now,slot=1){
  const key=slot===2?'egg2':'egg';
  if(state[key]||(state.eggQueue||[]).length===0)return false;
  if(slot===2&&hatchSlotCount(state)<2)return false;
  const next=state.eggQueue.shift();
  const duration=eggEntryDuration(next);
  next.start=now;next.ready=now+duration;next.incubationDuration=duration;next.queuedAt=null;
  state[key]=next;state.revision++;
  return true;
}
function fillOpenHatchSlots(state,now){
  let changed=false;
  if(!state.egg)changed=promoteNextEgg(state,now,1)||changed;
  if(hatchSlotCount(state)>=2&&!state.egg2)changed=promoteNextEgg(state,now,2)||changed;
  return changed;
}
G.blocked=function(state,now){
  ensureMonsterSystemsState(state);
  const [a,b]=G.pair(state);
  if(!a||!b||a.id===b.id)return '请选择两只不同的怪物';
  if(a.gender===b.gender)return '配种需要一公一母；选择一边后，另一边会自动优先匹配异性';
  if(state.dispatch&&((state.dispatch.monsterIds||[state.dispatch.monsterId]).filter(Boolean)).some(id=>[a.id,b.id].includes(id)))return '亲代正在派遣中';
  if(totalQueuedEggs(state)>=eggTotalMax(state))return '孵蛋队列已满（'+eggTotalMax(state)+' / '+eggTotalMax(state)+'）';
  if(state.monsters.length>=state.capacity)return '家园满员，请先扩建';
  if(a.cooldown>now||b.cooldown>now)return '亲代休息中 · '+Math.ceil((Math.max(a.cooldown,b.cooldown)-now)/1000)+' 秒';
  if(state.energy+1e-8<G.breedCost(state))return '灵能不足，伙伴正在积累';
  return '';
};
G.startBreed=function(state,now,rng=Math.random){
  ensureMonsterSystemsState(state);
  if(G.blocked(state,now))return false;
  const active1=state.egg,active2=state.egg2;
  const beforeTotal=totalQueuedEggs(state);
  // Temporarily free slot 1 so the legacy generator can build exactly one new egg.
  state.egg=null;
  let ok=false,created=null;
  try{
    ok=__v144StartBreed(state,now,rng);
    created=state.egg;
  }finally{
    // Never let the legacy generator decide the final queue placement.
    state.egg=active1||null;
  }
  if(!ok||!created||!created.child)return false;
  created.incubationDuration=Math.max(1000,eggEntryDuration(created));
  const slotsLeft=eggTotalMax(state)-beforeTotal;
  if(created.twinChild&&slotsLeft<2){
    removeOverflowTwinLog(state,created.twinChild);
    created.twinChild=null;created.twinChance=0;created.twinStage=0;
  }

  // Explicit transactional placement: slot 1 -> slot 2 -> waiting queue.
  if(!active1){
    created.start=now;created.ready=now+created.incubationDuration;created.queuedAt=null;
    state.egg=created;
  }else if(hatchSlotCount(state)>=2&&!active2){
    created.start=now;created.ready=now+created.incubationDuration;created.queuedAt=null;
    state.egg2=created;
  }else{
    normalizeEggEntryForQueue(created,now);
    state.eggQueue.push(created);
  }
  while(totalQueuedEggs(state)>eggTotalMax(state)&&state.eggQueue.length)state.eggQueue.pop();
  const afterTotal=totalQueuedEggs(state);
  if(afterTotal<=beforeTotal){
    console.error('Egg commit failed',{beforeTotal,afterTotal,active1:!!active1,active2:!!active2,createdId:created.child?.id});
    return false;
  }
  state.revision++;
  return true;
};
function hatchFromSlot(state,now,slot=1){
  ensureMonsterSystemsState(state);
  const key=slot===2?'egg2':'egg';
  if(slot===2&&hatchSlotCount(state)<2)return null;
  if(!state[key])return null;
  if(slot===1){
    const had=!!state.egg;
    const result=__v144Hatch(state,now);
    if(had&&!state.egg)promoteNextEgg(state,now,1);
    return result;
  }
  const primary=state.egg;
  state.egg=state.egg2;state.egg2=null;
  const had=!!state.egg;
  const result=__v144Hatch(state,now);
  const after=state.egg;
  state.egg=primary;state.egg2=after;
  if(had&&!state.egg2)promoteNextEgg(state,now,2);
  return result;
}
G.hatch=function(state,now){return hatchFromSlot(state,now,1);};
G.hatchSecondary=function(state,now){return hatchFromSlot(state,now,2);};
G.advance=function(state,now,rng=Math.random){
  ensureMonsterSystemsState(state);
  const end=Math.max(state.last,now),start=Math.max(state.last,end-G.MAX_OFFLINE);
  let t=start,births=[],guard=0;
  fillOpenHatchSlots(state,t);
  while(t<=end&&guard++<4000){
    if(state.autoHatch){
      let progressed=true,inner=0;
      while(progressed&&inner++<8){
        progressed=false;
        if(state.egg&&Number(state.egg.ready)<=t){const child=G.hatch(state,t);if(child)births.push(child);progressed=true;}
        if(hatchSlotCount(state)>=2&&state.egg2&&Number(state.egg2.ready)<=t){const child=G.hatchSecondary(state,t);if(child)births.push(child);progressed=true;}
      }
    }
    if(t>=end)break;
    let next=end;
    if(state.autoHatch){
      if(state.egg&&Number(state.egg.ready)>t)next=Math.min(next,state.egg.ready);
      if(hatchSlotCount(state)>=2&&state.egg2&&Number(state.egg2.ready)>t)next=Math.min(next,state.egg2.ready);
    }
    if(next<=t)next=Math.min(end,t+1000);
    const seconds=(next-t)/1000;
    if(seconds>0)state.energy+=G.income(state)*seconds;
    t=next;
  }
  state.last=end;
  return births;
};

function missionName(id){const m=typeof DISPATCH_MISSIONS!=='undefined'?DISPATCH_MISSIONS.find(x=>x.id===id):null;return m?.name||id||'任务';}

function exclusiveSecondaryMods(sp,lv){
  const r=Math.max(1,Math.min(10,lv))/10;
  const o={success:0,item:0,reward:1,lifeReduce:0,hunt:0,skillFind:1,duration:0,shiny:0};
  if(!sp?.exclusiveMission)return o;
  const mission=sp.exclusiveMission,p=sp.passive;

  if(mission==='forage'){
    if(p==='mission_success')o.duration=.05*r;
    else if(p==='mission_item')o.reward*=1+.05*r;
    else if(p==='mission_guard')o.success=.01*r;
    else if(p==='mission_reward')o.item=.01*r;
    else if(p==='mission_hunt')o.duration=.05*r;
  }else if(mission==='river'){
    if(p==='mission_success')o.item=.01*r;
    else if(p==='mission_item')o.success=.01*r;
    else if(p==='mission_guard')o.duration=.05*r;
    else if(p==='mission_reward')o.hunt=.005*r;
    else if(p==='mission_hunt')o.shiny=.001*r;
  }else if(mission==='ruins'){
    if(p==='mission_success')o.reward*=1+.05*r;
    else if(p==='mission_item')o.skillFind*=1+.15*r;
    else if(p==='mission_guard')o.item=.01*r;
    else if(p==='mission_reward')o.success=.01*r;
    else if(p==='mission_hunt')o.duration=.05*r;
  }else if(mission==='cavern'){
    if(p==='mission_success')o.hunt=.005*r;
    else if(p==='mission_item')o.duration=.05*r;
    else if(p==='mission_guard')o.reward*=1+.05*r;
    else if(p==='mission_reward')o.item=.01*r;
    else if(p==='mission_hunt'&&lv>=10)o.lifeReduce=1;
  }else if(mission==='astral'){
    if(p==='mission_success')o.shiny=.001*r;
    else if(p==='mission_item')o.hunt=.005*r;
    else if(p==='mission_guard')o.skillFind*=1+.15*r;
    else if(p==='mission_reward')o.duration=.05*r;
    else if(p==='mission_hunt')o.success=.01*r;
  }else if(mission==='summit'){
    if(p==='mission_success'&&lv>=10)o.lifeReduce=1;
    else if(p==='mission_item')o.reward*=1+.05*r;
    else if(p==='mission_guard')o.hunt=.005*r;
    else if(p==='mission_reward')o.skillFind*=1+.15*r;
    else if(p==='mission_hunt')o.item=.01*r;
  }else if(mission==='rift'){
    if(p==='mission_success')o.duration=.07*r;
    else if(p==='mission_item')o.shiny=.0015*r;
    else if(p==='mission_guard')o.success=.015*r;
    else if(p==='mission_reward')o.hunt=.0075*r;
    else if(p==='mission_hunt')o.reward*=1+.075*r;
  }
  return o;
}
function exclusiveSecondaryText(sp,lv){
  const r=Math.max(1,Math.min(10,lv))/10,p=sp?.passive,m=sp?.exclusiveMission;
  if(!m||m==='meadow')return '';
  const pct=n=>(n*100).toFixed(n*100<1?2:1)+'%';

  if(m==='forage'){
    if(p==='mission_success'||p==='mission_hunt')return '；额外缩短任务时间 '+pct(.05*r);
    if(p==='mission_item')return '；额外提高灵能报酬 '+pct(.05*r);
    if(p==='mission_guard')return '；额外提高成功率 '+pct(.01*r);
    if(p==='mission_reward')return '；额外提高道具发现率 '+pct(.01*r);
  }else if(m==='river'){
    if(p==='mission_success')return '；额外提高道具发现率 '+pct(.01*r);
    if(p==='mission_item')return '；额外提高成功率 '+pct(.01*r);
    if(p==='mission_guard')return '；额外缩短任务时间 '+pct(.05*r);
    if(p==='mission_reward')return '；额外提高限定怪遭遇率 '+pct(.005*r);
    if(p==='mission_hunt')return '；额外提高闪光探索率 '+pct(.001*r);
  }else if(m==='ruins'){
    if(p==='mission_success')return '；额外提高灵能报酬 '+pct(.05*r);
    if(p==='mission_item')return '；额外提高稀有技能发现倍率 '+pct(.15*r);
    if(p==='mission_guard')return '；额外提高道具发现率 '+pct(.01*r);
    if(p==='mission_reward')return '；额外提高成功率 '+pct(.01*r);
    if(p==='mission_hunt')return '；额外缩短任务时间 '+pct(.05*r);
  }else if(m==='cavern'){
    if(p==='mission_success')return '；额外提高限定怪遭遇率 '+pct(.005*r);
    if(p==='mission_item')return '；额外缩短任务时间 '+pct(.05*r);
    if(p==='mission_guard')return '；额外提高灵能报酬 '+pct(.05*r);
    if(p==='mission_reward')return '；额外提高道具发现率 '+pct(.01*r);
    if(p==='mission_hunt')return lv>=10?'；Lv10 额外减少 1 点任务生命损耗':'；Lv10 解锁额外任务护体';
  }else if(m==='astral'){
    if(p==='mission_success')return '；额外提高闪光探索率 '+pct(.001*r);
    if(p==='mission_item')return '；额外提高限定怪遭遇率 '+pct(.005*r);
    if(p==='mission_guard')return '；额外提高稀有技能发现倍率 '+pct(.15*r);
    if(p==='mission_reward')return '；额外缩短任务时间 '+pct(.05*r);
    if(p==='mission_hunt')return '；额外提高成功率 '+pct(.01*r);
  }else if(m==='summit'){
    if(p==='mission_success')return lv>=10?'；Lv10 额外减少 1 点任务生命损耗':'；Lv10 解锁额外护返';
    if(p==='mission_item')return '；额外提高灵能报酬 '+pct(.05*r);
    if(p==='mission_guard')return '；额外提高限定怪遭遇率 '+pct(.005*r);
    if(p==='mission_reward')return '；额外提高稀有技能发现倍率 '+pct(.15*r);
    if(p==='mission_hunt')return '；额外提高道具发现率 '+pct(.01*r);
  }else if(m==='rift'){
    if(p==='mission_success')return '；额外缩短任务时间 '+pct(.07*r);
    if(p==='mission_item')return '；额外提高闪光探索率 '+pct(.0015*r);
    if(p==='mission_guard')return '；额外提高成功率 '+pct(.015*r);
    if(p==='mission_reward')return '；额外提高限定怪遭遇率 '+pct(.0075*r);
    if(p==='mission_hunt')return '；额外提高灵能报酬 '+pct(.075*r);
  }
  return '';
}
function exclusiveSpeciesSkillEffect(m){
  const sp=G.SPECIES[m.species],lv=skillNum(m);
  if(!sp?.exclusiveMission)return sp?.effect||'';
  let main='';
  if(sp.passive==='mission_success')main='在「'+missionName(sp.exclusiveMission)+'」中成功率 +'+(lv*.25).toFixed(2)+'pp';
  else if(sp.passive==='mission_item')main='在「'+missionName(sp.exclusiveMission)+'」中道具发现率 +'+(lv*.25).toFixed(2)+'pp';
  else if(sp.passive==='mission_reward')main='在「'+missionName(sp.exclusiveMission)+'」中灵能报酬 +'+(lv*1.5).toFixed(1)+'%';
  else if(sp.passive==='mission_guard')main='在「'+missionName(sp.exclusiveMission)+'」中'+(lv>=10?'任务生命损耗 -1（最低仍扣 1）':'Lv10 时任务生命损耗 -1');
  else if(sp.passive==='mission_hunt')main='在「'+missionName(sp.exclusiveMission)+'」中限定怪率 +'+(lv*.15).toFixed(2)+'pp，并提高稀有技能发现率';
  return main+exclusiveSecondaryText(sp,lv)+'。';
}
function speciesMissionMods(m,mission){
  const sp=G.SPECIES[m?.species],lv=m?skillNum(m):1,
    o={success:0,item:0,reward:1,lifeReduce:0,hunt:0,skillFind:1,duration:0,shiny:0};
  if(!sp?.exclusiveMission||sp.exclusiveMission!==mission?.id)return o;

  if(sp.passive==='mission_success')o.success+=.0025*lv;
  else if(sp.passive==='mission_item')o.item+=.0025*lv;
  else if(sp.passive==='mission_reward')o.reward*=1+.015*lv;
  else if(sp.passive==='mission_guard'&&lv>=10)o.lifeReduce=1;
  else if(sp.passive==='mission_hunt'){o.hunt+=.0015*lv;o.skillFind*=1+.04*lv;}

  const x=exclusiveSecondaryMods(sp,lv);
  o.success+=x.success;o.item+=x.item;o.reward*=x.reward;
  o.lifeReduce+=x.lifeReduce;o.hunt+=x.hunt;o.skillFind*=x.skillFind;
  o.duration+=x.duration;o.shiny+=x.shiny;
  return o;
}
function missionExclusiveBaseChance(m){
  const lv=Math.max(1,Math.min(8,Number(m?.taskLevel)||1));
  const table=[0,.15,.18,.21,.25,.29,.33,.37,.42];
  return table[lv];
}
function missionExclusiveChance(m,team=[]){
  const bonus=team.reduce((a,x)=>a+speciesMissionMods(x,m).hunt,0);
  return Math.min(.50,missionExclusiveBaseChance(m)+bonus);
}
function missionExclusivePreviewHTML(m){
  const ids=MISSION_EXCLUSIVE_SPECIES[m.id]||[];
  const lv=m.taskLevel||1;
  const starNote=lv===1?'；本任务带回的怪物固定为 1★':'；任务越高级，带回高星怪物的概率也越高';
  return '<div class="mission-exclusive"><b>任务可能带回怪物</b><small>限定怪基础概率约 '+(missionExclusiveBaseChance(m)*100).toFixed(0)+'%；若本次没有遇到限定怪，还会有约 '+(missionOrdinaryBaseChance(m)*100).toFixed(0)+'% 概率带回普通怪'+starNote+'。首次遇到限定怪后才解锁对应图鉴。</small><div class="mission-exclusive-grid">'+ids.map(id=>{const seen=!!s.dex?.species?.[id],sp=G.SPECIES[id];return '<span class="'+(seen?'seen':'locked')+'">'+(seen?sprite(id,0,false,null):'<i>?</i>')+'<em>'+(seen?sp.name:'？？？')+'</em></span>';}).join('')+'</div></div>';
}

function missionOrdinaryBaseChance(m){
  const lv=Math.max(1,Math.min(8,Number(m?.taskLevel)||1));
  const table=[0,.15,.17,.19,.21,.23,.25,.27,.30];
  return table[lv];
}
function rollMissionOrdinarySpecies(m,team,rng=Math.random){
  // Ordinary encounter is rolled only if no exclusive monster was found.
  if(rng()>=missionOrdinaryBaseChance(m))return null;
  return Math.floor(rng()*BASE_SPECIES_COUNT);
}
function rollMissionReturnStar(mission,rng=Math.random){
  const lv=Math.max(1,Math.min(8,Number(mission?.taskLevel)||1));
  if(lv===1)return 1;
  const base=Math.max(1,Math.min(5,Number(mission?.minStar)||1));
  if(base>=5)return 5;
  const upChance={2:.25,3:.32,4:.40,5:.48,6:.60,7:.70,8:.80}[lv]||.25;
  return Math.min(5,base+(rng()<upChance?1:0));
}
function rollMissionExclusiveSpecies(m,team,rng=Math.random){const pool=MISSION_EXCLUSIVE_SPECIES[m.id]||[];if(!pool.length||rng()>=missionExclusiveChance(m,team))return null;return pool[Math.floor(rng()*pool.length)];}
const DISPATCH_MISSIONS=[
{id:'meadow',name:'牧场巡查',taskLevel:1,minStar:1,minTeam:2,minLevel:1,duration:120,base:70,starMul:22,skillMul:8,shinyBonus:80,fail:.12,death:.08,desc:'1★ 就能参加的入门任务，偏重速度与幸运。'},
{id:'forage',name:'林地采集',taskLevel:2,minStar:2,minTeam:2,minLevel:1,duration:180,base:140,starMul:45,skillMul:12,shinyBonus:140,fail:.18,death:.12,desc:'2★ 入门进阶任务，2 人小队，偏重速度与幸运。'},
{id:'river',name:'河谷巡游',taskLevel:3,minStar:3,minTeam:2,minLevel:3,duration:240,base:220,starMul:55,skillMul:16,shinyBonus:170,fail:.19,death:.14,desc:'牧场 Lv3 解锁，偏重速度、幸运与稳定性。'},
{id:'ruins',name:'遗迹探索',taskLevel:4,minStar:4,minTeam:2,minLevel:5,duration:360,base:420,starMul:85,skillMul:24,shinyBonus:240,fail:.22,death:.20,desc:'牧场 Lv5 解锁，偏重防御、攻击与幸运。'},
{id:'cavern',name:'晶洞勘探',taskLevel:5,minStar:4,minTeam:3,minLevel:7,duration:450,base:620,starMul:95,skillMul:28,shinyBonus:300,fail:.24,death:.22,desc:'牧场 Lv7 解锁，3 人队，道具回报更好。'},
{id:'astral',name:'星门远征',taskLevel:6,minStar:5,minTeam:3,minLevel:10,duration:600,base:1200,starMul:140,skillMul:40,shinyBonus:420,fail:.28,death:.30,desc:'牧场 Lv10 解锁，综合考验属性与技能组合。'},
{id:'summit',name:'天穹峰远征',taskLevel:7,minStar:5,minTeam:3,minLevel:13,duration:780,base:1750,starMul:165,skillMul:48,shinyBonus:520,fail:.30,death:.32,desc:'牧场 Lv13 解锁，高回报，重视护航与综合属性。'},
{id:'rift',name:'裂隙核心',taskLevel:8,minStar:5,minTeam:3,minLevel:16,duration:960,base:2600,starMul:190,skillMul:58,shinyBonus:700,fail:.33,death:.35,desc:'牧场 Lv16 解锁，最高级常驻派遣，稀有奖励率更高。'}
];
function dispatchedMonsters(){if(!s.dispatch)return [];const ids=Array.isArray(s.dispatch.monsterIds)?s.dispatch.monsterIds:(s.dispatch.monsterId?[s.dispatch.monsterId]:[]);return ids.map(id=>s.monsters.find(m=>m.id===id)).filter(Boolean);}
function dispatchedMonster(){return dispatchedMonsters()[0]||null;}
function isDispatched(id){return dispatchedMonsters().some(m=>m.id===id);}
function isInActiveExpedition(id){return !!(s.expedition?.rogueActive?.teamIds||[]).includes(id);}
function dispatchMission(){return s.dispatch?DISPATCH_MISSIONS.find(x=>x.id===s.dispatch.mission)||null:null;}
function canDispatchMonster(m){return !!(m&&!isDispatched(m.id)&&!isInActiveExpedition(m.id)&&!isEggParent(m.id)&&m.life>0);}
function canAutoDispatchMonster(m){return !!(canDispatchMonster(m)&&!m.locked);} // locked = manual-only
function missionState(m,mission){const [hp,atk,def,spd,luck]=G.stats(m);let score=0;if(['forage','river'].includes(mission.id))score=spd*.5+luck*.4+def*.1;else if(['ruins','cavern'].includes(mission.id))score=def*.4+atk*.35+luck*.25;else score=atk*.25+def*.25+spd*.25+luck*.25;score*=traitMods(m).state;const expectedByMission={meadow:52,forage:95,river:190,ruins:285,cavern:315,astral:385,summit:410,rift:435};const expected=expectedByMission[mission.id]||250;const bonus=Math.max(-.08,Math.min(.14,(score-expected)/expected*.12));return {score:Math.round(score),bonus};}
function teamDispatchMods(team,mission=null){
  const o={reward:1,item:0,success:0,death:1,duration:1,skillFind:1,bond:0};
  if(!team.length)return o;

  let reward=0,duration=0,death=0,skillFind=0,bond=0,fastSpecies=0,exclusiveDuration=0;
  for(const m of team){
    const dm=dispatchMods(m),tm=traitMods(m),sm=mission?speciesMissionMods(m,mission):null;
    reward+=dm.reward*tm.reward;
    duration+=dm.duration*tm.duration;
    death+=dm.deathMult*tm.death;
    skillFind+=tm.skillFind;
    bond+=tm.bond;
    o.item+=dm.item+tm.item;
    o.success+=-dm.fail+tm.success;
    if(G.SPECIES[m.species]?.passive==='dispatch_fast')fastSpecies+=skillNum(m)*.01;
    if(sm)exclusiveDuration+=sm.duration||0;
  }

  o.reward=reward/team.length;o.duration=duration/team.length;o.death=death/team.length;
  o.skillFind=skillFind/team.length;o.bond=bond/team.length;o.item/=team.length;o.success/=team.length;

  o.duration*=Math.max(.60,1-Math.min(.40,fastSpecies));
  o.duration*=Math.max(.55,1-Math.min(.35,exclusiveDuration));

  const skills=new Set(team.flatMap(m=>effectiveExtraSkillEntries(m).map(x=>x.id)));
  if(skills.has('sure_step')&&skills.has('treasure_nose')){o.success+=.03;o.item+=.03;}
  if(new Set(team.map(m=>m.trait)).size===team.length&&team.length>=3)o.success+=.02;
  return o;
}
function teamMissionState(team,mission){if(!team.length)return {score:0,bonus:0};const states=team.map(m=>missionState(m,mission));return {score:Math.round(states.reduce((a,x)=>a+x.score,0)/team.length),bonus:states.reduce((a,x)=>a+x.bonus,0)/team.length+Math.max(0,team.length-1)*.035};}
function teamDispatchReward(team,mission){const mods=teamDispatchMods(team,mission),memberPart=team.reduce((sum,m)=>sum+m.star*mission.starMul+skillNum(m)*mission.skillMul+(m.shiny?mission.shinyBonus:0),0),speciesReward=team.reduce((a,m)=>a+speciesMissionMods(m,mission).reward,0)/Math.max(1,team.length);return Math.max(120,Math.round((mission.base+memberPart*.72)*mods.reward*speciesReward*1.5));}
function teamDispatchFailChance(team,mission){if(!team.length)return .65;const mods=teamDispatchMods(team,mission),state=teamMissionState(team,mission),avgStar=team.reduce((a,m)=>a+m.star,0)/team.length,speciesSuccess=team.reduce((a,m)=>a+speciesMissionMods(m,mission).success,0)/team.length;return Math.max(.03,Math.min(.65,mission.fail-(avgStar-mission.minStar)*.015-mods.success-speciesSuccess-state.bonus));}
function teamDispatchSuccessChance(team,mission){return 1-teamDispatchFailChance(team,mission);}
function rollDispatchItem(mission,m){const mods=dispatchMods(m);const r=Math.random();const specialRate=mission.id==='forage'?.006:mission.id==='ruins'?.012:.02;if(r<specialRate)return {type:'specialColor',variant:Math.floor(Math.random()*3)};const rate=Math.max(.003,(mission.id==='forage'?.025:mission.id==='ruins'?.04:.055)+mods.item);const x=Math.random();if(x<rate)return {type:'color',tint:Math.floor(Math.random()*6)};if(x<rate+(mission.id==='forage'?.008:mission.id==='ruins'?.014:.02))return {type:'star'};if(x<rate+(mission.id==='forage'?.010:mission.id==='ruins'?.018:.026))return {type:'skill'};if(x<rate+(mission.id==='forage'?.012:mission.id==='ruins'?.021:.032))return {type:'reroll'};return null;}
function rollTeamDispatchItem(mission,team){
  if(!team.length)return null;
  const rates=dispatchItemRates(mission,team),x=Math.random();
  let acc=0;
  if((acc+=rates.special)&&x<acc)return {type:'specialColor',variant:Math.floor(Math.random()*3)};
  if((acc+=rates.color)&&x<acc)return {type:'color',tint:Math.floor(Math.random()*6)};
  if((acc+=rates.star)&&x<acc)return {type:'star'};
  if((acc+=rates.skill)&&x<acc)return {type:'skill'};
  if((acc+=rates.reroll)&&x<acc)return {type:'reroll'};if((acc+=rates.timeCut)&&x<acc)return {type:'timeCut'};if((acc+=rates.timeInstant)&&x<acc)return {type:'timeInstant'};
  return null;
}
function rollFoundSkill(mission,team=[]){
  const chance=missionFoundSkillChance(mission,team);
  if(Math.random()>=chance)return null;
  return {id:randomExtraSkillId(Math.random),lv:ordinarySkillLevel(Math.random)};
}
function prepareTeamDispatchOutcome(team,mission){
  const failed=Math.random()<teamDispatchFailChance(team,mission);
  if(failed)return {failed:true,reward:0,item:null,foundSkill:null,shinyFind:false,exclusiveSpecies:null,ordinarySpecies:null};

  const exclusiveSpecies=rollMissionExclusiveSpecies(mission,team);
  const ordinarySpecies=Number.isInteger(exclusiveSpecies)?null:rollMissionOrdinarySpecies(mission,team);

  return {
    failed:false,
    reward:teamDispatchReward(team,mission),
    item:rollTeamDispatchItem(mission,team),
    foundSkill:rollFoundSkill(mission,team),
    shinyFind:exploreShinyChance(team,mission)>0&&Math.random()<exploreShinyChance(team,mission),
    exclusiveSpecies,
    ordinarySpecies
  };
}
function itemLabel(item){if(!item)return '无';if(item.type==='color')return G.COLORS[item.tint]+' 颜色药水';if(item.type==='star')return '升星药水';if(item.type==='skill')return '技能药水';if(item.type==='reroll')return '技能重塑药水';if(item.type==='specialColor')return SPECIAL_COLORS[item.variant].name+'探索限定颜色药水';if(item.type==='timeCut')return '行程压缩药水';if(item.type==='timeInstant')return '时跃药水';return '神秘道具';}
function addItem(item,source='来源未记录'){
  if(!item)return;
  if(item.type==='color')s.items.colors[item.tint]++;
  else if(item.type==='star')s.items.star++;
  else if(item.type==='skill')s.items.skill++;
  else if(item.type==='reroll')s.items.reroll++;
  else if(item.type==='life')s.items.life=(s.items.life||0)+1;
  else if(item.type==='specialColor')s.items.specialColors[item.variant]++;
  else if(item.type==='timeCut')s.items.timeCut=(s.items.timeCut||0)+1;
  else if(item.type==='timeInstant')s.items.timeInstant=(s.items.timeInstant||0)+1;
  recordActivity('item',{item:itemLabel(item),source});
}
function dispatchRemoveMonster(m){
  const diedAt=Date.now();
  s.monsters=s.monsters.filter(x=>x.id!==m.id);
  s.memorial.unshift({...m,diedAt});
  s.memorial=s.memorial.slice(0,200);
  s.deaths++;
  if(s.parentA===m.id)s.parentA=null;
  if(s.parentB===m.id)s.parentB=null;
  if(selected===m.id)selected=s.monsters[0]?.id||null;
  recordActivity('death',{
    key:'death-'+m.id+'-'+diedAt,
    time:diedAt,
    monster:{id:m.id,species:m.species,star:m.star,shiny:!!m.shiny,nickname:m.nickname||'',age:m.age,tint:m.tint,specialColor:m.specialColor??null}
  });
}
function dispatchOverallState(m){const st=G.stats(m);return st[1]+st[2]+st[3]+st[4];}
function dispatchSortedMonsters(){
  let list=[...s.monsters];for(const m of list)ensureMonsterSystemsMonster(m);
  const mode=$('dispatch-sort')?.value||'available',q=$('dispatch-search')?.value||'';
  if(q)list=list.filter(m=>monsterMatchesName(m,q));
  if(dispatchSkillFilter)list=list.filter(m=>monsterHasSkillName(m,dispatchSkillFilter));
  list=list.filter(m=>matchesStarSpecies(m,dispatchStarFilter,dispatchSpeciesFilter)&&matchesFamily(m,dispatchFamilyFilter));
  list.sort((a,b)=>{
    if(mode==='rarity-asc')return a.star-b.star||Number(a.shiny)-Number(b.shiny)||a.id-b.id;
    if(mode==='state-desc')return dispatchOverallState(b)-dispatchOverallState(a)||b.star-a.star;
    if(mode==='age-asc')return a.life-b.life||b.star-a.star;
    if(mode==='age-desc')return b.life-a.life||b.star-a.star;
    if(mode==='skill-desc')return rosterMaxSkillLv(b)-rosterMaxSkillLv(a)||b.star-a.star||b.id-a.id;
    if(mode==='favorite')return Number(b.favorite)-Number(a.favorite)||b.star-a.star||Number(b.shiny)-Number(a.shiny);
    if(mode==='species-asc')return (G.SPECIES[a.species]?.name||'').localeCompare(G.SPECIES[b.species]?.name||'','zh-Hans-CN')||b.star-a.star||b.id-a.id;
    if(mode==='rarity-desc')return b.star-a.star||Number(b.shiny)-Number(a.shiny)||b.id-a.id;
    return Number(canDispatchMonster(b))-Number(canDispatchMonster(a))||b.star-a.star||dispatchOverallState(b)-dispatchOverallState(a);
  });return list;
}
function dispatchTeam(){return dispatchTeamSelected.map(id=>s.monsters.find(m=>m.id===id)).filter(Boolean);}
function dispatchTeamButtonHTML(team){if(!team.length)return '<span class="parent-select-empty">选择 2–3 位队员</span>';return '<div class="dispatch-team-button">'+team.map(m=>sprite(m.species,m.tint,m.shiny,m.specialColor)).join('')+'<span class="team-copy"><strong>已选 '+team.length+' / 3 位</strong><small>'+team.map(m=>name(m)+' '+G.stars(m.star)).join(' · ')+'</small></span></div>';}

function breedingParentLifeLoss(a,b){
  const o=G.odds(a,b);
  if(!o)return 2;
  return Math.max(1,2-(o.parentLifeReduce||0)+(o.parentLifeBonus||0));
}

function dispatchItemRates(mission,team=[]){
  const tm=team.length?teamDispatchMods(team,mission):{item:0},speciesItem=team.length?team.reduce((a,m)=>a+speciesMissionMods(m,mission).item,0)/team.length:0;
  const bonus=Math.max(-.02,Math.min(.18,(tm.item||0)+speciesItem));
  const tier=mission.minLevel||1;
  const base=tier<5?{special:.018,color:.06,star:.016,skill:.02,reroll:.022}:tier<10?{special:.035,color:.09,star:.03,skill:.035,reroll:.04}:tier<16?{special:.055,color:.12,star:.045,skill:.05,reroll:.055}:{special:.075,color:.15,star:.06,skill:.07,reroll:.075};
  return {
    special:Math.max(0,Math.min(.18,base.special+Math.max(0,bonus)*.25)),
    color:Math.max(.01,Math.min(.55,base.color+bonus)),
    star:Math.max(0,Math.min(.22,base.star+Math.max(0,bonus)*.45)),
    skill:Math.max(0,Math.min(.24,base.skill+Math.max(0,bonus)*.45)),
    reroll:Math.max(0,Math.min(.26,base.reroll+Math.max(0,bonus)*.50)),timeCut:Math.min(.012,.004+Math.max(0,(mission.minLevel||1)-1)*.00045),timeInstant:Math.min(.003,.0008+Math.max(0,(mission.minLevel||1)-1)*.00014)
  };
}
function missionFoundSkillChance(mission,team=[]){
  const mult=team.length?teamDispatchMods(team,mission).skillFind*(team.reduce((a,m)=>a+speciesMissionMods(m,mission).skillFind,0)/team.length):1;
  const tier=mission.minLevel||1;const base=tier<5?.004:tier<10?.008:tier<16?.014:.022;
  return Math.max(0,Math.min(.08,base*mult));
}
function rateText(v){const p=v*100;return (p<1?p.toFixed(1):Math.round(p))+'%';}
function dispatchPossibleReturnsHTML(mission,team=[]){
  const rates=dispatchItemRates(mission,team),skillChance=missionFoundSkillChance(mission,team),shinyChance=team.length?exploreShinyChance(team,mission):0,returnSpecial=dispatchReturnSpecialColorChance(mission);
  return '<div class="dispatch-reward-preview"><b>可能收获</b><div class="dispatch-loot-list">'
    +'<span class="chance-pill">颜色药水 '+rateText(rates.color)+'</span>'
    +'<span class="chance-pill">限定颜色药水 '+rateText(rates.special)+'</span>'+'<span class="chance-pill">带回怪限定色 '+rateText(returnSpecial)+'</span>'
    +'<span class="chance-pill">升星药水 '+rateText(rates.star)+'</span>'
    +'<span class="chance-pill">技能药水 '+rateText(rates.skill)+'</span>'
    +'<span class="chance-pill">技能重塑药水 '+rateText(rates.reroll)+'</span>'+'<span class="chance-pill">行程压缩药水 '+rateText(rates.timeCut)+'</span>'+'<span class="chance-pill">时跃药水 '+rateText(rates.timeInstant)+'</span>'
    +'<span class="chance-pill">稀有技能 '+rateText(skillChance)+'</span>'
    +(shinyChance>0?'<span class="chance-pill">闪光邂逅 '+rateText(shinyChance)+(shinyLineageDispatchBonus(team)>0?' · 闪光血统 +'+rateText(shinyLineageDispatchBonus(team)):'')+'</span>':'')
    +'</div></div>';
}
function dispatchSkillSummaryHTML(m){
  return '<div class="dispatch-skill-row">技能：'+monsterSkillSummary(m)+'</div>';
}
function renderDispatchTargetPicker(){
  const picker=$('dispatch-target-picker');if(!picker)return;
  const selectedSet=new Set(dispatchTeamSelected);
  const all=[...s.monsters];
  picker.innerHTML='<div class="dispatch-filter-toolbar">'+
    '<select data-dispatch-skill-filter>'+skillFilterOptionsHTML(all,dispatchSkillFilter)+'</select>'+
    '<select data-dispatch-star-filter>'+starFilterOptionsHTML(dispatchStarFilter)+'</select>'+
    '<select data-dispatch-species-filter>'+speciesFilterOptionsHTML(dispatchSpeciesFilter)+'</select>'+
    '<select data-dispatch-family-filter>'+familyFilterOptionsHTML(all,dispatchFamilyFilter)+'</select>'+
    '</div><div class="dispatch-target-grid">'+dispatchSortedMonsters().map(m=>
    '<button type="button" class="dispatch-target-choice '+(selectedSet.has(m.id)?'selected ':'')+(canDispatchMonster(m)?'':'unavailable')+'" data-dispatch-target="'+m.id+'">'
    +(selectedSet.has(m.id)?'<span class="team-check">✓</span>':'')
    +sprite(m.species,m.tint,m.shiny,m.specialColor)
    +'<span><strong>'+G.stars(m.star)+' '+name(m)+(m.shiny?' · 闪光':'')+traitBadge(m)+'</strong>'
    +'<small>'+m.gender+' · '+colorName(m)+' · '+m.life+' / '+m.maxLife+' 生命<br>位置：'+(isDispatched(m.id)?'派遣中':isEggParent(m.id)?'孵化亲代':isInFarm(m.id)?'生产牧场':'怪物盒')+' · '+(canDispatchMonster(m)?(m.locked?'已锁定 · 仅手动可用':'可加入队伍'):m.life<=0?'生命耗尽':'当前不可派遣')+'<br>'+monsterSkillSummary(m)+'</small></span></button>'
  ).join('')+'</div><div class="team-limit">最多选择 3 位。林地采集 / 遗迹探索至少 2 位，星门远征必须 3 位。</div>';
}
function closeDispatchPicker(){const p=$('dispatch-target-picker'),b=$('dispatch-target-btn');if(p)p.hidden=true;if(b)b.setAttribute('aria-expanded','false');}
function toggleDispatchPicker(){const p=$('dispatch-target-picker'),b=$('dispatch-target-btn');if(!p||!b)return;const opening=p.hidden;closeDispatchPicker();if(opening){renderDispatchTargetPicker();p.hidden=false;b.setAttribute('aria-expanded','true');}}
function chooseDispatchTarget(id){const m=s.monsters.find(x=>x.id===id);if(!m||!canDispatchMonster(m)){tell('这只怪物当前不能加入派遣队。');return;}const pos=dispatchTeamSelected.indexOf(id);if(pos>=0)dispatchTeamSelected.splice(pos,1);else{if(dispatchTeamSelected.length>=3){tell('派遣队最多 3 位成员。');return;}dispatchTeamSelected.push(id);}dispatchSelected=dispatchTeamSelected[0]||null;
  if(s.manualDispatchRepeat&&!s.dispatch&&!s.manualDispatchMission){
    s.manualDispatchTeamIds=[...dispatchTeamSelected];
  }
  renderDispatch();}
function teamSynergyText(team){
  if(team.length<2)return '再选择队员即可形成小队。';
  const skills=new Set(team.flatMap(m=>(m.extraSkills||[]).filter(Boolean))),traits=new Set(team.map(m=>m.trait)),parts=[];
  if(skills.has('sure_step')&&skills.has('treasure_nose'))parts.push('稳步 + 寻宝鼻：成功率 +3%、寻宝率提升');
  if(skills.has('mission_guard')&&skills.has('sure_step'))parts.push('护航体魄 + 稳步：更适合长期派遣');
  if(skills.has('bounty_hunter')&&skills.has('treasure_nose'))parts.push('赏金嗅觉 + 寻宝鼻：高收益探索组合');
  if(traits.has('careful')&&traits.has('curious'))parts.push('谨慎 + 好奇：风险与探索平衡');
  if(traits.size===team.length&&team.length>=3)parts.push('三种不同个性：成功率 +2%');
  return parts.length?parts.join('；'):'当前没有触发额外队伍组合加成。';
}
function dispatchMissionSkillFit(m,mission){
  if(!m||!mission)return -999;
  ensureMonsterSystemsMonster(m);
  let fit=0;

  const sp=G.SPECIES[m.species],lv=skillNum(m);

  // Skills designed for the exact mission are the strongest signal.
  if(sp?.exclusiveMission===mission.id){
    fit+=300+lv*18;
    if(sp.passive==='mission_success')fit+=90;
    else if(sp.passive==='mission_hunt')fit+=82;
    else if(sp.passive==='mission_item')fit+=72;
    else if(sp.passive==='mission_guard')fit+=68;
    else if(sp.passive==='mission_reward')fit+=62;
  }

  // General dispatch abilities.
  for(const ent of effectiveExtraSkillEntries(m)){
    const id=ent.id,slv=ent.lv;
    if(id==='sure_step')fit+=220+slv*14;
    else if(id==='mission_guard')fit+=205+slv*13;
    else if(id==='treasure_nose')fit+=175+slv*11;
    else if(id==='shiny_explore')fit+=165+slv*11;
    else if(id==='bounty_hunter')fit+=145+slv*9;
    else if(id==='vital_growth')fit+=50+slv*4;
    else if(id==='lost_route')fit-=210+slv*8;
    else if(id==='empty_pouch')fit-=160+slv*6;
    else if(id==='thin_reward')fit-=140+slv*5;
  }

  if(['careful','curious','tough'].includes(m.trait))fit+=35;
  else if(m.trait==='lively')fit+=25;
  else if(m.trait==='brave')fit+=15;

  return fit;
}
function autoDispatchScore(m,mission){
  if(!canDispatchMonster(m)||m.star<mission.minStar)return -1e9;

  const fit=dispatchMissionSkillFit(m,mission);
  const state=missionState(m,mission);
  const mode=s.autoDispatchPowerMode||'efficient';
  const starGap=Math.max(0,m.star-mission.minStar);

  if(mode==='max'){
    // 最高配置：任务技能匹配优先，其次高星。
    let score=fit*10000000;
    score+=m.star*100000;
    score+=state.score*100+m.life*20+skillNum(m)*10;
    if(m.autoUse)score+=2500;
    if(m.life<=5)score-=1000;
    return score;
  }

  // 最低够用：
  // 1. 先严格按任务最低星级分层；
  // 2. 只有同一个星级层内，才比较任务技能 / 属性；
  // 3. 最低星人数不足时，才使用更高星补位。
  let score=-starGap*1000000000;
  score+=fit*1000000;
  score+=state.score*100+m.life*20+skillNum(m)*10;
  if(m.autoUse)score+=2500;
  if(m.life<=5)score-=1000;
  return score;
}
function dispatchBreedingReserve(){
  if(!s.autoDispatchReserveBreed)return [];
  const eligible=s.monsters.filter(m=>!m.locked&&!isDispatched(m.id)&&!isEggParent(m.id)&&m.life>0);
  const eligibleIds=new Set(eligible.map(m=>m.id));
  const pa=s.monsters.find(m=>m.id===s.parentA&&eligibleIds.has(m.id));
  const pb=s.monsters.find(m=>m.id===s.parentB&&eligibleIds.has(m.id));
  if(pa&&pb&&pa.id!==pb.id&&pa.gender!==pb.gender)return [pa.id,pb.id];

  const pair=chooseSmartBreedPair();
  if(pair&&eligibleIds.has(pair[0].id)&&eligibleIds.has(pair[1].id))return [pair[0].id,pair[1].id];

  const male=eligible.filter(m=>m.gender==='公').sort((a,b)=>b.star-a.star||b.life-a.life)[0];
  const female=eligible.filter(m=>m.gender==='母').sort((a,b)=>b.star-a.star||b.life-a.life)[0];
  return male&&female?[male.id,female.id]:[];
}
function autoDispatchCandidates(ms,includeFarm=false){
  const reserve=new Set(dispatchBreedingReserve());
  // 系统推荐仍属于自动选择：锁定怪物必须由玩家亲自点选。
  return automationCandidatePool(
    s.monsters.filter(m=>canAutoDispatchMonster(m)&&m.star>=ms.minStar&&!reserve.has(m.id)&&(includeFarm||!isInFarm(m.id)))
  );
}

function autoSelectDispatchTeam(missionIndex){
  const ms=DISPATCH_MISSIONS[missionIndex];
  if(!ms)return;
  if(ranchLevel()<(ms.minLevel||1)){tell('牧场等级不足，需要 Lv'+ms.minLevel+'。');return;}

  // 手动点系统推荐时允许临时抽调生产牧场成员；归来后自动恢复生产。
  const team=chooseSmartDispatchTeam(ms,true);
  dispatchTeamSelected=team.map(m=>m.id);
  dispatchSelected=dispatchTeamSelected[0]||null;
  renderDispatch();

  const modeText=(s.autoDispatchPowerMode||'efficient')==='efficient'?'最低够用':'最高配置';
  const fillText=team.length>ms.minTeam?'，第3位队员确实能明显提高任务收益/成功率，所以已加入':'，没有必要浪费额外队员，因此使用最低需要人数';
  tell(team.length>=ms.minTeam
    ?'系统按「'+modeText+'」选择；最低够用模式会先锁定任务最低星级，同星级内再比较派遣技能。'+((s.autoDispatchPowerMode||'efficient')==='max'?fillText:'')+(s.autoDispatchReserveBreed?' 已保留一公一母用于生蛋。':'')
    :'没有足够符合条件的怪物。'+(s.autoDispatchReserveBreed?' 当前已保留一公一母用于生蛋；如需全部派遣，可关闭「保留 1 公 + 1 母」。':''));
}
function farmBadge(m){return isInFarm(m.id)?'<span class="dispatch-badge farm-badge">生产中</span>':'<span class="box-badge">盒中</span>';}
function autoUseBadge(m){return m?.autoUse?'<span class="auto-use-badge">自动优先</span>':'';}
function automationCandidatePool(list){const marked=list.filter(m=>m.autoUse),unmarked=list.filter(m=>!m.autoUse);return [...marked,...unmarked];}
function breedStarPotential(a,b){
  const o=G.odds(a,b);
  const high=Math.max(a.star,b.star),low=Math.min(a.star,b.star),gap=high-low;
  let expected=0,upgradeChance=0,fiveChance=0,maxPossible=1;
  for(const st of [1,2,3,4,5]){
    const p=(o.starProbs?.[st]||0)*(1-(o.fail||0));
    expected+=st*p;
    if(p>.000001)maxPossible=st;
    if(st>high)upgradeChance+=p;
    if(st===5)fiveChance+=p;
  }
  return {expected,upgradeChance,fiveChance,maxPossible,high,low,gap};
}
function breedSkillUpgradePotential(a,b){
  const ma=parentAbilityMap(a),mb=parentAbilityMap(b);
  let count=0,score=0,shared=0;
  const fa=familySkillParts(a)[0],fb=familySkillParts(b)[0];
  if(a?.familyName&&a.familyName===b?.familyName&&fa&&fb&&fa.id===fb.id&&fa.lv===fb.lv&&fa.lv<10){
    const chance=familySkillUpgradeChance(fa.lv),weight=BREED_SKILL_WEIGHTS[fa.id]||55;
    count++;
    shared++;
    score+=chance*weight*900*(1+fa.lv*.35);
  }
  for(const id of [...ma.keys()].filter(id=>mb.has(id))){
    const la=ma.get(id)||0,lb=mb.get(id)||0,r=inheritedLevelRange(id,a,b);
    const best=Math.max(la,lb),gain=Math.max(0,r.max-best),weight=BREED_SKILL_WEIGHTS[id]||40;
    shared++;
    if(gain>0){
      count++;
      score+=gain*weight*(1+best*.25);
      if(Math.abs(la-lb)<=1)score+=weight*(1+best*.10);
    }
  }
  return {count,score,shared};
}
function smartBreedPairScore(a,b,mode=s.autoBreedPriority||'star'){
  if(!a||!b||a.id===b.id||a.gender===b.gender)return -Infinity;
  const star=breedStarPotential(a,b),skill=breedSkillUpgradePotential(a,b);
  const autoBonus=(a.autoUse?1:0)+(b.autoUse?1:0);
  const baseSkill=breedingSkillScore(a).score+breedingMatchScore(b,a);

  if(mode==='skill'){
    return skill.count*100000000
      + skill.score*400000
      + skill.shared*300000
      + star.maxPossible*80000
      + star.expected*1000
      + baseSkill*40
      + autoBonus*3000;
  }

  return star.maxPossible*1000000000000
    + star.low*10000000000
    + (a.star+b.star)*1000000000
    + star.high*100000000
    - star.gap*50000000
    + star.upgradeChance*10000000
    + star.fiveChance*5000000
    + star.expected*100000
    + autoBonus*2500;
}

let smartBreedCache={key:'',ids:null};
function smartBreedCacheKey(){
  const dispatchIds=s.dispatch?(Array.isArray(s.dispatch.monsterIds)?s.dispatch.monsterIds:[s.dispatch.monsterId]):[];
  return [
    s.revision||0,
    s.monsters.length,
    s.autoBreedPriority||'star',
    dispatchIds.filter(Boolean).join(','),
    s.autoDispatchReserveBreed!==false?1:0
  ].join('|');
}
function smartBreedShortlist(list,mode){
  if(list.length<=60)return list;
  if(mode==='skill'){
    return [...list]
      .sort((a,b)=>breedingSkillScore(b).score-breedingSkillScore(a).score||b.star-a.star||b.life-a.life)
      .slice(0,36);
  }
  // Preserve every star tier so 4★+4★ can still beat 5★+2★.
  const out=[];
  for(const star of [5,4,3,2,1]){
    const tier=list.filter(m=>m.star===star)
      .sort((a,b)=>breedingSkillScore(b).score-breedingSkillScore(a).score||Number(b.autoUse)-Number(a.autoUse)||b.life-a.life)
      .slice(0,12);
    out.push(...tier);
  }
  return out;
}
function chooseSmartBreedPair(force=false){
  const key=smartBreedCacheKey();
  if(!force&&smartBreedCache.key===key&&Array.isArray(smartBreedCache.ids)){
    const a=s.monsters.find(m=>m.id===smartBreedCache.ids[0]);
    const b=s.monsters.find(m=>m.id===smartBreedCache.ids[1]);
    if(a&&b&&!a.locked&&!b.locked&&a.life>0&&b.life>0&&!isDispatched(a.id)&&!isDispatched(b.id)&&!isInActiveExpedition(a.id)&&!isInActiveExpedition(b.id)&&a.gender!==b.gender)return [a,b];
  }

  const eligible=s.monsters.filter(m=>!m.locked&&!isDispatched(m.id)&&!isInActiveExpedition(m.id)&&m.life>0);
  const mode=s.autoBreedPriority||'star';
  const males=smartBreedShortlist(eligible.filter(m=>m.gender==='公'),mode);
  const females=smartBreedShortlist(eligible.filter(m=>m.gender==='母'),mode);

  let best=null,bestScore=-Infinity;
  for(const a of males)for(const b of females){
    const score=smartBreedPairScore(a,b,mode);
    if(score>bestScore){bestScore=score;best=[a,b];}
  }

  smartBreedCache={key,ids:best?[best[0].id,best[1].id]:null};
  return best;
}
function highestUnlockedMission(){return [...DISPATCH_MISSIONS].filter(ms=>ranchLevel()>=(ms.minLevel||1)).sort((a,b)=>(b.minLevel||1)-(a.minLevel||1))[0]||DISPATCH_MISSIONS[0];}
function autoDispatchMission(){if(s.autoDispatchMission==='highest')return highestUnlockedMission();const ms=DISPATCH_MISSIONS.find(x=>x.id===s.autoDispatchMission);return ms&&ranchLevel()>=(ms.minLevel||1)?ms:highestUnlockedMission();}

function dispatchTeamItemChance(team,mission){
  const rates=dispatchItemRates(mission,team);
  return Object.values(rates||{}).reduce((a,v)=>a+(Number(v)||0),0);
}
function dispatchTeamSnapshot(team,mission){
  return {
    success:teamDispatchSuccessChance(team,mission),
    reward:teamDispatchReward(team,mission),
    item:dispatchTeamItemChance(team,mission),
    hunt:missionExclusiveChance(mission,team),
    skillFit:team.reduce((sum,m)=>sum+dispatchMissionSkillFit(m,mission),0)
  };
}
function meaningfulThirdMember(baseTeam,candidate,mission){
  if(!candidate)return false;
  const before=dispatchTeamSnapshot(baseTeam,mission);
  const after=dispatchTeamSnapshot([...baseTeam,candidate],mission);

  const successGain=after.success-before.success;
  const rewardGain=before.reward>0?(after.reward/before.reward)-1:1;
  const itemGain=after.item-before.item;
  const huntGain=after.hunt-before.hunt;
  const missionFit=dispatchMissionSkillFit(candidate,mission);

  // A third monster is worth using if it meaningfully improves at least one
  // important result, or carries a strong mission-specific skill package.
  return successGain>=.02 ||
         rewardGain>=.12 ||
         itemGain>=.012 ||
         huntGain>=.005 ||
         missionFit>=230;
}
function bestOptionalThird(baseTeam,candidates,mission){
  let best=null,bestValue=-Infinity;
  for(const m of candidates){
    const before=dispatchTeamSnapshot(baseTeam,mission);
    const after=dispatchTeamSnapshot([...baseTeam,m],mission);
    const successGain=after.success-before.success;
    const rewardGain=before.reward>0?(after.reward/before.reward)-1:0;
    const itemGain=after.item-before.item;
    const huntGain=after.hunt-before.hunt;
    const value=
      dispatchMissionSkillFit(m,mission)*8+
      successGain*10000+
      rewardGain*2500+
      itemGain*5000+
      huntGain*7000+
      m.star*35;
    if(value>bestValue){bestValue=value;best=m;}
  }
  return best;
}

let smartDispatchCache={key:'',ids:[]};
function smartDispatchCacheKey(ms){
  return [
    s.revision||0,
    s.monsters.length,
    ms?.id||'',
    s.autoDispatchPowerMode||'efficient',
    s.autoDispatchReserveBreed!==false?1:0,
    (s.farmIds||[]).join(','),
    s.parentA||0,s.parentB||0
  ].join('|');
}
function chooseSmartDispatchTeam(ms,includeFarm=false,force=false){
  const key=smartDispatchCacheKey(ms)+(includeFarm?'|farm':'|box');
  if(!force&&smartDispatchCache.key===key&&smartDispatchCache.ids.length){
    const team=smartDispatchCache.ids.map(id=>s.monsters.find(m=>m.id===id)).filter(Boolean);
    if(team.length>=ms.minTeam&&team.every(m=>canDispatchMonster(m)&&m.star>=ms.minStar&&(includeFarm||!isInFarm(m.id))))return team;
  }

  const candidates=[...autoDispatchCandidates(ms,includeFarm)].sort((a,b)=>autoDispatchScore(b,ms)-autoDispatchScore(a,ms));
  let team;
  if(candidates.length<ms.minTeam){
    team=candidates;
  }else{
    const base=candidates.slice(0,ms.minTeam);
    if((s.autoDispatchPowerMode||'efficient')==='efficient'||ms.minTeam>=3||candidates.length<=ms.minTeam){
      team=base;
    }else{
      const third=bestOptionalThird(base,candidates.slice(ms.minTeam),ms);
      team=third&&meaningfulThirdMember(base,third,ms)?[...base,third]:base;
    }
  }

  smartDispatchCache={key,ids:team.map(m=>m.id)};
  return team;
}
function setBreedActionStatus(text,kind=''){
  const el=$('breed-action-status');
  if(!el)return;
  el.textContent=text;
  el.className='breed-action-status '+kind;
}
function manualBreedAttempt(){
  settle();
  ensureBreedingPair();
  const [a,b]=G.pair(s);
  if(!a||!b){setBreedActionStatus('无法开始：需要一公一母两位亲代。','err');tell('需要一公一母两位亲代。');dirty=true;render();return false;}
  const issue=G.blocked(s,Date.now());
  if(issue){setBreedActionStatus('暂时不能生蛋：'+issue,'wait');tell('暂时不能生蛋：'+issue);dirty=true;render();return false;}
  const beforeTotal=totalQueuedEggs(s),beforeQueue=(s.eggQueue||[]).length;
  let ok=false;
  try{
    ok=G.startBreed(s,Date.now());
  }catch(err){
    console.error('Manual breed engine error:',err);
    const detail=(err&&err.message)?String(err.message).slice(0,140):'未知错误';
    setBreedActionStatus('生蛋引擎错误：'+detail,'err');
    tell('生蛋失败：'+detail);dirty=true;try{render();}catch(_){}try{save();}catch(_){}return false;
  }
  if(!ok||totalQueuedEggs(s)<=beforeTotal){
    setBreedActionStatus('没有成功创建怪物蛋，请重新选择亲代后再试。','err');tell('没有成功创建怪物蛋，请重新选择亲代后再试。');dirty=true;render();save();return false;
  }
  const queued=(s.eggQueue||[]).length>beforeQueue;
  const egg=queued?s.eggQueue[s.eggQueue.length-1]:(s.egg2&&beforeTotal>0?s.egg2:s.egg);
  const child=egg?.child,parentNames=[a,b].map(name).join(' × ');
  setBreedActionStatus('成功生蛋：'+parentNames+(child?' · '+G.stars(child.star)+' '+G.SPECIES[child.species].name+'蛋':'')+(queued?' · 已加入等候队列 '+queuedEggCount(s)+' / 10':' · 正在孵化'),'ok');
  tell(queued?'怪物蛋已加入孵化等候列表。':'怪物蛋已经进入孵化巢。');
  try{if(s.monsters.some(m=>m.id===a.id))talk(a.id,'一起等宝宝 ♡');if(s.monsters.some(m=>m.id===b.id))talk(b.id,'暖暖的蛋！');playSfx('breed');}catch(err){console.error('Breed feedback error:',err);}
  dirty=true;try{render();}catch(err){console.error('Breed post-render error:',err);}try{save();}catch(err){console.error('Breed post-save error:',err);}return true;
}

function fixedBreedPair(){
  const ids=s.manualBreedPairIds||[];
  if(ids.length!==2)return null;
  const a=s.monsters.find(m=>m.id===ids[0]),b=s.monsters.find(m=>m.id===ids[1]);
  if(!a||!b||a.id===b.id||a.gender===b.gender)return null;
  return [a,b];
}
function tryFixedBreedNow(now=Date.now()){
  if(!s.manualBreedRepeat)return false;
  const pair=fixedBreedPair();
  if(!pair){stopManualBreedRepeat('其中一位固定亲代已经不存在');return false;}
  if(pair.some(m=>isDispatched(m.id))){setBreedActionStatus('固定双亲正在派遣；回来后会自动继续。','wait');return false;}
  if(totalQueuedEggs(s)>=eggTotalMax(s)){setBreedActionStatus('固定双亲仍保持锁定；孵蛋队列已满，腾出位置后会自动继续。','wait');return false;}
  s.parentA=pair[0].id;s.parentB=pair[1].id;
  const why=G.blocked(s,now);
  if(why){setBreedActionStatus('固定双亲等待：'+why,'wait');return false;}
  const before=totalQueuedEggs(s);
  let ok=false;
  try{ok=G.startBreed(s,now);}catch(err){console.error('Fixed breed repeat error:',err);setBreedActionStatus('固定双亲连发错误：'+(err?.message||'未知错误'),'err');return false;}
  const after=totalQueuedEggs(s);
  if(ok&&after>before){dirty=true;setBreedActionStatus('固定双亲连发生蛋：'+name(pair[0])+' × '+name(pair[1])+'。','ok');return true;}
  setBreedActionStatus('固定双亲仍已锁定，但本轮没有创建新蛋；系统会在下一次心跳重试。','wait');
  return false;
}
function captureManualBreedPair(){
  const [a,b]=G.pair(s);
  if(!a||!b||a.id===b.id||a.gender===b.gender)return false;
  s.manualBreedPairIds=[a.id,b.id];return true;
}
function fixedDispatchMission(){return DISPATCH_MISSIONS.find(ms=>ms.id===s.manualDispatchMission)||null;}
function fixedDispatchTeam(ms){
  return (s.manualDispatchTeamIds||[]).map(id=>s.monsters.find(m=>m.id===id)).filter(Boolean)
    .filter(m=>!isDispatched(m.id)&&m.life>0&&m.star>=ms.minStar&&!isEggParent(m.id));
}
function captureManualDispatch(ms){
  const team=dispatchTeam();
  if(!ms||team.length<ms.minTeam||team.length>3)return false;
  s.manualDispatchTeamIds=team.map(m=>m.id);s.manualDispatchMission=ms.id;return true;
}
function stopManualBreedRepeat(reason=''){
  s.manualBreedRepeat=false;s.manualBreedPairIds=[];
  if(reason)tell('固定双亲连发已停止：'+reason);
}
function stopManualDispatchRepeat(reason=''){
  s.manualDispatchRepeat=false;s.manualDispatchTeamIds=[];s.manualDispatchMission=null;
  if(reason)tell('固定队伍连发已停止：'+reason);
}
function autoBreedStatus(){
  if(!s.autoBreed&&!s.manualBreedRepeat)return {text:'连续生蛋未开启。',cls:''};
  if(document.visibilityState==='hidden')return {text:'页面不在前台；连续生蛋已暂停。',cls:'wait'};
  if(s.egg){
    const remain=Math.max(0,Math.ceil((s.egg.ready-Date.now())/1000)),q=queuedEggCount(s),total=totalQueuedEggs(s);
    if(total>=eggTotalMax(s))return {text:'孵蛋队列已满：1 颗孵化中 + '+q+' 颗等候（11 / 11）。',cls:'wait'};
    return {text:(remain>0?'当前蛋剩余约 '+remain+' 秒':'当前蛋已完成，等待自动孵化')+' · 等候 '+q+' / 10；连续生蛋会继续补充队列。',cls:'ready'};
  }
  if(s.monsters.length>=s.capacity)return {text:'怪物盒已满，无法继续生蛋。',cls:'blocked'};
  if(s.manualBreedRepeat){
    const pair=fixedBreedPair();
    if(!pair)return {text:'固定双亲已不存在，连发会停止。',cls:'blocked'};
    if(pair.some(m=>isDispatched(m.id)))return {text:'固定双亲正在派遣，回来后继续。',cls:'wait'};
    const oa=s.parentA,ob=s.parentB;s.parentA=pair[0].id;s.parentB=pair[1].id;
    const why=G.blocked(s,Date.now());s.parentA=oa;s.parentB=ob;
    return why?{text:'固定双亲等待：'+why,cls:'wait'}:{text:'固定双亲连发：'+name(pair[0])+' × '+name(pair[1]),cls:'ready'};
  }
  const pair=chooseSmartBreedPair();
  if(!pair)return {text:'暂时没有可用的一公一母；智能连发保持开启，有新可用亲代后会自动继续。',cls:'wait'};
  return {text:'智能连发（'+((s.autoBreedPriority||'star')==='star'?'高星优先':'配种技能优先')+'）：当前 '+name(pair[0])+' '+G.stars(pair[0].star)+' × '+name(pair[1])+' '+G.stars(pair[1].star)+'；亲代离世后会自动换下一组。',cls:'ready'};
}
let automationBusy=false;
function runOnlineAutomation(force=false){
  if((document.visibilityState==='hidden'&&!force)||automationBusy)return;
  automationBusy=true;
  try{
    const now=Date.now();
    autoManageFarm();rollFarmItems(now);

    if(s.autoBreed||s.manualBreedRepeat){
      if(s.egg&&s.egg.ready<=now&&s.autoHatch&&s.monsters.length<s.capacity){
        const child=G.hatch(s,now);if(child){births([child]);dirty=true;}
      }
      if(totalQueuedEggs(s)<eggTotalMax(s)&&s.monsters.length<s.capacity){
        let pair=null;
        if(s.manualBreedRepeat){
          tryFixedBreedNow(now);
        }else if(s.autoBreed){
          pair=chooseSmartBreedPair();
          if(!pair)setBreedActionStatus('智能连发仍保持开启：暂时没有可用的一公一母，等待新的可用亲代。','wait');
          if(pair){
            s.parentA=pair[0].id;s.parentB=pair[1].id;
            const why=G.blocked(s,now);
            const before=totalQueuedEggs(s);
            if(!why&&G.startBreed(s,now)&&totalQueuedEggs(s)>before){
              dirty=true;
              setBreedActionStatus('智能连发生蛋：'+name(pair[0])+' × '+name(pair[1])+'。','ok');
            }
          }
        }
      }
    }

    if((s.autoDispatch||s.manualDispatchRepeat)&&s.dispatch&&s.dispatch.end<=now)claimDispatch();

    if(s.manualDispatchRepeat&&!s.dispatch){
      const ms=fixedDispatchMission();
      if(!ms){
        // Fixed team is locked but a mission has not been chosen yet: keep waiting.
      }else{
        const team=fixedDispatchTeam(ms);
        if(team.length<ms.minTeam){
          stopManualDispatchRepeat('固定队伍剩余人数不足');
        }else{
          dispatchTeamSelected=team.map(m=>m.id);dispatchSelected=team[0]?.id||null;
          startDispatch(DISPATCH_MISSIONS.findIndex(x=>x.id===ms.id),true);
        }
      }
    }else if(s.autoDispatch&&!s.dispatch){
      const ms=autoDispatchMission(),team=chooseSmartDispatchTeam(ms);
      if(team.length>=ms.minTeam){
        dispatchTeamSelected=team.map(m=>m.id);dispatchSelected=team[0]?.id||null;
        startDispatch(DISPATCH_MISSIONS.findIndex(x=>x.id===ms.id),true);
      }
    }
  }catch(err){console.error('Online automation error:',err);}
  finally{automationBusy=false;}
}

function dispatchCountdownText(){
  if(!s.dispatch)return '';
  const remain=Math.max(0,s.dispatch.end-Date.now());
  if(remain<=0)return '已完成，可领取';
  const total=Math.ceil(remain/1000),m=Math.floor(total/60),sec=total%60;
  return (m?m+'分 ':'')+sec+'秒';
}
function refreshDispatchClock(){
  if(!s.dispatch)return;
  const remainMs=Math.max(0,s.dispatch.end-Date.now());
  const remainSec=Math.ceil(remainMs/1000);
  try{renderTopDispatchStatus();}catch(err){console.error('Dispatch top clock error:',err);}
  const active=$('dispatch-active');
  if(active){
    const stateEl=active.querySelector('.dispatch-going,.dispatch-ready');
    if(stateEl){
      stateEl.className=remainMs<=0?'dispatch-ready':'dispatch-going';
      stateEl.textContent=remainMs<=0?'已完成，可以领取结果':'剩余 '+remainSec+' 秒';
    }
    const claim=active.querySelector('[data-dispatch-claim]');
    if(claim)claim.disabled=remainMs>0;
  }
}

function renderTopDispatchStatus(){
  const bar=$('dispatch-top-status');
  if(!bar)return;
  if(!s.dispatch){
    bar.hidden=true;
    bar.innerHTML='';
    return;
  }
  const ms=dispatchMission(),team=dispatchedMonsters(),ready=s.dispatch.end<=Date.now();
  bar.hidden=false;
  bar.innerHTML='<div><b>派遣中</b> · <strong>'+(ms?.name||'任务')+'</strong> · '+team.map(name).join('、')+' · '+(ready?'任务完成':'剩余 '+dispatchCountdownText())+'</div><div class="dispatch-top-actions">'+(ready?'<button class="primary" data-top-dispatch-claim>领取报酬</button>':'<button class="secondary" data-open-dispatch>查看派遣</button>')+'</div>';
}

function dispatchMissionSceneHTML(mission,team){
  if(!mission)return '';
  const teamHTML=(team||[]).map(m=>
    '<div class="mission-scene-monster">'+sprite(m.species,m.tint,m.shiny,m.specialColor)
    +'<small>'+G.stars(m.star)+' '+name(m)+'</small></div>'
  ).join('');
  return '<div class="dispatch-mission-scene mission-'+mission.id+'">'
    +'<div class="mission-scene-label">'+mission.name+' · 任务等级 '+(mission.taskLevel||1)+'</div>'
    +'<div class="mission-scenery" aria-hidden="true"><i class="sky-light"></i><i class="sky-cloud"></i><i class="distant-grove"></i></div>'
    +'<div class="mission-scene-team">'+teamHTML+'</div>'
    +'</div>';
}

function renderDispatchDock(){
  const dock=$('dispatch-travel-dock'),view=$('dispatch-dock-view'),clock=$('dispatch-dock-clock');
  if(!dock||!view)return;
  const mission=dispatchMission(),team=dispatchedMonsters();
  if(!s.dispatch||!mission||!team.length){dock.hidden=true;return;}
  dock.hidden=false;
  const ready=s.dispatch.end<=Date.now();
  const key=JSON.stringify([s.dispatch.start,mission.id,ready,team.map(m=>[m.id,m.species,m.tint,m.specialColor,m.shiny,m.star,m.nickname])]);
  if(view._key!==key){
    view.innerHTML=dispatchMissionSceneHTML(mission,team);
    view.querySelector('.dispatch-mission-scene').classList.toggle('mission-arrived',ready);
    view.querySelectorAll('.mission-scene-monster').forEach((el,i)=>{
      el.style.setProperty('--travel-time',(6+i*2.3)+'s');
      el.style.setProperty('--travel-delay',(-i*3.1)+'s');
      el.style.setProperty('--travel-lane',(12+i*8)+'px');
    });
    view._key=key;
  }
  clock.textContent=ready?'已抵达 · 等待领取':dispatchCountdownText();
}

function renderDispatch(){
  const sel=$('dispatch-target');if(!sel)return;
  dispatchTeamSelected=dispatchTeamSelected.filter(id=>s.monsters.some(m=>m.id===id)&&!isDispatched(id));
  if(!dispatchTeamSelected.length&&dispatchSelected){
    const first=s.monsters.find(m=>m.id===dispatchSelected);
    if(first&&canDispatchMonster(first))dispatchTeamSelected=[first.id];
  }
  const team=dispatchTeam(),activeTeam=dispatchedMonsters(),mission=dispatchMission(),dispatchableCount=s.monsters.filter(canDispatchMonster).length;
  sel.innerHTML=dispatchSortedMonsters().map(m=>'<option value="'+m.id+'">'+G.stars(m.star)+' '+name(m)+'</option>').join('');
  const btn=$('dispatch-target-btn');if(btn)btn.innerHTML=dispatchTeamButtonHTML(team);const lockBtn=$('lock-manual-dispatch-team'),manualStatus=$('manual-dispatch-status');
  if(lockBtn){
    lockBtn.disabled=!!s.dispatch||team.length<2||team.length>3;
    lockBtn.textContent=s.manualDispatchRepeat?'固定队伍连发已开启 · 重新锁定当前队伍':'锁定当前手动队伍并开启连发';
  }
  if(manualStatus){
    if(s.manualDispatchRepeat){
      const saved=(s.manualDispatchTeamIds||[]).map(id=>s.monsters.find(m=>m.id===id)).filter(Boolean);
      manualStatus.textContent='固定队伍：'+(saved.length?saved.map(name).join('、'):'尚未锁定')+(s.manualDispatchMission?' · 连发任务：'+(fixedDispatchMission()?.name||s.manualDispatchMission):' · 尚未选择连发任务');
      manualStatus.className='manual-repeat-status active';
    }else{
      manualStatus.textContent=team.length>=2?'当前已选 '+team.length+' 位。可以锁定这支队伍连发。':'先手动选择 2–3 位队员，再锁定队伍。';
      manualStatus.className='manual-repeat-status';
    }
  }
  renderDispatchTargetPicker();
  const rli=ranchLevelFromXp(s.ranchXp||0);$('dispatch-summary').textContent=(activeTeam.length&&mission?activeTeam.map(name).join('、')+' 正在'+mission.name:'当前可派遣 '+dispatchableCount+' 只')+' · 牧场 Lv'+rli.level+' · XP '+rli.into+'/'+rli.need;

  $('dispatch-target-info').innerHTML=team.length
    ? '<div class="dispatch-team-strip">'+team.map(m=>'<div class="dispatch-team-mini">'+sprite(m.species,m.tint,m.shiny,m.specialColor)+'<span><b>'+name(m)+' '+G.stars(m.star)+'</b><small>'+traitInfo(m).name+' · ❤ '+m.life+'/'+m.maxLife+' · 属性 '+dispatchOverallState(m)+'</small>'+dispatchSkillSummaryHTML(m)+'</span></div>').join('')+'</div>'
      +'<div class="team-synergy"><b>队伍组合：</b>'+teamSynergyText(team)+(exploreShinyChance(team)>0?'<br>✦ 闪光邂逅总率 <b>'+rateText(exploreShinyChance(team))+'</b>':'')+(shinyLineageDispatchBonus(team)>0?'<br><b>✦ 闪光血统：</b>'+shinyLineageCount(team)+' 位闪光队员，共 +'+rateText(shinyLineageDispatchBonus(team))+'；派遣失败时闪光队员只扣 1 生命。':'')+'</div>'
      +'<div class="dispatch-logic-note"><b>推荐逻辑可视化：</b>系统会先考虑与任务匹配的派遣技能（稳步、护航体魄、寻宝鼻、任务限定种族技能等），再按你选择的「最低够用 / 最高配置」决定星级。</div>'
    : '请选择 2–3 位伙伴组成派遣队。';

  $('dispatch-missions').innerHTML=DISPATCH_MISSIONS.map((ms,i)=>{
    const levelOk=ranchLevel()>=(ms.minLevel||1),
      eligible=levelOk&&team.length>=ms.minTeam&&team.length<=3&&team.every(m=>canDispatchMonster(m)&&m.star>=ms.minStar),
      success=team.length&&levelOk?Math.round(teamDispatchSuccessChance(team,ms)*100):null,
      state=team.length&&levelOk?teamMissionState(team,ms):null,
      reward=team.length&&levelOk?fmt(teamDispatchReward(team,ms)):'—';
    return '<article class="dispatch-card mission-'+ms.id+' '+(levelOk?'':'mission-locked')+'"><div class="mission-level-banner">任务等级 '+(ms.taskLevel||1)+'</div><h3>'+ms.name+(levelOk?'':' <span class="level-require">牧场 Lv'+ms.minLevel+' 解锁</span>')+'</h3><p>'+ms.desc+'</p>'
      +'<p>要求：'+ms.minTeam+'–3 位 · 每位至少 '+ms.minStar+'★ · 时长 '+Math.round(ms.duration/60)+' 分钟</p>'
      +'<p>队伍成功率：<b class="state-score">'+(success===null?'—':success+'%')+'</b>'+(state?' · 平均属性评分 '+state.score:'')+'</p>'
      +'<p>任务成功归来扣 1 生命；任务失败扣 5 生命。拥有「护航体魄」可减少任务扣血，但最低仍扣 1。</p>'
      +'<p class="shop-price">预计报酬 '+reward+' 灵能</p>'
      +dispatchPossibleReturnsHTML(ms,team)+missionExclusivePreviewHTML(ms)
      +'<button class="secondary auto-team-btn" data-dispatch-auto="'+i+'">系统推荐队伍</button>'
      +'<button class="primary full" data-dispatch-start="'+i+'" '+(!eligible||s.dispatch?'disabled':'')+'>'
      +(s.dispatch?'已有派遣进行中':!levelOk?'牧场 Lv'+ms.minLevel+' 解锁':team.length<ms.minTeam?'队伍人数不足':team.some(m=>m.star<ms.minStar)?'有成员星级不足':'开始小队派遣')
      +'</button></article>';
  }).join('');

  if(activeTeam.length&&mission){
    const remain=Math.max(0,Math.ceil((s.dispatch.end-Date.now())/1000)),ready=remain<=0;
    $('dispatch-active').innerHTML='<div class="dispatch-active-inner" data-mission="'+mission.id+'"><h3>当前派遣队</h3>'
      +dispatchMissionSceneHTML(mission,activeTeam)
      +'<div class="dispatch-team-strip">'+activeTeam.map(m=>'<div class="dispatch-team-mini active-card">'+sprite(m.species,m.tint,m.shiny,m.specialColor)+'<span><span class="dispatch-starline">'+G.stars(m.star)+' · '+m.star+'★</span><b>'+name(m)+' #'+m.id+'</b><small>'+traitInfo(m).name+' · ❤ '+m.life+'/'+m.maxLife+' · 属性 '+dispatchOverallState(m)+'</small>'+dispatchSkillSummaryHTML(m)+'</span></div>').join('')+'</div>'
      +'<p>'+mission.name+' · 出发时成功率 <b>'+Math.round((s.dispatch.successChance||0)*100)+'%</b>'+(s.manualDispatchRepeat?' · <b>固定队伍连发中</b>':'')+'</p>'
      +dispatchPossibleReturnsHTML(mission,activeTeam)+'<div class="dispatch-logic-note"><b>任务限定怪物：</b>当前队伍遇到概率约 '+(missionExclusiveChance(mission,activeTeam)*100).toFixed(1)+'%。</div>'
      +'<p>'+(ready?'<span class="dispatch-ready">已完成，可以领取结果</span>':'<span class="dispatch-going">剩余 '+remain+' 秒</span>')+'</p>'
      +'<button class="primary" data-dispatch-claim '+(ready?'':'disabled')+'>领取结果</button></div>';
  }else{
    $('dispatch-active').innerHTML='<div class="dispatch-active-inner"><h3>当前派遣</h3><p>暂无任务。现在可以组成 2–3 人队伍，不同技能与个性会产生组合效果。</p></div>';
  }
}
function startDispatch(i,fromRepeat=false){const team=dispatchTeam(),ms=DISPATCH_MISSIONS[i];if(!ms)return;if(ranchLevel()<(ms.minLevel||1)){tell('牧场等级不足，需要 Lv'+ms.minLevel+'。');return;}if(team.length<ms.minTeam){tell('这项任务需要至少 '+ms.minTeam+' 位队员。');return;}if(s.dispatch){tell('已经有一支队伍在派遣中了。');return;}if(team.length>3){tell('派遣队最多 3 位。');return;}if(team.some(m=>!canDispatchMonster(m))){tell('队伍里有当前不能派遣的怪物。');return;}if(team.some(m=>m.star<ms.minStar)){const low=team.filter(m=>m.star<ms.minStar).map(name).join('、');tell('「'+ms.name+'」要求每位成员至少 '+ms.minStar+'★；'+low+' 星级不足。1★ 去「牧场巡查」，2★ 去「林地采集」。');return;}if(s.manualDispatchRepeat&&!fromRepeat)captureManualDispatch(ms);const tm=teamDispatchMods(team,ms),now=Date.now();s.dispatch={monsterIds:team.map(m=>m.id),mission:ms.id,start:now,end:now+Math.round((s.tutorialActive&&s.tutorialStep===6?10:ms.duration*tm.duration))*1000,successChance:teamDispatchSuccessChance(team,ms),outcome:prepareTeamDispatchOutcome(team,ms),timeCutUsed:false};s.revision++;dirty=true;render();save();playSfx('dispatchStart');tell(team.map(name).join('、')+' 组成小队前往「'+ms.name+'」，成功率 '+Math.round(s.dispatch.successChance*100)+'%。');}
function showPendingSkillDrop(){const drop=s.pendingSkillDrop;if(!drop)return;const m=s.monsters.find(x=>x.id===drop.monsterId);const sk=extraSkill(drop.skillId);if(!m||!sk){s.pendingSkillDrop=null;save();return;}ensureMonsterSystemsMonster(m);$('skill-drop-info').innerHTML='<div class="skill-drop-card"><b>'+name(m)+' 在探索中发现「'+sk.name+' Lv'+drop.lv+'」</b><span>'+sk.desc+'</span></div><p>要不要替换现有技能？</p>';$('skill-drop-actions').innerHTML=getMutableSkillSlots(m).map(slot=>'<button class="secondary" data-accept-skill="'+slot.idx+'">替换 '+slot.label+(m.extraSkills[slot.idx]?'（'+extraSkill(m.extraSkills[slot.idx]).name+' Lv'+extraLv(m,slot.idx)+'）':'（空位）')+'</button>').join('')+'<button class="secondary" data-discard-skill>不要这个技能</button>';$('skill-drop-dialog').showModal();}
function dispatchReturnSpecialColorChance(mission){
  const lv=Math.max(1,Math.min(8,Number(mission?.taskLevel)||1));
  return lv>=8?.10:(.01+lv*.01); // Lv1 2% ... Lv7 8%, final map 10%
}
function applyDispatchReturnColor(m,mission){
  m.dexColorEligible=true;
  if(Math.random()<dispatchReturnSpecialColorChance(mission)){
    m.specialColor=Math.floor(Math.random()*SPECIAL_COLORS.length);
    return true;
  }
  return false;
}
function createMissionExclusive(speciesId,mission){
  const star=rollMissionReturnStar(mission,Math.random);
  const m=G.createMonster(s.nextId++,speciesId,star,[1,1,1,1,1],[]);
  ensureMonsterSystemsMonster(m,Date.now());
  m.baseLife=5+Math.floor(Math.random()*6);
  m.lifePotionUsed=false;m.lifeSkillApplied=0;m.life=m.baseLife;m.maxLife=m.baseLife;
  m.gender=Math.random()<.5?'公':'母';
  m.trait=TRAITS[Math.floor(Math.random()*TRAITS.length)].id;
  m.createdAt=Date.now();
  m.skillLv=Math.max(1,Math.min(10,star+Math.floor(Math.random()*3)));
  ensureSkillSlots(m);refreshLifeCapacity(m,true);applyDispatchReturnColor(m,mission);
  s.monsters.push(m);markDex(s,m,false);discoverMonsterSkills(m,s);archiveMonster(m,s);
  recordActivity('birth',{key:'mission-exclusive-'+m.id,time:Date.now(),monster:{id:m.id,species:m.species,star:m.star,shiny:false,nickname:'',life:m.life,maxLife:m.maxLife,tint:m.tint,specialColor:m.specialColor??null},source:'派遣加入 · '+(mission?.name||'任务')+' · 限定怪'});
  return m;
}

function createMissionOrdinary(speciesId,mission){
  const star=rollMissionReturnStar(mission,Math.random);
  const m=G.createMonster(s.nextId++,speciesId,star,[1,1,1,1,1],[]);
  ensureMonsterSystemsMonster(m,Date.now());
  m.baseLife=5+Math.floor(Math.random()*6);
  m.lifePotionUsed=false;m.lifeSkillApplied=0;m.life=m.baseLife;m.maxLife=m.baseLife;
  m.gender=Math.random()<.5?'公':'母';
  m.trait=TRAITS[Math.floor(Math.random()*TRAITS.length)].id;
  m.createdAt=Date.now();
  m.skillLv=Math.max(1,Math.min(10,star+Math.floor(Math.random()*2)));
  ensureSkillSlots(m);refreshLifeCapacity(m,true);applyDispatchReturnColor(m,mission);
  s.monsters.push(m);markDex(s,m,false);discoverMonsterSkills(m,s);archiveMonster(m,s);
  recordActivity('birth',{key:'mission-ordinary-'+m.id,time:Date.now(),monster:{id:m.id,species:m.species,star:m.star,shiny:false,nickname:'',life:m.life,maxLife:m.maxLife,tint:m.tint,specialColor:m.specialColor??null},source:'派遣加入 · '+(mission?.name||'任务')+' · 普通怪'});
  return m;
}
function createExplorationShiny(mission){
  const shinyStar=rollMissionReturnStar(mission,Math.random);
  const m=G.createMonster(s.nextId++,Math.floor(Math.random()*G.SPECIES.length),shinyStar,[1,1,1,1,1],[]);
  ensureMonsterSystemsMonster(m,Date.now());
  m.baseLife=5+Math.floor(Math.random()*6);m.lifePotionUsed=false;m.lifeSkillApplied=0;m.life=m.baseLife;m.maxLife=m.baseLife;
  m.gender=Math.random()<.5?'公':'母';m.shiny=true;m.locked=true;m.shinyAutoLockDone=true;m.trait=TRAITS[Math.floor(Math.random()*TRAITS.length)].id;
  ensureSkillSlots(m);refreshLifeCapacity(m,true);applyDispatchReturnColor(m,mission);m.createdAt=Date.now();s.monsters.push(m);markDex(s,m,false);discoverMonsterSkills(m,s);archiveMonster(m,s);
  recordActivity('birth',{key:'explore-shiny-'+m.id,time:Date.now(),monster:{id:m.id,species:m.species,star:m.star,shiny:true,nickname:m.nickname||'',life:m.life,maxLife:m.maxLife,tint:m.tint,specialColor:m.specialColor??null},source:'探索邂逅'});showShinyPopup(m,'探索邂逅');
  return m;
}

function teamRescueChance(team,target){
  let chance=0;
  for(const m of team){
    if(!m||m.id===target?.id)continue;
    chance+=totalEffectiveSkillLevel(m,'rescue_instinct')*.02;
  }
  return Math.min(.60,chance);
}
function protectedMissionLoss(team,m,baseLoss){
  let loss=baseLoss,rescuer=null;
  if(loss>0&&(m.life||0)<=loss){
    const chance=teamRescueChance(team,m);
    if(chance>0&&Math.random()<chance){
      loss=Math.max(0,loss-1);
      rescuer=team.find(x=>x.id!==m.id&&totalEffectiveSkillLevel(x,'rescue_instinct')>0)||null;
    }
  }
  return {loss,rescuer};
}
function claimDispatch(){
  const team=dispatchedMonsters(),ms=dispatchMission();
  if(!s.dispatch){tell('目前没有正在结算的派遣。');return;}
  if(!team.length||!ms){console.error('Dispatch claim state invalid',s.dispatch);tell('派遣资料异常，已保留任务状态。请重新打开派遣页面再领取。');dirty=true;render();return;}
  if(s.dispatch.end>Date.now()){tell('派遣还没结束。');return;}
  const outcome=s.dispatch.outcome||prepareTeamDispatchOutcome(team,ms);
  let msg='',lifeNotes=[];
  if(outcome.failed){
    for(const m of [...team]){
      const baseLoss=missionLifeLoss(m,true,ms),n=name(m),prot=protectedMissionLoss(team,m,baseLoss),loss=prot.loss;
      const died=loseLife(s,m,loss,'派遣失败后扣除 '+loss+' 点生命',Date.now());
      lifeNotes.push(n+' -'+loss+'生命'+(prot.rescuer?'（'+name(prot.rescuer)+' 的救援本能挡下 1 点）':'')+(died?'（离世）':''));
      if(!died)m.bond=Math.max(0,m.bond-4);
    }
    msg='派遣失败。'+lifeNotes.join('、')+'。';
  }else{
    s.energy+=outcome.reward;
    for(const m of [...team]){
      const baseLoss=missionLifeLoss(m,false,ms),n=name(m),prot=protectedMissionLoss(team,m,baseLoss),loss=prot.loss;
      const died=loseLife(s,m,loss,'派遣成功归来后扣除 '+loss+' 点生命',Date.now());
      lifeNotes.push(n+' -'+loss+'生命'+(prot.rescuer?'（'+name(prot.rescuer)+' 的救援本能挡下 1 点）':'')+(died?'（离世）':''));
      if(!died)m.bond=Math.min(100,m.bond+6+traitMods(m).bond);
    }
    addItem(outcome.item,'派遣 · '+ms.name);
    if(outcome.foundSkill){
      const survivors=team.filter(m=>s.monsters.some(x=>x.id===m.id));
      const learner=survivors[Math.floor(Math.random()*survivors.length)];
      if(learner)s.pendingSkillDrop={monsterId:learner.id,skillId:outcome.foundSkill.id,lv:outcome.foundSkill.lv};
    }
    let shinyFound=null;
    if(outcome.shinyFind)shinyFound=createExplorationShiny(ms);
    let exclusiveFound=null,ordinaryFound=null;
    if(Number.isInteger(outcome.exclusiveSpecies)&&s.monsters.length<s.capacity)exclusiveFound=createMissionExclusive(outcome.exclusiveSpecies,ms);
    else if(Number.isInteger(outcome.ordinarySpecies)&&s.monsters.length<s.capacity)ordinaryFound=createMissionOrdinary(outcome.ordinarySpecies,ms);
    msg='任务成功，获得 '+fmt(outcome.reward)+' 灵能。'+lifeNotes.join('、')
      +(outcome.item?'，并获得 '+itemLabel(outcome.item):'')
      +(outcome.foundSkill?'，还发现了一个极稀有技能！':'')
      +(shinyFound?' ✦ 星迹追寻触发：发现了闪光 '+name(shinyFound)+'（❤ '+shinyFound.life+'/'+shinyFound.maxLife+'）！':'')
      +(exclusiveFound?' ✦ 任务限定邂逅：'+name(exclusiveFound)+' '+G.stars(exclusiveFound.star)+(Number.isInteger(exclusiveFound.specialColor)?' · '+colorName(exclusiveFound):'')+' · ❤ '+exclusiveFound.life+'/'+exclusiveFound.maxLife+' 加入牧场！':'')
      +(ordinaryFound?' ✦ 途中结识：'+name(ordinaryFound)+' '+G.stars(ordinaryFound.star)+(Number.isInteger(ordinaryFound.specialColor)?' · '+colorName(ordinaryFound):'')+' · ❤ '+ordinaryFound.life+'/'+ordinaryFound.maxLife+' 加入牧场！':'')
      +((Number.isInteger(outcome.exclusiveSpecies)||Number.isInteger(outcome.ordinarySpecies))&&!exclusiveFound&&!ordinaryFound&&s.monsters.length>=s.capacity?' ✦ 遇到了怪物，但怪物盒已满。':'')+'。';
  }
  gainRanchXp(ranchXpForDispatch(ms,!outcome.failed),outcome.failed?'派遣失败也获得少量经验。':'完成派遣获得经验。');recordActivity('dispatch',{
    mission:ms.name,
    success:!outcome.failed,
    team:team.map(m=>name(m)),teamIds:team.map(m=>m.id),
    energy:outcome.failed?0:(outcome.reward||0),
    item:outcome.item?itemLabel(outcome.item):'',
    skill:outcome.foundSkill?(extraSkill(outcome.foundSkill.id)?.name||'未知技能'):'',
    shiny:(typeof shinyFound!=='undefined'&&shinyFound)?name(shinyFound):'',exclusive:(typeof exclusiveFound!=='undefined'&&exclusiveFound)?name(exclusiveFound):'',ordinary:(typeof ordinaryFound!=='undefined'&&ordinaryFound)?name(ordinaryFound):'',
    life:lifeNotes.join('、')
  });
  s.dispatch=null;if(s.manualDispatchRepeat){dispatchTeamSelected=(s.manualDispatchTeamIds||[]).filter(id=>s.monsters.some(m=>m.id===id));dispatchSelected=dispatchTeamSelected[0]||null;}else{dispatchTeamSelected=[];dispatchSelected=null;}s.revision++;dirty=true;render();save();playSfx(outcome.failed?'dispatchFail':'dispatchSuccess');if(typeof shinyFound!=='undefined'&&shinyFound)setTimeout(()=>playSfx('shiny'),260);tell(msg);if(s.pendingSkillDrop)setTimeout(showPendingSkillDrop,80);
}
function renderTraitDex(){
  const box=$('trait-dex');if(!box)return;
  ensureFamilyArchive(s);
  const records=[...s.monsters,...Object.values(s.familyArchive||{})];
  const found=new Set(records.map(m=>m?.trait).filter(Boolean));
  $('trait-dex-count').textContent=found.size+' / '+TRAITS.length;
  box.innerHTML=TRAITS.map(t=>found.has(t.id)?'<article class="trait-dex-card"><h3>'+t.name+'</h3><p>'+t.desc+'</p></article>':'<article class="trait-dex-card locked"><h3>？？？</h3><p>获得拥有这种个性的怪物后解锁。</p></article>').join('');
}
function speciesSkillLevelText(speciesIndex,lv){
  return skillEffect({species:speciesIndex,skillLv:Math.max(1,Math.min(10,lv)),star:5});
}
function speciesSkillKnown(speciesIndex){
  ensureDex(s);
  return !!s.dex?.species?.[speciesIndex]
    ||(s.monsters||[]).some(m=>m.species===speciesIndex)
    ||(s.memorial||[]).some(m=>m.species===speciesIndex)
    ||Object.values(s.familyArchive||{}).some(m=>m?.species===speciesIndex);
}
function speciesSkillOwnedLevel(speciesIndex){
  let lv=0;
  for(const m of (s.monsters||[]))if(m.species===speciesIndex)lv=Math.max(lv,skillNum(m));
  return lv;
}
function speciesSkillCardHTML(sp,index){
  if(!speciesSkillKnown(index)){
    return '<article class="skill-library-card species-skill locked"><h3>？？？ <small>· 未发现种族技能</small></h3><p>获得对应物种后解锁种族技能资料。</p><div class="skill-level-table">'+Array.from({length:10},(_,i)=>'<span><b>Lv'+(i+1)+'</b><br>？？？</span>').join('')+'</div></article>';
  }
  const ownedLv=speciesSkillOwnedLevel(index),exclusive=!!sp.exclusiveMission;
  return '<article class="skill-library-card species-skill '+(exclusive?'exclusive-species':'')+'">'
    +'<div class="species-skill-head">'+sprite(index,0,false,null)+'<div><h3>'+escapeActivity(sp.skill)+'</h3><div class="species-meta">'+escapeActivity(sp.name)+' · '+escapeActivity(sp.element||'')+(exclusive?' · 限定任务：'+escapeActivity(missionName(sp.exclusiveMission)):' · 基础物种')+'</div></div></div>'
    +'<p>Lv1：'+escapeActivity(speciesSkillLevelText(index,1))+'</p>'
    +(ownedLv?'<div class="skill-library-current">当前持有最高 Lv'+ownedLv+'：'+escapeActivity(speciesSkillLevelText(index,ownedLv))+'</div>':'<div class="skill-library-current">已解锁，但当前怪物盒没有这个物种</div>')
    +'<div class="skill-level-table">'+Array.from({length:10},(_,i)=>'<span><b>Lv'+(i+1)+'</b><br>'+escapeActivity(speciesSkillLevelText(index,i+1))+'</span>').join('')+'</div></article>';
}
function renderSkillLibrary(filter=skillLibraryFilter||'all'){
  skillLibraryFilter=filter||'all';
  if(typeof ensureSkillDex==='function')ensureSkillDex(s);
  ensureDex(s);

  const currentOwned=new Map();
  for(const mon of s.monsters){
    ensureMonsterSystemsMonster(mon);
    for(const ent of effectiveExtraSkillEntries(mon)){
      if(ent.id)currentOwned.set(ent.id,Math.max(currentOwned.get(ent.id)||0,ent.lv));
    }
  }

  const hasDex=s.skillDex&&s.skillDex.extra;
  const knownExtra=hasDex?EXTRA_SKILLS.filter(sk=>!!s.skillDex.extra[sk.id]).length:currentOwned.size;
  const buffTotal=EXTRA_SKILLS.filter(sk=>sk.tone==='buff').length;
  const debuffTotal=EXTRA_SKILLS.filter(sk=>sk.tone==='debuff').length;
  const knownSpecies=G.SPECIES.filter((_,i)=>speciesSkillKnown(i)).length;

  document.querySelectorAll('[data-skill-filter]').forEach(btn=>{
    const f=btn.dataset.skillFilter;
    btn.classList.toggle('active',f===skillLibraryFilter);
    if(f==='all')btn.textContent='全部 · '+(EXTRA_SKILLS.length+G.SPECIES.length);
    else if(f==='buff')btn.textContent='Buff · '+buffTotal;
    else if(f==='debuff')btn.textContent='Debuff · '+debuffTotal;
    else if(f==='species')btn.textContent='种族技能 · '+G.SPECIES.length;
  });

  const extraCards=skillLibraryFilter==='species'?'':EXTRA_SKILLS
    .filter(sk=>skillLibraryFilter==='all'||sk.tone===skillLibraryFilter)
    .map(sk=>{
      const unlocked=hasDex?!!s.skillDex.extra[sk.id]:currentOwned.has(sk.id);
      if(!unlocked)return '<article class="skill-library-card locked"><h3>？？？ <small>· 未发现</small></h3><p>获得过这个技能后才会解锁资料。</p><div class="skill-level-table">'+Array.from({length:10},(_,i)=>'<span><b>Lv'+(i+1)+'</b><br>？？？</span>').join('')+'</div></article>';
      const ownedLv=currentOwned.get(sk.id)||0;
      return '<article class="skill-library-card '+sk.tone+(ULTRA_RARE_SKILLS.includes(sk.id)?' rare-skill':'')+'"><h3>'+escapeActivity(sk.name)+' <small>· '+(sk.tone==='buff'?'Buff':'Debuff')+' · '+escapeActivity(sk.group||'技能')+'</small></h3><p>Lv1：'+escapeActivity(extraSkillDesc(sk.id,1))+'</p>'+(ownedLv?'<div class="skill-library-current">当前持有最高 Lv'+ownedLv+'：'+escapeActivity(extraSkillDesc(sk.id,ownedLv))+'</div>':'<div class="skill-library-current">已解锁，但当前没有怪物持有</div>')+'<div class="skill-level-table">'+Array.from({length:10},(_,i)=>'<span><b>Lv'+(i+1)+'</b><br>'+escapeActivity(extraSkillDesc(sk.id,i+1))+'</span>').join('')+'</div></article>';
    }).join('');

  const speciesCards=(skillLibraryFilter==='all'||skillLibraryFilter==='species')
    ?G.SPECIES.map((sp,i)=>speciesSkillCardHTML(sp,i)).join('')
    :'';

  let html='<div class="dex-note" style="grid-column:1/-1">额外技能已发现 <b>'+knownExtra+' / '+EXTRA_SKILLS.length+'</b> · 种族技能已发现 <b>'+knownSpecies+' / '+G.SPECIES.length+'</b>。家族技能使用普通 Buff / Debuff 能力池；种族技能属于各物种自身。</div>';
  if(extraCards)html+='<div class="skill-dex-section-title">普通技能 / 家族技能能力池</div>'+extraCards;
  if(speciesCards)html+='<div class="skill-dex-section-title">种族技能 · 基础怪 + 派遣限定怪</div>'+speciesCards;
  $('skill-library').innerHTML=html;
  renderTraitDex();
}
function getMutableSkillSlots(m){
  ensureMonsterSystemsMonster(m);
  const slots=[{idx:0,label:'技能2（普通）'},{idx:1,label:'技能3（普通）'}];
  if(m.shiny)slots.push({idx:3,label:'技能5（闪光专属）'});
  return slots;
}
function getLevelableSkillSlots(m){
  ensureMonsterSystemsMonster(m);
  const slots=[{idx:0,label:'技能2（普通）'},{idx:1,label:'技能3（普通）'}];
  // v188: family skill is bloodline-only progression and can never be raised by skill potion.
  if(m.shiny)slots.push({idx:3,label:'技能5（闪光专属）'});
  return slots;
}
function monsterSkillNames(m){
  if(!m)return [];
  ensureMonsterSystemsMonster(m);
  const names=[G.SPECIES[m.species]?.skill];
  for(const idx of [0,1,3]){
    if(idx===3&&!m.shiny)continue;
    const id=m.extraSkills?.[idx],sk=id?extraSkill(id):null;
    if(sk?.name)names.push(sk.name);
  }
  for(const p of familySkillParts(m)){
    const nm=extraSkill(p.id)?.name;
    if(nm)names.push(nm);
  }
  return [...new Set(names.filter(Boolean))];
}
function monsterHasSkillName(m,skillName){return !skillName||monsterSkillNames(m).includes(skillName);}
function skillFilterOptionsHTML(pool,selected=''){
  const names=[...new Set((pool||[]).flatMap(monsterSkillNames))].sort((a,b)=>a.localeCompare(b,'zh-Hans-CN'));
  if(selected&&!names.includes(selected))names.unshift(selected);
  return '<option value="">全部技能</option>'+names.map(n=>'<option value="'+escapeActivity(n)+'" '+(n===selected?'selected':'')+'>'+escapeActivity(n)+'</option>').join('');
}
function starFilterOptionsHTML(selected=''){
  return '<option value="" '+(!selected?'selected':'')+'>全部星级</option>'+[1,2,3,4,5].map(n=>'<option value="'+n+'" '+(String(n)===String(selected)?'selected':'')+'>'+G.stars(n)+'</option>').join('');
}
function speciesFilterOptionsHTML(selected=''){
  return '<option value="" '+(!selected?'selected':'')+'>全部种族</option>'+G.SPECIES.map((sp,i)=>'<option value="'+i+'" '+(String(i)===String(selected)?'selected':'')+'>'+escapeActivity(sp.name)+'</option>').join('');
}
function familyFilterOptionsHTML(pool=[],selected=''){
  const names=[...new Set((pool||[]).map(m=>(m?.familyName||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'zh-Hans-CN'));
  return '<option value="" '+(!selected?'selected':'')+'>全部家族</option><option value="__none__" '+(selected==='__none__'?'selected':'')+'>无家族</option>'+names.map(n=>'<option value="'+escapeActivity(n)+'" '+(n===selected?'selected':'')+'>'+escapeActivity(n)+'</option>').join('');
}
function matchesFamily(m,family){if(!family)return true;const f=(m?.familyName||'').trim();return family==='__none__'?!f:f===family;}
function matchesStarSpecies(m,star,species){
  if(star&&m.star!==Number(star))return false;
  if(species!==''&&species!=null&&m.species!==Number(species))return false;
  return true;
}
function bagSortedMonsters(){
  let list=[...s.monsters];for(const m of list)ensureMonsterSystemsMonster(m);
  const mode=bagTargetSort||'star-desc',q=bagTargetSearch||'',skill=bagTargetSkill||'',star=bagTargetStar||'',species=bagTargetSpecies??'',family=bagTargetFamily||'';
  if(q)list=list.filter(m=>monsterMatchesName(m,q));
  if(skill)list=list.filter(m=>monsterHasSkillName(m,skill));
  list=list.filter(m=>matchesStarSpecies(m,star,species)&&matchesFamily(m,family));
  list.sort((a,b)=>{if(mode==='star-asc')return a.star-b.star||Number(a.shiny)-Number(b.shiny)||a.id-b.id;if(mode==='life-desc')return b.life-a.life||b.star-a.star||b.id-a.id;if(mode==='life-asc')return a.life-b.life||b.star-a.star||b.id-a.id;if(mode==='skill-desc')return rosterMaxSkillLv(b)-rosterMaxSkillLv(a)||b.star-a.star||b.id-a.id;if(mode==='favorite')return Number(b.favorite)-Number(a.favorite)||b.star-a.star||Number(b.shiny)-Number(a.shiny)||b.id-a.id;if(mode==='joined-asc')return (a.createdAt||0)-(b.createdAt||0)||a.id-b.id;if(mode==='joined-desc')return (b.createdAt||0)-(a.createdAt||0)||b.id-a.id;if(mode==='species-asc')return (G.SPECIES[a.species]?.name||'').localeCompare(G.SPECIES[b.species]?.name||'','zh-Hans-CN')||b.star-a.star||b.id-a.id;return b.star-a.star||Number(b.shiny)-Number(a.shiny)||b.id-a.id;});
  return list;
}
function bagTargetButtonHTML(m){if(!m)return '<span class="parent-select-empty">选择一只怪物</span>';ensureMonsterSystemsMonster(m);return sprite(m.species,m.tint,m.shiny,m.specialColor)+'<span class="parent-select-info"><strong>'+G.stars(m.star)+' '+name(m)+(m.shiny?' · 闪光':'')+(m.favorite?' · 最爱':'')+'</strong><small>'+m.gender+' · '+colorName(m)+' · '+m.life+' / '+m.maxLife+' 生命 · 种族 Lv'+skillNum(m)+'</small></span>';}
function renderBagTargetPicker(){
  const p=$('bag-target-picker');if(!p)return;const cur=Number($('shop-target')?.value)||null;const all=[...s.monsters];
  p.innerHTML='<div class="bag-picker-toolbar">'+
    '<input data-bag-search type="search" placeholder="名字 / 昵称 / #编号" value="'+escapeActivity(bagTargetSearch)+'">'+
    '<select class="bag-picker-sort" data-bag-sort><option value="star-desc" '+(bagTargetSort==='star-desc'?'selected':'')+'>星级 · 高 → 低</option><option value="star-asc" '+(bagTargetSort==='star-asc'?'selected':'')+'>星级 · 低 → 高</option><option value="life-desc" '+(bagTargetSort==='life-desc'?'selected':'')+'>生命 · 高 → 低</option><option value="life-asc" '+(bagTargetSort==='life-asc'?'selected':'')+'>生命 · 低 → 高</option><option value="skill-desc" '+(bagTargetSort==='skill-desc'?'selected':'')+'>技能等级 · 高 → 低</option><option value="favorite" '+(bagTargetSort==='favorite'?'selected':'')+'>我的最爱优先</option><option value="joined-desc" '+(bagTargetSort==='joined-desc'?'selected':'')+'>加入时间 · 新 → 旧</option><option value="joined-asc" '+(bagTargetSort==='joined-asc'?'selected':'')+'>加入时间 · 旧 → 新</option><option value="species-asc" '+(bagTargetSort==='species-asc'?'selected':'')+'>种族 · A → Z</option></select>'+
    '<select class="bag-picker-skill" data-bag-skill>'+skillFilterOptionsHTML(all,bagTargetSkill)+'</select>'+
    '<select class="bag-picker-star" data-bag-star>'+starFilterOptionsHTML(bagTargetStar)+'</select>'+
    '<select class="bag-picker-species" data-bag-species>'+speciesFilterOptionsHTML(bagTargetSpecies)+'</select>'+
    '<select class="bag-picker-family" data-bag-family>'+familyFilterOptionsHTML(all,bagTargetFamily)+'</select>'+
    '</div><div class="bag-target-grid">'+bagSortedMonsters().map(m=>'<button type="button" class="bag-target-choice '+(m.id===cur?'selected':'')+'" data-bag-target="'+m.id+'">'+sprite(m.species,m.tint,m.shiny,m.specialColor)+'<span><strong>'+G.stars(m.star)+' '+name(m)+(m.shiny?' · 闪光':'')+(m.favorite?' · 最爱':'')+'</strong><small>'+G.SPECIES[m.species].name+' · '+m.gender+' · '+colorName(m)+' · '+m.life+' / '+m.maxLife+' 生命<br>'+monsterSkillSummary(m)+'</small></span></button>').join('')+'</div>';
}
function closeBagTargetPicker(){const p=$('bag-target-picker'),b=$('bag-target-btn');if(p)p.hidden=true;if(b)b.setAttribute('aria-expanded','false');}
function toggleBagTargetPicker(){const p=$('bag-target-picker'),b=$('bag-target-btn');if(!p||!b)return;const opening=p.hidden;closeBagTargetPicker();if(opening){renderBagTargetPicker();p.hidden=false;b.setAttribute('aria-expanded','true');}}
function chooseBagTarget(id){
  const sel=$('shop-target');if(!sel)return;
  const target=s.monsters.find(m=>m.id===Number(id));
  if(!target)return;
  if(![...sel.options].some(o=>Number(o.value)===target.id)){
    const o=document.createElement('option');o.value=target.id;o.textContent=G.stars(target.star)+' '+name(target)+' · '+target.gender+' · '+colorName(target);sel.appendChild(o);
  }
  sel.value=String(target.id);
  closeBagTargetPicker();
  renderShopTargetInfo();renderBag();
  const btn=$('bag-target-btn');if(btn)btn.innerHTML=bagTargetButtonHTML(target);
}
function bindBagTargetControls(){
  const btn=$('bag-target-btn'),picker=$('bag-target-picker');
  if(btn&&!btn.dataset.bound){btn.dataset.bound='1';btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();toggleBagTargetPicker();});}
  if(picker&&!picker.dataset.bound){
    picker.dataset.bound='1';
    picker.addEventListener('click',e=>{const choice=e.target.closest?.('[data-bag-target]');if(!choice)return;e.preventDefault();e.stopPropagation();chooseBagTarget(Number(choice.dataset.bagTarget));});
    picker.addEventListener('input',e=>{const inp=e.target.closest?.('[data-bag-search]');if(!inp)return;bagTargetSearch=inp.value;renderBagTargetPicker();const next=picker.querySelector('[data-bag-search]');if(next){next.focus();next.setSelectionRange(next.value.length,next.value.length);}});
    picker.addEventListener('change',e=>{const sort=e.target.closest?.('[data-bag-sort]'),skill=e.target.closest?.('[data-bag-skill]'),star=e.target.closest?.('[data-bag-star]'),species=e.target.closest?.('[data-bag-species]'),family=e.target.closest?.('[data-bag-family]');if(sort)bagTargetSort=sort.value;if(skill)bagTargetSkill=skill.value;if(star)bagTargetStar=star.value;if(species)bagTargetSpecies=species.value;if(family)bagTargetFamily=family.value;if(sort||skill||star||species||family)renderBagTargetPicker();});
  }
  const nativeSel=$('shop-target');
  if(nativeSel&&!nativeSel.dataset.bound){nativeSel.dataset.bound='1';nativeSel.addEventListener('change',()=>{closeBagTargetPicker();renderShopTargetInfo();renderBag();const m=shopMonster();if($('bag-target-btn'))$('bag-target-btn').innerHTML=bagTargetButtonHTML(m);});}
}



function renderShopOwnedCounts(){
  const set=(id,txt)=>{const el=$(id);if(el)el.textContent=txt;};
  set('shop-owned-capacity','当前：'+s.monsters.length+' / '+s.capacity+' ｜ 扩建后容量：'+Math.min(500,s.capacity+10));
  set('shop-owned-farm','当前：'+s.farmSlots+' 个生产位 ｜ 扩建后：'+(s.farmSlots+2)+' 个');
  set('capacity-price','价格：'+fmt(expandCost())+' 灵能');
  set('farm-expand-price','价格：'+fmt(farmExpandCost())+' 灵能');
  set('shop-owned-skill','背包持有：'+(s.items?.skill||0)+' 瓶');
  set('shop-owned-reroll','背包持有：'+(s.items?.reroll||0)+' 瓶');
  set('shop-owned-life','背包持有：'+(s.items?.life||0)+' 瓶');
  set('shop-owned-timecut','背包持有：'+(s.items?.timeCut||0)+' 瓶');
  set('shop-owned-timeinstant','背包持有：'+(s.items?.timeInstant||0)+' 瓶');
  set('shop-owned-shiny','背包持有：'+(s.items?.shiny||0)+' 瓶');
  const colors=Array.isArray(s.items?.colors)?s.items.colors:[0,0,0,0,0,0];
  set('shop-owned-colors','背包颜色药水：'+colors.reduce((a,b)=>a+(Number(b)||0),0)+' 瓶（'+G.COLORS.map((n,i)=>n+' '+(colors[i]||0)).join(' · ')+'）');

  const starterOwned=$('shop-owned-starters');
  if(starterOwned){
    const males=(s.monsters||[]).filter(m=>m.species===0&&m.star===1&&m.gender==='公').length;
    const females=(s.monsters||[]).filter(m=>m.species===0&&m.star===1&&m.gender==='母').length;
    starterOwned.textContent='当前 1★ 苗芽团：公 '+males+' · 母 '+females+' · 怪物盒 '+s.monsters.length+'/'+s.capacity;
  }
}
function renderColorPotionShop(){
  const box=$('color-potions');
  if(!box)return;
  const swatches=['#d9c27c','#8fd4b0','#d56e6e','#78a6df','#9b82d0','#e0bd54'];
  box.innerHTML=G.COLORS.map((name,i)=>
    '<div class="color-potion-buy-row"><button type="button" class="secondary color-potion" data-buy-color="'+i+'" data-buy-color-qty="1"><i style="background:'+swatches[i]+'"></i><span>'+name+' ×1</span></button><button type="button" class="secondary color-potion bulk" data-buy-color="'+i+'" data-buy-color-qty="10"><span>×10</span></button></div>'
  ).join('');
}
function renderShopTarget(){bindBagTargetControls();const sel=$('shop-target');if(!sel)return;const old=Number(sel.value)||selected;const list=bagSortedMonsters();sel.innerHTML=list.length?list.map(m=>'<option value="'+m.id+'">'+G.stars(m.star)+' '+name(m)+' · '+m.gender+' · '+colorName(m)+'</option>').join(''):'<option value="">没有可用怪物</option>';if(list.some(m=>m.id===old))sel.value=old;else if(list[0])sel.value=list[0].id;const chosen=shopMonster();const btn=$('bag-target-btn');if(btn)btn.innerHTML=bagTargetButtonHTML(chosen);renderShopTargetInfo();renderBag();renderBagTargetPicker();}
function shopMonster(){const id=Number($('shop-target')?.value);return s.monsters.find(m=>m.id===id)||null;}
function renderShopTargetInfo(){
  const box=$('shop-target-info');if(!box)return;
  const m=shopMonster();if(m)ensureMonsterSystemsMonster(m);
  box.innerHTML=m
    ? name(m)+genderBadge(m)+shinyBadge(m)+favoriteBadge(m)+traitBadge(m)+autoUseBadge(m)+lifeBadge(m)
      +(m.locked?' <span class="mission-lock">已锁定</span>':'')
      +' · '+colorName(m)
      +(m.starBoost?' · 升星药水已准备 +'+Math.round(m.starBoost*100)+'%':'')+(m.shinyBoost?' · 闪光药水长期 +'+Math.round(m.shinyBoost*100)+'%':'')
      +'<div class="skill-mini">'+monsterSkillSummary(m)+'</div>'
    :'请选择一只怪物。';
}

function monsterColorStatus(m,kind,index){
  if(!m)return {current:false,seen:false,label:'未选择怪物'};
  ensureMonsterSystemsMonster(m);
  if(!Array.isArray(m.colorHistory))m.colorHistory=[];
  const key=(kind==='special'?'s:':'n:')+index;
  const current=kind==='special'
    ? Number.isInteger(m.specialColor)&&m.specialColor===index
    : !Number.isInteger(m.specialColor)&&Number(m.tint)===index;
  const seen=current||m.colorHistory.includes(key);
  return {current,seen,label:current?'当前颜色':seen?'曾拥有':'未拥有'};
}
function rememberMonsterColor(m,kind,index){
  if(!m)return;
  if(!Array.isArray(m.colorHistory))m.colorHistory=[];
  const key=(kind==='special'?'s:':'n:')+index;
  if(!m.colorHistory.includes(key))m.colorHistory.push(key);
}

function monsterIvSummary(m){
  if(!m)return '个体值：—';
  ensureMonsterSystemsMonster(m);
  const g=Array.isArray(m.genes)?m.genes:[1,1,1,1,1];
  const v=g.map(x=>Math.round((Number(x)||1)*100));
  return '个体值：HP '+v[0]+' · 攻 '+v[1]+' · 防 '+v[2]+' · 速 '+v[3]+' · 运 '+v[4];
}
function rerollTargetSummaryHTML(m){
  if(!m)return '';
  ensureMonsterSystemsMonster(m);
  return '<div class="reroll-target-summary"><b>'+escapeActivity(name(m))+' '+G.stars(m.star)+'</b><span>❤ 当前 '+m.life+' / '+m.maxLife+' · 天生 HP '+m.baseLife+'</span><small>'+escapeActivity(monsterIvSummary(m))+'</small></div>';
}
function renderBag(){
  const box=$('bag-items');if(!box)return;
  const target=shopMonster();if(target)ensureMonsterSystemsMonster(target);
  $('bag-summary').textContent=target?'当前准备对 '+name(target)+' 使用怪物类道具；时间药水作用于当前派遣。':'怪物类道具先选目标；时间药水直接作用于当前派遣。';
  const rerollButtons=target?getMutableSkillSlots(target).map(slot=>{
    const id=target.extraSkills?.[slot.idx],sk=id?extraSkill(id):null;
    const current=sk?(sk.name+' Lv'+extraLv(target,slot.idx)):'空技能';
    const used=(target.extraSkills||[]).filter((x,i)=>i!==slot.idx&&x);
    const eligible=[...ordinarySkillPool().map(x=>x.id),...ULTRA_RARE_SKILLS].filter((x,i,a)=>x&&!used.includes(x)&&a.indexOf(x)===i);
    const options=eligible.map(sid=>{const ent=extraSkill(sid);return '<option value="'+escapeActivity(sid)+'" '+(sid===id?'selected':'')+'>'+(ULTRA_RARE_SKILLS.includes(sid)?'✦ ':'')+escapeActivity(ent?.name||sid)+'</option>';}).join('');
    return '<div class="reroll-slot-block"><button class="secondary reroll-skill-btn" data-use-reroll="'+slot.idx+'" '+(s.items.reroll?'':'disabled')+'><b>重塑 '+slot.label+'</b><small>当前：'+escapeActivity(current)+'</small></button><div class="reroll-auto-row"><select data-reroll-target="'+slot.idx+'" aria-label="'+escapeActivity(slot.label)+'目标技能">'+options+'</select><button class="primary reroll-auto-btn" data-auto-reroll="'+slot.idx+'" '+(s.items.reroll&&eligible.length?'':'disabled')+'>自动重塑直到获得</button></div><div class="reroll-auto-hint">会连续消耗技能重塑药水；刷到目标立即停止。若药水用完仍未获得，会停止并结算本次消耗。</div></div>';
  }).join(''):'<button class="secondary" disabled>先选择怪物</button>';
  const levelButtons=target?'<button class="secondary" data-level-skill="innate" '+(s.items.skill&&skillNum(target)<10?'':'disabled')+'>提升技能1（种族）· '+escapeActivity(G.SPECIES[target.species].skill)+' Lv'+skillNum(target)+'</button>'+getLevelableSkillSlots(target).map(slot=>{const sid=target.extraSkills[slot.idx],sk=sid?extraSkill(sid):null;return '<button class="secondary" data-level-skill="'+slot.idx+'" '+(s.items.skill&&sid&&extraLv(target,slot.idx)<10?'':'disabled')+'>提升 '+slot.label+(sid?' · '+escapeActivity(sk?.name||sid)+' Lv'+extraLv(target,slot.idx):'（空）')+'</button>';}).join(''):'<button class="secondary" disabled>先选择怪物</button>';
  const familyPotionNote=target?(()=>{const p=familySkillParts(target)[0];return '<div class="family-potion-note"><b>技能4（家族）'+(p?' · '+escapeActivity(extraSkill(p.id)?.name||p.id)+' Lv'+p.lv:' · 空')+'</b><small>不能使用技能药水升级。只有同一家族、同一技能且同等级的双亲配种，后代才会把家族技能提升 1 级；等级不同则继承较高等级，不会掉级。</small></div>';})():'';
  box.innerHTML=
    G.COLORS.map((color,i)=>{const st=monsterColorStatus(target,'normal',i);return '<div class="bag-item color-item '+(st.current?'current-color':st.seen?'seen-color':'')+'"><h4>'+color+' 颜色药水 <span class="color-status">'+st.label+'</span></h4><p>持有：<span class="count">'+s.items.colors[i]+'</span></p><p>分区配色：只改变该怪物预设的主体/点缀区域，眼睛、高光、轮廓与指定固定部位保持不变。</p><div class="item-actions"><button class="secondary" data-use-color="'+i+'" '+(s.items.colors[i]&&target&&!st.current?'':'disabled')+'>'+(st.current?'当前颜色':'使用')+'</button></div></div>';}).join('')+
    SPECIAL_COLORS.map((color,i)=>{const st=monsterColorStatus(target,'special',i);return '<div class="bag-item color-item '+(st.current?'current-color':st.seen?'seen-color':'')+'"><h4>'+color.name+' 颜色药水 <span class="explore-only">探索限定</span> <span class="color-status">'+st.label+'</span></h4><p>持有：<span class="count">'+s.items.specialColors[i]+'</span></p><p>这种颜色无法通过配种自然出生。</p><div class="item-actions"><button class="secondary" data-use-special-color="'+i+'" '+(s.items.specialColors[i]&&target&&!st.current?'':'disabled')+'>'+(st.current?'当前颜色':'使用')+'</button></div></div>';}).join('')+
    '<div class="bag-item"><h4>升星药水</h4><p>持有：<span class="count">'+s.items.star+'</span></p><p>下一次有效升星配种 +20pp；每只最多 1 瓶，5★封顶配种不消耗。</p><div class="item-actions"><button class="secondary" data-use-item="star" '+(s.items.star&&target?'':'disabled')+'>使用</button></div></div>'+
    '<div class="bag-item"><h4>✨ 闪光药水</h4><p>持有：<span class="count">'+(s.items.shiny||0)+'</span></p><p>指定怪物使用后，在它存活期间每次作为亲代，后代闪光率永久 +3 个百分点。每只怪物最多使用 1 瓶；双亲可叠加到 +6pp。</p><div class="item-actions"><button class="secondary" data-use-item="shiny" '+((s.items.shiny||0)&&target&&!(target.shinyBoost>0)?'':'disabled')+'>使用 · 长期 +3%</button></div></div>'+
    '<div class="bag-item"><h4>技能药水</h4><p>持有：<span class="count">'+s.items.skill+'</span></p><p>可让技能1、普通技能2/3、闪光专属技能5 +1级，最高 Lv10；<b>不能升级家族技能4</b>。</p><div class="slot-actions">'+levelButtons+'</div>'+familyPotionNote+'</div>'+
    '<div class="bag-item"><h4>技能重塑药水</h4><p>持有：<span class="count">'+s.items.reroll+'</span></p><p>普通技能2 / 3 重塑后为 Lv1–Lv10；闪光专属技能5为 Lv5–Lv10。可以指定目标技能自动连续重塑，刷到目标立即停止；家族技能4不能重塑。</p>'+(target?rerollTargetSummaryHTML(target):'')+'<div class="slot-actions">'+rerollButtons+'</div></div>'+
    '<div class="bag-item"><h4>❤ 生命药水</h4><p>持有：<span class="count">'+(s.items.life||0)+'</span></p><p>'+(target?'当前生命：<b>'+target.life+' / '+target.maxLife+'</b><br>'+(target.lifePotionUsed?'这只怪物已经使用过，不能再次使用。':'这只怪物还可以使用 1 次。'):'请先选择怪物。')+'</p><div class="item-actions"><button class="secondary" data-use-life '+((s.items.life||0)&&target&&!target.lifePotionUsed?'':'disabled')+'>生命 +5（每只限 1 次）</button></div></div>'+
    '<div class="bag-item"><h4>⌛ 行程压缩药水</h4><p>持有：<span class="count">'+(s.items.timeCut||0)+'</span></p><p>当前派遣剩余时间减少 50%，每次派遣限用 1 瓶。</p><p class="time-bag-note">'+(s.dispatch?(s.dispatch.timeCutUsed?'本次派遣已经使用过。':'当前有派遣，可使用。'):'目前没有进行中的派遣。')+'</p><div class="item-actions"><button class="secondary" data-use-time-cut '+((s.items.timeCut||0)&&s.dispatch&&!s.dispatch.timeCutUsed&&s.dispatch.end>Date.now()?'':'disabled')+'>剩余时间 -50%</button></div></div>'+
    '<div class="bag-item"><h4>⏱ 时跃药水</h4><p>持有：<span class="count">'+(s.items.timeInstant||0)+'</span></p><p>当前派遣立即完成计时，可以马上领取结果。</p><p class="time-bag-note">不会改变任务已经决定好的成功 / 失败。</p><div class="item-actions"><button class="secondary" data-use-time-instant '+((s.items.timeInstant||0)&&s.dispatch&&s.dispatch.end>Date.now()?'':'disabled')+'>立即完成</button></div></div>';
}
function useColorPotion(tint){
  const m=shopMonster();
  if(!m){tell('请先选择一只怪物。');return;}
  if(s.items.colors[tint]<=0){tell('背包里没有这瓶颜色药水。');return;}
  if(!Number.isInteger(m.specialColor)&&m.tint===tint){tell(name(m)+' 已经是'+G.COLORS[tint]+'。');return;}
  s.items.colors[tint]--;
  m.tint=tint;m.specialColor=null;m.dexColorEligible=false;
  rememberMonsterColor(m,'normal',tint);
  s.revision++;dirty=true;save();render();
  tell(name(m)+' 已变为'+G.COLORS[tint]+'。');
}
function useSpecialColorPotion(variant){
  const m=shopMonster();
  if(!m){tell('请先选择一只怪物。');return;}
  if(s.items.specialColors[variant]<=0){tell('背包里没有这瓶探索限定颜色药水。');return;}
  if(m.specialColor===variant){tell(name(m)+' 已经是「'+SPECIAL_COLORS[variant].name+'」。');return;}
  s.items.specialColors[variant]--;
  m.specialColor=variant;m.dexColorEligible=true;
  rememberMonsterColor(m,'special',variant);
  markDex(s,m,false);s.revision++;dirty=true;save();render();
  tell(name(m)+' 已变为探索限定颜色「'+SPECIAL_COLORS[variant].name+'」。');
}
function useStoredItem(type){const m=shopMonster();if(!m){tell('请先选择一只怪物。');return;}if(type==='star'){if(s.items.star<=0){tell('背包里没有升星药水。');return;}if((m.starBoost||0)>=.2){tell(name(m)+' 已经准备了 1 瓶升星药水；每只怪物最多储存 1 瓶。');return;}s.items.star--;m.starBoost=.2;s.revision++;dirty=true;render();save();tell(name(m)+' 的下一次有效升星配种概率 +20 个百分点。若较高亲代已是 5★，药水不会消耗。');return;}if(type==='shiny'){if((s.items.shiny||0)<=0){tell('背包里没有闪光药水。');return;}if((m.shinyBoost||0)>=.03){tell(name(m)+' 已经拥有闪光药水的长期 +3% 配种加成。');return;}s.items.shiny--;m.shinyBoost=.03;s.revision++;dirty=true;render();save();tell(name(m)+' 获得长期闪光药水效果：存活期间每次作为亲代，后代闪光率 +3 个百分点；双亲都拥有时可叠加到 +6%。');}}
function levelSkill(slot){
  const m=shopMonster();if(!m){tell('请先选择一只怪物。');return;}
  if(s.items.skill<=0){tell('背包里没有技能药水。');return;}
  ensureMonsterSystemsMonster(m);

  if(slot==='innate'){
    if(skillNum(m)>=10){tell('技能1已经是 Lv10。');return;}
    s.items.skill--;m.skillLv=skillNum(m)+1;
    tell(name(m)+' 的技能1提升到 Lv'+m.skillLv+'。');
  }else if(slot==='family'){
    tell('家族技能不能使用技能药水升级。请用同一家族、同一技能且同等级的双亲配种，让后代继承并提升 1 级。');
    return;
  }else{
    const idx=Number(slot);
    if(!m.extraSkills[idx]){tell('这个技能槽是空的，先用技能重塑药水获得技能。');return;}
    if(extraLv(m,idx)>=10){tell('这个技能已经是 Lv10。');return;}
    s.items.skill--;m.extraSkillLv[idx]=extraLv(m,idx)+1;
    tell(name(m)+' 的'+extraSkill(m.extraSkills[idx]).name+'提升到 Lv'+m.extraSkillLv[idx]+'。');
  }
  refreshLifeCapacity(m,true);s.revision++;dirty=true;render();save();
}
function useRerollPotion(slotIdx){
  const m=shopMonster();if(!m){tell('请先选择一只怪物。');return;}
  if(s.items.reroll<=0){tell('背包里没有技能重塑药水。');return;}
  ensureMonsterSystemsMonster(m);
  if(slotIdx===2){tell('技能4是家族技能，不能用技能重塑药水重刷。');return;}
  if(slotIdx===3&&!m.shiny){tell('只有闪光怪物才有技能5。');return;}
  if(![0,1,3].includes(slotIdx)){tell('这个技能槽不能重刷。');return;}
  s.items.reroll--;
  const used=(m.extraSkills||[]).filter((x,i)=>i!==slotIdx&&x);
  m.extraSkills[slotIdx]=rerollSkillId(Math.random,used);
  // v188: normal slots reroll Lv1–Lv10; shiny-exclusive slot5 rerolls Lv5–Lv10.
  m.extraSkillLv[slotIdx]=slotIdx===3?shinyBonusSkillLevel(Math.random):ordinarySkillLevel(Math.random);
  discoverSkill(m.extraSkills[slotIdx],s);
  refreshLifeCapacity(m,true);
  s.revision++;dirty=true;render();save();
  const rolledSkill=extraSkill(m.extraSkills[slotIdx]);
  tell(name(m)+' 的技能'+(slotIdx===3?'5':slotIdx+2)+'已重塑为「'+rolledSkill.name+'」Lv'+m.extraSkillLv[slotIdx]+'。'+(ULTRA_RARE_SKILLS.includes(rolledSkill.id)?' ✦ 稀有技能！':''));
}
function autoRerollUntilTarget(slotIdx,targetId){
  const m=shopMonster();if(!m){tell('请先选择一只怪物。');return;}
  ensureMonsterSystemsMonster(m);
  if(s.items.reroll<=0){tell('背包里没有技能重塑药水。');return;}
  if(slotIdx===2){tell('技能4是家族技能，不能用技能重塑药水重塑。');return;}
  if(slotIdx===3&&!m.shiny){tell('只有闪光怪物才有技能5。');return;}
  if(![0,1,3].includes(slotIdx)){tell('这个技能槽不能重塑。');return;}
  const targetSkill=extraSkill(targetId);
  if(!targetSkill){tell('请选择目标技能。');return;}
  const usedOther=(m.extraSkills||[]).filter((x,i)=>i!==slotIdx&&x);
  const eligible=[...ordinarySkillPool().map(x=>x.id),...ULTRA_RARE_SKILLS].filter((x,i,a)=>x&&!usedOther.includes(x)&&a.indexOf(x)===i);
  if(!eligible.includes(targetId)){tell('这个目标技能目前不能放入该技能槽，可能已经存在于其他技能槽。');return;}
  if(m.extraSkills?.[slotIdx]===targetId){tell(name(m)+' 的这个技能槽已经是「'+targetSkill.name+'」，没有消耗药水。');return;}

  let spent=0,success=false;
  const starting=s.items.reroll;
  while(s.items.reroll>0){
    s.items.reroll--;spent++;
    const used=(m.extraSkills||[]).filter((x,i)=>i!==slotIdx&&x);
    const rolled=rerollSkillId(Math.random,used);
    m.extraSkills[slotIdx]=rolled;
    m.extraSkillLv[slotIdx]=slotIdx===3?shinyBonusSkillLevel(Math.random):ordinarySkillLevel(Math.random);
    discoverSkill(rolled,s);
    if(rolled===targetId){success=true;break;}
    // Safety guard for unexpectedly enormous inventories on mobile.
    if(spent>=10000)break;
  }
  refreshLifeCapacity(m,true);
  s.revision++;dirty=true;render();save();
  const finalSkill=extraSkill(m.extraSkills[slotIdx]);
  recordActivity('item',{item:'技能重塑药水 ×'+spent,source:'自动重塑 · 目标 '+targetSkill.name});
  if(success){
    tell('成功刷到「'+targetSkill.name+'」Lv'+m.extraSkillLv[slotIdx]+'！本次共花了 '+spent+' 瓶技能重塑药水。');
  }else{
    const reason=spent>=10000&&starting>10000?'为保护手机性能，本轮已达到 10,000 次上限。':'药水已经用完。';
    tell('可惜没有刷到「'+targetSkill.name+'」。本次共花了 '+spent+' 瓶技能重塑药水。'+reason);
  }
}
function useLifePotion(){
  const m=shopMonster();if(!m){tell('请先选择一只怪物。');return;}
  if((s.items.life||0)<=0){tell('背包里没有生命药水。');return;}
  if(m.lifePotionUsed){tell(name(m)+' 已经使用过生命药水，每只怪物只能使用一次。');return;}
  s.items.life--;m.lifePotionUsed=true;m.life+=5;refreshLifeCapacity(m,false);
  archiveMonster(m,s);s.revision++;dirty=true;render();save();
  tell(name(m)+' 使用生命药水，生命 +5；这只怪物以后不能再使用生命药水。');
}
function useTimeCutPotion(){
  if((s.items.timeCut||0)<=0){tell('背包里没有行程压缩药水。');return;}
  if(!s.dispatch){tell('目前没有进行中的派遣。');return;}
  if(s.dispatch.end<=Date.now()){tell('派遣已经完成，可以直接领取。');return;}
  if(s.dispatch.timeCutUsed){tell('这次派遣已经使用过行程压缩药水。');return;}
  const now=Date.now(),remain=s.dispatch.end-now;s.items.timeCut--;s.dispatch.end=now+Math.max(1000,Math.round(remain*.5));s.dispatch.timeCutUsed=true;
  s.revision++;dirty=true;render();save();tell('剩余派遣时间减少 50%。');
}
function useTimeInstantPotion(){
  if((s.items.timeInstant||0)<=0){tell('背包里没有时跃药水。');return;}
  if(!s.dispatch){tell('目前没有进行中的派遣。');return;}
  if(s.dispatch.end<=Date.now()){tell('派遣已经完成，可以直接领取。');return;}
  s.items.timeInstant--;s.dispatch.end=Date.now();s.revision++;dirty=true;render();save();tell('派遣计时已经完成，可以立即领取结果。');
}
function spend(amount){if(s.energy<amount){tell('灵能不足，需要 '+fmt(amount)+' 灵能。');return false;}s.energy-=amount;playSfx('buy');return true;}
const BREED_SKILL_WEIGHTS={
  warm_nest:90,lucky_blossom:105,thick_shell:70,stable_blood:80,
  legacy_mark:100,guardian_heart:65,swift_rest:55,shiny_breed:120,
  vital_growth:20
};
function breedingSkillScore(m){
  ensureMonsterSystemsMonster(m);
  let score=0,count=0;
  for(const ent of effectiveExtraSkillEntries(m)){
    const id=ent.id,lv=ent.lv,w=BREED_SKILL_WEIGHTS[id]||0;
    if(w){score+=w+lv*6;count++;}
  }
  const passive=G.SPECIES[m.species]?.passive;
  if(['incubate','fortune'].includes(passive)){score+=90+skillNum(m)*6;count++;}
  score+=Math.min(70,m.life*3)+m.star*22;
  return {score,count};
}
function breedingMatchScore(m,other){
  const base=breedingSkillScore(m),otherScore=breedingSkillScore(other);
  let score=base.score;
  if(!other)return score;
  if(m.gender===other.gender)return -999999;
  if(m.star===other.star)score+=180;
  else score-=Math.abs(m.star-other.star)*35;
  const own=new Set((m.extraSkills||[]).filter(Boolean));
  const theirs=new Set((other.extraSkills||[]).filter(Boolean));
  let same=0,complement=0;
  for(const id of own){
    if(theirs.has(id)&&BREED_SKILL_WEIGHTS[id])same++;
    if(BREED_SKILL_WEIGHTS[id]&&!theirs.has(id))complement++;
  }
  score+=same*95+complement*22;
  if(G.SPECIES[m.species]?.passive===G.SPECIES[other.species]?.passive)score+=25;
  if(m.baseLife===other.baseLife)score+=18;
  score+=Math.min(40,otherScore.count*8);
  return score;
}
function recommendedParentPool(pool,other=null){
  const list=[...pool];
  const scoreMap=new Map();
  for(const m of list)scoreMap.set(m.id,other?breedingMatchScore(m,other):breedingSkillScore(m).score);
  return list.sort((a,b)=>{
    const sa=scoreMap.get(a.id)||0,sb=scoreMap.get(b.id)||0;
    return sb-sa||b.star-a.star||Number(b.shiny)-Number(a.shiny)||b.life-a.life||b.id-a.id;
  });
}
function parentRecommendationLabel(m,other=null,index=0){
  const bs=breedingSkillScore(m);
  if(index===0)return '<span class="parent-recommend">'+(other?'最佳匹配':'培育推荐')+'</span>';
  if(bs.count>=2)return '<span class="parent-recommend">'+bs.count+' 个培育技能</span>';
  return '';
}
function parentMatchNote(m,other=null){
  if(!other)return breedingSkillScore(m).count?('培育相关技能 '+breedingSkillScore(m).count+' 个'):'';
  const notes=[];
  if(m.star===other.star)notes.push('同星');
  const own=new Set((m.extraSkills||[]).filter(Boolean)),theirs=new Set((other.extraSkills||[]).filter(Boolean));
  const same=[...own].filter(id=>theirs.has(id)&&BREED_SKILL_WEIGHTS[id]).length;
  if(same)notes.push('同培育技能 '+same);
  if(breedingSkillScore(m).count>=2)notes.push('培育技能 '+breedingSkillScore(m).count);
  return notes.join(' · ');
}
function parentButtonHTML(m){
  if(!m)return '<span class="parent-select-empty">选择一位伙伴</span>';
  ensureMonsterSystemsMonster(m);
  return sprite(m.species,m.tint,m.shiny,m.specialColor)+
    '<span class="parent-select-info"><strong>'+
    G.stars(m.star)+' '+name(m)+(m.shiny?' · 闪光':'')+(m.locked?' · 已锁':'')+
    '</strong><small>'+m.gender+' · '+colorName(m)+' · ❤ '+m.life+'/'+m.maxLife+' · 技能 Lv'+skillNum(m)+
    '<br>'+monsterSkillSummary(m)+'</small></span>';
}
function sortParentPickerPool(pool,which,other){
  const mode=parentSort[which]||'recommended',list=[...pool];
  if(mode==='recommended')return recommendedParentPool(list,other);
  list.sort((a,b)=>{
    if(mode==='star-desc')return b.star-a.star||Number(b.shiny)-Number(a.shiny)||b.life-a.life||b.id-a.id;
    if(mode==='star-asc')return a.star-b.star||Number(a.shiny)-Number(b.shiny)||a.id-b.id;
    if(mode==='life-desc')return b.life-a.life||b.star-a.star||b.id-a.id;
    if(mode==='skill-desc')return rosterMaxSkillLv(b)-rosterMaxSkillLv(a)||breedingSkillScore(b).count-breedingSkillScore(a).count||b.star-a.star;
    if(mode==='breed-desc')return breedingSkillScore(b).score-breedingSkillScore(a).score||b.star-a.star;
    if(mode==='favorite')return Number(b.favorite)-Number(a.favorite)||b.star-a.star||Number(b.shiny)-Number(a.shiny)||b.id-a.id;
    if(mode==='joined-desc')return (b.createdAt||0)-(a.createdAt||0)||b.id-a.id;
    if(mode==='joined-asc')return (a.createdAt||0)-(b.createdAt||0)||a.id-b.id;
    return 0;
  });
  return list;
}
function renderParentPicker(which){
  const currentId=which==='a'?s.parentA:s.parentB,
    otherId=which==='a'?s.parentB:s.parentA,
    other=s.monsters.find(m=>m.id===otherId)||null,
    picker=$('parent-'+which+'-picker');
  if(!picker)return;
  const q=parentSearch[which]||'',
    skill=parentSkillFilter[which]||'',
    star=parentStarFilter[which]||'',
    species=parentSpeciesFilter[which]??'',
    eligible=s.monsters.filter(m=>(!other||m.gender!==other.gender||m.id===currentId)&&monsterMatchesName(m,q)),
    raw=eligible.filter(m=>monsterHasSkillName(m,skill)&&matchesStarSpecies(m,star,species)),
    pool=sortParentPickerPool(raw,which,other),
    mode=parentSort[which]||'recommended';

  picker.innerHTML=
    '<div class="parent-picker-toolbar">'+
      '<div class="parent-picker-search-wrap"><input class="parent-picker-search" data-parent-search="'+which+'" type="search" placeholder="名字 / 昵称 / #编号" value="'+escapeActivity(q)+'"></div>'+
      '<select class="parent-picker-sort" data-parent-sort="'+which+'" aria-label="亲代排序">'+
        '<option value="recommended" '+(mode==='recommended'?'selected':'')+'>智能推荐 · 最适合配种</option>'+
        '<option value="breed-desc" '+(mode==='breed-desc'?'selected':'')+'>培育技能 · 高 → 低</option>'+
        '<option value="star-desc" '+(mode==='star-desc'?'selected':'')+'>星级 · 高 → 低</option>'+
        '<option value="star-asc" '+(mode==='star-asc'?'selected':'')+'>星级 · 低 → 高</option>'+
        '<option value="life-desc" '+(mode==='life-desc'?'selected':'')+'>生命 · 高 → 低</option>'+
        '<option value="skill-desc" '+(mode==='skill-desc'?'selected':'')+'>技能等级 · 高 → 低</option>'+
        '<option value="favorite" '+(mode==='favorite'?'selected':'')+'>我的最爱优先</option>'+
        '<option value="joined-desc" '+(mode==='joined-desc'?'selected':'')+'>加入时间 · 新 → 旧</option>'+
        '<option value="joined-asc" '+(mode==='joined-asc'?'selected':'')+'>加入时间 · 旧 → 新</option>'+
      '</select>'+
      '<select class="parent-picker-skill" data-parent-skill="'+which+'" aria-label="按技能筛选">'+skillFilterOptionsHTML(eligible,skill)+'</select>'+
      '<select class="parent-picker-star" data-parent-star="'+which+'" aria-label="按星级筛选">'+starFilterOptionsHTML(star)+'</select>'+
      '<select class="parent-picker-species" data-parent-species="'+which+'" aria-label="按种族筛选">'+speciesFilterOptionsHTML(species)+'</select>'+
    '</div>'+
    '<div class="parent-picker-grid">'+pool.map((m,index)=>
      '<button type="button" class="parent-choice '+(m.id===currentId?'selected ':'')+(m.id===otherId?'disabled ':'')+(isDispatched(m.id)?'dispatched ':'')+'" data-parent-choice="'+m.id+'" '+(m.id===otherId?'disabled':'')+'>'+
        sprite(m.species,m.tint,m.shiny,m.specialColor)+
        '<span class="parent-choice-info"><strong>'+G.stars(m.star)+' '+name(m)+(m.shiny?' · 闪光':'')+(m.locked?' · 已锁':'')+(isDispatched(m.id)?' · 派遣中':'')+
          (mode==='recommended'||mode==='breed-desc'?parentRecommendationLabel(m,other,index):'')+
        '</strong><small>'+m.gender+' · '+colorName(m)+' · ❤ '+m.life+'/'+m.maxLife+' · 技能 Lv'+skillNum(m)+'<br>'+
        monsterSkillSummary(m)+
        ((mode==='recommended'||mode==='breed-desc')&&parentMatchNote(m,other)?'<span class="parent-match-note">'+parentMatchNote(m,other)+'</span>':'')+
        '</small></span></button>'
    ).join('')+'</div>';
}
function closeParentPickers(){
  for(const which of ['a','b']){
    const picker=$('parent-'+which+'-picker');
    const btn=$('parent-'+which+'-btn');
    if(picker)picker.hidden=true;
    if(btn)btn.setAttribute('aria-expanded','false');
  }
}
function toggleParentPicker(which){
  const picker=$('parent-'+which+'-picker');
  const btn=$('parent-'+which+'-btn');
  const opening=picker.hidden;
  closeParentPickers();
  if(opening){
    renderParentPicker(which);
    picker.hidden=false;
    btn.setAttribute('aria-expanded','true');
  }
}
function chooseParent(which,id){
  settle();
  const picked=s.monsters.find(m=>m.id===id)||null;
  if(which==='a'){
    s.parentA=id;
    if(picked){
      const current=s.monsters.find(m=>m.id===s.parentB);
      if(!current||current.gender===picked.gender){
        const opposite=bestSmartCounterpart(picked,s.monsters);
        s.parentB=opposite?.id||null;
        if(opposite)tell('已自动匹配最适合的 '+opposite.gender+'：'+name(opposite)+'。优先同星、同/互补培育技能。');
      }
    }
  }else{
    s.parentB=id;
    if(picked){
      const current=s.monsters.find(m=>m.id===s.parentA);
      if(!current||current.gender===picked.gender){
        const opposite=bestSmartCounterpart(picked,s.monsters);
        s.parentA=opposite?.id||null;
        if(opposite)tell('已自动匹配最适合的 '+opposite.gender+'：'+name(opposite)+'。优先同星、同/互补培育技能。');
      }
    }
  }
  if(s.manualBreedRepeat){
    const pair=G.pair(s);
    if(pair[0]&&pair[1]&&pair[0].id!==pair[1].id&&pair[0].gender!==pair[1].gender){
      s.manualBreedPairIds=[pair[0].id,pair[1].id];
      tell('固定双亲已更新为：'+name(pair[0])+' × '+name(pair[1])+'。');
    }
  }
  dirty=true;closeParentPickers();render();save();
}

function breedSpeciesPreviewHTML(a,b){
  if(!a||!b)return '';
  const aEx=isMissionExclusiveSpecies(a.species),bEx=isMissionExclusiveSpecies(b.species);
  let parts=[],formula='';
  if(aEx&&bEx&&a.species===b.species){
    parts=[[G.SPECIES[a.species].name,.70],['普通品种',.30]];
    formula='同一限定品种双亲：限定品种 70%，普通品种 30%。';
  }else if(aEx&&bEx){
    parts=[[G.SPECIES[a.species].name,.30],[G.SPECIES[b.species].name,.30],['普通品种',.40]];
    formula='两个不同限定品种：父系 30% + 母系 30% + 普通品种 40%。';
  }else if(aEx||bEx){
    const ex=aEx?a:b,normal=aEx?b:a;
    parts=[[G.SPECIES[ex.species].name,.35],[G.SPECIES[normal.species].name,.55],['其他普通品种',.10]];
    formula='限定 × 普通：限定亲代 35% + 普通亲代 55% + 其他普通品种 10%。';
  }else{
    parts=[[G.SPECIES[a.species].name,.45],[G.SPECIES[b.species].name,.45],['其他普通品种',.10]];
    formula='普通双亲：亲代 A 45% + 亲代 B 45% + 其他普通品种 10%。';
  }
  return '<div class="inherit-preview compact-preview"><h4>品种</h4><div class="inherit-skill-grid">'
    +parts.map(x=>'<div class="inherit-skill"><b>'+escapeActivity(x[0])+'</b><br><span'+calcHoverAttrs('品种概率',formula)+'>'+Math.round(x[1]*100)+'%</span></div>').join('')
    +'</div></div>';
}
function breedingSkillPreview(a,b,o){
  if(!a||!b||!o)return '';
  const slots=[];
  for(const parent of [a,b]){
    ensureMonsterSystemsMonster(parent);
    for(let idx=0;idx<2;idx++){
      const id=parent.extraSkills?.[idx],sk=id?extraSkill(id):null;
      if(sk)slots.push({parent,id,sk,lv:extraLv(parent,idx),idx});
    }
  }
  if(!slots.length)return '<div class="inherit-preview compact-preview"><h4>技能</h4><div class="inherit-empty">暂无可直接继承技能</div></div>';
  const each=o.inherit/slots.length;
  const formula='直接继承总概率 '+Math.round(o.inherit*100)+'%，当前共有 '+slots.length+' 个亲代普通技能候选，因此每个候选约 '+(each*100).toFixed(1)+'%。技能变异 '+Math.round(o.mutate*100)+'%；技能3随机生成 '+Math.round(o.thirdChance*100)+'%。';
  return '<div class="inherit-preview compact-preview"><h4>技能</h4><div class="inherit-skill-grid">'+slots.map(x=>'<div class="inherit-skill"><b><span'+skillHoverAttrs(x.id,'extra',x.parent,x.idx)+'>'+escapeActivity(x.sk.name)+' Lv'+x.lv+'</span></b><br><span'+calcHoverAttrs('技能继承概率',formula)+'>'+((each*100)<1?(each*100).toFixed(1):Math.round(each*100))+'%</span></div>').join('')+'</div></div>';
}

function bestSmartCounterpart(anchor,pool){
  if(!anchor)return null;
  const candidates=(pool||s.monsters).filter(m=>
    m&&m.id!==anchor.id&&m.life>0&&!isDispatched(m.id)&&!isInActiveExpedition(m.id)&&m.gender!==anchor.gender
  );
  let best=null,bestScore=-Infinity;
  for(const m of candidates){
    const score=smartBreedPairScore(anchor,m,s.autoBreedPriority||'star');
    if(score>bestScore){bestScore=score;best=m;}
  }
  return best;
}
function ensureBreedingPair(){
  const alive=s.monsters.filter(m=>m&&m.life>0&&!isDispatched(m.id));
  if(alive.length===2&&alive[0].gender===alive[1].gender){
    alive[0].gender='公';alive[1].gender='母';
  }

  if(s.manualBreedRepeat&&Array.isArray(s.manualBreedPairIds)&&s.manualBreedPairIds.length===2){
    const fa=alive.find(m=>m.id===s.manualBreedPairIds[0])||null;
    const fb=alive.find(m=>m.id===s.manualBreedPairIds[1])||null;
    if(fa&&fb&&fa.id!==fb.id&&fa.gender!==fb.gender){
      s.parentA=fa.id;s.parentB=fb.id;return;
    }
  }

  let a=alive.find(m=>m.id===s.parentA)||null;
  let b=alive.find(m=>m.id===s.parentB)||null;

  if(a&&b&&(a.id===b.id||a.gender===b.gender)){b=null;s.parentB=null;}

  if(a&&!b){
    b=bestSmartCounterpart(a,alive);s.parentB=b?.id||null;
  }else if(b&&!a){
    a=bestSmartCounterpart(b,alive);s.parentA=a?.id||null;
  }else if(!a&&!b){
    const pair=chooseSmartBreedPair();
    if(pair){s.parentA=pair[0].id;s.parentB=pair[1].id;}
  }
}

function smartBreedDecisionNote(){
  if(s.manualBreedRepeat)return '固定双亲模式：不会自动换人。';

  const a=s.monsters.find(m=>m.id===s.parentA&&m.life>0&&!isDispatched(m.id)&&!isInActiveExpedition(m.id))||null;
  const b=s.monsters.find(m=>m.id===s.parentB&&m.life>0&&!isDispatched(m.id)&&!isInActiveExpedition(m.id))||null;
  const mode=(s.autoBreedPriority||'star')==='skill'?'技能升级优先':'后代提星优先';

  // If a valid pair is already selected, do NOT rescan every possible pair just
  // to render this explanatory line. Automation still uses chooseSmartBreedPair()
  // when it actually needs to select a new pair.
  if(a&&b&&a.id!==b.id&&a.gender!==b.gender){
    return '当前双亲 · '+mode+'：'+G.stars(a.star)+' '+name(a)+' × '+G.stars(b.star)+' '+name(b)+'。需要更换亲代时，系统才会重新计算智能推荐。';
  }

  const pair=chooseSmartBreedPair();
  if(!pair)return '智能配种：当前没有可用的一公一母。';
  return '智能配种 · '+mode+'：推荐 '+G.stars(pair[0].star)+' '+name(pair[0])+' × '+G.stars(pair[1].star)+' '+name(pair[1])+'。派遣中的怪物不参与推荐。';
}
function renderParents(){
  ensureBreedingPair();
  const parentList=recommendedParentPool(s.monsters,null);
  const choices='<option value="">选择一位伙伴</option>'+parentList.map(m=>'<option value="'+m.id+'">'+G.stars(m.star)+' '+name(m)+' · '+m.gender+' · ❤ '+m.life+'/'+m.maxLife+' · 天生生命 '+m.baseLife+' · 技能Lv'+skillNum(m)+'</option>').join('');
  $('parent-a').innerHTML=choices;$('parent-b').innerHTML=choices;$('parent-a').value=s.parentA||'';$('parent-b').value=s.parentB||'';
  const currentA=s.monsters.find(m=>m.id===s.parentA),currentB=s.monsters.find(m=>m.id===s.parentB);
  const parentById=new Map(s.monsters.map(m=>[m.id,m]));
  for(const option of $('parent-a').options){const m=parentById.get(Number(option.value));option.disabled=!!m&&((currentB&&m.gender===currentB.gender)||m.id===s.parentB);}
  for(const option of $('parent-b').options){const m=parentById.get(Number(option.value));option.disabled=!!m&&((currentA&&m.gender===currentA.gender)||m.id===s.parentA);}
  const [a,b]=G.pair(s);
  for(const [label,m] of [['a',a],['b',b]]){$('portrait-'+label).innerHTML=m?sprite(m.species,m.tint,m.shiny,m.specialColor)+'<span class="stars">'+m.gender+' · '+G.stars(m.star)+' · ❤ '+m.life+'/'+m.maxLife+(isDispatched(m.id)?' · 派遣中':'')+'</span>':'<small>等待伙伴</small>';$('parent-'+label+'-btn').innerHTML=parentButtonHTML(m);const picker=$('parent-'+label+'-picker');if(picker&&!picker.hidden)renderParentPicker(label);}
  const o=G.odds(a,b);if(!o){$('odds').innerHTML='<div class="breed-summary-head"><b>本次后代</b><span class="breed-help-hint">详细规则见玩法说明</span></div><p class="odds-note">请选择一公一母两位可用伙伴。</p>';return;}
  const hasShinyLineage=shinyLineageCount([a,b])>0,lo=naturalLifeOdds(a,b,hasShinyLineage),ordinaryLife=naturalLifeOdds(a,b,false),lineageLife=naturalLifeOdds(a,b,true),sb=shinyBreedBonus(a,b),slb=shinyLineageBreedBonus(a,b),spb=shinyPotionBreedBonus(a,b),buildingShiny=shinyBuildingBonus(s),shinyAdd=sb+buildingShiny+slb+spb;
  const shinyByStar={};for(const st of [1,2,3,4,5])shinyByStar[st]=Math.min(.25,shinyBaseChanceByStar(st)+shinyAdd);
  const totalShiny=[1,2,3,4,5].reduce((sum,st)=>sum+(o.starProbs?.[st]||0)*shinyByStar[st],0);
  const starRows=[1,2,3,4,5].filter(st=>(o.starProbs?.[st]||0)>.00001).map(st=>[st,(o.starProbs[st]||0)*(1-o.fail)]);
  const starCalc='双亲 '+a.star+'★ × '+b.star+'★ → 基础星级分布；升星加成 '+(o.starDelta*100).toFixed(1)+'pp（升星药水 '+(o.potion*100).toFixed(0)+'pp）'+(o.starFallback>0?'；5★封顶时正向升星技能 50% 转保底 +'+(o.starFallback*100).toFixed(1)+'pp':'')+'；掉星修正 '+(o.effectiveDropDelta*100).toFixed(1)+'pp'+(o.atavism>0?'；返祖 '+(o.atavism*100).toFixed(1)+'% 已直接计入最终各星概率':'')+'；最后再计入 '+(o.fail*100).toFixed(1)+'% 孵化失败率。'+(o.high>=5&&o.potion>0?' 当前较高亲代已为 5★，升星药水本次不生效且不会消耗。':'');
  const lifeCalc=hasShinyLineage?'本胎有闪光亲代，因此属于闪光血统：ceil(('+a.maxLife+' + '+b.maxLife+') ÷ 1.5 + 5) = '+Math.ceil((a.maxLife+b.maxLife)/1.5+5)+'，最低 10，最终范围 '+lineageLife.min+'–'+lineageLife.max+'；后代本身是否闪光不改变这套生命公式。出生上限封顶 20。':'本胎没有闪光亲代，使用普通血统：ceil(('+a.maxLife+' + '+b.maxLife+') ÷ 2) + 1 = '+(Math.ceil((a.maxLife+b.maxLife)/2)+1)+'，最低 5，最终范围 '+ordinaryLife.min+'–'+ordinaryLife.max+'。出生上限封顶 20。';
  const shinyCalc='1★–5★ 都可闪光。基础率按星级为 0.1% / 0.2% / 0.3% / 0.4% / 0.5%；再统一叠加：星辉血脉 '+(sb*100).toFixed(1)+'% + 闪光祭坛 '+(buildingShiny*100).toFixed(1)+'% + 闪光血统 '+(slb*100).toFixed(1)+'% + 闪光药水 '+(spb*100).toFixed(1)+'%。当前各星结果：'+[1,2,3,4,5].filter(st=>(o.starProbs?.[st]||0)>0).map(st=>st+'★ '+(shinyByStar[st]*100).toFixed(1)+'%').join('、')+'；按当前星级分布加权，本次每颗蛋综合闪光率约 '+(totalShiny*100).toFixed(2)+'%。';
  const parentCost=[a,b].map(m=>{const loss=m.shiny?1:breedingParentLifeLoss(a,b);return '<span>'+escapeActivity(name(m))+' <b>-'+loss+'❤</b>'+(m.life<=loss?' <em class="life-status">将离世</em>':'')+'</span>';}).join('<span class="breed-cost-sep">·</span>');
  $('odds').innerHTML='<div class="breed-summary-head"><b>本次后代</b><span class="breed-help-hint">数字可悬停 / 点击查看计算</span></div>'+
  '<div class="breed-result-grid">'+
    '<div class="breed-result-card stars-result"><small>星级</small><div>'+starRows.map(([star,p])=>'<span class="breed-star-row"><span>'+G.stars(star)+'</span><b'+calcHoverAttrs(star+'★ 概率',starCalc)+'>'+((p*100)<1?(p*100).toFixed(1):Math.round(p*100))+'%</b></span>').join('')+(o.fail>0?'<span class="breed-star-row fail"><span>失败</span><b'+calcHoverAttrs('孵化失败',slb?'闪光血统存在，本次失败率应为 0%。':'基础孵化失败率与当前效果共同计算后为 '+(o.fail*100).toFixed(1)+'%。')+'>'+((o.fail*100)<1?(o.fail*100).toFixed(1):Math.round(o.fail*100))+'%</b></span>':'')+'</div></div>'+
    '<div class="breed-result-card"><small>'+(hasShinyLineage?'闪光血统生命':'普通血统生命')+'</small><strong'+calcHoverAttrs('天生生命',lifeCalc)+'>❤ '+lo.min+'–'+lo.max+'</strong><small class="breed-life-shiny-note">'+(hasShinyLineage?'至少一位亲代为闪光，整胎使用闪光血统公式':'无闪光亲代，使用普通血统公式')+'</small></div>'+
    '<div class="breed-result-card shiny"><small>本次后代闪光率</small><strong'+calcHoverAttrs('闪光率',shinyCalc)+'>✦ '+(totalShiny*100).toFixed(2)+'%</strong></div>'+
  '</div>'+
  '<div class="breed-parent-cost"><small>本次亲代消耗</small>'+parentCost+'</div>'+
  breedSpeciesPreviewHTML(a,b)+breedingSkillPreview(a,b,o);
}
function statSummaryHTML(m){const r=G.statGrade(m);return '<div class="stat-balance-summary" style="grid-column:1/-1;padding:6px 8px;background:#c9c8cd;border:2px solid #85818b;font-size:10px"><b>总能力 '+fmt(r.total)+' · 评价 '+r.grade+'</b><span style="margin-left:8px">'+G.stars(m.star)+' 单项范围 '+r.band[0]+'–'+r.band[1]+'</span></div>';}
function companionParentsHTML(m){if(!m?.parents?.length)return '<div class="companion-parent-strip empty"><b>双亲</b><span>初代伙伴，没有双亲记录。</span></div>';return '<div class="companion-parent-strip"><b>双亲</b><div class="companion-parent-cards">'+m.parents.slice(0,2).map(id=>{const p=familyRecord(id);if(!p)return '<div class="companion-parent-card missing">#'+id+' · 资料缺失</div>';return '<button type="button" class="companion-parent-card" data-parent-jump="'+p.id+'">'+sprite(p.species,p.tint,p.shiny,p.specialColor)+'<span><strong>'+((p.nickname||G.SPECIES[p.species]?.name||'怪物')+' #'+p.id)+'</strong><small>'+G.stars(p.star||1)+' · '+(p.gender||'？')+' · ❤ '+(p.life??'?')+'/'+(p.maxLife??'?')+'</small></span></button>';}).join('')+'</div></div>';}
function renderCompanion(){const m=s.monsters.find(m=>m.id===selected)||s.monsters[0];if(!m){$('companion').innerHTML='<p>草地暂时安静了。孵化已有的蛋，或领养一位新伙伴。</p>';return;}ensureMonsterSystemsMonster(m);selected=m.id;const t=G.SPECIES[m.species],away=isDispatched(m.id),sellDisabled=(!!m.rescue&&!isMissionExclusiveSpecies(m.species))||away||m.locked;$('companion').innerHTML=sprite(m.species,m.tint,m.shiny,m.specialColor)+'<div><h2>'+name(m)+' <span class="stars">'+G.stars(m.star)+'</span>'+genderBadge(m)+shinyBadge(m)+favoriteBadge(m)+traitBadge(m)+farmBadge(m)+naturalLifeBadge(m)+lifeBadge(m)+(m.locked?'<span class="shiny-badge" style="background:#c9b7bf;color:#402732;border-color:#7d4c5d">已锁定</span>':'')+dispatchReadyBadge(m)+'</h2><div class="meta">'+serialName(m)+(m.nickname?' · 昵称中':'')+' · '+t.element+'系 · '+colorName(m)+' · 第 '+(m.generation||1)+' 代'+(m.familyName?' · '+m.familyName:'')+' · ❤ '+m.life+'/'+m.maxLife+' · 技能 Lv'+skillNum(m)+'/10'+shinyText(m)+' · '+(m.parents.length?'双亲 #'+m.parents.join(' 与 #'):'最初的伙伴')+'</div>'+(m.shiny?'<p class="shiny-line">✦ 闪光怪物拥有额外的技能5（闪光专属），该槽新获得/重刷等级为 Lv5–Lv10，总共可拥有 5 个技能。</p>':'')+(away?'<p class="shiny-line">✦ 这位伙伴正在派遣中，暂时不能摸摸、出售或作为亲代。</p>':'')+(m.locked?'<p class="shiny-line">✦ 已锁定：自动生蛋、自动派遣、自动补牧场都不会选择它；仍可由你手动指定使用，也不能误出售。</p>':'')+'</div>'+companionParentsHTML(m)+'<div class="trait-line"><b>个性 · '+traitInfo(m).name+'</b>：'+traitInfo(m).desc+'</div><div class="stat-list">'+G.stats(m).map((n,i)=>'<div><span>'+['HP','攻击','防御','速度','幸运'][i]+'</span><b>'+n+'</b></div>').join('')+'</div>'+statSummaryHTML(m)+skillListHTML(m)+'<div class="auto-priority-note">自动优先：自动生蛋 / 自动派遣会先选它；数量不足时会自动补其他合适怪物。</div><div class="companion-actions"><button id="rename-monster" class="secondary">改名</button><button id="family-monster" class="secondary">家谱</button><button id="toggle-favorite" class="secondary '+(m.favorite?'active':'')+'">'+(m.favorite?'取消最爱':'设为最爱')+'</button><button id="toggle-lock" class="secondary">'+(m.locked?'解除锁定':'锁定怪物')+'</button><button id="toggle-farm" class="secondary '+(isInFarm(m.id)?'active':'')+'">'+(isInFarm(m.id)?'移回怪物盒':'放入生产牧场')+'</button><button id="toggle-auto-use" class="secondary '+(m.autoUse?'active':'')+'">'+(m.autoUse?'取消自动优先':'设为自动优先')+'</button><button id="sell-monster" class="secondary" '+(sellDisabled?'disabled':'')+'>'+(away?'派遣中暂不可出售':m.locked?'已锁定，暂不可出售':(m.rescue&&!isMissionExclusiveSpecies(m.species))?'救助伙伴不可出售':'出售 · '+fmt(G.salePrice(m))+' 灵能')+'</button></div>';$('family-monster').onclick=()=>renderFamily(m);$('rename-monster').onclick=()=>{const next=prompt('给这只怪物起个名字吧（留空可恢复默认名）',m.nickname||'');if(next===null)return;m.nickname=next.trim().slice(0,16);s.revision++;dirty=true;render();save();tell(m.nickname?serialName(m)+' 现在叫「'+m.nickname+'」':'已恢复默认名字。');};$('toggle-favorite').onclick=()=>{m.favorite=!m.favorite;s.revision++;dirty=true;render();save();tell(name(m)+(m.favorite?' 已加入我的最爱。':' 已从我的最爱移除。'));};$('toggle-lock').onclick=()=>{m.locked=!m.locked;s.revision++;dirty=true;render();save();tell(name(m)+(m.locked?' 已锁定。':' 已解除锁定。'));};$('toggle-farm').onclick=()=>setFarmAssignment(m.id,!isInFarm(m.id));$('toggle-auto-use').onclick=()=>{m.autoUse=!m.autoUse;s.revision++;dirty=true;render();save();tell(name(m)+(m.autoUse?' 已设为自动优先。':' 已取消自动优先。'));};$('sell-monster').onclick=()=>{settle();if(!s.monsters.some(x=>x.id===m.id)){dirty=true;render();return;}sellTarget=m.id;$('sale-info').textContent='出售 '+name(m)+(m.shiny?'（闪光）':'')+'（'+m.star+' 星、'+m.life+' / '+m.maxLife+' 生命），获得 '+fmt(G.salePrice(m))+' 灵能。怪物将离开家园，无法撤回。已产出的蛋会保留。';$('sale-dialog').showModal();};$('companion').querySelectorAll('[data-parent-jump]').forEach(btn=>btn.onclick=()=>{const p=s.monsters.find(x=>x.id===Number(btn.dataset.parentJump));if(p){selected=p.id;dirty=true;render();}else renderFamily(m);});}
function renderRosterQuick(){const box=$('roster-quick');if(!box)return;const m=s.monsters.find(x=>x.id===selected)||s.monsters[0];if(!m){box.innerHTML='<p>这里还没有怪物。</p>';return;}ensureMonsterSystemsMonster(m);box.innerHTML=sprite(m.species,m.tint,m.shiny,m.specialColor)+'<div><h3>'+name(m)+' '+G.stars(m.star)+genderBadge(m)+shinyBadge(m)+favoriteBadge(m)+traitBadge(m)+autoUseBadge(m)+farmBadge(m)+naturalLifeBadge(m)+lifeBadge(m)+dispatchReadyBadge(m)+'</h3><p>'+serialName(m)+' · '+m.gender+' · '+m.life+' / '+m.maxLife+' 生命 · '+colorName(m)+'</p><p class="roster-quick-skills">'+monsterSkillSummary(m)+'</p></div><div class="roster-quick-actions"><button class="secondary" data-quick="favorite">'+(m.favorite?'取消最爱':'最爱')+'</button><button class="secondary" data-quick="lock">'+(m.locked?'解锁':'锁定')+'</button><button class="secondary" data-quick="farm">'+(isInFarm(m.id)?'移回怪物盒':'放入生产牧场')+'</button><button class="secondary" data-quick="autoUse">'+(m.autoUse?'取消自动优先':'设为自动优先')+'</button><button class="secondary" data-quick="rename">改名</button><button class="secondary" data-quick="family">家谱</button><button class="secondary" data-quick="parentA">设为亲代 A</button><button class="secondary" data-quick="parentB">设为亲代 B</button><button class="secondary" data-quick="dispatch" '+(canDispatchMonster(m)?'':'disabled')+'>派遣</button><button class="secondary" data-quick="sell" '+(canBulkSell(m)?'':'disabled')+'>出售 · '+fmt(G.salePrice(m))+'</button></div>';}

function ensureSkillDex(state=s){
  if(!state.skillDex||typeof state.skillDex!=='object')state.skillDex={extra:{}};
  if(!state.skillDex.extra||typeof state.skillDex.extra!=='object')state.skillDex.extra={};
  // Existing owned monsters count as already discovered.
  for(const m of (state.monsters||[])){
    ensureMonsterSystemsMonster(m);
    for(const id of (m.extraSkills||[]).filter(Boolean)){
      if(extraSkill(id))state.skillDex.extra[id]=true;
    }
  }
  // v188: skills already present in either incubator slot, twin eggs, or the waiting queue count as discovered.
  for(const m of eggMonsters(state)){
    ensureMonsterSystemsMonster(m);
    for(const id of (m.extraSkills||[]).filter(Boolean)){
      if(extraSkill(id))state.skillDex.extra[id]=true;
    }
    const parts=m.familySkill?.parts||[];
    for(const p of parts){if(p?.id&&extraSkill(p.id))state.skillDex.extra[p.id]=true;}
  }
}
function discoverSkill(id,state=s){
  if(!id||!extraSkill(id))return false;
  ensureSkillDex(state);
  const first=!state.skillDex.extra[id];
  state.skillDex.extra[id]=true;
  return first;
}
function discoverMonsterSkills(m,state=s){
  if(!m)return;
  ensureSkillDex(state);
  for(const id of (m.extraSkills||[]).filter(Boolean))discoverSkill(id,state);
  for(const p of familySkillParts(m))discoverSkill(p.id,state);
}
function skillDexCount(state=s){
  ensureSkillDex(state);
  return EXTRA_SKILLS.filter(sk=>!!state.skillDex.extra[sk.id]).length;
}
function monsterSearchText(m){return [name(m),m.nickname||'',G.SPECIES[m.species]?.name||'',String(m.id),'#'+m.id].join(' ').toLowerCase();}
function monsterMatchesName(m,q){q=(q||'').trim().toLowerCase();return !q||monsterSearchText(m).includes(q);}
function monsterSkillEntries(m){
  ensureMonsterSystemsMonster(m);
  const out=[{id:'innate:'+m.species,name:G.SPECIES[m.species].skill,lv:skillNum(m),kind:'种族技能'}];
  for(const idx of [0,1]){
    const id=m.extraSkills?.[idx],sk=id?extraSkill(id):null;
    if(sk)out.push({id:'extra:'+id,name:sk.name,lv:extraLv(m,idx),kind:'普通技能'});
  }
  for(const p of familySkillParts(m))out.push({id:'family:'+p.id,name:extraSkill(p.id)?.name||p.id,lv:p.lv,kind:'家族技能'});
  if(m.shiny&&m.extraSkills?.[3])out.push({id:'extra:'+m.extraSkills[3],name:extraSkill(m.extraSkills[3])?.name||m.extraSkills[3],lv:extraLv(m,3),kind:'普通技能'});
  return out;
}
function monsterSkillSummary(m){
  ensureMonsterSystemsMonster(m);
  const out=[];
  out.push('技能1：<span'+skillHoverAttrs(null,'innate',m,null)+'>'+escapeActivity(G.SPECIES[m.species].skill)+'</span> Lv'+skillNum(m));
  for(const idx of [0,1]){
    const id=m.extraSkills?.[idx],sk=id?extraSkill(id):null;
    out.push('技能'+(idx+2)+'：'+(sk?'<span'+skillHoverAttrs(id,'extra',m,idx)+'>'+escapeActivity(sk.name)+'</span> Lv'+extraLv(m,idx):'空'));
  }
  const famParts=familySkillParts(m);out.push('技能4（家族'+(m.familyName?' · '+escapeActivity(m.familyName):'')+'）：'+((m.generation||1)<10?'第10代起解锁':famParts.length?'<span'+familySkillHoverAttrs(famParts[0].id,famParts[0].lv)+'>'+escapeActivity(extraSkill(famParts[0].id)?.name||'未知技能')+'</span> Lv'+famParts[0].lv:'空'));
  if(m.shiny){
    const id=m.extraSkills?.[3],sk=id?extraSkill(id):null;
    out.push('技能5：'+(sk?'<span'+skillHoverAttrs(id,'extra',m,3)+'>'+escapeActivity(sk.name)+'</span> Lv'+extraLv(m,3):'空'));
  }
  return out.join(' · ');
}
function rosterMaxSkillLv(m){
  return Math.max(...monsterSkillEntries(m).map(x=>x.lv));
}
function populateSkillFilter(){
  const sel=$('filter-skill');
  if(!sel)return;
  const current=sel.value||'';
  const entries=[];
  for(let i=0;i<G.SPECIES.length;i++)entries.push({value:'innate:'+i,label:'种族 · '+G.SPECIES[i].skill});
  for(const sk of EXTRA_SKILLS)entries.push({value:'extra:'+sk.id,label:sk.tone==='buff'?('Buff · '+sk.name+' · '+sk.group):('Debuff · '+sk.name+' · 家族技能')});
  sel.innerHTML='<option value="">全部技能</option>'+entries.map(x=>'<option value="'+x.value+'">'+x.label+'</option>').join('');
  if(entries.some(x=>x.value===current))sel.value=current;
}
function populateSpeciesFilter(){
  const sel=$('filter-species');if(!sel)return;
  const current=sel.value||'';
  sel.innerHTML='<option value="">全部种族</option>'+G.SPECIES.map((sp,i)=>'<option value="'+i+'">'+escapeActivity(sp.name)+'</option>').join('');
  if(current!==''&&Number(current)>=0&&Number(current)<G.SPECIES.length)sel.value=current;
}

function populateFamilyFilter(){
  const sel=$('filter-family');if(!sel)return;
  const current=sel.value||'';
  const names=[...new Set((s.monsters||[])
    .filter(m=>m&&m.life>0)
    .map(m=>(m.familyName||'').trim())
    .filter(Boolean))]
    .sort((a,b)=>a.localeCompare(b,'zh-Hans-CN'));
  const sig=names.join('\u0001');
  if(sel.dataset.familySignature===sig)return;
  sel.dataset.familySignature=sig;
  sel.innerHTML='<option value="">全部家族</option><option value="__none__">无家族</option>'
    +names.map(n=>'<option value="'+escapeActivity(n)+'">'+escapeActivity(n)+'</option>').join('');
  if(current==='__none__'||names.includes(current))sel.value=current;
}
function hasRosterFamily(m,filter){
  if(!filter)return true;
  const f=(m?.familyName||'').trim();
  if(filter==='__none__')return !f;
  return f===filter;
}
function hasRosterSkill(m,filter){
  if(!filter)return true;
  if(filter.startsWith('extra:')){
    const sid=filter.slice('extra:'.length);
    return monsterSkillEntries(m).some(x=>x.id===filter||x.id==='family:'+sid);
  }
  return monsterSkillEntries(m).some(x=>x.id===filter);
}
function getSortedRoster(){
  let list=[...s.monsters];
  for(const m of list)ensureMonsterSystemsMonster(m);
  const filter=$('filter-skill')?.value||'',
    starFilter=$('filter-star')?.value||'',
    speciesFilter=$('filter-species')?.value??'',
    familyFilter=$('filter-family')?.value||'',
    nameFilter=$('filter-name')?.value||'';

  if(filter)list=list.filter(m=>hasRosterSkill(m,filter));
  list=list.filter(m=>matchesStarSpecies(m,starFilter,speciesFilter));
  if(familyFilter)list=list.filter(m=>hasRosterFamily(m,familyFilter));
  if(nameFilter)list=list.filter(m=>monsterMatchesName(m,nameFilter));

  const mode=$('sort-roster')?.value||'rarity',
    dir=$('sort-direction')?.value||'desc',
    sign=dir==='asc'?1:-1;
  const cmpNum=(a,b)=>sign*(a-b);

  list.sort((a,b)=>{
    let v=0;
    if(mode==='joined')v=cmpNum(a.createdAt||0,b.createdAt||0);
    else if(mode==='age')v=cmpNum(a.life,b.life);
    else if(mode==='favorite')v=cmpNum(Number(a.favorite),Number(b.favorite))||cmpNum(a.star,b.star)||cmpNum(Number(a.shiny),Number(b.shiny));
    else if(mode==='skilllv')v=cmpNum(rosterMaxSkillLv(a),rosterMaxSkillLv(b))||cmpNum(a.star,b.star);
    else v=cmpNum(a.star,b.star)||cmpNum(Number(a.shiny),Number(b.shiny))||cmpNum(Number(a.favorite),Number(b.favorite))||cmpNum(a.createdAt||0,b.createdAt||0);
    return v||b.id-a.id;
  });
  return list;
}
function renderRoster(){
  populateFamilyFilter();
  populateSpeciesFilter();
  const list=getSortedRoster();
  $('roster').innerHTML=list.map(m=>{
    const bulkDisabled=bulkSellMode&&!canBulkSell(m);
    const bulkSelected=bulkSellSelected.has(m.id);
    return '<button class="monster-card '+(m.id===selected?'selected ':'')+(bulkSelected?'bulk-selected ':'')+(bulkDisabled?'bulk-disabled':'')+'" data-id="'+m.id+'" aria-pressed="'+(m.id===selected)+'">'+
      (bulkSellMode?'<span class="bulk-check">'+(bulkDisabled?'×':bulkSelected?'✓':'')+'</span>':'')+
      sprite(m.species,m.tint,m.shiny,m.specialColor)+
      '<div><span class="stars">'+G.stars(m.star)+'</span><strong>'+name(m)+(m.shiny?' ✦':'')+traitBadge(m)+'</strong><small>'+(m.nickname?serialName(m)+'<br>':'')+m.gender+' · '+m.life+' / '+m.maxLife+' 生命 · '+colorName(m)+'<br>'+monsterSkillSummary(m)+'</small></div>'+
      ([s.parentA,s.parentB].includes(m.id)?'<span class="tag">亲代</span>':'')+
      (m.favorite?'<span class="tag favorite">最爱</span>':'')+
      (m.locked?'<span class="tag locked">已锁定</span>':'')+
      (isDispatched(m.id)?'<span class="tag dispatch">派遣中</span>':isEggParent(m.id)?'<span class="tag dispatch">孵化亲代</span>':isInFarm(m.id)?'<span class="tag ready">生产</span>':'<span class="tag">盒中</span>')+
    '</button>';
  }).join('');
  const f=$('filter-result');
  if(f){
    const parts=[];
    const skillLabel=$('filter-skill')?.selectedOptions?.[0]?.textContent||'';
    const starValue=$('filter-star')?.value||'';
    const speciesValue=$('filter-species')?.value??'';
    const speciesLabel=$('filter-species')?.selectedOptions?.[0]?.textContent||'';
    const familyValue=$('filter-family')?.value||'';
    const familyLabel=$('filter-family')?.selectedOptions?.[0]?.textContent||'';
    if($('filter-skill')?.value)parts.push('技能：'+skillLabel);
    if(starValue)parts.push('星级：'+G.stars(Number(starValue)));
    if(speciesValue!=='')parts.push('种族：'+speciesLabel);
    if(familyValue)parts.push('家族：'+familyLabel);
    if(($('filter-name')?.value||'').trim())parts.push('名字：'+$('filter-name').value.trim());
    f.textContent=(parts.length?parts.join(' · ')+' · ':'')+'显示 '+list.length+' / '+s.monsters.length+' 只怪物';
  }
  renderBulkSellControls();
}
function ranchLevelFromXp(xp){xp=Math.max(0,Math.floor(Number(xp)||0));let level=1,spent=0,need=100;while(level<20&&xp>=spent+need){spent+=need;level++;need=Math.round(100*Math.pow(1.22,level-1));}return {level,into:xp-spent,need};}
function ranchLevel(){return ranchLevelFromXp(s.ranchXp||0).level;}
function gainRanchXp(amount,reason=''){amount=Math.max(0,Math.floor(Number(amount)||0));if(!amount)return;const before=ranchLevel();s.ranchXp=(s.ranchXp||0)+amount;const after=ranchLevel();if(after>before)tell('牧场升级！Lv'+before+' → Lv'+after+'。'+(reason||'新的派遣任务可能已解锁。'));}
function ranchXpForBirth(m){return 10+(m?.star||1)*8+(m?.shiny?35:0);}
function ranchXpForDispatch(ms,success){const base={meadow:12,forage:20,river:28,ruins:38,cavern:50,astral:65,summit:85,rift:110}[ms?.id]||25;return success?base:Math.max(8,Math.round(base*.4));}

function runIntegrityAudit(){
  const issues=[];

  const ids=[...document.querySelectorAll('[id]')].map(el=>el.id);
  const seen=new Set(),dupes=new Set();
  for(const id of ids){if(seen.has(id))dupes.add(id);else seen.add(id);}
  if(dupes.size)issues.push('DOM duplicate ids: '+[...dupes].join(', '));

  if(!G.valid(s))issues.push('Current save failed G.valid().');
  if((s.monsters||[]).length>s.capacity)issues.push('Monster count exceeds box capacity.');

  const eggList=[s.egg,s.egg2,...(s.eggQueue||[])].filter(Boolean);
  const eggMons=eggMonsters(s);
  if(totalQueuedEggs(s)>eggTotalMax(s))issues.push('Egg capacity exceeded: '+totalQueuedEggs(s)+' / '+eggTotalMax(s));
  const liveIds=new Set((s.monsters||[]).map(m=>m.id));
  const eggIds=eggMons.map(m=>m.id);
  if(new Set(eggIds).size!==eggIds.length)issues.push('Duplicate monster id inside incubators/queue.');
  for(const id of eggIds)if(liveIds.has(id))issues.push('Egg monster id already exists in live roster: #'+id);
  for(const [i,e] of eggList.entries()){
    if(!e?.child)issues.push('Egg entry '+i+' has no child.');
    if((e===s.egg||e===s.egg2)&&(!Number.isFinite(Number(e.start))||!Number.isFinite(Number(e.ready))||Number(e.ready)<=Number(e.start)))issues.push('Active incubator has invalid timing.');
  }
  const activeFamilies=activeFamilyNames(s);
  for(const fam of Object.keys(s.familySkillRegistry||{}))if(!activeFamilies.has(fam))issues.push('Stale family registry entry: '+fam);

  const missionIds=DISPATCH_MISSIONS.map(m=>m.id);
  if(new Set(missionIds).size!==missionIds.length)issues.push('Duplicate dispatch mission ids.');

  for(const m of (s.monsters||[])){
    if(!m||typeof m!=='object'){issues.push('Invalid monster object.');continue;}
    if((m.generation||1)<10&&m.familySkill)issues.push('Pre-Gen10 family skill on monster #'+m.id);
    if(!Array.isArray(m.genes)||m.genes.length!==5)issues.push('Invalid genes on monster #'+m.id);
    if(!Number.isFinite(m.life)||!Number.isFinite(m.maxLife))issues.push('Invalid life on monster #'+m.id);
  }

  if(s.parentA&&s.parentB){
    const a=s.monsters.find(m=>m.id===s.parentA),b=s.monsters.find(m=>m.id===s.parentB);
    if(a&&b){
      const odds=G.odds(a,b);
      const total=Object.values(odds?.starProbs||{}).reduce((sum,v)=>sum+(Number(v)||0),0);
      if(odds&&Math.abs(total-1)>.001)issues.push('Breeding star probability total is '+total.toFixed(4));
    }
  }

  if(issues.length)console.warn('[Qinster integrity audit]',issues);
  else console.info('[Qinster integrity audit] OK');
  return issues;
}
function render(){renderDispatchDock();renderRanchIdentity();bindBagTargetControls();if(page==='farm')autoManageFarm();normalizeFarmState(s);if(page==='farm'){syncActors();renderFarmItemInfo();renderBuildings();renderTopDispatchStatus();}if(dirty){if(page==='farm'){renderMemorial();renderParents();renderCompanion();renderRoster();renderRosterQuick();}else if(page==='shop'){renderColorPotionShop();renderShopOwnedCounts();}else if(page==='bag'){renderShopTarget();}else if(page==='dex'){renderDex();}else if(page==='dispatch'){renderDispatch();}else if(page==='skills'){renderSkillLibrary();}dirty=false;}$('energy').textContent=fmtEnergy(s.energy);const rl=ranchLevelFromXp(s.ranchXp||0);$('ranch-level').textContent='Lv'+rl.level;$('ranch-xp').textContent=rl.into+' / '+rl.need+' XP';if($('auto-dispatch'))$('auto-dispatch').checked=!!s.autoDispatch;if($('manual-dispatch-repeat'))$('manual-dispatch-repeat').checked=!!s.manualDispatchRepeat;if($('auto-dispatch-reserve-breed'))$('auto-dispatch-reserve-breed').checked=s.autoDispatchReserveBreed!==false;if($('auto-dispatch-mission'))$('auto-dispatch-mission').value=s.autoDispatchMission||'highest';if($('auto-dispatch-power'))$('auto-dispatch-power').value=s.autoDispatchPowerMode||'efficient';document.querySelectorAll('[data-buy-potion="timeCut"],[data-buy-potion="timeInstant"]').forEach(b=>b.disabled=rl.level<3);document.querySelectorAll('.time-shop-card').forEach(c=>c.classList.toggle('locked',rl.level<3));$('income').textContent=(G.income(s)*60).toFixed(1);$('best').textContent=G.stars(Math.max(0,...s.monsters.map(m=>m.star)));$('hatched').innerHTML=s.hatched+' <i>枚</i>';const activeFarmCount=producingMonsters(s).length;$('scene-count').textContent=activeFarmCount+' 位生产伙伴';$('farm-active').textContent=activeFarmCount+' / '+s.farmSlots;$('capacity').textContent=s.monsters.length+' / '+s.capacity;if($('capacity-price'))$('capacity-price').textContent=s.capacity>=500?'已达上限 500':fmt(expandCost())+' 灵能';if($('buy-capacity'))$('buy-capacity').disabled=s.capacity>=500;if($('farm-expand-price'))$('farm-expand-price').textContent=fmt(farmExpandCost())+' 灵能';if($('farm-slot-count'))$('farm-slot-count').textContent=s.farmSlots;if($('auto-fill-farm'))$('auto-fill-farm').checked=s.autoFillFarm!==false;if($('skill-potion-price'))$('skill-potion-price').textContent=fmt(SHOP_PRICES.skill)+' 灵能';if($('shiny-potion-price'))$('shiny-potion-price').textContent=fmt(SHOP_PRICES.shiny)+' 灵能';if($('reroll-potion-price'))$('reroll-potion-price').textContent=fmt(SHOP_PRICES.reroll)+' 灵能';if($('time-cut-price'))$('time-cut-price').textContent=fmt(SHOP_PRICES.timeCut)+' 灵能';if($('time-instant-price'))$('time-instant-price').textContent=fmt(SHOP_PRICES.timeInstant)+' 灵能';if($('guide-price-skill'))$('guide-price-skill').textContent=fmt(SHOP_PRICES.skill);if($('guide-price-reroll'))$('guide-price-reroll').textContent=fmt(SHOP_PRICES.reroll);if($('guide-price-timecut'))$('guide-price-timecut').textContent=fmt(SHOP_PRICES.timeCut);if($('guide-price-timeinstant'))$('guide-price-timeinstant').textContent=fmt(SHOP_PRICES.timeInstant);if(page==='dispatch')renderDispatch();$('adopt').hidden=s.monsters.length>=2||!!s.egg||!!s.egg2;$('auto-breed').checked=s.autoBreed;if($('auto-breed-priority'))$('auto-breed-priority').value=s.autoBreedPriority||'star';if($('manual-breed-repeat'))$('manual-breed-repeat').checked=!!s.manualBreedRepeat;$('auto-hatch').checked=s.autoHatch;const abs=autoBreedStatus();$('auto-breed-status').textContent=abs.text;$('auto-breed-status').className='auto-breed-status '+abs.cls;const why=G.blocked(s,Date.now());$('breed').disabled=!!why;$('breed').textContent=why?'暂时不能生蛋':'开始生蛋 · '+G.breedCost(s)+' 灵能';if(!s.egg){if(why)setBreedActionStatus('当前状态：'+why,'wait');else setBreedActionStatus('亲代已准备好，可以开始生蛋。','ok');}$('motion').textContent=s.paused?'恢复走动':'暂停走动';$('motion').setAttribute('aria-pressed',String(s.paused));document.body.classList.toggle('still',s.paused);
const totalEggs=totalQueuedEggs(s),totalMax=eggTotalMax(s);
function renderIncubatorSlot(slot){
  const egg=slot===2?s.egg2:s.egg;
  const nestEl=$(slot===2?'nest-2':'nest'),statusEl=$(slot===2?'egg-status-2':'egg-status'),progressEl=$(slot===2?'progress-2':'progress'),infoEl=$(slot===2?'nest-info-2':'nest-info'),hatchEl=$(slot===2?'hatch-2':'hatch');
  if(!nestEl||!statusEl||!progressEl||!infoEl||!hatchEl)return;
  const unlocked=slot===1||hatchSlotCount(s)>=2;
  const shell=$(slot===2?'incubator-slot-2':'incubator-slot-1');if(shell)shell.hidden=!unlocked;
  if(!unlocked)return;
  const ready=egg&&Number(egg.ready)<=Date.now();
  if(egg){
    const twinStage=Number(egg.twinStage)||0;
    nestEl.innerHTML=(twinStage?'<div class="twin-egg-notice">✦ 双蛋 · 第 '+twinStage+' 颗 / 2</div>':'')+eggArt(egg.child);
    nestEl.className='nest'+(ready?' ready':'')+(twinStage?' twin-ready':'')+(egg.child?.shiny?' shiny-nest':'');
    const remain=Math.max(0,Math.ceil((Number(egg.ready)-Date.now())/1000));
    statusEl.textContent=(slot===2?'栏位 2 · ':'')+(twinStage?'双蛋第 '+twinStage+' 颗 · ':'')+(ready?'可以破壳':remain+' 秒后孵化');
    infoEl.innerHTML=(twinStage?'<b>双潮卵息已触发：这一窝共有 2 颗蛋。</b><br>':'')+'双亲 #'+egg.child.parents.join(' 与 #')+'<br>'+G.stars(egg.child.star)+' '+G.SPECIES[egg.child.species].name+(egg.child.shiny?' · <b>✦ 闪光蛋</b>':'');
    const den=Math.max(1,Number(egg.ready)-Number(egg.start));progressEl.value=Math.min(1,Math.max(0,(Date.now()-Number(egg.start))/den));
  }else{
    nestEl.className='nest empty';nestEl.textContent='✧ 等待下一颗蛋';statusEl.textContent='空闲';progressEl.value=0;infoEl.textContent='等候列表中的下一颗蛋会自动进入这个栏位。';
  }
  hatchEl.hidden=!ready;hatchEl.disabled=s.monsters.length>=s.capacity;
}
renderIncubatorSlot(1);renderIncubatorSlot(2);
if($('egg-total-status'))$('egg-total-status').textContent='总蛋数 '+totalEggs+' / '+totalMax;
const qList=$('egg-queue-list'),qCount=$('egg-queue-count'),qSummary=$('egg-queue-summary');
if(qSummary)qSummary.textContent='🥚 '+totalEggs+' / '+totalMax;
if(qList){
  const queue=(s.eggQueue||[]);
  if(qCount){const activeUnits=eggUnits(s.egg)+eggUnits(s.egg2);qCount.textContent=queuedEggCount(s)+' / '+Math.max(0,eggTotalMax(s)-activeUnits);}
  qList.innerHTML=queue.length?queue.map((qe,i)=>{const child=qe.child;return '<div class="egg-queue-slot '+(child?.shiny?'queue-shiny':'')+'" title="第 '+(i+1)+' 位等候 · '+G.SPECIES[child.species].name+'"><span class="queue-number">'+(i+1)+'</span>'+eggArt(child,{compact:true,labels:false})+'<small>'+G.stars(child.star)+' '+G.SPECIES[child.species].name+(child.shiny?' ✦':'')+'</small>'+(qe.twinChild?'<em>+ 双蛋</em>':'')+'</div>';}).join(''):'<div class="egg-queue-empty">暂无等候蛋。总蛋数最多 11 颗；第二孵化栏只增加同时孵化数量，不增加总容量。</div>';
}
}
function renderMemorial(){renderActivityLog();}

let skillLibraryFilter='all';
function skillLevelEffectText(sk,lv){
  // Scale the concise description to a useful Lv display.
  // The underlying effects use Lv-based multipliers elsewhere; this page is explanatory.
  const d=sk.desc||'';
  const num=d.match(/([+-]?\d+(?:\.\d+)?)%/);
  if(num){
    const base=Number(num[1]);
    const scaled=(base*lv).toFixed(Number.isInteger(base)?0:1);
    return d.replace(num[0],(base>=0&&String(num[0]).startsWith('+')?'+':'')+scaled+'%');
  }
  return lv===1?d:d+'（Lv'+lv+'）';
}

function renderDex(){
  ensureDex(s);
  const speciesTotal=G.SPECIES.length,colorTotal=DEX_COLORS.length,comboTotal=speciesTotal*colorTotal;
  const seenSpecies=s.dex.species.filter(Boolean).length;
  const seenColors=s.dex.colors.filter(Boolean).length;
  const seenCombos=Object.keys(s.dex.combos).filter(k=>Number(k.split('-')[1])<colorTotal).length;
  const seenShinyCombos=Object.keys(s.dex.shinyCombos||{}).filter(k=>Number(k.split('-')[1])<colorTotal).length;

  const colorBoard=DEX_COLORS.map((c,ci)=>{
    const unlocked=!!s.dex.colors[ci];
    const current=s.monsters.filter(m=>dexColorIndex(m)===ci).length;
    const speciesSeen=G.SPECIES.filter((_,sp)=>!!s.dex.combos[sp+'-'+ci]).length;
    const shinySeen=G.SPECIES.filter((_,sp)=>!!s.dex.shinyCombos?.[sp+'-'+ci]).length;
    return '<div class="dex-color-chip '+(unlocked?'':'unseen')+' '+(c.kind==='special'?'special':'')+'"><div class="top"><span><i class="dot" style="background:hsl('+c.hue+',70%,65%)"></i>'+c.name+'</span><b>'+(unlocked?'已解锁':'未收集')+'</b></div><small>当前拥有 '+current+' 只</small><small>普通图鉴 '+speciesSeen+' / '+speciesTotal+' 种</small><small>✦ 闪光图鉴 '+shinySeen+' / '+speciesTotal+' 种</small></div>';
  }).join('');

  const speciesCards=G.SPECIES.map((sp,i)=>{
    const unlocked=!!s.dex.species[i];
    const currentList=s.monsters.filter(m=>m.species===i);
    const current=currentList.length;
    const colorSeen=DEX_COLORS.filter((_,ci)=>!!s.dex.combos[i+'-'+ci]).length;
    const shinyColorSeen=DEX_COLORS.filter((_,ci)=>!!s.dex.shinyCombos?.[i+'-'+ci]).length;
    const best=currentList.length?Math.max(...currentList.map(m=>m.star)):0;
    const shinyEggKnown=Object.keys(s.dex.shinyCombos||{}).some(k=>Number(k.split('-')[0])===i);
    const eggPreview=unlocked?('<div class="dex-egg-preview"><b>蛋型图鉴</b><div class="dex-egg-pair">'+eggArt({species:i,tint:0,star:Math.max(1,best||1),shiny:false},{compact:true,labels:false})+(shinyEggKnown?eggArt({species:i,tint:0,star:Math.max(1,best||1),shiny:true},{compact:true,labels:false}):'<span class="dex-shiny-egg-locked">✦ 闪光蛋未发现</span>')+'</div><small>每个怪物品种都有独立蛋壳纹样；闪光蛋会持续发光。</small></div>'):'<div class="dex-egg-preview locked"><b>蛋型图鉴</b><span class="unknown-egg">?</span><small>发现这个品种后解锁蛋型。</small></div>';

    const swatches=DEX_COLORS.map((c,ci)=>{
      const has=!!s.dex.combos[i+'-'+ci];
      const count=currentList.filter(m=>dexColorIndex(m)===ci&&!m.shiny).length;
      return has
        ?'<div class="dex-swatch '+(c.kind==='special'?'special':'')+'">'+dexSprite(i,ci,false)+'<small>'+c.name+'</small><b>当前 '+count+' 只</b></div>'
        :'<div class="dex-swatch unseen '+(c.kind==='special'?'special':'')+'"><span class="unknown">?</span><small>'+c.name+'</small><b>未收集</b></div>';
    }).join('');

    const shinySwatches=DEX_COLORS.map((c,ci)=>{
      const has=!!s.dex.shinyCombos?.[i+'-'+ci];
      const count=currentList.filter(m=>m.shiny&&dexColorIndex(m)===ci).length;
      return has
        ?'<div class="dex-swatch shiny-dex-swatch '+(c.kind==='special'?'special':'')+'">'+dexSprite(i,ci,true)+'<small>✦ '+c.name+'</small><b>当前 '+count+' 只</b></div>'
        :'<div class="dex-swatch unseen shiny-dex-swatch '+(c.kind==='special'?'special':'')+'"><span class="unknown">✦?</span><small>'+c.name+'</small><b>闪光未发现</b></div>';
    }).join('');

    return '<article class="dex-card '+(unlocked?'':'locked')+'">'
      +'<div class="dex-card-head">'+(unlocked?sprite(i,0):'<span class="unknown" style="display:grid;place-items:center;width:60px;height:60px;background:#6c6871;color:#fff;font-size:28px;border:2px solid #47434b">?</span>')
      +'<div><div class="dex-no">NO.'+String(i+1).padStart(2,'0')+'</div><div class="dex-title">'+(unlocked?sp.name:'？？？')+'</div><div class="dex-text">'+(unlocked?sp.element+'系 · '+sp.skill:'尚未遇见这个品种')+'</div></div></div>'
      +'<div class="dex-meta"><div><span>当前拥有</span><b>'+current+'</b></div><div><span>颜色解锁</span><b>'+colorSeen+' / '+colorTotal+'</b></div><div><span>闪光颜色</span><b>'+shinyColorSeen+' / '+colorTotal+'</b></div><div><span>当前最高星</span><b>'+(best?G.stars(best):'—')+'</b></div></div>'
      +'<div class="dex-text">'+(unlocked?sp.effect:'继续配种与孵化，解锁新的怪物。')+'</div>'
      +eggPreview
      +'<div class="dex-subtitle">普通颜色图鉴</div><div class="dex-swatches">'+swatches+'</div>'
      +'<div class="dex-subtitle shiny-dex-title">✦ 闪光颜色图鉴</div><div class="dex-swatches shiny-dex-grid">'+shinySwatches+'</div>'
      +'</article>';
  }).join('');

  $('dex-content').innerHTML=
    '<div class="dex-overview">'
    +'<div class="dex-stat"><small>品种收集</small><strong>'+seenSpecies+' / '+speciesTotal+'</strong><em>尚未收集 '+(speciesTotal-seenSpecies)+' 种</em></div>'
    +'<div class="dex-stat"><small>颜色收集</small><strong>'+seenColors+' / '+colorTotal+'</strong><em>尚未收集 '+(colorTotal-seenColors)+' 种</em></div>'
    +'<div class="dex-stat"><small>普通组合</small><strong>'+seenCombos+' / '+comboTotal+'</strong><em>尚未收集 '+(comboTotal-seenCombos)+' 个组合</em></div>'
    +'<div class="dex-stat shiny-dex-stat"><small>✦ 闪光组合</small><strong>'+seenShinyCombos+' / '+comboTotal+'</strong><em>每个品种 × 每种颜色独立解锁</em></div>'
    +'<div class="dex-stat"><small>当前持有怪物</small><strong>'+s.monsters.length+'</strong><em>Log记录 '+s.deaths+' 位</em></div>'
    +'</div>'
    +'<div class="dex-note">普通与闪光图鉴分开记录。只有真正出现过「该品种 + 该颜色」的闪光怪物，才会点亮对应的闪光颜色格；普通颜色药水只改变外观，不解锁颜色图鉴；配种出生或派遣带回会解锁。探索限定颜色药水属于例外，使用后可以解锁对应限定颜色。</div>'
    +'<div class="dex-board">'+colorBoard+'</div><div class="dex-species-grid">'+speciesCards+'</div>';
}
$('close-family').onclick=()=>$('family-dialog').close();$('cancel-sale').onclick=()=>$('sale-dialog').close();$('confirm-sale').onclick=()=>{settle();const selling=s.monsters.find(m=>m.id===sellTarget);if(selling)archiveMonster(selling,s);const result=G.sell(s,sellTarget);$('sale-dialog').close();if(result){safeFamilyRegistry(s);dirty=true;tell(name(result.monster)+' 已出售，获得 '+fmt(result.price)+' 灵能。');render();save();}else tell('这位伙伴已无法出售。');};
$('adopt').onclick=()=>{settle();const m=G.adopt(s);if(m){markDex(s,m,false);dirty=true;tell('一位新的 1 星伙伴搬进来了，天生生命为 5。');render();save();}};
function farmExpandBought(){normalizeFarmState(s);return Math.max(0,Math.floor((s.farmSlots-4)/2));}
function farmExpandCost(){return Math.round((1000*Math.pow(1.8,farmExpandBought()))/100)*100;}
function buyFarmExpansion(){
  normalizeFarmState(s);
  const cost=farmExpandCost();
  if(s.energy<cost){tell('灵能不足，需要 '+fmt(cost)+' 灵能。');return;}
  s.energy-=cost;
  s.farmSlots+=2;
  s.revision++;
  dirty=true;
  save();
  render();
  tell('生产牧场扩建成功！生产位 +2，现在共有 '+s.farmSlots+' 个生产位。下一次需要 '+fmt(farmExpandCost())+' 灵能。');
}
function expandCost(){
  const bought=Math.max(0,Math.floor((Math.max(30,s.capacity)-30)/10));
  return Math.min(150000,Math.max(600,Math.round((600*Math.pow(1.12,bought))/100)*100));
}
function talk(id,msg){const a=actors.get(id);if(!a)return;a.el.querySelector('.bubble').textContent=msg;a.el.classList.add('talk');a.talkUntil=performance.now()+2700;}
function pet(id){
  const m=s.monsters.find(m=>m.id===Number(id));
  if(!m)return;
  selected=m.id;
  dirty=true;
  render();
}
const RANCH_BOUNDS={minX:9,maxX:91,minY:56,maxY:83};
function clampRanchActor(a){
  if(!a)return;
  a.x=Math.max(RANCH_BOUNDS.minX,Math.min(RANCH_BOUNDS.maxX,Number(a.x)||50));
  a.y=Math.max(RANCH_BOUNDS.minY,Math.min(RANCH_BOUNDS.maxY,Number(a.y)||70));
  a.tx=Math.max(RANCH_BOUNDS.minX,Math.min(RANCH_BOUNDS.maxX,Number(a.tx)||a.x));
  a.ty=Math.max(RANCH_BOUNDS.minY,Math.min(RANCH_BOUNDS.maxY,Number(a.ty)||a.y));
}
function ranchSpawnPoint(){
  const existing=[...actors.values()];
  let best={x:12+Math.random()*76,y:58+Math.random()*23,score:-1};
  for(let i=0;i<48;i++){
    const p={x:RANCH_BOUNDS.minX+2+Math.random()*(RANCH_BOUNDS.maxX-RANCH_BOUNDS.minX-4),y:RANCH_BOUNDS.minY+1+Math.random()*(RANCH_BOUNDS.maxY-RANCH_BOUNDS.minY-2)};
    let score=999;
    for(const a of existing){
      const dx=p.x-a.x,dy=(p.y-a.y)*1.7;
      score=Math.min(score,Math.hypot(dx,dy));
    }
    if(!existing.length)score=999;
    if(score>best.score)best={...p,score};
  }
  return best;
}
function nudgeApartActors(){
  const list=[...actors.values()];
  // Dense ranches need a smaller personal radius; otherwise repulsion can push actors out forever.
  const min=Math.max(3.5,Math.min(7.0,7.4-list.length*.10));
  for(let i=0;i<list.length;i++)for(let j=i+1;j<list.length;j++){
    const a=list[i],b=list[j];
    let dx=a.x-b.x,dy=(a.y-b.y)*1.65;
    let d=Math.hypot(dx,dy);
    if(d<.01){dx=Math.random()-.5;dy=Math.random()-.5;d=Math.hypot(dx,dy)||1;}
    if(d<min){
      const push=Math.min(.08,(min-d)*.018);
      const nx=dx/d,ny=dy/d;
      a.x+=nx*push;b.x-=nx*push;
      a.y+=(ny/1.65)*push;b.y-=(ny/1.65)*push;
    }
  }
  // Clamp the stored coordinates themselves, not just CSS display coordinates.
  for(const a of list)clampRanchActor(a);
}
function syncActors(){
  normalizeFarmState(s);

  for(const [id,a] of actors){
    if(!s.monsters.some(m=>m.id===id)||!isInFarm(id)||isDispatched(id)){
      a.el.remove();
      actors.delete(id);
    }
  }

  for(const m of s.monsters){
    if(!isInFarm(m.id)||isDispatched(m.id))continue;

    let a=actors.get(m.id);
    if(!a){
      const el=document.createElement('button');
      el.type='button';
      el.className='critter idle';
      el.innerHTML='<span class="bubble"></span><span class="critter-sprite-slot"></span><span class="nameplate"></span>';
      $('creatures').append(el);
      const spawn=ranchSpawnPoint();
      a={
        el,
        x:spawn.x,y:spawn.y,
        tx:spawn.x,ty:spawn.y,vx:0,vy:0,
        state:'idle',
        until:performance.now()+1200+Math.random()*2200,
        talkUntil:0,lockUntil:0
      };
      el.onclick=e=>{
        e.preventDefault();e.stopPropagation();
        selected=m.id;
        a.state='idle';a.tx=a.x;a.ty=a.y;a.vx=0;a.vy=0;a.until=performance.now()+700;a.lockUntil=performance.now()+360;
        a.el.classList.remove('tap-shake');void a.el.offsetWidth;a.el.classList.add('tap-shake');
        setTimeout(()=>a.el?.classList.remove('tap-shake'),280);
        dirty=true;render();
      };
      actors.set(m.id,a);
    }

    // Refresh all visible state every sync, not only when the actor is created.
    // This fixes stale lock/favorite/star/color/shiny indicators.
    const spriteSlot=a.el.querySelector('.critter-sprite-slot');
    if(spriteSlot)spriteSlot.innerHTML=sprite(m.species,m.tint,m.shiny,m.specialColor);

    const plate=a.el.querySelector('.nameplate');
    if(plate)plate.textContent=(m.shiny?'✦ ':'')+G.stars(m.star)+' #'+m.id+(m.locked?' 🔒':'')+(m.favorite?' ❤':'');

    a.el.setAttribute('aria-label',name(m)+'，'+m.star+'星'+(m.locked?'，已锁定':'')+'，点击查看资料');
    a.el.style.setProperty('--size',(s.monsters.length>24?42:s.monsters.length>14?48:54)+'px');
    a.el.classList.toggle('chosen',m.id===selected);
    a.el.style.left=a.x+'%';
    a.el.style.top=a.y+'%';
  }


}
function frame(now){const dt=Math.min(.06,(now-lastFrame)/1000||0);lastFrame=now;if(!document.hidden){for(const [id,a] of actors){if(a.talkUntil&&now>a.talkUntil){a.el.classList.remove('talk');a.talkUntil=0;}if(!s.paused&&!(a.lockUntil&&now<a.lockUntil)){if(now>a.until){const roll=Math.random();a.state=roll<.63?'walk':roll<.90?'idle':'sleep';a.until=now+(a.state==='walk'?2600+Math.random()*4200:1700+Math.random()*4200);if(a.state==='walk'){a.tx=RANCH_BOUNDS.minX+2+Math.random()*(RANCH_BOUNDS.maxX-RANCH_BOUNDS.minX-4);a.ty=RANCH_BOUNDS.minY+1+Math.random()*(RANCH_BOUNDS.maxY-RANCH_BOUNDS.minY-2);}else if(a.state==='sleep')talk(id,'Zzz…');else if(Math.random()<.20)talk(id,['这里好舒服～','晒晒太阳～','今天也很悠闲。'][Math.floor(Math.random()*3)]);}if(a.state==='walk'){const dx=a.tx-a.x,dy=a.ty-a.y,d=Math.hypot(dx,dy);if(d<.7){a.state='idle';a.until=now+1200+Math.random()*1600;}else{const targetV=4.2,desiredX=dx/d*targetV,desiredY=dy/d*targetV*.68,blend=Math.min(1,dt*4.5);a.vx+=(desiredX-a.vx)*blend;a.vy+=(desiredY-a.vy)*blend;a.x+=a.vx*dt;a.y+=a.vy*dt;a.el.style.setProperty('--face',a.vx<-.05?-1:1);}}else{const damp=Math.max(0,1-dt*5);a.vx*=damp;a.vy*=damp;}}}
  if(!s.paused)nudgeApartActors();
  for(const [id,a] of actors){clampRanchActor(a);a.el.classList.toggle('walk',a.state==='walk'&&!(a.lockUntil&&now<a.lockUntil));a.el.classList.toggle('idle',a.state==='idle'||(a.lockUntil&&now<a.lockUntil));a.el.classList.toggle('sleep',a.state==='sleep');a.el.style.left=a.x+'%';a.el.style.top=a.y+'%';a.el.style.zIndex=Math.round(a.y*10);}
}requestAnimationFrame(frame);}
$('parent-a').onchange=e=>{chooseParent('a',Number(e.target.value)||null);};
$('parent-b').onchange=e=>{chooseParent('b',Number(e.target.value)||null);};
$('parent-a-btn').onclick=e=>{e.stopPropagation();toggleParentPicker('a');};
$('parent-b-btn').onclick=e=>{e.stopPropagation();toggleParentPicker('b');};
$('parent-a-picker').onclick=e=>{const b=e.target.closest('[data-parent-choice]');if(!b)return;const id=Number(b.dataset.parentChoice);if(isDispatched(id)){tell(name(s.monsters.find(m=>m.id===id))+' 正在派遣中，暂时不能设为亲代。');return;}if(isInActiveExpedition(id)){tell(name(s.monsters.find(m=>m.id===id))+' 正在远征中，暂时不能设为亲代。');return;}if(b.disabled)return;chooseParent('a',id);};
$('parent-b-picker').onclick=e=>{const b=e.target.closest('[data-parent-choice]');if(!b)return;const id=Number(b.dataset.parentChoice);if(isDispatched(id)){tell(name(s.monsters.find(m=>m.id===id))+' 正在派遣中，暂时不能设为亲代。');return;}if(isInActiveExpedition(id)){tell(name(s.monsters.find(m=>m.id===id))+' 正在远征中，暂时不能设为亲代。');return;}if(b.disabled)return;chooseParent('b',id);};
document.addEventListener('input',e=>{const q=e.target.closest?.('[data-parent-search]');if(!q)return;const which=q.dataset.parentSearch;parentSearch[which]=q.value;renderParentPicker(which);const next=$('parent-'+which+'-picker').querySelector('[data-parent-search]');if(next){next.focus();next.setSelectionRange(next.value.length,next.value.length);}});document.addEventListener('change',e=>{const sel=e.target.closest?.('[data-parent-sort]'),skillSel=e.target.closest?.('[data-parent-skill]'),starSel=e.target.closest?.('[data-parent-star]'),speciesSel=e.target.closest?.('[data-parent-species]');if(sel){const which=sel.dataset.parentSort;parentSort[which]=sel.value;renderParentPicker(which);return;}if(skillSel){const which=skillSel.dataset.parentSkill;parentSkillFilter[which]=skillSel.value;renderParentPicker(which);return;}if(starSel){const which=starSel.dataset.parentStar;parentStarFilter[which]=starSel.value;renderParentPicker(which);return;}if(speciesSel){const which=speciesSel.dataset.parentSpecies;parentSpeciesFilter[which]=speciesSel.value;renderParentPicker(which);}});document.addEventListener('click',e=>{if(!e.target.closest('.parent-picker')&&!e.target.closest('.parent-select-btn'))closeParentPickers();});
$('breed').onclick=()=>{manualBreedAttempt();};
$('auto-breed').onchange=e=>{settle();s.autoBreed=e.target.checked;if(s.autoBreed){s.manualBreedRepeat=false;s.manualBreedPairIds=[];runOnlineAutomation(true);}tell(s.autoBreed?'智能生蛋连发已开启：每轮都会重新选择双亲。':'智能生蛋连发已关闭。');dirty=true;render();save();};$('auto-breed-priority').onchange=e=>{s.autoBreedPriority=e.target.value==='skill'?'skill':'star';s.revision++;dirty=true;save();render();if(s.autoBreed)runOnlineAutomation(true);tell('智能生蛋已切换为「'+(s.autoBreedPriority==='star'?'高星优先':'配种技能优先')+'」。');};
$('manual-breed-repeat').onchange=e=>{
  if(e.target.checked){
    // Capture exactly the two parents currently shown on screen. Do not call settle()
    // or automation here, because those routines are allowed to repair/recommend a pair.
    const wantedA=s.parentA,wantedB=s.parentB;
    const a=s.monsters.find(m=>m.id===wantedA),b=s.monsters.find(m=>m.id===wantedB);
    if(!a||!b||a.id===b.id||a.gender===b.gender){
      e.target.checked=false;
      tell('请先选好一公一母作为亲代 A / B。');
      return;
    }
    s.autoBreed=false;
    s.parentA=wantedA;
    s.parentB=wantedB;
    s.manualBreedPairIds=[wantedA,wantedB];
    s.manualBreedRepeat=true;
    s.revision++;
    dirty=true;
    save();
    render();
    tell('固定双亲已锁定：'+name(a)+' × '+name(b)+'。之后只使用这两只，冷却结束且队列有空位时会自动继续。');
    // Start/retry immediately instead of waiting for the next global automation tick.
    try{runOnlineAutomation(true);}catch(err){console.error('Fixed breed immediate start error:',err);}
  }else{
    stopManualBreedRepeat('你手动关闭了连发');
    s.revision++;
    dirty=true;
    render();
    save();
  }
};$('auto-hatch').onchange=e=>{settle();s.autoHatch=e.target.checked;settle();render();save();};$('hatch').onclick=()=>{settle();if(!s.egg){tell('孵化巢里目前没有怪物蛋。');render();return;}if(s.egg.ready>Date.now()){tell('怪物蛋还没有孵化完成。');render();return;}if(s.monsters.length>=s.capacity){tell('牧场已满，先扩建或腾出位置再破壳。');render();return;}const m=G.hatch(s,Date.now());if(m){births([m]);tell(name(m)+' 已经成功破壳！');}else tell('这颗蛋没有成功孵化。');dirty=true;render();save();};if($('hatch-2'))$('hatch-2').onclick=()=>{settle();if(!s.egg2){tell('第二孵化栏目前没有怪物蛋。');render();return;}if(s.egg2.ready>Date.now()){tell('第二颗怪物蛋还没有孵化完成。');render();return;}if(s.monsters.length>=s.capacity){tell('牧场已满，先扩建或腾出位置再破壳。');render();return;}const m=G.hatchSecondary(s,Date.now());if(m){births([m]);tell(name(m)+' 已经成功破壳！');}else tell('这颗蛋没有成功孵化。');dirty=true;render();save();};$('motion').onclick=()=>{s.paused=!s.paused;render();save();};$('activity-list').onclick=e=>{const link=e.target.closest('[data-log-monster]');if(link)goToLogMonster(Number(link.dataset.logMonster));};$('roster').onclick=e=>{const b=e.target.closest('[data-id]');if(!b)return;const id=Number(b.dataset.id);if(bulkSellMode){const m=s.monsters.find(x=>x.id===id);if(!canBulkSell(m)){tell('这只怪物当前不能批量出售。');return;}if(bulkSellSelected.has(id))bulkSellSelected.delete(id);else bulkSellSelected.add(id);renderRoster();return;}selected=id;talk(selected,'我在这里！');dirty=true;render();};$('roster-quick').onclick=e=>{const b=e.target.closest('[data-quick]');if(!b)return;const m=s.monsters.find(x=>x.id===selected);if(!m)return;const act=b.dataset.quick;if(act==='favorite'){m.favorite=!m.favorite;tell(name(m)+(m.favorite?' 已加入我的最爱。':' 已取消最爱。'));}else if(act==='lock'){m.locked=!m.locked;tell(name(m)+(m.locked?' 已锁定。':' 已解除锁定。'));}else if(act==='autoUse'){m.autoUse=!m.autoUse;tell(name(m)+(m.autoUse?' 已设为自动优先。':' 已取消自动优先。'));}else if(act==='rename'){const next=prompt('给这只怪物起个名字吧（留空恢复默认名）',m.nickname||'');if(next===null)return;m.nickname=next.trim().slice(0,16);}else if(act==='family'){renderFamily(m);return;}else if(act==='farm'){setFarmAssignment(m.id,!isInFarm(m.id));return;}else if(act==='parentA'){if(s.parentB===m.id){tell('它已经是亲代 B。');return;}s.parentA=m.id;if(s.manualBreedRepeat){const p=G.pair(s);if(p[0]&&p[1]&&p[0].gender!==p[1].gender)s.manualBreedPairIds=[p[0].id,p[1].id];}tell(name(m)+' 已设为亲代 A。');}else if(act==='parentB'){if(s.parentA===m.id){tell('它已经是亲代 A。');return;}s.parentB=m.id;if(s.manualBreedRepeat){const p=G.pair(s);if(p[0]&&p[1]&&p[0].gender!==p[1].gender)s.manualBreedPairIds=[p[0].id,p[1].id];}tell(name(m)+' 已设为亲代 B。');}else if(act==='dispatch'){dispatchSelected=m.id;if(!dispatchTeamSelected.includes(m.id))dispatchTeamSelected=[m.id];setPage('dispatch');dirty=true;render();}else if(act==='sell'){if(!canBulkSell(m)){tell('这只怪物当前不能出售。');return;}sellTarget=m.id;$('sale-info').textContent='出售 '+name(m)+(m.shiny?'（闪光）':'')+'（'+m.star+' 星、❤ '+m.life+'/'+m.maxLife+'），获得 '+fmt(G.salePrice(m))+' 灵能。怪物将离开家园，无法撤回。';$('sale-dialog').showModal();return;}s.revision++;dirty=true;render();save();};$('bulk-select-toggle').onclick=()=>{bulkSellMode=true;bulkSellSelected.clear();renderRoster();};
$('bulk-select-all').onclick=()=>{bulkSellSelected.clear();for(const m of s.monsters)if(canBulkSell(m))bulkSellSelected.add(m.id);renderRoster();};
$('bulk-select-filtered').onclick=()=>{const list=getFilteredSellableMonsters();bulkSellSelected.clear();for(const m of list)bulkSellSelected.add(m.id);renderRoster();tell(list.length?'已勾选当前技能筛选下的 '+list.length+' 只怪物。':'当前技能筛选下没有可出售怪物。');};
$('cancel-bulk-sale').onclick=()=>{$('bulk-sale-dialog').close();pendingBulkSaleIds=[];};
$('confirm-bulk-sale').onclick=finalizeBulkSell;
$('bulk-select-cancel').onclick=cancelBulkSell;
$('bulk-sell-confirm').onclick=performBulkSell;
$('sort-roster').onchange=()=>renderRoster();$('sort-direction').onchange=()=>renderRoster();$('filter-skill').onchange=()=>renderRoster();$('filter-star').onchange=()=>renderRoster();$('filter-species').onchange=()=>renderRoster();$('filter-family').onchange=()=>renderRoster();$('filter-name').oninput=()=>renderRoster();function setPage(next){
  page=next;
  const farmOnly=document.querySelectorAll('.topline,.workspace,.collection,.activity-log-panel,.bottom,footer');
  farmOnly.forEach(el=>{
    const show=next==='farm';
    el.hidden=!show;
    if(el.classList.contains('workspace'))el.style.display=show?'grid':'none';
    else if(show)el.style.removeProperty('display');
    else el.style.display='none';
  });

  const dp=$('dispatch-page');
  if(dp){dp.hidden=next!=='dispatch';dp.style.display=next==='dispatch'?'block':'none';}
  const ep=$('expedition-page');
  if(ep){ep.hidden=next!=='expedition';ep.style.display=next==='expedition'?'block':'none';}
  $('shop-page').style.display=next==='shop'?'block':'none';
  $('bag-page').style.display=next==='bag'?'block':'none';
  $('dex-page').style.display=next==='dex'?'block':'none';
  $('skill-page').style.display=next==='skills'?'block':'none';

  $('dispatch-btn').setAttribute('aria-pressed',String(next==='dispatch'));
  if($('expedition-btn'))$('expedition-btn').setAttribute('aria-pressed',String(next==='expedition'));
  $('shop-btn').setAttribute('aria-pressed',String(next==='shop'));
  $('bag-btn').setAttribute('aria-pressed',String(next==='bag'));
  $('dex-btn').setAttribute('aria-pressed',String(next==='dex'));
  $('skill-btn').setAttribute('aria-pressed',String(next==='skills'));

  if(next==='dispatch')renderDispatch();
  if(next==='expedition'&&window.QinsterExpedition?.render)window.QinsterExpedition.render();
  if(next==='dex')renderDex();
  if(next==='bag'){renderShopTarget();renderBag();}
  if(next==='shop'){renderColorPotionShop();renderShopOwnedCounts();}
  if(next==='skills')renderSkillLibrary();
  if(next==='farm'){dirty=true;render();}
  window.scrollTo(0,0);
}
$('dispatch-btn').onclick=()=>{setPage('dispatch');};if($('expedition-btn'))$('expedition-btn').onclick=()=>{setPage('expedition');};$('shop-btn').onclick=()=>{setPage('shop');};$('bag-btn').onclick=()=>{setPage('bag');};
$('dex-btn').onclick=()=>{setPage('dex');};
$('skill-btn').onclick=()=>{setPage('skills');};document.querySelector('.skill-library-tabs').onclick=e=>{const b=e.target.closest('[data-skill-filter]');if(!b)return;skillLibraryFilter=b.dataset.skillFilter;renderSkillLibrary(skillLibraryFilter);};
$('back-farm').onclick=()=>{setPage('farm');};$('back-from-bag').onclick=()=>{setPage('farm');};$('back-from-dispatch').onclick=()=>{setPage('farm');};if($('back-from-expedition'))$('back-from-expedition').onclick=()=>{setPage('farm');};
$('back-from-dex').onclick=()=>{setPage('farm');};
$('back-from-skills').onclick=()=>{setPage('farm');};
document.querySelector('.brand').onclick=e=>{e.preventDefault();setPage('farm');};
function buyStarterMonster(gender){
  settle();
  if(s.monsters.length>=s.capacity){tell('怪物盒已满，请先扩建或腾出位置。');return;}
  const cost=100;
  if(!spend(cost))return;
  const m=G.createMonster(s.nextId++,0,1,[1,1,1,1,1],[]);
  m.gender=gender==='母'?'母':'公';
  m.rescue=false;
  m.baseLife=5;m.life=5;m.maxLife=5;
  ensureMonsterSystemsMonster(m);
  s.monsters.push(m);
  markDex(s,m,false);
  if(!s.parentA||!s.monsters.some(x=>x.id===s.parentA))s.parentA=m.id;
  if(s.autoFillFarm)autoManageFarm();
  recordActivity('monster',{monsterId:m.id,monsterName:name(m),source:'商店购买 · 1★基础伙伴'});
  s.revision++;dirty=true;render();save();
  tell('已购买 1★ 苗芽团（'+m.gender+'）#'+m.id+'，已放入怪物盒。');
}
$('smart-fill-farm').onclick=()=>smartFillFarm();$('buy-building-energy').onclick=()=>buyBuilding('energy');$('buy-building-hatch').onclick=()=>buyBuilding('hatch');$('buy-building-shiny').onclick=()=>buyBuilding('shiny');$('buy-building-item').onclick=()=>buyBuilding('item');if($('buy-building-breed-rest'))$('buy-building-breed-rest').onclick=()=>buyBuilding('breedRest');if($('buy-second-hatch-slot'))$('buy-second-hatch-slot').onclick=()=>buySecondHatchSlot();if($('buy-starter-male'))$('buy-starter-male').onclick=()=>buyStarterMonster('公');if($('buy-starter-female'))$('buy-starter-female').onclick=()=>buyStarterMonster('母');$('auto-fill-farm').onchange=e=>{s.autoFillFarm=e.target.checked;if(s.autoFillFarm)autoManageFarm();s.revision++;dirty=true;render();save();tell(s.autoFillFarm?'自动补满已开启：只补空位，不会替换你手动选择的怪物。':'自动补满已关闭：农场完全由你手动安排。');};$('buy-farm-expand').onclick=()=>buyFarmExpansion();$('buy-capacity').onclick=()=>{
  if(s.capacity>=500){tell('怪物盒已经达到最大容量 500。');return;}
  const cost=expandCost();
  if(s.energy<cost){tell('灵能不足，需要 '+fmt(cost)+' 灵能。');return;}
  s.energy-=cost;
  s.capacity=Math.min(500,s.capacity+10);
  s.revision++;save();dirty=true;render();
  tell('扩建成功！怪物盒容量 +10。现在上限 '+s.capacity+(s.capacity>=500?'，已达到最大容量。':'。下一次扩建需要 '+fmt(expandCost())+' 灵能。'));
};
$('color-potions').onclick=e=>{const b=e.target.closest('[data-buy-color]');if(!b)return;const tint=Number(b.dataset.buyColor),qty=Math.max(1,Math.floor(Number(b.dataset.buyColorQty)||1));if(!spend(100000*qty))return;s.items.colors[tint]=(s.items.colors[tint]||0)+qty;recordActivity('item',{item:G.COLORS[tint]+'颜色药水 ×'+qty,source:'商店购买'});s.revision++;dirty=true;render();save();tell('已购买 '+qty+' 瓶'+G.COLORS[tint]+'颜色药水。');};
$('bag-items').onclick=e=>{const c=e.target.closest('[data-use-color]');if(c){useColorPotion(Number(c.dataset.useColor));return;}const sc=e.target.closest('[data-use-special-color]');if(sc){useSpecialColorPotion(Number(sc.dataset.useSpecialColor));return;}const i=e.target.closest('[data-use-item]');if(i){useStoredItem(i.dataset.useItem);return;}const lvl=e.target.closest('[data-level-skill]');if(lvl){levelSkill(lvl.dataset.levelSkill);return;}const ar=e.target.closest('[data-auto-reroll]');if(ar){const idx=Number(ar.dataset.autoReroll),sel=$('bag-items')?.querySelector('[data-reroll-target="'+idx+'"]');autoRerollUntilTarget(idx,sel?.value||'');return;}const r=e.target.closest('[data-use-reroll]');if(r){useRerollPotion(Number(r.dataset.useReroll));return;}if(e.target.closest('[data-use-life]')){useLifePotion();return;}if(e.target.closest('[data-use-time-cut]')){useTimeCutPotion();return;}if(e.target.closest('[data-use-time-instant]')){useTimeInstantPotion();return;}};

function buyPotionBulk(kind,label,price,qty=1,minLevel=0){
  qty=Math.max(1,Math.floor(Number(qty)||1));
  if(minLevel&&ranchLevel()<minLevel){tell('牧场 Lv'+minLevel+' 才能购买。');return false;}
  const total=price*qty;
  if(!spend(total))return false;
  if(kind==='star')s.items.star=(s.items.star||0)+qty;
  else s.items[kind]=(s.items[kind]||0)+qty;
  recordActivity('item',{item:label+' ×'+qty,source:'商店购买'});
  s.revision++;dirty=true;render();save();tell('已购买 '+qty+' 瓶'+label+'。');
  return true;
}
const POTION_SHOP={
  star:{label:'升星药水',price:100000,minLevel:0},
  shiny:{label:'闪光药水',price:SHOP_PRICES.shiny,minLevel:0},
  skill:{label:'技能药水',price:SHOP_PRICES.skill,minLevel:0},
  reroll:{label:'技能重塑药水',price:SHOP_PRICES.reroll,minLevel:0},
  life:{label:'生命药水',price:SHOP_PRICES.life,minLevel:0},
  timeCut:{label:'行程压缩药水',price:SHOP_PRICES.timeCut,minLevel:3},
  timeInstant:{label:'时跃药水',price:SHOP_PRICES.timeInstant,minLevel:3}
};
$('shop-page').addEventListener('click',e=>{
  const b=e.target.closest('[data-buy-potion]');
  if(!b)return;
  const kind=b.dataset.buyPotion,cfg=POTION_SHOP[kind];
  if(!cfg)return;
  const qty=Math.max(1,Math.floor(Number(b.dataset.buyQty)||1));
  buyPotionBulk(kind,cfg.label,cfg.price,qty,cfg.minLevel);
});
document.querySelector('.skill-library-tabs').onclick=e=>{const b=e.target.closest('[data-skill-filter]');if(!b)return;skillLibraryFilter=b.dataset.skillFilter;renderSkillLibrary(skillLibraryFilter);};$('dispatch-target').onchange=e=>{const id=Number(e.target.value)||null;if(id)chooseDispatchTarget(id);};$('dispatch-target-btn').onclick=e=>{e.stopPropagation();toggleDispatchPicker();};$('dispatch-sort').onchange=()=>renderDispatch();$('dispatch-search').oninput=()=>renderDispatch();$('dispatch-target-picker').onclick=e=>{const b=e.target.closest('[data-dispatch-target]');if(!b)return;e.stopPropagation();chooseDispatchTarget(Number(b.dataset.dispatchTarget));renderDispatchTargetPicker();const btn=$('dispatch-target-btn');if(btn)btn.innerHTML=dispatchTeamButtonHTML(dispatchTeam());};$('dispatch-target-picker').onchange=e=>{const sk=e.target.closest('[data-dispatch-skill-filter]'),st=e.target.closest('[data-dispatch-star-filter]'),sp=e.target.closest('[data-dispatch-species-filter]'),fa=e.target.closest('[data-dispatch-family-filter]');if(sk)dispatchSkillFilter=sk.value;if(st)dispatchStarFilter=st.value;if(sp)dispatchSpeciesFilter=sp.value;if(fa)dispatchFamilyFilter=fa.value;if(sk||st||sp||fa)renderDispatchTargetPicker();};document.addEventListener('click',e=>{if(!e.target.closest('.dispatch-target-tools'))closeDispatchPicker();});$('dispatch-missions').onclick=e=>{const auto=e.target.closest('[data-dispatch-auto]');if(auto){autoSelectDispatchTeam(Number(auto.dataset.dispatchAuto));return;}const b=e.target.closest('[data-dispatch-start]');if(!b)return;startDispatch(Number(b.dataset.dispatchStart));};$('dispatch-active').onclick=e=>{if(e.target.closest('[data-dispatch-claim]'))claimDispatch();};$('dispatch-top-status').onclick=e=>{if(e.target.closest('[data-top-dispatch-claim]')){claimDispatch();return;}if(e.target.closest('[data-open-dispatch]'))setPage('dispatch');};$('auto-dispatch').onchange=e=>{s.autoDispatch=e.target.checked;if(s.autoDispatch){s.manualDispatchRepeat=false;s.manualDispatchTeamIds=[];s.manualDispatchMission=null;runOnlineAutomation(true);}s.revision++;dirty=true;render();save();tell(s.autoDispatch?'智能派遣连发已开启：每轮重新选择队伍。':'智能派遣连发已关闭。');};
$('lock-manual-dispatch-team').onclick=()=>{
  const team=dispatchTeam();
  if(team.length<2||team.length>3){tell('请先手动选择 2–3 位队员。');return;}
  const selectedMission=$('auto-dispatch-mission')?.value||'highest';
  let ms=selectedMission==='highest'?highestAvailableMission():DISPATCH_MISSIONS.find(x=>x.id===selectedMission);
  if(!ms){tell('目前没有可用任务。');return;}
  s.manualDispatchRepeat=true;
  s.autoDispatch=false;
  s.manualDispatchTeamIds=team.map(m=>m.id);
  s.manualDispatchMission=ms.id;
  if($('manual-dispatch-repeat'))$('manual-dispatch-repeat').checked=true;
  dispatchTeamSelected=team.map(m=>m.id);
  dispatchSelected=dispatchTeamSelected[0]||null;
  s.revision++;dirty=true;save();render();
  if(!s.dispatch){
    const idx=DISPATCH_MISSIONS.findIndex(x=>x.id===ms.id);
    startDispatch(idx,true);
  }
  tell('固定队伍连发已开启：'+team.map(name).join('、')+' · '+ms.name+'。之后会自动领取并继续同一任务。');
};
$('manual-dispatch-repeat').onchange=e=>{if(e.target.checked){const team=dispatchTeam();if(team.length<2||team.length>3){e.target.checked=false;tell('请先手动选好 2–3 位队伍。');return;}const selectedMission=$('auto-dispatch-mission')?.value||'highest';const ms=selectedMission==='highest'?highestAvailableMission():DISPATCH_MISSIONS.find(x=>x.id===selectedMission);if(!ms){e.target.checked=false;tell('目前没有可用任务。');return;}s.manualDispatchRepeat=true;s.autoDispatch=false;s.manualDispatchTeamIds=team.map(m=>m.id);s.manualDispatchMission=ms.id;dispatchTeamSelected=team.map(m=>m.id);if(!s.dispatch)startDispatch(DISPATCH_MISSIONS.findIndex(x=>x.id===ms.id),true);tell('固定队伍连发已开启：'+team.map(name).join('、')+' · '+ms.name+'。');}else{stopManualDispatchRepeat('你手动关闭了连发');}s.revision++;dirty=true;render();save();};$('auto-dispatch-reserve-breed').onchange=e=>{s.autoDispatchReserveBreed=e.target.checked;s.revision++;dirty=true;render();save();tell(s.autoDispatchReserveBreed?'自动派遣会保留一公一母用于生蛋。':'已允许自动派遣使用所有符合条件的怪物。');};$('auto-dispatch-mission').onchange=e=>{s.autoDispatchMission=e.target.value;s.revision++;dirty=true;render();save();};$('auto-dispatch-power').onchange=e=>{s.autoDispatchPowerMode=e.target.value==='max'?'max':'efficient';s.revision++;dirty=true;render();save();tell('智能派遣已切换为「'+(s.autoDispatchPowerMode==='max'?'最高配置':'最低够用')+'」；派遣技能仍然优先匹配。');};
$('export-save').onclick=exportSave;
$('import-save').onclick=()=>{$('import-save-file').value='';$('import-save-file').click();};
$('import-save-file').onchange=e=>{
  const file=e.target.files&&e.target.files[0];
  if(!file)return;
  if(file.size>5*1024*1024){tell('这个存档文件太大，无法导入。');return;}
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const raw=JSON.parse(reader.result);
      if(!confirm('导入后会覆盖当前这份游戏进度。确定继续吗？'))return;
      importSaveObject(raw);
    }catch(err){
      tell('导入失败：这不是有效的 Qinster 牧场存档。');
    }
  };
  reader.onerror=()=>tell('读取存档失败，请重新选择文件。');
  reader.readAsText(file);
};
function openGuide(){document.body.classList.add('modal-open');document.querySelectorAll('[data-guide-tab]').forEach((b,i)=>b.classList.toggle('active',i===0));document.querySelectorAll('[data-guide-panel]').forEach((p,i)=>p.hidden=i!==0);$('guide').showModal();}function closeGuide(){document.body.classList.remove('modal-open');$('guide').close();}$('skill-drop-actions').onclick=e=>{const b=e.target.closest('[data-accept-skill]');if(b&&s.pendingSkillDrop){const drop=s.pendingSkillDrop,m=s.monsters.find(x=>x.id===drop.monsterId);if(m){const idx=Number(b.dataset.acceptSkill);ensureMonsterSystemsMonster(m);if(idx<=1||(idx===3&&m.shiny)){m.extraSkills[idx]=drop.skillId;m.extraSkillLv[idx]=idx===3?Math.max(5,drop.lv):drop.lv;refreshLifeCapacity(m,true);tell(name(m)+' 学会了「'+extraSkill(drop.skillId).name+' Lv'+m.extraSkillLv[idx]+'」。');}}s.pendingSkillDrop=null;$('skill-drop-dialog').close();s.revision++;dirty=true;render();save();return;}if(e.target.closest('[data-discard-skill]')){s.pendingSkillDrop=null;$('skill-drop-dialog').close();save();tell('你放弃了这次探索发现的技能。');}};
$('close-skill-drop').onclick=()=>{s.pendingSkillDrop=null;$('skill-drop-dialog').close();save();};
if($('sound-btn'))$('sound-btn').onclick=()=>{refreshSoundUI();$('sound-dialog').showModal();};
if($('sound-close'))$('sound-close').onclick=()=>$('sound-dialog').close();
if($('sound-enabled'))$('sound-enabled').onchange=e=>{audioPrefs.enabled=!!e.target.checked;saveAudioPrefs();if(audioPrefs.enabled){ensureAudio();playSfx('click');}refreshSoundUI();};
if($('sound-volume'))$('sound-volume').oninput=e=>{audioPrefs.volume=Math.max(0,Math.min(1,Number(e.target.value)/100));if(audioMaster&&audioCtx)audioMaster.gain.setTargetAtTime(audioPrefs.volume,audioCtx.currentTime,.01);saveAudioPrefs();refreshSoundUI();};
if($('sound-test'))$('sound-test').onclick=()=>{ensureAudio();playSfx('shiny');};
refreshSoundUI();
document.addEventListener('click',e=>{const b=e.target.closest?.('button');if(!b||!audioPrefs.enabled)return;const id=b.id||'';if(['sound-btn','sound-close','sound-test','breed','hatch','confirm-sale'].includes(id)||id.startsWith('buy-')||b.matches('[data-dispatch-start],[data-dispatch-claim],[data-top-dispatch-claim]'))return;playSfx('click');});
$('help').onclick=openGuide;$('close-guide-top').onclick=closeGuide;document.querySelector('.guide-tabs').onclick=e=>{const b=e.target.closest('[data-guide-tab]');if(!b)return;document.querySelectorAll('[data-guide-tab]').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('[data-guide-panel]').forEach(p=>p.hidden=p.dataset.guidePanel!==b.dataset.guideTab);document.querySelector('.guide-scroll').scrollTop=0;};$('guide').addEventListener('cancel',e=>{e.preventDefault();closeGuide();});$('close-birth').onclick=()=>$('birth').close();$('close-shiny-popup').onclick=()=>$('shiny-dialog').close();
document.addEventListener('visibilitychange',()=>{if(document.hidden){settle();save();}else{const list=G.advance(s,Date.now());dirty=true;births(list,true);render();save();}});window.addEventListener('pagehide',()=>{settle();save();});window.__bootMark&&__bootMark('08 绑定完成');
// ===== v191 onboarding + ranch identity =====
function ranchDisplayName(){ensureMonsterSystemsState(s);return (s.ranchName||'Qinster 牧场').trim().slice(0,16)||'Qinster 牧场';}
function setRanchName(value,announce=true){const next=String(value??'').trim().slice(0,16);if(!next){if(announce)tell('牧场名称不能为空。');return false;}s.ranchName=next;s.revision++;dirty=true;save();renderRanchIdentity();if(announce)tell('牧场名称已改为「'+next+'」。');return true;}
function renderRanchIdentity(){
  const h=document.querySelector('.topline h1');if(h)h.textContent=ranchDisplayName()+' · Lv'+ranchLevel();
  let tools=document.getElementById('ranch-identity-tools'),header=document.querySelector('header');
  if(header&&!tools){tools=document.createElement('div');tools.id='ranch-identity-tools';tools.innerHTML='<button type="button" class="subtle" id="rename-ranch">牧场名 ✎</button><button type="button" class="subtle" id="replay-tutorial">新手教学</button>';const wallet=header.querySelector('.wallet');header.insertBefore(tools,wallet||null);tools.querySelector('#rename-ranch').onclick=()=>{const next=prompt('修改牧场名称（1–16 个字符）',ranchDisplayName());if(next!==null)setRanchName(next,true);};tools.querySelector('#replay-tutorial').onclick=()=>startTutorial(true);}
}
const TUTORIAL_STEPS=[
{title:'欢迎来到你的牧场',body:'先给牧场取一个属于你的名字。以后可以随时修改。',target:'.topline'},
{title:'灵能与生产牧场',body:'生产牧场里的怪物会持续产生灵能。灵能用于配种、扩建、建筑和药水。',target:'.wallet'},
{title:'第一次配种',body:'选择一公一母作为亲代，然后点击「开始生蛋」。教学中的第一颗蛋保证不会孵化失败。',target:'#breed'},
{title:'孵化怪物蛋',body:'等待蛋孵化完成后点击破壳。星级、品种、颜色与闪光都会让收集和培育产生变化。',target:'#nest'},
{title:'认识新伙伴',body:'怪物有星级、生命、技能、颜色和血统。高级规则以后遇到时再慢慢学习。',target:'#companion'},
{title:'怪物盒与收藏',body:'怪物盒可以搜索、筛选、锁定、设为最爱，也能进入家谱与图鉴。',target:'.collection'},
{title:'第一次派遣',body:'进入派遣，选择「牧场巡查」并使用系统推荐队伍。教学第一次任务会缩短到约 10 秒。',target:'#dispatch-btn'},
{title:'商店、建筑与背包',body:'灵能可以扩建、升级建筑和购买药水；获得的道具会进入背包。',target:'#shop-btn'},
{title:'开始自由培育',body:'接下来由你决定路线：高星血统、稀有技能、颜色、闪光、家族与高级派遣。',target:null}
];
let tutorialBox=null,tutorialHighlight=null;
function clearTutorialHighlight(){if(tutorialHighlight){tutorialHighlight.classList.remove('tutorial-highlight');tutorialHighlight=null;}}
function ensureTutorialUI(){if(document.getElementById('tutorial-v191-style'))return;const st=document.createElement('style');st.id='tutorial-v191-style';st.textContent='.ranch-identity-tools{display:flex;gap:6px;margin-left:auto}.ranch-identity-tools+.wallet{margin-left:0}.tutorial-highlight{position:relative!important;z-index:10001!important;outline:4px solid #f2c451!important;outline-offset:4px!important}#tutorial-v191{position:fixed;z-index:20000;right:18px;bottom:18px;width:min(390px,calc(100vw - 24px));background:#d7d7da;color:#202126;border:4px solid #242229;box-shadow:6px 6px 0 rgba(0,0,0,.45);padding:12px}#tutorial-v191 h3{margin:0 0 7px;background:#2c2933;color:#fff;padding:8px;border-bottom:3px solid #e33b34;font-size:16px}#tutorial-v191 p{font-size:11px;line-height:1.55;margin:8px 0}.tutorial-step{font-size:9px;color:#625f68}.tutorial-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.tutorial-actions button{flex:1 1 100px}.tutorial-name-row{display:flex;gap:6px;margin-top:8px}.tutorial-name-row input{min-width:0;flex:1}@media(max-width:760px){.ranch-identity-tools{display:none}#tutorial-v191{left:12px;right:12px;bottom:12px;width:auto}}';document.head.appendChild(st);}
function tutorialFreshEnough(){return (s.hatched||0)===0&&(s.monsters||[]).length<=2&&(s.ranchXp||0)<20;}
function renderTutorial(){ensureTutorialUI();clearTutorialHighlight();if(!s.tutorialActive){document.getElementById('tutorial-v191')?.remove();tutorialBox=null;return;}const step=Math.max(0,Math.min(TUTORIAL_STEPS.length-1,s.tutorialStep||0)),cfg=TUTORIAL_STEPS[step];if(!tutorialBox){tutorialBox=document.createElement('aside');tutorialBox.id='tutorial-v191';document.body.appendChild(tutorialBox);}const isName=step===0,isLast=step===TUTORIAL_STEPS.length-1;tutorialBox.innerHTML='<div class="tutorial-step">新手教学 '+(step+1)+' / '+TUTORIAL_STEPS.length+'</div><h3>'+cfg.title+'</h3><p>'+cfg.body+'</p>'+(isName?'<div class="tutorial-name-row"><input id="tutorial-ranch-name" maxlength="16" value="'+escapeActivity(ranchDisplayName())+'"><button class="primary" id="tutorial-save-name">确定</button></div>':'')+'<div class="tutorial-actions"><button class="secondary" id="tutorial-skip">跳过教学</button>'+(step>0?'<button class="secondary" id="tutorial-prev">上一步</button>':'')+(!isName?'<button class="primary" id="tutorial-next">'+(isLast?'开始自由培育':'下一步')+'</button>':'')+'</div>';const target=cfg.target?document.querySelector(cfg.target):null;if(target){target.classList.add('tutorial-highlight');tutorialHighlight=target;}tutorialBox.querySelector('#tutorial-skip').onclick=()=>finishTutorial('新手教学已跳过。你以后可以重新打开。');tutorialBox.querySelector('#tutorial-prev')?.addEventListener('click',()=>{s.tutorialStep=Math.max(0,step-1);save();renderTutorial();});tutorialBox.querySelector('#tutorial-next')?.addEventListener('click',()=>{if(isLast){finishTutorial('教学完成！欢迎来到「'+ranchDisplayName()+'」。');return;}s.tutorialStep=Math.min(TUTORIAL_STEPS.length-1,step+1);save();renderTutorial();});tutorialBox.querySelector('#tutorial-save-name')?.addEventListener('click',()=>{const input=tutorialBox.querySelector('#tutorial-ranch-name');if(setRanchName(input.value,false)){s.tutorialStep=1;save();render();renderTutorial();tell('欢迎来到「'+ranchDisplayName()+'」！');}});}
function startTutorial(force=false){if(force){s.tutorialCompleted=false;s.tutorialStep=0;}s.tutorialActive=true;s.tutorialStep=Math.max(0,Math.min(TUTORIAL_STEPS.length-1,s.tutorialStep||0));s.revision++;save();setPage('farm');renderTutorial();}
function finishTutorial(message='教学完成！'){s.tutorialCompleted=true;s.tutorialActive=false;s.tutorialStep=0;s.revision++;clearTutorialHighlight();document.getElementById('tutorial-v191')?.remove();tutorialBox=null;save();render();tell(message);}
function tutorialHeartbeat(){if(!s.tutorialActive)return;const step=s.tutorialStep||0;if(step===2&&totalQueuedEggs(s)>0){s.tutorialStep=3;save();renderTutorial();}else if(step===3&&(s.hatched||0)>0){s.tutorialStep=4;save();renderTutorial();}else if(step===6&&s.dispatch){s.tutorialStep=7;save();renderTutorial();}}
function initV191Tutorial(){renderRanchIdentity();ensureTutorialUI();if(!s.tutorialCompleted&&!s.tutorialActive&&tutorialFreshEnough())startTutorial(false);else if(s.tutorialActive)renderTutorial();setInterval(tutorialHeartbeat,500);}

safeFamilyRegistry(s);window.__bootMark&&__bootMark('09 家族完成');
ensureSkillDex(s);window.__bootMark&&__bootMark('10 技能图鉴完成');
populateSkillFilter();populateFamilyFilter();window.__bootMark&&__bootMark('11 筛选完成');
bindSkillTooltip();setPage('farm');window.__bootMark&&__bootMark('12 页面切换完成');
render();initV191Tutorial();window.__bootMark&&__bootMark('13 首次渲染完成');
runOnlineAutomation(true);window.__bootMark&&__bootMark('14 自动系统完成');
render();save();window.__bootMark&&__bootMark('15 启动完成');if(s.pendingSkillDrop)setTimeout(showPendingSkillDrop,120);requestAnimationFrame(frame);
setInterval(incubatorHeartbeat,250);
setInterval(()=>{if(document.visibilityState!=='hidden')refreshDispatchClock();},500);
setInterval(()=>{
  if(document.visibilityState!=='hidden'){
    try{settle();}catch(err){console.error('Settle tick error:',err);}
    try{runOnlineAutomation();}catch(err){console.error('Automation tick error:',err);}
    try{render();}catch(err){console.error('Render tick error:',err);}
    const energyEl=$('energy');
    if(energyEl)energyEl.textContent=fmtEnergy(s.energy);
  }
},1000);
setInterval(()=>{if(!document.hidden)save(false);},15000);
window.QinsterRuntime={getState:()=>s,G,name,sprite,save,render,tell,setPage,isDispatched,ensureMonsterSystemsMonster};
setTimeout(()=>runIntegrityAudit(),0);

window.__qinsterVersion='v256';
window.__qinsterReady=true;
window.__bootMark&&__bootMark('ENGINE READY');
const __eb=document.getElementById('boot-check');if(__eb)__eb.style.background='#234b2d';
let __n=0;setInterval(()=>{__n++;if(__eb)__eb.textContent='v256 · engine '+__n;},1000);
