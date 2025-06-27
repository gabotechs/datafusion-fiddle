import React, { HTMLProps, useState } from "react";

export interface DragHandleProps extends Omit<HTMLProps<HTMLDivElement>, 'onMouseDown' | 'onDrag'> {
  onDrag: (delta: number) => void;
  direction?: 'horizontal' | 'vertical';
}

export function DragHandle({ onDrag, direction = 'horizontal', className = '', ...props }: DragHandleProps) {
  const [isDragging, setIsDragging] = useState(false);

  function handleMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    setIsDragging(true);
    let lastPos = direction === 'horizontal' ? event.clientX : event.clientY;
    
    function handleMouseMove(moveEvent: MouseEvent) {
      const currentPos = direction === 'horizontal' ? moveEvent.clientX : moveEvent.clientY;
      const delta = currentPos - lastPos;
      lastPos = currentPos;
      onDrag(delta);
    }
    
    function handleMouseUp() {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  const directionClasses = direction === 'horizontal' 
    ? 'h-full w-1.5 cursor-col-resize' 
    : 'w-full h-1.5 cursor-row-resize';

  return (
    <div
      className={`${directionClasses} hover:bg-blue-900 ${isDragging ? 'bg-blue-900' : 'bg-secondary-surface'} ${className}`}
      onMouseDown={handleMouseDown}
      {...props}
    />
  );
}