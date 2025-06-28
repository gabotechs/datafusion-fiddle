import React, { HTMLProps } from "react";

export interface VimButtonProps extends Omit<HTMLProps<HTMLButtonElement>, 'onClick' | 'type'> {
  size: number;
  enabled: boolean;
  toggle: () => void;
}

export function VimButton ({ className = '', size, style, enabled, toggle, ...props }: VimButtonProps) {
  return (
    <button
      className={`rounded flex items-center justify-center focus:outline-none cursor-pointer ${className}`}
      onClick={toggle}
      type={'button'}
      title={`${enabled ? 'Disable' : 'Enable'} Vim mode`}
      style={{ ...style, width: size, height: size }}
      {...props}
    >
      <img
        src="/vim-logo.svg"
        alt="Vim"
        className={`${enabled ? '' : 'grayscale'}`}
      />
    </button>
  );
}