from pathlib import Path
import json,re

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

old="""function relicIconHTML(id,count=1,small=false){
  const r=RELICS.find(x=>x.id===id);
  if(!r)return '';
  return `<span class=\"rg-relic-chip ${small?'small':''}\" tabindex=\"0\" role=\"button\" aria-label=\"${r.name}${count>1?' x'+count:''}：${r.text}\" aria-expanded=\"false\"><img class=\"rg-relic-icon\" src=\"assets/relics/${r.id}.png?v=230\" alt=\"${r.name}\" width=\"64\" height=\"64\">${count>1?`<b class=\"rg-relic-count\">x${count}</b>`:''}<em><strong>${r.name}${count>1?' x'+count:''}</strong><span>${r.text}</span>${count>1?`<small>当前持有 ${count} 个；可叠加的数值效果已经按数量累计。</small>`:''}</em></span>`;
}"""
new="""const RELIC_ICON_FALLBACKS={
  relicWarBanner:'hunterHorn',
  buffResonator:'sacredPage',
  digitChaosCube:'boneDice',
  formationCompass:'treasureCompass',
  dodgeCounterBlade:'blade',
  phoenixCore:'heart',
  absoluteGuard:'guard',
  energyShield100:'shell',
  energyShield250:'ironPendant',
  vulnerabilityMark:'fang',
  armorBreakSeal:'thornBrace',
  openingSunder:'blade',
  stackingWound:'thornBrace',
  bossBreaker:'hunterHorn'
};
function relicIconAssetId(id){return RELIC_ICON_FALLBACKS[id]||id}
function relicIconHTML(id,count=1,small=false){
  const r=RELICS.find(x=>x.id===id);
  if(!r)return '';
  const assetId=relicIconAssetId(r.id);
  return `<span class=\"rg-relic-chip ${small?'small':''}\" tabindex=\"0\" role=\"button\" aria-label=\"${r.name}${count>1?' x'+count:''}：${r.text}\" aria-expanded=\"false\"><img class=\"rg-relic-icon\" src=\"assets/relics/${assetId}.png?v=263\" alt=\"${r.name}\" width=\"64\" height=\"64\" onerror=\"this.onerror=null;this.src='assets/relics/fateWeight.png?v=263'\">${count>1?`<b class=\"rg-relic-count\">x${count}</b>`:''}<em><strong>${r.name}${count>1?' x'+count:''}</strong><span>${r.text}</span>${count>1?`<small>当前持有 ${count} 个；可叠加的数值效果已经按数量累计。</small>`:''}</em></span>`;
}"""
if old not in s: raise SystemExit('relicIconHTML anchor missing')
s=s.replace(old,new,1)
s=s.replace("window.QinsterExpedition={render,zones:ZONES,version:'v259'}","window.QinsterExpedition={render,zones:ZONES,version:'v263'}")
p.write_text(s,encoding='utf-8')

idx=Path('index.html');x=idx.read_text(encoding='utf-8')
x=x.replace('v=262','v=263').replace('v262 ·','v263 ·').replace('Qinster v262 错误','Qinster v263 错误')
idx.write_text(x,encoding='utf-8')

pkg=Path('package.json');d=json.loads(pkg.read_text(encoding='utf-8'));d['version']='263.0.0';pkg.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
lock=Path('package-lock.json');ld=json.loads(lock.read_text(encoding='utf-8'));ld['version']='263.0.0';ld['packages']['']['version']='263.0.0';lock.write_text(json.dumps(ld,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')

cg=Path('scripts/check-game.mjs');c=cg.read_text(encoding='utf-8').replace('game.js?v=262','game.js?v=263');cg.write_text(c,encoding='utf-8')
print('v263 relic icon patch applied')
