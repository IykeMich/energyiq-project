import type {
  ButtonHTMLAttributes,
} from 'react';

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'destructive';
}

export function Button({
  variant = 'default',
  className = '',
  ...props
}: ButtonProps) {
  const variants = {
    default:
      'bg-[#FFB800] text-black hover:bg-[#F5A700]',
    outline:
      'border border-[#303030] bg-transparent text-white hover:bg-[#1A1A1A]',
    destructive:
      'bg-[#D92D20] text-white hover:bg-[#B42318]',
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition ${variants[variant]} ${className}`}
      {...props}
    />
  );
}