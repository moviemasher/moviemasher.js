import { CastEditor, CastEditorOptions } from "./CastEditor"
import { CastEditorClass } from "./CastEditorClass"

/**
 * @category Factory
 */
export const castEditorInstance = (object: CastEditorOptions = {}): CastEditor => {
  return new CastEditorClass(object)
}
