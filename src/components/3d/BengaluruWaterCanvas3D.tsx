import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { BENGALURU_ZONES } from '../../data/bengaluruWaterData';
import { useNammaWaterStore } from '../../store/useNammaWaterStore';
import { Layers, Eye, RefreshCw, ZoomIn, ZoomOut, Compass, Info, AlertTriangle } from 'lucide-react';

export const BengaluruWaterCanvas3D: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { selectedZoneId, setSelectedZoneId, spatialFocusZoneId, isReducedMotion } = useNammaWaterStore();
  const [activeZoneHover, setActiveZoneHover] = useState<string | null>(null);
  const [renderFallback, setRenderFallback] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let animationFrameId: number;
    let isDisposed = false;

    try {
      // Setup Scene, Camera, Renderer
      const width = container.clientWidth || 800;
      const height = container.clientHeight || (compact ? 320 : 520);

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x060b13); // Deep civic navy/slate
      scene.fog = new THREE.FogExp2(0x060b13, 0.045);

      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 14, 18);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.6);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
      dirLight.position.set(10, 20, 10);
      scene.add(dirLight);

      const pointCyan = new THREE.PointLight(0x06b6d4, 2, 30);
      pointCyan.position.set(0, 6, 0);
      scene.add(pointCyan);

      // 1. Stylized Bengaluru City Grid & Topography Plane
      const gridHelper = new THREE.GridHelper(24, 24, 0x0284c7, 0x0f2942);
      gridHelper.position.y = -0.1;
      scene.add(gridHelper);

      // Concentric Radar Rings for Civic Monitoring
      const ringGeo = new THREE.RingGeometry(3.5, 3.6, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x0284c7, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      scene.add(ringMesh);

      const ringGeo2 = new THREE.RingGeometry(7.5, 7.6, 64);
      const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat);
      ringMesh2.rotation.x = -Math.PI / 2;
      scene.add(ringMesh2);

      // 2. Zone Node Markers (Pillars & Floating Orbs)
      const zoneObjects: { id: string; mesh: THREE.Mesh; halo: THREE.Mesh; targetX: number; targetZ: number }[] = [];
      const raycastTargets: THREE.Object3D[] = [];

      BENGALURU_ZONES.forEach((zone) => {
        const isCritical = zone.groundwaterStressLevel === 'CRITICAL' || zone.groundwaterStressLevel === 'ACUTE';
        const colorHex = isCritical ? 0xf43f5e : zone.zone === 'East' ? 0x06b6d4 : 0x10b981;

        // Pillar height scaled by average price
        const pillarHeight = (zone.avgPrice10kL / 2400) * 3.5 + 0.5;
        const pillarGeo = new THREE.CylinderGeometry(0.2, 0.25, pillarHeight, 16);
        const pillarMat = new THREE.MeshStandardMaterial({
          color: colorHex,
          emissive: colorHex,
          emissiveIntensity: 0.4,
          roughness: 0.2,
          metalness: 0.8,
          transparent: true,
          opacity: 0.85
        });
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.set(zone.coordinates.gridX, pillarHeight / 2, zone.coordinates.gridZ);
        scene.add(pillar);

        // Floating Top Beacon Orb
        const orbGeo = new THREE.SphereGeometry(0.38, 16, 16);
        const orbMat = new THREE.MeshStandardMaterial({
          color: colorHex,
          emissive: colorHex,
          emissiveIntensity: 0.9,
          roughness: 0.1
        });
        const orb = new THREE.Mesh(orbGeo, orbMat);
        orb.position.set(zone.coordinates.gridX, pillarHeight + 0.3, zone.coordinates.gridZ);
        orb.userData = { zoneId: zone.id, zoneName: zone.name };
        scene.add(orb);

        // Pulsing Ring Halo
        const haloGeo = new THREE.RingGeometry(0.5, 0.65, 32);
        const haloMat = new THREE.MeshBasicMaterial({ color: colorHex, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.rotation.x = -Math.PI / 2;
        halo.position.set(zone.coordinates.gridX, 0.05, zone.coordinates.gridZ);
        scene.add(halo);

        zoneObjects.push({ id: zone.id, mesh: orb, halo, targetX: zone.coordinates.gridX, targetZ: zone.coordinates.gridZ });
        raycastTargets.push(orb, pillar);
      });

      // 3. Flowing Water & Network Particle Streams (Cauvery & Tanker Arteries)
      const particleCount = 180;
      const particleGeo = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);
      const particleSpeeds: number[] = [];

      for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 16;
        particlePositions[i * 3 + 1] = Math.random() * 2 + 0.2;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 16;
        particleSpeeds.push(0.015 + Math.random() * 0.03);
      }

      particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.18,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      });
      const particleSystem = new THREE.Points(particleGeo, particleMat);
      scene.add(particleSystem);

      // Raycaster for mouse picking
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      const handlePointerMove = (e: MouseEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(raycastTargets);
        if (intersects.length > 0) {
          const hit = intersects[0].object;
          if (hit.userData?.zoneId) {
            setActiveZoneHover(hit.userData.zoneName);
            renderer.domElement.style.cursor = 'pointer';
            return;
          }
        }
        setActiveZoneHover(null);
        renderer.domElement.style.cursor = 'grab';
      };

      const handlePointerClick = (e: MouseEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(raycastTargets);
        if (intersects.length > 0) {
          const hit = intersects[0].object;
          if (hit.userData?.zoneId) {
            setSelectedZoneId(hit.userData.zoneId);
          }
        }
      };

      renderer.domElement.addEventListener('mousemove', handlePointerMove);
      renderer.domElement.addEventListener('click', handlePointerClick);

      // ResizeObserver
      const resizeObserver = new ResizeObserver((entries) => {
        if (!entries[0] || isDisposed) return;
        const newW = entries[0].contentRect.width;
        const newH = entries[0].contentRect.height || (compact ? 320 : 520);
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      });
      resizeObserver.observe(container);

      // Animation Loop
      let clock = new THREE.Clock();

      const animate = () => {
        if (isDisposed) return;
        animationFrameId = requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        if (!isReducedMotion) {
          // Subtle camera orbit
          const targetAngle = elapsedTime * 0.12;
          const radius = 18;
          camera.position.x = Math.sin(targetAngle) * radius;
          camera.position.z = Math.cos(targetAngle) * radius;
          camera.position.y = 12 + Math.sin(elapsedTime * 0.3) * 1.2;
          camera.lookAt(0, 1.5, 0);

          // Animate particle flow
          const positions = particleGeo.attributes.position.array as Float32Array;
          for (let i = 0; i < particleCount; i++) {
            positions[i * 3 + 2] += particleSpeeds[i];
            if (positions[i * 3 + 2] > 10) {
              positions[i * 3 + 2] = -10;
              positions[i * 3] = (Math.random() - 0.5) * 16;
            }
          }
          particleGeo.attributes.position.needsUpdate = true;

          // Pulse Halos
          zoneObjects.forEach((zo, idx) => {
            const pulse = 1 + Math.sin(elapsedTime * 3 + idx) * 0.25;
            zo.halo.scale.set(pulse, pulse, pulse);
          });
        }

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        isDisposed = true;
        cancelAnimationFrame(animationFrameId);
        resizeObserver.disconnect();
        renderer.domElement.removeEventListener('mousemove', handlePointerMove);
        renderer.domElement.removeEventListener('click', handlePointerClick);
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    } catch (err) {
      console.warn('WebGL initialization fallback triggered:', err);
      setRenderFallback(true);
    }
  }, [compact, setSelectedZoneId, isReducedMotion]);

  if (renderFallback) {
    return (
      <div className="w-full h-80 rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col items-center justify-center text-center">
        <AlertTriangle className="w-8 h-8 text-cyan-400 mb-2" />
        <h4 className="text-sm font-bold text-white">2D Spatial Grid Mode Active</h4>
        <p className="text-xs text-slate-400 max-w-sm mt-1">
          Hardware acceleration unavailable. Showing interactive 2D data views for all 8 Bengaluru zones.
        </p>
      </div>
    );
  }

  const focusedZone = BENGALURU_ZONES.find((z) => z.id === (spatialFocusZoneId || selectedZoneId));

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-[#060b13] shadow-2xl group">
      {/* Canvas Mount */}
      <div ref={mountRef} className={`w-full ${compact ? 'h-80' : 'h-[460px] md:h-[540px]'}`} />

      {/* Top Left: Civic Live Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-500/30 text-cyan-300 text-xs font-mono">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>3D SPATIAL WATER GRID • BENGALURU</span>
      </div>

      {/* Top Right: Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {activeZoneHover && (
          <div className="bg-cyan-950/90 text-cyan-200 border border-cyan-500/40 text-xs px-3 py-1 rounded-lg backdrop-blur-md animate-fade-in font-medium">
            Hover: {activeZoneHover}
          </div>
        )}
      </div>

      {/* Bottom Info HUD */}
      {focusedZone && (
        <div className="absolute bottom-4 left-4 right-4 z-10 bg-slate-950/85 backdrop-blur-md border border-slate-800 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-white">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-400">{focusedZone.zone} Zone</span>
              <span className="text-sm font-bold text-white">{focusedZone.name}</span>
              <span className="text-xs text-slate-400 font-serif">({focusedZone.kannadaName})</span>
            </div>
            <p className="text-xs text-slate-400">
              Avg 10kL: <strong className="text-white">₹{focusedZone.avgPrice10kL}</strong> • TDS: <strong className="text-white">{focusedZone.avgTdsPpm} ppm</strong> • Stress: <span className="text-amber-400 font-bold">{focusedZone.groundwaterStressLevel}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedZoneId(focusedZone.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-slate-950 transition-all cursor-pointer shadow-sm"
            >
              Inspect Zone Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
