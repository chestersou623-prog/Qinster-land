from pathlib import Path

# First apply the intended v213 combat/replay patch, fixing its syntax error in memory.
v213=Path('scripts/patch-v213-speed-ko-replay.py').read_text(encoding='utf-8')
v213=v213.replace("(ev.extra?'<strong>敌方速度追加！</strong> ':' )", "(ev.extra?'<strong>敌方速度追加！</strong> ':'')")
# Record effective speed on replay events so the gauge reflects actual combat speed.
v213=v213.replace("events.push({type:'ally',round,actorId:x.m.id,damage:Math.round(hit),crit,enemyHp:enemy});", "events.push({type:'ally',round,actorId:x.m.id,damage:Math.round(hit),crit,enemyHp:enemy,spd:p.spd});")
v213=v213.replace("events.push({type:'ally',round,actorId:x.m.id,damage:Math.round(hit2),crit:crit2,extra:true,enemyHp:enemy});", "events.push({type:'ally',round,actorId:x.m.id,damage:Math.round(hit2),crit:crit2,extra:true,enemyHp:enemy,spd:p.spd});")
v213=v213.replace("events.push({type:'enemy',round,targetId:target.m.id,hpLoss,extra,hpAfter:run.hp[target.m.id]});", "events.push({type:'enemy',round,targetId:target.m.id,hpLoss,extra,hpAfter:run.hp[target.m.id],spd:enemySpd});")
exec(compile(v213,'patch-v213-fixed','exec'))

p=Path('v201-battle-theater.js')
s=p.read_text(encoding='utf-8')

# Gauge styling: a compact row above the battlefield. Left -> right fill, full = action.
css_anchor=".rg-bt-field{position:relative;min-height:235px;border:3px solid #69636f;background:linear-gradient(#5d6b72 0 48%,#66734f 48% 100%);overflow:hidden}"
css_new=""".rg-bt-gauges{display:grid;grid-template-columns:minmax(0,1fr) 150px;gap:10px;margin:7px 0;padding:6px;background:#1d1a22;border:2px solid #57525e}.rg-bt-gauge-allies{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px}.rg-bt-gauge{min-width:0;padding:3px 4px;background:#2b2731;border:1px solid #706a77}.rg-bt-gauge small{display:block;font-size:8px;color:#fff3bf;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rg-bt-charge{height:7px;margin-top:3px;background:#111;border:1px solid #69636f;overflow:hidden}.rg-bt-charge i{display:block;width:0%;height:100%;background:#f2c451}.rg-bt-gauge.ready{box-shadow:0 0 0 2px #ffe36f}.rg-bt-gauge.dead{opacity:.32}.rg-bt-gauge.dead .rg-bt-charge i{width:0%!important}.rg-bt-gauge-enemy .rg-bt-charge i{background:#d8675f}
"""+css_anchor
if css_anchor not in s:
    raise SystemExit('gauge css anchor not found')
s=s.replace(css_anchor,css_new,1)

mobile_anchor="@media(max-width:760px){.rg-bt-field{min-height:205px}"
mobile_new="@media(max-width:760px){.rg-bt-gauges{grid-template-columns:1fr;gap:5px}.rg-bt-gauge-enemy{max-width:none}.rg-bt-field{min-height:205px}"
if mobile_anchor not in s:
    raise SystemExit('mobile gauge anchor not found')
s=s.replace(mobile_anchor,mobile_new,1)

# Raw/base speed label helper. Effective speed on actual actions comes from the replay event.
name_anchor="function name(m){try{return R()?.name?.(m)||R()?.G?.SPECIES?.[m.species]?.name||'怪物'}catch{return '怪物'}}"
name_new=name_anchor+"\nfunction statSpeed(m){try{return Math.round(Number(R()?.G?.stats?.(m)?.[3])||0)}catch{return 0}}"
if name_anchor not in s:
    raise SystemExit('speed helper anchor not found')
s=s.replace(name_anchor,name_new,1)

