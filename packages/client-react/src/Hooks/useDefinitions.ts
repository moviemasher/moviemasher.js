import { 
  Editor, MediaArray, MediaType
} from "@moviemasher/moviemasher.js"

import { useEditorDefinitions } from "./useEditorDefinitions"
import { useApiDefinitions } from "./useApiDefinitions"

export const useDefinitions = (types: MediaType[] = []): MediaArray => {
  const editorDefinitions = useEditorDefinitions(types)
  const apiDefinitions = useApiDefinitions(types)
  const definitions = apiDefinitions.filter(apiDefinition => 
    !editorDefinitions.some(editorDefinition => editorDefinition.id === apiDefinition.id)
  )
  const combined = [...editorDefinitions, ...definitions]
  // console.log("useDefinitions", combined.length, types.join(', '))
  return combined
}