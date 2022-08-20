import React from 'react'
import { Definition, DroppingPosition, Editor, EditorIndex, EmptyMethod } from '@moviemasher/moviemasher.js'
import { Draggable } from '../Helpers/DragDrop'

export interface EditorContextInterface {
  editor?: Editor
  draggable?: Draggable
  setDraggable(draggable?: Draggable): void
  save: () => void
  dropFiles: (files: FileList, editorIndex?: EditorIndex) => Promise<Definition[]>
}

export const EditorContextDefault: EditorContextInterface = {
  setDraggable: EmptyMethod,
  dropFiles: () => Promise.resolve([]),
  save: EmptyMethod,
}

export const EditorContext = React.createContext(EditorContextDefault)
