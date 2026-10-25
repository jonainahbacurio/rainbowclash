import {getStore} from '@netlify/blobs';
import {scryptSync,randomBytes,timingSafeEqual,createHmac} from 'node:crypto';
const J=(o,s=200)=>new Response(JSON.stringify(o),{status:s,headers:{'content-type':'application/json','cache-control':'no-store'}});
const store=n=>getStore({name:n,consistency:'strong'});
let secret,cache;
async function key(){if(process.env.AUTH_SECRET)return process.env.AUTH_SECRET;if(secret)return secret;const m=store('rc-meta');let s=await m.get('secret');if(!s){s=randomBytes(32).toString('hex');await m.set('secret',s)}return secret=s}
const sign=async o=>{const b=Buffer.from(JSON.stringify(o)).toString('base64url');return b+'.'+createHmac('sha256',await key()).update(b).digest('base64url')};
async function verify(t){try{const[b,s]=String(t).split('.'),e=createHmac('sha256',await key()).update(b).digest('base64url');if(s.length!==e.length||!timingSafeEqual(Buffer.from(s),Buffer.from(e)))return null;const o=JSON.parse(Buffer.from(b,'base64url'));return o.exp>Date.now()?o.u:null}catch{return null}}
const num=(v,m=1e9)=>Math.max(0,Math.min(m,Math.floor(+v||0)));
const clean=(p,d)=>({d,lvl:num(p.lvl,999)||1,best:num(p.best),pts:num(p.pts),tot:num(p.tot),own:(Array.isArray(p.own)?p.own:[]).filter(x=>typeof x=='string'&&x.length<30).slice(0,200),eq:{ch:String(p.eq?.ch||'pink').slice(0,20),tr:String(p.eq?.tr||'spark').slice(0,20)},mapScores:Object.fromEntries(Object.entries(p.mapScores||{}).slice(0,30).map(([k,v])=>[k.slice(0,20),num(v)]))});
const pub=p=>({d:p.d,tot:p.tot,best:p.best,lvl:p.lvl,mapScores:p.mapScores});
export default async req=>{
 const path=new URL(req.url).pathname.replace(/^\/api\//,'').replace(/\/$/,'');
 try{
  if(path==='ping')return J({ok:1});
  if(path==='board'){if(cache&&Date.now()-cache.t<8000)return J({list:cache.l});const bs=store('rc-board'),{blobs}=await bs.list();const l=(await Promise.all(blobs.slice(0,500).map(b=>bs.get(b.key,{type:'json'}).catch(()=>null)))).filter(Boolean).sort((a,b)=>b.tot-a.tot).slice(0,200);cache={t:Date.now(),l};return J({list:l})}
  const body=req.method==='POST'?await req.json().catch(()=>({})):{};
  if(path==='auth'){
   const n=String(body.u||'').trim(),p=String(body.p||''),k=n.toLowerCase();
   if(!/^\w{3,12}$/.test(n))return J({error:'Username: 3–12 letters, numbers or _'});
   if(p.length<4||p.length>100)return J({error:'Password needs 4+ characters'});
   const us=store('rc-users'),rec=await us.get(k,{type:'json'}),tok=()=>sign({u:k,exp:Date.now()+30*864e5});
   if(body.mode==='up'){if(rec)return J({error:'That username is taken'});const salt=randomBytes(16).toString('hex'),r={d:n,salt,hash:scryptSync(p,salt,64).toString('hex'),profile:clean({},n)};await us.setJSON(k,r);await store('rc-board').setJSON(k,pub(r.profile));cache=null;return J({token:await tok(),profile:r.profile})}
   if(!rec||!timingSafeEqual(scryptSync(p,rec.salt,64),Buffer.from(rec.hash,'hex')))return J({error:'Wrong username or password'});
   return J({token:await tok(),profile:rec.profile})}
  const u=await verify((req.headers.get('authorization')||'').slice(7));
  if(!u)return J({error:'Please log in again'},401);
  const us=store('rc-users'),r=await us.get(u,{type:'json'});
  if(!r)return J({error:'No account'},404);
  if(path==='me')return J({profile:r.profile});
  if(path==='save'){const o=r.profile,p=clean(body.profile||{},r.d);p.tot=Math.max(o.tot,p.tot);p.best=Math.max(o.best,p.best);p.lvl=Math.max(o.lvl,p.lvl);const m={...o.mapScores};for(const[k,v]of Object.entries(p.mapScores))m[k]=Math.max(m[k]||0,v);p.mapScores=m;r.profile=p;await us.setJSON(u,r);await store('rc-board').setJSON(u,pub(p));return J({ok:1})}
  return J({error:'Not found'},404)
 }catch(e){return J({error:'Server error'},500)}
};
export const config={path:'/api/*'};
