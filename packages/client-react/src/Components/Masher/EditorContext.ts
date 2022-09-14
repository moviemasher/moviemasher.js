import React from 'react'
import { 
  Definition, Editor, EditorIndex, EmptyMethod 
} from '@moviemasher/moviemasher.js'

import { Draggable } from '../../Helpers/DragDrop'

export interface EditorContextInterface {
  editorIndex: EditorIndex
  editor?: Editor
  draggable?: Draggable
  definition?: Definition 
  changeDefinition: (definition?: Definition) => void
  setDraggable(draggable?: Draggable): void
  save: () => void
  drop: (draggable: Draggable, editorIndex?: EditorIndex) => Promise<Definition[]>
}

export const EditorContextDefault: EditorContextInterface = {
  editorIndex: {},
  setDraggable: EmptyMethod,
  save: EmptyMethod,
  drop: () => Promise.resolve([]),
  changeDefinition: EmptyMethod,
}

export const EditorContext = React.createContext(EditorContextDefault)
