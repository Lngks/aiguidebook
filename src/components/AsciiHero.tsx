import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { AsciiRenderer } from "./AsciiRenderer";
import { useGLTF, Center, OrbitControls } from "@react-three/drei";

function CustomModel() {
    const { scene } = useGLTF("/network.glb");

    // Force material to be bright white so ASCII sees it
    useEffect(() => {
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.material = new THREE.MeshPhysicalMaterial({
                    color: 'white',
                    roughness: 0.2,
                    metalness: 0.8,
                    emissive: 'white',
                    emissiveIntensity: 0.5 // Makes it glow to be picked up by ASCII
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

const AsciiHero = () => {
    return (
        <div className="absolute inset-0 w-full h-full font-mono text-xs md:text-sm bg-transparent">
            {/* Camera moved further back and UP to view larger model */}
            <Canvas camera={{ position: [0, 5, 200], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={10} distance={50} />
                <pointLight position={[-10, -5, -10]} intensity={5} color="white" />

                <CustomModel />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    maxPolarAngle={Math.PI / 1.5}
                    minPolarAngle={Math.PI / 3}
                    autoRotate
                    autoRotateSpeed={0.5}
                />
                <AsciiRenderer fgColor="hsl(var(--accent))" bgColor="transparent" characters=" .:-+*=%@#" invert={false} />
            </Canvas>
        </div>
    );
};

export default AsciiHero;
