const objject = 'P/2004 R1 (McNaught)';
const epoch_tdb = '54629';
const tp_tdb = '2455248.548';
const e = '0.682526943';
const i_deg = '4.894555854';
const w_deg = '0.626837835';
const node_deg = '295.9854497';
const q_au_1 = '0.986192006';
const q_au_2 = '5.23';
const p_yr = '5.48';
const moid_au = '0.027011';
const ref = '20';

// Сцена, камера и рендерер
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth/(window.innerHeight-100), 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight-100);
document.body.appendChild(renderer.domElement);

const loader = new THREE.TextureLoader();
const texture_earth = loader.load('static/texture.png');
const texture_moon = loader.load('static/moon.jpg');

document.addEventListener('wheel', onDocumentMouseWheel, false);

// Центральный объект
const geometry = new THREE.SphereGeometry(6.3, 32, 32);
const material = new THREE.MeshBasicMaterial({ map: texture_earth });
const centralSphere = new THREE.Mesh(geometry, material);
scene.add(centralSphere);

// Добавляем орбитальный путь
const points = [];
for (let clock = 0; clock < ts; clock++) {
  const loc = propagate(clock, e, a);
  points.push(loc);
}

const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
scene.add(orbitLine);

// Добавляем маленькую сферу для движения по орбите
const sphereGeometry = new THREE.SphereGeometry(1.7, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ map: texture_moon });
const orbitingSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(orbitingSphere);

camera.position.z = 90;

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function propagate(clock, e, a) {
  const T = 120; // Период (в секундах)
  const n = 2 * Math.PI / T;
  const tau = 0;

  const M = n * (clock - tau);
  const E = keplerSolve(e, M);
  const cose = Math.cos(E);

  const r = a * (1 - e * cose);
  const sX = r * ((cose - e) / (1 - e * cose));
  const sY = r * ((Math.sqrt(1 - e * e) * Math.sin(E)) / (1 - e * cose));
  const sZ = 0;

  return new THREE.Vector3(sX, sY, sZ);
}

function keplerSolve(e, M) {
  const tol = 1.0e-14;
  const Mnorm = M % (2 * Math.PI);
  let E0 = Mnorm;
  let dE = tol + 1;

  while (dE > tol) {
    const E = E0 - (E0 - e * Math.sin(E0) - Mnorm) / (1 - e * Math.cos(E0));
    dE = Math.abs(E - E0);
    E0 = E;
  }

  return E0;
}

function onDocumentMouseWheel(event) {
  camera.position.z += event.deltaY * zoomSpeed;

  if (camera.position.z < minZoom) {
    camera.position.z = minZoom;
  }
  if (camera.position.z > maxZoom) {
    camera.position.z = maxZoom;
  }
}

function updateSpeed(value) {
  speed = parseFloat(value); // Обновляем скорость
  document.getElementById('speedValue').textContent = value; // Обновляем отображение скорости
}

function animate() {
  requestAnimationFrame(animate);

  if (clock < ts) {
    const loc = propagate(clock, e, a);
    orbitingSphere.position.set(loc.x, loc.y, loc.z);
    clock += speed;  // Используем скорость, задаваемую ползунком
  } else {
    clock = 0;  // Сброс времени
  }

  renderer.render(scene, camera);
}

animate();