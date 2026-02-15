import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "p-[2px] overflow-hidden rounded-lg bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--accent-secondary))] text-foreground hover:text-accent-foreground [&>span]:relative [&>span]:inline-flex [&>span]:items-center [&>span]:justify-center [&>span]:w-full [&>span]:rounded-[calc(var(--radius))] [&>span]:bg-background/95 [&>span]:backdrop-blur-xl [&>span]:transition-all [&>span]:duration-200 hover:[&>span]:bg-transparent",
        destructive:
          "p-[2px] overflow-hidden rounded-lg bg-gradient-to-r from-destructive to-destructive/60 text-foreground hover:text-destructive-foreground [&>span]:relative [&>span]:inline-flex [&>span]:items-center [&>span]:justify-center [&>span]:w-full [&>span]:rounded-[calc(var(--radius))] [&>span]:bg-background/95 [&>span]:backdrop-blur-xl [&>span]:transition-all [&>span]:duration-200 hover:[&>span]:bg-transparent",
        outline:
          "border border-input bg-background/60 backdrop-blur-xl rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors",
        secondary:
          "p-[0.5px] overflow-hidden rounded-lg bg-gradient-to-r from-muted-foreground to-muted text-foreground hover:text-foreground [&>span]:relative [&>span]:inline-flex [&>span]:items-center [&>span]:justify-center [&>span]:w-full [&>span]:rounded-[calc(var(--radius))] [&>span]:bg-background/95 [&>span]:backdrop-blur-xl [&>span]:transition-all [&>span]:duration-200 hover:[&>span]:bg-transparent",
        tertiary:
          "p-[0.5px] overflow-hidden rounded-lg bg-gradient-to-r from-muted-foreground to-muted text-foreground hover:text-foreground [&>span]:relative [&>span]:inline-flex [&>span]:items-center [&>span]:justify-center [&>span]:w-full [&>span]:rounded-[calc(var(--radius))] [&>span]:bg-background/95 [&>span]:backdrop-blur-xl [&>span]:transition-all [&>span]:duration-200 hover:[&>span]:bg-transparent",
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 [&>span]:px-4 [&>span]:py-2",
        sm: "h-9 [&>span]:px-3 [&>span]:py-1.5",
        lg: "h-11 [&>span]:px-8 [&>span]:py-2.5",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const needsGradientWrapper = (v?: string | null) =>
  !v || v === "default" || v === "destructive" || v === "secondary";

const gradientClasses: Record<string, string> = {
  default: "bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--accent-secondary))]",
  destructive: "bg-gradient-to-r from-destructive to-destructive/60",
  secondary: "bg-gradient-to-r from-[hsl(0_0%_60%)] to-[hsl(0_0%_30%)]",
};

const innerVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap w-full rounded-[calc(var(--radius))] bg-background/95 backdrop-blur-xl transition-all duration-200 text-sm font-medium text-foreground group-hover:bg-transparent",
  {
    variants: {
      size: {
        default: "px-6 py-2.5",
        sm: "px-4 py-2",
        lg: "px-10 py-3",
        icon: "",
      },
    },
    defaultVariants: { size: "default" },
  },
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const wrap = needsGradientWrapper(variant);

    if (wrap) {
      const Comp = asChild ? Slot : "button";
      // For asChild (Link), we wrap in an outer div for the gradient border
      if (asChild) {
        return (
          <span
            className={cn(
              "group relative inline-flex p-[2px] overflow-hidden rounded-lg cursor-pointer",
              gradientClasses[variant || "default"],
              "focus-within:ring-2 focus-within:ring-ring",
              className,
            )}
          >
            <Comp
              ref={ref}
              className={innerVariants({ size })}
              {...props}
            >
              {children}
            </Comp>
          </span>
        );
      }
      return (
        <Comp
          ref={ref}
          className={cn(
            "group relative inline-flex p-[2px] overflow-hidden rounded-lg",
            gradientClasses[variant || "default"],
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
            className,
          )}
          {...props}
        >
          <span className={innerVariants({ size })}>{children}</span>
        </Comp>
      );
    }

    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
