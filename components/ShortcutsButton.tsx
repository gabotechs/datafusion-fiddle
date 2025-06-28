import React, { HTMLProps, useState } from 'react';
import { IoHelpCircle } from 'react-icons/io5';
import { ShortcutsModal } from './ShortcutsModal';

export interface ShortcutsButtonProps extends HTMLProps<HTMLButtonElement> {
  size: number;
}

export function ShortcutsButton({ className = '', size, style, ...props }: ShortcutsButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        className={`rounded flex items-center justify-center focus:outline-none cursor-pointer ${className}`}
        {...props}
        style={{ ...style, width: size, height: size }}
        type="button"
        onClick={() => setIsModalOpen(true)}
      >
        <IoHelpCircle className="text-text-primary cursor-pointer" size={size} />
      </button>
      
      <ShortcutsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}