# Add the visible gauges between controls and battlefield.
field_anchor='<div class=\"rg-bt-field\"><div class=\"rg-bt-banner\">ROUND 1</div>'
gauges='''<div class=\"rg-bt-gauges\"><div class=\"rg-bt-gauge-allies\">${t.map((m,i)=>`<div class=\"rg-bt-gauge ${Math.max(0,Number(b.startHp?.[m.id] ?? run.hp?.[m.id])||0)<=0?'dead':''}\" data-bt-gauge-ally=\"${i}\"><small>${esc(name(m))} · 速 ${statSpeed(m)}</small><div class=\"rg-bt-charge\"><i></i></div></div>`).join('')}</div><div class=\"rg-bt-gauge rg-bt-gauge-enemy\" data-bt-gauge-enemy><small>敌方 · 速 ${Math.round(Number(b.enemySpd)||0)}</small><div class=\"rg-bt-charge\"><i></i></div></div></div>'''
if field_anchor not in s:
    raise SystemExit('battle field html anchor not found')
s=s.replace(field_anchor,gauges+field_anchor,1)

# Add a reusable gauge-fill animation. Playback speed button scales its duration too.
play_anchor="const sleep=ms=>new Promise(r=>setTimeout(r,ms/Math.max(1,speed)));\nconst events=Array.isArray(b.events)?b.events:[];"
play_new="""const sleep=ms=>new Promise(r=>setTimeout(r,ms/Math.max(1,speed)));
const chargeGauge=async(sel,spd,extra=false)=>{const g=box.querySelector(sel),bar=g?.querySelector('.rg-bt-charge i');if(!g||!bar||g.classList.contains('dead'))return;g.classList.remove('ready');bar.style.transition='none';bar.style.width='0%';await sleep(20);const base=extra?150:Math.max(320,1050-Math.min(700,Math.max(0,Number(spd)||0)));bar.style.transition=`width ${Math.max(80,base/Math.max(1,speed))}ms linear`;bar.style.width='100%';await sleep(base);g.classList.add('ready');await sleep(70);g.classList.remove('ready');bar.style.transition='none';bar.style.width='0%'};
const events=Array.isArray(b.events)?b.events:[];"""
if play_anchor not in s:
    raise SystemExit('play gauge helper anchor not found')
s=s.replace(play_anchor,play_new,1)

# Fill the relevant gauge immediately before each structured action.
ally_anchor="const a=box.querySelector(`[data-bt-ally=\\\"${idx}\\\"]`),enemy=box.querySelector('[data-bt-enemy]');\n      a?.classList.add('attack');await sleep(110);"
ally_new="const a=box.querySelector(`[data-bt-ally=\\\"${idx}\\\"]`),enemy=box.querySelector('[data-bt-enemy]');\n      await chargeGauge(`[data-bt-gauge-ally=\\\"${idx}\\\"]`,ev.spd,!!ev.extra);\n      a?.classList.add('attack');await sleep(110);"
if ally_anchor not in s:
    raise SystemExit('ally gauge action anchor not found')
s=s.replace(ally_anchor,ally_new,1)

enemy_anchor="const enemy=box.querySelector('[data-bt-enemy]'),el=box.querySelector(`[data-bt-ally=\\\"${idx}\\\"]`);\n      enemy?.classList.add('attack');await sleep(150);"
enemy_new="const enemy=box.querySelector('[data-bt-enemy]'),el=box.querySelector(`[data-bt-ally=\\\"${idx}\\\"]`);\n      await chargeGauge('[data-bt-gauge-enemy]',ev.spd||b.enemySpd,!!ev.extra);\n      enemy?.classList.add('attack');await sleep(150);"
if enemy_anchor not in s:
    raise SystemExit('enemy gauge action anchor not found')
s=s.replace(enemy_anchor,enemy_new,1)

# Once an ally reaches 0 HP, gray its gauge and prevent any future charge/attack animation.
ko_anchor="el?.querySelector('.rg-bt-hp i')?.style.setProperty('width',allyHp[idx]+'%');el?.classList.add('hit');\n      float(box,el,'-'+Math.max(1,Math.round(loss))+'%',false,false);"
ko_new="el?.querySelector('.rg-bt-hp i')?.style.setProperty('width',allyHp[idx]+'%');el?.classList.add('hit');if(allyHp[idx]<=0)box.querySelector(`[data-bt-gauge-ally=\\\"${idx}\\\"]`)?.classList.add('dead');\n      float(box,el,'-'+Math.max(1,Math.round(loss))+'%',false,false);"
if ko_anchor not in s:
    raise SystemExit('KO gauge anchor not found')
s=s.replace(ko_anchor,ko_new,1)

p.write_text(s,encoding='utf-8')
