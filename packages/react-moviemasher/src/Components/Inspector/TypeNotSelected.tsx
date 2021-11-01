import React from 'react'
import { DefinitionType } from '@moviemasher/moviemasher.js'
import { EditorContext } from '../Editor/EditorContext'
interface TypeNotSelectedProps {
  type: DefinitionType | string
}
const TypeNotSelected: React.FunctionComponent<TypeNotSelectedProps> = props => {
  const editorContext = React.useContext(EditorContext)
  const { children } = props
  if (!children) return null

  const masher = editorContext.masher!
  if (masher.selected.type === DefinitionType.Mash) return null

  return <>{children}</>

}

export { TypeNotSelected }
