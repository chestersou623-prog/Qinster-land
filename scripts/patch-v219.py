from pathlib import Path
import re

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

# 1) Expand run items to 50.
items = """const RUN_ITEMS=[
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
];"""
s, n = re.subn(r"const RUN_ITEMS=\[.*?\n\];\nconst CURSES=", items+"\nconst CURSES=", s, count=1, flags=re.S)
assert n==1, 'RUN_ITEMS block not found'

# 2) Add battle skills and helpers before CURSES.
skills = r"""
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
"""
s=s.replace('const CURSES=[', skills+'\nconst CURSES=[',1)

# 3) Temple node metadata.
s=s.replace("challenge:['?','特殊事件','指定一只怪物进行能力判定'],boss", "challenge:['?','特殊事件','指定一只怪物进行能力判定'],temple:['◆','神庙','可能得到祝福，也可能遭受诅咒'],boss",1)

# 4) Ensure run meta includes temple mods.
s=s.replace("function ensureRunMeta(run){if(!run.items)run.items={};if(!run.curses)run.curses=[];if(!run.nextBattleMods)run.nextBattleMods={};return run}",
"function ensureRunMeta(run){if(!run.items)run.items={};if(!run.curses)run.curses=[];if(!run.nextBattleMods)run.nextBattleMods={};if(!run.templeMods)run.templeMods={};return run}")
s=s.replace("function combatMods(run){ensureRunMeta(run);const out=relicMods(run);for(const [k,v] of Object.entries(run.nextBattleMods||{}))out[k]=(out[k]||0)+v;for(const id of run.curses||[])",
"function combatMods(run){ensureRunMeta(run);const out=relicMods(run);for(const [k,v] of Object.entries(run.templeMods||{}))out[k]=(out[k]||0)+v;for(const [k,v] of Object.entries(run.nextBattleMods||{}))out[k]=(out[k]||0)+v;for(const id of run.curses||[]",1)

# 5) Item use: healing cannot revive; support 50 item effects.
old_use=re.search(r"function useRunItem\(id\)\{.*?save\(\)\}",s,re.S)
assert old_use, 'useRunItem not found'
new_use="""function useRunItem(id){const run=ensure()?.rogueActive;if(!run)return;ensureRunMeta(run);if((run.items[id]||0)<=0)return R()?.tell?.('这个道具已经没有了。');if(run.phase==='battleResult')return R()?.tell?.('战斗结算中不能使用道具。');const it=RUN_ITEMS.find(x=>x.id===id);if(!it)return;let used=false;if(it.heal){for(const mid of run.teamIds){if(hpPct(run,mid)>0&&canReviveInRun(run,mid))run.hp[mid]=Math.min(100,hpPct(run,mid)+it.heal*100)}run.log.push(`使用 ${it.name}：仍站立队员恢复 ${Math.round(it.heal*100)}% HP（倒下队员不会复活）。`);used=true}if(it.supply){run.supply=Math.min(9,run.supply+it.supply);run.log.push(`补给 +${it.supply}。`);used=true}if(it.kind==='cleanse'){const count=Math.min(run.curses.length,Number(it.cleanse)||1);if(count<=0)return R()?.tell?.('当前没有 Debuff。');const gone=run.curses.splice(0,count).map(cid=>CURSES.find(x=>x.id===cid)?.name||cid);run.log.push(`使用 ${it.name}：移除 ${gone.join('、')}。`);used=true}if(it.mods){for(const [k,v] of Object.entries(it.mods))run.nextBattleMods[k]=(run.nextBattleMods[k]||0)+v;run.log.push(`使用 ${it.name}：下一场战斗增益已准备。`);used=true}if(!used)return;run.items[id]--;save()}"""
s=s[:old_use.start()]+new_use+s[old_use.end():]

# 6) More varied item drops + temple in route pool.
s=s.replace("const base=stage===2||stage===5?['elite','battle','rest']:['battle','challenge','treasure','rest'];", "const base=stage===2||stage===5?['elite','battle','rest','temple']:['battle','challenge','treasure','rest','temple'];",1)

