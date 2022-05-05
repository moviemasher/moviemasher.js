import { Mash, MashArgs, MashObject } from "./Mash"
import { MashClass } from "./MashClass"
import { Preloader } from "../../Preloader/Preloader"
import { EditorDefinitions } from "../../Editor/EditorDefinitions"
import { EditorDefinitionsClass } from "../../Editor/EditorDefinitions/EditorDefinitionsClass"

export const mashInstance = (object: MashObject = {}, editorDefinitions?: EditorDefinitions, preloader?: Preloader): Mash => {
  const definitions = editorDefinitions || new EditorDefinitionsClass()
  const mashArgs: MashArgs = { ...object, definitions }
  const instance = new MashClass(mashArgs)
  if (preloader) instance.preloader = preloader
  return instance
}
