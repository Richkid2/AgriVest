'use client';

function Button({
  children,
  cta,
  variant = 'primary',
}: {
  children: React.ReactNode;
  cta: () => void;
  variant?: 'primary' | 'secondary';
}) {
  return (
    <button
      onClick={cta}
      className={`capitalize px-4 py-2 rounded-md cursor-pointer ${
        variant === 'primary'
          ? 'bg-btn-primary text-btn-secondary'
          : 'bg-btn-secondary text-btn-primary'
      }  hover:opacity-80 transition-all duration-300 ease-in-out`}
    >
      {children}
    </button>
  );
}

export default Button;
