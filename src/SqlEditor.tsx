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
import { useVimMode } from "@/src/SqlEditorVimMode";

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
const columnRe = /^ +([a-zA-Z_][a-zA-Z0-9_]+)\s+/gm

setupLanguageFeatures(LanguageIdEnum.PG, {
  completionItems: {
    completionService: async (_, __, ___, suggestions) => {
      if (!suggestions) {
        return [];
      }
      const { keywords, syntax } = suggestions;
      // keyword completions are always there.
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
          // if we are suggesting for columns...
          case EntityContextType.COLUMN:
            re = columnRe;
            break;
          // ...or for tables...
          case EntityContextType.CATALOG:
          case EntityContextType.DATABASE:
          case EntityContextType.TABLE:
            re = tableRe;
            break;
        }
        if (re) {
          // do a very dummy parsing of the current active editors looking for CREATE TABLE
          // statements and/or new lines with indented identifiers looking for column names.
          const words = monaco.editor.getEditors()
            .map(v => v.getValue())
            .map(v => [...v.matchAll(re)])
            .map(v => v.map(match => match[1]).filter(Boolean))
            .flatMap(v => v)
            .flatMap(v => ({
              label: v,
              kind: languages.CompletionItemKind.Class,
              detail: item.syntaxContextType+' suggestion',
              // top priority completion.
              sortText: '1' + v
            }))

          // these gathered column/table names will be added to the completions.
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
  vim: boolean;
  value: string;
  onChange: (code: string) => void;
  // Optional: add a handler for Cmd+Enter if needed
  onSubmit?: () => void;
}

export function SqlEditor ({ onChange, onSubmit, vim, ...props }: SqlEditorProps) {
  // Need to pass the onSubmit callback by reference, otherwise, only
  // the first onSubmit value ever passed will be captured by the onMount closure.
  const onSubmitRef = React.useRef(onSubmit)
  onSubmitRef.current = onSubmit

  const { onMount } = useVimMode({ enabled: vim });

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
        onMount(editor)
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
