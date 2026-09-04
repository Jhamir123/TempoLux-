import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function WatchCatalogViewer({ 
  dialColor = '#00c853',
  isRotating = true,
  cameraZoom = 1,
  nightMode = false 
}) {
  const containerRef = useRef(null);
  const isRotatingRef = useRef(isRotating);
  isRotatingRef.current = isRotating;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 4.8 / cameraZoom);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = nightMode ? 0.9 : 1.4;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(
      nightMode ? 0x1e293b : 0xf8fafc,
      nightMode ? 0.4 : 1.2
    );
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, nightMode ? 1.0 : 3.5);
    keyLight.position.set(5, 5, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, nightMode ? 0.6 : 2.0);
    fillLight.position.set(-5, -2, 3);
    scene.add(fillLight);

    const backRimLight = new THREE.DirectionalLight(
      new THREE.Color(dialColor),
      nightMode ? 4.0 : 2.5
    );
    backRimLight.position.set(0, 4, -4);
    scene.add(backRimLight);

    // 5. Materials
    const steelMaterial = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.95,
      roughness: 0.12,
      envMapIntensity: 2.0
    });

    const dialMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(dialColor),
      metalness: 0.65,
      roughness: 0.28,
      emissive: nightMode ? new THREE.Color(dialColor).multiplyScalar(0.2) : 0x000000
    });

    const luminousMarkerMat = new THREE.MeshStandardMaterial({
      color: nightMode ? 0x22d3ee : 0xffffff,
      emissive: nightMode ? 0x06b6d4 : 0x000000,
      emissiveIntensity: nightMode ? 1.5 : 0,
      roughness: 0.2
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      opacity: 1,
      transparent: true,
      roughness: 0.03,
      ior: 1.55,
      thickness: 0.35
    });

    // 6. Watch Model Group
    const watch = new THREE.Group();

    // Main Case
    const caseGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.26, 64);
    const caseMesh = new THREE.Mesh(caseGeo, steelMaterial);
    caseMesh.rotation.x = Math.PI / 2;
    watch.add(caseMesh);

    // Fluted Bezel
    const bezelGeo = new THREE.TorusGeometry(0.98, 0.09, 20, 64);
    const bezelMesh = new THREE.Mesh(bezelGeo, steelMaterial);
    bezelMesh.position.z = 0.13;
    watch.add(bezelMesh);

    // Inner Rehaut Ring (engraved inner bezel)
    const rehautGeo = new THREE.CylinderGeometry(0.88, 0.88, 0.08, 64, 1, true);
    const rehautMesh = new THREE.Mesh(rehautGeo, steelMaterial);
    rehautMesh.rotation.x = Math.PI / 2;
    rehautMesh.position.z = 0.12;
    watch.add(rehautMesh);

    // Dial Plate
    const dialGeo = new THREE.CircleGeometry(0.87, 64);
    const dialMesh = new THREE.Mesh(dialGeo, dialMaterial);
    dialMesh.position.z = 0.14;
    watch.add(dialMesh);

    // 12 Applied Hour Markers
    const markerGeo = new THREE.BoxGeometry(0.045, 0.16, 0.025);
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      const marker = new THREE.Mesh(markerGeo, luminousMarkerMat);
      marker.position.x = Math.sin(angle) * 0.68;
      marker.position.y = Math.cos(angle) * 0.68;
      marker.position.z = 0.155;
      marker.rotation.z = -angle;
      watch.add(marker);
    }

    // Rolex Crown at 12
    const crown12Geo = new THREE.ConeGeometry(0.09, 0.12, 5);
    const crown12 = new THREE.Mesh(crown12Geo, steelMaterial);
    crown12.position.set(0, 0.58, 0.155);
    crown12.rotation.z = Math.PI;
    watch.add(crown12);

    // Date Window at 3 o'clock
    const dateFrameGeo = new THREE.BoxGeometry(0.18, 0.14, 0.02);
    const dateFrame = new THREE.Mesh(dateFrameGeo, steelMaterial);
    dateFrame.position.set(0.55, 0, 0.155);
    watch.add(dateFrame);

    const datePlateGeo = new THREE.PlaneGeometry(0.14, 0.11);
    const datePlateMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const datePlate = new THREE.Mesh(datePlateGeo, datePlateMat);
    datePlate.position.set(0.55, 0, 0.16);
    watch.add(datePlate);

    // Hands
    const hourHandGeo = new THREE.BoxGeometry(0.045, 0.42, 0.02);
    const hourHand = new THREE.Mesh(hourHandGeo, luminousMarkerMat);
    hourHand.position.set(0, 0.18, 0.17);
    hourHand.rotation.z = -0.9;
    watch.add(hourHand);

    const minuteHandGeo = new THREE.BoxGeometry(0.035, 0.62, 0.02);
    const minuteHand = new THREE.Mesh(minuteHandGeo, luminousMarkerMat);
    minuteHand.position.set(0, 0.28, 0.175);
    minuteHand.rotation.z = 0.8;
    watch.add(minuteHand);

    const secondHandGeo = new THREE.BoxGeometry(0.012, 0.7, 0.01);
    const secondHandMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6
    });
    const secondHand = new THREE.Mesh(secondHandGeo, secondHandMat);
    secondHand.position.set(0, 0.3, 0.18);
    watch.add(secondHand);

    // Sapphire Crystal
    const crystalGeo = new THREE.CylinderGeometry(0.96, 0.96, 0.04, 64);
    const crystalMesh = new THREE.Mesh(crystalGeo, glassMaterial);
    crystalMesh.rotation.x = Math.PI / 2;
    crystalMesh.position.z = 0.19;
    watch.add(crystalMesh);

    // Cyclops Lens
    const cyclopsGeo = new THREE.SphereGeometry(0.14, 20, 20, 0, Math.PI * 2, 0, Math.PI / 2);
    const cyclopsMesh = new THREE.Mesh(cyclopsGeo, glassMaterial);
    cyclopsMesh.position.set(0.55, 0, 0.21);
    cyclopsMesh.rotation.x = Math.PI / 2;
    watch.add(cyclopsMesh);

    // Winding Crown
    const windingCrownGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.18, 32);
    const windingCrown = new THREE.Mesh(windingCrownGeo, steelMaterial);
    windingCrown.rotation.z = Math.PI / 2;
    windingCrown.position.set(1.12, 0, 0);
    watch.add(windingCrown);

    // Multi-link Jubilee Bracelet
    const createBracelet = (isTop) => {
      const sign = isTop ? 1 : -1;
      for (let i = 1; i <= 9; i++) {
        // Center links
        const centerLinkGeo = new THREE.BoxGeometry(0.35, 0.13, 0.09);
        const centerLink = new THREE.Mesh(centerLinkGeo, steelMaterial);
        centerLink.position.set(0, sign * (0.95 + i * 0.13), -i * 0.1);
        centerLink.rotation.x = -sign * i * 0.15;
        watch.add(centerLink);

        // Side links
        const sideLinkGeo = new THREE.BoxGeometry(0.24, 0.13, 0.07);
        const leftLink = new THREE.Mesh(sideLinkGeo, steelMaterial);
        leftLink.position.set(-0.31, sign * (0.95 + i * 0.13), -i * 0.1);
        leftLink.rotation.x = -sign * i * 0.15;
        watch.add(leftLink);

        const rightLink = new THREE.Mesh(sideLinkGeo, steelMaterial);
        rightLink.position.set(0.31, sign * (0.95 + i * 0.13), -i * 0.1);
        rightLink.rotation.x = -sign * i * 0.15;
        watch.add(rightLink);
      }
    };
    createBracelet(true);
    createBracelet(false);

    scene.add(watch);

    // 7. Interactive Drag & Controls
    let isDragging = false;
    let previousMouse = { x: 0, y: 0 };
    let currentRotX = 0;
    let currentRotY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      previousMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMouse.x;
      const deltaY = e.clientY - previousMouse.y;
      currentRotY += deltaX * 0.008;
      currentRotX += deltaY * 0.008;
      previousMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support for mobile
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMouse.x;
      const deltaY = e.touches[0].clientY - previousMouse.y;
      currentRotY += deltaX * 0.008;
      currentRotX += deltaY * 0.008;
      previousMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // 8. Animation Loop
    let reqId;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (isRotatingRef.current && !isDragging) {
        currentRotY += 0.005;
      }

      watch.rotation.y = currentRotY;
      watch.rotation.x = currentRotX;

      // Seconds sweep smoothly
      secondHand.rotation.z = -elapsed * 1.8;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.position.set(0, 0.2, 4.8 / cameraZoom);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [dialColor, cameraZoom, nightMode]);

  return (
    <div 
      ref={containerRef} 
      className="watch-catalog-3d-canvas"
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        cursor: 'grab'
      }}
      title="Arrastra en 360° para inspeccionar cada ángulo"
    />
  );
}

