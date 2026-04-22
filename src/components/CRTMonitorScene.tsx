import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, RoundedBox, ScrollControls, useScroll, Html, Billboard } from "@react-three/drei";
import * as THREE from "three";

/* ─── AI Pipeline stages with distinct colors ─── */
const STAGES = [
  { z: -20, title: "1. Input", desc: "Spørsmålet ditt mottas", color: "#00ffff" },
  { z: -50, title: "2. Tokenisering", desc: "Teksten brytes ned til tokens", color: "#0aff0a" },
  { z: -80, title: "3. Embedding", desc: "Tokens konverteres til vektorer", color: "#a855f7" },
  { z: -110, title: "4. Attention", desc: "Modellen finner relevante mønstre", color: "#f97316" },
  { z: -140, title: "5. Generering", desc: "Svaret bygges token for token", color: "#ec4899" },
  { z: -170, title: "6. Output", desc: "Du mottar det ferdige svaret", color: "#facc15" },
];

/* ─── Helper: get interpolated color based on Z position ─── */
function getStageColor(z: number): THREE.Color {
  // Find which two stages we're between
  for (let i = 0; i < STAGES.length - 1; i++) {
    if (z >= STAGES[i + 1].z) {
      const t = (z - STAGES[i].z) / (STAGES[i + 1].z - STAGES[i].z);
      const c1 = new THREE.Color(STAGES[i].color);
      const c2 = new THREE.Color(STAGES[i + 1].color);
      return c1.lerp(c2, Math.max(0, Math.min(1, t)));
    }
  }
  if (z > STAGES[0].z) return new THREE.Color(STAGES[0].color);
  return new THREE.Color(STAGES[STAGES.length - 1].color);
}

/* ─── Glitchy CRT shader with static/noise ─── */
const ScanlineMaterial = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
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
        varying vec2 vUv;

        // Hash for noise
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        void main() {
          vec2 uv = vUv * 2.0 - 1.0;
          // CRT barrel distortion
          uv *= 1.0 + pow(length(uv * 0.3), 2.0);
          uv = (uv + 1.0) * 0.5;

          if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            return;
          }

          // Static noise
          float noise = hash(uv * 500.0 + uTime * 100.0) * 0.08;

          // Scanlines
          float scanline = sin(uv.y * 400.0 + uTime * 3.0) * 0.03;

          // Horizontal glitch bands
          float glitchBand = step(0.98, hash(vec2(floor(uv.y * 20.0), floor(uTime * 4.0))));
          float glitchShift = glitchBand * (hash(vec2(uTime, floor(uv.y * 20.0))) - 0.5) * 0.1;

          // Color channels with chromatic aberration
          float r = noise + scanline * 0.5;
          float g = noise + scanline;
          float b = noise + scanline * 0.7;

          // Base dark background with tinted noise
          vec3 bgColor = vec3(0.02, 0.04, 0.03);
          vec3 noiseColor = vec3(r * 0.3, g * 0.6, b * 0.4);

          // Flicker
          float flicker = 0.95 + 0.05 * sin(uTime * 12.0);

          // Vignette
          vec2 vigUv = uv * (1.0 - uv);
          float vig = pow(vigUv.x * vigUv.y * 15.0, 0.3);

          // Rolling scan line
          float distLine = smoothstep(0.0, 0.03, abs(uv.y - mod(uTime * 0.08, 1.4)));

          // Glitch color burst
          vec3 glitchColor = vec3(
            hash(vec2(uTime * 3.0, uv.y * 10.0)) * 0.15 * glitchBand,
            hash(vec2(uTime * 5.0, uv.y * 10.0)) * 0.1 * glitchBand,
            hash(vec2(uTime * 7.0, uv.y * 10.0)) * 0.2 * glitchBand
          );

          vec3 color = bgColor + noiseColor + glitchColor;
          color *= flicker * vig * distLine;

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
      {/* Logo rendered via Html overlay with CRT glitch effects */}
      <Html position={[0, 0.45, 0]} center transform distanceFactor={2.2}
        style={{ pointerEvents: 'none' }}
      >
        <div className="crt-logo-wrap" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
        }}>
          <img
            src="/crt-logo.svg?v=2"
            alt="AI Guidebook"
            style={{
              width: '200px', height: 'auto',
              filter: 'drop-shadow(0 0 8px #0aff0a)',
              animation: 'crt-glitch 3s infinite',
            }}
          />
        </div>
      </Html>
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
        <meshStandardMaterial color="#4a4a4a" roughness={0.7} metalness={0.15} />
      </RoundedBox>
      <RoundedBox args={[2.5, 1.9, 0.15]} radius={0.05} position={[0, 0, 0.38]}>
        <meshStandardMaterial color="#5a5a5a" roughness={0.5} metalness={0.2} />
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
        <meshStandardMaterial color="#4a4a4a" roughness={0.7} metalness={0.15} />
      </RoundedBox>
      <RoundedBox args={[1.2, 0.08, 0.7]} radius={0.03} position={[0, -1.34, 0.1]}>
        <meshStandardMaterial color="#505050" roughness={0.6} metalness={0.2} />
      </RoundedBox>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[1.31, 0.3 - i * 0.15, -0.1]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.4, 0.02]} />
          <meshStandardMaterial color="#3a3a3a" />
        </mesh>
      ))}
      <Text position={[0, -0.78, 0.46]} fontSize={0.06} color="#666666" anchorX="center">
        AIGuidebook CRT-2024
      </Text>
    </group>
  );
};

