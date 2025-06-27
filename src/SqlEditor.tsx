import { LoadingSpinner } from "@/components/LoadingSpinner";
import React, { CSSProperties } from "react";
import { Editor, loader } from "@monaco-editor/react";
import {
  EntityContextType,
  ICompletionItem,
  LanguageIdEnum,
  setupLanguageFeatures,
  vsPlusTheme
} from 'monaco-sql-languages';
import * as monaco from "monaco-editor";
import { languages } from "monaco-editor";

import pgWorker from 'monaco-sql-languages/esm/languages/pgsql/pgsql.worker?worker'

self.MonacoEnvironment = {
  getWorker: function () {
    return new pgWorker()
  }
};

// https://github.com/resetsix/react-monaco-sql-language-demo/issues/1#issuecomment-2178101800
loader.config({ monaco: monaco })

monaco.editor.defineTheme('sql-dark', vsPlusTheme.darkThemeData);
monaco.editor.setTheme('sql-dark');

const tableRe = /\bcreate\s+table\s+([a-zA-Z_][a-zA-Z0-9_]+)\b/gi
const columnRe = /^\s+([a-zA-Z_][a-zA-Z0-9_]+)\s+/gm

setupLanguageFeatures(LanguageIdEnum.PG, {
  completionItems: {
    completionService: async (_, __, ___, suggestions) => {
      if (!suggestions) {
        return [];
      }
      const { keywords, syntax } = suggestions;
      const keywordsCompletionItems: ICompletionItem[] = keywords.map((kw) => ({
        label: kw,
        kind: languages.CompletionItemKind.Keyword,
        detail: 'keyword',
        sortText: '2' + kw
      }));

      let syntaxCompletionItems: ICompletionItem[] = [];

      syntax.forEach((item) => {
        let re
        switch (item.syntaxContextType) {
          case EntityContextType.COLUMN:
            re = columnRe;
            break;
          case EntityContextType.CATALOG:
          case EntityContextType.DATABASE:
          case EntityContextType.TABLE:
            re = tableRe;
            break;
        }
        if (re) {
          const words = monaco.editor.getEditors()
            .map(v => v.getValue())
            .map(v => [...v.matchAll(re)])
            .map(v => v.map(match => match[1]).filter(Boolean))
            .flatMap(v => v)
            .filter(v => !keywords.includes(v))
            .flatMap(v => ({
              label: v,
              kind: languages.CompletionItemKind.Text,
              detail: 'word suggestion',
              sortText: '1' + v
            }))

          syntaxCompletionItems.push(...words);
        }
      });

      return [...syntaxCompletionItems, ...keywordsCompletionItems];
    }
  }
});

export interface SqlEditorProps {
  height: CSSProperties['height'];
  width: CSSProperties['width'];
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
      onMount={async (editor) => {
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
      theme={'sql-dark'}
      language={LanguageIdEnum.PG}
      loading={<LoadingSpinner/>}
      onChange={(e) => onChange(e ?? "")}
      options={{ fontSize: 14, minimap: { enabled: false } }}
      {...props}
    />
  );
}
