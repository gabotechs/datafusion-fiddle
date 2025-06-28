/// <reference types="vite/client" />

declare module '*?worker' {
  const workerConstructor: {
    new (): Worker
  }
  export default workerConstructor
}

declare module '*?worker&inline' {
  const workerConstructor: {
    new (): Worker
  }
  export default workerConstructor
}

declare module "monaco-vim" {
  export interface EditorVimMode {
    dispose: () => void;
    state?: {
      vim?: {
        insertMode?: boolean
      }
    }
  }

  type initVimModeFn = (
    editor: monaco.editor.IStandaloneCodeEditor,
    statusElm?: HTMLElement
  ) => EditorVimMode;

  const initVimMode: initVimModeFn;
  export { initVimMode };

  const VimMode: {
    Vim: {
      noremap: (from: string, to: string) => void;
      map: (from: string, to: string, mode: string) => void;
      exitInsertMode: (vim: EditorVimMode) => void;
    };
  };
  export { VimMode };
}