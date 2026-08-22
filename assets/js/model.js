import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const stage=document.getElementById('model-stage');
const loaderElement=document.getElementById('model-loader');
if(!stage)throw new Error('Contêiner do modelo 3D não encontrado.');

const MODEL_ROTATION=new THREE.Euler(0,0,0);
const MODEL_SCALE=1;
const GLB_PATH='assets/models/logo_GLTF_final_v2.glb';
const CAMERA_FOV=38;
const FRAME_PADDING=1.32;
const ZOOM_MIN=.88;
const ZOOM_MAX=1.14;
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(CAMERA_FOV,1,.01,100);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.22;
renderer.setClearColor(0x000000,0);
stage.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xd8ffe6,0x183325,2.1));
const keyLight=new THREE.DirectionalLight(0xffe4a3,3.1);keyLight.position.set(2,-3,4);scene.add(keyLight);
const pointLight=new THREE.PointLight(0x74ffd2,13,6);pointLight.position.set(-1,.5,1);scene.add(pointLight);

let model=null,baseCameraDistance=5,zoomTarget=1,zoomCurrent=1,clickImpulse=0,mouseSpeed=0,lastPointerX=null,lastPointerY=null,isVisible=true;
const modelCenter=new THREE.Vector3(),cameraDirection=new THREE.Vector3(0,0,1),framedModelSize=new THREE.Vector3();
const mouse={x:0,y:0,targetX:0,targetY:0},signals=[],bones={},boneRestTransforms=new Map();

function sizeRenderer(){const width=Math.max(stage.clientWidth,1),height=Math.max(stage.clientHeight,1);camera.aspect=width/height;camera.updateProjectionMatrix();renderer.setSize(width,height,false);renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));if(model)fitCameraToSize(framedModelSize)}
function updateCamera(){camera.position.copy(cameraDirection).multiplyScalar(baseCameraDistance*zoomCurrent).add(modelCenter);camera.lookAt(modelCenter)}
function fitCameraToSize(size){const maxDimension=Math.max(size.x,size.y,size.z),verticalFov=THREE.MathUtils.degToRad(camera.fov),horizontalFov=2*Math.atan(Math.tan(verticalFov/2)*camera.aspect),fitHeight=size.y/(2*Math.tan(verticalFov/2)),fitWidth=size.x/(2*Math.tan(horizontalFov/2));baseCameraDistance=(Math.max(fitHeight,fitWidth)+size.z/2)*FRAME_PADDING;camera.near=Math.max(baseCameraDistance/1000,.001);camera.far=Math.max(baseCameraDistance+maxDimension*10,100);updateCamera();camera.updateProjectionMatrix()}
function autoFrameModel(object){object.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(object);if(box.isEmpty())throw new Error('O modelo não possui limites visíveis.');const center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3());object.position.sub(center);object.updateMatrixWorld(true);framedModelSize.copy(size);fitCameraToSize(size)}
function rememberBone(bone){if(bone)boneRestTransforms.set(bone,{position:bone.position.clone(),rotation:bone.rotation.clone()})}
function restoreBone(bone){const rest=boneRestTransforms.get(bone);if(!bone||!rest)return false;bone.position.copy(rest.position);bone.rotation.copy(rest.rotation);return true}

new GLTFLoader().load(GLB_PATH,gltf=>{
    model=gltf.scene;model.rotation.copy(MODEL_ROTATION);model.scale.setScalar(MODEL_SCALE);scene.add(model);
    model.traverse(object=>{if(object.name.includes('ICTCEBH_SIGNAL_'))signals.push(object)});
    Object.assign(bones,{core:model.getObjectByName('B_CORE'),top:model.getObjectByName('B_TOP'),bottom:model.getObjectByName('B_BOTTOM'),left:model.getObjectByName('B_LEFT'),right:model.getObjectByName('B_RIGHT'),diagTR:model.getObjectByName('B_DIAG_TR'),diagBL:model.getObjectByName('B_DIAG_BL')});
    Object.values(bones).forEach(rememberBone);autoFrameModel(model);loaderElement?.classList.add('hidden');
},undefined,error=>{console.error(`Falha ao carregar ${GLB_PATH}:`,error);if(loaderElement)loaderElement.innerHTML='<small>Não foi possível carregar o modelo 3D</small>'});

