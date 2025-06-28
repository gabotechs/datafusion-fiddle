import React from "react";

export interface DataFusionIconProps {
  className?: string;
  style?: React.CSSProperties;
  size: number
}

export function DataFusionIcon ({ className, style, size }: DataFusionIconProps) {
  return <img
    className={className}
    style={style}
    alt={'df-logo'}
    src={'/df-logo.png'}
    width={size}
    height={size}
  />
}