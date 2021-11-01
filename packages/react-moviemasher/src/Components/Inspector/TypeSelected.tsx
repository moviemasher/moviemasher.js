import React from 'react'
import { DefinitionType } from '@moviemasher/moviemasher.js'
import { EditorContext } from '../Editor/EditorContext'

interface TypeSelectedProps {
  type: DefinitionType | string
}
const TypeSelected: React.FunctionComponent<TypeSelectedProps> = props => {
  const editorContext = React.useContext(EditorContext)
  const { type, children } = props
  if (!children) return null

  const masher = editorContext.masher!
  if (masher.selected.type !== type as DefinitionType) return null

  return <>{children}</>

}

export { TypeSelected }
