import React from 'react'
import { 
  Definition, Editor, EditorIndex, EmptyMethod 
} from '@moviemasher/moviemasher.js'

import { Draggable } from '../../Helpers/DragDrop'
import { ThemeIcons } from '../../declarations'

export interface MasherContextInterface {
  changeDefinition: (definition?: Definition) => void
  definition?: Definition 
  draggable?: Draggable
  drop: (draggable: Draggable, editorIndex?: EditorIndex) => Promise<Definition[]>
  editor?: Editor
  editorIndex: EditorIndex
  icons: ThemeIcons
  save: () => void
  setDraggable(draggable?: Draggable): void
}

export const MasherContextDefault: MasherContextInterface = {
  changeDefinition: EmptyMethod,
  drop: () => Promise.resolve([]),
  editorIndex: {},
  icons: {},
  save: EmptyMethod,
  setDraggable: EmptyMethod,
}

export const MasherContext = React.createContext(MasherContextDefault)