# 7) Camp: only living heal automatically; KO can revive ONE at camp by choice.
old_rest=re.search(r"function applyRest\(run\)\{.*?advance\(run\)\}",s,re.S)
assert old_rest,'applyRest not found'
new_rest="""function applyRest(run){const mods=relicMods(run),heal=30+(mods.rest||0)*100;run.campHeal=Math.round(heal);run.campRevived=false;for(const id of run.teamIds){if(hpPct(run,id)>0&&canReviveInRun(run,id))run.hp[id]=Math.min(100,hpPct(run,id)+heal);else if(!canReviveInRun(run,id))run.hp[id]=0}run.supply=Math.min(7,run.supply+1+(mods.rest?1:0));run.log.push(`营地：仍站立队员恢复 ${Math.round(heal)}%，补给恢复。倒下队员可在这里选择复活。`);run.phase='camp';save()}
function campRevive(run,id){if(run.phase!=='camp'||run.campRevived)return;const m=persistentMonster(id);if(!m||hpPct(run,id)>0||!canReviveInRun(run,id))return;run.hp[id]=30;run.campRevived=true;run.log.push(`营地复活：${monsterName(m)} 恢复至 30% 远征HP。`);save(`${monsterName(m)} 已在营地复活。`)}
function leaveCamp(run){run.campHeal=0;run.campRevived=false;advance(run)}"""
s=s[:old_rest.start()]+new_rest+s[old_rest.end():]

# 8) Temple mechanic with result screen.
temple_func="""
function temple(run){ensureRunMeta(run);const good=Math.random()<.55;if(good){const pool=[{name:'战神祝福',mods:{atk:.10}},{name:'石卫祝福',mods:{def:.10}},{name:'风灵祝福',mods:{spd:.10}},{name:'星运祝福',mods:{luck:.12}},{name:'四象祝福',mods:{atk:.05,def:.05,spd:.05,luck:.05}}],x=rand(pool);for(const [k,v] of Object.entries(x.mods))run.templeMods[k]=(run.templeMods[k]||0)+v;run.templeResult={good:true,title:x.name,text:'本次远征永久生效：'+Object.entries(x.mods).map(([k,v])=>`${({atk:'攻击',def:'防御',spd:'速度',luck:'幸运'})[k]} +${Math.round(v*100)}%`).join('、')};run.log.push(`神庙祝福：${x.name}。${run.templeResult.text}`)}else{const pool=CURSES.filter(c=>!run.curses.includes(c.id));const c=pool.length?rand(pool):rand(CURSES);if(!run.curses.includes(c.id))run.curses.push(c.id);run.templeResult={good:false,title:'神庙诅咒：'+c.name,text:c.text};run.log.push(`神庙诅咒：${c.name}（${c.text}）。`)}run.phase='templeResult';save()}
"""
s=s.replace('function challenge(run){',temple_func+'function challenge(run){',1)

# 9) Replace battle() with dodge + every third personal action battle skill.
start=s.index('function battle(run,kind){')
end=s.index('function offerRelic(run)',start)
new_battle=r"""function battle(run,kind){
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
  run.battle={kind,atb:true,actions,rounds:actions,elapsed,enemyMax,enemyHp:enemy,enemyAtk,enemyDef,enemySpd,enemyLuck,enemyPower,teamPower:Math.round(initialTeamPower),logs,events,startHp,win,reason,enemySpecies:ep.enemySpecies};run.nextBattleMods={};run.phase='battleResult';save()
}
"""
s=s[:start]+new_battle+s[end:]

# 10) chooseNode handles temple.
s=s.replace("if(node.type==='challenge')return challenge(run);if(node.type==='battle'", "if(node.type==='challenge')return challenge(run);if(node.type==='temple')return temple(run);if(node.type==='battle'",1)

# 11) UI for camp + temple result and skill names on monster cards.
s=s.replace("function monCard(m,run,i){const hp=hpPct(run,m.id),pos=['前卫','中卫','后卫'][i];return `<div class=\"rg-mon\">", "function monCard(m,run,i){const hp=hpPct(run,m.id),pos=['前卫','中卫','后卫'][i],bs=battleSkillFor(m);return `<div class=\"rg-mon\">",1)
s=s.replace("<small>${pos} · ${STAT.map((x,j)=>x+st(m)[j]).join(' · ')}</small><div class=\"rg-hp\">", "<small>${pos} · ${STAT.map((x,j)=>x+st(m)[j]).join(' · ')}</small><small style=\"color:#6d2a73\">战斗技能：${bs.name} · ${bs.text}</small><div class=\"rg-hp\">",1)

