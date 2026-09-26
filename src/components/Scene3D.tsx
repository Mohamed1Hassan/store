"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export type ProductMode = "mattress" | "curtains" | "pillows" | "room";

interface Scene3DProps {
  currentMode?: ProductMode;
  isRotating?: boolean;
}

export default function Scene3D({
  currentMode = "room",
  isRotating = true,
}: Scene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090e, 0.035);

    // --- Camera Setup ---
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 2.8, 6.8);

    // --- Renderer Setup ---
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // --- Elegant Lighting ---
    const ambientLight = new THREE.AmbientLight(0xfcf8ee, 1.1);
    scene.add(ambientLight);

    const warmKeyLight = new THREE.DirectionalLight(0xffecd2, 2.4);
    warmKeyLight.position.set(4, 7, 5);
    warmKeyLight.castShadow = true;
    warmKeyLight.shadow.mapSize.width = 1024;
    warmKeyLight.shadow.mapSize.height = 1024;
    warmKeyLight.shadow.bias = -0.0005;
    scene.add(warmKeyLight);

    const softFillLight = new THREE.DirectionalLight(0x90b0e0, 1.0);
    softFillLight.position.set(-5, 4, -3);
    scene.add(softFillLight);

    const goldHaloLight = new THREE.PointLight(0xd4af37, 2.0, 9);
    goldHaloLight.position.set(0, 0.6, 0);
    scene.add(goldHaloLight);

    // Master Group (Rotates gently)
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // Shared Luxury Gold Material
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.9,
      emissive: 0xaa7c11,
      emissiveIntensity: 0.15,
    });

    // Dark Marble / Wood Material for Base
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0c0f17,
      roughness: 0.4,
      metalness: 0.3,
    });

    // Base Podium
    const baseCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(3.6, 3.8, 0.2, 64),
      baseMat
    );
    baseCylinder.position.y = -0.1;
    baseCylinder.receiveShadow = true;
    masterGroup.add(baseCylinder);

    // Gold Trim Ring Around Podium
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(3.62, 0.025, 16, 80),
      goldMat
    );
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = 0.01;
    masterGroup.add(ring1);

    // Subtle Outer Orbit Ring
    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(4.1, 0.012, 16, 80),
      goldMat
    );
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = -0.05;
    masterGroup.add(ring2);

    // Bed Model Group
    const bedGroup = new THREE.Group();
    masterGroup.add(bedGroup);

    // Bed Frame
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x121622,
      roughness: 0.7,
      metalness: 0.2,
    });
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.35, 3.4),
      frameMat
    );
    frame.position.set(0, 0.18, 0);
    frame.castShadow = true;
    frame.receiveShadow = true;
    bedGroup.add(frame);

    // Gold Bed Legs
    const legGeom = new THREE.CylinderGeometry(0.045, 0.03, 0.25, 16);
    [[-1.2, 0.07, -1.55], [1.2, 0.07, -1.55], [-1.2, 0.07, 1.55], [1.2, 0.07, 1.55]].forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeom, goldMat);
      leg.position.set(x, y, z);
      bedGroup.add(leg);
    });

    // Elegant Headboard
    const headboard = new THREE.Mesh(
      new THREE.BoxGeometry(2.9, 1.8, 0.25),
      new THREE.MeshStandardMaterial({
        color: 0x161c2b,
        roughness: 0.6,
        metalness: 0.15,
      })
    );
    headboard.position.set(0, 1.05, -1.7);
    headboard.castShadow = true;
    bedGroup.add(headboard);

    // Headboard Gold Crown Trim
    const crown = new THREE.Mesh(
      new THREE.BoxGeometry(2.94, 0.06, 0.28),
      goldMat
    );
    crown.position.set(0, 1.96, -1.7);
    crown.castShadow = true;
    bedGroup.add(crown);

    // Headboard Velvet Tufting Panels
    const tuftCount = 5;
    const tWidth = 2.7 / tuftCount;
    for (let i = 0; i < tuftCount; i++) {
      const xOff = -1.35 + tWidth / 2 + i * tWidth;
      const panel = new THREE.Mesh(
        new THREE.CylinderGeometry(tWidth * 0.44, tWidth * 0.44, 1.55, 20),
        new THREE.MeshStandardMaterial({
          color: 0x1a2133,
          roughness: 0.8,
          metalness: 0.05,
        })
      );
      panel.position.set(xOff, 1.05, -1.58);
      panel.castShadow = true;
      bedGroup.add(panel);
    }

    // Mattress (Luxury Off-White with Soft Texture)
    const mattressMat = new THREE.MeshStandardMaterial({
      color: 0xf6f5f1,
      roughness: 0.85,
      metalness: 0.02,
    });
    const mattress = new THREE.Mesh(
      new THREE.BoxGeometry(2.45, 0.42, 3.2),
      mattressMat
    );
    mattress.position.set(0, 0.52, 0.08);
    mattress.castShadow = true;
    mattress.receiveShadow = true;
    bedGroup.add(mattress);

    // Hotel Mattress Topper
    const topperMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.95,
      metalness: 0.01,
    });
    const topper = new THREE.Mesh(
      new THREE.BoxGeometry(2.48, 0.14, 3.22),
      topperMat
    );
    topper.position.set(0, 0.77, 0.08);
    topper.castShadow = true;
    bedGroup.add(topper);

    // Gold Trim Tape on Mattress Edge
    const mattressGoldTrim = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 0.02, 3.24),
      goldMat
    );
    mattressGoldTrim.position.set(0, 0.71, 0.08);
    bedGroup.add(mattressGoldTrim);

    // Silk Duvet / Blanket (Navy Blue & Gold)
    const duvet = new THREE.Mesh(
      new THREE.BoxGeometry(2.52, 0.09, 2.0),
      new THREE.MeshStandardMaterial({
        color: 0x1c2438,
        roughness: 0.75,
        metalness: 0.1,
      })
    );
    duvet.position.set(0, 0.86, 0.68);
    duvet.castShadow = true;
    duvet.receiveShadow = true;
    bedGroup.add(duvet);

    // Gold Bed Runner (شال السرير المذهب)
    const runner = new THREE.Mesh(
      new THREE.BoxGeometry(2.56, 0.02, 0.45),
      goldMat
    );
    runner.position.set(0, 0.91, 0.5);
    bedGroup.add(runner);

    // Pillows
    const pillowMat = new THREE.MeshStandardMaterial({
      color: 0xfdfdfc,
      roughness: 0.9,
      metalness: 0.02,
    });
    const pillowNavyMat = new THREE.MeshStandardMaterial({
      color: 0x1b2336,
      roughness: 0.8,
      metalness: 0.1,
    });

    const createPillow = (w: number, h: number, d: number, mat: THREE.Material, rotX: number, pos: [number, number, number]) => {
      const p = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      p.rotation.x = rotX;
      p.position.set(pos[0], pos[1], pos[2]);
      p.castShadow = true;
      bedGroup.add(p);
    };

    // White Master Pillows
    createPillow(0.95, 0.22, 0.55, pillowMat, -0.3, [-0.62, 1.0, -1.05]);
    createPillow(0.95, 0.22, 0.55, pillowMat, -0.3, [0.62, 1.0, -1.05]);

    // Navy Accent Cushions
    createPillow(0.75, 0.2, 0.45, pillowNavyMat, -0.2, [-0.58, 0.98, -0.7]);
    createPillow(0.75, 0.2, 0.45, pillowNavyMat, -0.2, [0.58, 0.98, -0.7]);

    // Golden Center Crown Pillow
    createPillow(0.5, 0.16, 0.35, goldMat, -0.15, [0, 0.95, -0.5]);

    // Curtains Backdrop
    const curtainGroup = new THREE.Group();
    masterGroup.add(curtainGroup);

    // Curtain Top Valance (البلتكانة الفخمة)
    const valance = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 0.28, 0.35),
      new THREE.MeshStandardMaterial({ color: 0x121724, roughness: 0.5, metalness: 0.3 })
    );
    valance.position.set(0, 3.2, -1.85);
    valance.castShadow = true;
    curtainGroup.add(valance);

    // Valance Gold Crest
    const crest = new THREE.Mesh(
      new THREE.BoxGeometry(3.84, 0.05, 0.37),
      goldMat
    );
    crest.position.set(0, 3.35, -1.85);
    curtainGroup.add(crest);

    // Royal Drapery Folds (ستائر جانبية منسدلة)
    const curtainFabricMat = new THREE.MeshStandardMaterial({
      color: 0xc49b2f,
      roughness: 0.65,
      metalness: 0.25,
      side: THREE.DoubleSide,
    });

    const createDrapery = (isLeft: boolean) => {
      const g = new THREE.Group();
      for (let i = 0; i < 7; i++) {
        const fold = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06, 0.11, 3.1, 16),
          curtainFabricMat
        );
        const xOff = isLeft ? -1.75 + i * 0.08 : 1.75 - i * 0.08;
        const zOff = -1.8 + Math.sin(i * 0.8) * 0.08;
        fold.position.set(xOff, 1.55, zOff);
        fold.castShadow = true;
        g.add(fold);
      }
      // Gold Tie-back ring
      const tie = new THREE.Mesh(
        new THREE.TorusGeometry(0.2, 0.025, 16, 24),
        goldMat
      );
      tie.position.set(isLeft ? -1.5 : 1.5, 1.35, -1.72);
      tie.rotation.y = isLeft ? 0.35 : -0.35;
      g.add(tie);
      return g;
    };

    curtainGroup.add(createDrapery(true));
    curtainGroup.add(createDrapery(false));

    // Sheer Light Curtains (ستائر الشيفون الخفيفة الناعمة)
    const sheerMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.3,
      roughness: 0.95,
      side: THREE.DoubleSide,
    });
    const sheer = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 2.9),
      sheerMat
    );
    sheer.position.set(0, 1.55, -1.82);
    curtainGroup.add(sheer);

    // Elegant Warm Nightstand Lamps
    const createNightstand = (x: number) => {
      const stand = new THREE.Group();
      const table = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.35, 0.65, 32),
        baseMat
      );
      table.position.set(x, 0.32, -0.9);
      table.castShadow = true;
      stand.add(table);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.36, 0.015, 16, 32),
        goldMat
      );
      ring.position.set(x, 0.63, -0.9);
      ring.rotation.x = Math.PI / 2;
      stand.add(ring);

      const shade = new THREE.Mesh(
        new THREE.ConeGeometry(0.18, 0.28, 20, 1, true),
        new THREE.MeshStandardMaterial({
          color: 0xfff5dd,
          roughness: 0.7,
          emissive: 0xffaa33,
          emissiveIntensity: 0.45,
        })
      );
      shade.position.set(x, 0.9, -0.9);
      stand.add(shade);

      const lampGlow = new THREE.PointLight(0xffb040, 1.0, 3.5);
      lampGlow.position.set(x, 0.85, -0.9);
      stand.add(lampGlow);

      return stand;
    };

    masterGroup.add(createNightstand(-1.85));
    masterGroup.add(createNightstand(1.85));

    // Floating Stardust Particles (ذرات إضاءة ذهبية محيطية هادئة)
    const particleCount = 70;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 8;
      particlePositions[i * 3 + 1] = Math.random() * 4.5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffdf70,
      size: 0.035,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Smooth User Drag Controls
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;
      masterGroup.rotation.y += deltaX * 0.007;
      camera.position.y = Math.max(1.8, Math.min(4.5, camera.position.y - deltaY * 0.005));
      camera.lookAt(0, 1.2, 0);
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.current.y;
      masterGroup.rotation.y += deltaX * 0.008;
      camera.position.y = Math.max(1.8, Math.min(4.5, camera.position.y - deltaY * 0.006));
      camera.lookAt(0, 1.2, 0);
      previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(4.5, Math.min(9.0, camera.position.z + e.deltaY * 0.004));
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    // Camera target positioning based on mode
    let targetCamPos = new THREE.Vector3(0, 2.7, 6.6);
    let targetLook = new THREE.Vector3(0, 1.2, 0);

    if (currentMode === "mattress") {
      targetCamPos = new THREE.Vector3(0, 2.1, 4.6);
      targetLook = new THREE.Vector3(0, 0.8, 0.2);
    } else if (currentMode === "curtains") {
      targetCamPos = new THREE.Vector3(0, 2.6, 5.2);
      targetLook = new THREE.Vector3(0, 2.3, -1.2);
    } else if (currentMode === "pillows") {
      targetCamPos = new THREE.Vector3(0, 2.0, 3.8);
      targetLook = new THREE.Vector3(0, 1.05, -0.6);
    }

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      camera.position.lerp(targetCamPos, 0.04);
      camera.lookAt(targetLook);

      // Gentle auto-rotation
      if (isRotating && !isDraggingRef.current) {
        masterGroup.rotation.y += 0.0028;
      }

      // Gentle dust particle float
      const positions = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += Math.sin(elapsed * 1.2 + i) * 0.001;
      }
      particleGeometry.attributes.position.needsUpdate = true;

      // Soft breathing glow under podium
      goldHaloLight.intensity = 1.6 + Math.sin(elapsed * 1.5) * 0.4;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      renderer.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, [currentMode, isRotating]);

  return (
    <div className="relative w-full h-full cursor-grab active:cursor-grabbing select-none">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
