import logoSvg from "@/assets/logo.svg";

interface LogoProps {
  variant?: "dark" | "light" | "auto";
  className?: string;
}

const Logo = ({ variant = "auto", className = "h-8" }: LogoProps) => {
  return (
    <img
      src={logoSvg}
      alt="AI Guidebook"
      className={`${className} w-auto ${variant === "auto" ? "dark:invert" : ""}`}
      style={{
        filter: variant === "light" ? "invert(1)" : variant === "dark" ? "none" : undefined,
      }}
    />
  );
};

export default Logo;
