import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'join';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', fullWidth, className = '', children, ...props }) => {
  let baseClass = 'rounded-md transition-colors';
  
  if (variant === 'primary') {
    baseClass += ' bg-[#4A2C00] text-[#FAF4EC] font-bold px-4 py-2 hover:bg-[#2E1A00]';
  } else if (variant === 'ghost') {
    baseClass += ' border border-[#6B3F00] text-[#C9904F] bg-transparent font-bold px-4 py-2 hover:bg-[#FAF4EC]';
  } else if (variant === 'join') {
    baseClass += ' bg-[#6B3F00] text-[#FAF4EC] text-xs font-bold px-3 py-1';
  }

  if (fullWidth) {
    baseClass += ' w-full';
  }

  return (
    <button className={`${baseClass} ${className}`} {...props}>
      {children}
    </button>
  );
};