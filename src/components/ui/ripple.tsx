import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface RippleHandle {
    addRipple: (event: React.PointerEvent<any> | MouseEvent) => void;
}

interface RippleProps {
    color?: string;
    duration?: number;
}

interface RippleData {
    x: number;
    y: number;
    id: number;
    size: number;
}

export const Ripple = React.forwardRef<RippleHandle, RippleProps>(
    ({ color = "rgba(255, 255, 255, 0.4)", duration = 300 }, ref) => {
        const [ripples, setRipples] = React.useState<RippleData[]>([]);

        React.useImperativeHandle(ref, () => ({
            addRipple: (event: React.PointerEvent<any> | MouseEvent) => {
                const container = (event.currentTarget as HTMLElement);
                if (!container) return;

                const rect = container.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = ("clientX" in event ? event.clientX : 0) - rect.left;
                const y = ("clientY" in event ? event.clientY : 0) - rect.top;

                const newRipple: RippleData = {
                    x,
                    y,
                    size,
                    id: Date.now(),
                };

                setRipples((prev) => [...prev, newRipple]);
            },
        }));

        return (
            <span className="absolute inset-0 z-0 overflow-hidden rounded-[inherit] pointer-events-none">
                <AnimatePresence>
                    {ripples.map((ripple) => (
                        <motion.span
                            key={ripple.id}
                            initial={{ scale: 0, opacity: 0.8 }}
                            animate={{ scale: 20, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: duration / 1000, ease: "easeOut" }}
                            onAnimationComplete={() => {
                                setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
                            }}
                            className="absolute rounded-full"
                            style={{
                                top: ripple.y,
                                left: ripple.x,
                                width: ripple.size * 0.4,
                                height: ripple.size * 0.4,
                                backgroundColor: color,
                                transform: "translate(-50%, -50%)",
                            }}
                        />
                    ))}
                </AnimatePresence>
            </span>
        );
    }
);

Ripple.displayName = "Ripple";
