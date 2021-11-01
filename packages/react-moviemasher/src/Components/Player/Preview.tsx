import React from 'react'
import { UnknownObject } from '@moviemasher/moviemasher.js'
import { EditorContext } from '../Editor/EditorContext'
import { CanvasView } from '../../Utilities/CanvasView'

const Preview : React.FunctionComponent<UnknownObject> = (props) => {
  const context = React.useContext(EditorContext)
  const canvasProps : UnknownObject = {
    key: 'preview',
    ...props,
  }
  if (context.previewReference) canvasProps.ref = context.previewReference
  return <CanvasView { ...canvasProps } />
}

export { Preview }
