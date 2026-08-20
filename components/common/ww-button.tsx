import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "ghost" | "soft" | "outline";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`ww-button ww-${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
