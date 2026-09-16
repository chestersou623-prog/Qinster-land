from pathlib import Path
import re

ROOT=Path(__file__).resolve().parents[1]

def read(name): return (ROOT/name).read_text(encoding='utf-8')
def write(name,text): (ROOT/name).write_text(text,encoding='utf-8')
def replace_once(text,old,new,label):
    if old not in text: raise SystemExit(f'missing {label}: {old[:120]!r}')
    return text.replace(old,new,1)

# --- v199: wire the already-built final-stat breakdown directly into ally cards ---
rg=read('v199-roguelike-expedition.js')
rg=replace_once(rg,'/* Qinster release v279 */','/* Qinster release v280 */','v199 release header')
old_mon="function monCard(m,run,i){const hp=hpPct(run,m.id),pos=['前卫','中卫','后卫'][i],bs=battleSkillFor(m),v=st(m);return `<div class=\"rg-mon\">${R()?.sprite?.(m.species,m.tint,m.shiny,m.specialColor)||''}<b>${monsterName(m)} ${stars(m)}${m.shiny?' ✦':''}</b><small>${pos} · ${STAT.map((x,j)=>x+fmt2(v[j])).join(' · ')}</small><small style=\"color:#6d2a73\">战斗技能：${bs.name} · ${bs.text}</small><div class=\"rg-position-picks\" style=\"display:grid;grid-template-columns:repeat(3,1fr);gap:3px;margin:5px 0\">${['前卫','中卫','后卫'].map((name,j)=>`<button type=\"button\" class=\"secondary ${i===j?'on':''}\" data-rg-set-position=\"${j}\" data-rg-monster-id=\"${m.id}\" ${i===j?'disabled':''} style=\"padding:4px 2px;font-size:10px\">${name}</button>`).join('')}</div><div class=\"rg-hp\"><i style=\"width:${hp}%\"></i></div><small>远征生命 ${Math.round(hp)}% · 牧场生命 ${Math.max(0,Number(m.life)||0)}${run.knockouts?.[m.id]?' · 本局倒下 '+run.knockouts[m.id]+'次':''}${run.permaDead?.[m.id]?' · 已死亡':''}</small></div>`}"
new_mon="function monCard(m,run,i){const hp=hpPct(run,m.id),pos=['前卫','中卫','后卫'][i],bs=battleSkillFor(m);return `<div class=\"rg-mon rg-ally-mon\">${R()?.sprite?.(m.species,m.tint,m.shiny,m.specialColor)||''}<b>${monsterName(m)} ${stars(m)}${m.shiny?' ✦':''}</b><small>${pos} · 点击能力值可查看加成 / 削减来源</small>${finalStatsHTML(m,i,run)}<small style=\"color:#6d2a73\">战斗技能：${bs.name} · ${bs.text}</small><div class=\"rg-position-picks\" style=\"display:grid;grid-template-columns:repeat(3,1fr);gap:3px;margin:5px 0\">${['前卫','中卫','后卫'].map((name,j)=>`<button type=\"button\" class=\"secondary ${i===j?'on':''}\" data-rg-set-position=\"${j}\" data-rg-monster-id=\"${m.id}\" ${i===j?'disabled':''} style=\"padding:4px 2px;font-size:10px\">${name}</button>`).join('')}</div><div class=\"rg-hp\"><i style=\"width:${hp}%\"></i></div><small>远征生命 ${Math.round(hp)}% · 牧场生命 ${Math.max(0,Number(m.life)||0)}${run.knockouts?.[m.id]?' · 本局倒下 '+run.knockouts[m.id]+'次':''}${run.permaDead?.[m.id]?' · 已死亡':''}</small></div>`}"
rg=replace_once(rg,old_mon,new_mon,'ally monCard')

# When showing a completed battle, use the captured opening battle stats so one-battle buffs
# are not lost after nextBattleMods is cleared at the end of combat.
old_break="function finalStatBreakdown(m,pos,run){\n  const base=st(m),final=combatValue(m,pos,run),mods=combatMods(run);"
new_break="function finalStatBreakdown(m,pos,run){\n  const base=st(m),snap=run?.phase==='battleResult'?run?.battle?.allyInitialStats?.[m.id]:null,final=snap?{con:Number(snap.con??snap.hp)||0,atk:Number(snap.atk)||0,def:Number(snap.def)||0,spd:Number(snap.spd)||0,luck:Number(snap.luck)||0}:combatValue(m,pos,run),mods=combatMods(run);"
rg=replace_once(rg,old_break,new_break,'battle result stat snapshot')

# Keep the post-render decorator as a compatibility fallback, but only inspect ally groups.
old_decor="  const cards=[...document.querySelectorAll('#expedition-content .rg-team .rg-mon')];\n  const teamNow=activeTeam(run);\n  if(cards.length===teamNow.length){\n    cards.forEach((card,visualIndex)=>{\n      if(card.querySelector('.rg-final-stats'))return;\n      const pos=teamNow.length-1-visualIndex,m=teamNow[pos];if(m)card.insertAdjacentHTML('beforeend',finalStatsHTML(m,pos,run));\n    });\n  }"
new_decor="  const groups=[...document.querySelectorAll('#expedition-content .rg-team:not(.rg-enemy-team)')];\n  const teamNow=activeTeam(run);\n  for(const group of groups){\n    const cards=[...group.querySelectorAll(':scope > .rg-mon')];\n    if(cards.length!==teamNow.length)continue;\n    cards.forEach((card,visualIndex)=>{\n      if(card.querySelector('.rg-final-stats'))return;\n      const pos=teamNow.length-1-visualIndex,m=teamNow[pos];if(m)card.insertAdjacentHTML('beforeend',finalStatsHTML(m,pos,run));\n    });\n  }"
rg=replace_once(rg,old_decor,new_decor,'ally-only final stat decorator')
write('v199-roguelike-expedition.js',rg)

