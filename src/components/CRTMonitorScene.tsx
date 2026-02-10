import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, RoundedBox, ScrollControls, useScroll } from "@react-three/drei";
import * as THREE from "three";

/* ─── AI Pipeline stages ─── */
const STAGES = [
  { z: -20, title: "1. Input", desc: "Spørsmålet ditt mottas" },
  { z: -50, title: "2. Tokenisering", desc: "Teksten brytes ned til tokens" },
  { z: -80, title: "3. Embedding", desc: "Tokens konverteres til vektorer" },
  { z: -110, title: "4. Attention", desc: "Modellen finner relevante mønstre" },
  { z: -140, title: "5. Generering", desc: "Svaret bygges token for token" },
  { z: -170, title: "6. Output", desc: "Du mottar det ferdige svaret" },
];

/* ─── Scanline shader for CRT screen ─── */
const ScanlineMaterial = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("#0aff0a") },
    uBgColor: { value: new THREE.Color("#0a1a0a") },
  }), []);

  useFrame((_, delta) => {
    if (materialRef.current) materialRef.current.uniforms.uTime.value += delta;
  });

  return (
    <shaderMaterial
      ref={materialRef}
      uniforms={uniforms}
      vertexShader={`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
      fragmentShader={`
        uniform float uTime;
        uniform vec3 uColor;
        uniform vec3 uBgColor;
        varying vec2 vUv;
        void main() {
          vec2 uv = vUv * 2.0 - 1.0;
          uv *= 1.0 + pow(length(uv * 0.3), 2.0);
          uv = (uv + 1.0) * 0.5;
          if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            return;
          }
          float scanline = sin(uv.y * 300.0 + uTime * 2.0) * 0.04;
          float flicker = 0.97 + 0.03 * sin(uTime * 8.0);
          vec2 vigUv = uv * (1.0 - uv);
          float vig = pow(vigUv.x * vigUv.y * 15.0, 0.25);
          float distLine = smoothstep(0.0, 0.02, abs(uv.y - mod(uTime * 0.1, 1.4)));
          vec3 color = mix(uBgColor, uBgColor * 1.2, scanline);
          color *= flicker * vig * distLine;
          color += uColor * 0.03 * (1.0 - vig);
          gl_FragColor = vec4(color, 1.0);
        }
      `}
    />
  );
};

/* ─── Blinking cursor ─── */
const BlinkingCursor = ({ x }: { x: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) meshRef.current.visible = Math.sin(state.clock.elapsedTime * 4) > 0;
  });
  return (
    <mesh ref={meshRef} position={[Math.min(x, 0.72), -0.1, 0]}>
      <planeGeometry args={[0.025, 0.065]} />
      <meshBasicMaterial color="#0aff0a" />
    </mesh>
  );
};

/* ─── Screen text content ─── */
const ScreenContent = ({ inputText }: { inputText: string }) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0.01]}>
      <Text position={[0, 0.55, 0]} fontSize={0.18} color="#0aff0a" anchorX="center" anchorY="middle">
        AI Guidebook
      </Text>
      <Text position={[0, 0.32, 0]} fontSize={0.06} color="#078a07" anchorX="center" anchorY="middle" maxWidth={2}>
        Din guide til ansvarlig AI-bruk
      </Text>
      <mesh position={[0, 0.22, 0]}>
        <planeGeometry args={[1.6, 0.003]} />
        <meshBasicMaterial color="#0aff0a" opacity={0.3} transparent />
      </mesh>
      <Text position={[-0.78, 0.05, 0]} fontSize={0.055} color="#089a08" anchorX="left" anchorY="middle">
        {">"} Skriv inn spørsmålet ditt:
      </Text>
      <Text position={[-0.78, -0.1, 0]} fontSize={0.06} color="#0aff0a" anchorX="left" anchorY="middle" maxWidth={1.5}>
        {inputText || ""}
      </Text>
      <BlinkingCursor x={-0.78 + (inputText?.length || 0) * 0.033} />
      <Text position={[-0.78, -0.65, 0]} fontSize={0.04} color="#056605" anchorX="left" anchorY="middle">
        READY — Trykk ENTER for å starte reisen
      </Text>
    </group>
  );
};

/* ─── CRT Monitor body ─── */
const CRTMonitor = ({ inputText, visible }: { inputText: string; visible: boolean }) => {
  const monitorRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (monitorRef.current && visible) {
      monitorRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.03;
      monitorRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.01 - 0.05;
    }
  });

  if (!visible) return null;

  return (
    <group ref={monitorRef} position={[0, 0.2, 0]}>
      <RoundedBox args={[2.6, 2.0, 1.2]} radius={0.08} position={[0, 0, -0.3]}>
        <meshStandardMaterial color="#2a2a2a" roughness={0.8} metalness={0.1} />
      </RoundedBox>
      <RoundedBox args={[2.5, 1.9, 0.15]} radius={0.05} position={[0, 0, 0.38]}>
        <meshStandardMaterial color="#3a3a3a" roughness={0.6} metalness={0.2} />
      </RoundedBox>
      <mesh position={[0, 0.05, 0.46]}>
        <planeGeometry args={[1.9, 1.45]} />
        <ScanlineMaterial />
      </mesh>
      <mesh position={[0, 0.05, 0.465]}>
        <planeGeometry args={[1.9, 1.45]} />
        <meshPhysicalMaterial color="#000000" transparent opacity={0.08} roughness={0.05} metalness={0.5} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      <group position={[0, 0.05, 0.47]}>
        <ScreenContent inputText={inputText} />
      </group>
      <mesh position={[0.95, -0.75, 0.46]}>
        <circleGeometry args={[0.03, 16]} />
        <meshBasicMaterial color="#0aff0a" />
      </mesh>
      <RoundedBox args={[0.4, 0.3, 0.4]} radius={0.03} position={[0, -1.15, 0]}>
        <meshStandardMaterial color="#2a2a2a" roughness={0.7} metalness={0.15} />
      </RoundedBox>
      <RoundedBox args={[1.2, 0.08, 0.7]} radius={0.03} position={[0, -1.34, 0.1]}>
        <meshStandardMaterial color="#333333" roughness={0.6} metalness={0.2} />
      </RoundedBox>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[1.31, 0.3 - i * 0.15, -0.1]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.4, 0.02]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}
      <Text position={[0, -0.78, 0.46]} fontSize={0.06} color="#666666" anchorX="center">
        AIGuidebook CRT-2024
      </Text>
    </group>
  );
};

/* ─── Wireframe terrain grid (Hut8 style) ─── */
const WireframeTerrain = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(60, 250, 80, 350);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getY(i); // Y in plane = Z in world after rotation
      // Procedural terrain with multiple octaves
      const h =
        Math.sin(x * 0.3 + z * 0.1) * 1.2 +
        Math.sin(x * 0.7 - z * 0.15) * 0.6 +
        Math.cos(x * 0.15 + z * 0.25) * 1.5 +
        Math.sin(x * 1.2 + z * 0.4) * 0.3;
      pos.setZ(i, h);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle terrain shimmer
      (meshRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.25 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, -100]}>
      <meshBasicMaterial color="#0aff0a" wireframe transparent opacity={0.25} />
    </mesh>
  );
};

/* ─── Glowing grid floor ─── */
const GridFloor = () => {
  return (
    <group position={[0, -3.01, -100]}>
      <gridHelper args={[250, 120, "#0a4a0a", "#062006"]} />
    </group>
  );
};

/* ─── Stage marker ─── */
const StageMarker = ({ stage, index }: { stage: typeof STAGES[0]; index: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = -1 + Math.sin(state.clock.elapsedTime * 0.7 + index) * 0.3;
    }
    if (glowRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 2 + index * 0.5) * 0.15;
      glowRef.current.scale.set(s, s, s);
    }
  });

  const side = index % 2 === 0 ? -6 : 6;

  return (
    <group ref={groupRef} position={[side, -1, stage.z]}>
      {/* Glowing orb */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color="#0aff0a" transparent opacity={0.6} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial color="#0aff0a" transparent opacity={0.1} />
      </mesh>

      {/* Vertical beam */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 3, 8]} />
        <meshBasicMaterial color="#0aff0a" transparent opacity={0.2} />
      </mesh>

      {/* Title */}
      <Text position={[0, 1.4, 0]} fontSize={0.5} color="#0aff0a" anchorX="center" anchorY="middle">
        {stage.title}
      </Text>

      {/* Description */}
      <Text position={[0, 0.8, 0]} fontSize={0.25} color="#078a07" anchorX="center" anchorY="middle" maxWidth={6}>
        {stage.desc}
      </Text>
    </group>
  );
};

/* ─── Data stream particles flowing through tunnel ─── */
const DataStream = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 500;

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6 - 1;
      pos[i * 3 + 2] = Math.random() * -200;
      vel[i] = 0.3 + Math.random() * 0.7;
    }
    return { positions: pos, velocities: vel };
  }, []);

  useFrame(() => {
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < count; i++) {
        let z = pos.getZ(i);
        z += velocities[i] * 0.15;
        if (z > 5) z = -200 + Math.random() * 10;
        pos.setZ(i, z);
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#0aff0a" size={0.06} transparent opacity={0.5} sizeAttenuation />
    </points>
  );
};

/* ─── Ambient floating particles ─── */
const FloatingParticles = () => {
  const meshRef = useRef<THREE.Points>(null);
  const count = 150;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#0aff0a" size={0.02} transparent opacity={0.4} sizeAttenuation />
    </points>
  );
};

/* ─── Camera controller driven by scroll ─── */
const CameraController = ({ journeyStarted }: { journeyStarted: boolean }) => {
  const scroll = useScroll();
  const { camera } = useThree();

  useFrame(() => {
    if (!journeyStarted) {
      // Idle camera position for CRT view
      camera.position.set(0, 0.3, 4.5);
      camera.lookAt(0, 0, 0);
      return;
    }

    const t = scroll.offset; // 0 to 1

    if (t < 0.08) {
      // Zoom into screen
      const p = t / 0.08;
      const ease = p * p * (3 - 2 * p); // smoothstep
      camera.position.set(
        0,
        THREE.MathUtils.lerp(0.3, 0.25, ease),
        THREE.MathUtils.lerp(4.5, 0.5, ease)
      );
      camera.lookAt(0, 0, -5);
    } else {
      // Fly through landscape
      const landscapeT = (t - 0.08) / 0.92;
      const z = THREE.MathUtils.lerp(0, -185, landscapeT);
      const y = -0.5 + Math.sin(landscapeT * Math.PI * 2) * 0.8;
      const x = Math.sin(landscapeT * Math.PI * 3) * 2;

      camera.position.set(x, y, z);
      camera.lookAt(x * 0.3, y - 0.5, z - 15);
    }
  });

  return null;
};

/* ─── Tunnel ring at transition point ─── */
const TunnelRings = () => {
  return (
    <group>
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} position={[0, 0, -i * 3 - 5]} rotation={[0, 0, i * 0.1]}>
          <torusGeometry args={[3 + Math.sin(i * 0.5) * 0.5, 0.02, 8, 32]} />
          <meshBasicMaterial color="#0aff0a" transparent opacity={0.15 - i * 0.005} />
        </mesh>
      ))}
    </group>
  );
};

/* ─── Complete scene ─── */
const FullScene = ({ inputText, journeyStarted }: { inputText: string; journeyStarted: boolean }) => {
  return (
    <>
      <color attach="background" args={["#050a05"]} />
      <fog attach="fog" args={["#050a05", 8, 40]} />

      <ambientLight intensity={0.2} />
      <directionalLight position={[3, 4, 5]} intensity={0.4} color="#ffffff" />
      <pointLight position={[0, 0, 3]} intensity={0.5} color="#0aff0a" distance={8} />

      <CameraController journeyStarted={journeyStarted} />

      {/* CRT monitor — visible before journey */}
      <CRTMonitor inputText={inputText} visible={!journeyStarted} />
      {!journeyStarted && <FloatingParticles />}

      {/* Floor for CRT */}
      {!journeyStarted && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#050a05" roughness={0.3} metalness={0.8} />
        </mesh>
      )}

      {/* Landscape — visible during journey */}
      {journeyStarted && (
        <>
          <TunnelRings />
          <WireframeTerrain />
          <GridFloor />
          <DataStream />

          {/* Stage markers */}
          {STAGES.map((stage, i) => (
            <StageMarker key={i} stage={stage} index={i} />
          ))}

          {/* Distant glow pillars */}
          {Array.from({ length: 15 }).map((_, i) => (
            <group key={`pillar-${i}`} position={[(i % 2 === 0 ? -1 : 1) * (12 + Math.random() * 5), -3, -i * 14 - 10]}>
              <mesh>
                <cylinderGeometry args={[0.05, 0.05, 8 + Math.random() * 4, 8]} />
                <meshBasicMaterial color="#0aff0a" transparent opacity={0.08} />
              </mesh>
              <pointLight position={[0, 4, 0]} intensity={0.3} color="#0aff0a" distance={6} />
            </group>
          ))}

          {/* End screen */}
          <group position={[0, 0, -185]}>
            <Text position={[0, 1, 0]} fontSize={0.8} color="#0aff0a" anchorX="center" anchorY="middle">
              Svaret ditt er klart
            </Text>
            <Text position={[0, -0.2, 0]} fontSize={0.3} color="#078a07" anchorX="center" anchorY="middle" maxWidth={10}>
              Du har reist gjennom hele AI-pipelinen — fra spørsmål til svar.
            </Text>
          </group>
        </>
      )}
    </>
  );
};

/* ─── Exported component ─── */
const CRTMonitorScene = () => {
  const [inputText, setInputText] = useState("");
  const [journeyStarted, setJourneyStarted] = useState(false);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && inputText.trim()) {
        setJourneyStarted(true);
      }
    },
    [inputText]
  );

  return (
    <div className="relative w-full" style={{ height: journeyStarted ? "500vh" : "85vh" }}>
      <div className="sticky top-0 h-screen w-full">
        <Canvas
          camera={{ position: [0, 0.3, 4.5], fov: 45 }}
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 2]}
        >
          <ScrollControls pages={journeyStarted ? 5 : 0} damping={0.25}>
            <FullScene inputText={inputText} journeyStarted={journeyStarted} />
          </ScrollControls>
        </Canvas>

        {/* Input overlay — only before journey */}
        {!journeyStarted && (
          <div className="absolute bottom-8 left-1/2 w-full max-w-md -translate-x-1/2 px-4">
            <div className="rounded-lg border border-[#0aff0a]/30 bg-[#0a1a0a]/90 px-4 py-3 backdrop-blur-sm">
              <label className="mb-1 block text-xs text-[#0aff0a]/60 font-mono">
                Skriv et spørsmål og trykk Enter for å starte reisen
              </label>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Hva vil du vite om AI?"
                className="w-full bg-transparent font-mono text-sm text-[#0aff0a] placeholder:text-[#0aff0a]/30 focus:outline-none"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Scroll indicator during journey */}
        {journeyStarted && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="flex flex-col items-center gap-1">
              <p className="font-mono text-xs text-[#0aff0a]/50">Scroll for å utforske</p>
              <div className="h-6 w-4 rounded-full border border-[#0aff0a]/30">
                <div className="mx-auto mt-1 h-1.5 w-1 rounded-full bg-[#0aff0a]/60 animate-bounce" />
              </div>
            </div>
          </div>
        )}

        {/* CRT glow overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#050a05_100%)]" />
      </div>
    </div>
  );
};

export default CRTMonitorScene;
