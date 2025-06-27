import React, { useState } from "react";

import { executeStatements, SqlResponse } from "./api";
import { PlayButton } from "@/components/PlayButton";
import { INIT_DDL, INIT_SELECT } from "./constants";
import { ResultVisualizer } from "./ResultVisualizer";
import { ShareButton } from "@/components/ShareButton";
import { SqlEditor } from "./SqlEditor";
import { useSubmit } from "./useSubmit";
import { GithubIcon } from "@/components/GithubIcon";
import { useScreenWidth } from "./useScreenWidth";

export type ApiState =
  { type: 'nothing' } |
  { type: 'loading' } |
  { type: 'error', message: string } |
  { type: 'result', result: SqlResponse }

const [initDdl = INIT_DDL, initSelect = INIT_SELECT] = getStatementsFromUrl()

export default function App () {
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

  const screenWidth = useScreenWidth()
  const [midBarPosition, setMidBarPosition] = useState(0);

  function handleResize (event: React.MouseEvent<HTMLDivElement>) {
    const startX = event.clientX;
    const startMidBarPosition = midBarPosition;

    function handleMouseMove (event: MouseEvent) {
      setMidBarPosition(startMidBarPosition - (event.clientX - startX));
    }

    function handleMouseUp () {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  useSubmit(execute)

  return (
    <main className="h-screen w-full flex flex-col">
      <div className="p-2 flex flex-row justify-between items-center">
        <div className="p-2 flex flex-row items-center">
          <img
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
        <div className={"flex flex-row items-center"}>
          <a
            className={'mr-4'}
            href={'https://github.com/gabotechs/datafusion-fiddle'}
            target={'_blank'}
            rel="noopener noreferrer"
          >
            <GithubIcon/>
          </a>
          <span className={'text-sm text-gray-500 mr-4'}>DataFusion version 48.0.0</span>
        </div>
      </div>
      <div className={"flex flex-row flex-grow min-h-0"}>
        <SqlEditor
          height={'100%'}
          width={screenWidth ? (screenWidth / 2 - 2 - midBarPosition) : '50%'}
          value={ddlStatement}
          onChange={setDdlStatement}
          onSubmit={execute}
        />
        <div
          className="h-full w-2 bg-gray-700 cursor-col-resize"
          onMouseDown={handleResize}
        />
        <SqlEditor
          height={'100%'}
          width={screenWidth ? (screenWidth / 2 - 2 + midBarPosition) : '50%'}
          value={selectStatement}
          onChange={setSelectStatement}
          onSubmit={execute}
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

