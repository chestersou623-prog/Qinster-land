import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const js=fs.readFileSync('game.js','utf8'),html=fs.readFileSync('index.html','utf8');
const ctx={window:{addEventListener(){}},console};vm.createContext(ctx);
vm.runInContext(js.slice(0,js.indexOf("window.__bootMark&&__bootMark('02")),ctx);
const G=ctx.MonsterGame;
assert.equal(G.SPECIES.length,58);assert.equal(G.BASE_SPECIES_COUNT,18);
assert.match(js,/key='eggwood-monsters-v3'/);assert.match(js,/localStorage.getItem\('eggwood-monsters-v2'\)/);
const fresh=G.fresh();assert.ok(G.valid(fresh));assert.ok(G.valid(G.migrate(JSON.parse(JSON.stringify(fresh)))));
ctx.G=G;ctx.document={documentElement:{style:{setProperty(){}}}};
vm.runInContext(js.slice(js.indexOf('const MONSTER_ATLAS_COLS='),js.indexOf('const EGG_QUEUE_MAX=')),ctx);
for(let id=0;id<58;id++)for(let color=0;color<9;color++)for(const shiny of [false,true]){
 const tag=ctx.sprite(id,color<6?color:0,shiny,color<6?null:color-6);
 assert.match(tag,new RegExp('data-species="'+id+'"'));
 assert.match(tag,new RegExp('data-color="'+color+'"'));
 assert.equal(tag.includes('class="shiny-fx"'),shiny);
 assert.ok(!/hue-rotate|grayscale|mask/.test(tag));
 const path=color===0?'monster-atlas.png':`assets/monster-atlas-${color}.png`;assert.ok(fs.existsSync(path));
}
assert.match(ctx.sprite(999,99,true,99),/data-species="57" data-color="5"/);
assert.match(ctx.sprite(Infinity,NaN),/data-species="0" data-color="0"/);
assert.ok(!/ACCENT_MASKS|ACCENT_FILTERS|--accent-mask/.test(js+html));
const art=JSON.parse(fs.readFileSync('art/sprites.json'));assert.equal(art.species.length,58);
for(let i=0;i<58;i++)assert.equal(art.species[i].name,G.SPECIES[i].name);
console.log('PASS: 1044 species/colour/shiny render combinations, all atlas paths, IDs and save-key compatibility.');
if(process.argv.includes('--fixture')){
 fs.mkdirSync('.qa',{recursive:true});const now=Date.now(),state=G.fresh(now);
 state.capacity=100;state.energy=100000000;state.ranchXp=100000;state.autoHatch=false;state.autoFillFarm=false;state.farmSlots=8;state.farmIds=[1,2,3,4];
 state.monsters=Array.from({length:58},(_,i)=>Object.assign(G.createMonster(i+1,i,3),{gender:i%2?'母':'公',tint:i%6,shiny:i<4||i===17,baseLife:20,life:20,maxLife:20}));
 state.monsters[0].species=3;state.monsters[0].tint=2;state.monsters[1].tint=3;
 state.nextId=60;state.parentA=1;state.parentB=2;
 state.egg={child:Object.assign(G.createMonster(59,3,3),{gender:'母',shiny:true,tint:4,baseLife:12,life:12,maxLife:12}),start:now-60000,ready:now-1000,base:3,chance:.1};
 state.items.colors=[3,3,3,3,3,3];state.items.specialColors=[3,3,3];
 assert.ok(G.valid(state));fs.writeFileSync('.qa/fixture.json',JSON.stringify(state));
 fs.writeFileSync('.qa/game.js',"const qaStorage={getItem:k=>localStorage.getItem('qinster-qa:'+k),setItem:(k,v)=>localStorage.setItem('qinster-qa:'+k,v),removeItem:k=>localStorage.removeItem('qinster-qa:'+k)};\n"+js.replaceAll('localStorage','qaStorage'));
 fs.writeFileSync('.qa/game.html',html.replace('<head>','<head><base href="/">').replace('src="game.js?v=259.1"','src="/.qa/game.js"'));
 fs.writeFileSync('.qa/setup.html',`<!doctype html><meta charset="utf-8"><h1>Qinster 本地验收数据</h1><p>使用独立 qinster-qa 存储空间，不读取或覆盖实际游戏存档。</p><button id="load">加载验收存档</button><a href="/.qa/game.html">打开游戏</a><script>document.querySelector('#load').onclick=async()=>{let s=await(await fetch('./fixture.json')).json();s.last=Date.now();localStorage.setItem('qinster-qa:eggwood-monsters-v3',JSON.stringify(s));location.href='/.qa/game.html';}</script>`);
}
