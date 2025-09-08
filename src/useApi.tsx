import { useState } from 'react';
import { executeStatements, SqlResponse } from "./api";

export type ApiState =
  { type: 'nothing' } |
  { type: 'loading' } |
  { type: 'error', message: string } |
  { type: 'result', result: SqlResponse }

export function useApi () {
  const [apiState, setApiState] = useState<ApiState>({ type: 'nothing' });

  const execute = (...statements: string[]) => {
    setApiState({ type: 'loading' });
    executeStatements(
      statements.flatMap((statement) =>
        statement.split(';').map(_ => _.trim()).filter(_ => _.length > 0),
      )
    )
      .then((result) => setApiState({ type: 'result', result }))
      .catch((err) => setApiState({ type: 'error', message: err.toString() }));
  };

  return { apiState, execute };
}