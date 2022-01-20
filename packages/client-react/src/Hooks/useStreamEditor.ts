import { StreamEditor, StreamEditorClass } from "@moviemasher/moviemasher.js"

import { useEditor } from "./useEditor"

const useStreamEditor = (): StreamEditor => {
  const editor = useEditor()
  if (!(editor instanceof StreamEditorClass)) throw editor.constructor.name

  return editor as StreamEditor
}

export { useStreamEditor }
