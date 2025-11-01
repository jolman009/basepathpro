import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`rounded-2xl border bg-white dark:bg-gray-800 p-6 ${className}`} {...props} />
  )
);
Card.displayName = 'Card';

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => (
  <div className={className} {...props}>{children}</div>
);