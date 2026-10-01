export const EXPERIENCE = {
  title: 'Nexo 3D', worldSize: 46, playerSpeed: 8, playerColor: 0x53e3ff,
  background: 0x06111f, fogNear: 24, fogFar: 66,
  camera: { distance: 22, minDistance: 10, maxDistance: 36, pitch: 0.62 }
};

export const KIOSKS = [
  { id: 'ai-lab', number: '02', title: 'Laboratorio IA', category: 'Workshop en vivo', icon: 'AI', description: 'Descubre cómo los modelos generativos aceleran prototipos, contenidos y nuevas experiencias digitales.', position: [-11, 8], color: 0x53e3ff },
  { id: 'partners', number: '03', title: 'Hub de aliados', category: 'Networking', icon: 'NX', description: 'Conecta con especialistas, proveedores y equipos que convierten ideas ambiciosas en productos reales.', position: [11, 8], color: 0xb6f36b },
  { id: 'lounge', number: '04', title: 'Lounge creativo', category: 'Comunidad', icon: 'CO', description: 'Un punto de encuentro para compartir aprendizajes, iniciar conversaciones y descubrir colaboraciones.', position: [0, 16], color: 0xb494ff },
  { id: 'stage', number: '05', title: 'Escenario principal', category: 'Conferencia', icon: 'LIVE', description: 'El auditorio central para charlas, demostraciones y presentaciones transmitidas en tiempo real.', position: [0, -9], color: 0x3478f6 }
];

export const TECHNOLOGIES = [
  { name: 'Three.js + WebGL', detail: 'Renderiza cámaras, luces, materiales, geometrías y animación 3D en el navegador.' },
  { name: 'JavaScript ES Modules', detail: 'Separa configuración, escena, jugador, UI y aplicación para que cada pieza evolucione sin acoplarse.' },
  { name: 'HTML semántico + CSS', detail: 'Construye una interfaz accesible, responsive y desacoplada del canvas 3D.' },
  { name: 'Raycasting', detail: 'Convierte el clic del usuario en una intersección con objetos de la escena para hacerlos interactivos.' }
];
