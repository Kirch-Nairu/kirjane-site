import type { ImgHTMLAttributes } from "react";

interface BrandMarkProps extends ImgHTMLAttributes<HTMLImageElement> {
  variant?: "color" | "white" | "green" | "mark";
  size?: number;
}

export function BrandMark({
  variant = "color",
  size = 40,
  className = "",
  alt = "Kirjane Labs chameleon mark",
  ...props
}: BrandMarkProps) {
  const srcMap = {
    color: "/brand/chameleon-color.png",
    white: "/brand/chameleon-white.png",
    green: "/brand/chameleon-green.png",
    mark: "/brand/kirjane-mark.png",
  };

  return (
    <img
      src={srcMap[variant]}
      alt={alt}
      width={size}
      height={size}
      loading="eager"
      decoding="async"
      className={className}
      {...props}
    />
  );
}
