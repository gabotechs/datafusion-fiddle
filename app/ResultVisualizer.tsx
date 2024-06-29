import 'react-tooltip/dist/react-tooltip.css'
import React, { HTMLProps, useState } from 'react';
import { Tooltip } from 'react-tooltip'

export interface SqlResponse {
  columns: Array<[string, string]>;
  rows: Array<Array<string>>;
}

export type ApiState =
  | { type: 'nothing' }
  | { type: 'loading' }
  | { type: 'error'; message: string }
  | { type: 'result'; result: SqlResponse };

export interface ResultVisualizerProps extends HTMLProps<HTMLDivElement> {
  state: ApiState;
}

export function ResultVisualizer({ state, className = '', ...rest }: ResultVisualizerProps) {
  const [height, setHeight] = useState(300);

  function handleResize(event: React.MouseEvent<HTMLDivElement>) {
    const startY = event.clientY;
    const startHeight = height;

    function handleMouseMove(event: MouseEvent) {
      const newHeight = startHeight - (event.clientY - startY);
      setHeight(newHeight);
    }

    function handleMouseUp() {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  function renderCellContent(content: string) {
    return content.split('\n').map((line, index, arr) => (
      <React.Fragment key={index}>
        <span data-tooltip-id="cell-tooltip" data-tooltip-content={line}>{line}</span>
        {index < arr.length - 1 && <br />}
      </React.Fragment>
    ));
  }

  if (state.type === 'nothing') return null;

  return (
    <div className={`${className} relative pt-2`} style={{ height }} {...rest}>
      <Tooltip id="cell-tooltip" delayShow={500}  />
      <div
        className="absolute top-0 left-0 right-0 h-2 bg-gray-700 cursor-row-resize"
        onMouseDown={handleResize}
      ></div>
      <div className="h-full overflow-auto">
        {state.type === 'loading' && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-400"></div>
          </div>
        )}
        {state.type === 'error' && (
          <div className="flex items-center justify-center h-full text-red-500 text-center text-xl mx-12">
            {state.message}
          </div>
        )}
        {state.type === 'result' && (
          <table className="table-fixed w-full text-white">
            <thead>
            <tr>
              {state.result.columns.map(([name, type], index) => (
                <th key={index} className="px-4 py-2 bg-gray-800 text-left whitespace-nowrap overflow-hidden text-overflow-ellipsis">
                  {name} ({type})
                </th>
              ))}
            </tr>
            </thead>
            <tbody>
            {state.result.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-2 whitespace-nowrap overflow-hidden text-overflow-ellipsis"
                  >
                    {renderCellContent(cell)}
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
