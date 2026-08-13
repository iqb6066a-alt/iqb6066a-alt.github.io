// CAVE 3D Video Game Drifting Car Lock Screen (Password: "egg")

export function renderLockScreen() {
  return `
    <div id="lockScreenContainer" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #000000; z-index: 9999; display: flex; flex-direction: column; justify-content: space-between; align-items: center; padding: 48px 24px; font-family: var(--font-sans); color: #FFFFFF; overflow: hidden;">
      
      <!-- 3D Drifting Car Canvas -->
      <canvas id="driftCanvas" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none;"></canvas>

      <!-- Lock Screen Top Header -->
      <div style="position: relative; z-index: 10; text-align: center;">
        <div style="font-size: 32px; font-weight: 900; letter-spacing: 0.1em; color: #FFFFFF;">CAVE.</div>
        <div class="label-meta" style="color: #8E8E93; font-size: 10px; margin-top: 4px; letter-spacing: 0.2em;">AUTOMOTIVE OPERATING SYSTEM &bull; RESTRICTED</div>
      </div>

      <!-- Lock Screen Center Password Button / Input Area -->
      <div style="position: relative; z-index: 10; text-align: center; max-width: 380px; width: 100%;">
        
        <div id="passcodePromptBox" style="display: none; margin-bottom: 16px; animation: fadeIn 0.2s ease;">
          <input type="password" 
                 id="lockPassInput" 
                 class="form-input" 
                 placeholder="ENTER PASSCODE" 
                 style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); color: #FFF; text-align: center; font-size: 18px; letter-spacing: 0.2em; height: 54px; border-radius: 999px;" 
                 onkeydown="if(event.key === 'Enter') window.app.checkLockPassword()" />
          <div id="passErrorMsg" style="color: #FF3B30; font-size: 12px; font-weight: 700; margin-top: 8px; display: none;">INVALID PASSCODE</div>
        </div>

        <button class="btn-brutal" 
                id="passBtnEl"
                style="background: #FFFFFF !important; color: #000000 !important; font-size: 16px; padding: 16px 36px; font-weight: 900; letter-spacing: 0.1em; width: 100%; box-shadow: 0 10px 30px rgba(255,255,255,0.2);" 
                onclick="window.app.togglePasscodeInput()">
          PASSWORD
        </button>

      </div>

      <!-- Lock Screen Footer -->
      <div style="position: relative; z-index: 10; text-align: center; font-size: 11px; font-weight: 700; color: #636366; letter-spacing: 0.1em;">
        SYSTEM LOCKED &bull; ENTER PASSCODE TO CONTINUE
      </div>

    </div>
  `;
}

export function init3DDriftCarCanvas() {
  const canvas = document.getElementById('driftCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // Scene Setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.FogExp2(0x000000, 0.03);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 8, 14);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Ambient & Directional Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(10, 20, 10);
  scene.add(dirLight);

  // Red & Blue Neon Track Lights
  const redLight = new THREE.PointLight(0xff3b30, 2, 20);
  redLight.position.set(-5, 2, -5);
  scene.add(redLight);

  const blueLight = new THREE.PointLight(0x007aff, 2, 20);
  blueLight.position.set(5, 2, 5);
  scene.add(blueLight);

  // Asphalt Grid Floor
  const gridHelper = new THREE.GridHelper(60, 40, 0x333333, 0x111111);
  gridHelper.position.y = -0.01;
  scene.add(gridHelper);

  // 3D Car Group
  const carGroup = new THREE.Group();

  // Car Body (Arcade Sports Car)
  const bodyGeo = new THREE.BoxGeometry(1.8, 0.6, 3.6);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2, metalness: 0.8 });
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  bodyMesh.position.y = 0.5;
  carGroup.add(bodyMesh);

  // Car Roof Cabin
  const cabinGeo = new THREE.BoxGeometry(1.4, 0.5, 1.8);
  const cabinMat = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.1, metalness: 0.9 });
  const cabinMesh = new THREE.Mesh(cabinGeo, cabinMat);
  cabinMesh.position.set(0, 0.9, -0.2);
  carGroup.add(cabinMesh);

  // Glowing Headlights
  const headlightGeo = new THREE.BoxGeometry(0.4, 0.15, 0.1);
  const headlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  
  const leftHeadlight = new THREE.Mesh(headlightGeo, headlightMat);
  leftHeadlight.position.set(-0.6, 0.5, 1.8);
  carGroup.add(leftHeadlight);

  const rightHeadlight = new THREE.Mesh(headlightGeo, headlightMat);
  rightHeadlight.position.set(0.6, 0.5, 1.8);
  carGroup.add(rightHeadlight);

  // Glowing Red Taillights
  const taillightMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const leftTaillight = new THREE.Mesh(headlightGeo, taillightMat);
  leftTaillight.position.set(-0.6, 0.5, -1.8);
  carGroup.add(leftTaillight);

  const rightTaillight = new THREE.Mesh(headlightGeo, taillightMat);
  rightTaillight.position.set(0.6, 0.5, -1.8);
  carGroup.add(rightTaillight);

  // 4 Wheels
  const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.3, 16);
  wheelGeo.rotateZ(Math.PI / 2);
  const wheelMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5 });

  const wheelPositions = [
    [-0.95, 0.35, 1.1],
    [0.95, 0.35, 1.1],
    [-0.95, 0.35, -1.1],
    [0.95, 0.35, -1.1]
  ];

  wheelPositions.forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.position.set(...pos);
    carGroup.add(wheel);
  });

  scene.add(carGroup);

  // Smoke Particles
  const particlesCount = 80;
  const particleGeo = new THREE.SphereGeometry(0.12, 8, 8);
  const particleMat = new THREE.MeshBasicMaterial({ color: 0x666666, transparent: true, opacity: 0.4 });
  
  const particles = [];
  for (let i = 0; i < particlesCount; i++) {
    const p = new THREE.Mesh(particleGeo, particleMat);
    p.position.set(0, -100, 0);
    scene.add(p);
    particles.push({ mesh: p, life: 0 });
  }

  let particleIdx = 0;
  let angle = 0;
  const radius = 5.5;

  function animate() {
    requestAnimationFrame(animate);

    // Drifting motion around circular track
    angle += 0.035;
    
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    carGroup.position.set(x, 0, z);

    // Drifting angle steering offset (pitch/yaw for power slide)
    carGroup.rotation.y = -angle + Math.PI / 2 + 0.65; // 0.65 rad drift angle
    carGroup.rotation.z = -0.08; // Lean into drift

    // Spawn Tire Smoke Particles behind rear wheels
    if (Math.random() > 0.3) {
      const p = particles[particleIdx];
      p.mesh.position.set(x + (Math.random() - 0.5) * 0.4, 0.1, z + (Math.random() - 0.5) * 0.4);
      p.mesh.scale.set(1, 1, 1);
      p.life = 1.0;
      particleIdx = (particleIdx + 1) % particlesCount;
    }

    // Update Smoke Particle Physics
    particles.forEach(p => {
      if (p.life > 0) {
        p.life -= 0.03;
        p.mesh.position.y += 0.02;
        p.mesh.scale.addScalar(0.04);
        p.mesh.material.opacity = p.life * 0.3;
        if (p.life <= 0) p.mesh.position.set(0, -100, 0);
      }
    });

    // Camera follow lookAt center
    camera.lookAt(0, 0.8, 0);

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
