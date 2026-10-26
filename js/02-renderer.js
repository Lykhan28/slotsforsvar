// ---------- renderer ----------
const EXPO=TH.ex,SUN0=TH.sun[1];// base exposure and sun strength (per level theme); js/13-ending.js dims from and resets to these
const GRADE={uniforms:{tDiffuse:{value:null},uSat:{value:TH.sat},uTint:{value:new THREE.Vector3(...TH.tint)}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
fragmentShader:'uniform sampler2D tDiffuse;uniform float uSat;uniform vec3 uTint;varying vec2 vUv;void main(){vec3 c=texture2D(tDiffuse,vUv).rgb;float l=dot(c,vec3(.299,.587,.114));c=mix(vec3(l),c,uSat)*uTint;c*=mix(vec3(.97,.99,1.03),vec3(1.03,1.,.93),smoothstep(.05,.5,l));float v=1.-smoothstep(.35,1.,length((vUv-.5)*vec2(1.15,1.)));c*=mix(.7,1.,v);c=pow(max(c,0.),vec3(1./2.2));c=(c-.5)*1.03+.5;c=c*.96+.04;gl_FragColor=vec4(c,1.);}'};
const C=$('c'),R=new THREE.WebGLRenderer({canvas:C,antialias:true,powerPreference:'high-performance'});
const PP=!!(THREE.EffectComposer&&THREE.RenderPass&&THREE.UnrealBloomPass&&THREE.ShaderPass&&THREE.CopyShader);
R.setPixelRatio(Math.min(devicePixelRatio,PP?1.75:2));R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=EXPO;if(!PP)R.outputEncoding=THREE.sRGBEncoding;
const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(40,4/3,.1,150);cam.layers.enableAll();
const SKY=(()=>{const c=document.createElement('canvas');c.width=2;c.height=256;const x=c.getContext('2d'),gr=x.createLinearGradient(0,0,0,256);gr.addColorStop(0,TH.sky[0]);gr.addColorStop(.5,TH.sky[1]);gr.addColorStop(1,TH.sky[2]);x.fillStyle=gr;x.fillRect(0,0,2,256);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t;})();
sc.background=SKY;sc.fog=new THREE.Fog(new THREE.Color(TH.fog).convertSRGBToLinear(),26,58);
{const es=new THREE.Scene();es.add(new THREE.Mesh(new THREE.SphereGeometry(10,32,16),new THREE.MeshBasicMaterial({map:SKY,side:THREE.BackSide})));const sn=new THREE.Mesh(new THREE.SphereGeometry(1.4,16,8),new THREE.MeshBasicMaterial({color:TH.orb}));sn.position.set(6,5,4);es.add(sn);
const pm=new THREE.PMREMGenerator(R);sc.environment=pm.fromScene(es,.04).texture;pm.dispose();}
let az=CAM0.az,pol=CAM0.pol,dist=CAM0.dist,tt=0,tx=CAM0.tx,tz=CAM0.tz;
function setCam(){cam.position.set(tx+dist*Math.sin(pol)*Math.sin(az),dist*Math.cos(pol),tz+dist*Math.sin(pol)*Math.cos(az));cam.lookAt(tx,0,tz);sc.fog.near=dist+TH.fn;sc.fog.far=dist+TH.ff;}
sc.add(new THREE.HemisphereLight(...TH.hemi));
const sun=new THREE.DirectionalLight(TH.sun[0],SUN0);sun.position.set(9,10,5);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-.0005;sun.shadow.normalBias=.03;
{const e=Math.max(12,Math.max(HX,HZ)+6);Object.assign(sun.shadow.camera,{left:-e,right:e,top:e,bottom:-e,far:45});}sc.add(sun);
// warm light flickering at each breach (gls) and at the gate (cl)
const gls=ENT.map(o=>{const l=new THREE.PointLight(0xffa060,.8,5);l.position.set(cx(o.c),1,cz(o.r));sc.add(l);return l;}),cl=new THREE.PointLight(0xffa060,.8,5);cl.position.set(cx(GATE.c),1,cz(GATE.r));sc.add(cl);
let comp=null,bloom=null;
if(PP){try{const rt=R.capabilities.isWebGL2?new THREE.WebGLMultisampleRenderTarget(2,2):null;comp=rt?new THREE.EffectComposer(R,rt):new THREE.EffectComposer(R);comp.addPass(new THREE.RenderPass(sc,cam));
comp.addPass(bloom=new THREE.UnrealBloomPass(new THREE.Vector2(256,256),.4,.5,.88));comp.addPass(new THREE.ShaderPass(GRADE));}catch(e){comp=null;R.outputEncoding=THREE.sRGBEncoding;}}
// the canvas fills #wrap, which CSS stretches to whatever space the window leaves; narrower than 4:3 widens the fov so the board's width stays in view
function resize(){const W=$('wrap'),w=W.clientWidth,h=W.clientHeight,a=w/h;if(!w||!h)return;// hidden tab: wait for the observer
R.setSize(w,h,false);if(comp){comp.setPixelRatio(R.getPixelRatio());comp.setSize(w,h);}
// when the bottom HUD floats over the view (wide screens), render the lower part of a taller frustum so the board sits higher, above the HUD
const d=getComputedStyle($('panel')).position=='absolute'?Math.round(h*.16):0,t=Math.tan((a>=4/3?20:Math.atan(Math.tan(20*Math.PI/180)*4/3/a)*180/Math.PI)*Math.PI/180)*(h+d)/h;
cam.aspect=w/(h+d);cam.fov=2*Math.atan(t)*180/Math.PI;if(d)cam.setViewOffset(w,h+d,0,d,w,h);else cam.clearViewOffset();cam.updateProjectionMatrix();}
addEventListener('resize',resize);if(window.ResizeObserver)new ResizeObserver(resize).observe($('wrap'));resize();setCam();
