import React from "react";
import { clsx } from "clsx";

const Button = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  children,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "bg-customRed text-white hover:bg-red-700 focus:ring-red-500",
    secondary:
      "bg-secondary-200 text-secondary-900 dark:bg-secondary-800 dark:text-white hover:bg-secondary-300 dark:hover:bg-secondary-700 focus:ring-secondary-500",
    outline:
      "bg-transparent border border-secondary-300 dark:border-secondary-700 text-secondary-900 dark:text-white hover:bg-secondary-100 dark:hover:bg-secondary-800 focus:ring-secondary-500",
    ghost:
      "bg-transparent hover:bg-secondary-100 dark:hover:bg-secondary-800 text-secondary-900 dark:text-white focus:ring-secondary-500",
  };

  const sizeClasses = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3",
  };

  const widthClass = fullWidth ? "w-full" : "";

  const buttonClasses = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClass,
    className
  );

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
