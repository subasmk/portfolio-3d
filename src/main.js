import * as THREE from 'three';
const mobile=innerWidth<700;
const canvas=document.getElementById('bg');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1.5:2));
const scene=new THREE.Scene();scene.background=new THREE.Color(0x07070d);scene.fog=new THREE.FogExp2(0x0a0812,0.018);
const cam=new THREE.PerspectiveCamera(55,1,0.1,400);
scene.add(new THREE.AmbientLight(0xffffff,.55));
const sun=new THREE.DirectionalLight(0xffe2c0,1.1);sun.position.set(6,14,8);scene.add(sun);
function mat(c,o={}){return new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:.5,roughness:.4,metalness:.3,...o})}
// island
const island=new THREE.Group();scene.add(island);
const top=new THREE.Mesh(new THREE.CylinderGeometry(11,10,1,64),new THREE.MeshStandardMaterial({color:0x14121f,roughness:.9}));top.position.y=-.5;island.add(top);
const under=new THREE.Mesh(new THREE.ConeGeometry(10,9,40),new THREE.MeshStandardMaterial({color:0x0d0b16,roughness:1}));under.position.y=-5.5;under.rotation.x=Math.PI;island.add(under);
const rim=new THREE.Mesh(new THREE.TorusGeometry(10.6,.09,8,100),mat(0xff7a1a,{emissiveIntensity:1}));rim.rotation.x=Math.PI/2;island.add(rim);
const floorRings=[3,5.5,8].map((r,i)=>{const m=new THREE.Mesh(new THREE.RingGeometry(r,r+.06,80),new THREE.MeshBasicMaterial({color:0xff7a1a,transparent:true,opacity:.35-i*.07,side:THREE.DoubleSide}));m.rotation.x=-Math.PI/2;m.position.y=.02;island.add(m);return m});
// stars
{const n=mobile?600:1600,g=new THREE.BufferGeometry(),a=new Float32Array(n*3);for(let k=0;k<n;k++){const r=40+Math.random()*80,t=Math.random()*6.28,u=Math.random()*3.14;a[k*3]=r*Math.sin(u)*Math.cos(t);a[k*3+1]=(r*Math.cos(u))*.7;a[k*3+2]=r*Math.sin(u)*Math.sin(t)}g.setAttribute('position',new THREE.BufferAttribute(a,3));scene.add(new THREE.Points(g,new THREE.PointsMaterial({color:0xffd7b0,size:.35,transparent:true,opacity:.8})))}
// stations
const ST=[
 {id:'about',label:'About me',col:0x2fd3c4,geo:()=>new THREE.IcosahedronGeometry(1.1,0),line:"I study AI and Data Science in Coimbatore. I'm learning cybersecurity, generative AI, full stack and app development, and I learn by building in public."},
 {id:'projects',label:'Projects',col:0xff4f6d,geo:()=>new THREE.BoxGeometry(1.6,1.6,1.6),line:"These are the things I built. TrackMe, a quest and streak app. MockMentor, an AI interview trainer from the IBM Bob hackathon. Brainvault, an offline exam-prep app. And my Smart India Hackathon entry."},
 {id:'proof',label:'Certificates',col:0xf2c14e,geo:()=>new THREE.OctahedronGeometry(1.3,0),line:"Certificates in AWS, cybersecurity, machine learning, full stack and data analytics. I keep learning, and I keep the proof."},
 {id:'code',label:'LeetCode',col:0x4ade80,geo:()=>new THREE.TorusKnotGeometry(.8,.28,100,12),line:"I practice problems on LeetCode as subas_mk. Small steps every day."},
 {id:'contact',label:'Contact',col:0x9b7bff,geo:()=>new THREE.TorusGeometry(1.1,.22,14,50),line:"Want to build something together? Find me on GitHub or LinkedIn."}];
