import { Editor, EditorProps } from "@monaco-editor/react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import React from "react";

export interface SqlEditorProps extends Omit<EditorProps, 'onChange'> {
  onChange: (code: string) => void;
  // Optional: add a handler for Cmd+Enter if needed
  onSubmit?: () => void;
}

export function SqlEditor({ onChange, onSubmit, ...props }: SqlEditorProps) {
  return (
    <Editor
      onMount={(editor, monaco) => {
        // Define and set your custom theme.
        monaco.editor.defineTheme("default", {
          base: "vs-dark",
          inherit: true,
          rules: [
            {
              token: "string.sql",
              // the default FF0000 is ugly AF.
              foreground: "3D8327D6",
            },
          ],
          colors: {},
        });
        monaco.editor.setTheme("default");

        editor.addAction({
          id: "execute-sql",
          label: "Execute SQL",
          keybindings: [
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
          ],
          run: () => {
            onSubmit?.();
          },
        });
      }}
      language="sql"
      loading={<LoadingSpinner />}
      onChange={(e) => onChange(e ?? "")}
      options={{ fontSize: 14, minimap: { enabled: false } }}
      {...props}
    />
  );
}
