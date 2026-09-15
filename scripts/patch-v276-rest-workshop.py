from pathlib import Path

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

old="function expeditionRestText(m,now=Date.now()){syncExpeditionRest(m,now);const life=Math.max(0,Number(m.life)||0),max=maxLifeOf(m);if(life>=max)return `生命 ${life}/${max} · 已休息完成`;const base=Number(m.expeditionRestAt)||now,next=Math.max(0,EXPEDITION_REST_MS-(now-base)),need=Math.max(0,max-life),full=Math.max(0,next+(need-1)*EXPEDITION_REST_MS),fmt=ms=>{const min=Math.max(1,Math.ceil(ms/60000)),h=Math.floor(min/60),mm=min%60;return h?`${h}小时${mm?mm+'分':''}`:`${mm}分`};return `生命 ${life}/${max} · Rest中 · 下一点 ${fmt(next)} · 满生命 ${fmt(full)}`}"
new="function expeditionRestText(m,now=Date.now()){syncExpeditionRest(m,now);const life=Math.max(0,Number(m.life)||0),max=maxLifeOf(m);if(life>=max)return `生命 ${life}/${max} · 已休息完成`;const base=Number(m.expeditionRestAt)||now,next=Math.max(0,EXPEDITION_REST_MS-(now-base)),need=Math.max(0,max-life),full=Math.max(0,next+(need-1)*EXPEDITION_REST_MS),fmt=ms=>{const sec=Math.max(0,Math.ceil(ms/1000)),h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),ss=sec%60;return h?`${h}小时${m}分${ss}秒`:`${m}分${ss}秒`};return `生命 ${life}/${max} · Rest中 · 下一点 ${fmt(next)} · 满生命 ${fmt(full)}`}"
if old not in s: raise SystemExit('rest text pattern missing')
s=s.replace(old,new,1)

old="function eggWorkshopHTML(e){const f=Math.max(0,Number(e.loot?.eggFragment)||0),sf=Math.max(0,Number(e.loot?.shinyEggFragment)||0),available=x=>Math.max(0,Number(e.loot?.[x.currency||'eggFragment'])||0);return `<section class=\"rg-panel\"><div class=\"rg-title\"><div><b>蛋碎片工坊</b><small>消耗永久蛋碎片直接制作怪物蛋；蛋会进入现有孵化巢/等候队列</small></div><span class=\"rg-materials\">基础碎片 ${f} · 闪光碎片 ${sf}</span></div><div class=\"rg-final\" style=\"margin-top:8px\">${EGG_FRAGMENT_RECIPES.map(x=>`<button class=\"secondary rg-relic\" data-rg-craft-egg=\"${x.id}\" ${available(x)>=x.cost&&totalEggsLocal(S())<11?'':'disabled'}><b>${x.name} · ${x.cost}${x.currency==='shinyEggFragment'?'闪光碎片':'碎片'}</b><span>${x.text}</span></button>`).join('')}</div><p class=\"rg-note\"><b>碎片蛋五维保底：</b>1★ 50–100 · 2★ 100–200 · 3★ 200–300 · 4★ 300–400 · 5★ 400–500。五项能力分别保底。<br><b>远征秘藏蛋：</b>至少 2 项进入本星级最高20%，并使用远征限定种族池；2%闪光、8%特殊色。<br><b>闪光远征蛋：</b>消耗100闪光碎片，保证闪光，3★–5★，使用远征限定种族池并至少2项进入本星级最高20%。</p></section>`}"
new="function eggWorkshopHTML(e){const f=Math.max(0,Number(e.loot?.eggFragment)||0),sf=Math.max(0,Number(e.loot?.shinyEggFragment)||0),available=x=>Math.max(0,Number(e.loot?.[x.currency||'eggFragment'])||0),eggs=totalEggsLocal(S()),full=eggs>=11;return `<section class=\"rg-panel\"><div class=\"rg-title\"><div><b>蛋碎片工坊</b><small>消耗永久蛋碎片直接制作怪物蛋；蛋会进入现有孵化巢/等候队列</small></div><span class=\"rg-materials\">基础碎片 ${f} · 闪光碎片 ${sf} · 蛋位 ${eggs}/11${full?' · 已满':''}</span></div><div class=\"rg-final\" style=\"margin-top:8px\">${EGG_FRAGMENT_RECIPES.map(x=>`<button class=\"secondary rg-relic\" data-rg-craft-egg=\"${x.id}\" ${available(x)>=x.cost?'':'disabled'}><b>${x.name} · ${x.cost}${x.currency==='shinyEggFragment'?'闪光碎片':'碎片'}</b><span>${x.text}${full?' · 当前蛋位已满，点击会提示':''}</span></button>`).join('')}</div><p class=\"rg-note\">${full?'<b>当前孵化巢/等候队列已满（11/11）。</b> 先领取或孵化一枚蛋后即可制作；按钮保持可点击以显示原因。<br>':''}<b>碎片蛋五维保底：</b>1★ 50–100 · 2★ 100–200 · 3★ 200–300 · 4★ 300–400 · 5★ 400–500。五项能力分别保底。<br><b>远征秘藏蛋：</b>至少 2 项进入本星级最高20%，并使用远征限定种族池；2%闪光、8%特殊色。<br><b>闪光远征蛋：</b>消耗100闪光碎片，保证闪光，3★–5★，使用远征限定种族池并至少2项进入本星级最高20%。</p></section>`}"
if old not in s: raise SystemExit('workshop pattern missing')
s=s.replace(old,new,1)

