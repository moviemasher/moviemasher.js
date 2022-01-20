import React from "react"
import { Editor } from "@moviemasher/moviemasher.js"
import { EditorContext } from "../Contexts/EditorContext"

const useEditor = (): Editor => {
  const editorContext = React.useContext(EditorContext)
  const { editor } = editorContext
  if (!editor) throw 'editor'

  return editor
}

export { useEditor }
