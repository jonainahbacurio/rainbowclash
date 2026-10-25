const $=s=>document.querySelector(s),R=Math.random,cl=(v,a,b)=>Math.max(a,Math.min(b,v)),TAU=Math.PI*2,rc=a=>a[R()*a.length|0];
const COLS=[0xff3b3b,0xff9a1f,0xffd91f,0x35c759,0x2f8cff,0x5a46d6,0xb04ee0,0xff6fae,0x41d9d0,0xff7b55,0x9bdc4b,0x8a6bff],hx=c=>'#'+c.toString(16).padStart(6,'0');
const MAPS=[{id:'forest',n:'Sunny Forest',e:'🌲',p:0,sky:0x9fdcff,gnd:0x5cb85c,fog:0xd5f0ff,bg:'#8fd98f'},{id:'park',n:'Happy Park',e:'🌳',p:0,sky:0xa8e0ff,gnd:0x7ad06a,fog:0xe0f4ff,bg:'#b5e8a5'},{id:'fair',n:'Carousel Fair',e:'🎠',p:300,sky:0xffd6ec,gnd:0xe9c98f,fog:0xffeaf5,bg:'#ffc4e1'},{id:'beach',n:'Palm Beach',e:'🏝️',p:500,sky:0x8fe3ff,gnd:0xf6dfa0,fog:0xe6f8ff,bg:'#ffe9a8'},{id:'farm',n:'Farm Meadow',e:'🐄',p:700,sky:0xb0e4ff,gnd:0x8ccf5a,fog:0xe4f6ff,bg:'#c8ec9a'},{id:'snow',n:'Snowy Village',e:'⛄',p:900,sky:0xdbeeff,gnd:0xf4faff,fog:0xeef6ff,bg:'#d5e8ff'},{id:'candy',n:'Candy Land',e:'🍭',p:1200,sky:0xffe0f2,gnd:0xffd3e8,fog:0xfff0f8,bg:'#ffc2e0'},
{id:'space',n:'Moonmallow Space',e:'🌙',p:1500,sky:0x24265d,gnd:0x7775a8,fog:0x8e8acb,bg:'#7774c8'},
{id:'undersea',n:'Bubble Bay',e:'🫧',p:1800,sky:0x68d9ee,gnd:0x36b9c9,fog:0xc6faff,bg:'#7de4ee'},
{id:'volcano',n:'Peach Volcano',e:'🌋',p:2100,sky:0xffb39a,gnd:0x55425c,fog:0xffd1b9,bg:'#ffb49f'},
{id:'cloud',n:'Cloud Kingdom',e:'☁️',p:2400,sky:0x9dd8ff,gnd:0xf6f1ff,fog:0xf4f3ff,bg:'#d6e8ff'}];
// ---------- save ----------
let S0=null;try{S0=JSON.parse(localStorage.getItem('rc3d2'))}catch(e){}
const S=Object.assign({users:{},cur:''},S0||{});S.set=Object.assign({m:1,s:1,mv:.55,dark:0},S.set);if(S.set.dark)document.body.classList.add('dk');
let ONLINE=false;
async function api(p,b){try{const r=await fetch('/api/'+p,{method:b?'POST':'GET',headers:{'content-type':'application/json',authorization:'Bearer '+(S.tok||'')},body:b?JSON.stringify(b):undefined});return await r.json()}catch(e){return{error:'offline'}}}
const sv=()=>{try{localStorage.setItem('rc3d2',JSON.stringify(S))}catch(e){}if(ONLINE&&S.tok&&me()){clearTimeout(sv.t);sv.t=setTimeout(()=>api('save',{profile:me()}),700)}};
const me=()=>S.users[S.cur];
async function hsh(u,p){try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('rc|'+u+'|'+p));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(e){return btoa(u+':'+p)}}
// ---------- audio ----------
let AC,mg,mute=false,step=0,mus=false;
function au(){if(!AC){AC=new(window.AudioContext||window.webkitAudioContext)();mg=AC.createGain();mg.gain.value=.6;mg.connect(AC.destination);mloop()}if(AC.state!='running')AC.resume()}
function tone(f,d=.15,ty='sine',v=.2,sl=0,t0=0){if(!AC||mute||(mus?!S.set.m:!S.set.s))return;v*=mus?S.set.mv:1;const o=AC.createOscillator(),g=AC.createGain(),t=AC.currentTime+t0;o.type=ty;o.frequency.setValueAtTime(f,t);if(sl)o.frequency.exponentialRampToValueAtTime(f*sl,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(mg);o.start(t);o.stop(t+d+.02)}
const fq=n=>262*Math.pow(2,n/12),MU={forest:{s:[0,2,4,7,9],ms:520,w:'sine',r:0,v:.035},park:{s:[0,2,4,7,9],ms:560,w:'sine',r:2,v:.03},fair:{s:[0,2,4,5,7,9,11],ms:420,w:'triangle',r:5,v:.025},beach:{s:[0,2,4,5,7,9,10],ms:500,w:'sine',r:-2,v:.03},farm:{s:[0,2,4,5,7,9,11],ms:520,w:'sine',r:-5,v:.03},snow:{s:[0,2,3,7,8],ms:650,w:'sine',r:3,o:12,v:.03},candy:{s:[0,4,7,12,9,5],ms:460,w:'triangle',r:7,o:0,v:.025},space:{s:[0,3,7,10],ms:720,w:'sine',r:-5,v:.025},undersea:{s:[0,2,5,7,9],ms:600,w:'sine',r:-2,v:.025},volcano:{s:[0,2,3,7],ms:650,w:'sine',r:-7,v:.025},cloud:{s:[0,2,4,7,11],ms:620,w:'sine',r:4,v:.025}},MC={};
function mel(id,n){if(MC[id])return MC[id];let a=[...id].reduce((x,c)=>x*31+c.charCodeAt(0),7),i=2,o=[];for(let k=0;k<32;k++){a=(a*1103515245+12345)&0x7fffffff;const r=a%10;i=cl(i+(r<3?-1:r<6?1:r<7?2:0),0,n-1);o.push(r==9?-1:i)}return MC[id]=o}
const PR=[[0,4,7],[5,9,12],[7,11,14],[0,4,7]],TN=[[12,-1,16,-1,19,-1,16,-1,17,-1,21,-1,19,-1,17,-1,14,-1,19,-1,23,-1,19,-1,16,-1,14,-1,12,-1,-1,-1],[12,16,19,16,12,16,19,24,17,21,24,21,17,21,24,21,14,19,23,19,14,19,23,26,24,19,16,19,12,-1,-1,-1]];let nb;
function hat(v=.02){if(!AC)return;if(!nb){nb=AC.createBuffer(1,2205,44100);const d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(R()*2-1)*(1-i/d.length)}const s=AC.createBufferSource(),g=AC.createGain();s.buffer=nb;g.gain.value=v*S.set.mv*4;s.connect(g);g.connect(mg);s.start()}
function music(){if(mute||!AC||!S.set.m)return;const id=MAPS[mi]?.id||'forest',m=MU[id]||MU.forest,b=step%8,ch=PR[(step>>3)%4],r=m.r,t=TN[mi%2][step%32];mus=true;if(t>=0){tone(fq(t+r),.28,'triangle',.07);tone(fq(t+r+12),.14,'sine',.02)}if(b%4==0)tone(fq(ch[0]+r-12),.22,'triangle',.1);else if(b%4==2){tone(fq(ch[1]+r),.1,'sine',.04);tone(fq(ch[2]+r),.1,'sine',.04)}if(b%2==1)hat();if(b==0)tone(fq(ch[2]+r+24),.5,'sine',.02);mus=false;step++}
function mloop(){music();setTimeout(mloop,(MU[MAPS[mi]?.id||'forest']||MU.forest).ms*.37*(1-Math.min(lv,12)*.012))}
const sfx={pick(){[0,4,7,12].forEach((n,i)=>tone(fq(n+12),.22,'sine',.11,0,i*.055))},nope(){tone(330,.12,'sine',.055,.8)},hurt(){[0,5].forEach((n,i)=>tone(fq(n+2),.16,'triangle',.075,.7,i*.07))},win(){[0,4,7,12,16,19,24].forEach((n,i)=>tone(fq(n+12),.25,'sine',.12,0,i*.075))},lose(){[7,4,2,0].forEach((n,i)=>tone(fq(n),.24,'triangle',.09,0,i*.13))},see(){tone(740,.1,'sine',.035,1.3)},bump(){tone(190,.18,'sine',.14,1.8);tone(280,.2,'sine',.12,1.6,.13)}};
// ---------- three ----------
const cv=$('#cv'),rn=new THREE.WebGLRenderer({canvas:cv,antialias:true});rn.setPixelRatio(Math.min(devicePixelRatio,1.5));
const cam=new THREE.PerspectiveCamera(60,1,.1,400);let sc,cur,mi=0,cols=[],tg=[],en=[],hz=[],mud=[],an=[],pl,B;
let scKind='',bgOn=true,mmBig=false;
const G={sp:(r,w=14)=>new THREE.SphereGeometry(r,w,10),cy:(a,b,h,s=10)=>new THREE.CylinderGeometry(a,b,h,s),bx:(a,b,c)=>new THREE.BoxGeometry(a,b,c),co:(r,h,s=10)=>new THREE.ConeGeometry(r,h,s)};
const MC2={},M=c=>MC2[c]||(MC2[c]=new THREE.MeshLambertMaterial({color:c}));
function mk(g,c,x=0,y=0,z=0,p){const m=new THREE.Mesh(g,M(c));m.position.set(x,y,z);(p||sc).add(m);return m}
function grp(x=0,z=0){const g=new THREE.Group();g.position.set(x,0,z);sc.add(g);return g}
function shd(p,r){const m=new THREE.Mesh(new THREE.CircleGeometry(r,16),new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.22}));m.rotation.x=-Math.PI/2;m.position.y=.05;p.add(m)}
const col=(x,z,r,big)=>cols.push({x,z,r,big});
const lt=(c,a)=>new THREE.Color(c).offsetHSL(0,0,a);
function rp(m=8){let x,z,t=0;do{x=(R()*2-1)*B.x;z=B.zn+R()*(B.zx-B.zn);t++}while(t<40&&(Math.hypot(x,z)<m||cols.some(c=>Math.hypot(c.x-x,c.z-z)<c.r+2.4)));return[x,z]}
// props
function tree(x,z,s=1,lf=0x3fa84a){const g=grp(x,z);mk(G.cy(.28*s,.4*s,2.2*s,8),0x8a5a33,0,1.1*s,0,g);mk(G.sp(1.5*s),lf,0,3.1*s,0,g);mk(G.sp(1.05*s),lt(lf,.07),0,4.2*s,0,g);shd(g,1.6*s);col(x,z,.7*s,1)}
function pine(x,z,s=1,lf=0x2f8f4a,snow){const g=grp(x,z);mk(G.cy(.3*s,.4*s,1.2*s,8),0x7a4a2a,0,.6*s,0,g);for(let i=0;i<3;i++){mk(G.co((2-i*.5)*s,2*s,10),lf,0,(1.8+i*1.3)*s,0,g);if(snow)mk(G.co((1.6-i*.5)*s,1.3*s,10),0xffffff,0,(2.2+i*1.3)*s,0,g)}shd(g,1.8*s);col(x,z,.8*s,1)}
function palm(x,z,s=1){const g=grp(x,z);const t=mk(G.cy(.25*s,.4*s,6*s,8),0xb88a52,0,3*s,0,g);t.rotation.z=.12;for(let i=0;i<7;i++){const l=mk(G.sp(1,8),0x2fb04a,0,6.1*s,0,g);l.scale.set(2.4*s,.12,.6*s);l.rotation.y=i*TAU/7;l.position.x=Math.cos(i*TAU/7)*1.5*s+.7*s;l.position.z=-Math.sin(i*TAU/7)*1.5*s;l.rotation.z=-.3}mk(G.sp(.35*s),0x7a4a22,.6*s,5.8*s,0,g);shd(g,1.6);col(x,z,.6*s,1)}
function bush(x,z,c=0x3a9a45){const b=mk(G.sp(1,10),c,x,.7,z);b.scale.set(1.3,.9,1.3);col(x,z,1.1)}
function flower(x,z){const c=rc([0xff5d8f,0xffe14d,0xffffff,0xff9a3c,0xc78bff,0x6fc9ff]);mk(G.cy(.04,.04,.6,5),0x3a9a45,x,.3,z);mk(G.sp(.2,8),c,x,.65,z)}
function grass(x,z,c=0x4aa84a){for(let i=0;i<3;i++)mk(G.co(.1,.7,4),c,x+i*.12,.35,z+(i%2)*.1)}
function rock(x,z,s=1){const r=mk(new THREE.DodecahedronGeometry(s),0x9a9aa8,x,s*.5,z);r.scale.y=.7;col(x,z,s,0)}
function bench(x,z){const g=grp(x,z);g.rotation.y=R()*TAU;mk(G.bx(2.4,.2,.8),0xc98a4a,0,.7,0,g);mk(G.bx(2.4,.7,.15),0xc98a4a,0,1.1,-.4,g);mk(G.bx(.2,.7,.7),0x555,-1,.35,0,g);mk(G.bx(.2,.7,.7),0x555,1,.35,0,g);col(x,z,1.3)}
function lamp(x,z){const g=grp(x,z);mk(G.cy(.1,.14,4,6),0x44485a,0,2,0,g);mk(G.sp(.45),0xfff2a8,0,4.2,0,g);col(x,z,.3)}
function fountain(x,z){const g=grp(x,z);mk(G.cy(4,4.4,.9,16),0xd8d8e8,0,.45,0,g);mk(G.cy(3.5,3.5,.7,16),0x6fd0ff,0,.6,0,g);mk(G.cy(.4,.55,2.6,8),0xd8d8e8,0,1.5,0,g);mk(G.sp(.8),0x9fe6ff,0,3,0,g);col(x,z,4.4,1)}
function house(x,z,c=0xffb8a0){const g=grp(x,z);mk(G.bx(5,3.4,5),c,0,1.7,0,g);const r=mk(G.co(4.2,2.4,4),0xc2504a,0,4.6,0,g);r.rotation.y=Math.PI/4;mk(G.bx(1,1.8,.1),0x7a4a2a,0,.9,2.55,g);mk(G.bx(1,1,.1),0x9fe0ff,1.5,2,2.55,g);mk(G.bx(1,1,.1),0x9fe0ff,-1.5,2,2.55,g);col(x,z,3.6,1)}
function snowman(x,z){const g=grp(x,z);mk(G.sp(1),0xffffff,0,1,0,g);mk(G.sp(.75),0xffffff,0,2.3,0,g);mk(G.sp(.5),0xffffff,0,3.2,0,g);mk(G.co(.1,.6,6),0xff8a1f,0,3.2,.6,g).rotation.x=Math.PI/2;mk(G.cy(.4,.4,.5,8),0x333,0,3.8,0,g);mk(G.sp(.06),0,-.18,3.3,.45,g);mk(G.sp(.06),0,.18,3.3,.45,g);shd(g,1.2);col(x,z,1)}
function tent(x,z,c){const g=grp(x,z);mk(G.cy(2.2,2.2,2,12),0xffffff,0,1,0,g);mk(G.co(2.8,2.6,12),c,0,3.3,0,g);mk(G.cy(.05,.05,1.5),0x555,0,5.2,0,g);mk(G.bx(1,1.5,.1),0x6a3a2a,0,.75,2.2,g);col(x,z,2.6,1)}
function umbrella(x,z,c){const g=grp(x,z);mk(G.cy(.07,.07,3,6),0xffffff,0,1.5,0,g);mk(G.co(2,.9,10),c,0,3.2,0,g);col(x,z,.4)}
function castle(x,z){const g=grp(x,z);mk(G.cy(1.3,1.5,1.2,8),0xe8c27a,0,.6,0,g);mk(G.cy(.5,.6,1.5,8),0xe8c27a,0,1.9,0,g);col(x,z,1.5)}
function balloons(x,z){const g=grp(x,z);mk(G.cy(.03,.03,3,4),0x666,0,1.5,0,g);[0xff5d8f,0x6fc9ff,0xffe14d,0x8be37f].forEach((c,i)=>{const b=mk(G.sp(.5),c,Math.cos(i*1.6)*.6,3.4+i%2*.4,Math.sin(i*1.6)*.6,g);b.scale.y=1.2});col(x,z,.4)}
function carousel(x,z){const g=grp(x,z);mk(G.cy(5,5.2,.6,20),0xff9ac8,0,.3,0,g);const r=new THREE.Group();g.add(r);mk(G.cy(.3,.3,5,8),0xffe14d,0,3,0,r);for(let i=0;i<6;i++){const a=i*TAU/6,h=new THREE.Group();h.position.set(Math.cos(a)*3.4,0,Math.sin(a)*3.4);h.rotation.y=-a;r.add(h);mk(G.cy(.06,.06,4,5),0xffe14d,0,2.6,0,h);const c=[0xffffff,0xffb347,0x9fe0ff][i%3];const b=mk(G.bx(1.8,.8,.6),c,0,1.3,0,h);mk(G.sp(.4),c,.9,1.8,0,h);mk(G.bx(.2,.7,.2),0x6a3a2a,.6,.7,0,h);mk(G.bx(.2,.7,.2),0x6a3a2a,-.6,.7,0,h);an.push((t)=>{h.position.y=Math.sin(t*3+i)*.3})}mk(G.cy(5.4,5.4,.3,20),0xff4f6d,0,5.6,0,g);mk(G.co(5.6,2.8,20),0xffffff,0,7.1,0,g);mk(G.sp(.4),0xffe14d,0,8.7,0,g);an.push((t,d)=>r.rotation.y+=d*.8);col(x,z,5.4,1)}
function wheel(x,z){const g=grp(x,z),w=new THREE.Group();w.position.y=9.5;g.add(w);mk(new THREE.TorusGeometry(8,.25,6,32),0xff5d8f,0,0,0,w);mk(new THREE.TorusGeometry(4,.18,6,24),0xffffff,0,0,0,w);const gs=[];for(let i=0;i<10;i++){const a=i*TAU/10;mk(G.bx(.12,.12,16),0xdddddd,0,0,0,w).rotation.z=a;const c=mk(G.bx(1.4,1.2,1.2),COLS[i%7],Math.cos(a)*8,Math.sin(a)*8,0,w);gs.push(c)}mk(G.bx(.4,10,.4),0x7a7a9a,-3,4.5,1,g).rotation.z=.3;mk(G.bx(.4,10,.4),0x7a7a9a,3,4.5,1,g).rotation.z=-.3;mk(G.bx(.4,10,.4),0x7a7a9a,-3,4.5,-1,g).rotation.z=.3;mk(G.bx(.4,10,.4),0x7a7a9a,3,4.5,-1,g).rotation.z=-.3;an.push((t,d)=>{w.rotation.z+=d*.25;gs.forEach((c,i)=>c.rotation.z=-w.rotation.z)});col(x,z,3.5,1)}
function swing(x,z){const g=grp(x,z);g.rotation.y=R()*3;mk(G.bx(.2,3.4,.2),0xff5d8f,-2,1.7,0,g);mk(G.bx(.2,3.4,.2),0xff5d8f,2,1.7,0,g);mk(G.bx(4.2,.2,.2),0xff5d8f,0,3.4,0,g);mk(G.bx(.8,.1,.5),0x6fc9ff,-.8,1,0,g);mk(G.bx(.8,.1,.5),0xffe14d,.8,1,0,g);col(x,z,2.2)}
function mush(x,z){mk(G.cy(.12,.15,.4,6),0xf5ecd8,x,.2,z);mk(new THREE.SphereGeometry(.4,8,6,0,TAU,0,Math.PI/2),0xff4f4f,x,.4,z)}
function logp(x,z){const l=mk(G.cy(.4,.4,3,8),0x8a5a33,x,.4,z);l.rotation.z=Math.PI/2;l.rotation.y=R()*3;col(x,z,1.4)}
function cart(x,z){const g=grp(x,z);g.rotation.y=R()*TAU;mk(G.bx(2.2,1.1,1.4),rc([0xff7aa8,0x6fc9ff,0xffe14d]),0,.9,0,g);mk(G.co(1.7,.8,4),0xffffff,0,2.1,0,g).rotation.y=Math.PI/4;[-.8,.8].forEach(s=>mk(G.cy(.35,.35,.15,12),0x333,s,.35,.75,g).rotation.x=Math.PI/2);col(x,z,1.5)}
function mill(x,z){const g=grp(x,z);mk(G.cy(1.2,2,7,10),0xf3e6c8,0,3.5,0,g);mk(G.co(1.8,1.6,10),0xc2504a,0,7.8,0,g);const w=new THREE.Group();w.position.set(0,6.5,1.3);g.add(w);for(let i=0;i<4;i++){const b=mk(G.bx(.5,5,.1),0xffffff,-Math.sin(i*Math.PI/2)*2.5,Math.cos(i*Math.PI/2)*2.5,0,w);b.rotation.z=i*Math.PI/2}an.push((t,d)=>w.rotation.z+=d*.8);col(x,z,2.2,1)}
function bale(x,z){const b=mk(G.cy(.9,.9,1.2,12),0xe8c24a,x,.9,z);b.rotation.z=Math.PI/2;b.rotation.y=R()*3;col(x,z,1)}
function cow(x,z){const g=grp(x,z);g.rotation.y=R()*TAU;mk(G.bx(1.1,.9,1.8),0xffffff,0,1.2,0,g);mk(G.bx(.5,.5,.4),0x2a2a33,.3,1.4,.3,g);mk(G.bx(.6,.6,.7),0xffffff,0,1.5,1.2,g);mk(G.bx(.5,.3,.2),0xffb0c0,0,1.35,1.6,g);[[-.4,-.7],[.4,-.7],[-.4,.7],[.4,.7]].forEach(([a,b])=>mk(G.cy(.1,.1,.8,6),0xffffff,a,.4,b,g));col(x,z,1.2)}
function sunf(x,z){mk(G.cy(.05,.05,1.4,5),0x3a9a45,x,.7,z);mk(G.sp(.4,8),0xffd91f,x,1.45,z).scale.z=.3;mk(G.sp(.2,6),0x6a3a1a,x,1.45,z+.1)}
function lolli(x,z){mk(G.cy(.08,.08,3.2,6),0xffffff,x,1.6,z);mk(G.sp(1,14),rc([0xff5d8f,0x6fc9ff,0xffb62e,0xb04ee0,0x35c759]),x,3.6,z).scale.z=.35;mk(new THREE.TorusGeometry(.6,.1,6,16),0xffffff,x,3.6,z+.15);col(x,z,.5)}
function cane(x,z){const g=grp(x,z);for(let i=0;i<7;i++)mk(G.cy(.2,.2,.5,8),i%2?0xffffff:0xff3b5c,0,.25+i*.5,0,g);mk(new THREE.TorusGeometry(.4,.2,6,10,Math.PI),0xff3b5c,.4,3.5,0,g);col(x,z,.4)}
function cupcake(x,z){const g=grp(x,z);mk(G.cy(1.2,.9,1.2,12),rc([0xffb347,0x9fe0ff]),0,.6,0,g);mk(G.sp(1.15,12),0xffd0e8,0,1.7,0,g).scale.y=.8;mk(G.sp(.28),0xff3b5c,0,2.6,0,g);col(x,z,1.4,1)}
function icecream(x,z){const g=grp(x,z);mk(G.co(.9,2.2,12),0xe8b86a,0,1.1,0,g).rotation.x=Math.PI;mk(G.sp(1),0xffb0d0,0,2.6,0,g);mk(G.sp(.75),0xfff3c0,0,3.5,0,g);col(x,z,1,1)}
function gum(x,z){mk(new THREE.SphereGeometry(1,10,8,0,TAU,0,Math.PI/2),rc([0xff5d8f,0x6fc9ff,0xffd91f,0x8be37f]),x,0,z).scale.set(1.3,1.2,1.3);col(x,z,1.2)}
function fence(){const c=cur.id=='snow'?0xffffff:cur.id=='fair'?0xff7aa8:cur.id=='beach'?0xc98a4a:cur.id=='farm'?0xb07a40:cur.id=='candy'?0xff8ac0:0x2f8f45;const h=cur.id=='forest'||cur.id=='park'?2.2:1.2;[[0,B.zn-1,B.x*2+4,1],[0,B.zx+1,B.x*2+4,1],[-B.x-1,(B.zn+B.zx)/2,1,B.zx-B.zn+4],[B.x+1,(B.zn+B.zx)/2,1,B.zx-B.zn+4]].forEach(([x,z,w,d])=>{mk(G.bx(w,h,d),c,x,h/2,z)});for(let i=0;i<7;i++){const a=i*TAU/7+.3;mk(G.co(40,45,8),lt(cur.gnd,-.12),Math.cos(a)*170,22,Math.sin(a)*170)}for(let i=0;i<8;i++){const c=new THREE.Group();c.position.set((R()*2-1)*120,32+R()*8,(R()*2-1)*120);sc.add(c);[[0,0],[2,0],[-2,.5],[1,1]].forEach(([a,b])=>mk(G.sp(2.2),0xffffff,a,b,0,c));an.push((t,d)=>{c.position.x+=d*.8;if(c.position.x>130)c.position.x=-130})}}
function build(m,lv){cur=m;B={x:52,zn:-52,zx:m.id=='beach'?34:52};sc=new THREE.Scene();const dk=S.set.dark;sc.background=new THREE.Color(m.sky);sc.fog=new THREE.Fog(m.fog,lv>=4?16:50,lv>=4?58:140);cols=[];tg=[];en=[];hz=[];mud=[];an=[];
sc.add(new THREE.HemisphereLight(0xffffff,0xcfe0c0,.95));const d=new THREE.DirectionalLight(0xffffff,.55);d.position.set(30,50,20);sc.add(d);
mk(new THREE.PlaneGeometry(600,600),m.gnd).rotation.x=-Math.PI/2;
const n=(k,f)=>{k=k>=40?k*.5|0:k;for(let i=0;i<k;i++){const[x,z]=rp(7);f(x,z)}},id=m.id;
if(id=='forest'){n(55,(x,z)=>tree(x,z,.8+R()*.8,rc([0x3fa84a,0x2f9a4a,0x56b84a])));n(10,(x,z)=>pine(x,z,.9+R()*.5));n(12,(x,z)=>bush(x,z));n(10,(x,z)=>rock(x,z,.6+R()));const p=mk(G.cy(7,7,.1,24),0x5fc8ff,-25,.05,20);col(-25,20,7);mk(G.cy(7.5,7.5,.08,24),0x9a7a4a,-25,.03,20);house(30,-25,0xc99a6a);n(14,mush);n(7,logp);n(100,flower);n(120,grass)}
if(id=='fair'){carousel(-20,-14);wheel(24,-24);n(7,(x,z)=>tent(x,z,rc([0xff5d8f,0x4aa8ff,0xffb62e,0x9a6bf0])));n(10,balloons);n(8,lamp);n(8,bench);n(70,(x,z)=>{mk(G.cy(.1,.1,.05,6),rc([0xff5d8f,0xffe14d,0x6fc9ff]),x,.03,z)});mk(G.cy(10,10,.05,24),0xf7a8c8,0,.03,0);n(30,(x,z)=>tree(x,z,.7,0xff8fc0));n(3,cart)}
if(id=='park'){fountain(0,-22);for(let i=-50;i<50;i+=10)mk(G.bx(5,.05,10),0xe8d8b8,0,.03,i);mk(G.bx(100,.05,5),0xe8d8b8,0,.04,-22);n(30,(x,z)=>tree(x,z,.8+R()*.7));n(12,bench);n(10,lamp);n(4,swing);n(14,bush);n(3,cart);n(110,flower);n(120,grass)}
if(id=='beach'){const w=mk(G.bx(400,.1,200),0x4fc8ff,0,.03,B.zx+100);an.push(t=>w.position.y=.03+Math.sin(t)*.06);mk(G.bx(400,.1,12),0xffffff,0,.06,B.zx-.5);n(26,(x,z)=>palm(x,z,.8+R()*.5));n(9,(x,z)=>umbrella(x,z,rc([0xff5d8f,0xffe14d,0x4aa8ff,0x9a6bf0])));n(6,castle);n(12,(x,z)=>rock(x,z,.6+R()*.5));n(14,bush,0x4aa84a);n(40,(x,z)=>grass(x,z,0x9ac24a))}
if(id=='snow'){n(30,(x,z)=>pine(x,z,.9+R()*.7,0x2f8f4a,1));n(6,(x,z)=>house(x,z,rc([0xffb8a0,0xffe08a,0xa8d8ff,0xd8b8ff])));n(8,snowman);n(8,lamp);n(10,(x,z)=>rock(x,z,.7+R()*.5));mk(G.cy(8,8,.1,24),0xbfe8ff,25,.05,-22);col(25,-22,8);n(80,(x,z)=>mk(G.sp(.35,6),0xffffff,x,.15,z))}
if(id=='farm'){mill(-25,-20);mk(G.cy(12,12,.05,24),0xb8955a,28,.04,-22);house(28,-22,0xd2483c);n(10,bale);n(8,cow);n(26,(x,z)=>tree(x,z,.9));n(60,sunf);n(140,(x,z)=>mk(G.co(.2,.6,5),0x4aa84a,x,.3,z));n(10,bush);n(100,grass)}
if(id=='candy'){n(26,lolli);n(14,cane);n(7,cupcake);n(5,icecream);n(24,gum);n(70,(x,z)=>mk(G.sp(.3,6),rc([0xff5d8f,0xffd91f,0x6fc9ff,0x8be37f]),x,.3,z))}
if(id=='space'){n(35,(x,z)=>{const r=mk(G.sp(.5+R()*1.3,10),rc([0x9b8cff,0x6fc9ff,0xffb7e3,0x8be37f]),x,.2,z);r.scale.y=.5;col(x,z,.8)});for(let i=0;i<9;i++){const x=(R()*2-1)*45,z=(R()*2-1)*45;const p=mk(G.sp(1.4+R()*2),0x9d9bbd,x,.2,z);p.scale.y=.3;col(x,z,1.4)}n(16,lolli)}
if(id=='undersea'){n(45,(x,z)=>{const b=mk(G.sp(.5+R()*1.1,12),rc([0x73e6ff,0x8df2d4,0xffb7e3,0x8ca8ff]),x,.5+R()*2,z);b.material.transparent=true;b.material.opacity=.72;b.scale.y=1.2;col(x,z,.8)});n(18,(x,z)=>tree(x,z,.5,0x39bba7));n(14,rock);n(55,flower)}
if(id=='volcano'){n(30,(x,z)=>rock(x,z,.7+R()*1.6));n(20,(x,z)=>mush(x,z));n(12,(x,z)=>tree(x,z,.7,0x6f9b65));n(30,(x,z)=>mk(G.sp(.25,8),rc([0xff754f,0xffc45e,0xffe8a0]),x,.3,z));house(25,-22,0xffa58f)}
if(id=='cloud'){n(28,(x,z)=>{const c=grp(x,z);mk(G.sp(1.5),0xffffff,0,1,0,c);mk(G.sp(1.1),0xffffff,1,1.2,0,c);mk(G.sp(1),0xffffff,-1,1.1,0,c);col(x,z,1.5,1)});n(18,(x,z)=>tree(x,z,.6,0x91d9a4));n(24,flower);n(10,balloons);castle(0,-20)}
fence();
// hazards
const ns=cl(lv-1,0,8);for(let i=0;i<ns;i++){const[x,z]=rp(14),g=grp(x,z),sp=(R()<.5?-1:1)*(1+lv*.12);mk(G.cy(.5,.7,2,8),0x555566,0,1,0,g);const a=new THREE.Group();a.position.y=1.2;g.add(a);mk(G.bx(8,.5,.6),0xff4f6d,0,0,0,a);mk(G.bx(1.6,.52,.62),0xffffff,-2.6,0,0,a);mk(G.bx(1.6,.52,.62),0xffffff,2.6,0,0,a);col(x,z,.7);hz.push({k:'s',x,z,a,sp,th:R()*TAU});}
if(lv>=3)for(let i=0;i<cl(lv,3,8);i++){const[x,z]=rp(10);mk(G.cy(3,3,.06,18),0x7a5a3a,x,.07,z);mud.push({x,z,r:3})}
if(lv>=5)for(let i=0;i<cl(lv-3,1,7);i++){const[x,z]=rp(14),b=grp(x,z),s=mk(G.sp(1.3),0xff7ac8,0,1.3,0,b);mk(new THREE.TorusGeometry(1.3,.12,6,20),0xffffff,0,1.3,0,b);shd(b,1.4);const a=R()*TAU;hz.push({k:'b',g:b,x,z,vx:Math.cos(a)*6,vz:Math.sin(a)*6})}
extras(lv)}
// ---------- characters (cute creatures, no hats / scarves) ----------
const CH=[
{id:'pink',n:'Bubbles',e:'🌸',p:0,c:0xff9ac8,d:0xff7fb0,ear:'round'},
{id:'blu',n:'Blu Bloop',e:'👾',p:150,c:0x6bb6ff,d:0x3a86e8,ear:'horn'},
{id:'sprout',n:'Sprout',e:'🌱',p:200,c:0x8fe06b,d:0x4fb04a,ear:'sprout'},
{id:'zappy',n:'Zappy',e:'⚡',p:250,c:0xffe45c,d:0xffb62e,ear:'antenna'},
{id:'ghost',n:'Boo Boo',e:'👻',p:300,c:0xf4f4ff,d:0xc8c8f0,ear:'none'},
{id:'pumpkin',n:'Pumpkin',e:'🎃',p:350,c:0xffa24d,d:0xff7a1f,ear:'sprout'},
{id:'alien',n:'Peep',e:'👽',p:400,c:0x9be56e,d:0x4f9b58,ear:'antenna'},
{id:'grape',n:'Grape',e:'🍇',p:450,c:0xb48cff,d:0x8a5be0,ear:'horn'},
{id:'jelly',n:'Jelly',e:'💧',p:500,c:0x7be3f5,d:0x3fb7d8,ear:'stalk'},
{id:'cherry',n:'Cherry',e:'🍒',p:550,c:0xff6b7e,d:0xd93a55,ear:'sprout'},
{id:'minty',n:'Minty',e:'🍃',p:600,c:0x7fe8c4,d:0x3fc79a,ear:'round'},
{id:'cotton',n:'Cotton',e:'🍬',p:700,c:0xffc8ec,d:0xa8d8ff,ear:'wing'},
{id:'beep',n:'Beep',e:'🤖',p:800,c:0xc8d2e6,d:0x7a8ab0,ear:'antenna'},
{id:'sunny',n:'Sunny',e:'☀️',p:900,c:0xffd84a,d:0xff9f1c,ear:'spikes'},
{id:'star',n:'Stardust',e:'⭐',p:1000,c:0x9b7bff,d:0xffe14d,ear:'wing'}];
function mkFace(){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d'),F={t:new THREE.CanvasTexture(c),k:'',draw(bl=0,expression=.65){const k=bl+'|'+expression;if(k===F.k)return;F.k=k;x.clearRect(0,0,256,256);x.lineCap='round';
// flat, soft blush and simple printed-on features (no raised facial meshes)
x.fillStyle='rgba(255,105,155,.38)';[[52,151],[204,151]].forEach(([a,b])=>{x.beginPath();x.ellipse(a,b,20,12,0,0,TAU);x.fill()});
const mood=typeof expression==='string'?expression:(expression<0?'angry':expression<.25?'confused':expression<.48?'surprised':'happy');
x.fillStyle='#30213f';x.strokeStyle='#30213f';x.lineWidth=5;
if(bl<.8){[80,176].forEach((a,i)=>{x.beginPath();x.ellipse(a,112,14,23,0,0,TAU);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(a+4,103,5.5,0,TAU);x.fill();x.beginPath();x.arc(a-4,119,2.5,0,TAU);x.fill();x.fillStyle='#30213f'});}else{[80,176].forEach(a=>{x.beginPath();x.moveTo(a-12,113);x.quadraticCurveTo(a,120,a+12,113);x.stroke()})}
if(mood==='angry'){x.lineWidth=6;x.beginPath();x.moveTo(65,82);x.lineTo(91,91);x.moveTo(165,91);x.lineTo(191,82);x.stroke();x.lineWidth=7;x.beginPath();x.moveTo(105,174);x.quadraticCurveTo(128,155,151,174);x.stroke()}
else if(mood==='confused'){x.lineWidth=5;x.beginPath();x.moveTo(66,82);x.quadraticCurveTo(80,73,94,84);x.moveTo(165,80);x.quadraticCurveTo(180,88,192,77);x.stroke();x.lineWidth=6;x.beginPath();x.moveTo(116,168);x.quadraticCurveTo(128,157,141,165);x.stroke()}
else if(mood==='surprised'){x.beginPath();x.ellipse(128,170,10,14,0,0,TAU);x.fill()}
else {x.lineWidth=5;x.beginPath();x.moveTo(65,82);x.quadraticCurveTo(80,70,95,82);x.moveTo(161,82);x.quadraticCurveTo(176,70,191,82);x.stroke();x.lineWidth=7;x.beginPath();x.moveTo(104,163);x.quadraticCurveTo(128,expression>.82?199:188,152,163);x.stroke();if(expression>.82){x.fillStyle='#fff';x.beginPath();x.moveTo(111,177);x.lineTo(145,177);x.lineTo(140,185);x.lineTo(116,185);x.fill()}}
F.t.needsUpdate=true}};F.draw(0,.7);return F}
function cute(ch){const g=new THREE.Group(),b=new THREE.Group();g.add(b);const bd=mk(G.sp(.95,20),ch.c,0,1,0,b);bd.scale.y=.92;const F=mkFace(),fp=new THREE.Mesh(new THREE.PlaneGeometry(1.22,1.02),new THREE.MeshBasicMaterial({map:F.t,transparent:true,depthWrite:false,side:THREE.DoubleSide}));fp.position.set(0,1,.98);b.add(fp);F.draw(0,.5);const d=ch.d,A=ch.ear;
if(A=='round')[-1,1].forEach(s=>mk(G.sp(.32),d,s*.68,1.72,0,b));
if(A=='horn')[-1,1].forEach(s=>{mk(G.co(.2,.5,8),d,s*.42,2.05,0,b).rotation.z=-s*.3});
if(A=='sprout'){mk(G.cy(.04,.05,.5,6),0x3a9a45,0,2.1,0,b);[-1,1].forEach(s=>{const l=mk(G.sp(.2,8),0x56c85a,s*.2,2.4,0,b);l.scale.set(1.3,.5,.7);l.rotation.z=s*.4})}
if(A=='antenna')[-1,1].forEach(s=>{const st=mk(G.cy(.03,.03,.55,6),d,s*.35,2.1,0,b);st.rotation.z=-s*.3;mk(G.sp(.14,8),0xffe16b,s*.46,2.38,0,b)});
if(A=='stalk')[-1,1].forEach(s=>{const st=mk(G.cy(.04,.04,.6,6),d,s*.35,2.1,0,b);st.rotation.z=-s*.3;mk(G.sp(.22,12),0xffffff,s*.5,2.42,0,b);mk(G.sp(.12,8),0x2a1f3d,s*.5,2.42,.15,b)});
if(A=='wing')[-1,1].forEach(s=>{const w=mk(G.sp(.4,10),d,s*1.05,1.55,0,b);w.scale.set(.25,1,1.2);w.rotation.z=-s*.5});
if(A=='spikes')for(let i=-3;i<=3;i++){const a=i*.42;mk(G.co(.16,.45,6),d,Math.sin(a)*.9,1+Math.cos(a)*.86,-.05,b).rotation.z=-a}
const f=[-.4,.4].map(x=>mk(G.sp(.3),d,x,.2,.15,g)),a=[-1,1].map(s=>mk(G.sp(.2),d,s*.98,.85,0,b));
shd(g,1.1);g.userData={b,bd,f,a,face:F};return g}
// ---------- cute alien enemies (no legs, they float & hop) ----------
const ALC=[0x5aa8ff,0xff6b9e,0xa56bff,0xffc233,0x37d6a0,0xff9a3c,0x6fe0ff,0xff7ac8];
function alien(c,t){const g=new THREE.Group(),H=new THREE.Group();g.add(H);const D=lt(c,-.18),Y=1.8,K=new THREE.Color(c),css='#'+K.getHexString(),hot='#'+K.clone().lerp(new THREE.Color(0xff5a6a),.5).getHexString();
const cn=document.createElement('canvas');cn.width=512;cn.height=256;const x=cn.getContext('2d'),T=new THREE.CanvasTexture(cn);T.wrapS=THREE.RepeatWrapping;T.offset.x=.25;
const face={t:T,k:'',draw(bl=0,m='happy'){const k=bl+m;if(k===face.k)return;face.k=k;const an=m==='angry';x.fillStyle=an?hot:css;x.fillRect(0,0,512,256);x.fillStyle='rgba(255,110,170,.5)';[[128,182],[384,182]].forEach(([a,b])=>{x.beginPath();x.ellipse(a,b,26,14,0,0,TAU);x.fill()});x.lineCap='round';
[-1,1].forEach(s=>{x.save();x.translate(256+s*62,112);x.rotate(-s*.3);if(bl){x.strokeStyle='#1d1230';x.lineWidth=7;x.beginPath();x.arc(0,-8,22,.2,Math.PI-.2);x.stroke()}else{const w=m==='surprised'?36:32,h=m==='surprised'?50:44;x.fillStyle='#1d1230';x.beginPath();x.ellipse(0,0,w,h,0,0,TAU);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(-10,-17,11,0,TAU);x.fill();x.beginPath();x.arc(11,15,5,0,TAU);x.fill()}x.restore()});
x.strokeStyle='#1d1230';x.fillStyle='#1d1230';x.lineWidth=7;x.beginPath();if(an)x.arc(256,214,22,Math.PI*1.15,Math.PI*1.85);else if(m==='surprised'||m==='confused'){x.ellipse(256,194,12,15,0,0,TAU);x.fill()}else x.arc(256,176,24,.2,Math.PI-.2);x.stroke();T.needsUpdate=true}};
const hd=new THREE.Mesh(new THREE.SphereGeometry(.9,36,28),new THREE.MeshLambertMaterial({map:T}));hd.position.y=Y;hd.scale.set(1.08,1,1.02);H.add(hd);
const orb=rc([0xfff29a,0xffa9d0,0xb8ffcf]);
if(t%2){mk(G.cy(.03,.04,.5,6),D,0,Y+.95,0,H);mk(G.sp(.18,12),orb,0,Y+1.36,0,H)}else[-1,1].forEach(s=>{const s_=mk(G.cy(.03,.04,.5,6),D,s*.34,Y+.92,0,H);s_.rotation.z=-s*.28;mk(G.sp(.14,12),orb,s*.43,Y+1.3,0,H)});
if(t%3==2)[-1,1].forEach(s=>mk(G.sp(.22,10),D,s*.95,Y-.05,0,H).scale.set(.45,1,.7));
mk(G.sp(.4,16),c,0,.5,0,H).scale.set(1,1.1,.9);
[-1,1].forEach(s=>mk(G.sp(.15,10),D,s*.17,.04,.12,H).scale.set(1,.6,1.4));
const arms=[-1,1].map(s=>{const a=new THREE.Group();a.position.set(s*.4,.62,0);H.add(a);mk(G.sp(.12,10),D,s*.1,-.12,0,a);return a});
const sh=new THREE.Mesh(new THREE.CircleGeometry(.9,20),new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.22}));sh.rotation.x=-Math.PI/2;sh.position.y=-.35;g.add(sh);
const mood=['surprised','happy','confused','surprised','happy','angry'][t%6];face.draw(0,mood);
g.userData={bd:hd,legs:arms,head:H,tail:new THREE.Group(),face,mood};return g}
const eqp=()=>(me()||{}).eq||{ch:'pink'};
function mkPlayer(){const e=eqp();return cute(CH.find(x=>x.id==e.ch)||CH[0])}
function dress(){if(pl)sc.remove(pl);pl=mkPlayer();sc.add(pl)}
function mkTarget(i){const g=new THREE.Group(),c=COLS[i],b=new THREE.Group();g.add(b);b.position.y=1.3;const s=1.25;
if(i==0){mk(G.sp(.6),c,0,0,0,b);mk(G.cy(.04,.04,.35,5),0x6a4a2a,0,.65,0,b);mk(G.sp(.18,6),0x35a84a,.2,.7,0,b).scale.y=.4}
if(i==1){mk(G.sp(.62),c,0,0,0,b);mk(G.sp(.15,6),0x35a84a,0,.62,0,b)}
if(i==2){const t=mk(new THREE.TorusGeometry(.6,.2,8,14,2.4),c,0,0,0,b);t.rotation.z=.9;mk(G.sp(.12,6),0x6a4a2a,-.4,.4,0,b)}
if(i==3){mk(G.sp(.55),c,0,-.2,0,b);mk(G.sp(.35),c,0,.4,0,b);mk(G.cy(.03,.03,.3,4),0x6a4a2a,0,.8,0,b)}
if(i==4){mk(G.bx(1,1,1),c,0,0,0,b);mk(G.bx(.3,1.02,1.02),0xffffff,0,0,0,b)}
if(i==5){mk(G.co(.6,1.3,12),c,0,0,0,b);mk(G.sp(.2),0xffe14d,0,.7,0,b)}
if(i==6)[[0,.5],[-.3,.1],[.3,.1],[-.15,-.3],[.15,-.3],[0,-.65]].forEach(([x,y])=>mk(G.sp(.28,10),c,x,y,0,b));
if(i==7){mk(new THREE.TorusGeometry(.45,.2,8,16),c,0,0,0,b);mk(G.sp(.23),0xffffff,0,.12,.05,b)}
if(i==8){mk(G.sp(.52),c,0,0,0,b);mk(G.sp(.18),0xffffff,-.2,.2,.42,b);mk(G.sp(.18),0xffffff,.2,.2,.42,b)}
if(i==9){mk(G.co(.58,1.3,10),c,0,0,0,b);mk(G.sp(.22),0xffe14d,0,.5,0,b)}
if(i==10){mk(G.sp(.56),c,0,0,0,b);mk(G.sp(.2),0xffffff,0,.55,0,b)}
if(i==11){mk(G.co(.62,1.2,6),c,0,0,0,b);mk(G.sp(.22),0xffe14d,0,.7,0,b)}
shd(g,.9);g.scale.setScalar(s);return g}
// ---------- game ----------
let st='menu',lv=1,sel=1,seq=[],idx=0,lives=3,score=0,tl=0,total=0,inv=0,yaw=0,pitch=.5,zm=3,ct=0,ms=0,slowTimer=0,P={x:0,z:0,h:0,w:0};
const K={};let jx=0,jy=0;
function setHUD(){$('#lv').textContent=lv;$('#sc').textContent=score;$('#lives').textContent='♥'.repeat(lives)+'♡'.repeat(Math.max(0,3-lives));$('#seq').innerHTML=seq.map((c,i)=>`<div class="chip ${i==idx?'cur':i<idx?'done':''}" style="background:${hx(COLS[c])}" title="${['Red','Orange','Yellow','Green','Blue','Indigo','Violet','Pink','Aqua','Coral','Lime','Lavender'][c]}"></div>`).join('');const guide=$('#mm-guide-colors');if(guide)guide.innerHTML=seq.map((c,i)=>`<i class="guide-dot ${i<idx?'done':''} ${i===idx?'next':''}" style="--dot:${hx(COLS[c])}" title="${i+1}. ${['Red','Orange','Yellow','Green','Blue','Indigo','Violet','Pink','Aqua','Coral','Lime','Lavender'][c]}"></i>`).join('')}
function gameFX(kind,label){const root=$('#fx');if(!root||st!='play')return;root.innerHTML='';const el=document.createElement('div');el.className='fx-burst '+kind;el.textContent=label;root.appendChild(el);setTimeout(()=>el.remove(),1500)}
function start(){au();bg(false);scKind='game';lv=sel;build(MAPS[mi],lv);const k=Math.min(3+((lv-1)>>1),COLS.length);seq=[...Array(k).keys()];idx=0;lives=3;score=0;slowTimer=0;total=tl=Math.max(55,125-lv*6);inv=0;P={x:0,z:0,h:0,w:0,y:0,vy:0};yaw=0;
if(pl)pl=null;dress();
const put=(i)=>{let x,z,t=0;do{[x,z]=rp(10);t++}while(t<40&&cols.some(c=>Math.hypot(c.x-x,c.z-z)<c.r+2));const g=mkTarget(i);g.position.set(x,0,z);sc.add(g);tg.push({c:i,g,x,z,cd:0,on:1})};
seq.forEach(i=>{put(i);put(i)});for(let i=k;i<COLS.length;i++)put(i);
tg.forEach(t=>{t.ox=t.x;t.oz=t.z;t.ph=R()*6;t.mv=lv>=5});for(let i=0;i<Math.min(2+lv,16);i++)mkEn(lv);if(lv%5==0){mkEn(lv);const b=en[en.length-1];b.g.scale.setScalar(2.2);b.boss=1;b.cs+=.9}document.body.classList.remove('sad');won=0;shk=0;setTimeout(()=>gameFX('fx-win','Level '+lv+' · '+(lv%5==0?'👑 Boss alien!':['Collect the colors in order! 🌈','Spinning sweepers! 🌀','Mud puddles slow you down! 🟤','Fog rolls in… 🌫️','Bouncy bumpers! 🎈','Targets are on the move! 🎯','Slippery ice! 🧊','Wind gusts push you! 💨','Aliens get speedy! ⚡'][(lv-1)%9])),250);
$('#ov').style.display='none';$('#hud').style.display='flex';$('#bar').style.display='block';$('#mm').style.display='flex';$('#joy').style.display=$('#jb').style.display=matchMedia('(pointer:coarse)').matches?'block':'none';setHUD();st='play'}
function mkEn(lv){const[x,z]=rp(26),g=alien(rc(ALC),R()*6|0),o=g.userData.bd.material.color.getHex();g.scale.setScalar(1.15);g.position.set(x,0,z);sc.add(g);en.push({g,x,z,h:R()*TAU,s:'roam',tx:x,tz:z,wt:0,base:o,lx:0,lz:0,lost:0,rs:2.6+lv*.18,cs:Math.min(3.8+lv*.32,7.4),ph:R()*9})}
function hurt(sx,sz){if(inv>0||st!='play')return;lives--;inv=2;shk=.25;sfx.hurt();sfx.bump();fxw(P.x,1.4,P.z,6,['💫','⭐'],160);gameFX('fx-hit','BOING! 💫');let dx=P.x-sx,dz=P.z-sz,d=Math.hypot(dx,dz)||1;P.x+=dx/d*3.4;P.z+=dz/d*3.4;setHUD();if(lives<=0)end(false)}
const ad=(a,b)=>{let d=(a-b)%TAU;if(d>Math.PI)d-=TAU;if(d<-Math.PI)d+=TAU;return d};
function los(a,b,c,d){for(let i=1;i<7;i++){const x=a+(c-a)*i/7,z=b+(d-b)*i/7;if(cols.some(o=>o.big&&Math.hypot(o.x-x,o.z-z)<o.r))return false}return true}
function fix(o,r){cols.forEach(c=>{const dx=o.x-c.x,dz=o.z-c.z,d=Math.hypot(dx,dz),m=c.r+r;if(d<m&&d>.001){o.x=c.x+dx/d*m;o.z=c.z+dz/d*m}});o.x=cl(o.x,-B.x,B.x);o.z=cl(o.z,B.zn,B.zx)}
function update(dt){ct+=dt;an.forEach(f=>f(ct,dt));if(st=='end'){P.h+=dt*(won?5:1.5);P.y=won?Math.abs(Math.sin(ct*6))*1.2:0}
if(st=='menu'&&focus&&scKind=='shop'){P.h=.7+Math.sin(ct*1.1)*.6;P.y=Math.abs(Math.sin(ct*2.2))*.28}
const play=st=='play',vis=cur.id=='x'?60:(lv>=4?18:30);
if(play){let ix=(K.KeyD||K.ArrowRight?1:0)-(K.KeyA||K.ArrowLeft?1:0)+jx,iy=(K.KeyW||K.ArrowUp?1:0)-(K.KeyS||K.ArrowDown?1:0)+jy;if(K.KeyQ)yaw+=dt*2;if(K.KeyE)yaw-=dt*2;const m=Math.hypot(ix,iy);if(m>1){ix/=m;iy/=m}
const sy=Math.sin(yaw),cy=Math.cos(yaw),vx=-sy*iy+cy*ix,vz=-cy*iy-sy*ix;let sp=slowTimer>0?3.4:9;if(mud.some(u=>Math.hypot(u.x-P.x,u.z-P.z)<u.r))sp=Math.min(sp,4);slowTimer=Math.max(0,slowTimer-dt);$('#slowhint')?.classList.toggle('show',slowTimer>0);if($('#slowhint'))$('#slowhint').textContent=slowTimer>0?`🫧 Slowed ${slowTimer.toFixed(1)}s`:'';
{const onI=ice.some(u=>Math.hypot(u.x-P.x,u.z-P.z)<u.r),k=onI?Math.min(1,dt*1.4):1;P.vx=P.vx||0;P.vz=P.vz||0;P.vx+=(vx*sp-P.vx)*k;P.vz+=(vz*sp-P.vz)*k;P.x+=P.vx*dt;P.z+=P.vz*dt;if(lv>=8){wt-=dt;if(wt<0){wt=6+R()*4;wa=R()*TAU;wl=1.6;gameFX('fx-slow','💨 Gust of wind!')}if(wl>0){wl-=dt;P.x+=Math.sin(wa)*5*dt;P.z+=Math.cos(wa)*5*dt;}}}fix(P,.8);P.m=m>.1;if(m>.1){P.h+=ad(Math.atan2(vx,vz),P.h)*Math.min(1,dt*12);P.w+=dt*14}
P.y=.05+Math.sin(ct*1.7)*.045;tl-=dt;if(tl<=0){tl=0;end(false)}inv=Math.max(0,inv-dt);
tg.forEach(t=>{if(!t.on)return;t.cd-=dt;const d=Math.hypot(t.x-P.x,t.z-P.z);if(d<1.8){if(t.c==seq[idx]){t.on=0;sc.remove(t.g);idx++;score+=100;sfx.pick();gameFX('fx-pick','+'+'100 ✨');fxw(t.x,1.6,t.z,8,['✨','⭐'],180);if(lv>=7&&lv%2==1)tg.forEach(o=>{if(o.on){const[nx,nz]=rp(10);fxw(o.x,1.4,o.z,6,['💨'],120);o.x=o.ox=nx;o.z=o.oz=nz;o.g.position.set(nx,0,nz)}});setHUD();if(idx>=seq.length)end(true)}else if(t.cd<=0){t.cd=1;slowTimer=2.4;sfx.nope();fxw(P.x,1.2,P.z,4,['🫧'],100,-60);gameFX('fx-slow','🫧 Wrong color!');}}});
hz.forEach(h=>{if(h.k=='s'){h.th+=h.sp*dt;h.a.rotation.y=h.th;const dx=P.x-h.x,dz=P.z-h.z,ax=Math.cos(h.th),az=-Math.sin(h.th),s=dx*ax+dz*az,c=-dx*az+dz*ax;if(Math.abs(s)<4.2&&Math.abs(c)<1.1&&P.y<1.2)hurt(h.x,h.z)}else{h.x+=h.vx*dt;h.z+=h.vz*dt;if(Math.abs(h.x)>B.x)h.vx*=-1;if(h.z<B.zn||h.z>B.zx)h.vz*=-1;h.g.position.set(h.x,Math.abs(Math.sin(ct*4))*1.2,h.z);h.g.rotation.z+=dt*3;if(Math.hypot(P.x-h.x,P.z-h.z)<2.2&&P.y<1)hurt(h.x,h.z)}})}
// enemies
en.forEach(e=>{if(e.dead)return;if(e.life!==undefined&&(e.life-=dt)<=0){e.dead=1;sc.remove(e.g);fxw(e.x,1.5,e.z,4,['💨'],120);return}const dx=P.x-e.x,dz=P.z-e.z,d=Math.hypot(dx,dz),sees=play&&(d<8||(d<vis&&Math.abs(ad(Math.atan2(dx,dz),e.h))<1.1))&&los(e.x,e.z,P.x,P.z);
if(sees){if(e.s!='chase')sfx.see();e.s='chase';e.lx=P.x;e.lz=P.z;e.lost=0}else if(e.s=='chase'){e.lost+=dt;if(e.lost>1.2){e.s='search';e.tx=e.lx;e.tz=e.lz;e.wt=0}}
let sp=e.rs;if(e.s=='chase'){e.tx=P.x;e.tz=P.z;sp=e.cs}else if(e.s=='search'){sp=e.rs*1.4;if(Math.hypot(e.tx-e.x,e.tz-e.z)<1.5){e.wt+=dt;sp=0;e.h+=dt*3;if(e.wt>2.2)e.s='roam'}}else{if(Math.hypot(e.tx-e.x,e.tz-e.z)<2||e.wt<=0){const[x,z]=rp(0);e.tx=x;e.tz=z;e.wt=8+R()*8}e.wt-=dt}
if(sp>0){e.h+=ad(Math.atan2(e.tx-e.x,e.tz-e.z),e.h)*Math.min(1,dt*(e.s=='chase'?8:3));e.x+=Math.sin(e.h)*sp*dt;e.z+=Math.cos(e.h)*sp*dt;en.forEach(o=>{if(o!==e&&!o.dead){const ax=e.x-o.x,az=e.z-o.z,dd=Math.hypot(ax,az),mn=e.boss||o.boss?4:2.6;if(dd<mn&&dd>.01){e.x+=ax/dd*(mn-dd)*.35;e.z+=az/dd*(mn-dd)*.35}}});fix(e,.9)}
const ch=e.s=='chase',u=e.g.userData,bd=u.bd.material.color;u.face.draw(Math.sin(ct*1.7+e.ph)>0.992?1:0,ch?'angry':e.s=='search'?'confused':u.mood);const ph=ct*(ch?12:e.s=='search'?4:7)+e.ph,am=sp==0?0:ch?.95:.5;u.legs.forEach((l,i)=>{l.rotation.x=0;l.rotation.z=Math.sin(ct*1.8+e.ph+i)*.08});e.g.position.set(e.x,(.42+Math.abs(Math.sin(ct*(e.s=='chase'?6:2.4)+e.ph))*.22)*e.g.scale.x,e.z);e.g.rotation.y=e.h;u.head.rotation.x=ch?.08:e.s=='search'?.12+Math.sin(ct*3)*.04:Math.sin(ct*.8+e.ph)*.025;u.head.rotation.z=Math.sin(ph*.25)*.025;
if(play&&d<(e.boss?3.4:1.9)&&P.y<.9){if(inv<=0)twin(e);hurt(e.x,e.z)}});en=en.filter(e=>!e.dead);
// player
const u=pl.userData,mvg=P.m&&play,sw=mvg?Math.sin(P.w):0,air=false,bt=(ct*.9+1)%3.4;pl.position.set((st=='menu'&&scKind=='shop'&&tab=='ch'&&!window.matchMedia('(max-width: 700px)').matches)?3.05:P.x,P.y,P.z);pl.rotation.y=(st=='menu'&&scKind=='shop')?Math.sin(ct*.45)*.12:P.h;pl.rotation.z=mvg?sw*.05:0;u.b.position.y=Math.abs(sw)*.05;
u.f[0].position.set(-.4,.2+(mvg?Math.max(0,Math.cos(P.w))*.045:0),.15+(air?.08:sw*.18));u.f[1].position.set(.4,.2+(mvg?Math.max(0,-Math.cos(P.w))*.045:0),.15+(air?-.05:-sw*.18));u.a[0].position.z=-sw*.3;u.a[1].position.z=sw*.3;u.a[0].position.y=u.a[1].position.y=air?1.5:.85;
u.face.draw(bt<.09?1:bt<.16?.65:0,inv>0?'angry':(Math.sin(ct*.47)>.86?'surprised':Math.sin(ct*.31)<-.88?'confused':.62+.32*Math.sin(ct*.7)));pl.visible=inv<=0||Math.floor(ct*12)%2==0;
tg.forEach(t=>{if(t.on&&t.mv&&st=='play'){t.x=cl(t.ox+Math.cos(ct*.7+t.ph)*3.5,-B.x,B.x);t.z=cl(t.oz+Math.sin(ct*.7+t.ph)*3.5,B.zn,B.zx);t.g.position.x=t.x;t.g.position.z=t.z}if(t.on){t.g.children[0].position.y=1.3+Math.sin(ct*2+t.x)*.25;t.g.children[0].rotation.y=ct*1.5}});
if(st=='menu'||st=='end'){if(scKind=='shop'){const mobile=window.matchMedia('(max-width: 700px)').matches;cam.position.set(0,mobile?2.7:3.0,mobile?8.4:10.5);cam.lookAt(0,mobile?1.15:1.45,0)}else{if(st=='end'){const a=ct*.5;cam.position.set(P.x+Math.sin(a)*8,3.6,P.z+Math.cos(a)*8);cam.lookAt(P.x,1.6,P.z)}else{const r_=focus?7.5:38,h_=focus?3:16;cam.position.set(r_*.72,h_,r_*.72);cam.lookAt(0,focus?1.6:3,0)}}}else{const dd=11,cp=Math.cos(pitch);cam.position.set(P.x+Math.sin(yaw)*dd*cp,1.6+Math.sin(pitch)*dd,P.z+Math.cos(yaw)*dd*cp);if(shk>0){cam.position.x+=(R()-.5)*shk*.8;cam.position.y+=(R()-.5)*shk*.8;shk=Math.max(0,shk-dt*3)}cam.lookAt(P.x,1.8,P.z)}
}
// minimap (click it or press M to zoom)
const mmc=$('#mmc'),mx=mmc.getContext('2d');
function drawMM(){const W=340,full=mmBig&&zm<=3.01,s=full?(W-24)/(B.x*2):zm*(mmBig?4.4:3.2),cx=full?0:P.x,cz=full?(B.zn+B.zx)/2:P.z,X=x=>170+(x-cx)*s,Z=z=>170+(z-cz)*s,dot=(x,z,r,f,l=3)=>{mx.fillStyle=f;mx.strokeStyle='#fff';mx.lineWidth=l;mx.beginPath();mx.arc(x,z,r,0,TAU);mx.fill();mx.stroke()},edge=(x,z,f)=>{const a=Math.atan2(z-170,x-170),d=Math.hypot(x-170,z-170);if(mmBig||d<148)return 0;mx.save();mx.translate(170+Math.cos(a)*150,170+Math.sin(a)*150);mx.rotate(a);mx.fillStyle=f;mx.strokeStyle='#fff';mx.lineWidth=2.5;mx.beginPath();mx.moveTo(10,0);mx.lineTo(-7,-8);mx.lineTo(-7,8);mx.closePath();mx.fill();mx.stroke();mx.restore();return 1};
mx.setTransform(1,0,0,1,0,0);mx.clearRect(0,0,480,480);mx.save();mx.scale(480/340,480/340);mx.beginPath();if(mmBig)mx.rect(0,0,W,W);else mx.arc(170,170,170,0,TAU);mx.clip();mx.fillStyle=hx(cur.gnd);mx.fillRect(0,0,W,W);
mx.fillStyle='#ffffff66';mx.fillRect(X(-B.x),Z(B.zn),B.x*2*s,(B.zx-B.zn)*s);mx.strokeStyle='#fff';mx.lineWidth=3;mx.strokeRect(X(-B.x),Z(B.zn),B.x*2*s,(B.zx-B.zn)*s);
cols.forEach(c=>{if(c.r<.5)return;mx.fillStyle=c.big?'#2f7a3acc':'#8a8a99cc';mx.beginPath();mx.arc(X(c.x),Z(c.z),Math.max(2,c.r*s),0,TAU);mx.fill()});
mud.forEach(u=>{mx.fillStyle='#7a5a3acc';mx.beginPath();mx.arc(X(u.x),Z(u.z),u.r*s,0,TAU);mx.fill()});ice.forEach(u=>{mx.fillStyle='#bfeaffcc';mx.beginPath();mx.arc(X(u.x),Z(u.z),u.r*s,0,TAU);mx.fill()});
hz.forEach(h=>dot(X(h.x),Z(h.z),Math.max(4,1.4*s),'#ff4f6d',2));
mx.textAlign='center';tg.forEach(t=>{if(!t.on)return;const nx=t.c==seq[idx],o=seq.indexOf(t.c)+1,x=X(t.x),z=Z(t.z);if(nx&&edge(x,z,hx(COLS[t.c])))return;const r=nx?12+Math.sin(ct*6)*2.5:8;dot(x,z,r,hx(COLS[t.c]),nx?5:2);if(nx){mx.strokeStyle='#fff36b';mx.lineWidth=3;mx.beginPath();mx.arc(x,z,r+5,0,TAU);mx.stroke()}if(o){mx.fillStyle='#fff';mx.strokeStyle='#0007';mx.lineWidth=3;mx.font='bold 12px Fredoka';mx.strokeText(o,x,z+4);mx.fillText(o,x,z+4)}});
en.forEach(e=>{const x=X(e.x),z=Z(e.z),ch=e.s=='chase',f=ch?'#ff2030':'#8a45d6';if(edge(x,z,f))return;const r=e.boss?14:10;dot(x,z,r,f,3);mx.fillStyle='#fff';mx.beginPath();mx.arc(x-3.5,z-1,2.7,0,TAU);mx.arc(x+3.5,z-1,2.7,0,TAU);mx.fill();mx.fillStyle='#1d1230';mx.beginPath();mx.arc(x-3.5,z-1,1.2,0,TAU);mx.arc(x+3.5,z-1,1.2,0,TAU);mx.fill();if(ch){mx.fillStyle='#fff';mx.strokeStyle='#ff2030';mx.lineWidth=3;mx.font='bold 13px Fredoka';mx.strokeText('!',x,z-r-3);mx.fillText('!',x,z-r-3)}});
mx.translate(X(P.x),Z(P.z));mx.rotate(-P.h);mx.fillStyle='#ff6aa8';mx.strokeStyle='#fff';mx.lineWidth=3;mx.beginPath();mx.moveTo(0,15);mx.lineTo(-10,-10);mx.lineTo(10,-10);mx.closePath();mx.fill();mx.stroke();mx.restore()}
const mmTog=()=>{mmBig=!mmBig;$('#mm').classList.toggle('big',mmBig);$('#mm').setAttribute('aria-expanded',String(mmBig))};mmc.onclick=mmTog;
// ---------- backgrounds ----------
function bg(on){bgOn=on;$('#hb').style.display=on?'block':'none';cv.style.visibility=on?'hidden':'visible'}
const ALS=[
{c:'#5aa8ff',d:'#2f7fe0',l:'3%',b:'15%',z:100,dl:-.2,eyes:[[28,20,44]],an:1,o:1},
{c:'#ff6b9e',d:'#e0457c',l:'15%',b:'13%',z:78,dl:-.9,eyes:[[16,26,28],[56,26,28]],hn:1},
{c:'#a56bff',d:'#7a45d6',l:'27%',b:'17%',z:68,dl:-1.2,eyes:[[10,34,26],[64,34,26],[37,10,26]],an:1},
{c:'#ffc233',d:'#e09a10',l:'70%',b:'16%',z:74,dl:-.5,eyes:[[16,26,28],[56,26,28]],an:1,o:1},
{c:'#37d6a0',d:'#1fa87c',l:'81%',b:'12%',z:92,dl:-1.4,eyes:[[28,20,44]],hn:1},
{c:'#ff9a3c',d:'#e0721a',l:'89%',b:'17%',z:68,dl:-.7,eyes:[[16,26,28],[56,26,28]],an:1}];
function alHTML(a,style){return `<div class="al" style="--c:${a.c};--d:${a.d};--z:${a.z};${style}">${a.an?'<i class="an" style="left:30%;--r:-12deg"></i><i class="an" style="left:64%;--r:12deg"></i>':''}${a.hn?'<i class="hn" style="left:10%;--r:-18deg"></i><i class="hn" style="right:10%;--r:18deg"></i>':''}<div class="bd"><i class="ar l"></i><i class="ar r"></i>${a.eyes.map(([l,t,w])=>`<b class="ey" style="left:${l}%;top:${t}%;width:${w}%;height:${w*1.05}%"><s></s></b>`).join('')}<u class="mo ${a.o?'op':''}"></u><em class="ck l"></em><em class="ck r"></em></div></div>`}
const letters=(w,off)=>[...w].map((ch,i)=>`<b style="--c:${hx(COLS[(i+off)%7])};animation-delay:${(i+off)*.12}s">${ch}</b>`).join('');
const sign=()=>`<div class="sign"><div class="plank"><i class="nail a"></i><i class="nail b"></i><i class="nail c"></i><i class="nail d"></i><div class="tl">${letters('RAINBOW',0)}</div><div class="tl t2">${letters('CLASH',3)}</div></div><i class="ss s1">✨</i><i class="ss s2">⭐</i><i class="ss s3">✨</i></div>`;
function buildBG(){let s='<div class="sunw"><div class="rays"></div><div class="sun2"><i class="e l"></i><i class="e r"></i><i class="m"></i><i class="sk l"></i><i class="sk r"></i></div></div><div class="arch"></div>';
[[10,150,60,0],[24,110,80,-25],[42,190,95,-50],[56,130,70,-12],[68,100,110,-70]].forEach(([t,w,d,dl])=>s+=`<div class="cloud" style="top:${t}%;--w:${w}px;animation-duration:${d}s;animation-delay:${dl}s"></div>`);
['#ff5d8f','#4aa8ff','#ffd93d','#35c759','#b04ee0','#ff9a3c'].forEach((c,i)=>s+=`<i class="bl" style="--c:${c};left:${8+i*17}%;animation-duration:${16+i*3}s;animation-delay:${-i*4}s"></i>`);
for(let i=0;i<18;i++)s+=`<i class="sp" style="left:${R()*96}%;top:${R()*70}%;font-size:${10+R()*16}px;animation-delay:${-R()*2.4}s;animation-duration:${1.8+R()*1.6}s">✦</i>`;
s+='<div class="hill h3"></div>';ALS.forEach(a=>s+=alHTML(a,`left:${a.l};bottom:${a.b};animation-delay:${a.dl}s`));
s+='<div class="hill h1"></div><div class="hill h2"></div>';
for(let i=0;i<16;i++)s+=`<i class="fl" style="left:${R()*96}%;bottom:${1+R()*10}%;animation-delay:${-R()*2.6}s">${rc(['🌸','🌼','🌷','🍄','🌻'])}</i>`;
$('#hb').innerHTML=s;
$('#lg').innerHTML=`<div class="tl">${letters('RAINBOW',0)}</div><div class="tl t2">${letters('CLASH',3)}</div>`;
$('#cg').innerHTML=ALS.slice(0,5).map((a,i)=>alHTML(a,`position:relative;animation-duration:1s;animation-delay:${-i*.18}s`)).join('')}
// flow
function end(win){if(st!='play')return;st='end';const p=me();hideHud();$('#fx').innerHTML='';
if(win){won=1;celebrate();score+=Math.floor(tl)*5+lives*50;sfx.win();p.lvl=Math.max(p.lvl,lv+1);p.best=Math.max(p.best,score);p.pts+=score;p.tot+=score;p.mapScores=p.mapScores||{};p.mapScores[cur.id]=(p.mapScores[cur.id]||0)+score;sv();const stars=lives==3&&tl>total*.4?3:lives>=2?2:1;
panel(`<div class="mas">🏆</div><h1>Level ${lv} clear!</h1><div class="st">${'⭐'.repeat(stars)}${'☆'.repeat(3-stars)}</div><div class="row"><div class="pill"><small>Score</small><b>${score}</b></div><div class="pill"><small>Time left</small><b>${Math.floor(tl)}s</b></div></div><button class="btn go" data-a="next">Next level ▶</button><br><button class="btn sm" data-a="home">Home</button>`)}
else{won=0;sad();sfx.lose();p.best=Math.max(p.best,score);p.pts+=score;p.tot+=score;p.mapScores=p.mapScores||{};p.mapScores[cur.id]=(p.mapScores[cur.id]||0)+score;sv();panel(`<div class="mas">😵</div><h1>${lives<=0?'Caught!':'Time’s up!'}</h1><p>The little aliens got you. Try again — you can do it!</p><div class="row"><div class="pill"><small>Score</small><b>${score}</b></div></div><button class="btn go" data-a="retry">Retry ↻</button><br><button class="btn sm" data-a="home">Home</button>`)}}
let tab='ch',authTab='in',focus=false,errm='',inv_=0;
const hideHud=()=>{$('#hud').style.display=$('#bar').style.display=$('#mm').style.display=$('#joy').style.display=$('#jb').style.display='none';$('#slowhint')?.classList.remove('show');mmBig=false;$('#mm').classList.remove('big')};
$('#jb').onpointerdown=()=>K.Space=1;$('#jb').onpointerup=()=>K.Space=0;
const TR=[{id:'spark',n:'Sparkles',e:'✨',p:0},{id:'heart',n:'Hearts',e:'💖',p:120},{id:'star',n:'Stars',e:'⭐',p:200},{id:'bub',n:'Bubbles',e:'🫧',p:260},{id:'petal',n:'Petals',e:'🌸',p:320},{id:'rain',n:'Rainbow',e:'🌈',p:500}],ALL={ch:CH,map:MAPS,tr:TR},U=me,owned=(k,it)=>it.p==0||U().own.includes(k+'_'+it.id),rank=()=>Object.values(S.users).sort((a,b)=>b.tot-a.tot).indexOf(U())+1;
function panel(h,pos){pos=pos||st=='end';const o=$('#ov');o.style.display='flex';o.style.alignItems=pos?'flex-end':'center';focus=!!pos;o.innerHTML='<div class="card">'+h+'</div>';if(pos)o.firstChild.style.margin='auto auto 0'}
function bare(h){const o=$('#ov');o.style.display='flex';o.style.alignItems='center';focus=false;o.innerHTML='<div class="hm">'+h+'</div>'}
function toBG(){document.body.classList.remove('sad');hideHud();bg(true);scKind='';st='menu'}
function stage(){hideHud();bg(false);scKind='map';st='menu';build(MAPS[mi],1);for(let i=0;i<4;i++)mkEn(1);dress();P={x:0,z:0,h:0,w:0,y:0,vy:0}}
function stageShop(){hideHud();bg(false);scKind='shop';st='menu';cur=MAPS[mi];sc=new THREE.Scene();sc.background=new THREE.Color(S.set.dark?0x2a2052:0xffeaf6);sc.add(new THREE.HemisphereLight(0xffffff,0xd8c8f5,1));const d=new THREE.DirectionalLight(0xffffff,.55);d.position.set(10,20,15);sc.add(d);cols=[];tg=[];en=[];hz=[];mud=[];an=[];
const fl=mk(new THREE.CircleGeometry(60,40),S.set.dark?0x3d3070:0xdcc8ff);fl.rotation.x=-Math.PI/2;fl.position.y=-.6;
mk(G.cy(2.8,3.1,.6,32),0xffffff,0,-.3,0);mk(new THREE.TorusGeometry(2.7,.12,8,40),0xff7ab8,0,.02,0).rotation.x=Math.PI/2;
const cs=[0xff3b5c,0xffb62e,0xffe14d,0x35c759,0x3aa0ff,0x9a6bf0,0xff7ab8];
for(let i=0;i<14;i++){const s=mk(G.sp(.14+R()*.12,8),cs[i%7],0,0,0),a=R()*TAU,r=3+R()*3,y=1+R()*4,sp=.3+R()*.5;an.push(t=>{s.position.set(Math.cos(a+t*sp)*r,y+Math.sin(t*1.5+a)*.4,Math.sin(a+t*sp)*r)})}
pl=null;P={x:0,z:0,h:.8,w:0,y:0,vy:0};dress()}
function home(){toBG();const u=U();bare(`${sign()}<div class="hi">Hey, <b>${u.d}</b>! 🌈</div><div class="row"><div class="pill"><small>🪙 Coins</small><b>${u.pts}</b></div><div class="pill"><small>🏅 Rank</small><b>#${rank()}</b></div></div><div class="home-actions"><button class="btn go" style="--i:0" data-a="playp"><span class="ic">▶</span> PLAY</button><button class="btn b-or" style="--i:1" data-a="board"><span class="ic">🏆</span> RANKS</button><button class="btn b-pk" style="--i:2" data-a="shop"><span class="ic">🛍️</span> SHOP</button><button class="btn b-bl" style="--i:3" data-a="sett"><span class="ic">⚙️</span> SETTINGS</button></div>`)}
function playP(){if(scKind!='map')stage();const u=U();sel=cl(sel,1,u.lvl);panel(`<h1>Choose a map</h1><div class="maps">${MAPS.map((m,i)=>{const o=owned('map',m);return `<div class="mc ${i==mi?'on':''} ${o?'':'lk'}" data-a="${o?'pm':'lkd'}" data-i="${i}" style="background:${m.bg}"><span>${o?m.e:'🔒'}</span>${m.n}${o?'':`<small>🪙 ${m.p}</small>`}</div>`}).join('')}</div><div class="row"><div class="pill"><button class="btn sm" data-a="lm" style="margin:0">◀</button><small>Level</small><b>${sel}</b><button class="btn sm" data-a="lp" style="margin:0">▶</button></div></div><button class="btn go" data-a="play">START</button><br><button class="btn sm" data-a="home">Back</button>`)}
function shop(iv){
if(scKind!='shop')stageShop();inv_=iv;const u=U();if(iv&&tab=='map')tab='ch';
const L=ALL[tab].filter(it=>!iv||owned(tab,it));
if(!L.some(x=>x.id===previewId))previewId=(L[0]||{}).id||'';
const chosen=L.find(x=>x.id===previewId)||L[0]||{id:'',e:'✨',n:'Choose a treasure',p:0};
if(tab==='ch'&&chosen.id&&scKind==='shop'){P={x:0,z:0,h:0,w:0,y:0,vy:0}}
const isOwned=chosen.id?owned(tab,chosen):false,isEquipped=chosen.id&&u.eq[tab]===chosen.id;
const buyOrEquip=chosen.id?(isOwned?(tab!=='map'?`<button class="btn shop-main-action" data-a="eq" data-i="${chosen.id}">${isEquipped?'✓ Equipped':'Equip this!'}</button>`:`<button class="btn shop-main-action" data-a="selectmap" data-i="${chosen.id}">Explore this map</button>`):`<button class="btn shop-main-action gold" data-a="buy" data-i="${chosen.id}">🪙 Unlock for ${chosen.p}</button>`):'';
const items=L.map(it=>{const o=owned(tab,it),q=u.eq[tab]===it.id;return `<button class="it shop-item ${it.id===chosen.id?'selected':''} ${q?'on':''}" data-a="preview" data-i="${it.id}" aria-pressed="${it.id===chosen.id}">${tab==='ch'?`<span class="item-icon character-icon ear-${it.ear}" style="--char-color:${hx(it.c)};--char-dark:${hx(it.d)}"><i></i><em></em></span>`:`<span class="item-icon map-item-icon">${it.e}</span>`}<b>${it.n}</b><small>${o?(q?'Equipped ✓':(tab==='map'?'Unlocked':'Owned')):`🪙 ${it.p}`}</small></button>`}).join('');
const o=$('#ov');o.style.display='flex';o.style.alignItems='stretch';o.innerHTML=`<section class="shop-shell">
<header class="shop-top"><div class="shop-brand"><span class="shop-brand-icon">✦</span><div><small>RAINBOW CLASH</small><h1>Wonder Shop</h1></div></div><div class="shop-wallet">🪙 <b>${u.pts}</b><span>coins</span></div><button class="shop-close" data-a="home" aria-label="Close shop">✕</button></header>
<div class="shop-tabs"><button class="shop-tab ${iv?'':'active'}" data-a="shopmode" data-i="0">🛍️ Browse</button><button class="shop-tab ${iv?'active':''}" data-a="shopmode" data-i="1">🎒 My collection</button><span class="shop-tab-spacer"></span><button class="shop-tab ${tab==='ch'?'active':''}" data-a="tab" data-i="ch">👾 Characters</button>${iv?'':`<button class="shop-tab ${tab==='map'?'active':''}" data-a="tab" data-i="map">🗺️ Maps</button>`}</div>
<div class="shop-body"><section class="shop-catalog"><div class="catalog-heading"><div><small>THE TREASURE SHELF</small><h2>${{ch:'Pick your buddy',map:'Choose your world',tr:'Pick a sparkle trail'}[tab]}</h2></div><span class="catalog-count">${L.length} items</span></div><div class="items shop-items">${items||'<p class="shop-empty">Nothing here yet — explore the shop!</p>'}</div><p class="shop-tip">✨ Tap any card to see it up close.</p></section>
<aside class="shop-showcase ${tab==='map'?'map-showcase':''}"><div class="showcase-sparkle sparkle-a">✦</div><div class="showcase-sparkle sparkle-b">✧</div><div class="showcase-kicker">${tab==='ch'?'YOUR NEXT BFF':'YOUR NEXT ADVENTURE'}</div><div class="showcase-orbit"></div><canvas class="showcase-canvas" id="preview3d" aria-label="3D preview"></canvas><div class="showcase-info"><div class="showcase-emoji">${chosen.e}</div><h2>${chosen.n}</h2><p>${tab==='map'?'Preview the scenery before unlocking this world.':'Meet your new little buddy in 3D.'}</p><div class="showcase-price">${isOwned?'✨ '+(isEquipped?'Currently equipped':'In your collection'):'🪙 '+chosen.p+' coins'}</div>${buyOrEquip}</div><div class="showcase-foot">${tab==='ch'?'Rotate-ready 3D character':'3D world diorama'}</div></aside></div>
<footer class="shop-footer"><span>🌈 A little color goes a long way</span><button class="btn shop-back" data-a="home">← Back to home</button></footer><p class="er shop-error">${errm}</p></section>`;
errm='';focus=true;
}
let boardMode='overall'; let previewId='';
function board(){if(ONLINE&&Date.now()-RBt>8000){RBt=Date.now();api('board').then(r=>{if(r.list){RB=r.list;if(($('#ov h1')||{}).textContent?.includes('Leaderboard'))board()}})}const users=(ONLINE&&RB?RB.slice():Object.values(S.users)),L=boardMode==='overall'?users.sort((a,b)=>b.tot-a.tot):users.sort((a,b)=>((b.mapScores||{})[MAPS[mi].id]||0)-((a.mapScores||{})[MAPS[mi].id]||0));const top=L.filter(x=>boardMode==='overall'||(((x.mapScores||{})[MAPS[mi].id]||0)>0)).slice(0,10);panel(`<h1>🏆 Leaderboard</h1><div class="tabs"><button class="btn sm ${boardMode==='overall'?'':'gh'}" data-a="rankall">Overall</button><button class="btn sm ${boardMode==='map'?'':'gh'}" data-a="rankmap">By map</button></div>${boardMode==='map'?`<div class="row"><button class="btn sm gh" data-a="rankprev">◀</button><div class="pill"><span>${MAPS[mi].e}</span><b>${MAPS[mi].n}</b></div><button class="btn sm gh" data-a="ranknext">▶</button></div>`:''}<div class="lb">${top.length?top.map((x,i)=>`<div class="pill ${x===U()||x.d===U().d?'me':''}"><b>${['🥇','🥈','🥉'][i]||i+1}</b><span style="flex:1;text-align:left">${x.d}</span><small>${boardMode==='overall'?'All maps':MAPS[mi].n}</small><b>${boardMode==='overall'?x.tot:((x.mapScores||{})[MAPS[mi].id]||0)}</b></div>`).join(''):'<p>No scores for this map yet. Be the first!</p>'}</div><p style="font-size:13px">Clear levels to climb the ranks! 🌈</p><button class="btn sm" data-a="home">Back</button>`)}
function sett(){const s=S.set,t=(a,v)=>`<button class="btn sm ${v?'':'gh'}" data-a="${a}" style="margin:0">${v?'ON':'OFF'}</button>`;panel(`<h1>Settings</h1><div class="lb"><div class="pill"><span style="flex:1;text-align:left">🎵 Music</span>${t('tm',s.m)}</div><div class="pill"><span>🔉</span><input type="range" min="0" max="1" step=".1" value="${s.mv}" style="padding:0;border:0;margin:0" oninput="S.set.mv=+this.value;sv()"></div><div class="pill"><span style="flex:1;text-align:left">🔔 Sound effects</span>${t('ts',s.s)}</div><div class="pill"><span style="flex:1;text-align:left">${s.dark?'🌙 Dark mode':'☀️ Light mode'}</span>${t('td',s.dark)}</div><button class="btn sm" data-a="how">❓ How to play</button><button class="btn sm rd" data-a="out">Sign out</button></div><button class="btn sm" data-a="home">Back</button>`)}
function how(){panel(`<h1>How to play</h1><p>Collect the fruits &amp; toys in <b>rainbow order</b> (see the top bar). Watch out for the cute aliens — when one spots you it turns red and chases!</p><p>🎮 <b>WASD</b> or arrow keys to move  · floaty movement · drag to look · <b>Q/E</b> turn. <b>Click the little map</b> or press <b>M</b> to zoom it big, and again to shrink it. Use <b>+</b>/<b>−</b> to change the map zoom. The world keeps running while the map is open.</p><p>Collect the rainbow targets in the order shown at the top. Avoid the aliens and moving obstacles!</p><button class="btn sm" data-a="sett">Back</button>`)}
function welcome(){toBG();bare(`${sign()}<div class="card"><div class="tabs"><button class="btn sm ${authTab=='in'?'':'gh'}" data-a="ti">Log in</button><button class="btn sm ${authTab=='up'?'':'gh'}" data-a="tu">Sign up</button></div><input id="un" maxlength="12" placeholder="Username" autocomplete="username"><input id="pw" type="password" placeholder="Password" autocomplete="${authTab=='in'?'current-password':'new-password'}"><p class="er">${errm}</p><button class="btn go" data-a="auth">${authTab=='in'?'Log in':'Create account'}</button></div>`);errm=''}
$('#ov').onkeydown=e=>{if(e.key=='Enter'&&$('#pw'))$('[data-a=auth]').click()};
$('#ov').onclick=async e=>{const el=e.target.closest('[data-a]');if(!el)return;const a=el.dataset.a,i=el.dataset.i;au();if(a!=='auth')tone(620,.075,'sine',.035,1.15);
if(a=='ti'||a=='tu'){authTab=a=='ti'?'in':'up';errm='';welcome()}
if(a=='auth'){const n=$('#un').value.trim(),p=$('#pw').value,k=n.toLowerCase();if(!/^\w{3,12}$/.test(n))errm='Username: 3–12 letters, numbers or _';else if(p.length<4)errm='Password needs 4+ characters';else if(ONLINE){const r=await api('auth',{mode:authTab,u:n,p});if(r.error)errm=r.error;else{S.users[k]=r.profile;S.cur=k;S.tok=r.token;sv();home();return}}else{const h=await hsh(k,p);if(authTab=='up'){if(S.users[k])errm='That username is taken';else{S.users[k]={d:n,h,lvl:1,best:0,pts:0,tot:0,own:[],eq:{ch:'pink'}};S.cur=k;sv();home();return}}else if(!S.users[k]||S.users[k].h!=h)errm='Wrong username or password';else{S.cur=k;sv();home();return}}welcome();$('#un').value=n}
if(a=='out'){S.cur='';S.tok='';sv();authTab='in';welcome()}
if(a=='home')home();if(a=='playp')playP();if(a=='rankall'){boardMode='overall';board()}if(a=='rankmap'){boardMode='map';board()}if(a=='rankprev'){mi=(mi+MAPS.length-1)%MAPS.length;board()}if(a=='ranknext'){mi=(mi+1)%MAPS.length;board()}if(a=='inv')shop(1);if(a=='shop')shop(0);if(a=='board')board();if(a=='sett')sett();if(a=='how')how();
if(a=='tab'){tab=i;previewId='';shop(inv_)}if(a=='preview'){previewId=i;shop(inv_);if(tab==='tr')burst(innerWidth*.7,innerHeight*.4,16,[(ALL.tr.find(x=>x.id==i)||TR[0]).e],220)}if(a=='shopmode'){shop(+i)}
if(a=='pm'){mi=+i;stage();playP()}if(a=='lkd'){tab='map';shop(0)}
if(a=='lm'){sel=Math.max(1,sel-1);playP()}if(a=='lp'){sel=Math.min(U().lvl,sel+1);playP()}
if(a=='eq'){U().eq[tab]=i;sv();dress();shop(inv_)}if(a=='selectmap'){mi=MAPS.findIndex(m=>m.id===i);stage();playP()}
if(a=='buy'){const it=ALL[tab].find(x=>x.id==i),u=U();if(u.pts>=it.p){u.pts-=it.p;u.own.push(tab+'_'+i);if(tab!='map'){u.eq[tab]=i;dress()}sv();sfx.pick()}else{errm='Not enough points yet — keep playing!';sfx.nope()}shop(inv_)}
if(a=='tm'){S.set.m=+!S.set.m;sv();sett()}if(a=='ts'){S.set.s=+!S.set.s;sv();sett()}if(a=='td'){S.set.dark=+!S.set.dark;document.body.classList.toggle('dk');sv();sett()}
if(a=='play'||a=='retry')start();if(a=='next'){sel=lv+1;start()}if(a=='res'){st='play';$('#ov').style.display='none'}if(a=='mute'){mute=!mute;el.textContent=mute?'🔇 Music off':'🎵 Music on'}};
function pause(){if(st=='play'){st='pause';panel(`<div class="mas">⏸️</div><h1>Paused</h1><button class="btn go" data-a="res">Resume</button><br><button class="btn sm" data-a="retry">Restart</button><button class="btn sm gh" data-a="mute">${mute?'🔇 Music off':'🎵 Music on'}</button><button class="btn sm rd" data-a="home">Quit</button>`)}else if(st=='pause'){st='play';$('#ov').style.display='none'}}
$('#ps').onclick=pause;$('#qx').onclick=()=>{if(st=='play'||st=='pause')home()};
const zz=d=>zm=cl(zm+d,.6,7);$('#zi').onclick=()=>zz(.8);$('#zo').onclick=()=>zz(-.8);mmc.onwheel=e=>{e.preventDefault();zz(e.deltaY<0?.5:-.5)};
addEventListener('keydown',e=>{K[e.code]=1;if(e.code=='Escape')pause();if(e.code=='KeyM'&&st=='play')mmTog();if(e.code=='Equal'||e.code=='NumpadAdd')zz(.6);if(e.code=='Minus'||e.code=='NumpadSubtract')zz(-.6)});addEventListener('keyup',e=>K[e.code]=0);
let jid=null,js,rid=null,rl;cv.onpointerdown=e=>{cv.setPointerCapture(e.pointerId);if(e.pointerType=='touch'&&e.clientX<innerWidth/2){jid=e.pointerId;js=[e.clientX,e.clientY]}else{rid=e.pointerId;rl=[e.clientX,e.clientY]}};
cv.onpointermove=e=>{if(e.pointerId==jid){jx=cl((e.clientX-js[0])/45,-1,1);jy=cl((js[1]-e.clientY)/45,-1,1)}else if(e.pointerId==rid){yaw-=(e.clientX-rl[0])*.006;pitch=cl(pitch+(e.clientY-rl[1])*.004,.2,1.1);rl=[e.clientX,e.clientY]}};
cv.onpointerup=cv.onpointercancel=e=>{if(e.pointerId==jid){jid=null;jx=jy=0}if(e.pointerId==rid)rid=null};
function rs(){rn.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}addEventListener('resize',rs);rs();
// Dedicated, unobstructed 3D showroom renderer. It is independent from the gameplay camera.
let showroomRenderer=null,showroomCanvas=null,showroomScene=null,showroomCamera=null,showroomObject=null,showroomKind='',showroomId='',showroomBaseY=0;
function pvMesh(geo,color,parent,pos=[0,0,0],scale=[1,1,1],rot=[0,0,0]){const m=new THREE.Mesh(geo,new THREE.MeshLambertMaterial({color}));m.position.set(...pos);m.scale.set(...scale);m.rotation.set(...rot);parent.add(m);return m}
function pvSphere(r,c,p,pos,scale=[1,1,1]){return pvMesh(new THREE.SphereGeometry(r,18,12),c,p,pos,scale)}
function pvGroup(){const g=new THREE.Group();showroomScene.add(g);return g}
function makeMapDiorama(m){
 showroomScene=new THREE.Scene();showroomScene.background=null;showroomScene.add(new THREE.HemisphereLight(0xffffff,0xc6b8df,1.55));const sun=new THREE.DirectionalLight(0xffffff,1.15);sun.position.set(4,8,5);showroomScene.add(sun);
 pvMesh(new THREE.CylinderGeometry(3.35,3.5,.48,48),0x8d72c9,showroomScene,[0,-.3,0]);pvMesh(new THREE.CylinderGeometry(3.2,3.2,.12,48),m.gnd,showroomScene,[0,-.02,0]);pvMesh(new THREE.TorusGeometry(3.25,.07,8,48),0xffd86b,showroomScene,[0,.05,0],[1,1,1],[Math.PI/2,0,0]);
 const g=new THREE.Group();showroomScene.add(g);showroomObject=g;const id=m.id;
 const tree=(x,z,c=0x3fa84a)=>{pvMesh(new THREE.CylinderGeometry(.12,.18,.8,8),0x8a5a33,g,[x,.45,z]);pvSphere(.62,c,g,[x,1.15,z],[1,1.15,1])};
 const lolli=(x,z,c=0xff6fae)=>{pvMesh(new THREE.CylinderGeometry(.045,.045,1.1,8),0xffffff,g,[x,.62,z]);pvSphere(.43,c,g,[x,1.35,z],[1,1,.55]);pvMesh(new THREE.TorusGeometry(.26,.055,7,16),0xffffff,g,[x,1.35,z+.04])};
 const cloud=(x,y,z,s=1)=>{[[0,0,0],[.42,.08,0],[-.42,.03,0],[.12,.25,.03]].forEach(([a,b,c])=>pvSphere(.42*s,0xffffff,g,[x+a*s,y+b*s,z+c*s]))};
 if(id==='forest'||id==='park'){tree(-1.6,-.7,0x43ad5b);tree(1.65,-.55,0x67c65a);tree(-.2,1.2,0x2e9655);pvMesh(new THREE.CylinderGeometry(.7,.75,.12,24),0x6fd5ff,g,[0,.13,-1.55]);if(id==='park'){pvMesh(new THREE.CylinderGeometry(.2,.25,.8,12),0xe8d8b8,g,[0,.48,-1.55]);pvMesh(new THREE.TorusGeometry(.7,.08,8,24),0xffd86b,g,[0,.55,-1.55],[1,1,1],[Math.PI/2,0,0])}}
 else if(id==='fair'){pvMesh(new THREE.CylinderGeometry(1.05,1.05,.15,24),0xff8fc0,g,[-.9,.13,0]);pvMesh(new THREE.CylinderGeometry(.08,.1,1.6,10),0xffd84a,g,[-.9,.95,0]);for(let i=0;i<5;i++){const a=i*TAU/5;pvSphere(.2,[0xffffff,0x6fc9ff,0xffb347][i%3],g,[-.9+Math.cos(a)*.78,1.05,Math.sin(a)*.78])}lolli(1.4,-.6,0x9a6bf0);tree(1.6,1,0xff9fc7)}
 else if(id==='beach'){pvMesh(new THREE.CylinderGeometry(.12,.18,1.9,8),0xb88a52,g,[-1,.95,0],[1,1,1],[0,0,-.12]);for(let i=0;i<6;i++){const a=i*TAU/6;pvMesh(new THREE.SphereGeometry(.75,10,8),0x2fb04a,g,[-1+Math.cos(a)*.48,1.9,Math.sin(a)*.48],[1,.12,.5],[0,a,0])}pvMesh(new THREE.ConeGeometry(.6,1,12),0xff7aa8,g,[1.1,.55,-.5]);pvMesh(new THREE.ConeGeometry(.6,1,12),0x6fc9ff,g,[1.8,.55,.4]);pvSphere(.7,0x4fc8ff,g,[0,.22,1.25],[1,.12,.7])}
 else if(id==='farm'){pvMesh(new THREE.BoxGeometry(1.7,1.25,1.35),0xffd39b,g,[0,.7,-.5]);pvMesh(new THREE.ConeGeometry(1.25,.8,4),0xd84b4b,g,[0,1.65,-.5],[1,1,1],[0,Math.PI/4,0]);pvMesh(new THREE.BoxGeometry(.4,.72,.08),0x7a4a2a,g,[0,.4,.2]);tree(-1.7,-.4,0x6bc45a);pvSphere(.48,0xffffff,g,[1.45,.6,.25],[1.3,.8,.8]);pvSphere(.26,0xffffff,g,[1.72,.8,.6]);pvSphere(.1,0x29233d,g,[1.75,.82,.83])}
 else if(id==='snow'){tree(-1.6,-.5,0x2f8f4a);pvMesh(new THREE.ConeGeometry(.65,1.5,10),0xffffff,g,[-1.6,1.6,-.5]);pvSphere(.48,0xffffff,g,[.4,.5,0]);pvSphere(.34,0xffffff,g,[.4,1.15,0]);pvSphere(.24,0xffffff,g,[.4,1.63,0]);pvMesh(new THREE.ConeGeometry(.1,.4,8),0xff8a1f,g,[.4,1.62,.24],[1,1,1],[Math.PI/2,0,0]);pvMesh(new THREE.BoxGeometry(1.1,.8,1),0xa8d8ff,g,[1.5,.45,-.6]);pvMesh(new THREE.ConeGeometry(.85,.65,4),0xffb8a0,g,[1.5,1.17,-.6],[1,1,1],[0,Math.PI/4,0])}
 else if(id==='candy'){lolli(-1.35,-.4,0xff5d8f);lolli(0,-.65,0x4aa8ff);lolli(1.35,-.35,0xffd91f);pvMesh(new THREE.CylinderGeometry(.65,.5,.7,12),0xffb347,g,[.25,.4,.8]);pvSphere(.65,0xffd0e8,g,[.25,.95,.8],[1,1,.9]);pvSphere(.16,0xff3b5c,g,[.25,1.58,.8])}
 else if(id==='space'){pvSphere(1,0x9b8cff,g,[-.9,.8,-.2],[1,1,1]);pvMesh(new THREE.TorusGeometry(1.35,.09,8,32),0xffd86b,g,[-.9,.8,-.2],[1,1,.5],[.5,0,.2]);[-1.5,.7,1.5].forEach((x,i)=>pvSphere(.13,[0xffb7e3,0x6fc9ff,0x8be37f][i],g,[x,.25,.9]))}
 else if(id==='undersea'){[[-1.5,.8,-.3],[1.4,.7,.1],[0,1.2,-.9]].forEach(([x,y,z],i)=>{pvMesh(new THREE.CylinderGeometry(.12,.2,1.2,7),[0xff8c9e,0x8c7aff,0x35cfa8][i],g,[x,y,z]);for(let j=0;j<3;j++)pvSphere(.2,[0xff8c9e,0x8c7aff,0x35cfa8][i],g,[x+(j-1)*.22,y+.65,z])});pvSphere(.55,0x7de4ee,g,[0,.65,.7],[1,1.15,1]);pvSphere(.13,0xffffff,g,[-.18,.8,1.17]);pvSphere(.13,0xffffff,g,[.18,.8,1.17])}
 else if(id==='volcano'){pvMesh(new THREE.ConeGeometry(1.5,2.2,7),0x55425c,g,[0,1,-.3]);pvMesh(new THREE.CylinderGeometry(.42,.52,.12,12),0xff754f,g,[0,1.92,-.3]);pvSphere(.22,0xffc45e,g,[-.5,1.2,.65]);pvSphere(.17,0xffe8a0,g,[.8,.75,.2]);tree(-1.7,.7,0x6f9b65)}
 else {cloud(-1.1,1.2,-.4,1);cloud(1.2,1.1,.2,.9);pvMesh(new THREE.BoxGeometry(1.15,.9,1),0xf2d7ff,g,[0,.45,-.8]);pvMesh(new THREE.ConeGeometry(.9,.75,4),0xffd86b,g,[0,1.2,-.8],[1,1,1],[0,Math.PI/4,0]);pvSphere(.28,0xff8ab5,g,[0,1.72,-.8])}
 return g;
}
function ensureShowroom(){const canvas=$('#preview3d');if(!canvas)return;if(showroomCanvas!==canvas){if(showroomRenderer){try{showroomRenderer.dispose();showroomRenderer.forceContextLoss()}catch(e){}}try{showroomRenderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});showroomCanvas=canvas;showroomKind='';showroomId='';showroomRenderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));showroomRenderer.setClearColor(0x000000,0);showroomScene=new THREE.Scene();showroomCamera=new THREE.PerspectiveCamera(35,1,.1,100);showroomCamera.position.set(0,2.25,6.8);showroomCamera.lookAt(0,1.05,0)}catch(e){canvas.style.display='none';return}}
 const chosen=(ALL[tab]||CH)[0];let model=(ALL[tab]||CH).find(x=>x.id===previewId)||chosen;if(tab==='tr')model=CH.find(x=>x.id==eqp().ch)||CH[0];if(!model)return;
 const kind=tab==='map'?'map':'ch';if(showroomKind!==kind||showroomId!==model.id){showroomKind=kind;showroomId=model.id;showroomScene=new THREE.Scene();showroomScene.background=null;showroomScene.add(new THREE.HemisphereLight(0xffffff,0xb6a2d4,1.4));const key=new THREE.DirectionalLight(0xffffff,1.1);key.position.set(4,7,5);showroomScene.add(key);showroomObject=null;
 if(kind==='ch'){const floor=pvMesh(new THREE.CylinderGeometry(1.55,1.7,.2,40),0xffd3eb,showroomScene,[0,-.1,0]);pvMesh(new THREE.TorusGeometry(1.45,.055,8,40),0xffd86b,showroomScene,[0,.02,0],[1,1,1],[Math.PI/2,0,0]);showroomObject=cute(model);showroomObject.scale.setScalar(1.25);showroomObject.position.y=.02;showroomScene.add(showroomObject);showroomBaseY=.02;showroomCamera.position.set(0,2.0,5.8);showroomCamera.lookAt(0,1.05,0)}else{makeMapDiorama(model);showroomCamera.position.set(6,5.1,7.2);showroomCamera.lookAt(0,.8,0)}
 }
 const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight);if(canvas.width!==Math.round(w*(showroomRenderer.getPixelRatio()))||canvas.height!==Math.round(h*(showroomRenderer.getPixelRatio())))showroomRenderer.setSize(w,h,false);showroomCamera.aspect=w/h;showroomCamera.updateProjectionMatrix();if(showroomObject&&kind==='ch'){showroomObject.rotation.y=Math.sin(ct*.45)*.24;showroomObject.position.y=showroomBaseY+Math.sin(ct*1.8)*.07}else if(showroomObject&&kind==='map'){showroomObject.rotation.y=ct*.12}showroomRenderer.render(showroomScene,showroomCamera)
}
let lt0=performance.now();(function loop(n){requestAnimationFrame(loop);const dt=Math.min(.05,(n-lt0)/1000);lt0=n;if(bgOn||!sc)return;if(st!='pause'){update(dt);if(st=='play'){$('#fill').style.width=(tl/total*100)+'%'}}rn.render(sc,cam);pfl(dt);if($('#ov').querySelector('.shop-shell'))ensureShowroom();if((st=='play'||st=='pause')&&(++mmN%3==0||mmBig))drawMM()})(lt0);
Object.values(S.users).forEach(u=>{u.mapScores=u.mapScores||{};u.eq=u.eq||{ch:'pink'};u.own=u.own||[];if(!CH.some(c=>c.id==u.eq.ch))u.eq.ch='pink';u.eq.tr=u.eq.tr||'spark'});sv();
buildBG();
const LM=['Waking up the aliens…','Painting the rainbow…','Fluffing the clouds…','Sprinkling sparkles…','Almost ready!'];let li=0;const lmi=setInterval(()=>{li=Math.min(li+1,LM.length-1);$('#ldm').textContent=LM[li]},520);
$('#loading').style.opacity='1';setTimeout(()=>{clearInterval(lmi);$('#loading').style.opacity='0';setTimeout(()=>{$('#loading').style.display='none';autoLogin()},450)},2800);
// ===== v2: particles, challenges, online =====
let shk=0,won=0,ice=[],RB=null,RBt=0,wt=5,wa=0,wl=0,PA=[];
const pf=$('#pfx'),px=pf.getContext('2d');
function pfr(){pf.width=innerWidth;pf.height=innerHeight}addEventListener('resize',pfr);pfr();
function burst(x,y,n,E,sp=240,g=420,L=1){for(let i=0;i<n&&PA.length<150;i++){const a=R()*TAU,v=sp*(.3+R()*.7);PA.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-sp*.4,g,l:L*(.6+R()*.6),t:0,e:rc(E),s:16+R()*18,r:R()*TAU,vr:(R()-.5)*8})}}
function fxw(x,y,z,n,E,sp,g){const v=new THREE.Vector3(x,y,z).project(cam);if(v.z>1)return;burst((v.x+1)/2*innerWidth,(1-v.y)/2*innerHeight,n,E,sp,g)}
function pfl(dt){px.clearRect(0,0,pf.width,pf.height);PA=PA.filter(p=>(p.t+=dt)<p.l);PA.forEach(p=>{p.vy+=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=p.vr*dt;px.globalAlpha=Math.min(1,(1-p.t/p.l)*2);px.save();px.translate(p.x,p.y);px.rotate(p.r);px.font=p.s+'px serif';px.textAlign='center';px.textBaseline='middle';px.fillText(p.e,0,0);px.restore()});px.globalAlpha=1}
const trE=()=>(TR.find(x=>x.id==((me()||{}).eq||{}).tr)||TR[0]).e;
function twin(e){if(en.length>=22)return;mkEn(lv);const n=en[en.length-1];n.x=e.x+Math.sin(e.h+1.6)*3;n.z=e.z+Math.cos(e.h+1.6)*3;n.life=14;n.s='chase';n.g.scale.setScalar(.85);fxw(n.x,1.5,n.z,5,['💫'],140)}
function celebrate(){let n=0;const iv=setInterval(()=>{burst(R()<.5?innerWidth*.06:innerWidth*.94,innerHeight*.65,9,['🎉','🎊','⭐','💖'],420,600,1.5);if(++n>5)clearInterval(iv)},280)}
function sad(){document.body.classList.add('sad');let n=0;const iv=setInterval(()=>{for(let i=0;i<3;i++)burst(R()*innerWidth,-20,1,['💧'],10,700,1.6);if(++n>16)clearInterval(iv)},90)}
function extras(l){ice=[];wt=5;wl=0;if(l>=6)for(let i=0;i<cl(l-4,1,5);i++){const[x,z]=rp(12);mk(G.cy(4,4,.06,24),0xbfeaff,x,.08,z);ice.push({x,z,r:4})}}
async function autoLogin(){if(ONLINE&&S.tok&&S.cur){const r=await api('me');if(r.profile){S.users[S.cur]=r.profile;sv();home();return}S.tok=''}if(!ONLINE&&S.cur&&S.users[S.cur]){home();return}S.cur='';welcome()}
api('ping').then(r=>{ONLINE=!!r.ok});

let mmN=0;
