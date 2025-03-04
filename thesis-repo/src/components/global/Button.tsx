import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'whitePurple';
  size?: 'small' | 'medium' | 'large';
  icon?: LucideIcon;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'solid',
  size = 'medium',
  icon: Icon,
  children,
  className,
  ...props
}) => {
  const baseClasses =
    'font-medium rounded-full focus:outline-none focus:ring-4 inline-flex items-center justify-center';

  const variantClasses = {
    solid:
        'text-white bg-purple-700 hover:bg-purple-800 focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900',
    outline:
        'text-purple-700 border border-purple-700 hover:bg-purple-700 hover:text-white focus:ring-purple-300 dark:border-purple-500 dark:text-purple-500 dark:hover:bg-purple-600 dark:hover:text-white dark:focus:ring-purple-900',
    whitePurple: 
        'text-purple-700 bg-white border border-purple-700 hover:bg-purple-700 hover:text-white transition-colors duration-300 ease-in-out focus:ring-purple-300 dark:text-purple-500 dark:bg-gray-800 dark:border-purple-500 dark:hover:bg-purple-600 dark:hover:text-white dark:focus:ring-purple-900',
  };

  const sizeClasses = {
    small: 'text-sm px-3 py-1.5',
    medium: 'text-sm px-5 py-2.5',
    large: 'text-base px-7 py-3',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="mr-2 w-5 h-5" />}
      {children}
    </button>
  );
};

export default Button;

//🍓