const stGroup=new THREE.Group();scene.add(stGroup);const labels=document.getElementById('labels');
const R=7.2;
ST.forEach((s,i)=>{const ang=Math.PI*.5+ (i-2)*(Math.PI*2/5)*0.95 + Math.PI; s.pos=new THREE.Vector3(Math.cos(ang)*R,0,Math.sin(ang)*R);
 const g=new THREE.Group();g.position.copy(s.pos);const base=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.4,.35,24),new THREE.MeshStandardMaterial({color:0x1b1830,roughness:.6}));base.position.y=.18;g.add(base);
 const m=new THREE.Mesh(s.geo(),mat(s.col,{emissiveIntensity:.6}));m.position.y=2.2;m.userData.st=s;g.add(m);s.mesh=m;
 const beam=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,6,6),new THREE.MeshBasicMaterial({color:s.col,transparent:true,opacity:.35}));beam.position.y=3;g.add(beam);
 const pl=new THREE.PointLight(s.col,12,12);pl.position.y=2.6;g.add(pl);s.light=pl;stGroup.add(g);
 s.stand=s.pos.clone().multiplyScalar(1-2.2/R);
 const d=document.createElement('button');d.className='lab';d.textContent=s.label;d.onclick=()=>visit(s);labels.appendChild(d);s.el=d;
 const c=document.createElement('button');c.className='chip';c.textContent=s.label;c.onclick=()=>visit(s);document.getElementById('chips').appendChild(c);s.chip=c});
// floating bits
const bits=[];for(let k=0;k<30;k++){const m=new THREE.Mesh(new THREE.OctahedronGeometry(.18+Math.random()*.25,0),mat(k%2?0xff7a1a:0xffffff,{emissiveIntensity:.4}));m.position.set((Math.random()-.5)*50,2+Math.random()*14,(Math.random()-.5)*50);if(Math.hypot(m.position.x,m.position.z)<13)m.position.x+=18;m.userData.p=Math.random()*6;scene.add(m);bits.push(m)}
// trail
const TR=60,trail=new THREE.Points(new THREE.BufferGeometry(),new THREE.PointsMaterial({color:0xff9a40,size:.22,transparent:true,opacity:.7,depthWrite:false}));const tp=new Float32Array(TR*3).fill(-999);trail.geometry.setAttribute('position',new THREE.BufferAttribute(tp,3));trail.frustumCulled=false;scene.add(trail);let tI=0;
// Guide: original swirl-mask masked figure (fan-inspired, not official art)
function maskTex(){const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');
 const g=x.createRadialGradient(330,210,10,330,210,330);g.addColorStop(0,'#ff8a2a');g.addColorStop(1,'#c9500f');x.fillStyle=g;x.fillRect(0,0,512,512);
 x.strokeStyle='#1a0a04';x.lineWidth=9;x.lineCap='round';x.beginPath();const cx=330,cy=210;for(let a=0;a<17;a+=.05){const r=3+a*9.5;const px=cx+r*Math.cos(a),py=cy+r*Math.sin(a);a?x.lineTo(px,py):x.moveTo(px,py)}x.stroke();
 x.fillStyle='#000';x.beginPath();x.arc(cx,cy,12,0,7);x.fill();return new THREE.CanvasTexture(c)}
