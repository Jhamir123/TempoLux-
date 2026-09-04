import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

/**
 * Hook personalizado para manejar la escena Three.js con carga de modelos .glb (Rolex Datejust)
 */
export function useThreeJS(modelUrl = `${import.meta.env.BASE_URL}rolex_datejust.glb`, options = {}) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const modelRef = useRef(null);
  const frameRef = useRef(null);
  const tabloMaterialsRef = useRef([]);
  const fillLightRef = useRef(null);
  const bottomLightRef = useRef(null);
  const handsRef = useRef({ hour: null, minute: null, second: null });

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isRotating, setIsRotating] = useState(true);
  const isRotatingRef = useRef(true);

  const {
    rotationSpeed = 0.004,
    cameraPosition = [0, 0, 4.2],
    autoRotate = false,
    dialColor = null,
    accentColorHex = '#00C853',
  } = options;

  const dialColorRef = useRef(dialColor);
  dialColorRef.current = dialColor;
  const accentColorRef = useRef(accentColorHex);
  accentColorRef.current = accentColorHex;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensiones
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    // 1. Escena
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Cámara
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 5000);
    camera.position.set(...cameraPosition);
    cameraRef.current = camera;

    // 3. Renderizador
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 4. Controles orbitales
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.minDistance = 2.2;
    controls.maxDistance = 6.5;
    controls.maxPolarAngle = Math.PI / 2 + 0.3;
    controls.minPolarAngle = 0.35;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.5;
    controlsRef.current = controls;

    // 5. Iluminación de estudio y ambiente de reflejos
    setupStudioEnvironment(scene, renderer);
    const { fillLight, bottomLight } = setupLighting(scene, accentColorRef.current);
    fillLightRef.current = fillLight;
    bottomLightRef.current = bottomLight;

    // 6. Cargar modelo .GLB
    const loader = new GLTFLoader();
    setIsLoading(true);
    setLoadError(null);
    tabloMaterialsRef.current = [];

    loader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;
        
        // Crear un grupo pivote para que rote sobre su propio eje
        const pivotGroup = new THREE.Group();
        pivotGroup.add(model);
        scene.add(pivotGroup);
        modelRef.current = pivotGroup;

        // Encontrar el tamaño y centro real del modelo
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        // Centrar el modelo dentro del grupo pivote
        model.position.x = -center.x;
        model.position.y = -center.y;
        model.position.z = -center.z;

        // Ajustar la cámara dinámicamente para encuadrar el grupo pivote
        const fov = cameraRef.current.fov * (Math.PI / 180);
        // Usar Math.sin en lugar de Math.tan para encuadrar correctamente una esfera delimitadora (evita que los bordes acerquen demasiado a la cámara y se recorten por perspectiva)
        let cameraZ = Math.abs((maxDim / 2) / Math.sin(fov / 2));
        
        // Si el contenedor es estrecho (aspect < 1), alejar la cámara para que encaje a lo ancho
        if (cameraRef.current.aspect < 1) {
          cameraZ /= cameraRef.current.aspect;
        }
        
        cameraZ *= 1.4; // Margen adicional

        // Ajustar planos de recorte para evitar que se corte si es muy pequeño o grande
        cameraRef.current.near = maxDim * 0.01;
        cameraRef.current.far = maxDim * 100;
        cameraRef.current.updateProjectionMatrix();

        cameraRef.current.position.set(0, 0, cameraZ); // Directamente al frente
        if (controlsRef.current) {
          controlsRef.current.target.set(0, 0, 0); // Mirar exactamente al centro
          controlsRef.current.minDistance = cameraZ * 0.3;
          controlsRef.current.maxDistance = cameraZ * 3.0;
          controlsRef.current.enablePan = false; // Bloquear paneo para que siempre esté centrado
          controlsRef.current.update();
          controlsRef.current.saveState(); // Guardar este estado perfecto para el botón Restablecer
        }

        // Guardar estado inicial en el grupo pivote
        pivotGroup.userData.initialPosition = pivotGroup.position.clone();
        pivotGroup.userData.initialRotation = pivotGroup.rotation.clone();
        if (cameraRef.current) {
          cameraRef.current.userData.initialPosition = cameraRef.current.position.clone();
        }

        // Configurar materiales y sombras para el GLB real
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            if (child.material) {
              const mat = child.material;
              const matName = (mat.name || '').toLowerCase();
              
              // 1. Esfera / Dial base (ÚNICAMENTE 'tablo_rolex', sin alterar las letras o logotipos)
              if (mat.name === 'tablo_rolex') {
                if (!mat.userData.originalColor) {
                  mat.userData.originalColor = mat.color.clone();
                }
                if (dialColorRef.current) {
                  mat.color.set(dialColorRef.current);
                } else {
                  mat.color.copy(mat.userData.originalColor);
                }
                mat.roughness = 0.35;
                mat.metalness = 0.25;
                tabloMaterialsRef.current.push(mat);
              }

              // 2. Textos, coronas y calcomanías sobre el dial ('tablo_rolex.001', 'monday', '28')
              // Se mantienen blancos puros y brillantes
              if (matName.includes('tablo_rolex.001') || matName.includes('monday') || matName.includes('28') || matName.includes('logo')) {
                mat.transparent = true;
                if (mat.color) mat.color.set('#ffffff');
              }

              // 3. Metales y acero plateado (caja, brazalete Jubilee, corona, etc.)
              if (matName.includes('silver') || matName.includes('metal')) {
                mat.metalness = 0.95;
                mat.roughness = matName.includes('brush') ? 0.24 : 0.12;
                mat.envMapIntensity = 1.25;
              }

              // 4. Cristal de zafiro
              if (matName.includes('glass')) {
                mat.transparent = true;
                mat.opacity = 0.22;
                mat.roughness = 0.04;
                mat.metalness = 0.1;
                mat.envMapIntensity = 1.3;
              }
              
              mat.needsUpdate = true;
            }
          }
        });

        // Buscar las agujas del reloj en el modelo .glb
        const matchedHands = { hour: null, minute: null, second: null };
        model.traverse((child) => {
          const name = (child.name || '').toLowerCase();
          
          if (name.includes('arrow_small')) {
            matchedHands.hour = child;
          } else if (name.includes('arrow_medium')) {
            matchedHands.minute = child;
          } else if (name.includes('arrow_big')) {
            matchedHands.second = child;
          }
          // Nombres en inglés / genéricos como respaldo
          if (!matchedHands.hour && (name.includes('hour') || name.includes('h_hand') || name.includes('hourhand') || name.includes('hora'))) {
            matchedHands.hour = child;
          } else if (!matchedHands.minute && (name.includes('minute') || name.includes('m_hand') || name.includes('minutehand') || name.includes('min_hand') || name.includes('minuto'))) {
            matchedHands.minute = child;
          } else if (!matchedHands.second && (name.includes('second') || name.includes('s_hand') || name.includes('secondhand') || name.includes('sec_hand') || name.includes('segundo'))) {
            matchedHands.second = child;
          }
        });

        // Guardar cuaternión inicial para rotar correctamente en el eje Y
        if (matchedHands.hour) matchedHands.hour.userData.initQ = matchedHands.hour.quaternion.clone();
        if (matchedHands.minute) matchedHands.minute.userData.initQ = matchedHands.minute.quaternion.clone();
        if (matchedHands.second) matchedHands.second.userData.initQ = matchedHands.second.quaternion.clone();

        handsRef.current = { hour: matchedHands.hour || null, minute: matchedHands.minute || null, second: matchedHands.second || null };

        // Si no se encontraron por nombre, buscar meshes delgados como agujas
        if (!handsRef.current.hour && !handsRef.current.minute && !handsRef.current.second) {
          const candidates = [];
          model.traverse((child) => {
            if (child.isMesh && child.geometry) {
              const geo = child.geometry;
              if (geo.attributes.position) {
                const positions = geo.attributes.position;
                let minX = Infinity, maxX = -Infinity;
                let minY = Infinity, maxY = -Infinity;
                let minZ = Infinity, maxZ = -Infinity;
                for (let i = 0; i < positions.count; i++) {
                  const x = positions.getX(i);
                  const y = positions.getY(i);
                  const z = positions.getZ(i);
                  if (x < minX) minX = x;
                  if (x > maxX) maxX = x;
                  if (y < minY) minY = y;
                  if (y > maxY) maxY = y;
                  if (z < minZ) minZ = z;
                  if (z > maxZ) maxZ = z;
                }
                const sx = maxX - minX;
                const sy = maxY - minY;
                const sz = maxZ - minZ;
                const len = Math.max(sx, sy, sz);
                const width = Math.min(sx, sy, sz);
                if (len > 0.15 && width < 0.04 && len / Math.max(width, 0.001) > 4) {
                  candidates.push({ mesh: child, length: len, center: { x: (minX+maxX)/2, y: (minY+maxY)/2 } });
                }
              }
            }
          });
          candidates.sort((a, b) => b.length - a.length);
          if (candidates.length >= 3) {
            handsRef.current.hour = candidates[2].mesh;
            handsRef.current.minute = candidates[1].mesh;
            handsRef.current.second = candidates[0].mesh;
          } else if (candidates.length === 2) {
            handsRef.current.hour = candidates[1].mesh;
            handsRef.current.minute = candidates[0].mesh;
          } else if (candidates.length === 1) {
            handsRef.current.second = candidates[0].mesh;
          }
        }

        // El modelo ya fue agregado a la escena dentro de pivotGroup al inicio
        setIsLoading(false);
      },
      undefined,
      (xhr) => {
        // Progreso de carga
      },
      (error) => {
        console.warn('Error cargando modelo GLB, usando visualizador procedural:', error);
        setLoadError('Modelo no encontrado. Se activa visualizador procedural.');
        const placeholder = createProceduralWatch(dialColorRef.current || '#00C853');
        modelRef.current = placeholder;
        handsRef.current = placeholder.userData.hands || { hour: null, minute: null, second: null };
        scene.add(placeholder);
        setIsLoading(false);
      }
    );

    // 7. Bucle de animación
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      // Rotación suave del modelo si está activo
      if (modelRef.current && isRotatingRef.current) {
        modelRef.current.rotation.y += rotationSpeed;
      }

      // Animar agujas del reloj según la hora actual
      const now = new Date();
      const secs = now.getSeconds() + now.getMilliseconds() / 1000;
      const mins = now.getMinutes() + secs / 60;
      const hrs = (now.getHours() % 12) + mins / 60;

      const hands = handsRef.current;
      if (hands) {
        // Usamos el eje Y local porque GLTFLoader mapea el eje Z de Blender (arriba) al eje Y de Three.js
        const axis = new THREE.Vector3(0, 1, 0);
        
        if (hands.hour && hands.hour.userData.initQ) {
          const q = new THREE.Quaternion().setFromAxisAngle(axis, -(hrs / 12) * Math.PI * 2);
          hands.hour.quaternion.copy(hands.hour.userData.initQ).multiply(q);
        }
        if (hands.minute && hands.minute.userData.initQ) {
          const q = new THREE.Quaternion().setFromAxisAngle(axis, -(mins / 60) * Math.PI * 2);
          hands.minute.quaternion.copy(hands.minute.userData.initQ).multiply(q);
        }
        if (hands.second && hands.second.userData.initQ) {
          const q = new THREE.Quaternion().setFromAxisAngle(axis, -(secs / 60) * Math.PI * 2);
          hands.second.quaternion.copy(hands.second.userData.initQ).multiply(q);
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize observer para detectar cambios reales en el contenedor
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (!rendererRef.current || !cameraRef.current) return;
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0) {
          cameraRef.current.aspect = w / h;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(w, h, false);
        }
      }
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelUrl]);

  // Actualizar color del dial reactivamente al cambiar de producto/color
  useEffect(() => {
    if (tabloMaterialsRef.current.length === 0) return;
    tabloMaterialsRef.current.forEach((mat) => {
      if (dialColor) {
        mat.color.set(dialColor);
      } else if (mat.userData.originalColor) {
        mat.color.copy(mat.userData.originalColor);
      }
      mat.needsUpdate = true;
    });
  }, [dialColor]);

  // Actualizar color de la iluminación temática reactivamente
  useEffect(() => {
    if (!accentColorHex) return;
    if (fillLightRef.current) {
      fillLightRef.current.color.set(accentColorHex);
    }
    if (bottomLightRef.current) {
      bottomLightRef.current.color.set(accentColorHex);
    }
  }, [accentColorHex]);

  // Funciones de control
  const toggleRotation = useCallback(() => {
    setIsRotating((prev) => {
      const next = !prev;
      isRotatingRef.current = next;
      return next;
    });
  }, []);

  const resetPosition = useCallback(() => {
    if (modelRef.current) {
      modelRef.current.rotation.set(0, 0, 0);
    }
    if (controlsRef.current && cameraRef.current) {
      controlsRef.current.reset();
      if (cameraRef.current.userData.initialPosition) {
        cameraRef.current.position.copy(cameraRef.current.userData.initialPosition);
      }
    }
  }, []);

  const spinModel = useCallback((direction = 1) => {
    if (!modelRef.current) return;
    const model = modelRef.current;
    const startY = model.rotation.y;
    const targetY = startY + Math.PI * 2 * direction;
    const duration = 800;
    const startTime = Date.now();

    const spin = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      model.rotation.y = startY + (targetY - startY) * ease;

      if (progress < 1) {
        requestAnimationFrame(spin);
      }
    };
    spin();
  }, []);

  return {
    containerRef,
    isLoading,
    loadError,
    isRotating,
    toggleRotation,
    resetPosition,
    spinModel,
    modelRef,
  };
}

