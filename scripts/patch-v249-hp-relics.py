from pathlib import Path

p=Path('v199-roguelike-expedition.js')
s=p.read_text(encoding='utf-8')
anchor="{id:'glassHeart',name:'玻璃心核',text:'全队攻击 +20%、速度 +16%，防御 -18%',mods:{atk:.20,spd:.16,def:-.18}}"
add="""{id:'glassHeart',name:'玻璃心核',text:'全队攻击 +20%、速度 +16%，防御 -18%',mods:{atk:.20,spd:.16,def:-.18}},
{id:'lifeGrail',name:'生命圣杯',text:'全队最大 HP ×1.5',mods:{hpMult:.50}},
{id:'thickBloodCharm',name:'厚血护符',text:'全队最大 HP +200',mods:{hpFlat:200}},
{id:'lifeChip',name:'小型生命芯片',text:'全队最大 HP +100',mods:{hpFlat:100}},
{id:'beastHeart',name:'巨兽心脏',text:'全队最大 HP +500，防御 -5%',mods:{hpFlat:500,def:-.05}},
{id:'bloodforgedBlade',name:'血铸利刃',text:'追加攻击力 = 最大 HP 的 25%',mods:{atkFromHp:.25}},
{id:'unyieldingBone',name:'不屈骨甲',text:'全队最大 HP +300，防御 +8%',mods:{hpFlat:300,def:.08}},
{id:'lastStandEngine',name:'残血引擎',text:'每损失 10% HP，攻击 +3%，最多 +27%',mods:{missingHpAtkPer10:.03}},
{id:'bloodSpeedPump',name:'血速泵',text:'全队最大 HP +150，速度 +12%，防御 -5%',mods:{hpFlat:150,spd:.12,def:-.05}}"""
if anchor not in s: raise SystemExit('relic anchor missing')
s=s.replace(anchor,add,1)
old="function combatValue(m,pos,run){const v=trainedBaseStats(m,run),mods=combatMods(run),meta=metaMods(),sh=m.shiny?(mods.shiny||0):0;let atk=v[1]*(1+(mods.atk||0)+(meta.atk||0)+sh),def=v[2]*(1+(mods.def||0)+(meta.def||0)+sh),spd=v[3]*(1+(mods.spd||0)+(meta.spd||0)),luck=v[4]*(1+(mods.luck||0)+(meta.luck||0)+sh),con=v[0];if(pos===0){def*=1+(mods.frontDef||0);atk*=1+(mods.frontAtk||0)}if(pos===2){atk*=1+(mods.backAtk||0);def*=1+(mods.backDef||0)}return{atk,def,spd,luck,con}}"
new="function combatValue(m,pos,run){const v=trainedBaseStats(m,run),mods=combatMods(run),meta=metaMods(),sh=m.shiny?(mods.shiny||0):0;let con=Math.max(1,v[0]*(1+(mods.hpMult||0))+(mods.hpFlat||0)),atk=v[1]*(1+(mods.atk||0)+(meta.atk||0)+sh),def=v[2]*(1+(mods.def||0)+(meta.def||0)+sh),spd=v[3]*(1+(mods.spd||0)+(meta.spd||0)),luck=v[4]*(1+(mods.luck||0)+(meta.luck||0)+sh);atk+=con*(mods.atkFromHp||0);if(mods.missingHpAtkPer10){const missing=Math.max(0,100-hpPct(run,m.id)),steps=Math.min(9,Math.floor(missing/10));atk*=1+steps*(mods.missingHpAtkPer10||0)}if(pos===0){def*=1+(mods.frontDef||0);atk*=1+(mods.frontAtk||0)}if(pos===2){atk*=1+(mods.backAtk||0);def*=1+(mods.backDef||0)}return{atk,def,spd,luck,con}}"
if old not in s: raise SystemExit('combatValue anchor missing')
s=s.replace(old,new,1)
s=s.replace("window.QinsterExpedition={render,zones:ZONES,version:'v248", "window.QinsterExpedition={render,zones:ZONES,version:'v249")
s=s.replace('v248','v249')
p.write_text(s,encoding='utf-8')

for fname in ['game.js','v201-battle-theater.js','index.html']:
    q=Path(fname); t=q.read_text(encoding='utf-8').replace('v248','v249').replace('?v=248','?v=249'); q.write_text(t,encoding='utf-8')
