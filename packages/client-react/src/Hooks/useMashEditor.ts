import { MashEditor, MashEditorClass } from "@moviemasher/moviemasher.js"

import { useEditor } from "./useEditor"

const useMashEditor = (): MashEditor => {
  const editor = useEditor()
  if (!(editor instanceof MashEditorClass)) throw editor.constructor.name

  return editor as MashEditor
}

export { useMashEditor }
