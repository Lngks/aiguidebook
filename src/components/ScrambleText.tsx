import { useState, useEffect, useCallback, useRef } from "react";
import { animate } from "framer-motion";

interface ScrambleTextProps {
    text: string;
    duration?: number;
    className?: string;
    triggerOnHover?: boolean;
}

// Characters derived from screenshots: ~{#□◈▓_':?@●[○(&‡■+}
const glyphs = "~{#\u25A1\u25C8\u2593_':?@\u25CF[\u25CB(&\u2021\u25A0+}";

export const ScrambleText = ({
    text,
    duration = 1,
    className = "",
    triggerOnHover = true,
}: ScrambleTextProps) => {
    const [displayedText, setDisplayedText] = useState(text);
    const animatingRef = useRef(false);
    const lastStepRef = useRef(-1);

    const startScramble = useCallback(() => {
        if (animatingRef.current) return;
        animatingRef.current = true;
        lastStepRef.current = -1;

        const totalSteps = duration * 15;

        const controls = animate(0, 1, {
            duration: duration,
            ease: "linear",
            onUpdate: (latest) => {
                const currentStep = Math.floor(latest * totalSteps);
                if (latest < 1 && currentStep !== lastStepRef.current) {
                    lastStepRef.current = currentStep;
                    const scrambled = text
                        .split("")
                        .map((char) => (char === " " ? " " : glyphs[Math.floor(Math.random() * glyphs.length)]))
                        .join("");
                    setDisplayedText(scrambled);
                }
            },
            onComplete: () => {
                setDisplayedText(text);
                animatingRef.current = false;
            },
        });

        return () => controls.stop();
    }, [text, duration]);

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;
        let stopScramble: (() => void) | undefined;
        let hasStarted = false;

        const handleStart = () => {
            if (hasStarted) return;
            hasStarted = true;
            timeoutId = setTimeout(() => {
                stopScramble = startScramble();
            }, 100);
        };

        if (document.readyState === "complete") {
            handleStart();
        } else {
            window.addEventListener("load", handleStart);
        }

        return () => {
            window.removeEventListener("load", handleStart);
            clearTimeout(timeoutId);
            if (stopScramble) stopScramble();
        };
    }, [startScramble]);

    return (
        <span
            className={className}
            onMouseEnter={triggerOnHover ? startScramble : undefined}
        >
            {displayedText}
        </span>
    );
};
