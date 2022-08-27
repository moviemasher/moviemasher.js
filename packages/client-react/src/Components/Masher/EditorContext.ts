import React from 'react'
import { Definition, Editor, EditorIndex, EmptyMethod } from '@moviemasher/moviemasher.js'

import { Draggable } from '../../Helpers/DragDrop'


export interface EditorContextInterface {
  editorIndex: EditorIndex
  editor?: Editor
  draggable?: Draggable
  setDraggable(draggable?: Draggable): void
  save: () => void
  dropFiles: (files: FileList, editorIndex?: EditorIndex) => Promise<Definition[]>
}

export const EditorContextDefault: EditorContextInterface = {
  editorIndex: {},
  setDraggable: EmptyMethod,
  dropFiles: () => Promise.resolve([]),
  save: EmptyMethod,
}

export const EditorContext = React.createContext(EditorContextDefault)
