import { HTMLProps } from "react";
import { FaPlay } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export interface PlayButtonProps extends HTMLProps<HTMLButtonElement> {
  size: number;
  loading: boolean
}

export function PlayButton ({ className = '', size, loading, disabled, ...props }: PlayButtonProps) {
  return (
    <button
      className={`rounded flex items-center justify-center focus:outline-none cursor-pointer ${className}`}
      {...props}
      disabled={loading || disabled}
      type="button"
    >
      {
        loading
          ? <AiOutlineLoading3Quarters className="animate-spin text-text-primary" size={size} />
          : <FaPlay className="text-action-success cursor-pointer"  size={size} />
      }
    </button>
  )
}
