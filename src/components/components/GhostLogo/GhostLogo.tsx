import React from 'react';
import styles from './GhostLogo.module.css';

interface GhostLogoProps {
  size?: number;
  className?: string;
}

const GhostLogo: React.FC<GhostLogoProps> = ({ size = 32, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${styles.ghostLogo} ${className}`}
    >
      <defs>
        <linearGradient id="ghostGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9b59b6" />
          <stop offset="50%" stopColor="#8e44ad" />
          <stop offset="100%" stopColor="#663399" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Main ghost body */}
      <path 
        d="M16 2C8.268 2 2 8.268 2 16C2 20.5 4 24.5 7 27L7 30C7 30.552 7.448 31 8 31C8.552 31 9 30.552 9 30L9 27.8C11 28.6 13.5 29 16 29C18.5 29 21 28.6 23 27.8L23 30C23 30.552 23.448 31 24 31C24.552 31 25 30.552 25 30L25 27C28 24.5 30 20.5 30 16C30 8.268 23.732 2 16 2Z" 
        fill="url(#ghostGradient)" 
        filter="url(#glow)"
        opacity="0.9"
      />
      
      {/* Ghost eyes */}
      <circle cx="11" cy="14" r="2" fill="#1a1a1a"/>
      <circle cx="21" cy="14" r="2" fill="#1a1a1a"/>
      
      {/* Ghost mouth (friendly smile) */}
      <path 
        d="M12 20C12 20 14 22 16 22C18 22 20 20 20 20" 
        stroke="#1a1a1a" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        fill="none"
      />
      
      {/* Ghost bottom waves */}
      <path 
        d="M7 27C8 25 9 26 10 27C11 28 12 27 13 26C14 25 15 26 16 27C17 28 18 27 19 26C20 25 21 26 22 27C23 28 24 27 25 27" 
        stroke="#8e44ad" 
        strokeWidth="2" 
        strokeLinecap="round" 
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
};

export default GhostLogo;