stage.addEventListener('pointermove',event=>{const rect=stage.getBoundingClientRect();mouse.targetX=((event.clientX-rect.left)/rect.width)*2-1;mouse.targetY=-(((event.clientY-rect.top)/rect.height)*2-1);if(lastPointerX!==null)mouseSpeed=Math.min(Math.hypot(event.clientX-lastPointerX,event.clientY-lastPointerY)/100,1);lastPointerX=event.clientX;lastPointerY=event.clientY});
stage.addEventListener('pointerleave',()=>{mouse.targetX=0;mouse.targetY=0;lastPointerX=null;lastPointerY=null});
stage.addEventListener('pointerdown',()=>{clickImpulse=Math.min(clickImpulse+.7,1)});
stage.addEventListener('wheel',event=>{zoomTarget=THREE.MathUtils.clamp(zoomTarget+event.deltaY*.00018,ZOOM_MIN,ZOOM_MAX)},{passive:true});

function updateInteraction(){if(!model)return;mouse.x+=(mouse.targetX-mouse.x)*.045;mouse.y+=(mouse.targetY-mouse.y)*.045;mouseSpeed*=.94;const motion=reduceMotion?0:1;model.rotation.x=MODEL_ROTATION.x+mouse.y*.055*motion;model.rotation.y=MODEL_ROTATION.y+mouse.x*.09*motion;model.rotation.z=MODEL_ROTATION.z+mouse.x*.10*motion;if(restoreBone(bones.top)){bones.top.position.x+=mouse.x*.035*motion;bones.top.position.z+=mouse.y*.025*motion}if(restoreBone(bones.bottom)){bones.bottom.position.x-=mouse.x*.025*motion;bones.bottom.position.z-=mouse.y*.020*motion}if(restoreBone(bones.right)){bones.right.position.x+=mouse.x*.045*motion;bones.right.rotation.z+=mouse.y*.08*motion}if(restoreBone(bones.left)){bones.left.position.x+=mouse.x*.025*motion;bones.left.rotation.z-=mouse.y*.08*motion}if(restoreBone(bones.diagTR)){bones.diagTR.rotation.y+=mouse.x*.14*motion;bones.diagTR.rotation.x+=mouse.y*.10*motion}if(restoreBone(bones.diagBL)){bones.diagBL.rotation.y-=mouse.x*.12*motion;bones.diagBL.rotation.x-=mouse.y*.08*motion}if(restoreBone(bones.core)){bones.core.position.y+=mouse.y*.06*motion;bones.core.rotation.z+=mouse.x*.10*motion}}
function updateSignals(time){if(reduceMotion)return;signals.forEach((signal,index)=>{const phase=index*.75,angle=time*(.00035+index*.000035)+phase,radius=.17+(index%3)*.055;signal.position.set(Math.cos(angle)*radius,Math.sin(angle*2)*.055,Math.sin(angle)*radius);signal.scale.setScalar(.85+Math.sin(angle*3)*.18)})}
function animate(time){requestAnimationFrame(animate);if(!isVisible)return;updateInteraction();updateSignals(time);clickImpulse*=.88;zoomCurrent+=(zoomTarget-zoomCurrent)*.08;updateCamera();if(model){const breathing=reduceMotion?1:1+Math.sin(time*.0015)*.012+mouseSpeed*.015;model.scale.setScalar(MODEL_SCALE*breathing*(1+clickImpulse*.045))}renderer.render(scene,camera)}
if('ResizeObserver'in window)new ResizeObserver(sizeRenderer).observe(stage);else window.addEventListener('resize',sizeRenderer);
if('IntersectionObserver'in window)new IntersectionObserver(entries=>{isVisible=entries[0]?.isIntersecting??true}).observe(stage);
sizeRenderer();animate(0);
