from pathlib import Path

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

old="function challengeHTML(run){const c=run.challenge,t=activeTeam(run),zone=z(run.zone),target=70+zone.tier*58+run.stage*12;return `${runHeader(run)}${runInventoryHTML(run)}${teamHTML(run)}<section class=\"rg-panel\"><div class=\"rg-title\"><div><b>${c.title}</b><small>${c.text}</small></div><span>判定：${STAT[c.stat]} · 目标约 ${target}</span></div><p class=\"rg-note\">选择一只怪物处理这个事件。这里不再使用三只怪的平均值，因此培育专门擅长某项能力的怪物会有价值。</p><div class=\"rg-event-picks\">${t.map((m,i)=>`<button class=\"secondary\" data-rg-event-member=\"${i}\"><b>${monsterName(m)}</b><small>${STAT[c.stat]} ${st(m)[c.stat]}</small></button>`).join('')}</div></section>`}"
new="function challengeHTML(run){const c=run.challenge,t=activeTeam(run),zone=z(run.zone),target=70+zone.tier*58+run.stage*12,mods=relicMods(run),gain=Math.round((700+run.stage*210)*nodeRewardScale(zone,run.stage));const preview=m=>{const v=st(m)[c.stat],bonus=c.stat===4?(mods.luck||0)*v:c.stat===3?(mods.spd||0)*v:c.stat===2?(mods.def||0)*v:c.stat===1?(mods.atk||0)*v:0,p=Math.max(.18,Math.min(.92,.52+(v+bonus-target)/Math.max(100,target)*.62));return{v,roll:Math.round(v+bonus),chance:Math.round(p*100),expected:Math.round(gain*p)}};return `${runHeader(run)}${runInventoryHTML(run)}${teamHTML(run)}<section class=\"rg-panel\"><div class=\"rg-title\"><div><b>${c.title}</b><small>${c.text}</small></div><span>判定：${STAT[c.stat]} · 目标约 ${target}</span></div><p class=\"rg-note\">选择一只怪物处理这个事件。每个选项会直接显示成功率和成功后的回报，方便比较。</p><div class=\"rg-event-picks\">${t.map((m,i)=>{const q=preview(m);return `<button class=\"secondary rg-event-pick\" data-rg-event-member=\"${i}\"><b>${monsterName(m)}</b><small>${STAT[c.stat]} ${q.v} · 判定值 ${q.roll}</small><span class=\"rg-event-odds\"><i>成功率 <strong>${q.chance}%</strong></i><i>成功回报 <strong>+${gain} 灵能</strong></i><i>期望灵能 <strong>${q.expected}</strong></i></span><small>额外：道具 30% · 遗物 35%</small></button>`}).join('')}</div></section>`}"
if old not in s:
    raise SystemExit('challengeHTML target not found')
s=s.replace(old,new,1)

needle='.rg-event-picks{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}'
if needle in s:
    s=s.replace(needle,needle+'.rg-event-pick{display:grid;gap:4px;text-align:left}.rg-event-odds{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;margin-top:4px}.rg-event-odds i{font-style:normal;background:#222630;color:#dfe5ef;border:1px solid #596171;padding:4px;font-size:9px;line-height:1.35}.rg-event-odds strong{display:block;color:#f2c451;font-size:10px}@media(max-width:760px){.rg-event-odds{grid-template-columns:1fr}.rg-event-odds i{display:flex;justify-content:space-between;align-items:center}.rg-event-odds strong{display:inline}}',1)
else:
    # Fallback: append into injected style template near rg-note rule.
    marker='.rg-note{'
    i=s.find(marker)
    if i<0: raise SystemExit('event CSS insertion target not found')
    end=s.find('}',i)+1
    css='.rg-event-pick{display:grid;gap:4px;text-align:left}.rg-event-odds{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;margin-top:4px}.rg-event-odds i{font-style:normal;background:#222630;color:#dfe5ef;border:1px solid #596171;padding:4px;font-size:9px;line-height:1.35}.rg-event-odds strong{display:block;color:#f2c451;font-size:10px}@media(max-width:760px){.rg-event-odds{grid-template-columns:1fr}.rg-event-odds i{display:flex;justify-content:space-between;align-items:center}.rg-event-odds strong{display:inline}}'
    s=s[:end]+css+s[end:]

for oldv in ["version:'v231-expedition-stat-grid'","version:'v230'","version:'v229-relic-icon-ui'"]:
    s=s.replace(oldv,"version:'v232-event-odds-rewards'")

p.write_text(s,encoding='utf-8')

# Bump visible/cache version everywhere the live shell uses it.
for fp in ['game.js','index.html']:
    q=Path(fp);t=q.read_text(encoding='utf-8');t=t.replace('v231','v232').replace('v230','v232');q.write_text(t,encoding='utf-8')

print('v232 event success/reward preview applied')