const guide=new THREE.Group(),rig=new THREE.Group();guide.add(rig);
const black=new THREE.MeshStandardMaterial({color:0x0b0b12,roughness:.7,metalness:.1}),trim=new THREE.MeshStandardMaterial({color:0xff7a1a,emissive:0xff7a1a,emissiveIntensity:.9});
const cloak=new THREE.Mesh(new THREE.CylinderGeometry(.5,.95,1.8,28,1,true),new THREE.MeshStandardMaterial({color:0x0b0b12,roughness:.8,side:THREE.DoubleSide}));cloak.position.y=.1;rig.add(cloak);
const sh=new THREE.Mesh(new THREE.SphereGeometry(.62,24,16),black);sh.scale.set(1,.45,.7);sh.position.y=.95;rig.add(sh);
const hem=new THREE.Mesh(new THREE.TorusGeometry(.95,.03,8,48),trim);hem.rotation.x=Math.PI/2;hem.position.y=-.8;rig.add(hem);
const collar=new THREE.Mesh(new THREE.TorusGeometry(.42,.05,8,32),trim);collar.rotation.x=Math.PI/2;collar.position.y=1.05;rig.add(collar);
const sigil=new THREE.Mesh(new THREE.RingGeometry(.12,.17,5),new THREE.MeshBasicMaterial({color:0xff7a1a,side:THREE.DoubleSide}));sigil.position.set(0,.35,.5);sigil.rotation.x=-.2;rig.add(sigil);
function arm(side){const p=new THREE.Group();p.position.set(side*.62,.98,0);const m=new THREE.Mesh(new THREE.CapsuleGeometry(.12,.7,6,12),black);m.position.y=-.4;p.add(m);const h=new THREE.Mesh(new THREE.SphereGeometry(.13,12,10),new THREE.MeshStandardMaterial({color:0xd9b99b}));h.position.y=-.85;p.add(h);rig.add(p);return p}
const armL=arm(-1),armR=arm(1);
function leg(side){const p=new THREE.Group();p.position.set(side*.25,-.75,0);const m=new THREE.Mesh(new THREE.CapsuleGeometry(.13,.5,6,10),black);m.position.y=-.35;p.add(m);const f=new THREE.Mesh(new THREE.BoxGeometry(.24,.12,.4),trim);f.position.set(0,-.72,.08);p.add(f);rig.add(p);return p}
const legL=leg(-1),legR=leg(1);
const head=new THREE.Group();head.position.y=1.6;rig.add(head);
const mask=new THREE.Mesh(new THREE.SphereGeometry(.5,40,28),new THREE.MeshStandardMaterial({map:maskTex(),roughness:.35,emissive:0xff6a10,emissiveIntensity:.45}));mask.rotation.y=3.8;head.add(mask);
for(let k=0;k<11;k++){const sp=new THREE.Mesh(new THREE.ConeGeometry(.09,.55+Math.random()*.25,6),black);const a=(k/11)*Math.PI*1.4-Math.PI*.2;sp.position.set(Math.cos(a)*.34*-1,.38+Math.sin(a)*.12,-.28);sp.rotation.set(-.7,0,(a-Math.PI*.5)*.9);head.add(sp)}
const aura=new THREE.PointLight(0xff7a1a,8,10);aura.position.set(0,1,2);rig.add(aura);
const orb=new THREE.Mesh(new THREE.IcosahedronGeometry(.18,1),new THREE.MeshBasicMaterial({color:0xffd9a0,wireframe:true}));rig.add(orb);
guide.scale.setScalar(1.35);scene.add(guide);

