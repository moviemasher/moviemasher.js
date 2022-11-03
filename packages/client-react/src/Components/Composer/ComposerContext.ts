import React from 'react'
import {
  DroppingPosition, EmptyMethod, Layer, VoidMethod
} from '@moviemasher/moviemasher.js'

import { DragType } from '../../Helpers/DragDrop'

export interface ComposerContextInterface {
  selectedLayer?: Layer
  compose: (layer: Layer, frame: number, frames: number) => void
  refresh: VoidMethod
  validDragType: (dataTransfer?: DataTransfer | null) => DragType | undefined
  droppingPosition: DroppingPosition | number
  setDroppingPosition: (_: DroppingPosition | number) => void
  droppingLayer?: Layer
  setDroppingLayer: (_?: Layer) => void
  onDrop: (event: DragEvent) => void
  onDragLeave: VoidMethod
}

export const ComposerContextDefault: ComposerContextInterface = {
  compose: EmptyMethod,
  refresh: EmptyMethod,
  validDragType: () => { return undefined },
  droppingPosition: DroppingPosition.None,
  setDroppingPosition: EmptyMethod,
  onDrop: EmptyMethod,
  setDroppingLayer: EmptyMethod,
  onDragLeave: EmptyMethod,
}

export const ComposerContext = React.createContext(ComposerContextDefault)
