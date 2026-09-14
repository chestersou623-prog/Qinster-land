from pathlib import Path
p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

# Add battle preview builder before battle()
needle="function battle(run,kind){"
if needle not in s:
    raise SystemExit('battle function not found')
insert=r'''function enemyPreview(run,kind){const zone=z(run.zone),elite=kind==='elite',boss=kind==='boss',mult=zone.enemy*(1+run.stage*.085)*(elite?1.22:1)*(boss?1.48:1);return{kind,enemyMax:Math.round(240*mult+zone.tier*70),enemyAtk:Math.round(55*mult+zone.tier*11),enemyDef:Math.round(45*mult+zone.tier*9),enemySpd:Math.round(40*mult+zone.tier*8),enemyLuck:Math.round(32*mult+zone.tier*6)}}
function prepareBattle(run,kind){run.pendingBattle=enemyPreview(run,kind);run.phase='battlePreview';save()}
'''
s=s.replace(needle,insert+needle,1)

# Make battle consume the previewed stats so what the player sees is what they fight.
old="function battle(run,kind){ensureRunMeta(run);const zone=z(run.zone),t=activeTeam(run),elite=kind==='elite',boss=kind==='boss',mult=zone.enemy*(1+run.stage*.085)*(elite?1.22:1)*(boss?1.48:1),enemyMax=Math.round(240*mult+zone.tier*70),enemyAtk=Math.round(55*mult+zone.tier*11),enemyDef=Math.round(45*mult+zone.tier*9),enemySpd=Math.round(40*mult+zone.tier*8),enemyLuck=Math.round(32*mult+zone.tier*6);"
new="function battle(run,kind){ensureRunMeta(run);const zone=z(run.zone),t=activeTeam(run),elite=kind==='elite',boss=kind==='boss',ep=run.pendingBattle&&run.pendingBattle.kind===kind?run.pendingBattle:enemyPreview(run,kind),enemyMax=ep.enemyMax,enemyAtk=ep.enemyAtk,enemyDef=ep.enemyDef,enemySpd=ep.enemySpd,enemyLuck=ep.enemyLuck;run.pendingBattle=null;"
if old not in s:
    raise SystemExit('battle signature target not found')
s=s.replace(old,new,1)

# Route selection opens preview instead of resolving combat immediately.
old="if(node.type==='battle'||node.type==='elite'||node.type==='boss')return battle(run,node.type)"
new="if(node.type==='battle'||node.type==='elite'||node.type==='boss')return prepareBattle(run,node.type)"
if old not in s:
    raise SystemExit('chooseNode battle target not found')
s=s.replace(old,new,1)

# Add equal-size player/enemy cards and explicit enter-battle screen.
needle="function battleHTML(run){"
if needle not in s:
    raise SystemExit('battleHTML not found')
preview=r'''function battlePreviewHTML(run){const b=run.pendingBattle||enemyPreview(run,'battle'),t=activeTeam(run),enemyPower=Math.round(b.enemyMax*.7+b.enemyAtk*2+b.enemyDef*1.3+b.enemySpd*.5+b.enemyLuck*.25);const alive=t.filter(m=>hpPct(run,m.id)>0&&canReviveInRun(run,m.id));const teamPower=Math.round(alive.reduce((sum,m,i)=>{const p=combatValue(m,i,run);return sum+p.atk*1.1+p.def+p.spd*.65+p.luck*.35+p.con*.7},0));const kindName=b.kind==='boss'?'区域首领':b.kind==='elite'?'精英守卫':'野外守卫';const enemyCard=`<div class="rg-mon rg-enemy-match"><div class="sprite" style="width:58px;height:58px;margin:auto;display:grid;place-items:center;font-size:28px">${b.kind==='boss'?'★':b.kind==='elite'?'☠':'⚔'}</div><b>${kindName}</b><small>体质 ${b.enemyMax} · 攻击 ${b.enemyAtk} · 防御 ${b.enemyDef}</small><small>速度 ${b.enemySpd} · 幸运 ${b.enemyLuck}</small><div class="rg-hp"><i style="width:100%"></i></div><small>远征生命 100% · HP ${b.enemyMax}/${b.enemyMax}</small></div>`;return `${runHeader(run)}${runInventoryHTML(run)}<section class="rg-panel"><div class="rg-title"><div><b>战斗准备</b><small>先查看双方数值、当前HP、Debuff和道具，再决定是否进入战斗</small></div><span>${b.kind==='boss'?'BOSS':b.kind==='elite'?'精英':'普通'}</span></div><div class="rg-battle"><div class="rg-team">${t.map((m,i)=>monCard(m,run,i)).join('')}</div><div class="rg-vs">VS</div><div class="rg-team">${enemyCard}</div></div><p class="rg-note"><b>战力参考：</b>我方 ${teamPower} · 敌方 ${enemyPower}。注意：战力只是属性参考，<b>当前远征HP、站位、Debuff、暴击和8回合限制</b>都会影响输赢。</p><button class="primary rg-mainbtn" data-rg-enter-battle>进入战斗</button></section>`}
'''
s=s.replace(needle,preview+needle,1)

