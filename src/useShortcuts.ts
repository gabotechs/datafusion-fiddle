import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";

export function useShortcuts (
  editor: monaco.editor.IStandaloneCodeEditor | undefined,
  shortcuts: Array<[number, (() => void) | undefined]>,
) {
  const ref = useRef(shortcuts)
  ref.current = shortcuts

  useEffect(() => {
    if (!editor) return
    for (const i in ref.current) {
      editor.addAction({
        id: `shortcut ${i}`,
        label: `shortcut ${i}`,
        keybindings: [ref.current[i][0]],
        run: () => {
          ref.current[i][1]?.()
        },
      });
    }
  }, [editor])
}