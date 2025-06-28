import React from "react";
import CargoToml from '../Cargo.toml?raw'

interface DataFusionVersionProps {
  className?: string;
  style?: React.CSSProperties;
}

export function DataFusionVersion ({ className, style }: DataFusionVersionProps) {
  const versionMatch = CargoToml.match(/datafusion\s*=\s*{\s*version\s*=\s*"([^"]+)"/);
  const version = versionMatch ? versionMatch[1] : '?.?.?';

  return <span
    className={`text-sm text-text-secondary mr-4 ${className || ''}`}
    style={style}
  >
    DataFusion version {version}
  </span>
}