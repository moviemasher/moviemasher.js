import React from "react"

import { EditorContext } from "../Editor/EditorContext"

const useSelected = () => {
  const editorContext = React.useContext(EditorContext)
  return editorContext.masher!.selected
}

export { useSelected }
