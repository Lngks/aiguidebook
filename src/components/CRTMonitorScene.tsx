import { useRef, useMemo, useState, useCallback, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, RoundedBox, ScrollControls, useScroll, Html } from "@react-three/drei";
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

/* ─── Wireframe terrain with dramatic heights ─── */
const WireframeTerrain = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(80, 280, 120, 400);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getY(i);
      // More dramatic multi-octave terrain
      const ridge = Math.abs(Math.sin(x * 0.2 + z * 0.05)) * 3.0;
      const h =
        ridge +
        Math.sin(x * 0.15 + z * 0.08) * 2.5 +
        Math.sin(x * 0.5 - z * 0.12) * 1.2 +
        Math.cos(x * 0.08 + z * 0.2) * 2.0 +
        Math.sin(x * 1.5 + z * 0.6) * 0.4 +
        Math.sin(x * 0.05) * Math.cos(z * 0.03) * 4.0;
      // Create valleys near the center path
      const centerFalloff = Math.exp(-x * x * 0.01);
      pos.setZ(i, h * (1 - centerFalloff * 0.6));
    }
    g.computeVertexNormals();
    return g;
  }, []);

  // Shader for color-shifting terrain
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uCameraZ: { value: 0 },
    uStageColors: {
      value: STAGES.map(s => new THREE.Color(s.color))
    },
    uStagePositions: {
      value: STAGES.map(s => s.z)
    },
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uCameraZ.value = state.camera.position.z;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, -110]}>
      <shaderMaterial
        ref={materialRef}
        wireframe
        transparent
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vWorldPos;
          varying float vHeight;
          void main() {
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vWorldPos = worldPos.xyz;
            vHeight = position.z; // height before rotation
            gl_Position = projectionMatrix * viewMatrix * worldPos;
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform float uCameraZ;
          uniform vec3 uStageColors[6];
          uniform float uStagePositions[6];
          varying vec3 vWorldPos;
          varying float vHeight;
          
          void main() {
            // Find closest stage for color
            float worldZ = vWorldPos.z;
            vec3 col = uStageColors[0];
            for (int i = 0; i < 5; i++) {
              if (worldZ < uStagePositions[i] && worldZ >= uStagePositions[i + 1]) {
                float t = (worldZ - uStagePositions[i]) / (uStagePositions[i + 1] - uStagePositions[i]);
                col = mix(uStageColors[i], uStageColors[i + 1], t);
              }
            }
            if (worldZ < uStagePositions[5]) col = uStageColors[5];
            
            // Height-based brightness
            float heightGlow = smoothstep(0.0, 4.0, vHeight) * 0.6;
            
            // Distance fade
            float dist = abs(worldZ - uCameraZ);
            float fade = smoothstep(50.0, 5.0, dist);
            
            // Pulse effect
            float pulse = 0.7 + 0.3 * sin(uTime * 1.5 + worldZ * 0.05);
            
            float alpha = (0.15 + heightGlow) * fade * pulse;
            gl_FragColor = vec4(col, alpha);
          }
        `}
      />
    </mesh>
  );
};

/* ─── Glowing grid floor ─── */
const GridFloor = () => {
  return (
    <group position={[0, -3.01, -100]}>
      <gridHelper args={[280, 140, "#0a4a0a", "#062006"]} />
    </group>
  );
};

/* ─── Glowing progress line connecting all stations ─── */
const ProgressLine = () => {
  const lineRef = useRef<THREE.Line>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(0);

  // Build the path curve through all stages
  const { curve, tubeGeo } = useMemo(() => {
    const points: THREE.Vector3[] = [];
    // Start from origin
    points.push(new THREE.Vector3(0, -0.5, -5));
    STAGES.forEach((stage, i) => {
      const side = i % 2 === 0 ? -6 : 6;
      points.push(new THREE.Vector3(side * 0.3, -0.5, stage.z + 5));
      points.push(new THREE.Vector3(side, -1, stage.z));
      points.push(new THREE.Vector3(side * 0.3, -0.5, stage.z - 5));
    });
    points.push(new THREE.Vector3(0, 0, -185));

    const c = new THREE.CatmullRomCurve3(points);
    const tg = new THREE.TubeGeometry(c, 300, 0.06, 8, false);
    return { curve: c, tubeGeo: tg };
  }, []);

  // Progress indicator sphere
  useFrame((state) => {
    const camZ = state.camera.position.z;
    // Map camera Z to progress (0 at z=0, 1 at z=-185)
    const t = Math.max(0, Math.min(1, camZ / -185));
    progressRef.current = t;

    if (glowRef.current) {
      const point = curve.getPoint(t);
      glowRef.current.position.copy(point);
      const s = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
      glowRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group>
      {/* Full path line (dim) */}
      <mesh geometry={tubeGeo}>
        <meshBasicMaterial color="#ffffff" transparent opacity={0.08} />
      </mesh>

      {/* Glowing active path — rendered with shader for progress effect */}
      <mesh geometry={tubeGeo}>
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
              float show = smoothstep(uProgress + 0.02, uProgress - 0.01, t);
              // Color gradient
              vec3 col = mix(uColor1, uColor2, t);
              // Energy pulse along the line
              float pulse = 0.6 + 0.4 * sin(t * 40.0 - uTime * 5.0);
              float glow = show * pulse;
              gl_FragColor = vec4(col, glow * 0.7);
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

      {/* Progress indicator sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
      {/* Outer glow */}
      <mesh ref={(m) => {
        if (m && glowRef.current) {
          // Sync with glow ref via parent
        }
      }}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
      </mesh>
    </group>
  );
};

/* ─── Stage marker with unique color ─── */
const StageMarker = ({ stage, index }: { stage: typeof STAGES[0]; index: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = -1 + Math.sin(state.clock.elapsedTime * 0.7 + index) * 0.3;
    }
    if (glowRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 2 + index * 0.5) * 0.2;
      glowRef.current.scale.set(s, s, s);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5 + index;
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
    }
  });

  const side = index % 2 === 0 ? -6 : 6;
  const color = stage.color;

  return (
    <group ref={groupRef} position={[side, -1, stage.z]}>
      {/* Inner glowing orb */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>
      {/* Outer glow */}
      <mesh>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} />
      </mesh>
      {/* Orbiting ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[0.9, 0.02, 8, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>

      {/* Vertical beam */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 3, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} />
      </mesh>

      {/* Point light for stage glow */}
      <pointLight color={color} intensity={2} distance={12} />

      {/* Title */}
      <Text position={[0, 1.6, 0]} fontSize={0.55} color={color} anchorX="center" anchorY="middle" fontWeight="bold">
        {stage.title}
      </Text>

      {/* Description */}
      <Text position={[0, 0.9, 0]} fontSize={0.25} color={color} anchorX="center" anchorY="middle" maxWidth={6} fillOpacity={0.7}>
        {stage.desc}
      </Text>
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
const CameraController = ({ journeyStarted, onJourneyComplete }: { journeyStarted: boolean; onJourneyComplete: () => void }) => {
  const scroll = useScroll();
  const { camera } = useThree();
  const completedRef = useRef(false);

  useFrame(() => {
    if (!journeyStarted) {
      camera.position.set(0, 0.3, 4.5);
      camera.lookAt(0, 0, 0);
      return;
    }

    const t = scroll.offset;

    if (t < 0.08) {
      const p = t / 0.08;
      const ease = p * p * (3 - 2 * p);
      camera.position.set(
        THREE.MathUtils.lerp(0, 12, ease),
        THREE.MathUtils.lerp(0.3, 14, ease),
        THREE.MathUtils.lerp(4.5, 12, ease)
      );
      const lookZ = THREE.MathUtils.lerp(0, -10, ease);
      camera.lookAt(0, 0, lookZ);
    } else {
      const landscapeT = (t - 0.08) / 0.92;
      const z = THREE.MathUtils.lerp(0, -185, landscapeT);

      // Isometric-style elevated offset view
      const isoX = 12 + Math.sin(landscapeT * Math.PI * 2) * 3;
      const isoY = 14 + Math.sin(landscapeT * Math.PI * 1.5) * 2;

      camera.position.set(isoX, isoY, z + 12);
      camera.lookAt(0, -2, z - 10);

      // Trigger journey complete when near the end (deferred to avoid unmounting during useFrame)
      if (landscapeT > 0.95 && !completedRef.current) {
        completedRef.current = true;
        setTimeout(() => onJourneyComplete(), 0);
      }
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
const FullScene = ({ inputText, journeyStarted, onJourneyComplete }: { inputText: string; journeyStarted: boolean; onJourneyComplete: () => void }) => {
  return (
    <>
      <color attach="background" args={["#050a05"]} />
      <fog attach="fog" args={["#050a05", 10, 50]} />

      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={0.6} color="#ffffff" />
      <pointLight position={[0, 0, 3]} intensity={0.8} color="#0aff0a" distance={8} />

      <CameraController journeyStarted={journeyStarted} onJourneyComplete={onJourneyComplete} />

      <CRTMonitor inputText={inputText} visible={!journeyStarted} />
      {!journeyStarted && <FloatingParticles />}

      {!journeyStarted && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#050a05" roughness={0.3} metalness={0.8} />
        </mesh>
      )}

      {journeyStarted && (
        <>
          <TunnelRings />
          <WireframeTerrain />
          <GridFloor />
          <DataStream />
          <ProgressLine />

          {STAGES.map((stage, i) => (
            <StageMarker key={i} stage={stage} index={i} />
          ))}

          {/* Distant glow pillars */}
          {Array.from({ length: 15 }).map((_, i) => (
            <group key={`pillar-${i}`} position={[(i % 2 === 0 ? -1 : 1) * (14 + Math.random() * 5), -3, -i * 14 - 10]}>
              <mesh>
                <cylinderGeometry args={[0.05, 0.05, 10 + Math.random() * 5, 8]} />
                <meshBasicMaterial color={STAGES[i % STAGES.length].color} transparent opacity={0.1} />
              </mesh>
              <pointLight position={[0, 4, 0]} intensity={0.4} color={STAGES[i % STAGES.length].color} distance={8} />
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
            <color attach="background" args={["#050a05"]} />
            <ambientLight intensity={0.4} />
            <directionalLight position={[3, 4, 5]} intensity={0.6} color="#ffffff" />
            <pointLight position={[0, 0, 3]} intensity={0.8} color="#0aff0a" distance={8} />

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
              <planeGeometry args={[20, 20]} />
              <meshStandardMaterial color="#050a05" roughness={0.3} metalness={0.8} />
            </mesh>
          </Canvas>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <p className="font-mono text-xs text-[#0aff0a]/50 text-center">
              Trykk på AI-logoen for å starte på nytt
            </p>
          </div>

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#050a05_100%)]" />
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
          <ScrollControls pages={journeyStarted ? 5 : 0} damping={0.25}>
            <FullScene inputText={inputText} journeyStarted={journeyStarted} onJourneyComplete={handleJourneyComplete} />
          </ScrollControls>
        </Canvas>

        {!journeyStarted && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <p className="font-mono text-xs text-[#0aff0a]/50 text-center">
              Skriv et spørsmål og trykk Enter
            </p>
          </div>
        )}

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

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#050a05_100%)]" />
      </div>
    </div>
  );
};

export default CRTMonitorScene;
