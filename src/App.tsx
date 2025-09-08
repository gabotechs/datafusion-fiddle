import { useState } from "react";
import * as monaco from 'monaco-editor'

import { useApi } from "./useApi";
import { PlayButton } from "@/components/PlayButton";
import { INIT_DDL, INIT_SELECT } from "./constants";
import { ResultVisualizer } from "./ResultVisualizer";
import { ShareButton } from "@/components/ShareButton";
import { SqlEditor } from "./SqlEditor";
import { useScreenWidth } from "./useScreenWidth";
import { DragHandle } from "@/components/DragHandle";
import { VimButton } from "@/components/VimButton";
import { useLocalStorage } from "@/src/useLocalStorage";
import { DataFusionVersion } from "@/components/DataFusionVersion";
import { GithubLink } from "@/components/GithubLink";
import { DataFusionIcon } from "@/components/DataFusionIcon";
import { ShortcutsButton } from "@/components/ShortcutsButton";
import { useShortcuts } from "@/src/useShortcuts";


const [initDdl = INIT_DDL, initSelect = INIT_SELECT] = getStatementsFromUrl()

export default function App () {
  const [vim, setVim] = useLocalStorage('vim-mode', false)
  const { apiState, execute } = useApi()
  const [ddlStatement, setDdlStatement] = useLocalStorage('ddl-statement', initDdl)
  const [selectStatement, setSelectStatement] = useLocalStorage('select-statement', initSelect)

  const screenWidth = useScreenWidth()
  const [midBarPosition, setMidBarPosition] = useLocalStorage('mid-bar-position', 0);

  const [leftEditor, setLeftEditor] = useState<monaco.editor.IStandaloneCodeEditor>()
  const [rightEditor, setRightEditor] = useState<monaco.editor.IStandaloneCodeEditor>()

  useShortcuts(leftEditor, [
    [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, execute],
    [monaco.KeyMod.WinCtrl | monaco.KeyCode.KeyL, () => rightEditor?.focus()],
  ])

  useShortcuts(rightEditor, [
    [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, execute],
    [monaco.KeyMod.WinCtrl | monaco.KeyCode.KeyH, () => leftEditor?.focus()],
  ])

  const HEADER_ICON_SIZE = 24

  return (
    <main className="h-screen w-full flex flex-col">
      <div className="py-2 flex flex-row justify-between items-center z-10 shadow-xl bg-primary-surface">
        <div className="px-4 flex flex-row items-center gap-4">
          <DataFusionIcon size={28}/>
          <span className={'text-xl text-text-primary'}> DataFusion Fiddle </span>
          <PlayButton
            className={'ml-1'} // ml-1, otherwise it seems too close to the text
            size={HEADER_ICON_SIZE - 2} // -2, otherwise it seems too big
            onClick={() => execute(ddlStatement, selectStatement)}
            loading={apiState.type === 'loading'}
          />
          <ShareButton
            size={HEADER_ICON_SIZE}
            getUrl={() => dumpStatementsIntoUrl(ddlStatement, selectStatement)}
          />
        </div>
        <div className={"px-4 flex flex-row items-center gap-4"}>
          <ShortcutsButton size={HEADER_ICON_SIZE}/>
          <VimButton size={HEADER_ICON_SIZE} enabled={vim} toggle={() => setVim(!vim)}/>
          <GithubLink size={HEADER_ICON_SIZE}/>
          <DataFusionVersion/>
        </div>
      </div>
      <div className={"flex flex-row flex-grow min-h-0"}>
        <SqlEditor
          height={'100%'}
          vim={vim}
          width={screenWidth ? (screenWidth / 2 - 2 - midBarPosition) : '50%'}
          value={ddlStatement}
          onMount={setLeftEditor}
          onChange={setDdlStatement}
          onSubmit={execute}
        />
        <DragHandle onDrag={delta => setMidBarPosition(prev => prev - delta)} direction="horizontal"/>
        <SqlEditor
          height={'100%'}
          vim={vim}
          width={screenWidth ? (screenWidth / 2 - 2 + midBarPosition) : '50%'}
          value={selectStatement}
          onMount={v => {
            v.focus() // focus the right editor on mount
            setRightEditor(v)
          }}
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

