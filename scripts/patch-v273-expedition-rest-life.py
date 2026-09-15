from pathlib import Path
import json

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

# Rest / expedition-life helpers. Life now means remaining expedition entries, not knockout death.
needle="function expeditionBox(){return ensure()?.box||[]}\nfunction eligible(zone){const e=ensure();if(!e)return[];return (e.box||[]).filter(m=>m&&m.life>0&&(m.star||1)>=zone.minStar&&(!zone.shinyOnly||m.shiny))}"
repl="""function expeditionBox(){return ensure()?.box||[]}
const EXPEDITION_REST_MS=30*60*1000;
function maxLifeOf(m){return Math.max(1,Number(m?.maxLife)||20)}
function syncExpeditionRest(m,now=Date.now()){if(!m)return 0;const max=maxLifeOf(m);m.life=Math.max(0,Math.min(max,Number(m.life)||0));if(m.life>=max){m.expeditionRestAt=null;return m.life}if(!Number(m.expeditionRestAt))m.expeditionRestAt=now;const elapsed=Math.max(0,now-Number(m.expeditionRestAt)),gain=Math.floor(elapsed/EXPEDITION_REST_MS);if(gain>0){m.life=Math.min(max,m.life+gain);m.expeditionRestAt=Number(m.expeditionRestAt)+gain*EXPEDITION_REST_MS;if(m.life>=max)m.expeditionRestAt=null}return m.life}
function startExpeditionRest(m,now=Date.now()){if(!m)return;if((Number(m.life)||0)<maxLifeOf(m)&&!Number(m.expeditionRestAt))m.expeditionRestAt=now}
function expeditionRestText(m,now=Date.now()){syncExpeditionRest(m,now);const life=Math.max(0,Number(m.life)||0),max=maxLifeOf(m);if(life>=max)return `生命 ${life}/${max} · 已休息完成`;const base=Number(m.expeditionRestAt)||now,next=Math.max(0,EXPEDITION_REST_MS-(now-base)),need=Math.max(0,max-life),full=Math.max(0,next+(need-1)*EXPEDITION_REST_MS),fmt=ms=>{const min=Math.max(1,Math.ceil(ms/60000)),h=Math.floor(min/60),mm=min%60;return h?`${h}小时${mm?mm+'分':''}`:`${mm}分`};return `生命 ${life}/${max} · Rest中 · 下一点 ${fmt(next)} · 满生命 ${fmt(full)}`}
function syncAllExpeditionRest(e=ensure()){for(const m of e?.box||[])syncExpeditionRest(m);return e}
function eligible(zone){const e=syncAllExpeditionRest();if(!e)return[];return (e.box||[]).filter(m=>m&&Number(m.life)>0&&(m.star||1)>=zone.minStar&&(!zone.shinyOnly||m.shiny))}"""
assert needle in s
s=s.replace(needle,repl,1)

# Knockout no longer consumes persistent life or kills the monster.
start=s.index('function expeditionKnockout(')
end=s.index('\nfunction canReviveInRun',start)
s=s[:start]+"""function expeditionKnockout(run,m,logs=[]){if(!m)return;run.knockouts=run.knockouts||{};run.knockouts[m.id]=(run.knockouts[m.id]||0)+1;run.hp[m.id]=0;logs.push(`${monsterName(m)} 本场远征HP归0，已倒下；不会因此直接死亡，可在营地复活。`)}"""+s[end:]
# A monster that spent its last entry at departure can still revive within that active expedition.
s=s.replace("function canReviveInRun(run,id){const m=persistentMonster(id);return !!m&&Number(m.life)>0&&!run.permaDead?.[id]}","function canReviveInRun(run,id){const m=persistentMonster(id);return !!m&&!run.permaDead?.[id]}",1)

