import logoSvg from "@/assets/logo.svg";

interface LogoProps {
  variant?: "dark" | "light";
  className?: string;
}

const Logo = ({ variant = "dark", className = "h-8" }: LogoProps) => {
  return (
    <img
      src={logoSvg}
      alt="AI Guidebook"
      className={`${className} w-auto`}
      style={{
        filter: variant === "light" ? "invert(1)" : "none",
      }}
    />
  );
};

export default Logo;
