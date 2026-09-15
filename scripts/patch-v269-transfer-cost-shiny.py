from pathlib import Path
import json

exp=Path('v199-roguelike-expedition.js')
s=exp.read_text(encoding='utf-8')

# Shiny expedition base-stat bonus: applied after species multiplier + breakthrough trait.
old="function expeditionStats(m){const base=ranchStats(m),mul=speciesBattleMultipliers(m),trait=expeditionTraitFor(m);return base.map((v,i)=>Math.round(((Number(v)||0)*(mul[i]||1)+(Number(trait.stat)===i?Number(trait.flat)||0:0))*10)/10)}"
new="function expeditionStats(m){const base=ranchStats(m),mul=speciesBattleMultipliers(m),trait=expeditionTraitFor(m),shiny=m?.shiny?1.05:1;return base.map((v,i)=>Math.round((((Number(v)||0)*(mul[i]||1)+(Number(trait.stat)===i?Number(trait.flat)||0:0))*shiny)*10)/10)}"
assert old in s, 'expeditionStats marker missing'
s=s.replace(old,new,1)

# Transfer fees by star.
marker="function expeditionBoxExpandCost(e){"
assert marker in s, 'box cost marker missing'
insert="function expeditionTransferCost(m){return ({1:1000,2:3000,3:10000,4:25000,5:50000})[Math.max(1,Math.min(5,Number(m?.star)||1))]||1000}\n"
s=s.replace(marker,insert+marker,1)

old="function transferToExpedition(id){const s=S(),e=ensure(),r=R();if(!s||!e||!r||e.rogueActive)return false;id=Number(id);const idx=(s.monsters||[]).findIndex(m=>m.id===id);if(idx<0)return false;const m=s.monsters[idx];if(r.isDispatched?.(id))return r.tell?.('派遣中的怪物不能转入远征Box。'),false;if((e.box||[]).length>=e.boxCapacity)return r.tell?.('远征Box已满，请先扩建。'),false;if(!window.confirm(`将 ${monsterName(m)} #${m.id} 永久转入远征Box？\\n转入后会离开牧场Box，不能用于牧场配种/派遣；远征属性会应用种族值修正。`))return false;m.expeditionTrait=expeditionTraitFor(m);m.expeditionTransferredAt=Date.now();s.monsters.splice(idx,1);e.box.push(m);"
new="function transferToExpedition(id){const s=S(),e=ensure(),r=R();if(!s||!e||!r||e.rogueActive)return false;id=Number(id);const idx=(s.monsters||[]).findIndex(m=>m.id===id);if(idx<0)return false;const m=s.monsters[idx],cost=expeditionTransferCost(m);if(r.isDispatched?.(id))return r.tell?.('派遣中的怪物不能转入远征Box。'),false;if((e.box||[]).length>=e.boxCapacity)return r.tell?.('远征Box已满，请先扩建。'),false;if((Number(s.energy)||0)<cost)return r.tell?.(`灵能不足：${stars(m)} 转籍需要 ${cost.toLocaleString()} 灵能。`),false;if(!window.confirm(`将 ${monsterName(m)} #${m.id} 永久转入远征Box？\\n转籍费用：${cost.toLocaleString()} 灵能\\n转入后会离开牧场Box，不能用于牧场配种/派遣；远征属性会应用种族值修正${m.shiny?'，闪光怪额外获得远征基础五维 +5%':''}。`))return false;s.energy-=cost;m.expeditionTrait=expeditionTraitFor(m);m.expeditionTransferredAt=Date.now();s.monsters.splice(idx,1);e.box.push(m);"
assert old in s, 'transfer function marker missing'
s=s.replace(old,new,1)

old="save(`${monsterName(m)} 已转入远征Box：${traitText(m)}。`);return true}"
new="save(`${monsterName(m)} 已转入远征Box：-${cost.toLocaleString()} 灵能 · ${traitText(m)}${m.shiny?' · 闪光五维 +5%':''}。`);return true}"
assert old in s, 'transfer save marker missing'
s=s.replace(old,new,1)

# Transfer picker: show fee and shiny bonus, disable when energy is insufficient.
old="i.battleSkill=sk;i.transferDisabled=!!r.isDispatched?.(m.id)});"
new="i.battleSkill=sk;i.transferCost=expeditionTransferCost(m);i.transferDisabled=!!r.isDispatched?.(m.id)||(Number(s?.energy)||0)<i.transferCost});"
assert old in s, 'transfer picker state marker missing'
s=s.replace(old,new,1)

old="<span class=\"rg-exp-trait\"><b>转入突破</b> ${esc(traitText(m))}</span><details class=\"rg-exp-skill\">"
new="<span class=\"rg-exp-trait\"><b>转入突破</b> ${esc(traitText(m))}</span>${m.shiny?'<span class=\"rg-exp-trait\"><b>闪光加成</b> 远征基础五维 +5%</span>':''}<span class=\"rg-exp-trait\"><b>转籍费用</b> ${i.transferCost.toLocaleString()} 灵能</span><details class=\"rg-exp-skill\">"
assert old in s, 'transfer card details marker missing'
s=s.replace(old,new,1)

old="${i.transferDisabled?'派遣中不可转入':'转入远征Box'}"
new="${r.isDispatched?.(m.id)?'派遣中不可转入':(Number(s?.energy)||0)<i.transferCost?'灵能不足':`转入远征Box · ${i.transferCost.toLocaleString()}`}"
assert old in s, 'transfer button label marker missing'
s=s.replace(old,new,1)

old="<p class=\"rg-note\"><b>转籍规则：</b>转入后怪物会从牧场Box移除，不能再用于牧场配种/派遣。星级、性别、颜色、闪光、技能、家族和生命都会完整保留。</p>"
new="<p class=\"rg-note\"><b>转籍规则：</b>转入后怪物会从牧场Box移除，不能再用于牧场配种/派遣。费用：1★ 1,000 · 2★ 3,000 · 3★ 10,000 · 4★ 25,000 · 5★ 50,000 灵能。闪光怪转入后远征基础五维额外 +5%。星级、性别、颜色、闪光、技能、家族和生命都会完整保留。</p>"
assert old in s, 'transfer rule marker missing'
s=s.replace(old,new,1)

s=s.replace("version:'v268'","version:'v269'",1)
exp.write_text(s,encoding='utf-8')

# Visible/cache/package version bump.
g=Path('game.js'); t=g.read_text(encoding='utf-8'); t=t.replace("__qinsterVersion='v268'","__qinsterVersion='v269'",1); g.write_text(t,encoding='utf-8')
i=Path('index.html'); t=i.read_text(encoding='utf-8').replace('?v=268','?v=269'); i.write_text(t,encoding='utf-8')
p=Path('package.json'); data=json.loads(p.read_text(encoding='utf-8')); data['version']='269.0.0'; p.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
# Keep integration test version assertion aligned with visible version.
cp=Path('scripts/check-picker.mjs'); ct=cp.read_text(encoding='utf-8').replace("assert.equal(w.__qinsterVersion,'v268')","assert.equal(w.__qinsterVersion,'v269')",1); cp.write_text(ct,encoding='utf-8')
print('v269 transfer cost + shiny bonus patch applied')
