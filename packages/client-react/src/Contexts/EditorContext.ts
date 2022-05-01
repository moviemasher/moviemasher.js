import React from 'react'
import { Editor } from '@moviemasher/moviemasher.js'
import { EditorInputs } from '../Components/Editor/EditorInputs/EditorInputs'

export interface EditorContextInterface {
  editor?: Editor
  inputs?: EditorInputs
}

export const EditorContextDefault: EditorContextInterface = {}

export const EditorContext = React.createContext(EditorContextDefault)
