import { HTMLProps } from "react";

export interface PlayButtonProps extends HTMLProps<HTMLButtonElement> {
  loading: boolean
}

export function PlayButton ({ className = '', loading, disabled, ...props }: PlayButtonProps) {
  return (
    <button
      className={`w-12 h-12 bg-green-500 hover:bg-green-600 rounded flex items-center justify-center focus:outline-none ${className}`}
      {...props}
      disabled={loading || disabled}
      type="button"
    >
      {
        loading
          ? <svg
            className="w-6 h-6 text-white animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          : <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              className="opacity-75"
              fill="currentColor"
              d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"
            />
          </svg>
      }
    </button>
  )
}
