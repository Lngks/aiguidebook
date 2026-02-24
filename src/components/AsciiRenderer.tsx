import { useEffect, useLayoutEffect, useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js';

type AsciiRendererProps = {
    renderIndex?: number;
    bgColor?: string;
    fgColor?: string;
    characters?: string;
    invert?: boolean;
    resolution?: number;
};

export function AsciiRenderer({
    renderIndex = 1,
    bgColor = 'black',
    fgColor = 'white',
    characters = ' .:-+*=%@#',
    invert = false,
    resolution = 0.15,
}: AsciiRendererProps) {
    // Reactive state
    const { gl, scene, camera, size } = useThree();

    // Create effect
    const effect = useMemo(() => {
        const effect = new AsciiEffect(gl, characters, { invert, resolution });
        effect.domElement.style.position = 'absolute';
        effect.domElement.style.top = '0px';
        effect.domElement.style.left = '0px';
        effect.domElement.style.color = fgColor;
        effect.domElement.style.backgroundColor = bgColor;
        effect.domElement.style.pointerEvents = 'none';
        return effect;
    }, [gl, characters, invert, fgColor, bgColor]);

    // Appending/Removing effect from DOM
    useLayoutEffect(() => {
        effect.setSize(size.width, size.height);
        gl.domElement.style.opacity = '0'; // Hide original canvas
        gl.domElement.parentNode?.appendChild(effect.domElement);
        return () => {
            gl.domElement.style.opacity = '1';
            gl.domElement.parentNode?.removeChild(effect.domElement);
        };
    }, [effect, size, gl]);

    // Render loop
    useFrame(() => {
        effect.render(scene, camera);
    }, renderIndex);

    return null;
}