// Generar mapa de reflejos HDRI de estudio de lujo para el GLB (acero plateado brillante con alto contraste)
function setupStudioEnvironment(scene, renderer) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  const envCanvas = document.createElement('canvas');
  envCanvas.width = 1024;
  envCanvas.height = 512;
  const ctx = envCanvas.getContext('2d');

  // Fondo de estudio oscuro para dar profundidad y contraste al acero plateado
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
  bgGrad.addColorStop(0, '#111827');
  bgGrad.addColorStop(0.35, '#0b0f19');
  bgGrad.addColorStop(0.7, '#060910');
  bgGrad.addColorStop(1, '#020408');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Softboxes brillantes de estudio para reflejos nítidos y plateados en el bisel y brazalete Jubilee
  // 1. Reflejo superior (resalta el bisel estriado y cristal)
  drawSoftbox(ctx, 512, 45, 600, 80, 'rgba(255, 255, 255, 1.0)');
  // 2. Tira vertical izquierda (reflejo alargado en los eslabones)
  drawSoftbox(ctx, 160, 220, 180, 260, 'rgba(240, 248, 255, 0.95)');
  // 3. Tira vertical derecha (reflejo en la corona y eslabones derechos)
  drawSoftbox(ctx, 860, 220, 180, 260, 'rgba(240, 248, 255, 0.95)');
  // 4. Luz frontal difusa (ilumina dial y manecillas sin quemar)
  drawSoftbox(ctx, 512, 250, 340, 180, 'rgba(255, 255, 255, 0.75)');
  // 5. Luz suave inferior de rebote
  drawSoftbox(ctx, 512, 465, 480, 70, 'rgba(180, 200, 220, 0.35)');

  const envTexture = new THREE.CanvasTexture(envCanvas);
  envTexture.mapping = THREE.EquirectangularReflectionMapping;
  const envMap = pmrem.fromEquirectangular(envTexture).texture;
  scene.environment = envMap;
  pmrem.dispose();
}

