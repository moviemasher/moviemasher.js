import {Clips} from '../../../Media/Mash/Track/Clip/Clip.js'
import {PreviewClass} from './PreviewClass.js'

export class NonePreview extends PreviewClass {
  protected get clips(): Clips { return [] }
}