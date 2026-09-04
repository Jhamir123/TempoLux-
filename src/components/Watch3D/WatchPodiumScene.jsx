import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function WatchPodiumScene({ dialColor = '#00c853', onWatchClick }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070b12, 0.035);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Lighting (Dramatic cinematic studio setup matching reference image)
    const ambientLight = new THREE.AmbientLight(0x90b0d9, 0.8);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xdbeafe, 3.2);
    mainKeyLight.position.set(4, 6, 4);
    mainKeyLight.castShadow = true;
    mainKeyLight.shadow.mapSize.width = 1024;
    mainKeyLight.shadow.mapSize.height = 1024;
    mainKeyLight.shadow.bias = -0.001;
    scene.add(mainKeyLight);

    // Blue rim light (like the blue glow in reference image)
    const blueRimLight = new THREE.DirectionalLight(0x38bdf8, 4.0);
    blueRimLight.position.set(-4, 3, -3);
    scene.add(blueRimLight);

    // Bottom accent point light
    const accentPointLight = new THREE.PointLight(dialColor, 3.5, 8);
    accentPointLight.position.set(0, -0.2, 1.5);
    scene.add(accentPointLight);

    // 5. Materials
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.15,
      envMapIntensity: 1.5
    });

    const polishedGoldMaterial = new THREE.MeshStandardMaterial({
      color: 0xf6d365,
      metalness: 0.9,
      roughness: 0.2
    });

    const dialMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(dialColor),
      metalness: 0.6,
      roughness: 0.3
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 1.52,
      thickness: 0.3
    });

    const blueRingMaterial = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.3
    });

    const stoneMaterial = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.1,
      roughness: 0.8
    });

    // 6. Build the Architectural Podium (Circular stone base from reference image)
    const podiumGroup = new THREE.Group();
    podiumGroup.position.set(0.1, -1.0, 0);

    // Lower wide podium cylinder
    const baseCylinderGeo = new THREE.CylinderGeometry(1.65, 1.75, 0.35, 48);
    const baseCylinder = new THREE.Mesh(baseCylinderGeo, stoneMaterial);
    baseCylinder.receiveShadow = true;
    podiumGroup.add(baseCylinder);

    // Upper polished top tier
    const topTierGeo = new THREE.CylinderGeometry(1.4, 1.45, 0.25, 48);
    const topTierMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.3,
      roughness: 0.6
    });
    const topTier = new THREE.Mesh(topTierGeo, topTierMat);
    topTier.position.y = 0.28;
    topTier.receiveShadow = true;
    podiumGroup.add(topTier);

    // Luminous trim ring on podium
    const trimRingGeo = new THREE.TorusGeometry(1.42, 0.02, 16, 48);
    const trimRingMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.2
    });
    const trimRing = new THREE.Mesh(trimRingGeo, trimRingMat);
    trimRing.rotation.x = Math.PI / 2;
    trimRing.position.y = 0.41;
    podiumGroup.add(trimRing);

    scene.add(podiumGroup);

    // 7. Build the Floating Luxury Elements (Floating Blue Torus & Crystal Spheres from reference)
    const floatingGroup = new THREE.Group();

    // Large floating metallic blue halo ring (like the main ring in reference image)
    const largeRingGeo = new THREE.TorusGeometry(1.05, 0.16, 32, 64);
    const largeRing = new THREE.Mesh(largeRingGeo, blueRingMaterial);
    largeRing.position.set(0.4, 0.7, -0.6);
    largeRing.rotation.set(Math.PI / 3, 0.4, 0.2);
    floatingGroup.add(largeRing);

    // Floating translucent crystal sphere
    const crystalSphereGeo = new THREE.SphereGeometry(0.38, 32, 32);
    const crystalSphere = new THREE.Mesh(crystalSphereGeo, glassMaterial);
    crystalSphere.position.set(-1.1, 0.5, 0.2);
    floatingGroup.add(crystalSphere);

    // Small floating glass droplet
    const smallDropletGeo = new THREE.SphereGeometry(0.18, 24, 24);
    const smallDroplet = new THREE.Mesh(smallDropletGeo, glassMaterial);
    smallDroplet.position.set(-0.6, 1.1, -0.3);
    floatingGroup.add(smallDroplet);

    // Floating geometric icosahedron crystal (bottom right in reference)
    const icoGeo = new THREE.IcosahedronGeometry(0.35, 0);
    const icoMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transmission: 0.85,
      roughness: 0.1,
      metalness: 0.1,
      ior: 1.6
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    icoMesh.position.set(1.4, -0.3, 0.5);
    floatingGroup.add(icoMesh);

    // Floating metallic cube (top right in reference)
    const cubeGeo = new THREE.BoxGeometry(0.24, 0.24, 0.24);
    const cubeMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.9,
      roughness: 0.2
    });
    const cubeMesh = new THREE.Mesh(cubeGeo, cubeMat);
    cubeMesh.position.set(1.3, 1.2, -0.4);
    cubeMesh.rotation.set(0.6, 0.4, 0.8);
    floatingGroup.add(cubeMesh);

    scene.add(floatingGroup);

    // 8. Build the Procedural 3D Luxury Watch
    const watchGroup = new THREE.Group();
    watchGroup.position.set(-0.1, 0.15, 0.2);
    watchGroup.rotation.y = -0.35;
    watchGroup.scale.set(0.95, 0.95, 0.95);

    // Watch Case (Main steel case body)
    const caseGeo = new THREE.CylinderGeometry(0.88, 0.88, 0.22, 48);
    const caseMesh = new THREE.Mesh(caseGeo, metalMaterial);
    caseMesh.rotation.x = Math.PI / 2;
    caseMesh.castShadow = true;
    watchGroup.add(caseMesh);

    // Fluted Bezel (Rolex signature ribbed bezel)
    const bezelGroup = new THREE.Group();
    bezelGroup.position.z = 0.11;

    const bezelBaseGeo = new THREE.TorusGeometry(0.86, 0.06, 16, 60);
    const bezelBase = new THREE.Mesh(bezelBaseGeo, metalMaterial);
    bezelGroup.add(bezelBase);

    const fluteCount = 30;
    const fluteGeo = new THREE.BoxGeometry(0.028, 0.04, 0.055);
    for (let i = 0; i < fluteCount; i++) {
      const angle = (i / fluteCount) * Math.PI * 2;
      const flute = new THREE.Mesh(fluteGeo, metalMaterial);
      flute.position.x = Math.cos(angle) * 0.86;
      flute.position.y = Math.sin(angle) * 0.86;
      flute.rotation.z = angle;
      flute.castShadow = true;
      bezelGroup.add(flute);
    }

    watchGroup.add(bezelGroup);

    // Dial Face
    const dialGeo = new THREE.CircleGeometry(0.76, 48);
    const dialMesh = new THREE.Mesh(dialGeo, dialMaterial);
    dialMesh.position.z = 0.12;
    watchGroup.add(dialMesh);

    // Dial Hour Markers (Applied baton indices)
    const markerGeo = new THREE.BoxGeometry(0.04, 0.14, 0.02);
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      const marker = new THREE.Mesh(markerGeo, metalMaterial);
      marker.position.x = Math.sin(angle) * 0.58;
      marker.position.y = Math.cos(angle) * 0.58;
      marker.position.z = 0.13;
      marker.rotation.z = -angle;
      watchGroup.add(marker);
    }

    // Rolex Crown Emblem at 12 o'clock
    const crownEmblemGeo = new THREE.ConeGeometry(0.08, 0.1, 5);
    const crownEmblem = new THREE.Mesh(crownEmblemGeo, metalMaterial);
    crownEmblem.position.set(0, 0.48, 0.13);
    crownEmblem.rotation.z = Math.PI;
    watchGroup.add(crownEmblem);

    // Watch Hands (Hour, Minute, Seconds)
    const hourHandGeo = new THREE.BoxGeometry(0.04, 0.35, 0.015);
    const hourHand = new THREE.Mesh(hourHandGeo, metalMaterial);
    hourHand.position.set(0, 0.14, 0.14);
    hourHand.rotation.z = -0.8;
    watchGroup.add(hourHand);

    const minuteHandGeo = new THREE.BoxGeometry(0.03, 0.52, 0.015);
    const minuteHand = new THREE.Mesh(minuteHandGeo, metalMaterial);
    minuteHand.position.set(0, 0.22, 0.145);
    minuteHand.rotation.z = 0.6;
    watchGroup.add(minuteHand);

    const secondHandGeo = new THREE.BoxGeometry(0.01, 0.58, 0.01);
    const secondHandMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.5
    });
    const secondHand = new THREE.Mesh(secondHandGeo, secondHandMat);
    secondHand.position.set(0, 0.24, 0.15);
    secondHand.rotation.z = 2.1;
    watchGroup.add(secondHand);

    // Sapphire Crystal with Cyclops Magnifier lens at 3 o'clock
    const crystalGeo = new THREE.CylinderGeometry(0.84, 0.84, 0.04, 48);
    const crystalMesh = new THREE.Mesh(crystalGeo, glassMaterial);
    crystalMesh.rotation.x = Math.PI / 2;
    crystalMesh.position.z = 0.15;
    watchGroup.add(crystalMesh);

    // Cyclops Lens
    const cyclopsGeo = new THREE.SphereGeometry(0.12, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const cyclopsMesh = new THREE.Mesh(cyclopsGeo, glassMaterial);
    cyclopsMesh.position.set(0.48, 0, 0.17);
    cyclopsMesh.rotation.x = Math.PI / 2;
    watchGroup.add(cyclopsMesh);

    // Watch Crown (Adjustment knob on side)
    const crownGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.15, 24);
    const crownMesh = new THREE.Mesh(crownGeo, metalMaterial);
    crownMesh.rotation.z = Math.PI / 2;
    crownMesh.position.set(0.98, 0, 0);
    watchGroup.add(crownMesh);

    // Bracelet / Strap links
    const linkCount = 7;
    for (let i = 1; i <= linkCount; i++) {
      // Top links
      const topLinkGeo = new THREE.BoxGeometry(0.72 - i * 0.03, 0.14, 0.08);
      const topLink = new THREE.Mesh(topLinkGeo, metalMaterial);
      topLink.position.set(0, 0.85 + i * 0.12, -i * 0.08);
      topLink.rotation.x = -i * 0.18;
      topLink.castShadow = true;
      watchGroup.add(topLink);

      // Bottom links
      const botLinkGeo = new THREE.BoxGeometry(0.72 - i * 0.03, 0.14, 0.08);
      const botLink = new THREE.Mesh(botLinkGeo, metalMaterial);
      botLink.position.set(0, -0.85 - i * 0.12, -i * 0.08);
      botLink.rotation.x = i * 0.18;
      botLink.castShadow = true;
      watchGroup.add(botLink);
    }

    scene.add(watchGroup);

    // 9. Mouse interaction & smooth parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationY = -0.35;
    let targetRotationX = 0;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;
        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.008;
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 10. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth watch rotation
      if (!isDragging) {
        targetRotationY = -0.35 + Math.sin(elapsedTime * 0.5) * 0.15 + mouseX * 0.3;
        targetRotationX = mouseY * 0.2;
      }

      watchGroup.rotation.y += (targetRotationY - watchGroup.rotation.y) * 0.05;
      watchGroup.rotation.x += (targetRotationX - watchGroup.rotation.x) * 0.05;
      watchGroup.position.y = 0.15 + Math.sin(elapsedTime * 1.2) * 0.04;

      // Floating items subtle animation
      largeRing.rotation.z = elapsedTime * 0.2;
      largeRing.position.y = 0.7 + Math.sin(elapsedTime * 0.8) * 0.06;

      crystalSphere.position.y = 0.5 + Math.sin(elapsedTime + 1) * 0.08;
      crystalSphere.rotation.y = elapsedTime * 0.15;

      smallDroplet.position.y = 1.1 + Math.sin(elapsedTime * 1.5 + 2) * 0.05;

      icoMesh.rotation.x = elapsedTime * 0.4;
      icoMesh.rotation.y = elapsedTime * 0.3;
      icoMesh.position.y = -0.3 + Math.sin(elapsedTime * 1.1 + 3) * 0.04;

      cubeMesh.rotation.x = elapsedTime * 0.5;
      cubeMesh.rotation.y = elapsedTime * 0.6;
      cubeMesh.position.y = 1.2 + Math.sin(elapsedTime * 0.9 + 1.5) * 0.05;

      // Watch hands based on actual time
      const now = new Date();
      const secs = now.getSeconds() + now.getMilliseconds() / 1000;
      const mins = now.getMinutes() + secs / 60;
      const hrs = (now.getHours() % 12) + mins / 60;

      hourHand.rotation.z = -(hrs / 12) * Math.PI * 2;
      minuteHand.rotation.z = -(mins / 60) * Math.PI * 2;
      secondHand.rotation.z = -(secs / 60) * Math.PI * 2;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [dialColor]);

  return (
    <div
      ref={containerRef}
      className="watch-podium-scene-canvas"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        cursor: 'grab'
      }}
      title="Arrastra para rotar la escena 3D"
    />
  );
}
