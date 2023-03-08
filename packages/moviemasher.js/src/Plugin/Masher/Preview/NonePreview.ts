import { Clips } from "../../../Media/Mash/Track/Clip/Clip"
import { PreviewClass } from "./PreviewClass"

export class NonePreview extends PreviewClass {
  protected get clips(): Clips { return [] }
}