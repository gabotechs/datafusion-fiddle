import 'react-tooltip/dist/react-tooltip.css'
import React, { HTMLProps, useState } from 'react';
import { Tooltip } from 'react-tooltip'
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ApiState } from "@/src/App";
import { DragHandle } from "@/components/DragHandle";

export interface ResultVisualizerProps extends HTMLProps<HTMLDivElement> {
  state: ApiState;
}

export function ResultVisualizer ({ state, className = '', ...rest }: ResultVisualizerProps) {
  const [height, setHeight] = useState(300);

  if (state.type === 'nothing') return null;

  return (
    <div className={`${className} relative pt-2`} style={{ height }} {...rest}>
      <Tooltip id="cell-tooltip" delayShow={500}/>
      <DragHandle
        className="absolute top-0 left-0 right-0"
        onDrag={delta => setHeight(prev => prev - delta)}
        direction="vertical" 
      />
      <div className="h-full overflow-auto -mt-0.5">
        {state.type === 'loading' && (
          <LoadingSpinner/>
        )}
        {state.type === 'error' && (
          <div className="flex items-center justify-center h-full text-text-error text-center text-xl mx-12">
            {state.message}
          </div>
        )}
        {state.type === 'result' && (
          <table className="table-auto w-full text-text-primary">
            <thead>
            <tr>
              {state.result.columns.map(([name, type], index) => (
                <th key={index}
                    className="px-4 py-2 bg-primary-surface text-left whitespace-nowrap overflow-hidden text-overflow-ellipsis">
                  {name} ({type})
                </th>
              ))}
            </tr>
            </thead>
            <tbody>
            {state.result.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-secondary-surface' : 'bg-primary-surface'}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-2 whitespace-nowrap overflow-hidden text-overflow-ellipsis"
                  >
                    {cell.split('\n').map((line, index, arr) => (
                      <React.Fragment key={index}>
                        <span
                          data-tooltip-id="cell-tooltip"
                          data-tooltip-content={line}
                          style={{ whiteSpace: 'pre-wrap' }}
                        >
                          {line}
                        </span>
                        {index < arr.length - 1 && <br/>}
                      </React.Fragment>
                    ))}
                  </td>
                ))}
              </tr>
            ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
