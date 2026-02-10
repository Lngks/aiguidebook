import { useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, RoundedBox, Environment } from "@react-three/drei";
import * as THREE from "three";

/* ─── Scanline shader material ─── */
const ScanlineMaterial = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#0aff0a") },
      uBgColor: { value: new THREE.Color("#0a1a0a") },
    }),
    []
  );

  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
    }
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
          // CRT curvature
          vec2 uv = vUv * 2.0 - 1.0;
          uv *= 1.0 + pow(length(uv * 0.3), 2.0);
          uv = (uv + 1.0) * 0.5;

          // Out of bounds = black
          if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            return;
          }

          // Scanlines
          float scanline = sin(uv.y * 300.0 + uTime * 2.0) * 0.04;
          
          // Flicker
          float flicker = 0.97 + 0.03 * sin(uTime * 8.0);

          // Vignette
          vec2 vigUv = uv * (1.0 - uv);
          float vig = vigUv.x * vigUv.y * 15.0;
          vig = pow(vig, 0.25);

          // Horizontal distortion line
          float distLine = smoothstep(0.0, 0.02, abs(uv.y - mod(uTime * 0.1, 1.4)));

          vec3 color = mix(uBgColor, uBgColor * 1.2, scanline);
          color *= flicker * vig * distLine;

          // Phosphor glow at edges
          color += uColor * 0.03 * (1.0 - vig);

          gl_FragColor = vec4(color, 1.0);
        }
      `}
    />
  );
};

/* ─── Screen text content ─── */
const ScreenContent = ({ inputText }: { inputText: string }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle floating
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0.01]}>
      {/* Logo */}
      <Text
        position={[0, 0.55, 0]}
        fontSize={0.18}
        color="#0aff0a"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
        characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 "
      >
        AI Guidebook
      </Text>

      {/* Subtitle */}
      <Text
        position={[0, 0.32, 0]}
        fontSize={0.06}
        color="#078a07"
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
      >
        Din guide til ansvarlig AI-bruk
      </Text>

      {/* Divider line */}
      <mesh position={[0, 0.22, 0]}>
        <planeGeometry args={[1.6, 0.003]} />
        <meshBasicMaterial color="#0aff0a" opacity={0.3} transparent />
      </mesh>

      {/* Input prompt */}
      <Text
        position={[-0.78, 0.05, 0]}
        fontSize={0.055}
        color="#089a08"
        anchorX="left"
        anchorY="middle"
      >
        {">"} Skriv inn spørsmålet ditt:
      </Text>

      {/* Input text with cursor */}
      <Text
        position={[-0.78, -0.1, 0]}
        fontSize={0.06}
        color="#0aff0a"
        anchorX="left"
        anchorY="middle"
        maxWidth={1.5}
      >
        {inputText || ""}
      </Text>

      {/* Blinking cursor */}
      <BlinkingCursor x={-0.78 + (inputText?.length || 0) * 0.033} />

      {/* Bottom status bar */}
      <Text
        position={[-0.78, -0.65, 0]}
        fontSize={0.04}
        color="#056605"
        anchorX="left"
        anchorY="middle"
      >
        READY — Trykk ENTER for å starte reisen
      </Text>
    </group>
  );
};

/* ─── Blinking cursor ─── */
const BlinkingCursor = ({ x }: { x: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.visible = Math.sin(state.clock.elapsedTime * 4) > 0;
    }
  });

  return (
    <mesh ref={meshRef} position={[Math.min(x, 0.72), -0.1, 0]}>
      <planeGeometry args={[0.025, 0.065]} />
      <meshBasicMaterial color="#0aff0a" />
    </mesh>
  );
};

/* ─── CRT Monitor body ─── */
const CRTMonitor = ({ inputText }: { inputText: string }) => {
  const monitorRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (monitorRef.current) {
      // Gentle idle rotation
      monitorRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.03;
      monitorRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.01 - 0.05;
    }
  });

  return (
    <group ref={monitorRef} position={[0, 0.2, 0]}>
      {/* Monitor casing - back */}
      <RoundedBox args={[2.6, 2.0, 1.2]} radius={0.08} position={[0, 0, -0.3]}>
        <meshStandardMaterial color="#2a2a2a" roughness={0.8} metalness={0.1} />
      </RoundedBox>

      {/* Monitor bezel - front frame */}
      <RoundedBox args={[2.5, 1.9, 0.15]} radius={0.05} position={[0, 0, 0.38]}>
        <meshStandardMaterial color="#3a3a3a" roughness={0.6} metalness={0.2} />
      </RoundedBox>

      {/* Screen recess */}
      <mesh position={[0, 0.05, 0.46]}>
        <planeGeometry args={[1.9, 1.45]} />
        <ScanlineMaterial />
      </mesh>

      {/* Screen glass overlay */}
      <mesh position={[0, 0.05, 0.465]}>
        <planeGeometry args={[1.9, 1.45]} />
        <meshPhysicalMaterial
          color="#000000"
          transparent
          opacity={0.08}
          roughness={0.05}
          metalness={0.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Screen content */}
      <group position={[0, 0.05, 0.47]}>
        <ScreenContent inputText={inputText} />
      </group>

      {/* Green power LED */}
      <mesh position={[0.95, -0.75, 0.46]}>
        <circleGeometry args={[0.03, 16]} />
        <meshBasicMaterial color="#0aff0a" />
      </mesh>

      {/* Monitor stand - neck */}
      <RoundedBox args={[0.4, 0.3, 0.4]} radius={0.03} position={[0, -1.15, 0]}>
        <meshStandardMaterial color="#2a2a2a" roughness={0.7} metalness={0.15} />
      </RoundedBox>

      {/* Monitor stand - base */}
      <RoundedBox args={[1.2, 0.08, 0.7]} radius={0.03} position={[0, -1.34, 0.1]}>
        <meshStandardMaterial color="#333333" roughness={0.6} metalness={0.2} />
      </RoundedBox>

      {/* Ventilation grooves on side */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[1.31, 0.3 - i * 0.15, -0.1]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.4, 0.02]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}

      {/* Brand label */}
      <Text
        position={[0, -0.78, 0.46]}
        fontSize={0.06}
        color="#666666"
        anchorX="center"
      >
        AIGuidebook CRT-2024
      </Text>
    </group>
  );
};

/* ─── Ambient particles ─── */
const FloatingParticles = () => {
  const meshRef = useRef<THREE.Points>(null);
  const count = 200;

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
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#0aff0a"
        size={0.02}
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
};

/* ─── Scene ─── */
const CRTScene = ({ inputText }: { inputText: string }) => {
  return (
    <>
      <color attach="background" args={["#050a05"]} />
      <fog attach="fog" args={["#050a05", 5, 15]} />

      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 4, 5]} intensity={0.6} color="#ffffff" />
      <pointLight position={[0, 0, 3]} intensity={0.5} color="#0aff0a" distance={8} />
      <pointLight position={[-2, -1, 2]} intensity={0.2} color="#004400" distance={6} />

      <CRTMonitor inputText={inputText} />
      <FloatingParticles />

      {/* Floor reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color="#050a05"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
    </>
  );
};

/* ─── Exported component ─── */
const CRTMonitorScene = () => {
  const [inputText, setInputText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && inputText.trim()) {
        setSubmitted(true);
        // Future: trigger zoom-through animation
      }
    },
    [inputText]
  );

  return (
    <div className="relative h-[80vh] w-full md:h-[85vh]">
      <Canvas
        camera={{ position: [0, 0.3, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
      >
        <CRTScene inputText={inputText} />
      </Canvas>

      {/* Overlay input — hidden but captures keyboard */}
      <div className="absolute bottom-8 left-1/2 w-full max-w-md -translate-x-1/2 px-4">
        <div className="rounded-lg border border-[#0aff0a]/30 bg-[#0a1a0a]/90 px-4 py-3 backdrop-blur-sm">
          <label className="mb-1 block text-xs text-[#0aff0a]/60 font-mono">
            Skriv et spørsmål og trykk Enter
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
        {submitted && (
          <p className="mt-2 text-center text-xs text-[#0aff0a]/50 font-mono animate-fade-in">
            Zoom-animasjon kommer snart — denne funksjonen er under utvikling.
          </p>
        )}
      </div>

      {/* CRT glow overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#050a05_100%)]" />
    </div>
  );
};

export default CRTMonitorScene;
