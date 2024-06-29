'use client'

import Image from "next/image";
import { HTMLProps, useState } from "react";
import { Editor } from "@monaco-editor/react";

import { executeStatements, SqlResponse } from "@/app/api";
import { PlayButton } from "@/components/PlayButton";
import { INIT_DDL, INIT_SELECT } from "@/app/constants";

type ApiState = { type: 'nothing' } | { type: 'loading' } | { type: 'error', message: string } | {
  type: 'result',
  result: SqlResponse
}

export default function Home () {
  const [apiState, setApiState] = useState<ApiState>({ type: 'nothing' })
  const [ddlStatement, setDdlStatement] = useState(INIT_DDL)
  const [selectStatement, setSelectStatement] = useState(INIT_SELECT)


  function execute () {
    setApiState({ type: 'loading' })
    executeStatements([
      ...ddlStatement.split(';').map(_ => _.trim()).filter(_ => _.length > 0),
      ...selectStatement.split(';').map(_ => _.trim()).filter(_ => _.length > 0),
    ])
      .then((result) => setApiState({ type: 'result', result }))
      .catch((err) => setApiState({ type: 'error', message: err.toString() }))
  }

  return (
    <main className="h-screen w-full flex flex-col">
      <div className="p-2 flex flex-row items-center">
        <Image
          className={'mr-4'}
          alt={'df-logo'}
          src={'/df-logo.png'}
          width={42}
          height={42}
        />
        <span className={'text-xl'}>
          Datafusion Fiddle
        </span>
        <PlayButton
          className={'ml-12'}
          onClick={execute}
          loading={apiState.type === 'loading'}
        />
      </div>
      <div className={"flex flex-row flex-grow min-h-0"}>
        <Editor
          height={'100%'}
          width={'50%'}
          theme={'vs-dark'}
          language={'sql'}
          value={ddlStatement}
          onChange={(e) => setDdlStatement(e ?? '')}
        />
        <Editor
          height={'100%'}
          width={'50%'}
          theme={'vs-dark'}
          language={'sql'}
          value={selectStatement}
          onChange={(e) => setSelectStatement(e ?? '')}
        />
      </div>
      <ResultVisualizer
        className={`overflow-auto p-4`}
        state={apiState}
      />
    </main>
  );
}

interface ResultVisualizerProps extends HTMLProps<HTMLDivElement> {
  state: ApiState
}

function ResultVisualizer ({ state, className = '', ...rest }: ResultVisualizerProps) {
  if (state.type === 'nothing') return null

  return (
    <div className={`${className}`} {...rest}>
      {state.type === 'loading' && <span>Loading...</span>}
      {state.type === 'error' && <span>{state.message}</span>}
      {state.type === 'result' && <div>{JSON.stringify(state.result, undefined, 2)}</div>}
    </div>
  )
}
