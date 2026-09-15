from pathlib import Path

p=Path('v201-battle-theater.js')
s=p.read_text(encoding='utf-8')

old="""async function play(box,run,original,next,progress,enemies,allies){const key=battleKey(run),b=run.battle,events=Array.isArray(b.events)?b.events:[];let speed=1,skip=false;const allyHp=Object.fromEntries(allies.map(m=>[m.id,Math.max(0,Math.min(100,Number(b.startHp?.[m.id]??run.hp?.[m.id])||0))]));const enemyHp=Object.fromEntries(enemies.map(e=>[e.id,100])),speedBtn=box.querySelector('[data-bt-speed]'),skipBtn=box.querySelector('[data-bt-skip]'),feed=box.querySelector('.rg-bt-feed'),banner=box.querySelector('.rg-bt-banner');speedBtn?.addEventListener('click',()=>{speed=speed===1?2:speed===2?4:1;speedBtn.textContent='速度 ×'+speed});skipBtn?.addEventListener('click',()=>skip=true);const sleep=ms=>new Promise(r=>setTimeout(r,ms/Math.max(1,speed)));
  for(let i=0;i<events.length;i++){const ev=events[i];if(skip||battleKey(currentRun())!==key)break;banner.textContent=(ev.skillName?'技能 · '+ev.skillName:'ACTION '+(ev.action||i+1));const actor=ev.type==='ally'?box.querySelector(`[data-bt-ally=\"${allies.findIndex(m=>m.id===ev.actorId)}\"]`):box.querySelector(`[data-bt-enemy=\"${ev.enemyId||'e0'}\"]`);setAtb(actor,100);await sleep(90);actor?.classList.add('attack');await sleep(110);"""

new="""async function play(box,run,original,next,progress,enemies,allies){const key=battleKey(run),b=run.battle,events=Array.isArray(b.events)?b.events:[];let speed=1,skip=false;const allyHp=Object.fromEntries(allies.map(m=>[m.id,Math.max(0,Math.min(100,Number(b.startHp?.[m.id]??run.hp?.[m.id])||0))]));const enemyHp=Object.fromEntries(enemies.map(e=>[e.id,100])),speedBtn=box.querySelector('[data-bt-speed]'),skipBtn=box.querySelector('[data-bt-skip]'),feed=box.querySelector('.rg-bt-feed'),banner=box.querySelector('.rg-bt-banner');speedBtn?.addEventListener('click',()=>{speed=speed===1?2:speed===2?4:1;speedBtn.textContent='速度 ×'+speed});skipBtn?.addEventListener('click',()=>skip=true);const sleep=ms=>new Promise(r=>setTimeout(r,ms/Math.max(1,speed)));
  const gaugeState={allies:Object.fromEntries(allies.map(m=>[m.id,0])),enemies:Object.fromEntries(enemies.map(e=>[e.id,0]))};
  const drawGauges=state=>{allies.forEach((m,i)=>setAtb(box.querySelector(`[data-bt-ally=\"${i}\"]`),state.allies?.[m.id]||0));enemies.forEach(e=>setAtb(box.querySelector(`[data-bt-enemy=\"${e.id}\"]`),state.enemies?.[e.id]||0))};
  const animateGauges=async ev=>{const target=ev.gauges||{allies:{...gaugeState.allies},enemies:{...gaugeState.enemies}},from={allies:{...gaugeState.allies},enemies:{...gaugeState.enemies}},duration=Math.max(180,Math.min(950,(Number(ev.wait)||.35)*1350));let virtual=0,last=performance.now();while(virtual<duration&&!skip&&battleKey(currentRun())===key){const now=performance.now();virtual+=(now-last)*Math.max(1,speed);last=now;const q=Math.min(1,virtual/duration),cur={allies:{},enemies:{}};allies.forEach(m=>{const a=Number(from.allies[m.id]||0),z=Number(target.allies?.[m.id]||0);cur.allies[m.id]=a+(z-a)*q});enemies.forEach(e=>{const a=Number(from.enemies[e.id]||0),z=Number(target.enemies?.[e.id]||0);cur.enemies[e.id]=a+(z-a)*q});drawGauges(cur);if(q>=1)break;await new Promise(r=>requestAnimationFrame(r))}allies.forEach(m=>gaugeState.allies[m.id]=Number(target.allies?.[m.id]||0));enemies.forEach(e=>gaugeState.enemies[e.id]=Number(target.enemies?.[e.id]||0));drawGauges(gaugeState)};
  drawGauges(gaugeState);
  for(let i=0;i<events.length;i++){const ev=events[i];if(skip||battleKey(currentRun())!==key)break;banner.textContent=(ev.skillName?'技能 · '+ev.skillName:'ACTION '+(ev.action||i+1));await animateGauges(ev);if(skip||battleKey(currentRun())!==key)break;const actor=ev.type==='ally'?box.querySelector(`[data-bt-ally=\"${allies.findIndex(m=>m.id===ev.actorId)}\"]`):box.querySelector(`[data-bt-enemy=\"${ev.enemyId||'e0'}\"]`);await sleep(60);actor?.classList.add('attack');await sleep(110);"""

if old not in s:
    raise SystemExit('play prelude target not found')
s=s.replace(old,new,1)

old2="""    actor?.classList.remove('attack');setAtb(actor,0);await sleep(90);if(progress&&!skip)progress.textContent='行动 '+(ev.action||i+1)+' / '+events.length}"""
new2="""    actor?.classList.remove('attack');if(ev.type==='ally'){gaugeState.allies[ev.actorId]=0}else gaugeState.enemies[ev.enemyId||'e0']=0;setAtb(actor,0);await sleep(90);if(progress&&!skip)progress.textContent='行动 '+(ev.action||i+1)+' / '+events.length}"""
if old2 not in s:
    raise SystemExit('actor reset target not found')
s=s.replace(old2,new2,1)
s=s.replace("const STYLE_ID='qinster-v242-battle-theater-style';","const STYLE_ID='qinster-v243-battle-theater-style';",1)
p.write_text(s,encoding='utf-8')

for fn in ['game.js','index.html']:
    q=Path(fn);x=q.read_text(encoding='utf-8');x=x.replace('v242','v243');q.write_text(x,encoding='utf-8')

# cache-bust only the theater/expedition scripts in index if needed
q=Path('index.html');x=q.read_text(encoding='utf-8');x=x.replace('v199-roguelike-expedition.js?v=243','v199-roguelike-expedition.js?v=243').replace('v201-battle-theater.js?v=243','v201-battle-theater.js?v=243');q.write_text(x,encoding='utf-8')
