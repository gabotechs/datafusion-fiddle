import React, { HTMLProps, useState } from 'react';
import './ShareButton.css'

interface ShareButtonProps extends Omit<HTMLProps<HTMLButtonElement>, 'onClick'> {
  getUrl: () => string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ getUrl, ...props }: ShareButtonProps) => {
  const [showFeedback, setShowFeedback] = useState(false);

  function handleClick() {
    const url = getUrl();
    navigator.clipboard.writeText(url).then(
      () => {
        setShowFeedback(true);
        setTimeout(() => {
          setShowFeedback(false);
        }, 2000);
      },
      (err) => {
        console.error('Failed to copy URL:', err);
      }
    );
  }

  return (
    <div className="relative inline-block">
      <button
        className="focus:outline-none"
        onClick={handleClick}
        {...props}
        type="button"
      >
        {showFeedback ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        )}
      </button>
      {showFeedback && (
        <div className="absolute top-full z-10 left-1/2 transform -translate-x-1 mt-2 bg-gray-800 text-white px-2 py-1 rounded w-[180px] opacity-0 animate-fade-out">
          Copied to clipboard!
        </div>
      )}
    </div>
  );
};
