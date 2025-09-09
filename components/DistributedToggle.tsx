import React from 'react';
import * as Switch from '@radix-ui/react-switch';

export interface DistributedToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function DistributedToggle({ enabled, onToggle }: DistributedToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="distributed-toggle" className="text-sm text-text-secondary">
        Distributed
      </label>
      <Switch.Root
        id="distributed-toggle"
        checked={enabled}
        onCheckedChange={onToggle}
        className="w-11 h-6 bg-secondary-surface rounded-full relative data-[state=checked]:bg-blue-500 transition-colors cursor-pointer"
      >
        <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
      </Switch.Root>
    </div>
  );
}