import React from "react";

export interface DataFusionIconProps {
  className?: string;
  style?: React.CSSProperties;

}

export function DataFusionIcon ({ className, style }: DataFusionIconProps) {
  return <img
    className={className}
    style={style}
    alt={'df-logo'}
    src={'/df-logo.png'}
    width={28}
    height={28}
  />
}