import React from 'react'
import { UnknownObject } from '@moviemasher/moviemasher.js'
import { MMContext } from '../App/MMContext'
import { CanvasView } from '../../Utilities/CanvasView'

const Preview : React.FunctionComponent<UnknownObject> = (props) => {
  const context = React.useContext(MMContext)
  const canvasProps : UnknownObject = {
    key: 'preview',
    ...props,
  }
  if (context.previewReference) canvasProps.ref = context.previewReference
  return <CanvasView { ...canvasProps } />
}

export { Preview }