# Use same card-like enemy layout in result screen.
old='<div class="rg-enemy"><b>${b.kind===\'boss\'?\'区域首领\':b.kind===\'elite\'?\'精英守卫\':\'野外守卫\'}</b><div class="rg-hp"><i style="width:${Math.max(0,b.enemyHp/b.enemyMax*100)}%"></i></div><small>HP ${Math.round(b.enemyHp)}/${b.enemyMax}</small><small>攻击 ${b.enemyAtk||\'-\'} · 防御 ${b.enemyDef||\'-\'} · 速度 ${b.enemySpd||\'-\'} · 幸运 ${b.enemyLuck||\'-\'}</small><small>敌方估值 ${b.enemyPower||\'-\'} · 我方估值 ${b.teamPower||\'-\'}</small></div>'
new='<div class="rg-mon rg-enemy-match"><div class="sprite" style="width:58px;height:58px;margin:auto;display:grid;place-items:center;font-size:28px">${b.kind===\'boss\'?\'★\':b.kind===\'elite\'?\'☠\':\'⚔\'}</div><b>${b.kind===\'boss\'?\'区域首领\':b.kind===\'elite\'?\'精英守卫\':\'野外守卫\'}</b><small>体质 ${b.enemyMax} · 攻击 ${b.enemyAtk||\'-\'} · 防御 ${b.enemyDef||\'-\'}</small><small>速度 ${b.enemySpd||\'-\'} · 幸运 ${b.enemyLuck||\'-\'}</small><div class="rg-hp"><i style="width:${Math.max(0,b.enemyHp/b.enemyMax*100)}%"></i></div><small>远征生命 ${Math.round(Math.max(0,b.enemyHp/b.enemyMax*100))}% · HP ${Math.round(b.enemyHp)}/${b.enemyMax}</small><small>敌方估值 ${b.enemyPower||\'-\'} · 我方估值 ${b.teamPower||\'-\'}</small></div>'
if old not in s:
    raise SystemExit('result enemy card target not found')
s=s.replace(old,new,1)

# Active phase routing.
old="function activeHTML(run){if(run.phase==='battleResult')return battleHTML(run);"
new="function activeHTML(run){if(run.phase==='battlePreview')return battlePreviewHTML(run);if(run.phase==='battleResult')return battleHTML(run);"
if old not in s:
    raise SystemExit('activeHTML target not found')
s=s.replace(old,new,1)

# Enter battle button handler.
old="if(ev.target.closest?.('[data-rg-battle-next]')){const run=ensure()?.rogueActive;if(run)continueBattle(run);return}"
new="if(ev.target.closest?.('[data-rg-enter-battle]')){const run=ensure()?.rogueActive;if(run?.pendingBattle)battle(run,run.pendingBattle.kind);return}if(ev.target.closest?.('[data-rg-battle-next]')){const run=ensure()?.rogueActive;if(run)continueBattle(run);return}"
if old not in s:
    raise SystemExit('click handler target not found')
s=s.replace(old,new,1)

p.write_text(s,encoding='utf-8')
