import React, { FC, useContext } from 'react'
import { UnknownObject } from '@moviemasher/moviemasher.js'
import { CanvasView } from '../CanvasView'
import { AppContext } from '../AppContext'

const Preview : FC<UnknownObject> = (props) => {
  const context = useContext(AppContext)
  const canvasProps : UnknownObject = {
    key: 'preview',
    ...props,
  }
  if (context.previewReference) canvasProps.ref = context.previewReference
  return <CanvasView { ...canvasProps } />
}

export { Preview }
