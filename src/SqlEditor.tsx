import { LoadingSpinner } from "@/components/LoadingSpinner";
import React from "react";
import { Editor } from "@monaco-editor/react";
import { LanguageIdEnum, setupLanguageFeatures, vsPlusTheme } from 'monaco-sql-languages';

import pgWorker from 'monaco-sql-languages/esm/languages/pgsql/pgsql.worker?worker'

self.MonacoEnvironment = {
  getWorker: function () {
    return new pgWorker()
  }
};

export interface SqlEditorProps {
  height: number;
  width: number;
  value: string;
  onChange: (code: string) => void;
  // Optional: add a handler for Cmd+Enter if needed
  onSubmit?: () => void;
}

export function SqlEditor ({ onChange, onSubmit, ...props }: SqlEditorProps) {
  // Need to pass the onSubmit callback by reference, otherwise, only
  // the first onSubmit value ever passed will be captured by the onMount closure.
  const onSubmitRef = React.useRef(onSubmit)
  onSubmitRef.current = onSubmit

  return (
    <Editor
      onMount={async (editor, monaco) => {
        monaco.editor.defineTheme('sql-dark', vsPlusTheme.darkThemeData);
        monaco.editor.setTheme('sql-dark');

        setupLanguageFeatures(LanguageIdEnum.PG, {
          completionItems: {
            enable: true,
            triggerCharacters: [' ', '.'],
          }
        });

        editor.addAction({
          id: "execute-sql",
          label: "Execute SQL",
          keybindings: [
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
          ],
          run: () => {
            onSubmitRef.current?.();
          },
        });
      }}
      language={LanguageIdEnum.PG}
      loading={<LoadingSpinner/>}
      onChange={(e) => onChange(e ?? "")}
      options={{ fontSize: 14, minimap: { enabled: false } }}
      {...props}
    />
  );
}
