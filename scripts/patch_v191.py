from pathlib import Path
p=Path('game.js')
s=p.read_text(encoding='utf-8')
if "window.__qinsterVersion='v191'" in s:
    print('v191 already applied')
    raise SystemExit(0)
old="return {version:9,memorial:[],deaths:0,revision:0,energy:200,ranchXp:0,monsters:[starterA,starterB],farmSlots:FARM_START_SLOTS"
new="return {version:9,memorial:[],deaths:0,revision:0,energy:200,ranchXp:0,ranchName:'Qinster 牧场',tutorialCompleted:false,tutorialStep:0,tutorialActive:false,monsters:[starterA,starterB],farmSlots:FARM_START_SLOTS"
assert old in s, 'fresh marker missing'
s=s.replace(old,new,1)
marker="function ensureMonsterSystemsState(state){\n"
inject="""function ensureMonsterSystemsState(state){
  if(typeof state.ranchName!=='string'||!state.ranchName.trim())state.ranchName='Qinster 牧场';
  state.ranchName=state.ranchName.trim().slice(0,16)||'Qinster 牧场';
  if(typeof state.tutorialCompleted!=='boolean')state.tutorialCompleted=false;
  if(!Number.isInteger(state.tutorialStep))state.tutorialStep=0;
  if(typeof state.tutorialActive!=='boolean')state.tutorialActive=false;
"""
assert marker in s, 'ensure state marker missing'
s=s.replace(marker,inject,1)
old_fail="const failChance=state.egg.shinyLineage?0:Math.max(0,Math.min(.12,Number.isFinite(rawFail)?rawFail:.01));"
if old_fail in s:
    s=s.replace(old_fail,"const failChance=state.tutorialActive?0:(state.egg.shinyLineage?0:Math.max(0,Math.min(.12,Number.isFinite(rawFail)?rawFail:.01)));",1)
old_end="end:now+Math.round(ms.duration*tm.duration)*1000,successChance:teamDispatchSuccessChance(team,ms)"
if old_end in s:
    s=s.replace(old_end,"end:now+Math.round((s.tutorialActive&&s.tutorialStep===6?10:ms.duration*tm.duration))*1000,successChance:teamDispatchSuccessChance(team,ms)",1)
render_marker="function render(){bindBagTargetControls();"
assert render_marker in s, 'render marker missing'
s=s.replace(render_marker,"function render(){renderRanchIdentity();bindBagTargetControls();",1)
boot_marker="safeFamilyRegistry(s);window.__bootMark&&__bootMark('09 家族完成');"
assert boot_marker in s, 'boot marker missing'
module=r'''// ===== v191 onboarding + ranch identity =====
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

'''
s=s.replace(boot_marker,module+boot_marker,1)
init_marker="render();window.__bootMark&&__bootMark('13 首次渲染完成');"
assert init_marker in s, 'init marker missing'
s=s.replace(init_marker,"render();initV191Tutorial();window.__bootMark&&__bootMark('13 首次渲染完成');",1)
s=s.replace("window.__qinsterVersion='v190';","window.__qinsterVersion='v191';")
s=s.replace("window.__qinsterVersion='v189';","window.__qinsterVersion='v191';")
s=s.replace("__eb.textContent='v190 · engine '+__n","__eb.textContent='v191 · engine '+__n")
s=s.replace("__eb.textContent='v189 · engine '+__n","__eb.textContent='v191 · engine '+__n")
p.write_text(s,encoding='utf-8')
print('patched v191')
