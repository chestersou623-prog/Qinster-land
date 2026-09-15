from pathlib import Path

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')
old="""function expeditionPickerHTML(){
 const pool=[...eligible(z())].sort((a,b)=>recommendScore(b)-recommendScore(a));
 const cfg=R().monsterPickerConfig('远征队员 · '+['前卫','中卫','后卫'][pickerSlot],pool,{originalLabel:'远征最佳推荐',recommended:new Set(pool.slice(0,3).map(m=>m.id)),recommendationNote:'沿用远征能力与队伍强度评分；排序不会改变推荐名单',selected:new Set(selected.filter(Boolean)),choose:i=>{const id=i.value.id;if(selected[pickerSlot]===id)selected[pickerSlot]=null;else{const old=selected.indexOf(id);if(old>=0)selected[old]=null;selected[pickerSlot]=id;const empty=[0,1,2].find(n=>!selected[n]);if(empty!==undefined)pickerSlot=empty}render()}});
 return '<div class=\"qp-slotbar\">'+[0,1,2].map(i=>'<button type=\"button\" class=\"secondary\" data-rg-picker-slot=\"'+i+'\" aria-pressed=\"'+(pickerSlot===i)+'\">'+['前卫','中卫','后卫'][i]+'<small>'+window.QinsterPicker.esc((team().find(m=>m.id===selected[i])?monsterName(team().find(m=>m.id===selected[i])):'待选择'))+'</small></button>').join('')+'</div>'+window.QinsterPicker.html('expedition',cfg);
}
"""
new="""function expeditionPickerHTML(){
 const pool=[...eligible(z())].sort((a,b)=>recommendScore(b)-recommendScore(a));
 const cfg=R().monsterPickerConfig('远征队员 · '+['前卫','中卫','后卫'][pickerSlot],pool,{originalLabel:'远征最佳推荐',recommended:new Set(pool.slice(0,3).map(m=>m.id)),recommendationNote:'沿用远征能力与队伍强度评分；排序不会改变推荐名单',selected:new Set(selected.filter(Boolean)),choose:i=>{const id=i.value.id;if(selected[pickerSlot]===id)selected[pickerSlot]=null;else{const old=selected.indexOf(id);if(old>=0)selected[old]=null;selected[pickerSlot]=id;const empty=[0,1,2].find(n=>!selected[n]);if(empty!==undefined)pickerSlot=empty}render()}});
 const esc=window.QinsterPicker.esc;
 cfg.placeholder='名字 / 战斗技能 / #编号';
 cfg.items.forEach(i=>{
   const m=i.value,sp=R()?.G?.SPECIES?.[m.species]||{},skill=battleSkillFor(m)||{name:'普通攻击',text:'无额外战斗技能'};
   i.search=[monsterName(m),'#'+m.id,sp.name||'',skill.name||'',skill.text||''].join(' ');
   i.description=`${sp.name||'未知种族'} · ${m.gender||''} · ${m.life}/${m.maxLife} 生命`;
   i.facets={...(i.facets||{}),skill:[skill.name||'普通攻击']};
   i.battleSkill=skill;
 });
 cfg.facets=(cfg.facets||[]).map(f=>f.id==='skill'?{...f,label:'战斗技能'}:f);
 cfg.card=i=>{const sk=i.battleSkill||{name:'普通攻击',text:'无额外战斗技能'},typeMap={attack:'攻击',attackGauge:'攻击/行动条',attackDebuff:'攻击/Debuff',attackSelfGauge:'攻击/自充能',drain:'吸血攻击',buff:'Buff',debuff:'Debuff',heal:'治疗',healall:'群体治疗',healBuff:'治疗/Buff',selfheal:'自愈'},kind=typeMap[sk.type]||'战斗技能',chance='每次行动 20% 概率使用';return `<article class=\"qp-card rg-exp-picker-card ${i.selected?'selected':''}\"><button type=\"button\" class=\"rg-exp-pick-main\" data-qp-item=\"${esc(i.id)}\" aria-pressed=\"${!!i.selected}\" ${i.disabled?'disabled':''}>${i.art||''}<span class=\"qp-copy\"><strong>${esc(i.title)}</strong><small>${esc(i.description)}</small><span class=\"qp-badges\">${i.recommended?'<em>推荐</em>':''}${i.selected?'<em>✓ 已选</em>':''}</span></span></button><details class=\"rg-exp-skill\"><summary>⚔ ${esc(sk.name||'普通攻击')}</summary><small><b>${esc(kind)}</b> · ${esc(chance)}<br>${esc(sk.text||'无额外效果')}</small></details></article>`};
 return '<div class=\"qp-slotbar\">'+[0,1,2].map(i=>'<button type=\"button\" class=\"secondary\" data-rg-picker-slot=\"'+i+'\" aria-pressed=\"'+(pickerSlot===i)+'\">'+['前卫','中卫','后卫'][i]+'<small>'+window.QinsterPicker.esc((team().find(m=>m.id===selected[i])?monsterName(team().find(m=>m.id===selected[i])):'待选择'))+'</small></button>').join('')+'</div>'+window.QinsterPicker.html('expedition',cfg);
}
"""
if old not in s:
    raise SystemExit('expeditionPickerHTML block not found')
s=s.replace(old,new,1)
p.write_text(s,encoding='utf-8')

css=Path('picker.css')
cs=css.read_text(encoding='utf-8')
add='''\n/* v266 expedition picker: battle skill is a separate hover/tap detail, not a ranch skill. */\n.rg-exp-picker-card{display:block!important;padding:0!important;overflow:visible}.rg-exp-pick-main{width:100%;display:flex!important;align-items:center;gap:12px;text-align:left;border:0!important;box-shadow:none!important;background:transparent!important;padding:12px!important}.rg-exp-pick-main .sprite{width:60px!important;min-width:60px}.rg-exp-skill{margin:0 10px 10px!important;padding:5px 8px!important;background:#e6e3ea!important;border:1px solid #918b99!important}.rg-exp-skill summary{min-height:30px!important;padding:2px!important;color:#623a78}.rg-exp-skill small{padding:5px 2px 2px;line-height:1.5}.rg-exp-picker-card.selected{border-color:#896626;box-shadow:inset 0 0 0 1px #896626}\n'''
if 'v266 expedition picker' not in cs:
    cs += add
css.write_text(cs,encoding='utf-8')

for fn in ['package.json','package-lock.json']:
    q=Path(fn)
    if q.exists():
        t=q.read_text(encoding='utf-8').replace('265.0.0','266.0.0')
        q.write_text(t,encoding='utf-8')
for fn in ['game.js','index.html']:
    q=Path(fn)
    t=q.read_text(encoding='utf-8')
    t=t.replace('v265','v266').replace('265.0.0','266.0.0')
    q.write_text(t,encoding='utf-8')
