import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    {
      category: 'Execution',
      items: [
        { keys: 'Ctrl/Cmd + Enter', description: 'Execute SQL statements' },
      ]
    },
    {
      category: 'Navigation',
      items: [
        { keys: 'Ctrl + L', description: 'Focus right editor (from left editor)' },
        { keys: 'Ctrl + H', description: 'Focus left editor (from right editor)' },
      ]
    }
  ];

  return (
    <div 
      className="fixed inset-0 bg-[#00000088] flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-primary-surface rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-600">
          <h2 className="text-xl font-semibold text-text-primary">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="text-text-primary hover:text-gray-300 focus:outline-none"
          >
            <FiX size={24} />
          </button>
        </div>
        
        <div className="p-6">
          {shortcuts.map((category) => (
            <div key={category.category} className="mb-6 last:mb-0">
              <h3 className="text-lg font-medium text-text-primary mb-3">
                {category.category}
              </h3>
              <div className="space-y-2">
                {category.items.map((shortcut, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <span className="text-text-secondary">{shortcut.description}</span>
                    <kbd className="bg-gray-700 text-white px-2 py-1 rounded text-sm font-mono">
                      {shortcut.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="px-6 pb-6">
          <p className="text-sm text-text-secondary">
            Press <kbd className="bg-gray-700 text-white px-1 py-0.5 rounded text-xs">Esc</kbd> to close this dialog
          </p>
        </div>
      </div>
    </div>
  );
}