# --- v201 battle theater: replace the single text line with a live 5-stat grid ---
bt=read('v201-battle-theater.js')
if not bt.startswith('/* Qinster v280'):
    bt='/* Qinster v280 · live final stat colors */\n'+bt
helper="""function baseStats(m){try{return R()?.G?.stats?.(m)||[0,0,0,0,0]}catch{return[0,0,0,0,0]}}
function round1(v){return Math.round((Number(v)||0)*10)/10}
function allyStatCells(m,q={}){const b=baseStats(m),vals=[q.hp??q.con,q.atk,q.def,q.spd,q.luck],labels=['HP','攻','防','速','运'];return vals.map((v,i)=>{const f=round1(v),base=round1(b[i]),cls=f>base+.05?'up':f<base-.05?'down':'same';return `<i class="${cls}"><span>${labels[i]}</span><b>${f}</b><em>原 ${base}</em></i>`}).join('')}
"""
anchor="function battleKey(run){const b=run?.battle||{};return[run?.zone,run?.stage,b.kind,b.actions,b.win,(b.enemies||[]).map(e=>e.hp).join(',')].join('|')}\n"
bt=replace_once(bt,anchor,anchor+helper,'battle theater stat helpers')

old_css='.rg-bt-finalstats{white-space:normal!important;line-height:1.35;color:#d9e1eb!important}'
new_css='.rg-bt-statgrid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:2px;margin-top:3px}.rg-bt-statgrid i{display:block;min-width:0;background:#24212a;border:1px solid #77717e;padding:2px 1px;font-style:normal;color:#d9e1eb}.rg-bt-statgrid i span,.rg-bt-statgrid i b,.rg-bt-statgrid i em{display:block;white-space:nowrap;overflow:hidden;font-style:normal}.rg-bt-statgrid i span{font-size:7px;color:#bbb}.rg-bt-statgrid i b{font-size:11px;color:#f2c451}.rg-bt-statgrid i em{font-size:6px;color:#9ba0aa}.rg-bt-statgrid i.up b{color:#64d887}.rg-bt-statgrid i.down b{color:#ff7070}.rg-bt-enemy-finalstats{white-space:normal!important;line-height:1.35;color:#d9e1eb!important}'
bt=replace_once(bt,old_css,new_css,'battle theater stat grid css')

old_ally='<small class="rg-bt-finalstats" data-bt-ally-stats="${i}">最终：攻 ${Math.round(q.atk||0)} · 防 ${Math.round(q.def||0)} · 速 ${Math.round(q.spd||0)} · 运 ${Math.round(q.luck||0)}</small>'
new_ally='<div class="rg-bt-statgrid" data-bt-ally-stats="${i}">${allyStatCells(m,q)}</div>'
bt=replace_once(bt,old_ally,new_ally,'battle theater ally stat markup')
bt=replace_once(bt,'<small class="rg-bt-finalstats">最终：HP ${Math.round(e.maxHp||0)} · 攻 ${Math.round(e.atk||0)} · 防 ${Math.round(e.def||0)} · 速 ${Math.round(e.spd||0)} · 运 ${Math.round(e.luck||0)}</small>','<small class="rg-bt-enemy-finalstats">最终：HP ${Math.round(e.maxHp||0)} · 攻 ${Math.round(e.atk||0)} · 防 ${Math.round(e.def||0)} · 速 ${Math.round(e.spd||0)} · 运 ${Math.round(e.luck||0)}</small>','battle theater enemy stat class')
old_draw='const drawAllyStats=state=>{if(!state)return;allies.forEach((m,i)=>{const q=state[m.id],el=box.querySelector(`[data-bt-ally-stats="${i}"]`);if(q&&el)el.textContent=`最终：攻 ${Math.round(q.atk||0)} · 防 ${Math.round(q.def||0)} · 速 ${Math.round(q.spd||0)} · 运 ${Math.round(q.luck||0)}`})};'
new_draw='const drawAllyStats=state=>{if(!state)return;allies.forEach((m,i)=>{const q=state[m.id],el=box.querySelector(`[data-bt-ally-stats="${i}"]`);if(q&&el)el.innerHTML=allyStatCells(m,q)})};'
bt=replace_once(bt,old_draw,new_draw,'live battle stat updater')
write('v201-battle-theater.js',bt)

# --- version + cache keys ---
game=read('game.js')
game=re.sub(r'/\* Qinster v279[^*]*\*/','/* Qinster v280 expedition final stat display */',game,count=1)
game=replace_once(game,"window.__qinsterVersion='v279';","window.__qinsterVersion='v280';",'runtime version')
game=re.sub(r"'v279 · engine '\+__n","'v280 · engine '+__n",game,count=1)
write('game.js',game)

idx=read('index.html')
idx=replace_once(idx,"const BUILD='v279';","const BUILD='v280';",'build version')
idx=idx.replace('?v=279.1','?v=280')
write('index.html',idx)

pkg=read('package.json')
pkg=replace_once(pkg,'"version": "279.0.0"','"version": "280.0.0"','package version')
write('package.json',pkg)
lock=read('package-lock.json').replace('"version": "279.0.0"','"version": "280.0.0"')
write('package-lock.json',lock)

test=read('scripts/check-picker.mjs')
test=replace_once(test,"assert.equal(w.__qinsterVersion,'v279');","assert.equal(w.__qinsterVersion,'v280');",'picker runtime assertion')
write('scripts/check-picker.mjs',test)

print('v280 final stat display patch applied')