guide.position.set(0,0,1);
const mouse={x:0,y:0},ray=new THREE.Raycaster(),bubble=document.getElementById('bubble');
let waveT=-1,hopT=-1,bubbleUntil=0,qi=0;const quips=["Hey! Click a glowing object and I'll walk you there.","Careful, that tickles.","Drag the background to spin the island.","Walking in a cloak is hard.","Tap the floor and I'll walk there."];
function say(t,ms=3200){bubble.textContent=t;bubble.classList.remove('hidden');bubbleUntil=performance.now()+ms}
function wave(){waveT=0}
// narration + panels
let sound=false,playing=true;const cap=document.getElementById('caption');
function speakText(t){cap.textContent=t;cap.classList.remove('hidden');if(!('speechSynthesis' in window))return;speechSynthesis.cancel();if(!sound)return;const u=new SpeechSynthesisUtterance(t);u.rate=.96;u.pitch=.8;speechSynthesis.speak(u)}
const panels=document.querySelectorAll('.panel');let cur=null;
function showPanel(id){panels.forEach(p=>p.classList.toggle('open',p.dataset.id===id));ST.forEach(s=>s.chip.classList.toggle('on',s.id===id))}
document.getElementById('close').onclick=()=>{showPanel(null);cur=null};
let goal=null,goalSt=null;
function visit(s){goal=s.stand.clone();goalSt=s;showPanel(null);say('Follow me!',1500)}
function walkTo(v){goal=v.clone();goalSt=null}
document.getElementById('snd').onclick=e=>{sound=!sound;e.currentTarget.textContent=sound?'🔊':'🔇';if(!sound&&'speechSynthesis' in window)speechSynthesis.cancel();else if(cur)speakText(cur.line)};
document.getElementById('replay').onclick=()=>speakText(cur?cur.line:"I'm Subash. Click any glowing object and I'll show you around.");
function enter(withSound){document.getElementById('intro').classList.add('gone');['hud','chips','caption','labels','joy','keyhint'].forEach(id=>document.getElementById(id).classList.remove('hidden'));sound=withSound;document.getElementById('snd').textContent=sound?'🔊':'🔇';wave();setTimeout(()=>say('Move me with the joystick or WASD!',3500),500);speakText("Hi, I'm Subash's guide. Use the joystick, or W A S D, to walk me up to any glowing object. I'll show you what's there. Drag to turn the camera.")}
document.getElementById('enterSound').onclick=()=>enter(true);document.getElementById('enterQuiet').onclick=()=>enter(false);
// camera orbit + input
let theta=Math.PI/2,thetaT=theta,phi=.78,phiT=phi,dist=mobile?40:25,down=null,moved=0,gx=0,gy=0;
canvas.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};moved=0;canvas.setPointerCapture(e.pointerId)});
addEventListener('pointermove',e=>{mouse.x=e.clientX/innerWidth*2-1;mouse.y=-(e.clientY/innerHeight*2-1);if(down){const dx=e.clientX-down.x,dy=e.clientY-down.y;moved+=Math.abs(dx)+Math.abs(dy);thetaT-=dx*.006;phiT=Math.min(1.25,Math.max(.35,phiT+dy*.004));down={x:e.clientX,y:e.clientY}}});
function pick(e){ray.setFromCamera(new THREE.Vector2(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight*2-1)),cam);
 const hs=ray.intersectObjects(ST.map(s=>s.mesh));if(hs.length){visit(hs[0].object.userData.st);return}
 if(ray.intersectObject(guide,true).length||Math.hypot(e.clientX-gx,e.clientY-gy)<90){hopT=0;wave();say(quips[qi++%quips.length]);return}
 const pt=new THREE.Vector3();if(ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),0),pt)&&pt.length()<9.5){walkTo(pt)}}
canvas.addEventListener('pointerup',e=>{if(down&&moved<8)pick(e);down=null});
canvas.addEventListener('wheel',e=>{dist=Math.min(34,Math.max(11,dist+e.deltaY*.01))},{passive:true});

// input: keyboard, gamepad, on-screen joystick
const keys={};addEventListener('keydown',e=>{keys[e.code]=true;if(e.code==='KeyQ')thetaT+=.15;if(e.code==='KeyE')thetaT-=.15});addEventListener('keyup',e=>{keys[e.code]=false});
const joy={x:0,y:0};const joyEl=document.getElementById('joy'),knob=document.getElementById('knob');let joyId=null;
function joyMove(e){const r=joyEl.getBoundingClientRect();let dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);const L=Math.hypot(dx,dy),M=r.width/2-8;if(L>M){dx*=M/L;dy*=M/L}knob.style.transform=`translate(${dx}px,${dy}px)`;joy.x=dx/M;joy.y=-dy/M}
joyEl.addEventListener('pointerdown',e=>{joyId=e.pointerId;joyEl.setPointerCapture(e.pointerId);joyMove(e);e.stopPropagation()});
joyEl.addEventListener('pointermove',e=>{if(e.pointerId===joyId)joyMove(e)});
const joyEnd=e=>{if(e.pointerId===joyId){joyId=null;joy.x=joy.y=0;knob.style.transform='translate(0,0)'}};joyEl.addEventListener('pointerup',joyEnd);joyEl.addEventListener('pointercancel',joyEnd);
function readInput(){let x=joy.x,y=joy.y;if(keys.KeyA||keys.ArrowLeft)x-=1;if(keys.KeyD||keys.ArrowRight)x+=1;if(keys.KeyW||keys.ArrowUp)y+=1;if(keys.KeyS||keys.ArrowDown)y-=1;
 const gp=navigator.getGamepads?[...navigator.getGamepads()].find(g=>g):null;if(gp){const ax=gp.axes[0]||0,ay=-(gp.axes[1]||0);if(Math.hypot(ax,ay)>.2){x+=ax;y+=ay}if(gp.buttons[14]?.pressed)x-=1;if(gp.buttons[15]?.pressed)x+=1;if(gp.buttons[12]?.pressed)y+=1;if(gp.buttons[13]?.pressed)y-=1;const rx=gp.axes[2]||0;if(Math.abs(rx)>.25)thetaT-=rx*.04}
 const m=Math.hypot(x,y);if(m>1){x/=m;y/=m}return{x,y,m:Math.min(1,m)}}
