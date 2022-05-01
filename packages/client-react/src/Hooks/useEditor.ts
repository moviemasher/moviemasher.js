import React from "react"
import { Editor } from "@moviemasher/moviemasher.js"
import { CasterContext } from "../Contexts/CasterContext"
import { MasherContext } from "../Contexts/MasherContext"

export const useEditor = (): Editor => {
  const casterContext = React.useContext(CasterContext)
  const masherContext = React.useContext(MasherContext)
  const { castEditor } = casterContext
  const { mashEditor } = masherContext

  if (!castEditor) {
    if (!mashEditor) throw 'no editor'
    return mashEditor
  }
  if (!mashEditor || castEditor.editingMash) return castEditor

  return mashEditor
}
