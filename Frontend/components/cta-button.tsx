"use client";

import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  cta?: () => void;
  href?: string;
  variant?: "primary" | "secondary";
  style?: string;
};

function Button({
  children,
  cta,
  href,
  variant = "primary",
  style,
}: ButtonProps) {
  const baseStyle =
    "cursor-pointer capitalize rounded-xl hover:opacity-80 transition-all duration-300 ease-in-out";

  const btnVariant =
    variant === "primary"
      ? "bg-btn-primary text-btn-secondary"
      : variant === "secondary"
      ? "bg-btn-secondary border-[2px] border-btn-primary text-btn-primary"
      : undefined;

  const className = `${baseStyle} ${style} ${btnVariant} `;

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  if (cta) {
    return (
      <button onClick={cta} className={className}>
        {children}
      </button>
    );
  }
}

export default Button;