function resize(){renderer.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}
addEventListener('resize',resize);resize();
const clock=new THREE.Clock();let lastT=0,hover=null,idle=0;const v=new THREE.Vector3();
function loop(){const t=clock.getElapsedTime(),dt=Math.min(.05,t-lastT);lastT=t;
 // walking
 let walking=false;
 const inp=readInput();let manual=false;
 if(inp.m>.12){manual=true;goal=null;goalSt=null;const fwd=new THREE.Vector3(guide.position.x-cam.position.x,0,guide.position.z-cam.position.z).normalize();const rgt=new THREE.Vector3(-fwd.z,0,fwd.x);const mv=fwd.multiplyScalar(inp.y).add(rgt.multiplyScalar(inp.x));const mag=Math.min(1,mv.length());mv.normalize();guide.position.addScaledVector(mv,6.5*mag*dt);const rr=guide.position.length();if(rr>10){guide.position.multiplyScalar(10/rr)}walking=true;const yaw=Math.atan2(mv.x,mv.z);let dy=yaw-rig.rotation.y;dy=Math.atan2(Math.sin(dy),Math.cos(dy));rig.rotation.y+=dy*Math.min(1,dt*12)}
 if(!manual&&goal){v.copy(goal).sub(guide.position);v.y=0;const d=v.length();if(d<.15){goal=null;if(goalSt){cur=goalSt;showPanel(goalSt.id);speakText(goalSt.line);wave();goalSt=null}}else{walking=true;const sp=Math.min(d*3+1.5,6.2);v.normalize();guide.position.addScaledVector(v,sp*dt);const yaw=Math.atan2(v.x,v.z);let dy=yaw-rig.rotation.y;dy=Math.atan2(Math.sin(dy),Math.cos(dy));rig.rotation.y+=dy*Math.min(1,dt*10)}}
 if(!walking){const toCam=Math.atan2(cam.position.x-guide.position.x,cam.position.z-guide.position.z);let dy=toCam+mouse.x*.3-rig.rotation.y;dy=Math.atan2(Math.sin(dy),Math.cos(dy));rig.rotation.y+=dy*Math.min(1,dt*3)}
 const bob=walking?Math.abs(Math.sin(t*10))*.14:Math.sin(t*1.5)*.04;let hop=0;if(hopT>=0){hopT+=dt*1.6;hop=Math.sin(Math.min(hopT,1)*Math.PI)*.9;if(hopT>1)hopT=-1}
 rig.position.y=bob+hop+1.45;rig.rotation.x=walking?.12:0;
 const sw=walking?Math.sin(t*10)*.8:0;legL.rotation.x=sw;legR.rotation.x=-sw;armL.rotation.x=walking?sw*.6:0;armL.rotation.z=.12;armR.rotation.z=-.12;armR.rotation.x=walking?-sw*.6:Math.sin(t*1.5)*.05;
 if(waveT>=0){waveT+=dt*.9;const k=Math.sin(Math.min(waveT,1)*Math.PI);armR.rotation.z=-(.4+2.3*k)+Math.sin(waveT*40)*.25*k;armR.rotation.x=0;if(waveT>1)waveT=-1}
 head.rotation.y=THREE.MathUtils.lerp(head.rotation.y,Math.sin(t*.7)*.1,.1);head.rotation.x=THREE.MathUtils.lerp(head.rotation.x,-mouse.y*.3,.1);
 orb.position.set(Math.cos(t*2)*1.0,1.2+Math.sin(t*2.4)*.3,Math.sin(t*2)*1.0);orb.rotation.y=t;
 if(walking){tp[tI*3]=guide.position.x;tp[tI*3+1]=.3;tp[tI*3+2]=guide.position.z;tI=(tI+1)%TR;trail.geometry.attributes.position.needsUpdate=true}else{for(let k=0;k<TR;k++)tp[k*3+1]+=.0;}
 for(let k=0;k<TR;k++){if(tp[k*3+1]>-900)tp[k*3+1]+=dt*.4;if(tp[k*3+1]>2)tp[k*3+1]=-999}trail.geometry.attributes.position.needsUpdate=true;
 // proximity reveal
 let near=null,nd=3.4;ST.forEach(s=>{const d=Math.hypot(s.pos.x-guide.position.x,s.pos.z-guide.position.z);if(d<nd){nd=d;near=s}});
 if(near&&near!==cur){cur=near;showPanel(near.id);speakText(near.line);wave()}else if(!near&&cur&&!goal){let far=true;ST.forEach(s=>{if(Math.hypot(s.pos.x-guide.position.x,s.pos.z-guide.position.z)<5)far=false});if(far){cur=null;showPanel(null)}}
 // hover
 ray.setFromCamera(new THREE.Vector2(mouse.x,mouse.y),cam);const hh=ray.intersectObjects(ST.map(s=>s.mesh))[0];hover=hh?hh.object.userData.st:null;canvas.style.cursor=hover?'pointer':(down?'grabbing':'grab');
 ST.forEach((s,i)=>{const on=hover===s||cur===s;s.mesh.rotation.y=t*(on?1.6:.5);s.mesh.rotation.x=t*.3*(i%2?1:-1)*(on?2:1);s.mesh.position.y=2.2+Math.sin(t*1.4+i)*.25+(on?.3:0);const sc=THREE.MathUtils.lerp(s.mesh.scale.x,on?1.35:1,.15);s.mesh.scale.setScalar(sc);s.mesh.material.emissiveIntensity=on?1.1:.55;s.light.intensity=on?30:12});
 floorRings.forEach((r,i)=>r.rotation.z=t*.2*(i%2?1:-1));bits.forEach(m=>{m.position.y+=Math.sin(t+m.userData.p)*.004;m.rotation.x=t*.4+m.userData.p;m.rotation.y=t*.3});
 // camera
 theta+=(thetaT-theta)*.08;phi+=(phiT-phi)*.08;if(!down&&moved===0)thetaT+=.0006;
 const fx=guide.position.x,fz=guide.position.z;cam.position.set(fx+Math.cos(theta)*Math.sin(phi)*dist,Math.cos(phi)*dist,fz+Math.sin(theta)*Math.sin(phi)*dist);cam.lookAt(fx,mobile?4.2:1.2,fz);
 // overlays
 const gp=guide.position.clone();gp.y=4.2;gp.project(cam);gx=(gp.x*.5+.5)*innerWidth;gy=(-gp.y*.5+.5)*innerHeight;
 bubble.style.left=Math.min(innerWidth-130,Math.max(130,gx))+'px';bubble.style.top=Math.max(70,gy-60)+'px';if(performance.now()>bubbleUntil)bubble.classList.add('hidden');
 ST.forEach(s=>{const p=s.pos.clone();p.y=4.4;p.project(cam);s.el.style.left=((p.x*.5+.5)*innerWidth)+'px';s.el.style.top=((-p.y*.5+.5)*innerHeight)+'px';s.el.classList.toggle('on',hover===s||cur===s)});
 renderer.render(scene,cam);requestAnimationFrame(loop)}
loop();
