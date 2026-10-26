// ---------- renderer ----------
const GRADE={uniforms:{tDiffuse:{value:null}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
fragmentShader:'uniform sampler2D tDiffuse;varying vec2 vUv;void main(){vec3 c=texture2D(tDiffuse,vUv).rgb;float l=dot(c,vec3(.299,.587,.114));c=mix(vec3(l),c,1.1);c=(c-.5)*1.07+.5;c*=vec3(1.04,1.,.93);float v=1.-smoothstep(.3,.95,length((vUv-.5)*vec2(1.15,1.)));c*=mix(.55,1.,v);c=pow(max(c,0.),vec3(1./2.2));gl_FragColor=vec4(c,1.);}'};
const C=$('c'),R=new THREE.WebGLRenderer({canvas:C,antialias:true,powerPreference:'high-performance'});
const PP=!!(THREE.EffectComposer&&THREE.RenderPass&&THREE.UnrealBloomPass&&THREE.ShaderPass&&THREE.CopyShader);
R.setPixelRatio(Math.min(devicePixelRatio,PP?1.75:2));R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.05;if(!PP)R.outputEncoding=THREE.sRGBEncoding;
const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(40,4/3,.1,150);cam.layers.enableAll();
const SKY=(()=>{const c=document.createElement('canvas');c.width=2;c.height=256;const x=c.getContext('2d'),gr=x.createLinearGradient(0,0,0,256);gr.addColorStop(0,'#3f86d8');gr.addColorStop(.5,'#9cc4e8');gr.addColorStop(1,'#f4dcae');x.fillStyle=gr;x.fillRect(0,0,2,256);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t;})();
sc.background=SKY;sc.fog=new THREE.Fog(new THREE.Color(0xc2d2e4).convertSRGBToLinear(),26,58);
{const es=new THREE.Scene();es.add(new THREE.Mesh(new THREE.SphereGeometry(10,32,16),new THREE.MeshBasicMaterial({map:SKY,side:THREE.BackSide})));const sn=new THREE.Mesh(new THREE.SphereGeometry(1.4,16,8),new THREE.MeshBasicMaterial({color:0xfff2cc}));sn.position.set(6,5,4);es.add(sn);
const pm=new THREE.PMREMGenerator(R);sc.environment=pm.fromScene(es,.04).texture;pm.dispose();}
let az=0,pol=.85,dist=20,tt=0,tx=2,tz=.3;
function setCam(){cam.position.set(tx+dist*Math.sin(pol)*Math.sin(az),dist*Math.cos(pol),tz+dist*Math.sin(pol)*Math.cos(az));cam.lookAt(tx,0,tz);sc.fog.near=dist+9;sc.fog.far=dist+42;}
sc.add(new THREE.HemisphereLight(0xcfe3ff,0x8a7a5a,.5));
const sun=new THREE.DirectionalLight(0xffe2b4,1.55);sun.position.set(9,10,5);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-.0005;sun.shadow.normalBias=.03;
Object.assign(sun.shadow.camera,{left:-12,right:12,top:12,bottom:-12,far:45});sc.add(sun);
const gl=new THREE.PointLight(0xffa060,.8,5),cl=new THREE.PointLight(0xffa060,.8,5);gl.position.set(-6.5,1,-2.5);cl.position.set(6.5,1,2.5);sc.add(gl,cl);
let comp=null;
if(PP){try{const rt=R.capabilities.isWebGL2?new THREE.WebGLMultisampleRenderTarget(2,2):null;comp=rt?new THREE.EffectComposer(R,rt):new THREE.EffectComposer(R);comp.addPass(new THREE.RenderPass(sc,cam));
comp.addPass(new THREE.UnrealBloomPass(new THREE.Vector2(256,256),.4,.5,.88));comp.addPass(new THREE.ShaderPass(GRADE));}catch(e){comp=null;R.outputEncoding=THREE.sRGBEncoding;}}
// the canvas fills #wrap, which CSS stretches to whatever space the window leaves; narrower than 4:3 widens the fov so the board's width stays in view
function resize(){const W=$('wrap'),w=W.clientWidth,h=W.clientHeight,a=w/h;if(!w||!h)return;// hidden tab: wait for the observer
R.setSize(w,h,false);if(comp){comp.setPixelRatio(R.getPixelRatio());comp.setSize(w,h);}
// when the bottom HUD floats over the view (wide screens), render the lower part of a taller frustum so the board sits higher, above the HUD
const d=getComputedStyle($('panel')).position=='absolute'?Math.round(h*.16):0,t=Math.tan((a>=4/3?20:Math.atan(Math.tan(20*Math.PI/180)*4/3/a)*180/Math.PI)*Math.PI/180)*(h+d)/h;
cam.aspect=w/(h+d);cam.fov=2*Math.atan(t)*180/Math.PI;if(d)cam.setViewOffset(w,h+d,0,d,w,h);else cam.clearViewOffset();cam.updateProjectionMatrix();}
addEventListener('resize',resize);if(window.ResizeObserver)new ResizeObserver(resize).observe($('wrap'));resize();setCam();
