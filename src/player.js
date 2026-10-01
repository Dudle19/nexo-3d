import { EXPERIENCE } from './config.js';
const THREE = window.THREE;

export class PlayerController {
  constructor(scene, camera, canvas) {
    this.camera=camera; this.canvas=canvas; this.avatar=this.createAvatar(); scene.add(this.avatar);
    this.input={forward:false,backward:false,left:false,right:false}; this.velocity=new THREE.Vector3();
    this.yaw=Math.PI*.22; this.pitch=EXPERIENCE.camera.pitch; this.distance=EXPERIENCE.camera.distance;
    this.drag={active:false,moved:false,x:0,y:0}; this.enabled=false; this.bindEvents(); this.updateCamera();
  }

  createAvatar() {
    const avatar=new THREE.Group();
    const glow=new THREE.MeshStandardMaterial({color:EXPERIENCE.playerColor,emissive:EXPERIENCE.playerColor,emissiveIntensity:.5,roughness:.3});
    const body=new THREE.Mesh(new THREE.CylinderGeometry(.28,.34,.65,12),glow); body.position.y=.6;
    const head=new THREE.Mesh(new THREE.SphereGeometry(.25,12,12),new THREE.MeshStandardMaterial({color:0xeafaff,roughness:.22})); head.position.y=1.08;
    const visor=new THREE.Mesh(new THREE.SphereGeometry(.17,12,8,0,Math.PI*2,0,Math.PI/2),new THREE.MeshBasicMaterial({color:0x0d2c45})); visor.position.set(0,1.1,-.17); visor.rotation.x=Math.PI/2;
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.43,.035,8,24),new THREE.MeshBasicMaterial({color:EXPERIENCE.playerColor,transparent:true,opacity:.65})); ring.rotation.x=Math.PI/2; ring.position.y=.04;
    avatar.add(body,head,visor,ring); avatar.userData.ring=ring; return avatar;
  }

  bindEvents() {
    const map={KeyW:'forward',ArrowUp:'forward',KeyS:'backward',ArrowDown:'backward',KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right'};
    addEventListener('keydown',event=>{if(event.target.matches('input, textarea'))return;const action=map[event.code];if(action){event.preventDefault();this.input[action]=true;}});
    addEventListener('keyup',event=>{const action=map[event.code];if(action)this.input[action]=false;});
    addEventListener('blur',()=>Object.keys(this.input).forEach(key=>{this.input[key]=false;}));
    this.canvas.addEventListener('pointerdown',event=>{this.drag={active:true,moved:false,x:event.clientX,y:event.clientY};this.canvas.setPointerCapture(event.pointerId);});
    this.canvas.addEventListener('pointermove',event=>{if(!this.drag.active)return;const dx=event.clientX-this.drag.x;const dy=event.clientY-this.drag.y;if(Math.abs(dx)+Math.abs(dy)>3)this.drag.moved=true;this.yaw-=dx*.006;this.pitch=THREE.MathUtils.clamp(this.pitch+dy*.004,.25,1.05);this.drag.x=event.clientX;this.drag.y=event.clientY;});
    this.canvas.addEventListener('pointerup',()=>{this.drag.active=false;});
    this.canvas.addEventListener('wheel',event=>{this.distance=THREE.MathUtils.clamp(this.distance+event.deltaY*.018,EXPERIENCE.camera.minDistance,EXPERIENCE.camera.maxDistance);},{passive:true});
  }

  bindTouchControls(container) {
    container.querySelectorAll('[data-move]').forEach(button=>{const action=button.dataset.move;const toggle=value=>event=>{event.preventDefault();this.input[action]=value;};button.addEventListener('pointerdown',toggle(true));button.addEventListener('pointerup',toggle(false));button.addEventListener('pointercancel',toggle(false));});
  }

  update(delta,elapsed) {
    if(this.enabled){
      const desired=new THREE.Vector3();const forward=new THREE.Vector3(-Math.sin(this.yaw),0,-Math.cos(this.yaw));const right=new THREE.Vector3(Math.cos(this.yaw),0,-Math.sin(this.yaw));
      if(this.input.forward)desired.add(forward);if(this.input.backward)desired.sub(forward);if(this.input.right)desired.add(right);if(this.input.left)desired.sub(right);
      if(desired.lengthSq())desired.normalize().multiplyScalar(EXPERIENCE.playerSpeed);this.velocity.lerp(desired,1-Math.exp(-8*delta));this.avatar.position.addScaledVector(this.velocity,delta);
      const limit=EXPERIENCE.worldSize/2-1.2;this.avatar.position.x=THREE.MathUtils.clamp(this.avatar.position.x,-limit,limit);this.avatar.position.z=THREE.MathUtils.clamp(this.avatar.position.z,-limit,limit);
      if(this.velocity.lengthSq()>.3)this.avatar.rotation.y=Math.atan2(this.velocity.x,this.velocity.z);
    }
    this.avatar.userData.ring.rotation.z=elapsed*.55;this.avatar.children[0].position.y=.6+Math.sin(elapsed*5)*Math.min(this.velocity.length()/120,.035);this.updateCamera();
  }

  updateCamera() {
    const target=this.avatar.position;const horizontal=this.distance*Math.cos(this.pitch);
    this.camera.position.set(target.x+Math.sin(this.yaw)*horizontal,target.y+this.distance*Math.sin(this.pitch),target.z+Math.cos(this.yaw)*horizontal);
    this.camera.lookAt(target.x,target.y+.45,target.z);
  }
}
