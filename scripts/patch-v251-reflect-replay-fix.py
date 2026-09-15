from pathlib import Path


def req(s, old, new, label):
    if old not in s:
        raise SystemExit('Missing expected pattern: '+label)
    return s.replace(old,new,1)

p=Path('v201-battle-theater.js')
s=p.read_text(encoding='utf-8')
s=s.replace('v250','v251')

old="const applyReflect=(ev)=>{const dmg=Math.max(0,Number(ev.reflectDamage)||0);if(!dmg)return '';const enemy=box.querySelector(`[data-bt-enemy=\"${ev.enemyId||'e0'}\"]`),pct=Math.max(0,Math.min(100,(Number(ev.enemyHp)||0)/Math.max(1,Number(ev.enemyMax)||1)*100));enemyHp[ev.enemyId||'e0']=pct;setHp(enemy,pct);enemy?.classList.add('hit');float(box,enemy,'反伤 -'+Math.round(dmg));setTimeout(()=>enemy?.classList.remove('hit'),180/Math.max(1,speed));if(pct<=0)enemy?.classList.add('rg-bt-dead');return '；反甲反伤 '+Math.round(dmg)};"
new="const applyReflect=(result,enemyId)=>{const dmg=Math.max(0,Number(result?.reflectDamage)||0);if(!dmg)return '';const id=enemyId||result?.enemyId||'e0',enemy=box.querySelector(`[data-bt-enemy=\"${id}\"]`),pct=Math.max(0,Math.min(100,(Number(result?.enemyHp)||0)/Math.max(1,Number(result?.enemyMax)||1)*100));enemyHp[id]=pct;setHp(enemy,pct);enemy?.classList.add('hit');float(box,enemy,'反伤 -'+Math.round(dmg));setTimeout(()=>enemy?.classList.remove('hit'),180/Math.max(1,speed));if(pct<=0)enemy?.classList.add('rg-bt-dead');return '；反甲反伤 '+Math.round(dmg)};"
s=req(s,old,new,'reflect helper')

old_aoe="else if(ev.aoe){for(const tr of ev.targets||[]){const idx=allies.findIndex(m=>m.id===tr.targetId),el=box.querySelector(`[data-bt-ally=\"${idx}\"]`);allyHp[tr.targetId]=Math.max(0,Number(tr.hpAfter)||0);setHp(el,allyHp[tr.targetId]);drawAllyHp(tr.targetId,allyHp[tr.targetId],ev.allyStats);if(!tr.miss){el?.classList.add('hit');float(box,el,'-'+Math.round(tr.hpDamage||0))}if(allyHp[tr.targetId]<=0)el?.classList.add('rg-bt-dead')}const reflectText=applyReflect(ev);feed.innerHTML='<span class=\"rg-bt-kind\">【'+esc(ev.attackType||'全体攻击')+'】</span><strong>敌方全体攻击！</strong> 全队受到伤害';await sleep(190);box.querySelectorAll('[data-bt-ally].hit').forEach(x=>x.classList.remove('hit'))}"
new_aoe="else if(ev.aoe){let reflectTotal=0,lastReflect=null;for(const tr of ev.targets||[]){const idx=allies.findIndex(m=>m.id===tr.targetId),el=box.querySelector(`[data-bt-ally=\"${idx}\"]`);allyHp[tr.targetId]=Math.max(0,Number(tr.hpAfter)||0);setHp(el,allyHp[tr.targetId]);drawAllyHp(tr.targetId,allyHp[tr.targetId],ev.allyStats);if(!tr.miss){el?.classList.add('hit');float(box,el,'-'+Math.round(tr.hpDamage||0))}if(Number(tr.reflectDamage)>0){reflectTotal+=Number(tr.reflectDamage)||0;lastReflect=tr}if(allyHp[tr.targetId]<=0)el?.classList.add('rg-bt-dead')}let reflectText='';if(lastReflect){const merged={...lastReflect,reflectDamage:reflectTotal};reflectText=applyReflect(merged,ev.enemyId)}feed.innerHTML='<span class=\"rg-bt-kind\">【'+esc(ev.attackType||'全体攻击')+'】</span><strong>敌方全体攻击！</strong> 全队受到伤害'+reflectText;await sleep(190);box.querySelectorAll('[data-bt-ally].hit').forEach(x=>x.classList.remove('hit'))}"
s=req(s,old_aoe,new_aoe,'aoe reflect replay')

old_single="else{const idx=allies.findIndex(m=>m.id===ev.targetId),el=box.querySelector(`[data-bt-ally=\"${idx}\"]`);allyHp[ev.targetId]=Math.max(0,Number(ev.hpAfter)||0);setHp(el,allyHp[ev.targetId]);drawAllyHp(ev.targetId,allyHp[ev.targetId],ev.allyStats);if(!ev.miss){el?.classList.add('hit');float(box,el,'-'+Math.round(ev.hpDamage||0))}feed.innerHTML='<span class=\"rg-bt-kind\">【'+esc(ev.attackType||ev.skillName||'普通攻击')+'】</span><strong>'+esc(enemies.find(e=>e.id===ev.enemyId)?.name||'敌人')+'行动！</strong> '+(ev.miss?'攻击被闪避':'HP -'+Math.round(ev.hpDamage||0)+(reflectText||''));await sleep(190);el?.classList.remove('hit');if(allyHp[ev.targetId]<=0)el?.classList.add('rg-bt-dead')}"
new_single="else{const idx=allies.findIndex(m=>m.id===ev.targetId),el=box.querySelector(`[data-bt-ally=\"${idx}\"]`);allyHp[ev.targetId]=Math.max(0,Number(ev.hpAfter)||0);setHp(el,allyHp[ev.targetId]);drawAllyHp(ev.targetId,allyHp[ev.targetId],ev.allyStats);if(!ev.miss){el?.classList.add('hit');float(box,el,'-'+Math.round(ev.hpDamage||0))}const reflectText=applyReflect(ev,ev.enemyId);feed.innerHTML='<span class=\"rg-bt-kind\">【'+esc(ev.attackType||ev.skillName||'普通攻击')+'】</span><strong>'+esc(enemies.find(e=>e.id===ev.enemyId)?.name||'敌人')+'行动！</strong> '+(ev.miss?'攻击被闪避':'HP -'+Math.round(ev.hpDamage||0)+(reflectText||''));await sleep(190);el?.classList.remove('hit');if(allyHp[ev.targetId]<=0)el?.classList.add('rg-bt-dead')}"
s=req(s,old_single,new_single,'single reflect replay')
p.write_text(s,encoding='utf-8')

for fname in ['game.js','v199-roguelike-expedition.js']:
    p=Path(fname); s=p.read_text(encoding='utf-8').replace('v250','v251'); p.write_text(s,encoding='utf-8')
p=Path('index.html');s=p.read_text(encoding='utf-8').replace('v250','v251').replace('?v=250','?v=251');p.write_text(s,encoding='utf-8')
