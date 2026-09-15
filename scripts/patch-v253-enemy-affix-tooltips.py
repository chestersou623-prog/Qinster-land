from pathlib import Path

repo = Path('.')
exp = repo / 'v199-roguelike-expedition.js'
text = exp.read_text(encoding='utf-8')

anchor = "function enemyUnitCardHTML(e,result=false){"
if anchor not in text:
    raise SystemExit('enemyUnitCardHTML anchor not found')

helper = r'''const ENEMY_AFFIX_DETAILS={
  '狂暴':'攻击 +20%',
  '铁壁':'防御 +25%',
  '迅捷':'速度 +20%',
  '强运':'幸运 +25%',
  '巨躯':'HP +25%',
  '精准':'攻击 +8% · 幸运 +15%'
};
function ensureEnemyTipStyle(){
  if(document.getElementById('rg-enemy-tip-style'))return;
  const s=document.createElement('style');s.id='rg-enemy-tip-style';s.textContent=`.rg-enemy-tip{position:relative;display:inline-block;border:0;background:transparent;color:inherit;padding:0 1px;margin:0;font:inherit;line-height:inherit;box-shadow:none!important;text-decoration:underline dotted;text-underline-offset:2px;cursor:help;overflow:visible}.rg-enemy-tip:hover,.rg-enemy-tip:focus{color:#6b3e85;outline:none}.rg-enemy-tip:hover::after,.rg-enemy-tip:focus::after{content:attr(data-tip);position:absolute;z-index:999;left:50%;bottom:calc(100% + 6px);transform:translateX(-50%);min-width:150px;max-width:230px;padding:6px 8px;background:#171a21;color:#f3f3f3;border:2px solid #626b7c;box-shadow:3px 3px 0 rgba(0,0,0,.65);font-size:9px;line-height:1.4;white-space:normal;text-align:left;pointer-events:none}@media(max-width:700px){.rg-enemy-tip:hover::after,.rg-enemy-tip:focus::after{position:fixed;left:12px;right:12px;bottom:14px;transform:none;max-width:none;min-width:0;font-size:11px}}`;
  document.head.appendChild(s);
}
function enemyAffixHTML(e){
  ensureEnemyTipStyle();
  const names=Array.isArray(e.affixes)?e.affixes:[],variance=Math.round(Number(e.variance)||100),delta=variance-100;
  const affix=names.length?names.map(n=>{const tip=ENEMY_AFFIX_DETAILS[n]||'强化敌方能力';return `<button type="button" class="rg-enemy-tip" data-tip="${tip}" title="${tip}">${n}</button>`}).join(' · '):'无';
  const varianceTip=`本场随机模板倍率 ${variance}%（${delta>=0?'+':''}${delta}%）；先影响敌人的基础能力计算，再叠加难度、强化词条与无限层倍率。`;
  return `强化词条：${affix} · <button type="button" class="rg-enemy-tip" data-tip="${varianceTip}" title="${varianceTip}">随机 ${variance}%</button>`;
}
'''
text = text.replace(anchor, helper + anchor, 1)

old = "<small>${e.affixes?.length?'强化词条：'+e.affixes.join(' · '):'强化词条：无'} · 随机 ${e.variance||100}%</small>"
new = "<small>${enemyAffixHTML(e)}</small>"
if old not in text:
    raise SystemExit('enemy affix display pattern not found')
text = text.replace(old, new, 1)
exp.write_text(text, encoding='utf-8')

# Mandatory visible/cache version bump.
for name in ['game.js','index.html','v199-roguelike-expedition.js','v201-battle-theater.js']:
    p=repo/name
    s=p.read_text(encoding='utf-8')
    s=s.replace('v252','v253').replace('?v=252','?v=253')
    p.write_text(s,encoding='utf-8')
