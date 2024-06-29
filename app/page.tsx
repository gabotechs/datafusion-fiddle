'use client'

import Image from "next/image";
import React, { useState } from "react";
import { Editor } from "@monaco-editor/react";

import { executeStatements, SqlResponse } from "@/app/api";
import { PlayButton } from "@/components/PlayButton";
import { INIT_DDL, INIT_SELECT } from "@/app/constants";
import { ResultVisualizer } from "@/app/ResultVisualizer";
import { ShareButton } from "@/components/ShareButton";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export type ApiState =
  { type: 'nothing' } |
  { type: 'loading' } |
  { type: 'error', message: string } |
  { type: 'result', result: SqlResponse }

const [initDdl = INIT_DDL, initSelect = INIT_SELECT] = getStatementsFromUrl()

export default function Home () {
  const [apiState, setApiState] = useState<ApiState>({ type: 'nothing' })
  const [ddlStatement, setDdlStatement] = useState(initDdl)
  const [selectStatement, setSelectStatement] = useState(initSelect)

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
        <span className={'text-xl'}> DataFusion Fiddle </span>
        <PlayButton
          className={'ml-12'}
          onClick={execute}
          loading={apiState.type === 'loading'}
        />
        <ShareButton
          className={'ml-8'}
          getUrl={() => dumpStatementsIntoUrl(ddlStatement, selectStatement)}
        />
      </div>
      <div className={"flex flex-row flex-grow min-h-0"}>
        <Editor
          height={'100%'}
          width={'50%'}
          theme={'vs-dark'}
          language={'sql'}
          value={ddlStatement}
          loading={<LoadingSpinner/>}
          onChange={(e) => setDdlStatement(e ?? '')}
        />
        <Editor
          height={'100%'}
          width={'50%'}
          theme={'vs-dark'}
          language={'sql'}
          value={selectStatement}
          loading={<LoadingSpinner/>}
          onChange={(e) => setSelectStatement(e ?? '')}
        />
      </div>
      <ResultVisualizer
        className={`overflow-auto`}
        state={apiState}
      />
    </main>
  );
}

function dumpStatementsIntoUrl (ddl: string, select: string): string {
  const q = btoa(JSON.stringify({ ddl, select }))
  return window.location.origin + `?q=${q}`
}

function getStatementsFromUrl (): [string | undefined, string | undefined] {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const q = urlParams.get('q')
    if (q == null) return [undefined, undefined]
    const parsed = JSON.parse(atob(q))
    if (
      'ddl' in parsed &&
      'select' in parsed &&
      typeof parsed.ddl === 'string' &&
      typeof parsed.select === 'string'
    ) {
      return [parsed.ddl, parsed.select]
    }
  } catch (error) {
    // this is fine
  }
  return [undefined, undefined]
}

