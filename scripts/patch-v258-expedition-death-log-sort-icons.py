from pathlib import Path

# v258: expedition death -> ranch activity log; icon-forward roster sorting UI.

exp = Path('v199-roguelike-expedition.js')
s = exp.read_text(encoding='utf-8')
old = """  if(deadIds.length){\n    const dead=new Set(deadIds.map(Number));\n    s.monsters=(s.monsters||[]).filter(m=>!dead.has(Number(m.id)));"""
new = """  if(deadIds.length){\n    // v258: every permanent expedition death is also written to the ranch activity log.\n    // Snapshot the monster before removing it from Box so the log keeps name/rarity details.\n    s.activityLog=Array.isArray(s.activityLog)?s.activityLog:[];\n    const now=Date.now();\n    for(const id of deadIds){\n      const m=byId.get(id);if(!m)continue;\n      const failed=!!defeated&&hpPct(run,id)<=0;\n      const reason=failed?'远征战败中阵亡':'远征中生命归0死亡';\n      const key=`expedition-death-${m.id}-${now}`;\n      if(!s.activityLog.some(x=>x.key===key)){\n        s.activityLog.push({\n          id:'L'+now+'-'+m.id, key, type:'death', time:now, reason,\n          monster:{id:m.id,species:m.species,star:m.star,shiny:!!m.shiny,nickname:m.nickname||'',tint:m.tint,specialColor:m.specialColor??null,deathReason:reason}\n        });\n      }\n    }\n    s.activityLog.sort((a,b)=>(Number(b.time)||0)-(Number(a.time)||0));\n    s.activityLog=s.activityLog.slice(0,300);\n    const dead=new Set(deadIds.map(Number));\n    s.monsters=(s.monsters||[]).filter(m=>!dead.has(Number(m.id)));"""
if old not in s:
    raise SystemExit('expedition death removal anchor not found')
s = s.replace(old, new, 1)
# bump internal marker if present; harmless if prior marker differs
s = s.replace('v257', 'v258')
exp.write_text(s, encoding='utf-8')

idx = Path('index.html')
h = idx.read_text(encoding='utf-8')
repls = {
    '<option value="rarity">稀有度 · 星级 / 闪光 / 最爱</option>':'<option value="rarity">★ 稀有度</option>',
    '<option value="joined">加入时间 · 新旧顺序</option>':'<option value="joined">◷ 加入时间</option>',
    '<option value="age">生命 · 剩余值</option>':'<option value="age">♥ 生命</option>',
    '<option value="favorite">我的最爱 · 收藏优先</option>':'<option value="favorite">❤ 我的最爱</option>',
    '<option value="skilllv">技能等级 · 最高技能 Lv</option>':'<option value="skilllv">✦ 技能等级</option>',
    '<option value="desc">高 → 低 / 新 → 旧</option>':'<option value="desc">↓ 高→低 / 新→旧</option>',
    '<option value="asc">低 → 高 / 旧 → 新</option>':'<option value="asc">↑ 低→高 / 旧→新</option>',
}
for a,b in repls.items():
    if a not in h:
        raise SystemExit(f'index sort anchor not found: {a}')
    h=h.replace(a,b,1)
# Add visible pictogram legend so this is not a text-only sorting control.
anchor='<div class="sort-bar sort-bar-advanced">'
insert='<div class="sort-icon-legend" aria-label="排序图示"><span title="稀有度">★</span><span title="加入时间">◷</span><span title="生命">♥</span><span title="我的最爱">❤</span><span title="技能等级">✦</span></div><div class="sort-bar sort-bar-advanced">'
if anchor not in h:
    raise SystemExit('sort bar anchor not found')
h=h.replace(anchor,insert,1)
# Inline CSS: compact visual icon strip; useful on desktop/mobile.
css='''\n/* v258: pictogram-forward roster sorting */\n.sort-icon-legend{display:flex;gap:6px;align-items:center;padding:7px 10px 0}.sort-icon-legend span{display:inline-grid;place-items:center;min-width:28px;height:26px;padding:0 5px;border:2px solid #77727e;background:#d7d6db;color:#2f2c35;font-size:14px;font-weight:900;box-shadow:1px 1px 0 #fff8 inset}.sort-control select#sort-roster,.sort-control select#sort-direction{font-weight:900}\n'''
if '</style>' in h:
    h=h.replace('</style>',css+'</style>',1)
# cache/version bump
h=h.replace('?v=257','?v=258').replace('v257','v258')
idx.write_text(h,encoding='utf-8')

game=Path('game.js')
g=game.read_text(encoding='utf-8')
g=g.replace('v257','v258')
game.write_text(g,encoding='utf-8')

# theater cache/version marker if any
p=Path('v201-battle-theater.js')
t=p.read_text(encoding='utf-8')
t=t.replace('v257','v258')
p.write_text(t,encoding='utf-8')
