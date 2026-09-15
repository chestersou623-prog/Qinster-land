import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync('v199-roguelike-expedition.js','utf8');
const listeners={};
const ctx={window:{},document:{readyState:'loading',addEventListener(type,fn){(listeners[type]??=[]).push(fn)}},setTimeout(){}};
vm.createContext(ctx);vm.runInContext(source,ctx);
const R=ctx.window.QinsterRelics,manifest=JSON.parse(fs.readFileSync('assets/relics/manifest.json'));
assert.equal(R.all.length,28);
for(const r of R.all){
 const path=manifest.icons[r.id];assert.ok(path,r.id);
 const png=fs.readFileSync(path);assert.equal(png.subarray(1,4).toString(),'PNG');
 assert.equal(png.readUInt32BE(16),64);assert.equal(png.readUInt32BE(20),64);
 assert.ok(R.iconHTML(r.id).includes('src="'+path+'?v=230"'));
}
const tray=R.trayHTML({relics:['fang','fang','fateWeight','fateWeight','fateWeight']});
assert.equal((tray.match(/<img /g)||[]).length,2);assert.match(tray,/>x2</);assert.match(tray,/>x3</);
assert.equal(R.iconHTML('unknown'),'');
assert.ok(!source.includes('background-size:448px 256px'));
const html=fs.readFileSync('index.html','utf8'),game=fs.readFileSync('game.js','utf8');
assert.match(html,/v199-roguelike-expedition\.js\?v=230/);
assert.match(game,/__qinsterVersion='v230'/);assert.ok(!game.includes('v196 · engine'));
console.log('PASS: 28 stable icon mappings, PNG dimensions, x2/x3 consolidation and release version');