old='<span class="rg-exp-trait"><b>生命 / Rest</b> ${esc(expeditionRestText(m))}</span>'
new='<span class="rg-exp-trait"><b>生命 / Rest</b> <span data-rg-rest-id="${m.id}">${esc(expeditionRestText(m))}</span></span>'
if old not in s: raise SystemExit('rest card pattern missing')
s=s.replace(old,new,1)

old="function render(){injectStyle();const box=document.getElementById('expedition-content');if(!box)return;const e=ensure();if(!e)return;box.innerHTML=e.rogueActive?`<div class=\"rogue\">${activeHTML(e.rogueActive)}</div>`:idleHTML(e);if(e.rogueActive)decorateFinalStats(e.rogueActive)}"
new="let restTicker=null;function refreshRestCountdowns(){const e=ensure();if(!e)return;document.querySelectorAll('[data-rg-rest-id]').forEach(el=>{const m=(e.box||[]).find(x=>Number(x.id)===Number(el.dataset.rgRestId));if(m)el.textContent=expeditionRestText(m,Date.now())})}function ensureRestTicker(){if(restTicker!=null)return;restTicker=setInterval(refreshRestCountdowns,1000)}function render(){injectStyle();const box=document.getElementById('expedition-content');if(!box)return;const e=ensure();if(!e)return;box.innerHTML=e.rogueActive?`<div class=\"rogue\">${activeHTML(e.rogueActive)}</div>`:idleHTML(e);if(e.rogueActive)decorateFinalStats(e.rogueActive);ensureRestTicker();refreshRestCountdowns()}"
if old not in s: raise SystemExit('render pattern missing')
s=s.replace(old,new,1)

if not s.startswith('/* Qinster release v276 */'):
    if s.startswith('/* Qinster release v275 */\n'):
        s=s.replace('/* Qinster release v275 */\n','/* Qinster release v276 */\n',1)
    else:
        s='/* Qinster release v276 */\n'+s
p.write_text(s,encoding='utf-8')

idx=Path('index.html')
h=idx.read_text(encoding='utf-8').replace('v275 · 等待','v276 · 等待').replace('v275 · engine','v276 · engine').replace('?v=275','?v=276')
idx.write_text(h,encoding='utf-8')

q=Path('game.js')
g=q.read_text(encoding='utf-8').replace("window.__qinsterVersion='v275'","window.__qinsterVersion='v276'",1)
q.write_text(g,encoding='utf-8')

pkg=Path('package.json')
t=pkg.read_text(encoding='utf-8').replace('"version": "275.0.0"','"version": "276.0.0"',1)
pkg.write_text(t,encoding='utf-8')

lock=Path('package-lock.json')
if lock.exists():
    t=lock.read_text(encoding='utf-8')
    t=t.replace('"version": "274.0.0"','"version": "276.0.0"',2).replace('"version": "275.0.0"','"version": "276.0.0"',2)
    lock.write_text(t,encoding='utf-8')

picker=Path('scripts/check-picker.mjs')
pt=picker.read_text(encoding='utf-8').replace("assert.equal(w.__qinsterVersion,'v275')","assert.equal(w.__qinsterVersion,'v276')")
picker.write_text(pt,encoding='utf-8')
