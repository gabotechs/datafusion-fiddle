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
import { DragHandle } from "@/components/DragHandle";
import { VimButton } from "@/components/VimButton";
import { useLocalStorage } from "@/src/useLocalStorage";

export type ApiState =
  { type: 'nothing' } |
  { type: 'loading' } |
  { type: 'error', message: string } |
  { type: 'result', result: SqlResponse }

const [initDdl = INIT_DDL, initSelect = INIT_SELECT] = getStatementsFromUrl()

export default function App () {
  const [vim, setVim] = useLocalStorage('vim-mode', false)
  const [apiState, setApiState] = useState<ApiState>({ type: 'nothing' })
  const [ddlStatement, setDdlStatement] = useLocalStorage('ddl-statement', initDdl)
  const [selectStatement, setSelectStatement] = useLocalStorage('select-statement', initSelect)

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
  const [midBarPosition, setMidBarPosition] = useState( 0);

  useSubmit(execute)

  return (
    <main className="h-screen w-full flex flex-col">
      <div className="p-1 flex flex-row justify-between items-center z-10 shadow-xl bg-primary-surface">
        <div className="px-1 flex flex-row items-center ">
          <img
            alt={'df-logo'}
            src={'/df-logo.png'}
            width={28}
            height={28}
          />
          <span className={'ml-4 text-xl text-text-primary'}> DataFusion Fiddle </span>
          <PlayButton
            className={'ml-6'}
            onClick={execute}
            loading={apiState.type === 'loading'}
          />
          <ShareButton
            className={'ml-4 text-text-primary'}
            getUrl={() => dumpStatementsIntoUrl(ddlStatement, selectStatement)}
          />
        </div>
        <div className={"flex flex-row items-center"}>
          <VimButton className={'mr-3'} isVimModeEnabled={vim} onToggleVim={() => setVim(!vim)}/>
          <a
            className={'mr-4'}
            href={'https://github.com/gabotechs/datafusion-fiddle'}
            target={'_blank'}
            rel="noopener noreferrer"
          >
            <GithubIcon/>
          </a>
          <span className={'text-sm text-text-secondary mr-4'}>DataFusion version 48.0.0</span>
        </div>
      </div>
      <div className={"flex flex-row flex-grow min-h-0"}>
        <SqlEditor
          height={'100%'}
          vim={vim}
          width={screenWidth ? (screenWidth / 2 - 2 - midBarPosition) : '50%'}
          value={ddlStatement}
          onChange={setDdlStatement}
          onSubmit={execute}
        />
        <DragHandle onDrag={delta => setMidBarPosition(prev => prev - delta)} direction="horizontal"/>
        <SqlEditor
          height={'100%'}
          vim={vim}
          autoFocus
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