function drawSoftbox(ctx, x, y, w, h, color) {
  const radGrad = ctx.createRadialGradient(x, y, 5, x, y, w / 2);
  radGrad.addColorStop(0, color);
  radGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = radGrad;
  ctx.beginPath();
  ctx.ellipse(x, y, w / 2, h / 2, 0, 0, Math.PI * 2);
  ctx.fill();
}

// Configurar iluminación neutra y realista para el GLB
function setupLighting(scene) {
  // Luz ambiental suave para no aplanar los relieves del bisel
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
  scene.add(ambientLight);

  // Luz principal (Key Light) desde arriba a la derecha
  const mainLight = new THREE.DirectionalLight(0xffffff, 1.6);
  mainLight.position.set(4, 5, 4);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 1024;
  mainLight.shadow.mapSize.height = 1024;
  scene.add(mainLight);

  // Luz de relleno lateral izquierda (Fill Light)
  const rimLight = new THREE.DirectionalLight(0xffffff, 0.9);
  rimLight.position.set(-4, 3, -3);
  scene.add(rimLight);

  // Luz trasera sutil para separar el reloj del fondo oscuro
  const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
  backLight.position.set(0, -3, -4);
  scene.add(backLight);

  return { fillLight: null, bottomLight: null };
}

// Procedural Watch fallback
function createProceduralWatch(dialHex = '#00C853') {
  const group = new THREE.Group();

  const steelMat = new THREE.MeshStandardMaterial({
    roughness: 0.12,
    envMapIntensity: 2.0
  });
  const dialMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(dialHex),
    metalness: 0.65,
    roughness: 0.28
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.92,
    transparent: true,
    roughness: 0.03,
    ior: 1.55,
    thickness: 0.35
  });

  // Case
  const caseGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.26, 64);
  const caseMesh = new THREE.Mesh(caseGeo, steelMat);
  caseMesh.rotation.x = Math.PI / 2;
  group.add(caseMesh);
  // Bezel (fluted - acanalado)
  const bezelGeo = new THREE.TorusGeometry(0.98, 0.05, 20, 64);
  const bezelMesh = new THREE.Mesh(bezelGeo, steelMat);
  bezelMesh.position.z = 0.13;
  group.add(bezelMesh);

  const fluteCount = 36;
  const fluteGeo = new THREE.BoxGeometry(0.03, 0.05, 0.07);
  for (let i = 0; i < fluteCount; i++) {
    const angle = (i / fluteCount) * Math.PI * 2;
    const flute = new THREE.Mesh(fluteGeo, steelMat);
    flute.position.x = Math.cos(angle) * 0.98;
    flute.position.y = Math.sin(angle) * 0.98;
    flute.rotation.z = angle;
    flute.position.z = 0.13;
    group.add(flute);
  }

  // Dial
  const dialGeo = new THREE.CircleGeometry(0.87, 64);
  const dialMesh = new THREE.Mesh(dialGeo, dialMat);
  dialMesh.position.z = 0.14;
  group.add(dialMesh);

  // Markers
  const markerGeo = new THREE.BoxGeometry(0.045, 0.16, 0.025);
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6;
    const marker = new THREE.Mesh(markerGeo, steelMat);
    marker.position.x = Math.sin(angle) * 0.68;
    marker.position.y = Math.cos(angle) * 0.68;
    marker.position.z = 0.155;
    marker.rotation.z = -angle;
    group.add(marker);
  }

  // Hands
  const hourHandGeo = new THREE.BoxGeometry(0.045, 0.42, 0.02);
  const hourHand = new THREE.Mesh(hourHandGeo, steelMat);
  hourHand.position.set(0, 0.18, 0.17);
  hourHand.rotation.z = -0.9;
  group.add(hourHand);

  const minHandGeo = new THREE.BoxGeometry(0.035, 0.62, 0.02);
  const minHand = new THREE.Mesh(minHandGeo, steelMat);
  minHand.position.set(0, 0.28, 0.175);
  minHand.rotation.z = 0.8;
  group.add(minHand);

  const secondHandGeo = new THREE.BoxGeometry(0.012, 0.7, 0.01);
  const secondHandMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.5
  });
  const secondHand = new THREE.Mesh(secondHandGeo, secondHandMat);
  secondHand.position.set(0, 0.3, 0.18);
  group.add(secondHand);

  group.userData.hands = { hour: hourHand, minute: minHand, second: secondHand };

  // Crystal
  const crystalGeo = new THREE.CylinderGeometry(0.96, 0.96, 0.04, 64);
  const crystalMesh = new THREE.Mesh(crystalGeo, glassMat);
  crystalMesh.rotation.x = Math.PI / 2;
  crystalMesh.position.z = 0.19;
  group.add(crystalMesh);

  // Bracelet
  for (let sign of [1, -1]) {
    for (let i = 1; i <= 8; i++) {
      const linkGeo = new THREE.BoxGeometry(0.72 - i * 0.03, 0.13, 0.08);
      const link = new THREE.Mesh(linkGeo, steelMat);
      link.position.set(0, sign * (0.95 + i * 0.13), -i * 0.1);
      link.rotation.x = -sign * i * 0.15;
      group.add(link);
    }
  }

  return group;
}

