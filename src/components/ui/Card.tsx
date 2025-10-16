import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-white rounded-[var(--radius-hero)] shadow-[var(--card-shadow)] ${className}`}
    >
      {children}
    </div>
  );
}
