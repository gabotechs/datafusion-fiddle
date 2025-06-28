import React, { HTMLProps } from "react";

export interface VimButtonProps extends Omit<HTMLProps<HTMLButtonElement>, 'onClick' | 'type'> {
  isVimModeEnabled: boolean;
  onToggleVim: () => void;
}

export function VimButton ({ className = '', isVimModeEnabled, onToggleVim, ...props }: VimButtonProps) {
  return (
    <button
      className={`w-8 h-8 rounded flex items-center justify-center focus:outline-none cursor-pointer ${className}`}
      onClick={onToggleVim}
      type={'button'}
      title={`${isVimModeEnabled ? 'Disable' : 'Enable'} Vim mode`}
      {...props}
    >
      <img
        src="/vim-logo.svg"
        alt="Vim"
        className={`w-6 h-6 ${isVimModeEnabled ? '' : 'grayscale'}`}
      />
    </button>
  );
}