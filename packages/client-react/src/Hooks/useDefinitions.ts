import { 
  Editor, Definitions, 
  DefinitionType} from "@moviemasher/moviemasher.js"

import { useEditorDefinitions } from "./useEditorDefinitions"
import { useApiDefinitions } from "./useApiDefinitions"

export const useDefinitions = (types: DefinitionType[] = []): [Editor, Definitions] => {
  const [editor, editorDefinitions] = useEditorDefinitions(types)
  const [_, apiDefinitions] = useApiDefinitions(types)
  const definitions = apiDefinitions.filter(apiDefinition => 
    !editorDefinitions.some(editorDefinition => editorDefinition.id === apiDefinition.id)
  )
  return [editor, [...editorDefinitions, ...definitions]]
}