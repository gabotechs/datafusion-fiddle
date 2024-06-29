import { HTMLProps } from "react";
import { ApiState } from "@/app/page";

export interface ResultVisualizerProps extends HTMLProps<HTMLDivElement> {
  state: ApiState
}

export function ResultVisualizer ({ state, className = '', ...rest }: ResultVisualizerProps) {
  if (state.type === 'nothing') return null

  return (
    <div className={`${className}`} {...rest}>
      {state.type === 'loading' && <span>Loading...</span>}
      {state.type === 'error' && <span>{state.message}</span>}
      {state.type === 'result' && <div>{JSON.stringify(state.result, undefined, 2)}</div>}
    </div>
  )
}
