import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Ripple, type RippleHandle } from "./ripple";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "text-foreground hover:text-accent-foreground",
        destructive: "text-foreground hover:text-destructive-foreground",
        outline: "border border-input bg-background/30 backdrop-blur-xl rounded-lg hover:bg-accent/10 hover:text-accent-foreground transition-all",
        secondary: "text-foreground hover:text-foreground",
        tertiary: "text-foreground hover:text-tertiary-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors",
        link: "text-primary underline-offset-4 hover:underline",
        custom: "text-foreground hover:text-accent-foreground",
      },
      size: {
        default: "h-10",
        sm: "h-9",
        lg: "h-11",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  showRipple?: boolean;
  rippleColor?: string;
}

const needsGradientWrapper = (v?: string | null) =>
  !v || v === "default" || v === "destructive" || v === "secondary" || v === "tertiary" || v === "custom";

const gradientClasses: Record<string, string> = {
  default: "bg-gradient-to-r from-accent to-accent-secondary",
  destructive: "bg-gradient-to-r from-destructive to-destructive/60",
  secondary: "bg-gradient-to-r from-[hsl(0_0%_40%)] to-[hsl(0_0%_20%)]",
  tertiary: "bg-gradient-to-r from-tertiary to-tertiary-secondary",
  custom: "bg-gradient-to-r from-[var(--btn-gradient-from)] to-[var(--btn-gradient-to)]",
};

// --- EDIT SIZE AND COLORS HERE ---
const innerVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap w-full rounded-[calc(var(--radius))] backdrop-blur-xl transition-all duration-200 text-sm font-medium h-full",
  {
    variants: {
      variant: {
        // Defines the background of the inner part of (gradient) buttons
        default: "bg-background/95 group-hover:bg-background/10",
        destructive: "bg-background/95 group-hover:bg-background/10",
        secondary: "bg-background/95 group-hover:bg-background/10",
        tertiary: "bg-background/95 group-hover:bg-background/10 group-hover:text-background",
        custom: "bg-background/95 group-hover:bg-background/10",
        // These variants handle their own background in buttonVariants
        outline: "",
        ghost: "",
        link: "",
      },
      size: {
        default: "px-6 py-2.5",
        sm: "px-4 py-2",
        lg: "px-10 py-3",
        icon: "",
      },
    },
    defaultVariants: { size: "default", variant: "default" },
  },
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, showRipple = true, rippleColor, children, onPointerDown, ...props }, ref) => {
    const rippleRef = React.useRef<RippleHandle>(null);
    const wrap = needsGradientWrapper(variant);

    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
      if (showRipple) {
        rippleRef.current?.addRipple(e);
      }
      onPointerDown?.(e);
    };

    const rippleElement = showRipple && (
      <Ripple
        ref={rippleRef}
        color={rippleColor || (variant === "ghost" || variant === "outline" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.35)")}
      />
    );

    if (wrap) {
      const { style, ...rest } = props;
      if (asChild) {
        const Comp = Slot;
        return (
          <span
            className={cn("group relative inline-flex p-[2px] overflow-hidden rounded-lg cursor-pointer", gradientClasses[variant || "default"], buttonVariants({ size, className }))}
            onPointerDown={handlePointerDown as any}
            style={style}
          >
            <Comp ref={ref} className={innerVariants({ variant: variant as any, size })} {...rest}>
              <span className="relative z-10 flex items-center gap-2">
                {rippleElement}
                {children}
              </span>
            </Comp>
          </span>
        );
      }

      return (
        <button
          ref={ref}
          className={cn(
            "group relative inline-flex p-[2px] overflow-hidden rounded-lg",
            gradientClasses[variant || "default"],
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
            buttonVariants({ size, className })
          )}
          onPointerDown={handlePointerDown}
          style={style}
          {...rest}
        >
          <span className={innerVariants({ variant: variant as any, size })}>
            {rippleElement}
            <span className="relative z-10 flex items-center gap-2">{children}</span>
          </span>
        </button>
      );
    }

    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onPointerDown={handlePointerDown}
        style={props.style}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
        {rippleElement}
      </Comp>
    );
  },
);
Button.displayName = "Button";

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
