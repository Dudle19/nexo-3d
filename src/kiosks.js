const THREE = window.THREE;

export function createKiosks(scene, definitions) {
  return definitions.map(definition => {
    const group = new THREE.Group(); group.position.set(definition.position[0], 0, definition.position[1]); group.userData = { ...definition, interactive: true };
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x18334d, roughness: .42, metalness: .45 });
    const glowMaterial = new THREE.MeshStandardMaterial({ color: definition.color, emissive: definition.color, emissiveIntensity: .55, roughness: .25 });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.15,1.3,.22,6), baseMaterial); base.position.y = .11;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(.1,.16,1.15,8), baseMaterial); stem.position.y = .78;
    const display = new THREE.Mesh(new THREE.BoxGeometry(1.55,1.1,.12), glowMaterial); display.position.set(0,1.55,0); display.rotation.y = Math.atan2(-group.position.x,-group.position.z);
    const halo = new THREE.Mesh(new THREE.TorusGeometry(1.05,.025,6,48), new THREE.MeshBasicMaterial({ color: definition.color, transparent: true, opacity: .65 })); halo.rotation.x = Math.PI/2; halo.position.y = .04;
    group.add(base,stem,display,halo); const light = new THREE.PointLight(definition.color,1.4,7); light.position.y = 1.5; group.add(light);
    group.userData.display = display; group.userData.halo = halo; scene.add(group); return group;
  });
}

export function animateKiosks(kiosks, elapsed) { kiosks.forEach((kiosk,index) => { kiosk.userData.display.position.y = 1.55+Math.sin(elapsed*1.2+index)*.07; kiosk.userData.halo.rotation.z = elapsed*.18*(index%2?1:-1); }); }
export function findKioskRoot(object) { let current = object; while (current && !current.userData.interactive) current = current.parent; return current?.userData.interactive ? current : null; }
