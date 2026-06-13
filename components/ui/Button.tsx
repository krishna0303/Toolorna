"use client";

import { type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl px-6 py-3 transition-all duration-200",
  secondary:
    "border border-primary text-primary hover:bg-primary/10 font-semibold rounded-xl px-6 py-3 transition-all duration-200",
  ghost:
    "text-text-muted hover:text-text-primary font-medium rounded-xl px-4 py-2 transition-all duration-200",
};

export default function Button({
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
