import React from 'react'
import { DroppingPosition, Editor, EmptyMethod } from '@moviemasher/moviemasher.js'
import { Draggable } from '../Helpers/DragDrop'

export interface EditorContextInterface {
  frames: number
  frame: number
  editor?: Editor
  draggable?: Draggable
  droppingPositionClass(position?: DroppingPosition | number): string
  setDraggable(draggable?: Draggable): void
}

export const EditorContextDefault: EditorContextInterface = {
  frames: 0,
  frame: 0,
  setDraggable: EmptyMethod,
  droppingPositionClass: () => '',
}

export const EditorContext = React.createContext(EditorContextDefault)
