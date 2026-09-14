from pathlib import Path

p=Path('v201-battle-theater.js')
s=p.read_text(encoding='utf-8')

old="""${enemySpec?sprite(enemySpec,b.kind==='boss'):''}<small>${enemyName}</small><small>HP ${b.enemyMax||'?'} · 攻 ${b.enemyAtk||'?'} · 防 ${b.enemyDef||'?'} · 速 ${b.enemySpd||'?'} · 运 ${b.enemyLuck||'?'}</small><small>敌 ${b.enemyPower||'?'} / 我 ${b.teamPower||'?'}</small><div class=\"rg-bt-hp\"><i style=\"width:100%\"></i></div>"""
new="""${enemySpec!==null&&enemySpec!==undefined?sprite(enemySpec,b.kind==='boss'):''}<div class=\"rg-bt-enemy-info\"><small>${enemyName}</small><small>HP ${b.enemyMax||'?'} · 攻 ${b.enemyAtk||'?'} · 防 ${b.enemyDef||'?'} · 速 ${b.enemySpd||'?'} · 运 ${b.enemyLuck||'?'}</small><small>敌 ${b.enemyPower||'?'} / 我 ${b.teamPower||'?'}</small><div class=\"rg-bt-hp\"><i style=\"width:100%\"></i></div></div>"""
if old not in s:
    raise SystemExit('enemy mount target not found')
s=s.replace(old,new,1)

css_old=""".rg-bt-enemy-card{width:115px;text-align:center}.rg-bt-enemy-card .sprite{width:92px!important;margin:auto;transform:scaleX(-1);filter:drop-shadow(4px 5px 0 rgba(0,0,0,.4))}.rg-bt-boss .sprite{width:112px!important}"""
css_new=""".rg-bt-enemy-card{width:150px;text-align:center}.rg-bt-enemy-card .sprite{width:92px!important;margin:auto;transform:scaleX(-1);filter:drop-shadow(4px 5px 0 rgba(0,0,0,.4))}.rg-bt-boss .sprite{width:112px!important}.rg-bt-enemy-info{margin-top:4px;background:rgba(36,33,42,.94);border:1px solid #77717e;padding:4px 5px}.rg-bt-enemy-info small{display:block;color:#fff3bf;font-size:8px;line-height:1.35;white-space:normal}.rg-bt-float{z-index:40}"""
if css_old not in s:
    raise SystemExit('enemy css target not found')
s=s.replace(css_old,css_new,1)

p.write_text(s,encoding='utf-8')
