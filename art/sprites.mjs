// Original Qinster pixel art. Native indexed source, 40×40 logical pixels.
// 0 transparent; o outline; a/b/c/d variable ramp; f/g/h fixed body;
// w fixed highlight; e fixed eyes; y fixed gold; p fixed pink; k fixed dark detail.
// Drawing order is explicit. Outlines, eyes and highlights never share dye indices.
import fs from 'node:fs';
const designs=[];
let grid;
const r=(x,y,w,h,c)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)if(i>=0&&i<40&&j>=0&&j<40)grid[j][i]=c;};
const poly=(points,c)=>{for(let y=0;y<40;y++)for(let x=0;x<40;x++){let inside=false;for(let i=0,j=points.length-1;i<points.length;j=i++){const [xi,yi]=points[i],[xj,yj]=points[j];if((yi>y+.5)!=(yj>y+.5)&&(x+.5<(xj-xi)*(y+.5-yi)/(yj-yi)+xi))inside=!inside;}if(inside)grid[y][x]=c;}};
const p=(s,c)=>poly(s.split(' ').map(a=>a.split(',').map(Number)),c);
const box=(x,y,w,h,c)=>{r(x+2,y,w-4,h,'o');r(x,y+2,w,h-4,'o');r(x+1,y+1,w-2,h-2,c);};
const eye=(x,y)=>{r(x,y,3,4,'e');r(x,y,1,1,'w');};
const face=(x=13,y=19)=>{eye(x,y);eye(x+10,y);r(x+5,y+5,2,1,'k');};
const feet=(c='g')=>{box(11,32,7,4,c);box(23,32,7,4,c);};
const leaf=(x,y,flip=1)=>{const pts=[[0,6],[2,1],[8,0],[7,6],[3,9],[0,9]].map(([a,b])=>[x+a*flip,y+b]);poly(pts,'o');poly([[1,6],[3,2],[7,1],[6,5],[2,8]].map(([a,b])=>[x+a*flip,y+b]),'b');r(x+2*flip,y+5,2,2,'c');};
const spark=(x,y)=>{r(x+2,y,1,5,'y');r(x,y+2,5,1,'y');r(x+2,y+2,1,1,'w');};
const horn=(x,y,flip=1)=>{poly([[0,9],[0,3],[3,0],[3,6],[6,9]].map(([a,b])=>[x+a*flip,y+b]),'o');poly([[1,7],[1,3],[2,2],[2,6],[4,8]].map(([a,b])=>[x+a*flip,y+b]),'y');};
function quadruped(kind='fox'){
 // Tail is drawn before torso; all dark fur belongs to variable ramp.
 p('26,24 30,20 32,12 35,10 38,14 38,24 34,30 27,31','o');p('28,25 32,21 33,14 35,12 37,15 36,23 33,28 28,29','b');p('33,17 37,15 37,19 34,23 32,23','h');
 feet('a');box(14,22,17,12,'b');r(16,29,13,3,'a');
 if(['fox','cat','wolf','dog'].includes(kind)){p('8,17 7,6 11,7 17,13 22,12 27,7 30,8 29,19','o');p('9,15 9,9 15,14 24,14 28,10 27,17','b');r(10,11,2,3,'p');r(26,11,1,3,'p');}
 else {box(7,10,8,9,'b');box(25,10,7,9,'b');r(9,12,4,3,'p');r(27,12,3,3,'p');}
 box(7,15,24,14,'b');p('8,23 13,24 16,22 20,25 24,22 29,22 28,27 24,30 14,29 9,26','h');face(12,19);
 if(kind==='wolf'){p('8,26 12,28 12,31 16,29 20,33 23,29 29,27','f');r(18,28,2,3,'h');}
 if(kind==='cat'){r(7,23,4,1,'k');r(27,24,5,1,'k');r(8,25,3,1,'k');}
 if(kind==='dog'){box(7,13,5,12,'a');box(27,13,5,12,'a');}
 if(kind==='weasel'){r(12,17,13,2,'a');r(18,29,3,3,'h');}
}
function round(kind='sprout'){
 feet();box(9,15,23,18,'f');r(11,27,19,4,'g');r(12,17,6,2,'h');face(13,21);
 if(kind==='sprout'){leaf(17,5);leaf(16,7,-1);leaf(25,10);r(19,12,2,6,'a');box(5,24,6,5,'g');box(30,25,5,5,'g');}
 if(kind==='mushroom'){p('4,18 6,12 12,7 26,7 33,13 35,20 28,23 10,22 4,20','o');p('6,17 8,13 13,9 25,9 31,14 33,19 27,21 11,20 6,19','b');r(10,14,5,3,'h');r(23,10,4,3,'w');r(25,17,5,3,'h');face(13,24);}
 if(kind==='sheep'){for(const [x,y] of [[8,14],[15,10],[23,12],[27,18],[24,25],[9,24]])box(x,y,9,9,'h');box(12,18,17,12,'f');face(14,21);horn(8,9);horn(30,8,-1);box(5,20,5,7,'b');box(30,20,5,7,'b');}
 if(kind==='bear'){box(9,9,8,9,'b');box(24,9,8,9,'b');box(11,15,20,15,'b');r(15,23,11,6,'h');face(14,19);}
 if(kind==='mole'){box(11,11,19,19,'b');r(12,24,16,5,'a');r(13,19,4,1,'e');r(24,19,4,1,'e');box(18,22,5,4,'p');box(5,27,9,5,'h');box(28,27,8,5,'h');r(7,28,1,3,'k');r(10,28,1,3,'k');r(30,28,1,3,'k');}
}
function bird(kind='falcon'){
 p('17,26 12,35 18,34 21,37 25,33 29,34 25,25','o');p('18,27 16,33 20,32 21,34 24,31 26,32 23,27','a');
 p('12,18 5,13 3,16 5,25 10,29 15,27 27,25 34,23 38,16 36,14 27,18','o');p('12,20 6,16 5,18 7,24 11,27 15,25 27,23 33,21 35,17 27,20','b');r(7,20,4,1,'d');r(29,20,4,1,'d');
 box(12,12,17,18,'b');p('14,22 18,20 23,23 26,23 24,29 17,29','h');p('14,13 15,7 19,10 23,6 25,12','o');p('16,12 17,10 19,12 23,9 23,12','c');eye(15,16);eye(24,16);p('19,20 23,20 21,24','y');r(16,31,4,2,'y');r(24,31,4,2,'y');
 if(kind==='chicken'){box(17,7,4,5,'p');box(21,8,4,5,'p');r(20,24,2,3,'p');}
 if(kind==='duck'){box(17,20,9,4,'y');r(12,25,15,2,'f');}
 if(kind==='crow'){r(15,13,13,2,'a');p('20,20 28,21 22,24','k');}
}
function rabbit(){feet('b');box(12,21,18,13,'f');p('11,19 9,5 11,2 15,4 17,17 21,17 23,4 27,3 29,6 27,22','o');p('12,17 11,6 12,4 14,6 15,18 23,19 25,6 27,5 27,8 25,20','b');r(12,7,1,8,'h');r(25,7,1,8,'h');box(9,17,22,12,'f');box(29,26,6,7,'b');face(13,21);r(13,30,4,2,'h');}
function shell(kind='turtle'){
 feet('g');p('12,25 13,16 19,10 29,11 34,18 34,29 15,31','o');p('14,24 15,17 20,12 28,13 32,19 32,27 16,29','b');p('20,14 26,14 29,19 26,24 20,24 17,20','a');p('21,16 25,16 27,19 24,21 21,21','c');box(5,23,13,10,'f');eye(8,25);r(11,30,4,1,'k');
 if(kind==='snail'){r(5,19,2,6,'o');r(13,18,2,7,'o');r(5,18,2,2,'w');r(13,17,2,2,'w');box(8,32,27,3,'g');}
}
function bug(kind='beetle'){
 for(let y=19;y<30;y+=5){r(6,y,6,2,'o');r(29,y,6,2,'o');r(5,y+2,3,3,'a');r(33,y+2,3,3,'a');}
 box(10,16,21,17,'b');r(20,18,1,13,'o');r(12,20,3,8,'c');r(27,23,2,7,'a');box(12,10,17,10,'f');face(13,13);
 if(kind==='beetle'){p('17,12 16,7 13,5 14,2 19,6 20,9 23,5 27,3 27,7 23,10 23,12','o');p('18,10 18,7 15,5 19,7 21,11 24,7 25,6 22,11','c');}
 if(kind==='scorpion'){p('27,24 34,26 38,21 37,12 31,8 28,12 33,15 33,20 29,20','o');p('29,23 34,23 36,20 35,14 31,11 30,12 34,15 34,21','b');box(3,15,7,7,'b');box(30,15,7,7,'b');}
 if(kind==='shrimp'){r(9,6,1,9,'o');r(27,6,1,9,'o');r(6,6,4,1,'o');r(27,6,5,1,'o');r(12,25,17,1,'a');r(12,29,17,1,'a');}
}
function moth(){
 p('18,17 12,8 5,6 3,11 6,21 12,24 7,27 8,33 14,34 20,27 25,34 31,32 32,27 28,23 35,16 36,7 31,5 23,11','o');
 p('17,18 11,10 6,8 5,12 8,20 16,23 10,28 10,31 14,32 19,25 25,31 29,30 29,27 24,23 33,15 34,8 31,7 24,13','b');
 p('8,11 11,13 15,20 10,18','d');p('26,15 31,10 31,15 26,20','d');r(11,27,3,3,'y');r(25,27,3,3,'y');box(17,15,7,17,'f');r(17,10,1,6,'o');r(23,9,1,7,'o');eye(18,17);r(22,17,1,3,'e');
}
function aquatic(kind='fish'){
 p('27,19 34,12 37,13 36,21 38,28 34,30 27,26','o');p('29,20 35,15 34,21 36,27 34,28 29,24','b');
 p('13,16 16,9 21,7 25,14 27,18','o');p('16,15 18,10 20,9 23,15','c');box(5,16,26,14,'f');r(7,26,20,3,'g');eye(9,20);r(6,25,3,1,'k');p('19,22 27,21 24,28 20,27','b');r(8,18,6,1,'w');
 if(kind==='whale'){r(16,10,2,5,'b');r(12,8,4,2,'c');r(19,7,5,2,'c');r(13,28,9,2,'h');}
 if(kind==='frog'){box(9,11,7,9,'b');box(23,11,7,9,'b');box(8,20,23,12,'b');eye(11,13);eye(25,13);r(14,25,12,1,'k');box(4,28,9,6,'b');box(28,28,8,6,'b');}
}
function lizard(){
 p('24,25 30,25 34,22 35,16 38,20 36,28 31,32 24,32','o');p('26,27 31,27 35,24 36,21 34,28 30,30 26,30','b');feet('a');box(13,20,17,13,'b');p('18,22 24,22 25,30 18,31','h');box(8,12,20,13,'b');p('12,13 14,7 18,11 21,6 24,12','o');p('15,11 15,9 18,13 22,9 22,13','y');eye(12,16);eye(23,16);r(15,22,7,1,'k');r(13,14,6,1,'c');
}
function jelly(){
 for(const [x,y,h] of [[10,24,9],[16,25,12],[23,24,9],[29,23,10]]){box(x,y,4,h,'b');r(x+1,y+1,1,h-3,'c');}
 p('6,23 6,17 10,10 17,6 24,6 31,11 34,18 34,24 29,27 10,26','o');p('8,22 8,17 12,11 18,8 24,8 29,12 32,18 32,23 28,25 11,24','b');r(12,13,6,2,'d');r(14,10,3,2,'w');face(13,18);spark(20,10);
}
function bat(){
 p('13,20 9,9 5,12 2,22 7,21 8,27 13,25 19,29 27,25 32,27 34,21 38,22 35,10 31,8 27,19','o');p('12,21 8,12 6,14 4,20 8,19 10,24 14,23 26,23 31,24 32,19 36,20 33,12 31,11 28,22','b');box(13,15,15,17,'a');p('14,17 13,8 16,9 20,15 24,9 28,7 27,18','o');p('15,15 15,11 18,16 24,15 26,10 26,17','b');face(14,20);r(19,27,2,2,'w');}
