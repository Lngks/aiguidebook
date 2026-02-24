import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import { AsciiRenderer } from "./AsciiRenderer";
import { useGLTF, Center, OrbitControls } from "@react-three/drei";

function CustomModel() {
    const { scene } = useGLTF("/network.glb");

    useEffect(() => {
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.material = new THREE.MeshStandardMaterial({
                    color: '#cccccc', // Use light gray instead of pure white to avoid saturation
                    roughness: 0.5,
                    metalness: 0.2,
                    emissive: '#444444', // Subtle glow to help lines span multiple ASCII cells
                    emissiveIntensity: 0.2
                });
            }
        });
    }, [scene]);

    return (
        <Center>
            {/* Scale adjusted - try 1, 10, or 0.1 depending on model */}
            <primitive object={scene} scale={1.5} />
        </Center>
    );
}

const AsciiHero = ({ isMobile = false }: { isMobile?: boolean }) => {
    return (
        <div className="absolute inset-0 w-full h-full font-mono text-xs md:text-sm bg-transparent">
            {/* Camera moved further back and UP to view larger model */}
            <Canvas camera={{ position: [0, 5, 200], fov: 45 }}>
                <ambientLight intensity={0.2} />
                <directionalLight position={[10, 10, 5]} intensity={0.8} />
                <directionalLight position={[-10, -10, -5]} intensity={0.5} />
                <spotLight position={[50, 50, 50]} angle={0.15} penumbra={1} intensity={2} distance={500} />
                <pointLight position={[0, 0, 50]} intensity={1.5} color="white" />

                <CustomModel />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    enableRotate={!isMobile}
                    maxPolarAngle={Math.PI / 1.5}
                    minPolarAngle={Math.PI / 3}
                    autoRotate
                    autoRotateSpeed={0.2} // Slower rotation reduces jarring flicker
                />
                <AsciiRenderer
                    fgColor="hsl(var(--accent))"
                    bgColor="transparent"
                    characters=" .'`,^:;Il!i~+_-?][}{1)(|\/tfjrxnuvczMWXB01@#%&"
                    invert={false}
                    resolution={0.2}
                />
            </Canvas>
        </div>
    );
};

export default AsciiHero;
