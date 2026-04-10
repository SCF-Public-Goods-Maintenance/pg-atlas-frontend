import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-500 text-white shadow-sm shadow-primary-500/25 hover:bg-primary-600 focus-visible:ring-primary-500/40",
  secondary:
    "bg-gray-100 text-surface-dark hover:bg-gray-200 focus-visible:ring-gray-400/40 dark:bg-white/10 dark:text-white dark:hover:bg-white/15 dark:focus-visible:ring-white/20",
  ghost:
    "bg-transparent text-surface-dark/70 hover:bg-gray-100 focus-visible:ring-gray-400/40 dark:text-white/70 dark:hover:bg-white/10 dark:focus-visible:ring-white/20",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-xs gap-1.5",
  md: "px-5 py-2.5 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2.5",
};

const baseStyles =
  "inline-flex items-center justify-center rounded-full font-semibold transition-colors focus:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50";

type ButtonAsButton = {
  as?: "button";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonAsSpan = {
  as: "span";
} & React.HTMLAttributes<HTMLSpanElement>;

type ButtonProps = (ButtonAsButton | ButtonAsSpan) & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
};

export default function Button({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  children,
  className = "",
  as = "button",
  ...props
}: ButtonProps) {
  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
  const content = (
    <>
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </>
  );

  if (as === "span") {
    return (
      <span
        role="button"
        tabIndex={0}
        className={classes}
        {...(props as React.HTMLAttributes<HTMLSpanElement>)}
      >
        {content}
      </span>
    );
  }

  return (
    <button
      className={classes}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}
