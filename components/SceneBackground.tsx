"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function Particles({ tint }: { tint: string }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 350;
    const arr = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 60;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 60;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }

    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;

    const baseSpeed = tint === "#000000" ? 0.01 : 0.03;
    ref.current.rotation.y += 0.0008;
  });

  return (
    <Points ref={ref} positions={positions}>
      <PointMaterial
        color={tint || "#7a0000"}
        size={0.12}
        opacity={0.4}
        transparent
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

export default function SceneBackground({
  tint,
}: {
  tint: string;
}) {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 22], fov: 75 }}>
        <Particles tint={tint} />
      </Canvas>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black pointer-events-none" />
    </div>
  );
}