/* ─── Flat Isometric Terrain ─── */
const IsometricTerrain = () => {
  return (
    <group position={[0, -1, -100]}>
      {/* Base light terrain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[120, 260]} />
        <meshStandardMaterial color="#1c1d21" roughness={1} metalness={0} />
      </mesh>

      {/* Subtle dotted grid overlay using shader */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <planeGeometry args={[120, 260]} />
        <shaderMaterial
          transparent
          uniforms={{
            uColor: { value: new THREE.Color("#363942") }
          }}
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 uColor;
            varying vec2 vUv;
            void main() {
              vec2 grid = fract(vUv * vec2(120.0, 260.0) * 0.5);
              float dot = length(grid - 0.5);
              float alpha = smoothstep(0.1, 0.05, dot) * 0.4;
              gl_FragColor = vec4(uColor, alpha);
            }
          `}
        />
      </mesh>
    </group>
  );
};

/* ─── Grid floor removed for flat aesthetic ─── */
const GridFloor = () => {
  return null;
};

/* ─── Glowing progress line connecting all stations ─── */
const ProgressLine = () => {
  const glowRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(0);

  // Build the path curve through all stages
  const { curve, tubeGeo, groundGeo } = useMemo(() => {
    const points: THREE.Vector3[] = [];
    // Start from origin (inside the CRT monitor)
    points.push(new THREE.Vector3(0, -0.9, -0.2));
    points.push(new THREE.Vector3(0, -0.9, -2));
    STAGES.forEach((stage, i) => {
      const side = i % 2 === 0 ? -3 : 3;
      points.push(new THREE.Vector3(0, -0.9, stage.z + 10));
      points.push(new THREE.Vector3(side, -0.9, stage.z));
      points.push(new THREE.Vector3(0, -0.9, stage.z - 10));
    });
    points.push(new THREE.Vector3(0, -0.9, -185));

    const c = new THREE.CatmullRomCurve3(points);
    // Sharp angular look is harder with CatmullRom, but we can reduce segments for a slightly jagged circuit feel
    const tg = new THREE.TubeGeometry(c, 200, 0.08, 6, false);
    const gg = new THREE.TubeGeometry(c, 200, 0.15, 6, false);
    return { curve: c, tubeGeo: tg, groundGeo: gg };
  }, []);

  // Progress indicator sphere
  useFrame((state) => {
    const camZ = state.camera.position.z;
    // Map camera Z to progress
    const t = Math.max(0, Math.min(1, (camZ - 5) / -185));
    progressRef.current = t;

    if (glowRef.current) {
      const point = curve.getPoint(t);
      glowRef.current.position.copy(point);
      const s = 1 + Math.sin(state.clock.elapsedTime * 8) * 0.1;
      glowRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group>
      {/* Full path ground trench / circuit path */}
      <mesh geometry={groundGeo} position={[0, -0.05, 0]}>
        <meshStandardMaterial color="#2d2f36" roughness={0.9} />
      </mesh>

      {/* Glowing active path — rendered with shader for progress effect */}
      <mesh geometry={tubeGeo} position={[0, 0.02, 0]}>
        <shaderMaterial
          transparent
          uniforms={{
            uTime: { value: 0 },
            uProgress: { value: 0 },
            uColor1: { value: new THREE.Color(STAGES[0].color) },
            uColor2: { value: new THREE.Color(STAGES[STAGES.length - 1].color) },
          }}
          vertexShader={`
            varying vec2 vUv;
            varying vec3 vWorldPos;
            void main() {
              vUv = uv;
              vec4 wp = modelMatrix * vec4(position, 1.0);
              vWorldPos = wp.xyz;
              gl_Position = projectionMatrix * viewMatrix * wp;
            }
          `}
          fragmentShader={`
            uniform float uTime;
            uniform float uProgress;
            uniform vec3 uColor1;
            uniform vec3 uColor2;
            varying vec2 vUv;
            varying vec3 vWorldPos;
            void main() {
              float t = vUv.x;
              // Only show up to current progress
              float show = smoothstep(uProgress + 0.05, uProgress - 0.02, t);
              // Color gradient
              vec3 col = mix(uColor1, uColor2, t);
              // Energy pulse along the line
              float pulse = 0.5 + 0.5 * sin(t * 80.0 - uTime * 10.0);
              float glow = show * pulse;
              gl_FragColor = vec4(col, glow * 0.9);
            }
          `}
          ref={(mat: THREE.ShaderMaterial | null) => {
            if (!mat) return;
            // Update uniforms each frame via the parent's useFrame
            const update = () => {
              mat.uniforms.uProgress.value = progressRef.current;
              mat.uniforms.uTime.value = performance.now() * 0.001;
              requestAnimationFrame(update);
            };
            update();
          }}
        />
      </mesh>

      {/* Progress Data Packet */}
      <mesh ref={glowRef}>
        <boxGeometry args={[0.4, 0.2, 0.4]} />
        <meshBasicMaterial color="#ffffff" />
        {/* Helper PointLight for tracing */}
        <pointLight color="#ffffff" intensity={1} distance={5} />
      </mesh>
    </group>
  );
};

/* ─── Brutalist Stage Marker Abstract Buildings ─── */
const StageMarker = ({ stage, index }: { stage: typeof STAGES[0]; index: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (glowRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 2 + index * 0.5) * 0.05;
      glowRef.current.scale.set(s, s, s);
    }
  });

  const side = index % 2 === 0 ? -6 : 6;
  const color = stage.color;

  // Brutalist materials - Varied Grey theme
  const shades = ["#32343b", "#41444d", "#515560", "#626775"];
  const concreteMaterial = <meshStandardMaterial color={shades[2]} roughness={0.7} metalness={0.05} />;
  const concreteDarkMaterial = <meshStandardMaterial color={shades[0]} roughness={0.8} metalness={0.05} />;
  const glowMaterial = <meshBasicMaterial color={color} transparent opacity={0.6} />;

  const renderBuilding = () => {
    switch (index) {
      case 0: // Input - Monolithic gateway
        return (
          <group>
            <mesh position={[-2, 3, 0]}><boxGeometry args={[1.5, 6, 1.5]} />{concreteMaterial}</mesh>
            <mesh position={[2, 3, 0]}><boxGeometry args={[1.5, 6, 1.5]} />{concreteMaterial}</mesh>
            <mesh position={[0, 6.5, 0]}><boxGeometry args={[6, 1, 1.5]} />{concreteDarkMaterial}</mesh>
            <mesh position={[0, 3, 0]} ref={glowRef}><boxGeometry args={[1, 4, 1]} />{glowMaterial}</mesh>
          </group>
        );
      case 1: // Tokenisering - Split block cluster
        return (
          <group>
            {Array.from({ length: 12 }).map((_, i) => (
              <mesh key={i} position={[(Math.random() - 0.5) * 4, Math.random() * 5 + 0.5, (Math.random() - 0.5) * 4]}>
                <boxGeometry args={[0.8, 0.8 + Math.random() * 3, 0.8]} />
                {i % 4 === 0 ? glowMaterial : <meshStandardMaterial color={shades[i % 4]} roughness={0.7} metalness={0.05} />}
              </mesh>
            ))}
            <mesh position={[0, 2, 0]} ref={glowRef}><boxGeometry args={[1.5, 1.5, 1.5]} />{glowMaterial}</mesh>
          </group>
        );
      case 2: // Embedding - Deep Grid monolith
        return (
          <group>
            <mesh position={[0, 3.5, 0]}><boxGeometry args={[3.5, 7, 3.5]} />{concreteDarkMaterial}</mesh>
            {Array.from({ length: 6 }).map((_, i) => (
              <mesh key={i} position={[0, i * 1.2 + 0.8, 0]}>
                <boxGeometry args={[3.8, 0.25, 3.8]} />
                <meshStandardMaterial color={shades[i % 2 === 0 ? 3 : 1]} roughness={0.7} metalness={0.05} />
              </mesh>
            ))}
            <mesh position={[0, 3.5, 0]} ref={glowRef}><boxGeometry args={[3.6, 6, 3.6]} /><meshBasicMaterial color={color} transparent opacity={0.15} wireframe /></mesh>
          </group>
        );
      case 3: // Attention - Interconnected spires
        return (
          <group>
            <mesh position={[-2, 4, -2]}><cylinderGeometry args={[0.6, 1, 8, 4]} />{concreteMaterial}</mesh>
            <mesh position={[2, 4, 2]}><cylinderGeometry args={[0.6, 1, 8, 4]} />{concreteMaterial}</mesh>
            <mesh position={[-2, 4, 2]}><cylinderGeometry args={[0.6, 1, 8, 4]} />{concreteMaterial}</mesh>
            <mesh position={[2, 4, -2]}><cylinderGeometry args={[0.6, 1, 8, 4]} />{concreteMaterial}</mesh>
            <mesh position={[0, 6, 0]} ref={glowRef}><sphereGeometry args={[1, 16, 16]} />{glowMaterial}</mesh>
            <mesh position={[0, 3, 0]} rotation={[0.6, 0.6, 0]}><cylinderGeometry args={[0.1, 0.1, 6]} />{glowMaterial}</mesh>
            <mesh position={[0, 3, 0]} rotation={[-0.6, 0.6, 0]}><cylinderGeometry args={[0.1, 0.1, 6]} />{glowMaterial}</mesh>
          </group>
        );
      case 4: // Generering - Stacked staggered tower
        return (
          <group>
            {Array.from({ length: 8 }).map((_, i) => (
              <mesh key={i} position={[Math.sin(i) * 0.8, i * 1.2 + 0.6, Math.cos(i) * 0.8]} rotation={[0, i * 0.3, 0]}>
                <boxGeometry args={[3 - i * 0.2, 1.2, 3 - i * 0.2]} />
                <meshStandardMaterial color={shades[i % 4]} roughness={0.7} metalness={0.05} />
              </mesh>
            ))}
            <mesh position={[0, 9, 0]} ref={glowRef}><boxGeometry args={[1, 2.5, 1]} />{glowMaterial}</mesh>
          </group>
        );
      default: // Output - Massive concrete core
        return (
          <group>
            <mesh position={[0, 4, 0]}><boxGeometry args={[5, 8, 5]} />{concreteDarkMaterial}</mesh>
            <mesh position={[0, 4, 0]}><boxGeometry args={[5.2, 2, 5.2]} />{concreteMaterial}</mesh>
            <mesh position={[0, 4, 0]} ref={glowRef}><boxGeometry args={[2.5, 8.5, 2.5]} />{glowMaterial}</mesh>
          </group>
        );
    }
  };

  return (
    <group ref={groupRef} position={[side, -1.05, stage.z]}>
      <group rotation={[0, Math.PI, 0]}>
        {renderBuilding()}
      </group>

      {/* Base Platform */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[8, 0.5, 8]} />
        <meshStandardMaterial color="#272930" roughness={1.0} />
      </mesh>

      {/* Point light for stage glow */}
      <pointLight color={color} intensity={1} distance={20} position={[0, 4, 0]} />

      {/* Text perfectly facing camera via Billboard */}
      <Billboard position={[0, 9.6, 0]}>
        {/* Title */}
        <Text position={[0, 0.4, 0]} fontSize={0.65} color="#ffffff" anchorX="center" anchorY="middle" fontWeight="bold">
          {stage.title}
        </Text>

        {/* Description */}
        <Text position={[0, -0.3, 0]} fontSize={0.35} color="#a0a0a0" anchorX="center" anchorY="middle" maxWidth={7} fillOpacity={0.9}>
          {stage.desc}
        </Text>
      </Billboard>
    </group>
  );
};

/* ─── Dramatic data stream particles ─── */
const DataStream = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const count = 1200;

  const { positions, velocities, sizes, randoms } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    const sz = new Float32Array(count);
    const rnd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Distribute along path with clustering near stages
      const spread = Math.random() > 0.7 ? 3 : 8;
      pos[i * 3] = (Math.random() - 0.5) * spread * 2;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8 - 1;
      pos[i * 3 + 2] = Math.random() * -200;
      vel[i] = 0.2 + Math.random() * 1.2;
      sz[i] = 0.03 + Math.random() * 0.12;
      rnd[i] = Math.random();
    }
    return { positions: pos, velocities: vel, sizes: sz, randoms: rnd };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const pos = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < count; i++) {
        let z = pos.getZ(i);
        z += velocities[i] * 0.2;
        if (z > 5) {
          z = -200 + Math.random() * 10;
          pos.setX(i, (Math.random() - 0.5) * 16);
          pos.setY(i, (Math.random() - 0.5) * 8 - 1);
        }
        // Swirl effect
        const x = pos.getX(i);
        pos.setX(i, x + Math.sin(state.clock.elapsedTime * 2 + z * 0.1 + randoms[i] * 10) * 0.005);
        pos.setZ(i, z);
      }
      pos.needsUpdate = true;
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uCameraZ.value = state.camera.position.z;
    }
  });

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uCameraZ: { value: 0 },
  }), []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`
          attribute float aSize;
          varying float vDist;
          varying vec3 vPos;
          uniform float uCameraZ;
          void main() {
            vPos = position;
            vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
            vDist = abs(position.z - uCameraZ);
            gl_PointSize = aSize * 80.0 * (1.0 / -mvPos.z);
            gl_Position = projectionMatrix * mvPos;
          }
        `}
        fragmentShader={`
          uniform float uTime;
          varying float vDist;
          varying vec3 vPos;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            float glow = 1.0 - d * 2.0;
            glow = pow(glow, 2.0);
            
            // Color based on Z position (matching stage colors)
            float t = clamp(vPos.z / -170.0, 0.0, 1.0);
            vec3 col = mix(
              vec3(0.0, 1.0, 1.0),
              mix(
                vec3(0.04, 1.0, 0.04),
                mix(
                  vec3(0.66, 0.33, 0.97),
                  mix(vec3(0.92, 0.3, 0.6), vec3(0.98, 0.8, 0.08), smoothstep(0.6, 1.0, t)),
                  smoothstep(0.3, 0.6, t)
                ),
                smoothstep(0.15, 0.3, t)
              ),
              smoothstep(0.0, 0.15, t)
            );
            
            float fade = smoothstep(45.0, 3.0, vDist);
            float flicker = 0.7 + 0.3 * sin(uTime * 3.0 + vPos.z * 0.3 + vPos.x * 2.0);
            gl_FragColor = vec4(col, glow * fade * flicker * 0.8);
          }
        `}
      />
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
const CameraController = ({ journeyStarted, introDone, setIntroDone, onJourneyComplete }: { journeyStarted: boolean; introDone: boolean; setIntroDone: (b: boolean) => void; onJourneyComplete: () => void }) => {
  const scroll = useScroll();
  const { camera } = useThree();
  const completedRef = useRef(false);
  const introTime = useRef(0);

  useFrame((state, delta) => {
    if (!journeyStarted) {
      camera.position.set(0, 0.3, 4.5);
      camera.lookAt(0, 0, 0);
      return;
    }

    // Automatic swoop animation over 1.5 seconds right after pressing Enter
    if (!introDone) {
      introTime.current += delta;
      const p = Math.min(1, introTime.current / 1.5);
      const ease = p * p * (3 - 2 * p);

      const camX = THREE.MathUtils.lerp(0, 25, ease);
      const camY = THREE.MathUtils.lerp(0.3, 20, ease);
      // Swing Z all the way to negative offset to look backwards up the path
      const camZ = THREE.MathUtils.lerp(4.5, -35, ease);

      camera.position.set(camX, camY, camZ);

      const lookZ = THREE.MathUtils.lerp(0, -10, ease);
      camera.lookAt(0, 0, lookZ);

      if (p >= 1) {
        setIntroDone(true);
      }
      return;
    }

    const t = scroll.offset;

    // 0 to 0.90: Steady Isometric scroll forward
    if (t < 0.90) {
      const landscapeT = t / 0.90;
      const z = THREE.MathUtils.lerp(-10, -170, landscapeT);
      // Offset -25 puts camera AHEAD of the target, looking backwards (Bottom Right path)
      camera.position.set(25, 20, z - 25);
      camera.lookAt(0, 0, z);

      // 0.90 to 1.0: Transition back to center and dive out
    } else {
      const p = (t - 0.90) / 0.10;
      const ease = p * p * (3 - 2 * p);

      const z = THREE.MathUtils.lerp(-170, -195, ease);

      // Pull back down and forward to look at the front of the End CRT screen
      const camX = THREE.MathUtils.lerp(25, 0, ease);
      const camY = THREE.MathUtils.lerp(20, 0.3, ease);
      const camZ = THREE.MathUtils.lerp(z - 25, z + 4.5, ease);

      camera.position.set(camX, camY, camZ);
      camera.lookAt(0, 0.2, z);

      if (t > 0.98 && !completedRef.current) {
        completedRef.current = true;
        setTimeout(() => onJourneyComplete(), 0);
      }
    }
  });

  return null;
};

/* ─── Removed Tunnel Rings per flat design ─── */
const TunnelRings = () => {
  return null;
};

/* ─── Reverse Camera animation on end screen ─── */
const EndCameraController = () => {
  const { camera } = useThree();
  useFrame((state) => {
    // Zoom out over 1.5 seconds to simulate reversing out of the screen
    const t = Math.min(1, state.clock.elapsedTime / 1.5);
    const ease = 1 - Math.pow(1 - t, 3); // cubic ease out
    camera.position.set(0, 0.3, THREE.MathUtils.lerp(-3.0, 4.5, ease));
    camera.lookAt(0, 0.2, 0);
  });
  return null;
};

/* ─── End CRT Monitor showing AI response ─── */
const EndScreenContent = ({ question, response, isLoading, error }: { question: string; response: string; isLoading: boolean; error: string | null }) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
  });

  const displayText = error
    ? `Feil: ${error}`
    : isLoading && !response
      ? "Laster svar..."
      : response || "";

  // Truncate for display in 3D text
  const truncated = displayText.length > 300 ? displayText.slice(0, 300) + "..." : displayText;

  return (
    <group ref={groupRef} position={[0, 0, 0.01]}>
      <Text position={[0, 0.55, 0]} fontSize={0.18} color="#0aff0a" anchorX="center" anchorY="middle">
        AI Svar
      </Text>
      <mesh position={[0, 0.42, 0]}>
        <planeGeometry args={[1.6, 0.003]} />
        <meshBasicMaterial color="#0aff0a" opacity={0.3} transparent />
      </mesh>
      <Text position={[-0.78, 0.3, 0]} fontSize={0.045} color="#078a07" anchorX="left" anchorY="top" maxWidth={1.5}>
        {">"} {question}
      </Text>
      <mesh position={[0, 0.15, 0]}>
        <planeGeometry args={[1.4, 0.002]} />
        <meshBasicMaterial color="#0aff0a" opacity={0.15} transparent />
      </mesh>
      <Text position={[-0.78, 0.08, 0]} fontSize={0.05} color="#0aff0a" anchorX="left" anchorY="top" maxWidth={1.5} lineHeight={1.4}>
        {truncated}
      </Text>
      {isLoading && <BlinkingCursor x={-0.78 + Math.min((truncated.length % 40) * 0.033, 0.72)} />}
      {!isLoading && !error && (
        <Text position={[-0.78, -0.65, 0]} fontSize={0.04} color="#056605" anchorX="left" anchorY="middle">
          FERDIG — Scroll opp for å starte på nytt
        </Text>
      )}
    </group>
  );
};


/* ─── Complete scene ─── */
const FullScene = ({ inputText, journeyStarted, introDone, setIntroDone, onJourneyComplete }: { inputText: string; journeyStarted: boolean; introDone: boolean; setIntroDone: (b: boolean) => void; onJourneyComplete: () => void }) => {
  return (
    <>
      <color attach="background" args={["#1c1d21"]} />
      <fog attach="fog" args={["#1c1d21", 40, 150]} />

      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 15, 10]} intensity={1.5} color="#ffffff" castShadow />
      <pointLight position={[0, 5, 0]} intensity={1.0} color="#ffffff" distance={20} />

      <CameraController journeyStarted={journeyStarted} introDone={introDone} setIntroDone={setIntroDone} onJourneyComplete={onJourneyComplete} />

      <CRTMonitor inputText={inputText} visible={!journeyStarted} />

      {!journeyStarted && <FloatingParticles />}

      {!journeyStarted && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]}>
          <planeGeometry args={[40, 40]} />
          <meshStandardMaterial color="#1c1d21" roughness={1.0} metalness={0.0} />
        </mesh>
      )}

      {journeyStarted && (
        <>
          <IsometricTerrain />
          <GridFloor />
          <DataStream />
          <ProgressLine />

          {STAGES.map((stage, i) => (
            <StageMarker key={i} stage={stage} index={i} />
          ))}

          {/* Subtle Distant block pillars instead of cylinders */}
          {Array.from({ length: 15 }).map((_, i) => (
            <group key={`pillar-${i}`} position={[(i % 2 === 0 ? -1 : 1) * (18 + Math.random() * 8), -1, -i * 14 - 10]}>
              <mesh>
                <boxGeometry args={[2 + Math.random() * 2, 8 + Math.random() * 8, 2 + Math.random() * 2]} />
                <meshStandardMaterial color="#32343b" transparent opacity={0.6} roughness={1.0} />
              </mesh>
            </group>
          ))}
        </>
      )}
    </>
  );
};

/* ─── Exported component ─── */
const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const CRTMonitorScene = () => {
  const [inputText, setInputText] = useState("");
  const [journeyStarted, setJourneyStarted] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [journeyComplete, setJourneyComplete] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Helper to generate a simple browser fingerprint
  const getFingerprint = useCallback(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('fingerprint', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('fingerprint', 4, 17);
    }
    return (canvas.toDataURL().slice(-50) + navigator.userAgent.slice(0, 50)).replace(/[^a-zA-Z0-9]/g, '');
  }, []);

  const startAIStream = useCallback(async (question: string) => {
    setIsLoadingAI(true);
    setAiResponse("");
    setAiError(null);

    try {
      // Get session OR use anonymous fingerprint
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: { session } } = await supabase.auth.getSession();

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (session) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      } else {
        // Anonymous access
        headers["Authorization"] = `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`;
        headers["x-client-fingerprint"] = getFingerprint();
      }

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ question }),
      });

      if (!resp.ok || !resp.body) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Feil ${resp.status}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) setAiResponse(prev => prev + content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Final flush
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) setAiResponse(prev => prev + content);
          } catch { /* ignore */ }
        }
      }
    } catch (e) {
      console.error("AI stream error:", e);
      setAiError(e instanceof Error ? e.message : "Ukjent feil");
    } finally {
      setIsLoadingAI(false);
    }
  }, []);

  const handleJourneyComplete = useCallback(() => {
    setJourneyComplete(true);
  }, []);

  // Global keyboard listener for typing into the CRT screen
  useEffect(() => {
    if (journeyStarted) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        setInputText(prev => {
          if (prev.trim()) {
            setJourneyStarted(true);
            startAIStream(prev.trim());
          }
          return prev;
        });
        return;
      }
      if (e.key === "Backspace") {
        setInputText(prev => prev.slice(0, -1));
        return;
      }
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        setInputText(prev => prev + e.key);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [journeyStarted, startAIStream]);

  // Show answer CRT screen when journey is complete
  if (journeyComplete) {
    const displayText = aiError
      ? `Feil: ${aiError}`
      : isLoadingAI && !aiResponse
        ? ""
        : aiResponse || "";

    return (
      <div className="relative w-full" style={{ height: "85vh" }}>
        <div className="sticky top-0 h-screen w-full">
          <Canvas
            camera={{ position: [0, 0.3, 4.5], fov: 45 }}
            gl={{ antialias: true, alpha: false }}
            dpr={[1, 2]}
          >
            <color attach="background" args={["#1c1d21"]} />
            <fog attach="fog" args={["#1c1d21", 40, 150]} />
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 15, 10]} intensity={1.5} color="#ffffff" />
            <pointLight position={[0, 5, 0]} intensity={1.0} color="#ffffff" distance={20} />

            <EndCameraController />

            {/* Same CRT monitor as start, but showing the answer */}
            <group position={[0, 0.2, 0]}>
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
                <EndScreenContent question={inputText} response={displayText} isLoading={isLoadingAI} error={aiError} />
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
              <Text position={[0, -0.78, 0.46]} fontSize={0.06} color="#666666" anchorX="center">
                AIGuidebook CRT-2024
              </Text>
            </group>

            <FloatingParticles />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]}>
              <planeGeometry args={[40, 40]} />
              <meshStandardMaterial color="#1c1d21" roughness={1.0} metalness={0.0} />
            </mesh>
          </Canvas>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <p className="font-mono text-xs text-[#0aff0a]/50 text-center">
              Trykk på skjermen for å starte på nytt
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full" style={{ height: journeyStarted ? "500vh" : "85vh" }}>
      <div className="sticky top-0 h-screen w-full">
        <Canvas
          camera={{ position: [0, 0.3, 4.5], fov: 45 }}
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 2]}
        >
          <ScrollControls pages={journeyStarted && introDone ? 5 : 0} damping={0.25}>
            <FullScene inputText={inputText} journeyStarted={journeyStarted} introDone={introDone} setIntroDone={setIntroDone} onJourneyComplete={handleJourneyComplete} />
          </ScrollControls>
        </Canvas>

        {!journeyStarted && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <p className="font-mono text-xs text-[#0aff0a]/50 text-center">
              Skriv et spørsmål og trykk Enter
            </p>
          </div>
        )}

        {journeyStarted && introDone && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="flex flex-col items-center gap-1">
              <p className="font-mono text-xs text-[#0aff0a]/50">Scroll for å utforske</p>
              <div className="h-6 w-4 rounded-full border border-[#0aff0a]/30">
                <div className="mx-auto mt-1 h-1.5 w-1 rounded-full bg-[#0aff0a]/60 animate-bounce" />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CRTMonitorScene;
