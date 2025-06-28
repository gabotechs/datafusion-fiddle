import React from "react";
import { EditorVimMode, initVimMode, VimMode } from 'monaco-vim'
import * as monaco from "monaco-editor";

interface VimController {
  attach: () => void;
  dispose: () => void;
}

VimMode.Vim.map('jk', '<Esc>', 'insert')

export function useVimMode ({ enabled }: {enabled: boolean}) {
  const vimAdapter = React.useRef<VimController>(null)

  React.useEffect(() => {
    if (enabled) {
      vimAdapter.current?.attach()
    } else {
      vimAdapter.current?.dispose()
    }
  }, [enabled])

  return {
    onMount: React.useCallback((editor: monaco.editor.IStandaloneCodeEditor) => {
      let vim: EditorVimMode | undefined
      let removeEskKeyWorkaround: (() => void) | undefined
      vimAdapter.current = {
        attach () {
          vim = initVimMode(editor)
          removeEskKeyWorkaround = escKeyWorkaround(editor, vim)
        },
        dispose () {
          vim?.dispose()
          removeEskKeyWorkaround?.()
        }
      }
      if (enabled) {
        vimAdapter.current.attach()
      }
    }, [])
  }
}

function escKeyWorkaround(
  editor: monaco.editor.IStandaloneCodeEditor,
  vim : EditorVimMode
) {
  function f(e: unknown) {
    if (
      typeof e === 'object' &&
      e != null &&
      // the focus must not have been lost because focusing another element.
      'relatedTarget' in e &&
      e.relatedTarget == null &&
      // not sure what this is, but when pressing Esc for blurring, this is always null.
      'sourceCapabilities' in e &&
      e.sourceCapabilities == null &&
      // the target should be the monaco text area
      'target' in e &&
      e.target instanceof Element &&
      e.target.className?.endsWith?.('monaco-mouse-cursor-text') &&
      // we must be in insert mode.
      vim.state?.vim?.insertMode === true
    ) {
      VimMode.Vim.exitInsertMode(vim);
      setTimeout(() => editor.focus(), 0)
    }
  }

  document.addEventListener("blur", f, true);
  return () => document.removeEventListener("blur", f, true);
}