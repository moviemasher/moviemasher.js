import { 
  Editor, Medias, 
  MediaDefinitionType} from "@moviemasher/moviemasher.js"

import { useEditorDefinitions } from "./useEditorDefinitions"
import { useApiDefinitions } from "./useApiDefinitions"

export const useDefinitions = (types: MediaDefinitionType[] = []): [Editor, Medias] => {
  const [editor, editorDefinitions] = useEditorDefinitions(types)
  const [_, apiDefinitions] = useApiDefinitions(types)
  const definitions = apiDefinitions.filter(apiDefinition => 
    !editorDefinitions.some(editorDefinition => editorDefinition.id === apiDefinition.id)
  )
  const combined = [...editorDefinitions, ...definitions]
  // console.log("useDefinitions", combined.length, types.join(', '))
  return [editor, combined]
}