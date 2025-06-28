import React, { HTMLProps, useState } from 'react';
import { FiShare2, FiCheck } from 'react-icons/fi';
import './ShareButton.css'

interface ShareButtonProps extends Omit<HTMLProps<HTMLDivElement>, 'onClick'> {
  size: number
  getUrl: () => string;
}

export const ShareButton: React.FC<ShareButtonProps> = (
  {
    getUrl,
    size,
    style,
    className = '',
    ...props
  }: ShareButtonProps) => {
  const [showFeedback, setShowFeedback] = useState(false)

  function handleClick () {
    const url = getUrl();
    navigator.clipboard.writeText(url).then(
      () => {
        setShowFeedback(true)
        setTimeout(() => setShowFeedback(false), 2000)
      },
      (err) => console.error('Failed to copy URL:', err)
    )
  }

  return (
    <div className={`relative inline-block text-text-primary ${className}`}
         style={{ ...style, width: size, height: size }} {...props}>
      <button
        className="focus:outline-none cursor-pointer"
        onClick={handleClick}
        type="button"
      >
        {showFeedback ? (
          <FiCheck className="h-6 w-6" />
        ) : (
          <FiShare2 className="h-6 w-6 cursor-pointer" />
        )}
      </button>
      {showFeedback && (
        <div
          className="absolute top-full z-10 left-1/2 transform -translate-x-1 mt-2 bg-gray-800 text-white px-2 py-1 rounded w-[180px] opacity-0 animate-fade-out">
          Copied to clipboard!
        </div>
      )}
    </div>
  );
};
