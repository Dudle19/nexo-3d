import { EXPERIENCE } from './config.js';
const THREE = window.THREE;

function material(color, options = {}) { return new THREE.MeshStandardMaterial({ color, roughness: .52, metalness: .18, ...options }); }
function box(width, height, depth, color, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material(color));
  mesh.position.set(x, y, z); mesh.castShadow = true; mesh.receiveShadow = true; return mesh;
}

export function createRenderer(container) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  container.appendChild(renderer.domElement); return renderer;
}

export function createWorld() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(EXPERIENCE.background); scene.fog = new THREE.Fog(EXPERIENCE.background, EXPERIENCE.fogNear, EXPERIENCE.fogFar);
  scene.add(new THREE.HemisphereLight(0xbfe9ff, 0x07111e, 1.25));
  const sun = new THREE.DirectionalLight(0xdaf4ff, 1.5); sun.position.set(12, 24, 8); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = sun.shadow.camera.bottom = -28; sun.shadow.camera.right = sun.shadow.camera.top = 28; scene.add(sun);
  scene.add(box(EXPERIENCE.worldSize, .5, EXPERIENCE.worldSize, 0x0a1b2d, 0, -.28, 0));
  const grid = new THREE.GridHelper(EXPERIENCE.worldSize, 46, 0x194263, 0x102a40); grid.position.y = .01; grid.material.transparent = true; grid.material.opacity = .48; scene.add(grid);
  createStage(scene); createLandmarks(scene); createCrowd(scene); createBoundaryLights(scene); return scene;
}

function createStage(scene) {
  const stage = new THREE.Group(); stage.position.z = -12;
  stage.add(box(17, .8, 8, 0x102b47, 0, .4, 0), box(16, 6.2, .55, 0x12345a, 0, 3.1, -3.45));
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(12.8, 4.2), new THREE.MeshBasicMaterial({ color: 0x0b8eac })); screen.position.set(0, 3.2, -3.15); stage.add(screen);
  for (let i = 0; i < 6; i += 1) {
    const light = new THREE.SpotLight(i % 2 ? 0x3478f6 : 0x53e3ff, 1.2, 20, .28, .6);
    light.position.set(-7.5 + i * 3, 6.1, -2.7); light.target.position.set(-5 + i * 2, 0, 4); stage.add(light, light.target);
  }
  scene.add(stage);
}

function createLandmarks(scene) {
  [[-16,2.6,0,5,5.2,11,0x112d48],[16,2,0,5,4,11,0x17334c],[-16,1.5,15,4,3,5,0x11283e],[16,1.5,15,4,3,5,0x11283e]]
    .forEach(([x,y,z,w,h,d,color]) => scene.add(box(w,h,d,color,x,y,z)));
}

function createBoundaryLights(scene) {
  for (let i = -20; i <= 20; i += 5) [[i,-20],[i,20],[-20,i],[20,i]].forEach(([x,z]) => {
    const lamp = new THREE.Mesh(new THREE.CylinderGeometry(.045,.045,.55,8), new THREE.MeshBasicMaterial({ color: 0x53e3ff })); lamp.position.set(x,.28,z); scene.add(lamp);
  });
}

function createCrowd(scene) {
  const group = new THREE.Group(); const colors = [0x57758f,0x785f98,0x4e806f];
  for (let i = 0; i < 16; i += 1) {
    const person = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(.18,.2,.7,8), material(colors[i % colors.length])); body.position.y = .48;
    const head = new THREE.Mesh(new THREE.SphereGeometry(.17,8,8), material(0xb7c5cf)); head.position.y = .98; person.add(body,head);
    const angle = i / 16 * Math.PI * 2; const radius = 6 + i % 3 * 2; person.position.set(Math.sin(angle)*radius,0,-5+Math.cos(angle)*radius); person.userData.phase = i*.7; group.add(person);
  }
  group.name = 'crowd'; scene.add(group);
}

export function animateWorld(scene, elapsed) {
  scene.getObjectByName('crowd')?.children.forEach(person => { person.position.y = Math.sin(elapsed*1.4+person.userData.phase)*.025; });
}
