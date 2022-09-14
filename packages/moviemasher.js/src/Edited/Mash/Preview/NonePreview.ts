import { Clips } from "../Track/Clip/Clip"
import { PreviewClass } from "./PreviewClass"

export class NonePreview extends PreviewClass {
  protected get clips(): Clips { return [] }
}