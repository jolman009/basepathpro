import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline';
  children: React.ReactNode;
}

export function Button({ variant = 'default', className = '', children, ...props }: ButtonProps) {
  const baseStyles = 'px-4 py-2 rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500';
  
  const variantStyles = {
    default: 'bg-blue-600 hover:bg-blue-700 text-white',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300',
    outline: 'border border-gray-300 dark:border-gray-700 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

