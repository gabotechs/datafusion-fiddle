import { useState } from "react";
import * as monaco from 'monaco-editor'
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { ApiRequest, useApi } from "./useApi";
import { PlayButton } from "@/components/PlayButton";
import { INIT_SELECT } from "./constants";
import { ResultVisualizer } from "./ResultVisualizer";
import { ShareButton } from "@/components/ShareButton";
import { SqlEditor } from "./SqlEditor";
import { VimButton } from "@/components/VimButton";
import { useLocalStorage } from "@/src/useLocalStorage";
import { DataFusionVersion } from "@/components/DataFusionVersion";
import { GithubLink } from "@/components/GithubLink";
import { DataFusionIcon } from "@/components/DataFusionIcon";
import { ShortcutsButton } from "@/components/ShortcutsButton";
import { useShortcuts } from "@/src/useShortcuts";
import { TablesExplorer } from "@/src/TablesExplorer";

const URL_REQ = getReqFromUrl()

export default function App () {
  const [vim, setVim] = useLocalStorage('vim-mode', false)
  const api = useApi()
  const [req, setReq] = useLocalStorage<ApiRequest>('last-request', {
    statement: INIT_SELECT,
  }, URL_REQ)

  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor>()

  useShortcuts(editor, [
    [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => api.execute(req)],
    [monaco.KeyMod.WinCtrl | monaco.KeyCode.KeyH, () => editor?.focus()],
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
            onClick={() => api.execute(req)}
            loading={api.state.type === 'loading'}
          />
          <ShareButton
            size={HEADER_ICON_SIZE}
            getUrl={() => dumpStatementsIntoUrl(req)}
          />
        </div>
        <div className={"px-4 flex flex-row items-center gap-4"}>
          <ShortcutsButton size={HEADER_ICON_SIZE}/>
          <VimButton size={HEADER_ICON_SIZE} enabled={vim} toggle={() => setVim(!vim)}/>
          <GithubLink size={HEADER_ICON_SIZE}/>
          <DataFusionVersion/>
        </div>
      </div>

      <PanelGroup direction="vertical" className="flex-grow" autoSaveId="main-layout">
        <Panel defaultSize={api.state.type === 'nothing' ? 100 : 70} minSize={5}>
          <PanelGroup direction="horizontal" autoSaveId="editor-layout">
            <Panel defaultSize={25} minSize={15} maxSize={50}>
              <TablesExplorer className="h-full overflow-auto"/>
            </Panel>
            <PanelResizeHandle className="w-1.5 bg-secondary-surface hover:bg-blue-900 cursor-col-resize"/>
            <Panel defaultSize={75} minSize={50}>
              <SqlEditor
                height={'100%'}
                vim={vim}
                width={'100%'}
                value={req.statement}
                onMount={v => {
                  v.focus()
                  setEditor(v)
                }}
                onChange={(statement) => setReq(prev => ({ ...prev, statement }))}
                onSubmit={() => api.execute(req)}
              />
            </Panel>
          </PanelGroup>
        </Panel>
        {api.state.type !== 'nothing' && (
          <>
            <PanelResizeHandle className="h-1.5 w-full bg-secondary-surface hover:bg-blue-900 cursor-row-resize"/>
            <Panel defaultSize={40} minSize={10} maxSize={95}>
              <ResultVisualizer
                className="overflow-auto h-full"
                state={api.state}
              />
            </Panel>
          </>
        )}
      </PanelGroup>
    </main>
  );
}

function dumpStatementsIntoUrl (req: ApiRequest): string {
  const q = btoa(JSON.stringify(req))
  return window.location.origin + `?q=${q}`
}

function getReqFromUrl (): ApiRequest | undefined {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const q = urlParams.get('q')
    if (q == null) return
    const parsed = JSON.parse(atob(q))
    if (
      'statement' in parsed &&
      typeof parsed.statement === 'string'
    ) {
      return {
        statement: parsed.statement,
      }
    }
  } catch (error) {
    // this is fine
  }
  return
}

