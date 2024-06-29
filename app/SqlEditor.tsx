import { Editor, EditorProps } from "@monaco-editor/react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import React from "react";

export interface SqlEditorProps extends Omit<EditorProps, 'onChange'> {
  onChange: (code: string) => void
}

export function SqlEditor({onChange, ...props}: SqlEditorProps) {
  return <Editor
    onMount={(_, monaco) => {
      monaco.editor.defineTheme('default', {
        base: 'vs-dark',
        inherit: true,
        rules: [
          {
            token: 'string.sql',
            // the default FF0000 is ugly AF.
            foreground: '3D8327D6'
          }
        ],
        colors: {}
      })
      monaco.editor.setTheme('default')
    }}
    language={'sql'}
    loading={<LoadingSpinner/>}
    onChange={(e) => onChange(e ?? '')}
    options={{ fontSize: 14 }}
    {...props}
  />
}