ui_funcs="""
function campHTML(run){const knocked=activeTeam(run).filter(m=>hpPct(run,m.id)<=0&&canReviveInRun(run,m.id));return `${runHeader(run)}${runInventoryHTML(run)}${teamHTML(run)}<section class="rg-panel"><div class="rg-title"><div><b>♥ 营地</b><small>仍站立队员已恢复 ${run.campHeal||30}%；倒下队员只有在营地才能复活</small></div><span>${run.campRevived?'本营地已复活1只':'可选择复活1只'}</span></div>${knocked.length?`<div class="rg-event-picks">${knocked.map(m=>`<button class="secondary" data-rg-camp-revive="${m.id}" ${run.campRevived?'disabled':''}><b>复活 ${monsterName(m)}</b><small>恢复至 30% 远征HP</small></button>`).join('')}</div>`:'<p class="rg-note">目前没有可复活的队员。</p>'}<button class="primary rg-mainbtn" data-rg-camp-leave>离开营地</button></section>`}
function templeResultHTML(run){const x=run.templeResult||{good:true,title:'神庙',text:'没有发生任何事'};return `${runHeader(run)}${runInventoryHTML(run)}<section class="rg-panel"><div class="rg-title"><div><b>${x.good?'◆ 神庙祝福':'◆ 神庙诅咒'} · ${x.title}</b><small>踏入神庙的结果已经生效</small></div></div><p class="${x.good?'rg-note':'rg-danger'}" style="font-size:13px;padding:10px"><b>${x.text}</b></p><button class="primary rg-mainbtn" data-rg-temple-next>继续远征</button></section>`}
"""
s=s.replace('function nodeHTML(run){',ui_funcs+'function nodeHTML(run){',1)
s=s.replace("function activeHTML(run){if(run.phase==='battlePreview')", "function activeHTML(run){if(run.phase==='camp')return campHTML(run);if(run.phase==='templeResult')return templeResultHTML(run);if(run.phase==='battlePreview')",1)

# 12) click handlers camp / temple.
s=s.replace("const rel=ev.target.closest?.('[data-rg-relic]');", "const cr=ev.target.closest?.('[data-rg-camp-revive]');if(cr){const run=ensure()?.rogueActive;if(run)campRevive(run,Number(cr.dataset.rgCampRevive));return}if(ev.target.closest?.('[data-rg-camp-leave]')){const run=ensure()?.rogueActive;if(run)leaveCamp(run);return}if(ev.target.closest?.('[data-rg-temple-next]')){const run=ensure()?.rogueActive;if(run){run.templeResult=null;advance(run)}return}const rel=ev.target.closest?.('[data-rg-relic]');",1)

# 13) update version.
s=re.sub(r"version:'[^']+'", "version:'v219-combat-skills-dodge-temple-50items'", s, count=1)
p.write_text(s,encoding='utf-8')

# Patch battle theater to display dodge/skill text.
p2=Path('v201-battle-theater.js')
t=p2.read_text(encoding='utf-8')
t=t.replace("banner.textContent='ACTION '+(ev.action||'');", "banner.textContent=(ev.skillName?'技能 · '+ev.skillName:'ACTION '+(ev.action||''));",1)
# Structured ally events: if miss, show MISS and no enemy hp change. Do conservative string replacement around float/feed logic.
t=t.replace("const dmg=Math.max(0,Number(ev.damage)||0);enemyHp=Math.max(0,Math.min(100,Number(ev.enemyHp)/Math.max(1,Number(b.enemyMax)||1)*100));", "const dmg=Math.max(0,Number(ev.damage)||0);if(!ev.miss)enemyHp=Math.max(0,Math.min(100,Number(ev.enemyHp)/Math.max(1,Number(b.enemyMax)||1)*100));",1)
t=t.replace("feed.innerHTML='<strong>'+esc(name(allies[idx]))+'</strong> 造成 '+dmg+' 伤害'+(ev.crit?' · 暴击！':'');", "feed.innerHTML='<strong>'+esc(name(allies[idx]))+'</strong>'+(ev.skillName?' 使用【'+esc(ev.skillName)+'】':'')+(ev.miss?' · MISS / 被闪避':' 造成 '+dmg+' 伤害'+(ev.crit?' · 暴击！':''));",1)
t=t.replace("feed.innerHTML='<strong>敌方攻击</strong> '+esc(name(allies[idx]))+' · 远征生命 -'+Math.round(loss)+'%';", "feed.innerHTML=ev.miss?'<strong>敌方攻击</strong> '+esc(name(allies[idx]))+' · MISS / 被闪避':'<strong>敌方攻击</strong> '+esc(name(allies[idx]))+' · 远征生命 -'+Math.round(loss)+'%';",1)
p2.write_text(t,encoding='utf-8')

print('v219 patch applied')