function deer(){quadruped('weasel');r(14,30,3,7,'a');r(26,30,3,7,'a');horn(10,3);horn(29,3,-1);r(9,6,4,1,'y');r(27,5,5,1,'y');r(18,16,3,2,'h');}
const templates={sprout:()=>round('sprout'),ember:()=>{lizard();horn(8,5);horn(27,4,-1);r(10,26,4,4,'b');},otter:()=>{quadruped('weasel');p('29,12 34,6 36,10 35,17','o');p('31,12 34,9 34,15','c');r(10,24,4,1,'k');r(25,24,5,1,'k');},fox:()=>quadruped('fox'),lion:()=>{round('bear');p('9,16 6,21 9,26 8,30 14,33 19,32 24,34 31,30 32,25 35,20 30,16','o');p('10,17 8,21 11,25 10,29 15,31 20,30 25,32 29,29 30,24 33,20 29,18','b');box(12,17,17,12,'f');face(14,20);r(17,27,7,2,'h');},turtle:()=>shell(),falcon:()=>bird(),mushroom:()=>round('mushroom'),beetle:()=>bug(),dog:()=>quadruped('dog'),fish:()=>aquatic(),rabbit,moth,sheep:()=>round('sheep'),jelly,bat,lizard,raccoon:()=>{quadruped('weasel');r(9,19,19,4,'a');face(12,19);r(34,15,3,2,'h');r(33,21,3,2,'h');},chicken:()=>bird('chicken'),mole:()=>round('mole'),snail:()=>shell('snail'),deer,mouse:()=>quadruped('weasel'),bird:()=>bird(),cat:()=>quadruped('cat'),frog:()=>aquatic('frog'),shrimp:()=>bug('shrimp'),duck:()=>bird('duck'),ape:()=>{round('bear');r(9,25,5,9,'b');r(28,25,5,9,'b');r(15,16,11,3,'h');},weasel:()=>quadruped('weasel'),crow:()=>bird('crow'),scorpion:()=>bug('scorpion'),badger:()=>{quadruped('weasel');r(13,17,3,9,'h');r(22,17,3,9,'h');face(12,19);},whale:()=>aquatic('whale'),wolf:()=>quadruped('wolf'),bear:()=>round('bear'),dragon:()=>{bat();lizard();}};
const types=['sprout','ember','otter','fox','lion','turtle','falcon','mushroom','beetle','dog','fish','rabbit','bat','lizard','moth','sheep','jelly','raccoon',
'sprout','chicken','mole','snail','dog','deer','mouse','bird','beetle','dog','cat','frog','shrimp','duck','fox','ape','weasel','crow','scorpion','sheep','mole','lizard','moth','rabbit','badger','fox','whale','cat','deer','moth','wolf','sheep','falcon','bear','deer','dragon','weasel','crow','badger','fox'];
const regions={sprout:'叶片、芽与茎',ember:'红色躯干、头部、四肢和尾部',otter:'蓝色毛区与鳍',fox:'双耳、头顶、躯干、四肢及整条深色尾部',lion:'鬃毛',turtle:'龟壳',falcon:'羽毛与翼',mushroom:'菇帽',beetle:'背甲、角与足',dog:'毛区与尾部',fish:'背鳍、侧鳍与尾鳍',rabbit:'耳部、脚与尾球',bat:'翼膜与深色身体',lizard:'鳞片主体与尾部',moth:'四片翅膀',sheep:'角侧饰与侧毛',jelly:'伞盖与触须',raccoon:'深色毛区、眼罩底色和尾部'};
const original=['#52863b','#bd463c','#4284a8','#41465f','#c7943d','#69884e','#627bab','#b9546c','#6f8646','#5a954e','#cf786c','#78afc5','#765599','#bf983b','#b4759c','#a492c6','#4b90ad','#655c79'];
// Species IDs and names are read from v188. No change to game or save IDs.
const text=fs.readFileSync('game.js','utf8');const speciesBlock=text.slice(text.indexOf('const SPECIES='),text.indexOf('const MISSION_EXCLUSIVE_SPECIES='));const names=[...speciesBlock.matchAll(/name:\s*['"]([^'"]+)['"]/g)].map(m=>m[1]);
for(let i=0;i<types.length;i++){
 grid=Array.from({length:40},()=>Array(40).fill('0'));templates[types[i]]();
 // Unique native mission details, always assigned fixed/variable roles explicitly.
 if(i>=18){const group=Math.floor((i-18)/5),n=(i-18)%5;
  if(group===0){if(n===0){leaf(6,14);r(26,28,2,2,'p');}else r(18,27,4,2,'y');}
  if(group===1){leaf(28,9);if(n%2===0)leaf(6,14);}
  if(group===2){r(16,27,3,1,'w');r(22,29,3,1,'w');box(31,6,4,4,'c');r(32,7,1,1,'w');}
  if(group===3){r(17,13,6,1,'y');r(19,11,2,5,'y');r(17,29,6,2,'y');}
  if(group===4){p('26,16 27,6 30,3 34,8 31,18','o');p('28,14 29,7 30,5 32,9 30,15','c');r(29,7,1,4,'w');}
  if(group===5){spark(28,5);spark(5,14);r(18,28,4,1,'y');}
  if(group===6){p('6,25 3,21 4,18 7,19 8,22 11,23','h');spark(29,8);r(14,29,3,1,'w');}
  if(group===7){p('19,10 23,13 21,16 24,19 21,22 22,26 19,24 20,20 18,17 20,14','p');spark(31,5);}
 }
 designs.push({id:i,name:names[i],template:types[i],variableRegion:regions[types[i]]||'有色身体与种族饰件',fixedRegion:'描边、眼睛、高光、浅色脸腹、亮色纹理与固定饰件',base:original[i]||['#6d994d','#599184','#947351','#8269a8','#747aa8','#b89263','#66587e'][Math.floor((i-18)/5)%7],pixels:grid.map(row=>row.join(''))});
}
if(names.length!==58||designs.some(s=>!s.name))throw Error('Species mapping changed; review all art IDs');
fs.writeFileSync('art/sprites.json',JSON.stringify({version:189,width:40,height:40,species:designs},null,2)+'\n');
