import React from 'react'
import { 
  BooleanSetter,
  Definition, Editor, EditorIndex, EmptyMethod, ScalarObject 
} from '@moviemasher/moviemasher.js'
import type { ThemeIcons } from '@moviemasher/theme-default'

import { Draggable } from '../../Helpers/DragDrop'

export interface MasherContextInterface {
  streaming: boolean
  setStreaming: BooleanSetter
  current: ScalarObject
  changeDefinition: (definition?: Definition) => void
  drop: (draggable: Draggable, editorIndex?: EditorIndex) => Promise<Definition[]>
  editor?: Editor
  editorIndex: EditorIndex
  icons: ThemeIcons
  save: () => void
}

export const MasherContextDefault: MasherContextInterface = {
  streaming: false,
  setStreaming: EmptyMethod,
  current: {},
  changeDefinition: EmptyMethod,
  drop: () => Promise.resolve([]),
  editorIndex: {},
  icons: {},
  save: EmptyMethod,
}

export const MasherContext = React.createContext(MasherContextDefault)
