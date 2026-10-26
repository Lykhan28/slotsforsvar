// ---------- renderer ----------
// phones and tablets (coarse pointer) get the lighter settings: smaller textures and shadow map, ambient occlusion off by default
const LOWQ=!!(window.matchMedia&&matchMedia('(pointer:coarse)').matches);
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
const sun=new THREE.DirectionalLight(TH.sun[0],SUN0);sun.position.set(9,10,5);sun.castShadow=true;sun.shadow.mapSize.set(LOWQ?2048:4096,LOWQ?2048:4096);sun.shadow.bias=-.0005;sun.shadow.normalBias=.03;
{const e=Math.max(12,Math.max(HX,HZ)+6);Object.assign(sun.shadow.camera,{left:-e,right:e,top:e,bottom:-e,far:45});}sc.add(sun);
// warm light flickering at each breach (gls) and at the gate (cl)
const gls=ENT.map(o=>{const l=new THREE.PointLight(0xffa060,.8,5);l.position.set(cx(o.c),1,cz(o.r));sc.add(l);return l;}),cl=new THREE.PointLight(0xffa060,.8,5);cl.position.set(cx(GATE.c),1,cz(GATE.r));sc.add(cl);
let comp=null,bloom=null,AO=null;
if(PP){try{const rt=R.capabilities.isWebGL2?new THREE.WebGLMultisampleRenderTarget(2,2):null;comp=rt?new THREE.EffectComposer(R,rt):new THREE.EffectComposer(R);comp.addPass(new THREE.RenderPass(sc,cam));
AO=mkAO();if(AO)comp.addPass(AO.pass);
comp.addPass(bloom=new THREE.UnrealBloomPass(new THREE.Vector2(256,256),.4,.5,.88));comp.addPass(new THREE.ShaderPass(GRADE));}catch(e){comp=null;AO=null;R.outputEncoding=THREE.sRGBEncoding;}}
// ambient occlusion (GFX.ao): soft darkening where things meet – feet on the ground, towers in grass, wall bases, nooks in the castle.
// aoDraw() renders the opaque meshes (layer AOL, re-marked every frame) depth-only at half size, a screen-space pass turns that depth into AO,
// and AO.pass (in the composer, before bloom and grade) blurs it with depth-aware weights and multiplies the image. Transparent and alpha-tested things (glows, water, grass cards) never occlude.
function mkAO(){if(!R.capabilities.isWebGL2&&!R.extensions.has('WEBGL_depth_texture'))return null;
const rd=new THREE.WebGLRenderTarget(2,2,{minFilter:THREE.NearestFilter,magFilter:THREE.NearestFilter,depthBuffer:true});rd.depthTexture=new THREE.DepthTexture(2,2,THREE.UnsignedIntType);
const ra=new THREE.WebGLRenderTarget(2,2,{minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,depthBuffer:false}),VS='varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}';
const sm=new THREE.ShaderMaterial({uniforms:{tD:{value:rd.depthTexture},uIP:{value:new THREE.Matrix4()},uP:{value:new THREE.Matrix4()},uTs:{value:new THREE.Vector2()},uR:{value:.7},uK:{value:4}},vertexShader:VS,depthTest:false,depthWrite:false,
fragmentShader:`uniform sampler2D tD;uniform mat4 uIP,uP;uniform vec2 uTs;uniform float uR,uK;varying vec2 vUv;
vec3 vp(vec2 u){vec4 p=uIP*vec4(u*2.-1.,texture2D(tD,u).x*2.-1.,1.);return p.xyz/p.w;}
void main(){if(texture2D(tD,vUv).x>=1.){gl_FragColor=vec4(1.);return;}
vec3 p=vp(vUv),ax=vp(vUv+vec2(uTs.x,0.))-p,bx=p-vp(vUv-vec2(uTs.x,0.)),ay=vp(vUv+vec2(0.,uTs.y))-p,by=p-vp(vUv-vec2(0.,uTs.y));
vec3 n=normalize(cross(abs(ax.z)<abs(bx.z)?ax:bx,abs(ay.z)<abs(by.z)?ay:by));if(dot(n,p)>0.)n=-n;
vec2 sr=vec2(uP[0][0],uP[1][1])*.5*uR/-p.z;float a=fract(52.98*fract(dot(gl_FragCoord.xy,vec2(.0671,.00584))))*6.283,o=0.;
for(int i=0;i<16;i++){float t=(float(i)+.5)/16.,an=a+float(i)*2.4;vec3 v=vp(vUv+vec2(cos(an),sin(an))*sr*t)-p;float l=length(v)+1e-4;o+=max(dot(v,n)/l-.12,0.)*(1.-smoothstep(uR*.6,uR*1.6,l));}
gl_FragColor=vec4(vec3(clamp(1.-o/16.*uK,0.,1.)),1.);}`});
const qs=new THREE.Scene(),qc=new THREE.OrthographicCamera(-1,1,1,-1,0,1);qs.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),sm));
const pass=new THREE.ShaderPass({uniforms:{tDiffuse:{value:null},tAO:{value:ra.texture},tD:{value:rd.depthTexture},uTs:{value:new THREE.Vector2()},uN:{value:cam.near},uF:{value:cam.far}},vertexShader:VS,
fragmentShader:`uniform sampler2D tDiffuse,tAO,tD;uniform vec2 uTs;uniform float uN,uF;varying vec2 vUv;
float lz(vec2 u){return uN*uF/(uF-texture2D(tD,u).x*(uF-uN));}
void main(){vec4 c=texture2D(tDiffuse,vUv);float zc=lz(vUv),s=0.,w=0.;
for(int y=-2;y<=2;y++)for(int x=-2;x<=2;x++){vec2 u=vUv+vec2(float(x),float(y))*uTs;float k=exp(-abs(lz(u)-zc)*3.)*(3.-abs(float(x))*.5-abs(float(y))*.5);s+=texture2D(tAO,u).r*k;w+=k;}
c.rgb*=s/max(w,1e-4);gl_FragColor=c;}`});
pass.uniforms.tAO.value=ra.texture;pass.uniforms.tD.value=rd.depthTexture;// ShaderPass clones its uniforms, and a cloned texture loses its render target
return{rd,ra,sm,qs,qc,pass,mm:new THREE.MeshBasicMaterial({colorWrite:false})};}
const AOL=3;
// small meshes (limbs, arrows, the army's hundreds of little parts) are left out: they add draw calls, not visible shading. Their world size (aor) is re-measured every 30 frames, as things grow or shrink
const AOV=new THREE.Vector3();let aoF=0;
function aoDraw(){const re=aoF++%30==0;sc.traverse(o=>{if(!o.isMesh)return;if(re||o.userData.aor===undefined){if(!o.geometry.boundingSphere)o.geometry.computeBoundingSphere();o.getWorldScale(AOV);o.userData.aor=o.isInstancedMesh?9:o.geometry.boundingSphere.radius*Math.max(AOV.x,AOV.y,AOV.z);}
const m=o.material,t=o.userData.aor<.3||(Array.isArray(m)?m.some(x=>x.transparent||x.alphaTest>0):m.transparent||m.alphaTest>0);if(t)o.layers.disable(AOL);else o.layers.enable(AOL);});
const lm=cam.layers.mask,bg=sc.background,au=R.shadowMap.autoUpdate;cam.layers.set(AOL);sc.background=null;sc.overrideMaterial=AO.mm;R.shadowMap.autoUpdate=false;
R.setRenderTarget(AO.rd);R.clear();R.render(sc,cam);sc.overrideMaterial=null;sc.background=bg;cam.layers.mask=lm;R.shadowMap.autoUpdate=au;
AO.sm.uniforms.uIP.value.copy(cam.projectionMatrixInverse);AO.sm.uniforms.uP.value.copy(cam.projectionMatrix);R.setRenderTarget(AO.ra);R.render(AO.qs,AO.qc);R.setRenderTarget(null);}
// the canvas fills #wrap, which CSS stretches to whatever space the window leaves; narrower than 4:3 widens the fov so the board's width stays in view
function resize(){const W=$('wrap'),w=W.clientWidth,h=W.clientHeight,a=w/h;if(!w||!h)return;// hidden tab: wait for the observer
R.setSize(w,h,false);if(comp){comp.setPixelRatio(R.getPixelRatio());comp.setSize(w,h);}
if(AO){const b=R.getDrawingBufferSize(new THREE.Vector2()),aw=Math.max(1,b.x>>1),ah=Math.max(1,b.y>>1);AO.rd.setSize(aw,ah);AO.ra.setSize(aw,ah);AO.sm.uniforms.uTs.value.set(1/aw,1/ah);AO.pass.uniforms.uTs.value.set(1/aw,1/ah);}
// when the bottom HUD floats over the view (wide screens), render the lower part of a taller frustum so the board sits higher, above the HUD
const d=getComputedStyle($('panel')).position=='absolute'?Math.round(h*.16):0,t=Math.tan((a>=4/3?20:Math.atan(Math.tan(20*Math.PI/180)*4/3/a)*180/Math.PI)*Math.PI/180)*(h+d)/h;
cam.aspect=w/(h+d);cam.fov=2*Math.atan(t)*180/Math.PI;if(d)cam.setViewOffset(w,h+d,0,d,w,h);else cam.clearViewOffset();cam.updateProjectionMatrix();}
addEventListener('resize',resize);if(window.ResizeObserver)new ResizeObserver(resize).observe($('wrap'));resize();setCam();
