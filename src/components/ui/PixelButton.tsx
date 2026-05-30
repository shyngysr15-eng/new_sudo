'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PixelButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  pulse?: boolean;
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  children,
  variant = 'primary',
  pulse = false,
  className = '',
  ...props
}) => {
  const bgColors = {
    primary: 'bg-[#DFD3C3] text-neutral-800 border-[#8D7B68] active:bg-[#C7B198]',
    secondary: 'bg-[#E8F4F8] text-[#3A6B7E] border-[#A9C7D3] active:bg-[#D0E2EB]',
    accent: 'bg-[#FFD369] text-neutral-900 border-[#D4A325] active:bg-[#E6BE53]',
    danger: 'bg-[#FF8B8B] text-neutral-900 border-[#D15F5F] active:bg-[#E57676]',
  };

  const shadowColors = {
    primary: 'bg-[#8D7B68]',
    secondary: 'bg-[#A9C7D3]',
    accent: 'bg-[#D4A325]',
    danger: 'bg-[#D15F5F]',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      animate={pulse ? {
        scale: [1, 1.03, 1],
        boxShadow: [
          '0px 4px 0px 0px rgba(0,0,0,0.15)',
          '0px 6px 12px 0px rgba(0,0,0,0.1)',
          '0px 4px 0px 0px rgba(0,0,0,0.15)'
        ]
      } : {}}
      transition={pulse ? {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      } : undefined}
      className={`
        relative px-6 py-3 font-mono font-bold uppercase tracking-wider
        border-2 border-neutral-900 rounded-lg cursor-pointer
        shadow-[0_4px_0_0_#171717]
        active:translate-y-[2px] active:shadow-[0_2px_0_0_#171717]
        transition-all duration-100 select-none outline-none
        ${bgColors[variant]}
        ${className}
      `}
      style={{
        imageRendering: 'pixelated',
      }}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

export default PixelButton;
