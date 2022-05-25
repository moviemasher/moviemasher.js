import React from 'react'
import {
  DroppingPosition, EmptyMethod, Layer, VoidMethod
} from '@moviemasher/moviemasher.js'

import { DragType } from '../Helpers/DragDrop'

export interface ComposerContextInterface {
  selectedLayer?: Layer
  refreshed: number
  refresh: VoidMethod
  validDragType: (dataTransfer: DataTransfer) => DragType | undefined
  droppingPosition: DroppingPosition | number
  setDroppingPosition: (_: DroppingPosition | number) => void
  droppingLayer?: Layer
  setDroppingLayer: (_?: Layer) => void
  onDrop: React.DragEventHandler
  onDragLeave: VoidMethod
}

export const ComposerContextDefault: ComposerContextInterface = {
  refreshed: 0, refresh: EmptyMethod,
  validDragType: (_: DataTransfer) => { return undefined },
  droppingPosition: DroppingPosition.None,
  setDroppingPosition: EmptyMethod,
  onDrop: EmptyMethod,
  setDroppingLayer: EmptyMethod,
  onDragLeave: EmptyMethod,
}

export const ComposerContext = React.createContext(ComposerContextDefault)
