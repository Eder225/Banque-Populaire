import React from 'react';

export const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="bp-gradient" x1="0" y1="48" x2="48" y2="0" gradientUnits="userSpaceOnUse">
        <stop stopColor="#003578"/>
        <stop offset="1" stopColor="#0056a4"/>
      </linearGradient>
    </defs>
    <path d="M12 0H42C45.3137 0 48 2.68629 48 6V42C48 45.3137 45.3137 48 42 48H6C2.68629 48 0 45.3137 0 42V12L12 0Z" fill="url(#bp-gradient)"/>
    <g>
      <path d="M0 24H22M11 15V33" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M28 15L40 33M40 15L28 33" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
  </svg>
);