# Charge one persistent life on departure and block Resting monsters.
start=s.index('function startRun(){')
end=s.index('\nfunction rotateFormation',start)
old=s[start:end]
new="""function startRun(){const e=syncAllExpeditionRest(),zone=z(),t=team(),d=diff();if(!e)return;if(selectedDifficulty>(e.difficultyUnlocked?.[zone.id]||0))return R()?.tell?.('这个难度还没有解锁。');if(t.length!==3)return R()?.tell?.('需要选择 3 只怪物。');if(new Set(t.map(m=>m.id)).size!==3)return R()?.tell?.('不能重复选择同一只怪物。');if(t.some(m=>syncExpeditionRest(m)<=0))return R()?.tell?.('队伍中有怪物正在Rest，至少恢复1生命后才能远征。');if(zone.shinyOnly&&t.some(m=>!m.shiny))return R()?.tell?.('闪光远征只允许闪光怪物参加。');if(totalRemain(e,zone)<=0)return R()?.tell?.('这个地图与难度今天的免费次数已用完；可使用远征次数回复药水继续。');const k=attemptKey(zone);if(freeRemain(e,zone)>0)e.usedByZone[k]=used(e,zone)+1;else e.extraAttempts[k]=Math.max(0,bonusAttempts(e,zone)-1);e.lastZone=zone.id;e.lastDifficulty=selectedDifficulty;e.lastTeamIds=t.map(m=>m.id);const hp={};for(const m of t){hp[m.id]=100;m.life=Math.max(0,(Number(m.life)||0)-1);startExpeditionRest(m)}e.rogueActive={zone:zone.id,difficulty:selectedDifficulty,teamIds:t.map(m=>m.id),stage:0,maxStage:27,hp,supply:5,relics:[],energy:0,tempBadges:0,materials:{relicDust:0,starCrystal:0,eggFragment:0},options:makeOptions(0),phase:'map',log:[`${zone.label} · ${d.label} 开始。每只参战怪物消耗1生命；生命会每30分钟恢复1点。`],startedAt:Date.now(),formation:0,items:{},curses:[],nextBattleMods:{},bossCount:0,score:0,kills:{normal:0,elite:0,boss:0}};save(`${zone.label} · ${d.label} 开始：参战怪物各消耗1生命。`)}"""
s=s[:start]+new+s[end:]

# Replace old deterministic life/death settlement with probabilistic failure outcomes.
start=s.index('function applyExpeditionLifeCost(')
end=s.index('\nfunction finish(',start)
new="""function expeditionFailureDeathChance(m){const life=Math.max(0,Number(m?.life)||0);return life>=10?.05:life>=5?.08:life>=2?.10:.15}
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
}"""
s=s[:start]+new+s[end:]

# Box cards show Rest status; syncing happens before render.
s=s.replace("function expeditionBoxRosterHTML(e){const esc=window.QinsterPicker.esc,pool=[...(e.box||[])];","function expeditionBoxRosterHTML(e){syncAllExpeditionRest(e);const esc=window.QinsterPicker.esc,pool=[...(e.box||[])];",1)
s=s.replace("<span class=\"rg-exp-trait\"><b>种族值</b> ${esc(raceText(m))}</span>","<span class=\"rg-exp-trait\"><b>生命 / Rest</b> ${esc(expeditionRestText(m))}</span><span class=\"rg-exp-trait\"><b>种族值</b> ${esc(raceText(m))}</span>",1)
# Picker card gets remaining life / rest context too.
s=s.replace("<small><b>总能力</b> ${fmt2(total)}</small>","<small><b>总能力</b> ${fmt2(total)} · <b>生命</b> ${Math.max(0,Number(i.value.life)||0)}/${maxLifeOf(i.value)}</small>",1)
# Explain the new system on expedition Box page.
s=s.replace("闪光怪转入后远征基础五维额外 +5%。星级、性别、颜色、闪光、技能、家族和生命都会完整保留。</p>","闪光怪转入后远征基础五维额外 +5%。<br><b>远征生命：</b>每次出发消耗1生命；生命每30分钟自动恢复1点（离线也计算）。0生命进入Rest，恢复到1即可再次出发。战斗HP归0不会直接死亡；只有整次远征失败才会触发死亡/重伤判定。</p>",1)

# Version bump.
s=s.replace("version:'v272'","version:'v273'",1)
p.write_text(s,encoding='utf-8')

g=Path('game.js');t=g.read_text(encoding='utf-8').replace("__qinsterVersion='v272'","__qinsterVersion='v273'",1);g.write_text(t,encoding='utf-8')
i=Path('index.html');t=i.read_text(encoding='utf-8').replace('?v=272','?v=273');i.write_text(t,encoding='utf-8')
q=Path('package.json');data=json.loads(q.read_text(encoding='utf-8'));data['version']='273.0.0';q.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
cp=Path('scripts/check-picker.mjs');t=cp.read_text(encoding='utf-8').replace("assert.equal(w.__qinsterVersion,'v272')","assert.equal(w.__qinsterVersion,'v273')",1);cp.write_text(t,encoding='utf-8')
print('v273 patch applied')
