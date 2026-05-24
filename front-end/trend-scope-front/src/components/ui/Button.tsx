import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly children: ReactNode;
  readonly variant?: ButtonVariant;
}

export function Button({ children, className = "", variant = "secondary", ...props }: ButtonProps) {
  const variantClassName =
    variant === "primary"
      ? "button-primary"
      : variant === "ghost"
        ? "button-ghost"
        : variant === "danger"
          ? "button-danger"
          : "";

  return (
    <button className={`button ${variantClassName} ${className}`.trim()} type="button" {...props}>
      {children}
    </button>
  );
}
