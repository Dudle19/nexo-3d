import { KIOSKS } from './config.js';
import { createRenderer,createWorld,animateWorld } from './scene.js';
import { createKiosks,animateKiosks,findKioskRoot } from './kiosks.js';
import { PlayerController } from './player.js';
import { UIController } from './ui.js';
import { AmbientAudio } from './audio.js';
const THREE=window.THREE;

class ExperienceApp {
  constructor(){
    if(!THREE)throw new Error('Three.js no pudo cargarse. Comprueba tu conexión o sirve la librería localmente.');
    this.container=document.getElementById('scene-root');this.renderer=createRenderer(this.container);this.scene=createWorld();
    this.camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,150);this.player=new PlayerController(this.scene,this.camera,this.renderer.domElement);
    this.player.bindTouchControls(document.querySelector('.mobile-controls'));this.kiosks=createKiosks(this.scene,KIOSKS);this.ui=new UIController();this.audio=new AmbientAudio();
    this.clock=new THREE.Clock();this.raycaster=new THREE.Raycaster();this.pointer=new THREE.Vector2();this.nearest=null;this.bindEvents();
  }
  bindEvents(){this.ui.onEnter=name=>{this.player.enabled=true;this.ui.addMessage('Sistema',`${name} se ha unido al espacio.`,true);};this.ui.onSoundChange=active=>this.audio.setEnabled(active);addEventListener('resize',()=>this.resize());this.renderer.domElement.addEventListener('click',event=>this.selectKiosk(event));document.addEventListener('visibilitychange',()=>{if(!document.hidden)this.clock.getDelta();});}
  selectKiosk(event){if(this.player.drag.moved||!this.player.enabled||document.body.dataset.modalOpen)return;const rect=this.renderer.domElement.getBoundingClientRect();this.pointer.set((event.clientX-rect.left)/rect.width*2-1,-((event.clientY-rect.top)/rect.height)*2+1);this.raycaster.setFromCamera(this.pointer,this.camera);const hit=this.raycaster.intersectObjects(this.kiosks,true)[0];if(!hit)return;const kiosk=findKioskRoot(hit.object);if(kiosk&&kiosk.position.distanceTo(this.player.avatar.position)<5.2)this.ui.showKiosk(kiosk);}
  updateNearest(){let nearest=null,minDistance=Infinity;this.kiosks.forEach(kiosk=>{const distance=kiosk.position.distanceTo(this.player.avatar.position);if(distance<minDistance){minDistance=distance;nearest=kiosk;}});this.ui.updateLocation(nearest,minDistance);this.nearest=nearest;}
  resize(){this.camera.aspect=innerWidth/innerHeight;this.camera.updateProjectionMatrix();this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));this.renderer.setSize(innerWidth,innerHeight);}
  start(){document.getElementById('loading').classList.add('is-done');const frame=()=>{requestAnimationFrame(frame);const delta=Math.min(this.clock.getDelta(),.05),elapsed=this.clock.elapsedTime;this.player.update(delta,elapsed);animateWorld(this.scene,elapsed);animateKiosks(this.kiosks,elapsed);this.updateNearest();this.renderer.render(this.scene,this.camera);};frame();}
}

try{new ExperienceApp().start();}catch(error){console.error(error);document.getElementById('loading').classList.add('is-done');const message=document.getElementById('error-message');message.textContent=`No se pudo iniciar la experiencia: ${error.message}`;message.hidden=false;}
