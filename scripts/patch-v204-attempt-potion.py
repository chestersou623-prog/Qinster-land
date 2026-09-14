from pathlib import Path
p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')

old="if(!e.usedByZone)e.usedByZone={};e.badges=Math.max(0,Number(e.badges)||0);if(!e.loot)e.loot={relicDust:0,starCrystal:0,eggFragment:0};"
new="if(!e.usedByZone)e.usedByZone={};if(!e.extraAttempts)e.extraAttempts={};e.attemptPotions=Math.max(0,Number(e.attemptPotions)||0);e.badges=Math.max(0,Number(e.badges)||0);if(!e.loot)e.loot={relicDust:0,starCrystal:0,eggFragment:0};"
if old not in s: raise SystemExit('ensure target not found')
s=s.replace(old,new,1)

old="function used(e,zone){return Math.max(0,Number(e.usedByZone?.[zone.id])||0)}"
new="function used(e,zone){return Math.max(0,Number(e.usedByZone?.[zone.id])||0)}function bonusAttempts(e,zone){return Math.max(0,Number(e.extraAttempts?.[zone.id])||0)}function freeRemain(e,zone){return Math.max(0,zone.attempts-used(e,zone))}function totalRemain(e,zone){return freeRemain(e,zone)+bonusAttempts(e,zone)}function buyAttemptPotion(){const s=S(),e=ensure();if(!s||!e)return;const price=100000;if((Number(s.energy)||0)<price)return R()?.tell?.('灵能不足，需要 100,000。');s.energy-=price;e.attemptPotions=(e.attemptPotions||0)+1;save('购买远征次数回复药水 ×1。')}function useAttemptPotion(){const e=ensure(),zone=z();if(!e)return;if((e.attemptPotions||0)<=0)return R()?.tell?.('没有远征次数回复药水。');e.attemptPotions--;e.extraAttempts[zone.id]=bonusAttempts(e,zone)+1;save(`${zone.label} 可用远征次数 +1。`)}"
if old not in s: raise SystemExit('used target not found')
s=s.replace(old,new,1)

old="if(used(e,zone)>=zone.attempts)return R()?.tell?.('今天这个难度次数已经用完。');e.usedByZone[zone.id]=used(e,zone)+1;"
new="if(totalRemain(e,zone)<=0)return R()?.tell?.('这个难度今天的免费次数已用完；可使用远征次数回复药水继续。');if(freeRemain(e,zone)>0)e.usedByZone[zone.id]=used(e,zone)+1;else e.extraAttempts[zone.id]=Math.max(0,bonusAttempts(e,zone)-1);"
if old not in s: raise SystemExit('startRun attempt target not found')
s=s.replace(old,new,1)

old="const zone=z(),list=sorted(zone),rec=new Set(list.slice(0,3).map(m=>m.id)),remain=Math.max(0,zone.attempts-used(e,zone));"
new="const zone=z(),list=sorted(zone),rec=new Set(list.slice(0,3).map(m=>m.id)),free=freeRemain(e,zone),bonus=bonusAttempts(e,zone),remain=free+bonus;"
if old not in s: raise SystemExit('idle remain target not found')
s=s.replace(old,new,1)

old="${x.name} · 剩 ${Math.max(0,x.attempts-used(e,x))}/${x.attempts}"
new="${x.name} · 可用 ${totalRemain(e,x)}（免费 ${freeRemain(e,x)} + 追加 ${bonusAttempts(e,x)}）"
if old not in s: raise SystemExit('tab label target not found')
s=s.replace(old,new)

needle="<span>${zone.shinyOnly?'只允许 5★闪光':'最低 '+zone.minStar+'★'}</span></div><p class=\"rg-note\">"
insert="<span>${zone.shinyOnly?'只允许 5★闪光':'最低 '+zone.minStar+'★'}</span></div><div class=\"rg-status\"><span>今日免费剩余 ${free}</span><span>追加次数 ${bonus}</span><span>次数药水 ×${e.attemptPotions||0}</span></div><div style=\"display:flex;gap:8px;flex-wrap:wrap;margin:8px 0\"><button class=\"secondary\" data-rg-buy-attempt>购买药水 100,000 灵能</button><button class=\"secondary\" data-rg-use-attempt ${(e.attemptPotions||0)>0?'':'disabled'}>使用药水：当前难度 +1次</button></div><p class=\"rg-note\">"
if needle not in s: raise SystemExit('idle potion ui target not found')
s=s.replace(needle,insert,1)

old="if(ev.target.closest?.('[data-rg-recommend]')){selected=sorted(z()).slice(0,3).map(m=>m.id);render();return}"
new="if(ev.target.closest?.('[data-rg-buy-attempt]')){buyAttemptPotion();return}if(ev.target.closest?.('[data-rg-use-attempt]')){useAttemptPotion();return}if(ev.target.closest?.('[data-rg-recommend]')){selected=sorted(z()).slice(0,3).map(m=>m.id);render();return}"
if old not in s: raise SystemExit('click target not found')
s=s.replace(old,new,1)

p.write_text(s,encoding='utf-8')
